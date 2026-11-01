const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const ceziPrompt = require('../prompts/cezi')
const { sanitizeText } = require('../services/validate')

router.post('/analyze', async (req, res) => {
  try {
    const { character, question: rawQuestion } = req.body
    const question = sanitizeText(rawQuestion)

    if (!character || character.length !== 1) {
      return res.status(400).json({ error: '请输入一个汉字' })
    }

    const interpretation = await askAI(
      ceziPrompt.system,
      ceziPrompt.buildUserMessage({ character, question })
    )

    res.json({
      data: { character },
      interpretation
    })
  } catch (err) {
    console.error('测字错误:', err)
    res.status(500).json({ error: '测字出错，请稍后重试' })
  }
})

module.exports = router
