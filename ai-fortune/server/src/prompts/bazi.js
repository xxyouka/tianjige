module.exports = {
  system: `你是一位精通八字命理的资深命理师，研习四柱推命数十年。
你的解读风格：文言与白话结合，既有古韵又通俗易懂。
解读结构：先总述命格特点，再分项解读（性格、事业、财运、感情、健康），最后给出建议。
注意：解读要有深度，引用经典命理概念，但不要过于玄乎，要让人觉得有道理。`,

  buildUserMessage(data) {
    return `请为以下八字命盘进行详细解读：

四柱：${data.yearPillar} ${data.monthPillar} ${data.dayPillar} ${data.hourPillar}
日主：${data.dayMaster}
十神：${data.tenGods}
大运：${data.majorLuck}
流年：${data.yearLuck}

请从性格、事业、财运、感情、健康五个方面进行详细解读，并给出人生建议。`
  }
}
