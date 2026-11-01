const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const meihuaPrompt = require('../prompts/meihua')
const { generateHexagram } = require('../services/zhouyi')
const { sanitizeText } = require('../services/validate')

router.post('/divine', async (req, res) => {
  try {
    const { method, question: rawQuestion, numbers } = req.body
    const question = sanitizeText(rawQuestion)

    const validMethods = ['random', 'time', 'number']
    if (method && !validMethods.includes(method)) {
      return res.status(400).json({ error: '无效的起卦方式' })
    }

    // 生成卦象（复用周易的卦象生成逻辑）
    const hexagramData = generateHexagram(method || 'random', numbers)

    // 使用梅花易数的 prompt 解读
    const userMessage = meihuaPrompt.buildUserMessage({
      ...hexagramData,
      question,
      numbers
    })
    const interpretation = await askAI(meihuaPrompt.system, userMessage)

    res.json({
      data: hexagramData,
      interpretation
    })
  } catch (err) {
    console.error('梅花易数错误:', err)
    res.status(500).json({ error: '起卦出错，请稍后重试' })
  }
})

module.exports = router
