const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const astrologyPrompt = require('../prompts/astrology')
const { getZodiacSign } = require('../services/constants')
const { validateDate, validateHour } = require('../services/validate')

// 星座日期范围（按起始日排序，覆盖全年无间隙）
const SIGNS = [
  { name: '摩羯座', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, element: '土', ruler: '土星' },
  { name: '水瓶座', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, element: '风', ruler: '天王星' },
  { name: '双鱼座', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, element: '水', ruler: '海王星' },
  { name: '白羊座', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, element: '火', ruler: '火星' },
  { name: '金牛座', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, element: '土', ruler: '金星' },
  { name: '双子座', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21, element: '风', ruler: '水星' },
  { name: '巨蟹座', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22, element: '水', ruler: '月亮' },
  { name: '狮子座', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, element: '火', ruler: '太阳' },
  { name: '处女座', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, element: '土', ruler: '水星' },
  { name: '天秤座', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23, element: '风', ruler: '金星' },
  { name: '天蝎座', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22, element: '水', ruler: '冥王星' },
  { name: '射手座', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21, element: '火', ruler: '木星' }
]

const PLANETS = ['太阳', '月亮', '水星', '金星', '火星', '木星', '土星', '天王星', '海王星', '冥王星']

function getSunSign(month, day) {
  const name = getZodiacSign(month, day)
  return SIGNS.find(s => s.name === name) || SIGNS[3]
}

// 简易 hash：把出生数据映射到 0-11
function birthHash(year, month, day, hour, offset = 0) {
  const seed = (year * 3727 + month * 311 + day * 17 + hour * 3 + offset * 97) % 12
  return (seed + 12) % 12
}

// 简易 degree hash：映射到 0-29
function degreeHash(year, month, day, hour, offset = 0) {
  const seed = (year * 5171 + month * 499 + day * 53 + hour * 11 + offset * 131) % 30
  return (seed + 30) % 30
}

function getMoonSign(year, month, day) {
  return SIGNS[birthHash(year, month, day, 0, 1)]
}

function getRisingSign(year, month, day, hour) {
  return SIGNS[birthHash(year, month, day, hour, 2)]
}

function generateNatalChart(year, month, day, hour) {
  const sunSign = getSunSign(month, day)
  const moonSign = getMoonSign(year, month, day)
  const risingSign = getRisingSign(year, month, day, hour)

  const planets = PLANETS.map((planet, i) => {
    const signIndex = birthHash(year, month, day, hour, i + 3)
    const degree = degreeHash(year, month, day, hour, i)
    return {
      planet,
      sign: SIGNS[signIndex].name,
      degree
    }
  })

  return {
    sunSign: sunSign.name,
    moonSign: moonSign.name,
    risingSign: risingSign.name,
    element: sunSign.element,
    ruler: sunSign.ruler,
    planets
  }
}

router.post('/calculate', async (req, res) => {
  try {
    const { year, month, day, hour } = req.body

    const y = parseInt(year)
    const m = parseInt(month)
    const d = parseInt(day)
    const h = parseInt(hour)

    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h)) {
      return res.status(400).json({ error: '请填写完整的出生信息' })
    }
    const dateErr = validateDate(y, m, d)
    if (dateErr) return res.status(400).json({ error: dateErr })
    const hourErr = validateHour(h)
    if (hourErr) return res.status(400).json({ error: hourErr })

    const chartData = generateNatalChart(y, m, d, h)

    const interpretation = await askAI(
      astrologyPrompt.system,
      astrologyPrompt.buildUserMessage({ chartData })
    )

    res.json({
      data: chartData,
      interpretation
    })
  } catch (err) {
    console.error('星盘错误:', err)
    res.status(500).json({ error: '星盘计算出错，请稍后重试' })
  }
})

module.exports = router
