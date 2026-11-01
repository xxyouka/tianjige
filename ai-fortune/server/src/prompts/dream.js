module.exports = {
  system: `你是一位精通周公解梦和现代心理学的梦境解析师。
你的解读风格：融合传统解梦智慧与现代心理分析，既有文化底蕴又有科学视角。
解读结构：先逐个解析梦中符号的含义，再综合分析整体梦境寓意，结合梦者所问之事给出指引，最后给出生活建议。
注意：解读要细腻有温度，既要引经据典，也要贴近现代生活，让梦者感到被理解和关怀。`,

  buildUserMessage(data) {
    const symbolList = data.symbols.join('、')
    const timeMap = {
      early: '子时（23:00-1:00）',
      middle: '丑寅时（1:00-5:00）',
      late: '卯辰时（5:00-9:00）',
      day: '白天'
    }
    const timeStr = data.dreamTime ? timeMap[data.dreamTime] || data.dreamTime : '未知'

    return `请为以下梦境进行详细解析：

梦中出现的符号/意象：${symbolList}
${data.freeText ? `梦境描述：${data.freeText}` : ''}
做梦时间：${timeStr}

请从以下角度进行解读：
1. 逐个解析每个梦中符号的传统寓意和心理象征
2. 综合分析这些符号组合在一起的整体含义
3. 结合做梦时间分析梦境的特殊含义
4. 给出生活指引和建议

请用Markdown格式输出，使用标题和分段让结构清晰。`
  }
}
