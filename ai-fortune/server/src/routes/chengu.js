const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const { calculateBoneWeight } = require('../services/chengu')
const chenguPrompt = require('../prompts/chengu')
const { validateDate, validateHour } = require('../services/validate')

router.post('/calculate', async (req, res) => {
  try {
    const { year, month, day, hour } = req.body

    const y = parseInt(year)
    const m = parseInt(month)
    const d = parseInt(day)
    const h = parseInt(hour)

    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h)) {
      return res.status(400).json({ error: '请填写完整的出生时间' })
    }
    const dateErr = validateDate(y, m, d)
    if (dateErr) return res.status(400).json({ error: dateErr })
    const hourErr = validateHour(h)
    if (hourErr) return res.status(400).json({ error: hourErr })

    const boneData = calculateBoneWeight(y, m, d, h)

    const interpretation = await askAI(
      chenguPrompt.system,
      chenguPrompt.buildUserMessage({ boneData })
    )

    res.json({
      data: boneData,
      interpretation
    })
  } catch (err) {
    console.error('称骨错误:', err)
    res.status(500).json({ error: '计算出错，请稍后重试' })
  }
})

module.exports = router
