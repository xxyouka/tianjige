const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const faceReadingPrompt = require('../prompts/faceReading')
const { sanitizeText } = require('../services/validate')

router.post('/analyze', async (req, res) => {
  try {
    const { faceType, forehead, eyebrows, eyes, nose, mouth, ears, molePosition, additional: rawAdditional } = req.body

    if (!faceType || !forehead || !eyebrows || !eyes || !nose || !mouth || !ears) {
      return res.status(400).json({ error: '请选择面型和五官特征' })
    }

    const data = {
      faceType: sanitizeText(faceType, 50),
      forehead: sanitizeText(forehead, 50),
      eyebrows: sanitizeText(eyebrows, 50),
      eyes: sanitizeText(eyes, 50),
      nose: sanitizeText(nose, 50),
      mouth: sanitizeText(mouth, 50),
      ears: sanitizeText(ears, 50),
      molePosition: sanitizeText(molePosition, 100),
      additional: sanitizeText(rawAdditional)
    }

    const userMessage = faceReadingPrompt.buildUserMessage(data)
    const interpretation = await askAI(faceReadingPrompt.system, userMessage)

    res.json({
      data,
      interpretation
    })
  } catch (err) {
    console.error('面相分析错误:', err)
    res.status(500).json({ error: '分析出错，请稍后重试' })
  }
})

module.exports = router
