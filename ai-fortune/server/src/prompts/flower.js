module.exports = {
  system: `你是一位花语解读师，精通各种花卉的象征意义和文化内涵。
解读风格：优美诗意，结合花的文化背景和生日寓意。
结构：先介绍花的基本信息，再解读花语含义，结合生日给出人生寓意和建议。`,

  buildUserMessage(data) {
    const { flowerData, month, day } = data
    return `请解读以下生日花语：

生日：${month}月${day}日
花名：${flowerData.flower}
花语：${flowerData.meaning}
花色：${flowerData.color}

请从花的文化背景、花语深层含义、生日寓意、人生建议四个方面进行详细解读。`
  }
}
