const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const WU_XING_MAP = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' }

function getDailyGanZhi(year, month, day) {
  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24))
  const ganIndex = (diffDays + 10) % 10
  const zhiIndex = (diffDays + 10) % 12
  return {
    gan: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex],
    zhi: DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex]
  }
}

const ZODIAC_SIGNS = [
  { name: '摩羯座', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: '水瓶座', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: '双鱼座', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: '白羊座', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: '金牛座', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: '双子座', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
  { name: '巨蟹座', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
  { name: '狮子座', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: '处女座', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: '天秤座', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23 },
  { name: '天蝎座', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22 },
  { name: '射手座', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21 }
]

function getZodiacSign(month, day) {
  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth > sign.endMonth) {
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return sign.name
      }
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return sign.name
      }
    }
  }
  return '摩羯座'
}

module.exports = { TIAN_GAN, DI_ZHI, SHENG_XIAO, WU_XING_MAP, ZODIAC_SIGNS, getDailyGanZhi, getZodiacSign }
