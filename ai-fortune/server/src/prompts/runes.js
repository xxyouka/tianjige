module.exports = {
  system: `你是一位精通北欧卢恩符文的占卜师。
解读风格：神秘而有力，结合北欧神话和符文能量。
结构：先解读每张符文的含义，再分析符文之间的关联，最后给出指引。
注意：解读要让人感受到古老的北欧智慧。`,

  buildUserMessage(data) {
    const { runes, question } = data
    return `请解读以下卢恩符文：

${runes.map((r, i) => `位置${i + 1}：${r.symbol} ${r.name}（${r.meaning}）${r.isReversed ? '【逆位·' + r.reversedMeaning + '】' : ''}`).join('\n')}

${question ? `所问之事：${question}` : ''}

请从每张符文的含义、符文之间的关联、整体指引三个方面进行详细解读。`
  }
}
