const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const dreamPrompt = require('../prompts/dream')
const { sanitizeText } = require('../services/validate')

router.post('/analyze', async (req, res) => {
  try {
    const { symbols, dreamTime, freeText } = req.body

    if ((!symbols || symbols.length === 0) && !freeText) {
      return res.status(400).json({ error: '请选择梦境符号或描述梦境内容' })
    }

    const data = {
      symbols: Array.isArray(symbols) ? symbols.filter(s => typeof s === 'string' && s.length <= 20).slice(0, 20) : [],
      dreamTime: sanitizeText(dreamTime, 50) || null,
      freeText: sanitizeText(freeText, 2000)
    }

    const userMessage = dreamPrompt.buildUserMessage(data)
    const interpretation = await askAI(dreamPrompt.system, userMessage)

    res.json({
      data: { symbols: data.symbols, dreamTime: data.dreamTime },
      interpretation
    })
  } catch (err) {
    console.error('梦境解析错误:', err)
    res.status(500).json({ error: '解析出错，请稍后重试' })
  }
})

module.exports = router
