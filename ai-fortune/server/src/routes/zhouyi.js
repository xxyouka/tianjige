const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const zhouyiPrompt = require('../prompts/zhouyi')
const { generateHexagram } = require('../services/zhouyi')
const { sanitizeText } = require('../services/validate')

router.post('/divine', async (req, res) => {
  try {
    const { method, question: rawQuestion, numbers } = req.body
    const question = sanitizeText(rawQuestion)

    const validMethods = ['random', 'coin', 'time', 'number', 'meihua']
    if (method && !validMethods.includes(method)) {
      return res.status(400).json({ error: '无效的起卦方式' })
    }

    // 生成卦象
    const hexagramData = generateHexagram(method, numbers)

    // AI 解读
    const userMessage = zhouyiPrompt.buildUserMessage({
      ...hexagramData,
      question
    })
    const interpretation = await askAI(zhouyiPrompt.system, userMessage)

    res.json({
      data: hexagramData,
      interpretation
    })
  } catch (err) {
    console.error('周易占卜错误:', err)
    res.status(500).json({ error: '占卜出错，请稍后重试' })
  }
})

module.exports = router
