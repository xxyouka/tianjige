const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const tarotPrompt = require('../prompts/tarot')
const { drawCards } = require('../services/tarot')
const { sanitizeText } = require('../services/validate')

const SPREADS = {
  single: { name: '单张牌', count: 1, description: '快速指引，适合简单问题' },
  three: { name: '三张牌（过去、现在、未来）', count: 3, description: '过去、现在、未来' },
  celtic: { name: '凯尔特十字', count: 10, description: '最经典的全面牌阵' }
}

router.get('/spreads', (req, res) => {
  res.json({
    spreads: Object.entries(SPREADS).map(([id, s]) => ({ id, ...s }))
  })
})

router.post('/draw', async (req, res) => {
  try {
    const { spread = 'three', question: rawQuestion } = req.body
    const question = sanitizeText(rawQuestion)

    const spreadInfo = SPREADS[spread]
    if (!spreadInfo) {
      return res.status(400).json({ error: '无效的牌阵类型' })
    }

    const cards = drawCards(spreadInfo.count)

    const userMessage = tarotPrompt.buildUserMessage({
      spread: spreadInfo.name,
      cards,
      question
    })
    const interpretation = await askAI(tarotPrompt.system, userMessage)

    res.json({
      data: { spread, cards },
      interpretation
    })
  } catch (err) {
    console.error('塔罗牌错误:', err)
    res.status(500).json({ error: '抽牌出错，请稍后重试' })
  }
})

module.exports = router
