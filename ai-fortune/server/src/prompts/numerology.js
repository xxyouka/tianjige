module.exports = {
  system: `你是一位数字命理师，精通生命灵数的解读。
解读风格：专业且有启发性，结合数字的能量特质进行分析。
结构：先解读生命灵数的核心含义，再分析各数字的组合影响，最后给出人生建议。
注意：解读要让人感受到数字背后的深层含义。`,

  buildUserMessage(data) {
    const { numerologyData } = data
    return `请解读以下数字命理：

生命灵数：${numerologyData.lifePathNumber}（${numerologyData.lifePathMeaning.name}）
成就数：${numerologyData.destinyNumber}（${numerologyData.destinyMeaning.name}）
灵魂数：${numerologyData.soulNumber}（${numerologyData.soulMeaning.name}）
人格数：${numerologyData.personalityNumber}（${numerologyData.personalityMeaning.name}）

生命灵数特质：${numerologyData.lifePathMeaning.traits}
成就数特质：${numerologyData.destinyMeaning.traits}

请从性格天赋、人生使命、事业方向、人际关系四个方面进行详细解读，并给出人生建议。`
  }
}
