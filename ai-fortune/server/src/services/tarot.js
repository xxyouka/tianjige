// 韦特塔罗牌 78 张
const MAJOR_ARCANA = [
  { id: 0, name: '愚者', nameEn: 'The Fool' },
  { id: 1, name: '魔术师', nameEn: 'The Magician' },
  { id: 2, name: '女祭司', nameEn: 'The High Priestess' },
  { id: 3, name: '女皇', nameEn: 'The Empress' },
  { id: 4, name: '皇帝', nameEn: 'The Emperor' },
  { id: 5, name: '教皇', nameEn: 'The Hierophant' },
  { id: 6, name: '恋人', nameEn: 'The Lovers' },
  { id: 7, name: '战车', nameEn: 'The Chariot' },
  { id: 8, name: '力量', nameEn: 'Strength' },
  { id: 9, name: '隐士', nameEn: 'The Hermit' },
  { id: 10, name: '命运之轮', nameEn: 'Wheel of Fortune' },
  { id: 11, name: '正义', nameEn: 'Justice' },
  { id: 12, name: '倒吊人', nameEn: 'The Hanged Man' },
  { id: 13, name: '死神', nameEn: 'Death' },
  { id: 14, name: '节制', nameEn: 'Temperance' },
  { id: 15, name: '恶魔', nameEn: 'The Devil' },
  { id: 16, name: '塔', nameEn: 'The Tower' },
  { id: 17, name: '星星', nameEn: 'The Star' },
  { id: 18, name: '月亮', nameEn: 'The Moon' },
  { id: 19, name: '太阳', nameEn: 'The Sun' },
  { id: 20, name: '审判', nameEn: 'Judgement' },
  { id: 21, name: '世界', nameEn: 'The World' }
]

const SUITS = ['权杖', '圣杯', '宝剑', '星币']
const SUIT_NAMES = ['Wands', 'Cups', 'Swords', 'Pentacles']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', '侍从', '骑士', '王后', '国王']
const RANK_NAMES = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']

// 生成小阿尔卡纳
const MINOR_ARCANA = []
SUITS.forEach((suit, si) => {
  RANKS.forEach((rank, ri) => {
    MINOR_ARCANA.push({
      id: 22 + si * 14 + ri,
      name: `${rank}${suit}`,
      nameEn: `${RANK_NAMES[ri]} of ${SUIT_NAMES[si]}`
    })
  })
})

const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA]

function drawCards(count) {
  const shuffled = [...ALL_CARDS]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const drawn = shuffled.slice(0, count)

  return drawn.map(card => ({
    ...card,
    reversed: Math.random() > 0.5
  }))
}

module.exports = { drawCards, ALL_CARDS }
