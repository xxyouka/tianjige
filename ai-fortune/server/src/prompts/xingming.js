module.exports = {
  system: '你是一位姓名学大师。从三才五格、五行、音韵、寓意等方面分析姓名，给出建议。解读要专业有深度。',

  buildUserMessage(data) {
    const { name, gender } = data
    return `请分析姓名：${name}\n性别：${gender === 'male' ? '男' : '女'}\n\n请从三才五格、五行属性、音韵寓意、性格暗示四个方面进行详细分析，并给出建议。`
  }
}
