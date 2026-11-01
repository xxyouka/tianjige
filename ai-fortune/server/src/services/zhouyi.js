// 六十四卦数据
const HEXAGRAMS = [
  { name: '乾', symbol: '☰☰', meaning: '天', lines: [1, 1, 1, 1, 1, 1] },
  { name: '坤', symbol: '☷☷', meaning: '地', lines: [0, 0, 0, 0, 0, 0] },
  { name: '屯', symbol: '☵☳', meaning: '水雷屯', lines: [0, 1, 0, 0, 0, 1] },
  { name: '蒙', symbol: '☶☵', meaning: '山水蒙', lines: [1, 0, 0, 0, 1, 0] },
  { name: '需', symbol: '☵☰', meaning: '水天需', lines: [0, 1, 0, 1, 1, 1] },
  { name: '讼', symbol: '☰☵', meaning: '天水讼', lines: [1, 1, 1, 0, 1, 0] },
  { name: '师', symbol: '☷☵', meaning: '地水师', lines: [0, 0, 0, 0, 1, 0] },
  { name: '比', symbol: '☵☷', meaning: '水地比', lines: [0, 1, 0, 0, 0, 0] },
  { name: '小畜', symbol: '☴☰', meaning: '风天小畜', lines: [1, 1, 0, 1, 1, 1] },
  { name: '履', symbol: '☰☱', meaning: '天泽履', lines: [1, 1, 1, 1, 1, 0] },
  { name: '泰', symbol: '☷☰', meaning: '地天泰', lines: [0, 0, 0, 1, 1, 1] },
  { name: '否', symbol: '☰☷', meaning: '天地否', lines: [1, 1, 1, 0, 0, 0] },
  { name: '同人', symbol: '☰☲', meaning: '天火同人', lines: [1, 1, 1, 1, 0, 1] },
  { name: '大有', symbol: '☲☰', meaning: '火天大有', lines: [1, 0, 1, 1, 1, 1] },
  { name: '谦', symbol: '☷☶', meaning: '地山谦', lines: [0, 0, 0, 1, 0, 0] },
  { name: '豫', symbol: '☳☷', meaning: '雷地豫', lines: [0, 0, 1, 0, 0, 0] },
  { name: '随', symbol: '☱☳', meaning: '泽雷随', lines: [1, 1, 0, 0, 0, 1] },
  { name: '蛊', symbol: '☶☴', meaning: '山风蛊', lines: [1, 0, 0, 1, 1, 0] },
  { name: '临', symbol: '☷☱', meaning: '地泽临', lines: [0, 0, 0, 1, 1, 0] },
  { name: '观', symbol: '☴☷', meaning: '风地观', lines: [1, 1, 0, 0, 0, 0] },
  { name: '噬嗑', symbol: '☲☳', meaning: '火雷噬嗑', lines: [1, 0, 1, 0, 0, 1] },
  { name: '贲', symbol: '☶☲', meaning: '山火贲', lines: [1, 0, 0, 1, 0, 1] },
  { name: '剥', symbol: '☶☷', meaning: '山地剥', lines: [1, 0, 0, 0, 0, 0] },
  { name: '复', symbol: '☷☳', meaning: '地雷复', lines: [0, 0, 0, 0, 0, 1] },
  { name: '无妄', symbol: '☰☳', meaning: '天雷无妄', lines: [1, 1, 1, 0, 0, 1] },
  { name: '大畜', symbol: '☶☰', meaning: '山天大畜', lines: [1, 0, 0, 1, 1, 1] },
  { name: '颐', symbol: '☶☳', meaning: '山雷颐', lines: [1, 0, 0, 0, 0, 1] },
  { name: '大过', symbol: '☱☴', meaning: '泽风大过', lines: [1, 1, 0, 1, 1, 0] },
  { name: '坎', symbol: '☵☵', meaning: '坎为水', lines: [0, 1, 0, 0, 1, 0] },
  { name: '离', symbol: '☲☲', meaning: '离为火', lines: [1, 0, 1, 1, 0, 1] },
  { name: '咸', symbol: '☱☶', meaning: '泽山咸', lines: [1, 1, 0, 1, 0, 0] },
  { name: '恒', symbol: '☳☴', meaning: '雷风恒', lines: [0, 0, 1, 1, 1, 0] },
  { name: '遁', symbol: '☰☶', meaning: '天山遁', lines: [1, 1, 1, 1, 0, 0] },
  { name: '大壮', symbol: '☳☰', meaning: '雷天大壮', lines: [0, 0, 1, 1, 1, 1] },
  { name: '晋', symbol: '☲☷', meaning: '火地晋', lines: [1, 0, 1, 0, 0, 0] },
  { name: '明夷', symbol: '☷☲', meaning: '地火明夷', lines: [0, 0, 0, 1, 0, 1] },
  { name: '家人', symbol: '☴☲', meaning: '风火家人', lines: [1, 1, 0, 1, 0, 1] },
  { name: '睽', symbol: '☲☱', meaning: '火泽睽', lines: [1, 0, 1, 1, 1, 0] },
  { name: '蹇', symbol: '☵☶', meaning: '水山蹇', lines: [0, 1, 0, 1, 0, 0] },
  { name: '解', symbol: '☳☵', meaning: '雷水解', lines: [0, 0, 1, 0, 1, 0] },
  { name: '损', symbol: '☶☱', meaning: '山泽损', lines: [1, 0, 0, 1, 1, 0] },
  { name: '益', symbol: '☴☳', meaning: '风雷益', lines: [1, 1, 0, 0, 0, 1] },
  { name: '夬', symbol: '☱☰', meaning: '泽天夬', lines: [1, 1, 0, 1, 1, 1] },
  { name: '姤', symbol: '☰☴', meaning: '天风姤', lines: [1, 1, 1, 1, 1, 0] },
  { name: '萃', symbol: '☱☷', meaning: '泽地萃', lines: [1, 1, 0, 0, 0, 0] },
  { name: '升', symbol: '☷☴', meaning: '地风升', lines: [0, 0, 0, 1, 1, 0] },
  { name: '困', symbol: '☱☵', meaning: '泽水困', lines: [1, 1, 0, 0, 1, 0] },
  { name: '井', symbol: '☵☴', meaning: '水风井', lines: [0, 1, 0, 1, 1, 0] },
  { name: '革', symbol: '☱☲', meaning: '泽火革', lines: [1, 1, 0, 1, 0, 1] },
  { name: '鼎', symbol: '☲☴', meaning: '火风鼎', lines: [1, 0, 1, 1, 1, 0] },
  { name: '震', symbol: '☳☳', meaning: '震为雷', lines: [0, 0, 1, 0, 0, 1] },
  { name: '艮', symbol: '☶☶', meaning: '艮为山', lines: [1, 0, 0, 1, 0, 0] },
  { name: '渐', symbol: '☴☶', meaning: '风山渐', lines: [1, 1, 0, 1, 0, 0] },
  { name: '归妹', symbol: '☳☱', meaning: '雷泽归妹', lines: [0, 0, 1, 1, 1, 0] },
  { name: '丰', symbol: '☳☲', meaning: '雷火丰', lines: [0, 0, 1, 1, 0, 1] },
  { name: '旅', symbol: '☲☶', meaning: '火山旅', lines: [1, 0, 1, 1, 0, 0] },
  { name: '巽', symbol: '☴☴', meaning: '巽为风', lines: [1, 1, 0, 1, 1, 0] },
  { name: '兑', symbol: '☱☱', meaning: '兑为泽', lines: [1, 1, 0, 1, 1, 0] },
  { name: '涣', symbol: '☴☵', meaning: '风水涣', lines: [1, 1, 0, 0, 1, 0] },
  { name: '节', symbol: '☵☱', meaning: '水泽节', lines: [0, 1, 0, 1, 1, 0] },
  { name: '中孚', symbol: '☴☱', meaning: '风泽中孚', lines: [1, 1, 0, 1, 1, 0] },
  { name: '小过', symbol: '☳☶', meaning: '雷山小过', lines: [0, 0, 1, 1, 0, 0] },
  { name: '既济', symbol: '☵☲', meaning: '水火既济', lines: [0, 1, 0, 1, 0, 1] },
  { name: '未济', symbol: '☲☵', meaning: '火水未济', lines: [1, 0, 1, 0, 1, 0] }
]

