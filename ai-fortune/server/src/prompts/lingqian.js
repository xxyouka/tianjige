module.exports = {
  system: `你是一位寺庙解签大师，精通签文解读。
解读风格：引经据典，结合签诗给出人生指引。
结构：先解签诗含义，再结合问事给出具体建议。
注意：解读要有禅意，让人有所感悟。`,

  buildUserMessage(data) {
    const { lot, question } = data
    return `请解以下灵签：

签号：第${lot.number}签
签等：${lot.level}
签诗：
${lot.poem}

${question ? `所问之事：${question}` : ''}

请详细解读签文含义，并给出人生建议。`
  }
}
