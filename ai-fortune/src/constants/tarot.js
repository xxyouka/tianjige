export const majorArcana = {
  '愚者': { number: 0, upright: '新开始、冒险、自由、天真', reversed: '鲁莽、冒失、犹豫不决' },
  '魔术师': { number: 1, upright: '创造力、才能、意志力', reversed: '欺骗、缺乏自信' },
  '女祭司': { number: 2, upright: '直觉、潜意识、神秘', reversed: '忽略直觉、表面化' },
  '女皇': { number: 3, upright: '丰收、母性、自然', reversed: '依赖、过度保护' },
  '皇帝': { number: 4, upright: '权威、结构、掌控', reversed: '专横、僵化' },
  '教皇': { number: 5, upright: '传统、教育、信仰', reversed: '打破常规、叛逆' },
  '恋人': { number: 6, upright: '爱情、选择、和谐', reversed: '失衡、分离' },
  '战车': { number: 7, upright: '胜利、意志、决心', reversed: '失控、挫败' },
  '力量': { number: 8, upright: '勇气、耐心、内在力量', reversed: '自我怀疑、软弱' },
  '隐士': { number: 9, upright: '内省、智慧、孤独', reversed: '孤立、逃避' },
  '命运之轮': { number: 10, upright: '命运、转折、机遇', reversed: '抗拒改变、坏运' },
  '正义': { number: 11, upright: '公平、真相、因果', reversed: '不公、逃避责任' },
  '倒吊人': { number: 12, upright: '牺牲、新视角、等待', reversed: '拖延、无谓牺牲' },
  '死神': { number: 13, upright: '结束、转变、新生', reversed: '抗拒改变、停滞' },
  '节制': { number: 14, upright: '平衡、耐心、调和', reversed: '失衡、过度' },
  '恶魔': { number: 15, upright: '束缚、诱惑、物质', reversed: '解脱、觉醒' },
  '塔': { number: 16, upright: '突变、破坏、觉醒', reversed: '避免灾难、恐惧改变' },
  '星星': { number: 17, upright: '希望、灵感、宁静', reversed: '失望、缺乏信心' },
  '月亮': { number: 18, upright: '幻象、直觉、潜意识', reversed: '释放恐惧、真相' },
  '太阳': { number: 19, upright: '成功、快乐、活力', reversed: '暂时低落、过度乐观' },
  '审判': { number: 20, upright: '觉醒、重生、反思', reversed: '自我怀疑、逃避' },
  '世界': { number: 21, upright: '完成、整合、成就', reversed: '未完成、缺乏 closure' }
}

export const tarotSpreads = [
  { id: 'single', name: '单张牌', count: 1, desc: '快速指引' },
  { id: 'three', name: '三张牌', count: 3, desc: '过去·现在·未来' },
  { id: 'celtic', name: '凯尔特十字', count: 10, desc: '全面解读' }
]

export const tarotPositionNames = {
  'three': ['过去', '现在', '未来'],
  'single': ['指引'],
  'celtic': ['当前', '挑战', '过去', '未来', '意识', '潜意识', '建议', '环境', '希望', '结果']
}
