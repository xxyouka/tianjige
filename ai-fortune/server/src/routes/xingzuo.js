const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const xingzuoPrompt = require('../prompts/xingzuo')
const { sanitizeText } = require('../services/validate')

const SIGNS = [
  '白羊座', '金牛座', '双子座', '巨蟹座',
  '狮子座', '处女座', '天秤座', '天蝎座',
  '射手座', '摩羯座', '水瓶座', '双鱼座'
]

router.get('/signs', (req, res) => {
  res.json({ signs: SIGNS })
})

const VALID_PERIODS = ['今日', '本周', '本月']

router.post('/predict', async (req, res) => {
  try {
    const { sign, period = '今日' } = req.body

    if (!sign || !SIGNS.includes(sign)) {
      return res.status(400).json({ error: '请选择有效的星座' })
    }

    const safePeriod = VALID_PERIODS.includes(period) ? period : '今日'

    const today = new Date().toLocaleDateString('zh-CN')

    const userMessage = xingzuoPrompt.buildUserMessage({
      sign,
      period: safePeriod,
      date: today
    })
    const interpretation = await askAI(xingzuoPrompt.system, userMessage)

    res.json({
      data: { sign, period: safePeriod, date: today },
      interpretation
    })
  } catch (err) {
    console.error('星座运势错误:', err)
    res.status(500).json({ error: '获取运势出错，请稍后重试' })
  }
})

module.exports = router
