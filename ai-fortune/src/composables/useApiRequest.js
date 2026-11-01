import { ref, onUnmounted } from 'vue'

/**
 * 封装 API 请求的 loading/error/timeout/abort 逻辑
 * 组件卸载时自动取消请求
 * @param {number} [timeoutMs=60000] - 超时毫秒数
 */
export function useApiRequest(timeoutMs = 60000) {
  const loading = ref(false)
  const error = ref('')
  let abortController = null
  let timeoutTimer = null

  /**
   * 执行请求
   * @param {Function} fn - 返回 Promise 的函数，接收 { signal } 参数
   * @returns {Promise<any>}
   */
  async function request(fn) {
    cancel()

    loading.value = true
    error.value = ''

    abortController = new AbortController()
    timeoutTimer = setTimeout(() => {
      abortController.abort()
      loading.value = false
      error.value = '请求超时，请稍后重试'
    }, timeoutMs)

    try {
      const result = await fn({ signal: abortController.signal })
      return result
    } catch (err) {
      if (err.name === 'AbortError') {
        if (!error.value) error.value = '请求已取消'
      } else {
        error.value = err.message
      }
      return null
    } finally {
      clearTimeout(timeoutTimer)
      loading.value = false
    }
  }

  function cancel() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    if (timeoutTimer) {
      clearTimeout(timeoutTimer)
      timeoutTimer = null
    }
  }

  // 组件卸载时自动取消未完成的请求
  onUnmounted(() => {
    cancel()
  })

  return { loading, error, request, cancel }
}
