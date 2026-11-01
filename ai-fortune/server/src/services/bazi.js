// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 五行
const WU_XING = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水']
// 地支五行
const DI_ZHI_WU_XING = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水']

// 十神对照表（以日主为基准）
const TEN_GODS = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
}

// 年柱计算（立春为分界）
function getYearPillar(year, month, day) {
  // 简化处理：以立春（约2月4日）为分界
  if (month < 2 || (month === 2 && day < 4)) {
    year -= 1
  }
  const ganIndex = (year - 4) % 10
  const zhiIndex = (year - 4) % 12
  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[zhiIndex],
    wuxing: WU_XING[ganIndex]
  }
}

// 月柱计算
function getMonthPillar(year, month, day) {
  const yearPillar = getYearPillar(year, month, day)
  const yearGanIndex = TIAN_GAN.indexOf(yearPillar.gan)

  // 节气月份调整（简化）
  let lunarMonth = month
  if (day < 6) lunarMonth -= 1
  if (lunarMonth < 1) lunarMonth = 12

  // 月柱天干 = 年干 * 2 + 月支
  const monthGanIndex = (yearGanIndex * 2 + lunarMonth) % 10
  const monthZhiIndex = (lunarMonth + 1) % 12

  return {
    gan: TIAN_GAN[monthGanIndex],
    zhi: DI_ZHI[monthZhiIndex],
    wuxing: WU_XING[monthGanIndex]
  }
}

// 日柱计算（简化版）
function getDayPillar(year, month, day) {
  // 基准日：1900年1月1日为甲戌日
  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24))

  const ganIndex = (diffDays + 10) % 10
  const zhiIndex = (diffDays + 10) % 12

  return {
    gan: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex],
    zhi: DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex],
    wuxing: WU_XING[ganIndex < 0 ? ganIndex + 10 : ganIndex]
  }
}

// 时柱计算
function getHourPillar(dayGan, hour) {
  const dayGanIndex = TIAN_GAN.indexOf(dayGan)
  const hourZhiIndex = Math.floor((hour + 1) / 2) % 12
  const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10

  return {
    gan: TIAN_GAN[hourGanIndex],
    zhi: DI_ZHI[hourZhiIndex],
    wuxing: WU_XING[hourGanIndex]
  }
}

// 获取十神
function getTenGods(dayGan, targetGan) {
  return TEN_GODS[dayGan][targetGan]
}

// 计算大运（简化版）
function calculateMajorLuck(yearGan, yearZhi, gender) {
  const ganIndex = TIAN_GAN.indexOf(yearGan)
  const zhiIndex = DI_ZHI.indexOf(yearZhi)

  const luck = []
  const direction = (gender === 'male' && ganIndex % 2 === 0) || (gender === 'female' && ganIndex % 2 === 1) ? 1 : -1

  for (let i = 1; i <= 8; i++) {
    const newGanIndex = (ganIndex + direction * i + 10) % 10
    const newZhiIndex = (zhiIndex + direction * i + 12) % 12
    luck.push({
      gan: TIAN_GAN[newGanIndex],
      zhi: DI_ZHI[newZhiIndex]
    })
  }

  return luck
}

function calculateBazi(year, month, day, hour, gender = 'male') {
  const yearPillar = getYearPillar(year, month, day)
  const monthPillar = getMonthPillar(year, month, day)
  const dayPillar = getDayPillar(year, month, day)
  const hourPillar = getHourPillar(dayPillar.gan, hour)

  const dayMaster = dayPillar.gan
  const tenGods = {
    year: getTenGods(dayMaster, yearPillar.gan),
    month: getTenGods(dayMaster, monthPillar.gan),
    hour: getTenGods(dayMaster, hourPillar.gan)
  }

  const majorLuck = calculateMajorLuck(yearPillar.gan, yearPillar.zhi, gender)

  return {
    yearPillar: `${yearPillar.gan}${yearPillar.zhi}`,
    monthPillar: `${monthPillar.gan}${monthPillar.zhi}`,
    dayPillar: `${dayPillar.gan}${dayPillar.zhi}`,
    hourPillar: `${hourPillar.gan}${hourPillar.zhi}`,
    dayMaster,
    tenGods: `年柱:${tenGods.year} 月柱:${tenGods.month} 时柱:${tenGods.hour}`,
    majorLuck: majorLuck.map(l => `${l.gan}${l.zhi}`).join(' → '),
    yearLuck: `${new Date().getFullYear()}年`
  }
}

module.exports = { calculateBazi }
