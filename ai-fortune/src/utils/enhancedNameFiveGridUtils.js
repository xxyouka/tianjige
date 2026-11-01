/**
 * 增强姓名五格分析工具
 * 包含姓名五格分析、三才配置、姓名吉凶等功能
 */

class EnhancedNameFiveGridUtils {
  constructor() {
    this.wuGe = this.initWuGe()
    this.sanCai = this.initSanCai()
    this.strokes = this.initStrokes()
  }

  // 初始化五格
  initWuGe() {
    return {
      '天格': { meaning: '主祖先运', effect: '影响早年运势', weight: 10 },
      '人格': { meaning: '主主运', effect: '影响一生运势', weight: 30 },
      '地格': { meaning: '主前运', effect: '影响前半生运势', weight: 20 },
      '外格': { meaning: '主副运', effect: '影响人际关系', weight: 10 },
      '总格': { meaning: '主后运', effect: '影响后半生运势', weight: 30 }
    }
  }

  // 初始化三才配置
  initSanCai() {
    return {
      '木木木': { level: '大吉', description: '基础稳固，发展顺利' },
      '木木火': { level: '大吉', description: '上下和睦，事业有成' },
      '木木土': { level: '大吉', description: '基础稳固，发展顺利' },
      '木木金': { level: '凶', description: '基础不稳，事业多阻' },
      '木木水': { level: '吉', description: '基础较好，发展顺利' },
      '木火木': { level: '大吉', description: '上下和睦，事业有成' },
      '木火火': { level: '大吉', description: '上下和睦，事业有成' },
      '木火土': { level: '大吉', description: '上下和睦，事业有成' },
      '木火金': { level: '凶', description: '基础不稳，事业多阻' },
      '木火水': { level: '凶', description: '基础不稳，事业多阻' },
      '木土木': { level: '大吉', description: '基础稳固，发展顺利' },
      '木土火': { level: '大吉', description: '基础稳固，发展顺利' },
      '木土土': { level: '大吉', description: '基础稳固，发展顺利' },
      '木土金': { level: '凶', description: '基础不稳，事业多阻' },
      '木土水': { level: '凶', description: '基础不稳，事业多阻' },
      '木金木': { level: '凶', description: '基础不稳，事业多阻' },
      '木金火': { level: '凶', description: '基础不稳，事业多阻' },
      '木金土': { level: '凶', description: '基础不稳，事业多阻' },
      '木金金': { level: '凶', description: '基础不稳，事业多阻' },
      '木金水': { level: '凶', description: '基础不稳，事业多阻' },
      '木水木': { level: '大吉', description: '基础稳固，发展顺利' },
      '木水火': { level: '凶', description: '基础不稳，事业多阻' },
      '木水土': { level: '凶', description: '基础不稳，事业多阻' },
      '木水金': { level: '大吉', description: '基础稳固，发展顺利' },
      '木水水': { level: '大吉', description: '基础稳固，发展顺利' },
      '火木木': { level: '大吉', description: '上下和睦，事业有成' },
      '火木火': { level: '大吉', description: '上下和睦，事业有成' },
      '火木土': { level: '大吉', description: '上下和睦，事业有成' },
      '火木金': { level: '凶', description: '基础不稳，事业多阻' },
      '火木水': { level: '吉', description: '基础较好，发展顺利' },
      '火火木': { level: '大吉', description: '上下和睦，事业有成' },
      '火火火': { level: '大吉', description: '上下和睦，事业有成' },
      '火火土': { level: '大吉', description: '上下和睦，事业有成' },
      '火火金': { level: '凶', description: '基础不稳，事业多阻' },
      '火火水': { level: '凶', description: '基础不稳，事业多阻' },
      '火土木': { level: '大吉', description: '基础稳固，发展顺利' },
      '火土火': { level: '大吉', description: '基础稳固，发展顺利' },
      '火土土': { level: '大吉', description: '基础稳固，发展顺利' },
      '火土金': { level: '吉', description: '基础较好，发展顺利' },
      '火土水': { level: '凶', description: '基础不稳，事业多阻' },
      '火金木': { level: '凶', description: '基础不稳，事业多阻' },
      '火金火': { level: '凶', description: '基础不稳，事业多阻' },
      '火金土': { level: '凶', description: '基础不稳，事业多阻' },
      '火金金': { level: '凶', description: '基础不稳，事业多阻' },
      '火金水': { level: '凶', description: '基础不稳，事业多阻' },
      '火水木': { level: '大吉', description: '基础稳固，发展顺利' },
      '火水火': { level: '凶', description: '基础不稳，事业多阻' },
      '火水土': { level: '凶', description: '基础不稳，事业多阻' },
      '火水金': { level: '大吉', description: '基础稳固，发展顺利' },
      '火水水': { level: '大吉', description: '基础稳固，发展顺利' },
      '土木木': { level: '大吉', description: '基础稳固，发展顺利' },
      '土木火': { level: '大吉', description: '基础稳固，发展顺利' },
      '土木土': { level: '大吉', description: '基础稳固，发展顺利' },
      '土木金': { level: '凶', description: '基础不稳，事业多阻' },
      '土木水': { level: '凶', description: '基础不稳，事业多阻' },
      '土火木': { level: '大吉', description: '基础稳固，发展顺利' },
      '土火火': { level: '大吉', description: '基础稳固，发展顺利' },
      '土火土': { level: '大吉', description: '基础稳固，发展顺利' },
      '土火金': { level: '吉', description: '基础较好，发展顺利' },
      '土火水': { level: '凶', description: '基础不稳，事业多阻' },
      '土土木': { level: '大吉', description: '基础稳固，发展顺利' },
      '土土火': { level: '大吉', description: '基础稳固，发展顺利' },
      '土土土': { level: '大吉', description: '基础稳固，发展顺利' },
      '土土金': { level: '大吉', description: '基础稳固，发展顺利' },
      '土土水': { level: '凶', description: '基础不稳，事业多阻' },
      '土金木': { level: '凶', description: '基础不稳，事业多阻' },
      '土金火': { level: '凶', description: '基础不稳，事业多阻' },
      '土金土': { level: '大吉', description: '基础稳固，发展顺利' },
      '土金金': { level: '大吉', description: '基础稳固，发展顺利' },
      '土金水': { level: '大吉', description: '基础稳固，发展顺利' },
      '土水木': { level: '大吉', description: '基础稳固，发展顺利' },
      '土水火': { level: '凶', description: '基础不稳，事业多阻' },
      '土水土': { level: '凶', description: '基础不稳，事业多阻' },
      '土水金': { level: '大吉', description: '基础稳固，发展顺利' },
      '土水水': { level: '大吉', description: '基础稳固，发展顺利' },
      '金木木': { level: '凶', description: '基础不稳，事业多阻' },
      '金木火': { level: '凶', description: '基础不稳，事业多阻' },
      '金木土': { level: '凶', description: '基础不稳，事业多阻' },
      '金木金': { level: '凶', description: '基础不稳，事业多阻' },
      '金木水': { level: '凶', description: '基础不稳，事业多阻' },
      '金火木': { level: '凶', description: '基础不稳，事业多阻' },
      '金火火': { level: '凶', description: '基础不稳，事业多阻' },
      '金火土': { level: '凶', description: '基础不稳，事业多阻' },
      '金火金': { level: '凶', description: '基础不稳，事业多阻' },
      '金火水': { level: '凶', description: '基础不稳，事业多阻' },
      '金土木': { level: '大吉', description: '基础稳固，发展顺利' },
      '金土火': { level: '大吉', description: '基础稳固，发展顺利' },
      '金土土': { level: '大吉', description: '基础稳固，发展顺利' },
      '金土金': { level: '大吉', description: '基础稳固，发展顺利' },
      '金土水': { level: '大吉', description: '基础稳固，发展顺利' },
      '金金木': { level: '凶', description: '基础不稳，事业多阻' },
      '金金火': { level: '凶', description: '基础不稳，事业多阻' },
      '金金土': { level: '大吉', description: '基础稳固，发展顺利' },
      '金金金': { level: '大吉', description: '基础稳固，发展顺利' },
      '金金水': { level: '大吉', description: '基础稳固，发展顺利' },
      '金水木': { level: '大吉', description: '基础稳固，发展顺利' },
      '金水火': { level: '凶', description: '基础不稳，事业多阻' },
      '金水土': { level: '凶', description: '基础不稳，事业多阻' },
      '金水金': { level: '大吉', description: '基础稳固，发展顺利' },
      '金水水': { level: '大吉', description: '基础稳固，发展顺利' },
      '水木木': { level: '大吉', description: '基础稳固，发展顺利' },
      '水木火': { level: '大吉', description: '基础稳固，发展顺利' },
      '水木土': { level: '大吉', description: '基础稳固，发展顺利' },
      '水木金': { level: '凶', description: '基础不稳，事业多阻' },
      '水木水': { level: '大吉', description: '基础稳固，发展顺利' },
      '水火木': { level: '大吉', description: '基础稳固，发展顺利' },
      '水火火': { level: '凶', description: '基础不稳，事业多阻' },
      '水火土': { level: '凶', description: '基础不稳，事业多阻' },
      '水火金': { level: '大吉', description: '基础稳固，发展顺利' },
      '水火水': { level: '大吉', description: '基础稳固，发展顺利' },
      '水土木': { level: '大吉', description: '基础稳固，发展顺利' },
      '水土火': { level: '凶', description: '基础不稳，事业多阻' },
      '水土土': { level: '凶', description: '基础不稳，事业多阻' },
      '水土金': { level: '大吉', description: '基础稳固，发展顺利' },
      '水土水': { level: '大吉', description: '基础稳固，发展顺利' },
      '水金木': { level: '大吉', description: '基础稳固，发展顺利' },
      '水金火': { level: '凶', description: '基础不稳，事业多阻' },
      '水金土': { level: '大吉', description: '基础稳固，发展顺利' },
      '水金金': { level: '大吉', description: '基础稳固，发展顺利' },
      '水金水': { level: '大吉', description: '基础稳固，发展顺利' },
      '水水木': { level: '大吉', description: '基础稳固，发展顺利' },
      '水水火': { level: '凶', description: '基础不稳，事业多阻' },
      '水水土': { level: '凶', description: '基础不稳，事业多阻' },
      '水水金': { level: '大吉', description: '基础稳固，发展顺利' },
      '水水水': { level: '大吉', description: '基础稳固，发展顺利' }
    }
  }

