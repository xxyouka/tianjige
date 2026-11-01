const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const { calculateBazi } = require('../services/bazi')
const { generateHexagram } = require('../services/zhouyi')
const { drawCards } = require('../services/tarot')
const { SHENG_XIAO, WU_XING_MAP, getDailyGanZhi, getZodiacSign } = require('../services/constants')
const { sanitizeText, validateDate, validateHour } = require('../services/validate')

// 复用已有 prompt 文件
const baziPrompt = require('../prompts/bazi')
const zhouyiPrompt = require('../prompts/zhouyi')
const xingzuoPrompt = require('../prompts/xingzuo')
const tarotPrompt = require('../prompts/tarot')
const ziweiPrompt = require('../prompts/ziwei')
const comprehensivePrompt = require('../prompts/comprehensive')
const dailyPrompt = require('../prompts/daily')
const chenguPrompt = require('../prompts/chengu')
const xingmingPrompt = require('../prompts/xingming')
const ceziPrompt = require('../prompts/cezi')
const meihuaPrompt = require('../prompts/meihua')

const prompts = {
  bazi: { system: baziPrompt.system, build: baziPrompt.buildUserMessage },
  zhouyi: { system: zhouyiPrompt.system, build: zhouyiPrompt.buildUserMessage },
  xingzuo: { system: xingzuoPrompt.system, build: xingzuoPrompt.buildUserMessage },
  tarot: { system: tarotPrompt.system, build: tarotPrompt.buildUserMessage },
  ziwei: { system: ziweiPrompt.system, build: ziweiPrompt.buildUserMessage },
  comprehensive: { system: comprehensivePrompt.system, build: comprehensivePrompt.buildUserMessage },
  daily: { system: dailyPrompt.system, build: dailyPrompt.buildUserMessage },
  chengu: {
    system: chenguPrompt.system,
    build: (data) => chenguPrompt.buildUserMessage({ boneData: { weight: data.boneWeight || '—', level: data.boneLevel || '—', comment: data.boneComment || '' } })
  },
  xingming: { system: xingmingPrompt.system, build: (data) => xingmingPrompt.buildUserMessage({ name: data.name, gender: data.gender }) },
  cezi: { system: ceziPrompt.system, build: (data) => ceziPrompt.buildUserMessage({ character: data.cezi || '运' }) },
  meihua: { system: meihuaPrompt.system, build: (data) => meihuaPrompt.buildUserMessage({ question: data.question || '' }) }
}


// 单次 AI 调用，带错误处理
async function safeAskAI(promptKey, data) {
  try {
    const prompt = prompts[promptKey]
    const message = prompt.build(data)
    const result = await askAI(prompt.system, message)
    return { success: true, result }
  } catch (err) {
    console.error(`${promptKey} error:`, err.message)
    return { success: false, error: err.message }
  }
}

// 分批并发执行，避免同时发起过多 AI 请求
async function batchExecute(tasks, batchSize = 4) {
  const results = []
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(batch.map(fn => fn()))
    results.push(...batchResults.map(r =>
      r.status === 'fulfilled' ? r.value : { success: false, error: '调用失败' }
    ))
  }
  return results
}

router.post('/calculate', async (req, res) => {
  try {
    const { year, month, day, hour, name: rawName, gender = 'male' } = req.body

    if (!year || !month || !day || hour === undefined) {
      return res.status(400).json({ error: '请填写完整的出生信息' })
    }

    const y = parseInt(year)
    const m = parseInt(month)
    const d = parseInt(day)
    const h = parseInt(hour)
    const name = sanitizeText(rawName, 20)

    const dateErr = validateDate(y, m, d)
    if (dateErr) return res.status(400).json({ error: dateErr })
    const hourErr = validateHour(h)
    if (hourErr) return res.status(400).json({ error: hourErr })

    const birthData = {
      year: y,
      month: m,
      day: d,
      hour: h,
      name: name || '未提供',
      gender,
      sign: getZodiacSign(m, d)
    }

    // 先算不需要 AI 的部分
    const baziData = calculateBazi(y, m, d, h, gender)
    const hexagramData = generateHexagram('random')
    const tarotCards = drawCards(3)

    // 准备综合运势数据
    const dayMaster = baziData.dayPillar[0]
    const dayWuXing = WU_XING_MAP[dayMaster] || '土'
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const currentDay = now.getDate()
    const comprehensiveData = {
      baZi: {
        year: baziData.yearPillar,
        month: baziData.monthPillar,
        day: baziData.dayPillar,
        hour: baziData.hourPillar
      },
      dayMaster,
      dayWuXing,
      gender,
      age: currentYear - y,
      shengXiao: SHENG_XIAO[(y - 4) % 12]
    }

    // 准备每日运势数据
    const ganZhi = getDailyGanZhi(currentYear, currentMonth, currentDay)
    const dailyData = {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      ganZhi: `${ganZhi.gan}${ganZhi.zhi}`,
      shengXiao: SHENG_XIAO[(y - 4) % 12]
    }

    // 分批调用 AI 解读（每批最多 4 个，避免 API 过载）
    const tasks = [
      () => safeAskAI('bazi', baziData),
      () => safeAskAI('zhouyi', hexagramData),
      () => safeAskAI('xingzuo', birthData),
      () => safeAskAI('tarot', { cards: tarotCards }),
      () => safeAskAI('ziwei', birthData),
      () => safeAskAI('chengu', birthData),
      () => safeAskAI('xingming', birthData),
      () => safeAskAI('meihua', birthData),
      () => safeAskAI('cezi', { cezi: name ? name[0] : '运' }),
      () => safeAskAI('comprehensive', comprehensiveData),
      () => safeAskAI('daily', dailyData)
    ]
    const [baziResult, zhouyiResult, xingzuoResult, tarotResult, ziweiResult, chenguResult, xingmingResult, meihuaResult, ceziResult, comprehensiveResult, dailyResult] =
      await batchExecute(tasks, 4)

    res.json({
      birthData: {
        ...birthData,
        bazi: `${baziData.yearPillar} ${baziData.monthPillar} ${baziData.dayPillar} ${baziData.hourPillar}`
      },
      results: {
        bazi: { data: baziData, ...baziResult },
        zhouyi: { data: hexagramData, ...zhouyiResult },
        xingzuo: { data: { sign: birthData.sign }, ...xingzuoResult },
        tarot: { data: { cards: tarotCards }, ...tarotResult },
        ziwei: { ...ziweiResult },
        chengu: { ...chenguResult },
        xingming: { ...xingmingResult },
        meihua: { ...meihuaResult },
        cezi: { ...ceziResult },
        comprehensive: { ...comprehensiveResult },
        daily: { ...dailyResult }
      }
    })
  } catch (err) {
    console.error('全算错误:', err)
    res.status(500).json({ error: '计算出错，请稍后重试' })
  }
})

module.exports = router
