export const signIcons = {
  '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
  '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
  '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓'
}

export function getDaysInMonth(year, month) {
  if (!year || !month) return 31
  return new Date(year, month, 0).getDate()
}

export const dreamSymbolMap = {
  '水': { meaning: '财运、情感', category: '自然', level: '吉' },
  '火': { meaning: '事业、热情', category: '自然', level: '中' },
  '山': { meaning: '困难、阻碍', category: '自然', level: '凶' },
  '风': { meaning: '变化、消息', category: '自然', level: '中' },
  '雨': { meaning: '滋润、收获', category: '自然', level: '吉' },
  '雪': { meaning: '纯洁、冷静', category: '自然', level: '中' },
  '太阳': { meaning: '光明、希望', category: '自然', level: '大吉' },
  '月亮': { meaning: '情感、直觉', category: '自然', level: '吉' },
  '星星': { meaning: '希望、梦想', category: '自然', level: '吉' },
  '雷': { meaning: '惊吓、变化', category: '自然', level: '凶' },
  '彩虹': { meaning: '希望、美好', category: '自然', level: '大吉' },
  '花': { meaning: '美好、爱情', category: '植物', level: '吉' },
  '树': { meaning: '成长、稳定', category: '植物', level: '吉' },
  '草': { meaning: '平凡、生机', category: '植物', level: '中' },
  '鸟': { meaning: '自由、消息', category: '动物', level: '吉' },
  '鱼': { meaning: '财富、机遇', category: '动物', level: '吉' },
  '龙': { meaning: '权力、成功', category: '动物', level: '大吉' },
  '凤': { meaning: '美好、吉祥', category: '动物', level: '大吉' },
  '虎': { meaning: '勇气、危险', category: '动物', level: '中' },
  '蛇': { meaning: '智慧、危险', category: '动物', level: '中' },
  '马': { meaning: '成功、奔波', category: '动物', level: '吉' },
  '狗': { meaning: '忠诚、朋友', category: '动物', level: '吉' },
  '猫': { meaning: '独立、神秘', category: '动物', level: '中' },
  '猪': { meaning: '财富、福气', category: '动物', level: '吉' },
  '鼠': { meaning: '聪明、机智', category: '动物', level: '中' },
  '兔': { meaning: '温和、幸运', category: '动物', level: '吉' },
  '房屋': { meaning: '家庭、安全', category: '建筑', level: '吉' },
  '门': { meaning: '机会、选择', category: '建筑', level: '吉' },
  '窗': { meaning: '视野、希望', category: '建筑', level: '吉' },
  '桥': { meaning: '过渡、连接', category: '建筑', level: '吉' },
  '车': { meaning: '前进、动力', category: '交通', level: '吉' },
  '船': { meaning: '旅程、变化', category: '交通', level: '中' },
  '飞机': { meaning: '高远、快速', category: '交通', level: '吉' },
  '钱': { meaning: '财富、价值', category: '生活', level: '吉' },
  '书': { meaning: '知识、学习', category: '生活', level: '吉' },
  '镜子': { meaning: '自我、反思', category: '生活', level: '中' },
  '钟': { meaning: '时间、提醒', category: '生活', level: '中' },
  '灯': { meaning: '光明、希望', category: '生活', level: '吉' },
  '床': { meaning: '休息、情感', category: '生活', level: '中' },
  '食物': { meaning: '满足、滋养', category: '生活', level: '吉' },
  '衣服': { meaning: '形象、保护', category: '生活', level: '中' },
  '考试': { meaning: '挑战、检验', category: '事件', level: '中' },
  '结婚': { meaning: '结合、承诺', category: '事件', level: '大吉' },
  '生孩子': { meaning: '新生、创造', category: '事件', level: '大吉' },
  '死亡': { meaning: '结束、转变', category: '事件', level: '中' },
  '飞翔': { meaning: '自由、成功', category: '动作', level: '大吉' },
  '坠落': { meaning: '失败、恐惧', category: '动作', level: '凶' },
  '追赶': { meaning: '压力、逃避', category: '动作', level: '凶' },
  '迷路': { meaning: '迷茫、困惑', category: '动作', level: '凶' },
  '游泳': { meaning: '挑战、克服', category: '动作', level: '中' },
  '跳舞': { meaning: '快乐、表达', category: '动作', level: '吉' },
  '牙齿掉落': { meaning: '焦虑、变化', category: '身体', level: '凶' },
  '头发': { meaning: '魅力、自信', category: '身体', level: '中' },
  '眼睛': { meaning: '洞察、视野', category: '身体', level: '吉' },
  '手': { meaning: '能力、行动', category: '身体', level: '吉' },
  '血': { meaning: '生命、情感', category: '身体', level: '凶' },
  '鬼': { meaning: '恐惧、潜意识', category: '超自然', level: '凶' },
  '神': { meaning: '信仰、力量', category: '超自然', level: '大吉' },
  '天使': { meaning: '保护、希望', category: '超自然', level: '大吉' },
  '坟墓': { meaning: '结束、纪念', category: '超自然', level: '凶' },
}