  // 初始化笔画数
  initStrokes() {
    return {
      '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
      '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
      '百': 6, '千': 3, '万': 15
    }
  }

  // 计算五格
  calculateWuGe(surname, givenName) {
    const surnameStrokes = this.calculateStrokes(surname)
    const givenNameStrokes = this.calculateStrokes(givenName)

    // 天格：姓氏笔画数+1
    const tianGe = surnameStrokes + 1

    // 人格：姓氏笔画数+名字第一个字笔画数
    const renGe = surnameStrokes + givenNameStrokes

    // 地格：名字笔画数之和
    const diGe = givenNameStrokes

    // 外格：天格+人格-地格
    const waiGe = tianGe + renGe - diGe

    // 总格：姓名笔画数之和
    const zongGe = surnameStrokes + givenNameStrokes

    return {
      tianGe,
      renGe,
      diGe,
      waiGe,
      zongGe,
      analysis: this.analyzeWuGe(tianGe, renGe, diGe, waiGe, zongGe)
    }
  }

  // 计算笔画数
  calculateStrokes(name) {
    let strokes = 0
    for (const char of name) {
      strokes += this.strokes[char] || this.getStrokesByUnicode(char)
    }
    return strokes
  }

  // 根据Unicode获取笔画数（简化版）
  getStrokesByUnicode(char) {
    const code = char.charCodeAt(0)
    // 简化处理：根据Unicode范围估算
    if (code >= 0x4E00 && code <= 0x9FFF) {
      return 8 // 常见汉字平均笔画数
    }
    return 0
  }

