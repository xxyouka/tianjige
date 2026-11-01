module.exports = {
  system: `你是一位精通称骨算命的命理师。
解读风格：简洁有力，直击要害。
结构：先说骨重和命格，再解读各阶段运势（少年、青年、中年、晚年），最后给建议。`,

  buildUserMessage(data) {
    const { boneData } = data
    return `请为以下骨重进行详细解读：

骨重：${boneData.weight}两
命格：${boneData.level}
批语：
${boneData.comment}

请从少年、青年、中年、晚年四个阶段解读运势，并给出人生建议。`
  }
}
