const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const { drawLot } = require('../services/lingqian')
const lingqianPrompt = require('../prompts/lingqian')
const { sanitizeText } = require('../services/validate')

router.post('/draw', async (req, res) => {
  try {
    const { question: rawQuestion } = req.body
    const question = sanitizeText(rawQuestion)
    const lot = drawLot()

    const interpretation = await askAI(
      lingqianPrompt.system,
      lingqianPrompt.buildUserMessage({ lot, question })
    )

    res.json({
      data: lot,
      interpretation
    })
  } catch (err) {
    console.error('灵签错误:', err)
    res.status(500).json({ error: '求签出错，请稍后重试' })
  }
})

module.exports = router
