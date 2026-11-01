const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const palmistryPrompt = require('../prompts/palmistry')
const { sanitizeText } = require('../services/validate')

router.post('/analyze', async (req, res) => {
  try {
    const { handType, lifeLine, wisdomLine, heartLine, fingerType, additional: rawAdditional } = req.body

    if (!handType || !lifeLine || !wisdomLine || !heartLine) {
      return res.status(400).json({ error: '请选择手型和三大主线特征' })
    }

    const data = {
      handType: sanitizeText(handType, 50),
      lifeLine: sanitizeText(lifeLine, 50),
      wisdomLine: sanitizeText(wisdomLine, 50),
      heartLine: sanitizeText(heartLine, 50),
      fingerType: sanitizeText(fingerType, 50),
      additional: sanitizeText(rawAdditional)
    }

    const userMessage = palmistryPrompt.buildUserMessage(data)
    const interpretation = await askAI(palmistryPrompt.system, userMessage)

    res.json({
      data,
      interpretation
    })
  } catch (err) {
    console.error('手相分析错误:', err)
    res.status(500).json({ error: '分析出错，请稍后重试' })
  }
})

module.exports = router
