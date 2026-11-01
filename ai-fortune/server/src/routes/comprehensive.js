const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const comprehensivePrompt = require('../prompts/comprehensive')
const { calculateBazi } = require('../services/bazi')
const { WU_XING_MAP, SHENG_XIAO } = require('../services/constants')
const { validateDate, validateHour } = require('../services/validate')

router.post('/analyze', async (req, res) => {
  try {
    const { year, month, day, hour, gender: rawGender = 'male' } = req.body
    const gender = ['male', 'female'].includes(rawGender) ? rawGender : 'male'

    const y = parseInt(year)
    const m = parseInt(month)
    const d = parseInt(day)
    const h = parseInt(hour)

    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h)) {
      return res.status(400).json({ error: '请提供有效的出生年月日时' })
    }
    const dateErr = validateDate(y, m, d)
    if (dateErr) return res.status(400).json({ error: dateErr })
    const hourErr = validateHour(h)
    if (hourErr) return res.status(400).json({ error: hourErr })

    const baziData = calculateBazi(y, m, d, h, gender)
    const currentYear = new Date().getFullYear()
    const age = currentYear - y
    const dayWuXing = WU_XING_MAP[baziData.dayMaster] || '土'
    const shengXiao = SHENG_XIAO[(y - 4) % 12]

    const data = {
      baZi: {
        year: baziData.yearPillar,
        month: baziData.monthPillar,
        day: baziData.dayPillar,
        hour: baziData.hourPillar
      },
      dayMaster: baziData.dayMaster,
      dayWuXing,
      gender,
      age,
      shengXiao
    }

    const userMessage = comprehensivePrompt.buildUserMessage(data)
    const interpretation = await askAI(comprehensivePrompt.system, userMessage)

    res.json({
      data,
      interpretation
    })
  } catch (err) {
    console.error('综合运势错误:', err)
    res.status(500).json({ error: '计算出错，请稍后重试' })
  }
})

module.exports = router
