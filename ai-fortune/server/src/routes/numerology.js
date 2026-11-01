const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const numerologyPrompt = require('../prompts/numerology')
const { validateDate } = require('../services/validate')

// 数字命理含义
const NUMBER_MEANINGS = {
  1: { name: '开创者', traits: '独立、领导力、创新、自信', element: '火' },
  2: { name: '协调者', traits: '合作、敏感、和平、直觉', element: '水' },
  3: { name: '表达者', traits: '创意、社交、乐观、灵感', element: '火' },
  4: { name: '建设者', traits: '稳定、务实、勤奋、可靠', element: '土' },
  5: { name: '探索者', traits: '自由、变化、冒险、适应力', element: '风' },
  6: { name: '照顾者', traits: '责任、关爱、和谐、完美', element: '土' },
  7: { name: '思考者', traits: '智慧、内省、分析、灵性', element: '水' },
  8: { name: '成就者', traits: '权力、财富、效率、野心', element: '土' },
  9: { name: '人道者', traits: '博爱、理想、奉献、智慧', element: '火' },
  11: { name: '直觉大师', traits: '灵性、直觉、启发、理想主义', element: '风' },
  22: { name: '建筑大师', traits: '远见、力量、实现、大格局', element: '土' },
  33: { name: '疗愈大师', traits: '慈悲、教导、牺牲、大爱', element: '水' }
}

function reduceNumber(num) {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0)
  }
  return num
}

function calculateNumerology(year, month, day) {
  // 生命灵数：出生日期所有数字相加
  const birthString = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`
  const lifePathNumber = reduceNumber(
    birthString.split('').reduce((sum, d) => sum + parseInt(d), 0)
  )

  // 成就数：年+月+日分别相加
  const yearNum = reduceNumber(String(year).split('').reduce((s, d) => s + parseInt(d), 0))
  const monthNum = reduceNumber(month)
  const dayNum = reduceNumber(day)
  const destinyNumber = reduceNumber(yearNum + monthNum + dayNum)

  // 灵魂数：元音数字（用月份代替简化）
  const soulNumber = reduceNumber(month + day)

  // 人格数：辅音数字（用年份代替简化）
  const personalityNumber = reduceNumber(year % 100)

  return {
    lifePathNumber,
    destinyNumber,
    soulNumber,
    personalityNumber,
    lifePathMeaning: NUMBER_MEANINGS[lifePathNumber],
    destinyMeaning: NUMBER_MEANINGS[destinyNumber],
    soulMeaning: NUMBER_MEANINGS[soulNumber],
    personalityMeaning: NUMBER_MEANINGS[personalityNumber]
  }
}

router.post('/calculate', async (req, res) => {
  try {
    const { year, month, day } = req.body

    if (!year || !month || !day) {
      return res.status(400).json({ error: '请填写完整的出生日期' })
    }

    const y = parseInt(year)
    const m = parseInt(month)
    const d = parseInt(day)

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return res.status(400).json({ error: '出生日期格式不正确' })
    }
    const dateErr = validateDate(y, m, d)
    if (dateErr) return res.status(400).json({ error: dateErr })

    const numerologyData = calculateNumerology(y, m, d)

    const interpretation = await askAI(
      numerologyPrompt.system,
      numerologyPrompt.buildUserMessage({ numerologyData })
    )

    res.json({
      data: numerologyData,
      interpretation
    })
  } catch (err) {
    console.error('数字命理错误:', err)
    res.status(500).json({ error: '计算出错，请稍后重试' })
  }
})

module.exports = router
