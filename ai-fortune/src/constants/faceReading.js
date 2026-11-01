export const faceTypes = [
  { id: 'round', name: '圆脸', desc: '面圆肉多，下巴圆润', icon: '🌕' },
  { id: 'square', name: '方脸', desc: '额宽颌方，棱角分明', icon: '⬜' },
  { id: 'long', name: '长脸', desc: '面长而窄，额头高', icon: '📏' },
  { id: 'triangle', name: '三角脸', desc: '额头窄下巴尖', icon: '🔻' },
  { id: 'oval', name: '椭圆脸', desc: '面型匀称，线条柔和', icon: '🥚' },
  { id: 'diamond', name: '菱形脸', desc: '颧骨突出，额头和下巴较窄', icon: '💎' },
]

export const featureOptions = {
  forehead: [
    { id: 'high-wide', name: '高阔饱满', desc: '额头高而宽，皮肤光滑' },
    { id: 'high-narrow', name: '高而窄', desc: '额头高但较窄' },
    { id: 'low-wide', name: '低而宽', desc: '额头较低但宽阔' },
    { id: 'low-narrow', name: '低而窄', desc: '额头较低且窄' },
    { id: 'round', name: '圆润饱满', desc: '额头圆润，皮肤细腻' },
    { id: 'flat', name: '平坦', desc: '额头平坦，无明显起伏' },
  ],
  eyebrows: [
    { id: 'long-thick', name: '长而浓密', desc: '眉毛长且浓密' },
    { id: 'long-thin', name: '长而纤细', desc: '眉毛长但纤细' },
    { id: 'short-thick', name: '短而浓密', desc: '眉毛短且浓密' },
    { id: 'short-thin', name: '短而纤细', desc: '眉毛短且纤细' },
    { id: 'curved', name: '弯曲如柳', desc: '眉毛弯曲，形状优美' },
    { id: 'straight', name: '平直', desc: '眉毛平直，没有明显弯曲' },
  ],
  eyes: [
    { id: 'big-bright', name: '大而明亮', desc: '眼睛大，眼神明亮有神' },
    { id: 'big-deep', name: '大而深邃', desc: '眼睛大，眼神深沉' },
    { id: 'small-bright', name: '小而有神', desc: '眼睛较小但精神十足' },
    { id: 'small-calm', name: '小而沉稳', desc: '眼睛较小，眼神平静' },
    { id: 'long-thin', name: '细长', desc: '眼睛细长，如凤眼' },
    { id: 'round', name: '圆润', desc: '眼睛圆大，如杏眼' },
  ],
  nose: [
    { id: 'high-bridge', name: '高挺', desc: '鼻梁高挺，鼻头圆润' },
    { id: 'low-bridge', name: '低平', desc: '鼻梁较低，鼻头扁平' },
    { id: 'straight', name: '笔直', desc: '鼻梁笔直，线条分明' },
    { id: 'curved', name: '弯曲', desc: '鼻梁有弯曲或驼峰' },
    { id: 'big-round', name: '大而圆', desc: '鼻头大而圆润' },
    { id: 'small-pointed', name: '小而尖', desc: '鼻子小巧，鼻尖较尖' },
  ],
  mouth: [
    { id: 'big-thick', name: '大而厚唇', desc: '嘴巴较大，嘴唇丰厚' },
    { id: 'big-thin', name: '大而薄唇', desc: '嘴巴较大，嘴唇较薄' },
    { id: 'small-thick', name: '小而厚唇', desc: '嘴巴较小，嘴唇丰厚' },
    { id: 'small-thin', name: '小而薄唇', desc: '嘴巴较小，嘴唇较薄' },
    { id: 'upturned', name: '嘴角上扬', desc: '嘴角自然上扬，如微笑' },
    { id: 'downturned', name: '嘴角下垂', desc: '嘴角略微下垂' },
  ],
  ears: [
    { id: 'big-thick', name: '大而厚实', desc: '耳朵大，耳垂厚实' },
    { id: 'big-thin', name: '大而薄', desc: '耳朵大但较薄' },
    { id: 'small-thick', name: '小而厚实', desc: '耳朵小，耳垂厚实' },
    { id: 'small-thin', name: '小而薄', desc: '耳朵小且薄' },
    { id: 'sticking', name: '招风耳', desc: '耳朵向外展开' },
    { id: 'close', name: '贴面耳', desc: '耳朵贴近头部' },
  ],
}

export const featureLabels = {
  forehead: '额头', eyebrows: '眉毛', eyes: '眼睛',
  nose: '鼻子', mouth: '嘴巴', ears: '耳朵'
}

export const featureIcons = {
  forehead: '🧠', eyebrows: '〰️', eyes: '👁️',
  nose: '👃', mouth: '👄', ears: '👂'
}
