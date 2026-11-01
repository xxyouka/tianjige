/**
 * 计算 Worker - 用于处理繁重的计算任务
 */

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 五行
const WU_XING = ['木', '火', '土', '金', '水']
// 生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

/**
 * 计算八字
 */
function calculateBazi(year, month, day, hour) {
  // 简化的八字计算
  const yearGanIndex = (year - 4) % 10
  const yearZhiIndex = (year - 4) % 12

  const monthGanIndex = ((yearGanIndex % 5) * 2 + month) % 10
  const monthZhiIndex = (month + 1) % 12

  const dayGanIndex = (Math.floor((year * 5 + year / 4 + month * 7 + day + 15) % 60) + 10) % 10
  const dayZhiIndex = (Math.floor((year * 5 + year / 4 + month * 7 + day + 15) % 60) + 10) % 12

  const hourZhiIndex = Math.floor((hour + 1) / 2) % 12
  const hourGanIndex = (dayGanIndex % 5 * 2 + hourZhiIndex) % 10

  return {
    year: { gan: TIAN_GAN[yearGanIndex], zhi: DI_ZHI[yearZhiIndex] },
    month: { gan: TIAN_GAN[monthGanIndex], zhi: DI_ZHI[monthZhiIndex] },
    day: { gan: TIAN_GAN[dayGanIndex], zhi: DI_ZHI[dayZhiIndex] },
    hour: { gan: TIAN_GAN[hourGanIndex], zhi: DI_ZHI[hourZhiIndex] },
    shengXiao: SHENG_XIAO[yearZhiIndex],
    wuXing: {
      year: WU_XING[Math.floor(yearGanIndex / 2)],
      month: WU_XING[Math.floor(monthGanIndex / 2)],
      day: WU_XING[Math.floor(dayGanIndex / 2)],
      hour: WU_XING[Math.floor(hourGanIndex / 2)]
    }
  }
}

/**
 * 计算五行分布
 */
function calculateWuXingDistribution(bazi) {
  const distribution = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 }

  const allGan = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan]
  const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi]

  allGan.forEach(gan => {
    const index = TIAN_GAN.indexOf(gan)
    distribution[WU_XING[Math.floor(index / 2)]]++
  })

  allZhi.forEach(zhi => {
    const index = DI_ZHI.indexOf(zhi)
    distribution[WU_XING[index % 5]]++
  })

  return distribution
}

/**
 * 计算纳音五行
 */
function calculateNaYin(yearGan, yearZhi) {
  const ganIndex = TIAN_GAN.indexOf(yearGan)
  const zhiIndex = DI_ZHI.indexOf(yearZhi)
  const index = (ganIndex % 10 + zhiIndex % 12) % 30

  const naYinTable = [
    '海中金', '炉中火', '大林木', '路旁土', '剑锋金',
    '山头火', '涧下水', '城头土', '白蜡金', '杨柳木',
    '泉中水', '屋上土', '霹雳火', '松柏木', '长流水',
    '砂中金', '山下火', '平地木', '壁上土', '金箔金',
    '覆灯火', '天河水', '大驿土', '钗钏金', '桑柘木',
    '大溪水', '砂中土', '天上火', '石榴木', '大海水'
  ]

  return naYinTable[Math.floor(index / 2)]
}

/**
 * 数字命理计算
 */
function calculateNumerology(birthdate) {
  const numbers = birthdate.replace(/-/g, '').split('').map(Number)

  // 生命数字
  let lifeNumber = numbers.reduce((sum, n) => sum + n, 0)
  while (lifeNumber > 9 && lifeNumber !== 11 && lifeNumber !== 22 && lifeNumber !== 33) {
    lifeNumber = String(lifeNumber).split('').reduce((sum, n) => sum + Number(n), 0)
  }

  // 天赋数字
  const talentNumbers = [
    numbers[0] + numbers[1],
    numbers[2] + numbers[3],
    numbers[4] + numbers[5],
    numbers[6] + numbers[7]
  ].map(n => {
    while (n > 9) {
      n = String(n).split('').reduce((sum, d) => sum + Number(d), 0)
    }
    return n
  })

  // 成熟数字
  let matureNumber = lifeNumber + talentNumbers.reduce((sum, n) => sum + n, 0)
  while (matureNumber > 9) {
    matureNumber = String(matureNumber).split('').reduce((sum, n) => sum + Number(n), 0)
  }

  return {
    lifeNumber,
    talentNumbers,
    matureNumber,
    challengeNumbers: [
      Math.abs(talentNumbers[0] - talentNumbers[1]),
      Math.abs(talentNumbers[2] - talentNumbers[3])
    ]
  }
}

/**
 * 称骨算命
 */
function calculateBoneWeight(year, month, day, hour) {
  // 年份重量表（简化）
  const yearWeights = {
    1990: 0.9, 1991: 0.8, 1992: 0.7, 1993: 0.8, 1994: 1.5,
    1995: 0.9, 1996: 1.6, 1997: 0.8, 1998: 0.8, 1999: 1.9,
    2000: 1.2, 2001: 0.7, 2002: 0.8, 2003: 0.7, 2004: 1.5,
    2005: 0.9, 2006: 0.6, 2007: 1.6, 2008: 1.5, 2009: 0.7,
    2010: 0.9, 2011: 1.2, 2012: 1.0, 2013: 0.7, 2014: 1.5
  }

  // 月份重量表
  const monthWeights = [0.6, 0.7, 1.8, 0.9, 0.5, 1.6, 0.9, 1.5, 1.8, 0.8, 0.9, 0.5]

  // 日期重量表
  const dayWeights = [
    0.5, 1.0, 0.8, 1.5, 1.6, 1.5, 0.8, 1.6, 0.8, 1.6,
    0.9, 1.7, 0.8, 1.7, 1.0, 0.8, 0.8, 1.7, 0.5, 1.5,
    1.0, 1.0, 0.9, 1.5, 1.5, 1.8, 0.7, 0.8, 1.6, 0.6
  ]

  // 时辰重量表
  const hourWeights = [1.6, 0.6, 0.7, 1.0, 0.9, 1.6, 1.0, 0.8, 0.8, 0.9, 0.5, 1.6]

  const yearWeight = yearWeights[year] || 1.0
  const monthWeight = monthWeights[month - 1] || 1.0
  const dayWeight = dayWeights[day - 1] || 1.0
  const hourWeight = hourWeights[Math.floor((hour + 1) / 2) % 12] || 1.0

  const totalWeight = yearWeight + monthWeight + dayWeight + hourWeight

  return {
    yearWeight,
    monthWeight,
    dayWeight,
    hourWeight,
    totalWeight: Math.round(totalWeight * 100) / 100
  }
}

// Worker 消息处理
self.onmessage = function (e) {
  const { type, data, id } = e.data

  let result

  switch (type) {
    case 'calculateBazi':
      result = calculateBazi(data.year, data.month, data.day, data.hour)
      result.wuXingDistribution = calculateWuXingDistribution(result)
      result.naYin = calculateNaYin(result.year.gan, result.year.zhi)
      break

    case 'calculateNumerology':
      result = calculateNumerology(data.birthdate)
      break

    case 'calculateBoneWeight':
      result = calculateBoneWeight(data.year, data.month, data.day, data.hour)
      break

    default:
      result = { error: 'Unknown calculation type' }
  }

  self.postMessage({ type, id, result })
}
