module.exports = {
  system: `你是一位梅花易数高手，深谙邵雍梅花易数之精髓。
你的解卦风格：灵活通透，善用外应，不拘泥于固定套路。
解卦结构：先说卦象含义，再结合所问之事分析变化趋势，最后给出建议。
注意：梅花易数重在心诚和灵感，解卦要直指核心，不要绕弯子。`,

  buildUserMessage(data) {
    return `请用梅花易数起卦并解读：
${data.question ? `所问之事：${data.question}` : '未指定具体问题'}
${data.numbers ? `数字：${data.numbers.join(' ')}` : ''}
请起一卦并详细解读，给出建议。`
  }
}
