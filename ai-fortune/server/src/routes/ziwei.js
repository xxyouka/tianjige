const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const ziweiPrompt = require('../prompts/ziwei')
const { SHENG_XIAO } = require('../services/constants')
const { validateDate, validateHour } = require('../services/validate')

router.post('/analyze', async (req, res) => {
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

    const shengXiao = SHENG_XIAO[(y - 4) % 12]

    const data = {
      year: y,
      month: m,
      day: d,
      hour: h,
      gender,
      shengXiao
    }

    const userMessage = ziweiPrompt.buildUserMessage(data)
    const interpretation = await askAI(ziweiPrompt.system, userMessage)

    res.json({
      data,
      interpretation
    })
  } catch (err) {
    console.error('紫微斗数错误:', err)
    res.status(500).json({ error: '计算出错，请稍后重试' })
  }
})

module.exports = router
