export const allFeatures = [
  { path: '/', name: '首页', icon: '🏠', desc: '', keywords: ['home', '首页', '主页'] },
  { path: '/comprehensive', name: '综合运势', icon: '🔮', desc: '全方位命理分析，洞察人生运势', keywords: ['comprehensive', '综合', '运势'] },
  { path: '/bazi', name: '八字排盘', icon: '☰', desc: '四柱命理，解读命运密码', keywords: ['bazi', '八字', '排盘', '命盘'] },
  { path: '/zhouyi', name: '周易占卜', icon: '☯', desc: '六十四卦，洞察吉凶', keywords: ['zhouyi', '周易', '占卜', '易经'] },
  { path: '/meihua', name: '梅花易数', icon: '🌸', desc: '心有所感，卦由心生', keywords: ['meihua', '梅花', '易数'] },
  { path: '/chengu', name: '称骨算命', icon: '⚖', desc: '袁天罡称骨，骨重定命运', keywords: ['chengu', '称骨', '骨重'] },
  { path: '/cezi', name: '测字', icon: '字', desc: '一字定乾坤，拆字知吉凶', keywords: ['cezi', '测字', '拆字'] },
  { path: '/lingqian', name: '灵签', icon: '🎋', desc: '心诚则灵，摇签问事', keywords: ['lingqian', '灵签', '摇签', '抽签'] },
  { path: '/xingming', name: '姓名测算', icon: '📝', desc: '姓名藏玄机，一字定乾坤', keywords: ['xingming', '姓名', '名字', '起名'] },
  { path: '/ziwei', name: '紫微斗数', icon: '⭐', desc: '紫微星曜，十二宫命盘', keywords: ['ziwei', '紫微', '斗数'] },
  { path: '/palmistry', name: '手相分析', icon: '✋', desc: '掌纹密码，解读人生', keywords: ['palmistry', '手相', '掌纹'] },
  { path: '/face-reading', name: '面相分析', icon: '👤', desc: '面相五官，洞察运势', keywords: ['face', '面相', '五官'] },
  { path: '/xingzuo', name: '星座运势', icon: '⭐', desc: '十二星座运势，每日更新', keywords: ['xingzuo', '星座', '运势', '占星'] },
  { path: '/tarot', name: '塔罗牌', icon: '🃏', desc: '聆听牌面的声音', keywords: ['tarot', '塔罗', '牌'] },
  { path: '/astrology', name: '星盘', icon: '✧', desc: '行星位置，灵魂蓝图', keywords: ['astrology', '星盘', '行星'] },
  { path: '/numerology', name: '数字命理', icon: '🔢', desc: '生命灵数，灵魂密码', keywords: ['numerology', '数字', '命理', '灵数'] },
  { path: '/runes', name: '卢恩符文', icon: 'ᚱ', desc: '北欧古文字，维京智慧', keywords: ['runes', '卢恩', '符文', '北欧'] },
  { path: '/flower', name: '生日花语', icon: '🌺', desc: '每一天都有花为你绽放', keywords: ['flower', '花语', '生日花', '花卉'] },
  { path: '/dream', name: '梦境解析', icon: '🌙', desc: '周公解梦，解读梦境秘密', keywords: ['dream', '梦境', '解梦'] },
  { path: '/daily', name: '每日运势', icon: '📅', desc: '黄历宜忌、吉时查询', keywords: ['daily', '每日', '黄历', '吉时'] },
  { path: '/history', name: '历史记录', icon: '📜', desc: '查看历史推算记录', keywords: ['history', '历史', '记录'] },
]

// 用于"全算"结果展示的 tab 列表（不含历史记录和首页）
export const allCalcTabs = [
  { id: 'bazi', name: '八字排盘', icon: '☰' },
  { id: 'zhouyi', name: '周易占卜', icon: '☯' },
  { id: 'meihua', name: '梅花易数', icon: '🌸' },
  { id: 'chengu', name: '称骨算命', icon: '⚖' },
  { id: 'cezi', name: '测字', icon: '字' },
  { id: 'xingming', name: '姓名测算', icon: '📝' },
  { id: 'ziwei', name: '紫微斗数', icon: '⭐' },
  { id: 'xingzuo', name: '星座运势', icon: '♊' },
  { id: 'tarot', name: '塔罗牌', icon: '🃏' },
  { id: 'comprehensive', name: '综合运势', icon: '🔮' },
  { id: 'daily', name: '每日运势', icon: '📅' },
]

// 用于历史记录的类型映射
export const typeNames = Object.fromEntries(
  allFeatures.filter(f => f.path !== '/' && f.path !== '/history').map(f => [f.path.slice(1), f.name])
)

export const typeIcons = Object.fromEntries(
  allFeatures.filter(f => f.path !== '/' && f.path !== '/history').map(f => [f.path.slice(1), f.icon])
)