export const dreamCategoryIcons = {
  '自然': '🌿', '植物': '🌱', '动物': '🐾', '建筑': '🏛️',
  '交通': '🚗', '生活': '🏠', '事件': '📌', '动作': '🏃',
  '身体': '👤', '超自然': '✨'
}

export const dreamTimePeriods = [
  { id: 'early', name: '子时(23-1点)', desc: '夜深人静，梦境最为真实' },
  { id: 'middle', name: '丑寅时(1-5点)', desc: '深度睡眠，潜意识活跃' },
  { id: 'late', name: '卯辰时(5-9点)', desc: '即将清醒，梦境较为清晰' },
  { id: 'day', name: '白天', desc: '白日梦，多为愿望投射' },
]

// 八字基础数据
export const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
export const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
export const shengXiaoList = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
export const wuXingMap = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' }
export const wuXingColors = { '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e5e7eb', '水': '#60a5fa' }

export function getDailyGanZhi(year, month, day) {
  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24))
  const ganIndex = (diffDays + 10) % 10
  const zhiIndex = (diffDays + 10) % 12
  return {
    ganZhi: tianGan[ganIndex] + diZhi[zhiIndex],
    gan: tianGan[ganIndex],
    zhi: diZhi[zhiIndex],
    shengXiao: shengXiaoList[zhiIndex]
  }
}

// 五行健康/事业/财运/感情数据
export const healthMap = {
  '木': { organ: '肝胆', advice: '多食绿色蔬菜，保持心情舒畅', weakness: '易怒伤肝' },
  '火': { organ: '心脏', advice: '多食红色食物，保持心态平和', weakness: '心火旺盛' },
  '土': { organ: '脾胃', advice: '多食黄色食物，规律饮食作息', weakness: '思虑过度' },
  '金': { organ: '肺部', advice: '多食白色食物，保持呼吸通畅', weakness: '悲伤伤肺' },
  '水': { organ: '肾脏', advice: '多食黑色食物，注意保暖防寒', weakness: '惊恐伤肾' }
}

export const careerMap = {
  '木': '教育、文化、设计、园艺',
  '火': '传媒、餐饮、电子、艺术',
  '土': '房地产、建筑、农业、金融',
  '金': '法律、金融、机械、医疗',
  '水': '物流、旅游、水产、传媒'
}

export const wealthMap = {
  '木': '偏财运佳，可尝试新型理财',
  '火': '投资运旺，适合短期项目',
  '土': '守财力强，适合长期稳健理财',
  '金': '正财运旺，适合稳定收入型投资',
  '水': '横财运好，但需谨慎把握时机'
}

export const loveMap = {
  '木': '桃花运平稳，需主动表达',
  '火': '桃花运旺盛，异性缘好',
  '土': '感情稳定，适合长期发展',
  '金': '感情专一，但需注意沟通',
  '水': '感情丰富，但易多愁善感'
}

// 吉时数据
export const jiShiData = {
  '子': { time: '23:00-01:00', luck: '中', advice: '适合休息、冥想', icon: '🌙' },
  '丑': { time: '01:00-03:00', luck: '中', advice: '适合休息、养精蓄锐', icon: '🌙' },
  '寅': { time: '03:00-05:00', luck: '好', advice: '适合早起、锻炼', icon: '🌅' },
  '卯': { time: '05:00-07:00', luck: '好', advice: '适合学习、工作', icon: '🌅' },
  '辰': { time: '07:00-09:00', luck: '好', advice: '适合出行、办事', icon: '☀️' },
  '巳': { time: '09:00-11:00', luck: '好', advice: '适合工作、会议', icon: '☀️' },
  '午': { time: '11:00-13:00', luck: '中', advice: '适合休息、午餐', icon: '☀️' },
  '未': { time: '13:00-15:00', luck: '中', advice: '适合工作、学习', icon: '☀️' },
  '申': { time: '15:00-17:00', luck: '好', advice: '适合工作、社交', icon: '🌤️' },
  '酉': { time: '17:00-19:00', luck: '好', advice: '适合社交、晚餐', icon: '🌤️' },
  '戌': { time: '19:00-21:00', luck: '中', advice: '适合休息、娱乐', icon: '🌙' },
  '亥': { time: '21:00-23:00', luck: '中', advice: '适合休息、准备睡觉', icon: '🌙' }
}

export function getLevelColor(level) {
  if (level === '大吉') return 'text-green-400'
  if (level === '吉') return 'text-green-300'
  if (level === '中') return 'text-text-muted'
  if (level === '凶') return 'text-red-400'
  return 'text-text-muted'
}
