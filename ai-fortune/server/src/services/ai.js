const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: 'https://token-plan-cn.xiaomimimo.com/anthropic'
})

async function askAI(systemPrompt, userMessage, maxRetries = 1) {
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 60000)

    try {
      const response = await client.messages.create({
        model: 'mimo-v2.5',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      }, { signal: controller.signal })

      const textBlock = response.content.find(block => block.type === 'text')
      if (!textBlock || !textBlock.text) {
        throw new Error('AI 未返回有效内容')
      }
      return textBlock.text
    } catch (err) {
      lastError = err

      if (err.name === 'AbortError') {
        lastError = new Error('AI 响应超时，请稍后重试')
      }

      // 如果还有重试机会，等待一小段时间后重试
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)))
        continue
      }
    } finally {
      clearTimeout(timer)
    }
  }

  throw lastError
}

module.exports = { askAI }
