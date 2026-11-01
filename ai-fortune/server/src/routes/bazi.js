const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const baziPrompt = require('../prompts/bazi')
const { calculateBazi } = require('../services/bazi')
const { validateDate, validateHour } = require('../services/validate')

router.post('/calculate', async (req, res) => {
  try {
    const { year, month, day, hour, gender = 'male' } = req.body

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

    const userMessage = baziPrompt.buildUserMessage(baziData)
    const interpretation = await askAI(baziPrompt.system, userMessage)

    res.json({
      data: baziData,
      interpretation
    })
  } catch (err) {
    console.error('八字计算错误:', err)
    res.status(500).json({ error: '计算出错，请稍后重试' })
  }
})

module.exports = router
