const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const xingmingPrompt = require('../prompts/xingming')

router.post('/analyze', async (req, res) => {
  try {
    const { name, gender = 'male' } = req.body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: '请输入姓名' })
    }

    if (name.length > 20) {
      return res.status(400).json({ error: '姓名过长' })
    }

    const interpretation = await askAI(
      xingmingPrompt.system,
      xingmingPrompt.buildUserMessage({ name: name.trim(), gender })
    )

    res.json({
      data: { name: name.trim() },
      interpretation
    })
  } catch (err) {
    console.error('姓名测算错误:', err)
    res.status(500).json({ error: '测算出错，请稍后重试' })
  }
})

module.exports = router
