const { SHENG_XIAO } = require('./constants')

// 年份骨重对照表（简化版，按生肖）
const YEAR_WEIGHT = {
  '鼠': 1.2, '牛': 0.9, '虎': 0.6, '兔': 0.7,
  '龙': 1.2, '蛇': 0.6, '马': 1.0, '羊': 0.8,
  '猴': 0.7, '鸡': 0.8, '狗': 1.5, '猪': 0.7
}

// 月份骨重
const MONTH_WEIGHT = [0.6, 0.7, 1.8, 0.9, 0.5, 1.6, 0.9, 1.5, 1.8, 0.8, 0.9, 0.5]

// 日期骨重
const DAY_WEIGHT = [
  0.5, 1.0, 0.8, 1.5, 1.6, 1.5, 0.8, 1.6, 0.8, 1.6,
  0.9, 1.7, 0.8, 1.7, 1.0, 0.8, 0.9, 1.8, 0.5, 1.5,
  1.0, 0.9, 0.8, 0.9, 1.5, 1.8, 0.7, 0.8, 1.6, 0.6, 0.8
]

// 时辰骨重
const HOUR_WEIGHT = [1.6, 0.6, 0.7, 1.0, 0.9, 1.6, 1.0, 0.8, 1.2, 1.0, 0.6, 0.7]

