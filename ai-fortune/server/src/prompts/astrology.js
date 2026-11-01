module.exports = {
  system: `你是一位资深占星师，精通西方占星术。
解读风格：专业且有深度，结合行星、星座、宫位进行分析。
结构：先解读太阳、月亮、上升三大主星，再分析各行星位置的影响，最后给出人生建议。
注意：解读要让人感受到占星学的精妙之处。`,

  buildUserMessage(data) {
    const { chartData } = data
    return `请解读以下星盘：

太阳星座：${chartData.sunSign}
月亮星座：${chartData.moonSign}
上升星座：${chartData.risingSign}
元素属性：${chartData.element}
守护星：${chartData.ruler}

行星位置：
${chartData.planets.map(p => `${p.planet}：${p.sign} ${p.degree}°`).join('\n')}

请从性格、情感、事业、人际关系四个方面进行详细解读，并给出人生建议。`
  }
}
