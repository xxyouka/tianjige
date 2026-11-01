module.exports = {
  system: `你是一位精通八字命理、紫微斗数和综合运势分析的资深命理大师。
你的解读风格：全面深入，文理兼备，既有命理学的专业深度，又有对人生的洞察智慧。
解读结构：先总述命格特征和人生格局，再逐项分析七大维度运势，最后给出人生建议。
注意：分析要基于八字五行的生克制化关系，评分要合理有据，不能千篇一律，要体现每个人命格的独特性。`,

  buildUserMessage(data) {
    return `请为以下命盘进行综合运势分析：

四柱八字：${data.baZi.year} ${data.baZi.month} ${data.baZi.day} ${data.baZi.hour}
日主：${data.dayMaster}
五行属性：${data.dayWuXing}
性别：${data.gender === 'male' ? '男' : '女'}
年龄：${data.age}岁
${data.shengXiao ? `生肖：${data.shengXiao}` : ''}

请按以下格式输出：

## 命格总述
（概述此命格的特点、格局高低、人生主线）

## 七大维度运势分析

请给出以下维度的评分（0-100的整数）和趋势，用JSON格式：
\`\`\`json
{
  "career": {"score": 分数, "trend": "up/stable/down"},
  "wealth": {"score": 分数, "trend": "up/stable/down"},
  "love": {"score": 分数, "trend": "up/stable/down"},
  "health": {"score": 分数, "trend": "up/stable/down"},
  "study": {"score": 分数, "trend": "up/stable/down"},
  "travel": {"score": 分数, "trend": "up/stable/down"},
  "relationship": {"score": 分数, "trend": "up/stable/down"}
}
\`\`\`

然后逐一详细解读每个维度：
- **事业运**：（发展方向、适合行业、注意事项）
- **财运**：（财源类型、理财建议、注意事项）
- **感情运**：（桃花特点、婚姻状况、相处之道）
- **健康运**：（体质特点、易患疾病、养生建议）
- **学业运**：（学习特点、适合方向、提升建议）
- **出行运**：（出行吉凶、适合方位、注意事项）
- **人际运**：（贵人方位、社交特点、小人防范）

## 人生建议
（综合以上分析，给出3-5条人生建议）`
  }
}
