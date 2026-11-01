const express = require('express')
const router = express.Router()
const { askAI } = require('../services/ai')
const runesPrompt = require('../prompts/runes')
const { sanitizeText } = require('../services/validate')

// Fisher-Yates 洗牌
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 卢恩符文 24 个
const RUNES = [
  { name: 'Fehu', symbol: 'ᚠ', meaning: '财富', reversed: '损失、贫困' },
  { name: 'Uruz', symbol: 'ᚢ', meaning: '力量', reversed: '虚弱、疾病' },
  { name: 'Thurisaz', symbol: 'ᚦ', meaning: '保护', reversed: '危险、冲突' },
  { name: 'Ansuz', symbol: 'ᚨ', meaning: '智慧', reversed: '误解、欺骗' },
  { name: 'Raidho', symbol: 'ᚱ', meaning: '旅程', reversed: '停滞、延误' },
  { name: 'Kenaz', symbol: 'ᚲ', meaning: '光明', reversed: '黑暗、困惑' },
  { name: 'Gebo', symbol: 'ᚷ', meaning: '礼物', reversed: '贪婪、孤立' },
  { name: 'Wunjo', symbol: 'ᚹ', meaning: '喜悦', reversed: '悲伤、失望' },
  { name: 'Hagalaz', symbol: 'ᚺ', meaning: '变革', reversed: '抗拒、僵化' },
  { name: 'Nauthiz', symbol: 'ᚾ', meaning: '需要', reversed: '匮乏、困顿' },
  { name: 'Isa', symbol: 'ᛁ', meaning: '冰', reversed: '解冻、流动' },
  { name: 'Jera', symbol: 'ᛃ', meaning: '收获', reversed: '延迟、等待' },
  { name: 'Eihwaz', symbol: 'ᛇ', meaning: '坚韧', reversed: '脆弱、动摇' },
  { name: 'Perthro', symbol: 'ᛈ', meaning: '命运', reversed: '失控、混乱' },
  { name: 'Algiz', symbol: 'ᛉ', meaning: '守护', reversed: '暴露、危险' },
  { name: 'Sowilo', symbol: 'ᛊ', meaning: '太阳', reversed: '阴霾、失败' },
  { name: 'Tiwaz', symbol: 'ᛏ', meaning: '胜利', reversed: '失败、挫折' },
  { name: 'Berkano', symbol: 'ᛒ', meaning: '新生', reversed: '停滞、不孕' },
  { name: 'Ehwaz', symbol: 'ᛖ', meaning: '合作', reversed: '冲突、分离' },
  { name: 'Mannaz', symbol: 'ᛗ', meaning: '人性', reversed: '孤独、疏离' },
  { name: 'Laguz', symbol: 'ᛚ', meaning: '水流', reversed: '混乱、迷失' },
  { name: 'Ingwaz', symbol: 'ᛜ', meaning: '完成', reversed: '未完成、中断' },
  { name: 'Dagaz', symbol: 'ᛞ', meaning: '黎明', reversed: '黑暗、绝望' },
  { name: 'Othala', symbol: 'ᛟ', meaning: '遗产', reversed: '流离、无根' }
]

function drawRunes(count = 3) {
  const num = Math.min(Math.max(parseInt(count) || 3, 1), 24)
  const shuffled = shuffle(RUNES)
  return shuffled.slice(0, num).map(rune => ({
    name: rune.name,
    symbol: rune.symbol,
    meaning: rune.meaning,
    reversedMeaning: rune.reversed,
    isReversed: Math.random() > 0.5
  }))
}

router.get('/list', (req, res) => {
  res.json({ runes: RUNES })
})

router.post('/draw', async (req, res) => {
  try {
    const { count = 3, question: rawQuestion } = req.body
    const question = sanitizeText(rawQuestion)
    const runes = drawRunes(count)

    const interpretation = await askAI(
      runesPrompt.system,
      runesPrompt.buildUserMessage({ runes, question })
    )

    res.json({
      data: { runes },
      interpretation
    })
  } catch (err) {
    console.error('卢恩符文错误:', err)
    res.status(500).json({ error: '抽符文出错，请稍后重试' })
  }
})

module.exports = router
