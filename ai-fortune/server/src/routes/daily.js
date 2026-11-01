const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const dailyPrompt = require('../prompts/daily')
const { SHENG_XIAO, getDailyGanZhi } = require('../services/constants')
const { validateDate, sanitizeText } = require('../services/validate')

router.post('/analyze', async (req, res) => {
  try {
    const { year, month, day, shengXiao: rawShengXiao } = req.body
    const shengXiao = sanitizeText(rawShengXiao, 10)

    const y = parseInt(year)
    const m = parseInt(month)
    const d = parseInt(day)

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return res.status(400).json({ error: '请提供有效的日期' })
    }
    const dateErr = validateDate(y, m, d)
    if (dateErr) return res.status(400).json({ error: dateErr })

    const ganZhi = getDailyGanZhi(y, m, d)
    const animal = shengXiao || SHENG_XIAO[(y - 4) % 12]

    const data = {
      year: y,
      month: m,
      day: d,
      ganZhi: `${ganZhi.gan}${ganZhi.zhi}`,
      shengXiao: animal
    }

    const userMessage = dailyPrompt.buildUserMessage(data)
    const interpretation = await askAI(dailyPrompt.system, userMessage)

    res.json({
      data: {
        ...data,
        gan: ganZhi.gan,
        zhi: ganZhi.zhi
      },
      interpretation
    })
  } catch (err) {
    console.error('每日运势错误:', err)
    res.status(500).json({ error: '计算出错，请稍后重试' })
  }
})

module.exports = router