// 根据六爻找卦
function findHexagram(lines) {
  return HEXAGRAMS.find(h =>
    h.lines.every((l, i) => l === lines[i])
  ) || HEXAGRAMS[0]
}

// Fisher-Yates 洗牌
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 生成卦象
function generateHexagram(method = 'random', numbers = null) {
  let lines = []
  let movingLines = []

  if (method === 'number' && numbers) {
    // 梅花易数·数字起卦
    const nums = Array.isArray(numbers) ? numbers : [numbers]
    const upper = nums[0] % 8
    const lower = (nums[1] || nums[0]) % 8
    const moving = (nums[0] + (nums[1] || 0)) % 6

    const trigrams = [
      [1, 1, 1], [0, 0, 0], [1, 0, 0], [0, 1, 0],
      [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1]
    ]

    lines = [...trigrams[lower], ...trigrams[upper]]
    movingLines = [moving + 1]
  } else if (method === 'coin') {
    for (let i = 0; i < 6; i++) {
      const coins = [
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2
      ]
      const sum = coins.reduce((a, b) => a + b, 0)
      lines.push(sum % 2 === 1 ? 1 : 0)
      if (sum === 6 || sum === 9) {
        movingLines.push(i + 1)
      }
    }
  } else if (method === 'time') {
    const now = new Date()
    const total = now.getHours() + now.getMinutes() + now.getDate()
    const upper = total % 8
    const lower = (total + now.getMonth()) % 8
    const moving = (total + now.getFullYear()) % 6

    const trigrams = [
      [1, 1, 1], [0, 0, 0], [1, 0, 0], [0, 1, 0],
      [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1]
    ]

    lines = [...trigrams[lower], ...trigrams[upper]]
    movingLines = [moving + 1]
  } else {
    for (let i = 0; i < 6; i++) {
      const val = Math.random() > 0.5 ? 1 : 0
      lines.push(val)
      if (Math.random() > 0.7) {
        movingLines.push(i + 1)
      }
    }
  }

  // 计算变卦
  const changedLines = [...lines]
  movingLines.forEach(pos => {
    changedLines[pos - 1] = changedLines[pos - 1] === 1 ? 0 : 1
  })

  const hexagram = findHexagram(lines)
  const changedHexagram = findHexagram(changedLines)

  return {
    hexagram: hexagram.symbol,
    hexagramName: `${hexagram.name}（${hexagram.meaning}）`,
    changedHexagram: changedHexagram.symbol,
    changedHexagramName: `${changedHexagram.name}（${changedHexagram.meaning}）`,
    movingLines: movingLines.length > 0 ? `第${movingLines.join('、')}爻` : '无动爻',
    lines,
    changedLines
  }
}

module.exports = { generateHexagram }