  // 分析五格
  analyzeWuGe(tianGe, renGe, diGe, waiGe, zongGe) {
    return {
      tianGe: this.analyzeGe(tianGe, '天格'),
      renGe: this.analyzeGe(renGe, '人格'),
      diGe: this.analyzeGe(diGe, '地格'),
      waiGe: this.analyzeGe(waiGe, '外格'),
      zongGe: this.analyzeGe(zongGe, '总格')
    }
  }

  // 分析单个格
  analyzeGe(strokes, geName) {
    const level = this.getStrokesLevel(strokes)
    return {
      strokes,
      geName,
      level,
      description: this.getGeDescription(strokes, geName, level)
    }
  }

  // 获取笔画吉凶
  getStrokesLevel(strokes) {
    const ji = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48]
    const xiong = [2, 4, 9, 10, 12, 14, 19, 20, 22, 26, 27, 28, 30, 34, 36, 38, 40, 42, 43, 44, 46]

    if (ji.includes(strokes)) return '吉'
    if (xiong.includes(strokes)) return '凶'
    return '中'
  }

  // 获取格描述
  getGeDescription(strokes, geName, level) {
    if (level === '吉') {
      return `${geName}${strokes}画，吉，运势顺利`
    } else if (level === '凶') {
      return `${geName}${strokes}画，凶，运势多阻`
    } else {
      return `${geName}${strokes}画，中，运势平稳`
    }
  }

  // 分析三才配置
  analyzeSanCai(tianGe, renGe, diGe) {
    const tianWuXing = this.getWuXingByStrokes(tianGe)
    const renWuXing = this.getWuXingByStrokes(renGe)
    const diWuXing = this.getWuXingByStrokes(diGe)

    const key = tianWuXing + renWuXing + diWuXing
    const config = this.sanCai[key] || { level: '中', description: '配置一般' }

    return {
      tianWuXing,
      renWuXing,
      diWuXing,
      key,
      level: config.level,
      description: config.description
    }
  }

  // 根据笔画获取五行
  getWuXingByStrokes(strokes) {
    const lastDigit = strokes % 10
    if (lastDigit === 1 || lastDigit === 2) return '木'
    if (lastDigit === 3 || lastDigit === 4) return '火'
    if (lastDigit === 5 || lastDigit === 6) return '土'
    if (lastDigit === 7 || lastDigit === 8) return '金'
    return '水'
  }

  // 综合分析姓名
  analyzeName(surname, givenName) {
    const wuGe = this.calculateWuGe(surname, givenName)
    const sanCai = this.analyzeSanCai(wuGe.tianGe, wuGe.renGe, wuGe.diGe)

    return {
      surname,
      givenName,
      fullName: surname + givenName,
      wuGe,
      sanCai,
      overall: this.analyzeOverall(wuGe, sanCai)
    }
  }

  // 综合分析
  analyzeOverall(wuGe, sanCai) {
    const geScores = [
      wuGe.analysis.tianGe.level,
      wuGe.analysis.renGe.level,
      wuGe.analysis.diGe.level,
      wuGe.analysis.waiGe.level,
      wuGe.analysis.zongGe.level
    ]

    const jiCount = geScores.filter(l => l === '吉').length
    const xiongCount = geScores.filter(l => l === '凶').length

    let level, description
    if (jiCount >= 4 && sanCai.level === '大吉') {
      level = '大吉'
      description = '姓名配置极好，运势顺利'
    } else if (jiCount >= 3 && sanCai.level !== '凶') {
      level = '吉'
      description = '姓名配置较好，运势顺利'
    } else if (jiCount >= 2) {
      level = '中'
      description = '姓名配置一般，运势平稳'
    } else {
      level = '凶'
      description = '姓名配置较差，运势多阻'
    }

    return {
      level,
      description,
      jiCount,
      xiongCount,
      sanCaiLevel: sanCai.level
    }
  }

  // 获取五格信息
  getWuGeInfo(geName) {
    return this.wuGe[geName]
  }

  // 获取所有五格信息
  getAllWuGeInfo() {
    return Object.entries(this.wuGe).map(([name, data]) => ({ name, ...data }))
  }

  // 获取三才配置
  getSanCaiConfig(key) {
    return this.sanCai[key]
  }

  // 搜索姓名信息
  searchName(query) {
    const results = []

    for (const [name, data] of Object.entries(this.wuGe)) {
      if (name.includes(query) || data.meaning.includes(query)) {
        results.push({ type: '五格', name, ...data })
      }
    }

    return results
  }

  // 获取姓名统计
  getNameStats() {
    return {
      wuGe: Object.keys(this.wuGe).length,
      sanCai: Object.keys(this.sanCai).length
    }
  }
}

export const enhancedNameFiveGridUtils = new EnhancedNameFiveGridUtils()

// 便捷方法
export const calculateWuGe = (surname, givenName) => enhancedNameFiveGridUtils.calculateWuGe(surname, givenName)
export const analyzeSanCai = (tianGe, renGe, diGe) => enhancedNameFiveGridUtils.analyzeSanCai(tianGe, renGe, diGe)
export const analyzeName = (surname, givenName) => enhancedNameFiveGridUtils.analyzeName(surname, givenName)
export const getWuGeInfo = (geName) => enhancedNameFiveGridUtils.getWuGeInfo(geName)
export const getAllWuGeInfo = () => enhancedNameFiveGridUtils.getAllWuGeInfo()
export const getSanCaiConfig = (key) => enhancedNameFiveGridUtils.getSanCaiConfig(key)
export const searchName = (query) => enhancedNameFiveGridUtils.searchName(query)
export const getNameStats = () => enhancedNameFiveGridUtils.getNameStats()