// 骨重命运对照
const FORTUNE = {
  '二两一': { level: '短命非业', comment: '此命生来命运穷，困苦度日难成功。\n一生衣禄难周全，孤苦伶仃无依靠。' },
  '二两二': { level: '一生劳碌', comment: '此命劳碌一生穷，每逢困难事难成。\n骨肉至亲如冰炭，终日劳碌不安宁。' },
  '二两三': { level: '先难后易', comment: '此命推来骨肉轻，求谋做事事难成。\n兄弟六亲无靠，一生自力更自强。' },
  '二两四': { level: '福禄双无', comment: '此命推来福禄无，门庭困苦总难荣。\n六亲骨肉无依靠，流浪他乡度晚景。' },
  '二两五': { level: '自力更生', comment: '此命推来祖业微，门庭营度似稀奇。\n六亲骨肉如冰炭，一生勤劳自成家。' },
  '二两六': { level: '平生衣禄', comment: '此命推来衣食丰，一生不愁吃和穿。\n虽然不得大富贵，安安稳稳过一生。' },
  '二两七': { level: '独立自成', comment: '此命一生事事通，不须劳碌自亨通。\n兄弟六亲皆不得，独立成家福禄丰。' },
  '二两八': { level: '自卓为才', comment: '此命生来多坎坷，一生做事半成空。\n虽然祖业须微有，却有明月照沟渠。' },
  '二两九': { level: '先苦后甜', comment: '此命推来运不通，劳碌做事尽皆空。\n苦心竭力成家计，到得那时在梦中。' },
  '三两': { level: '少年劳碌', comment: '此命推来少年难，亲朋好友难靠前。\n独立自主成家计，中年以后渐渐安。' },
  '三两一': { level: '先贫后富', comment: '此命推来运渐好，少年贫苦中年好。\n兄弟六亲难依靠，自力更生最为高。' },
  '三两二': { level: '性巧过人', comment: '此命推来性巧灵，做事精通有才能。\n一生衣禄天注定，不须劳碌自丰盈。' },
  '三两三': { level: '性直多才', comment: '此命推来性直刚，一生做事有主张。\n虽然祖业须微有，自成家计福禄长。' },
  '三两四': { level: '财谷有余', comment: '此命推来财谷丰，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '三两五': { level: '先难后吉', comment: '此命推来少年难，中年以后渐渐安。\n兄弟六亲无依靠，自力更生福禄全。' },
  '三两六': { level: '少年多劳', comment: '此命推来少年劳，亲朋好友难依靠。\n一生做事多坎坷，中年以后渐渐好。' },
  '三两七': { level: '一生近贵', comment: '此命推来一生近贵人，做事亨通有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
  '三两八': { level: '一生有名', comment: '此命推来有名声，一生做事有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
  '三两九': { level: '少年多磨', comment: '此命推来少年磨，中年以后渐渐好。\n兄弟六亲无依靠，自力更生最为高。' },
  '四两': { level: '衣禄无忧', comment: '此命推来衣禄丰，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '四两一': { level: '财源广进', comment: '此命推来财源广，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '四两二': { level: '自力更生', comment: '此命推来自力成，一生不靠他人行。\n兄弟六亲无依靠，自成家计福禄增。' },
  '四两三': { level: '福禄双全', comment: '此命推来福禄全，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄增。' },
  '四两四': { level: '先苦后甜', comment: '此命推来先苦甜，少年贫苦中年安。\n兄弟六亲无依靠，自力更生福禄全。' },
  '四两五': { level: '福禄双全', comment: '此命推来福禄全，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄增。' },
  '四两六': { level: '一生有福', comment: '此命推来一生福，不须劳碌自丰足。\n兄弟六亲皆得力，家成业就享清福。' },
  '四两七': { level: '一生有禄', comment: '此命推来一生禄，不须劳碌自丰足。\n兄弟六亲皆得力，家成业就享清福。' },
  '四两八': { level: '初年大志', comment: '此命推来初年志，一生做事有主张。\n兄弟六亲皆得力，家成业就福禄长。' },
  '四两九': { level: '一生清高', comment: '此命推来一生清，不须劳碌自丰盈。\n兄弟六亲皆得力，家成业就福禄增。' },
  '五两': { level: '衣食丰足', comment: '此命推来衣食丰，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '五两一': { level: '一世荣华', comment: '此命推来一世荣，一生做事有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
  '五两二': { level: '一生荣华', comment: '此命推来一生荣，一生做事有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
  '五两三': { level: '一生显达', comment: '此命推来一生显，一生做事有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
  '五两四': { level: '一生有福', comment: '此命推来一生福，不须劳碌自丰足。\n兄弟六亲皆得力，家成业就享清福。' },
  '五两五': { level: '少年奋斗', comment: '此命推来少年斗，中年以后渐渐好。\n兄弟六亲无依靠，自力更生最为高。' },
  '五两六': { level: '一生有福', comment: '此命推来一生福，不须劳碌自丰足。\n兄弟六亲皆得力，家成业就享清福。' },
  '五两七': { level: '一生有福', comment: '此命推来一生福，不须劳碌自丰足。\n兄弟六亲皆得力，家成业就享清福。' },
  '五两八': { level: '一生有福', comment: '此命推来一生福，不须劳碌自丰足。\n兄弟六亲皆得力，家成业就享清福。' },
  '五两九': { level: '一生有福', comment: '此命推来一生福，不须劳碌自丰足。\n兄弟六亲皆得力，家成业就享清福。' },
  '六两': { level: '一世荣华', comment: '此命推来一世荣，一生做事有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
  '六两一': { level: '名利双收', comment: '此命推来名利全，一生做事有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
  '六两二': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '六两三': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '六两四': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '六两五': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '六两六': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '六两七': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '六两八': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '六两九': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '七两': { level: '一生显达', comment: '此命推来一生显，一生做事有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
  '七两一': { level: '大富大贵', comment: '此命推来大富贵，一生不愁吃和穿。\n兄弟六亲皆得力，家成业就福禄全。' },
  '七两二': { level: '帝王之命', comment: '此命推来帝王尊，一生做事有才能。\n兄弟六亲皆得力，家成业就福禄增。' },
}

function getZodiac(year) {
  return SHENG_XIAO[(year - 4) % 12]
}

function getFortune(weight) {
  const weightStr = weight.toFixed(1)
  // 查找最接近的骨重
  const weights = Object.keys(FORTUNE).map(w => parseFloat(w))
  let closest = weights[0]
  for (const w of weights) {
    if (Math.abs(w - weight) < Math.abs(closest - weight)) {
      closest = w
    }
  }
  return FORTUNE[closest.toFixed(1) + '两'] || FORTUNE['四两']
}

function calculateBoneWeight(year, month, day, hour) {
  const zodiac = getZodiac(year)
  const yearWeight = YEAR_WEIGHT[zodiac] || 1.0
  const monthWeight = MONTH_WEIGHT[month - 1] || 0.8
  const dayWeight = DAY_WEIGHT[day - 1] || 1.0
  const hourIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12
  const hourWeight = HOUR_WEIGHT[hourIndex] || 1.0

  const totalWeight = yearWeight + monthWeight + dayWeight + hourWeight
  const fortune = getFortune(totalWeight)

  return {
    weight: totalWeight.toFixed(1),
    zodiac,
    yearWeight,
    monthWeight,
    dayWeight,
    hourWeight,
    level: fortune.level,
    comment: fortune.comment
  }
}

module.exports = { calculateBoneWeight }
