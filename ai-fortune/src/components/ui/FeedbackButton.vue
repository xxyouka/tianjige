<script setup>
import { ref, onUnmounted } from 'vue'

const isOpen = ref(false)
const feedbackType = ref('suggestion')
const feedbackText = ref('')
const email = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
let autoCloseTimer = null

onUnmounted(() => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
})

const feedbackTypes = [
  { value: 'suggestion', label: '建议', icon: '💡' },
  { value: 'bug', label: '问题', icon: '🐛' },
  { value: 'praise', label: '表扬', icon: '👍' },
  { value: 'other', label: '其他', icon: '💬' }
]

async function submitFeedback() {
  if (!feedbackText.value.trim()) return

  isSubmitting.value = true

  try {
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 这里应该是实际的API调用
    // await fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     type: feedbackType.value,
    //     text: feedbackText.value,
    //     email: email.value
    //   })
    // })

    isSubmitted.value = true

    // 3秒后关闭
    autoCloseTimer = setTimeout(() => {
      isOpen.value = false
      isSubmitted.value = false
      feedbackText.value = ''
      email.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to submit feedback:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="feedback-button">
    <!-- 触发按钮 -->
    <button
      @click="isOpen = true"
      class="fixed bottom-6 left-6 z-40 w-12 h-12 bg-dark-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
      aria-label="反馈"
    >
      <span class="text-xl">💬</span>
    </button>

    <!-- 反馈弹窗 -->
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        @click.self="isOpen = false"
      >
        <div class="bg-dark-card border border-border rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl">
          <!-- 标题栏 -->
          <div class="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 class="text-xl text-gold font-display">意见反馈</h2>
            <button
              @click="isOpen = false"
              class="text-text-muted hover:text-text transition-colors p-1"
            >
              ✕
            </button>
          </div>

          <!-- 内容区域 -->
          <div class="p-6">
            <!-- 提交成功 -->
            <div v-if="isSubmitted" class="text-center py-8">
              <span class="text-5xl mb-4 block">🎉</span>
              <h3 class="text-xl text-gold mb-2">感谢您的反馈！</h3>
              <p class="text-text-muted">您的意见对我们非常重要</p>
            </div>

            <!-- 反馈表单 -->
            <form v-else @submit.prevent="submitFeedback">
              <!-- 反馈类型 -->
              <div class="mb-6">
                <label class="block text-sm text-text-muted mb-3">反馈类型</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="type in feedbackTypes"
                    :key="type.value"
                    type="button"
                    @click="feedbackType = type.value"
                    :class="[
                      'p-3 rounded-xl border transition-all text-left',
                      feedbackType === type.value
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-border hover:border-gold/30 text-text-muted'
                    ]"
                  >
                    <span class="mr-2">{{ type.icon }}</span>
                    <span class="text-sm">{{ type.label }}</span>
                  </button>
                </div>
              </div>

              <!-- 反馈内容 -->
              <div class="mb-6">
                <label class="block text-sm text-text-muted mb-2">反馈内容</label>
                <textarea
                  v-model="feedbackText"
                  rows="4"
                  class="w-full px-4 py-3 bg-dark border border-border rounded-xl focus:outline-none focus:border-gold text-text resize-none"
                  placeholder="请详细描述您的反馈..."
                  required
                ></textarea>
              </div>

              <!-- 邮箱 -->
              <div class="mb-6">
                <label class="block text-sm text-text-muted mb-2">邮箱（可选）</label>
                <input
                  v-model="email"
                  type="email"
                  class="w-full px-4 py-3 bg-dark border border-border rounded-xl focus:outline-none focus:border-gold text-text"
                  placeholder="your@email.com"
                />
              </div>

              <!-- 提交按钮 -->
              <button
                type="submit"
                :disabled="!feedbackText.trim() || isSubmitting"
                class="w-full btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? '提交中...' : '提交反馈' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
