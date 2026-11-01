<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)
const errorInfo = ref('')

onErrorCaptured((err, instance, info) => {
  error.value = err
  errorInfo.value = info

  // 阻止错误继续传播
  return false
})

function resetError() {
  error.value = null
  errorInfo.value = ''
}
</script>

<template>
  <div v-if="error" class="min-h-[200px] flex items-center justify-center p-8" role="alert">
    <div class="card-ancient p-8 max-w-md w-full text-center">
      <!-- 错误图标 -->
      <div class="text-5xl mb-4">⚠️</div>

      <!-- 错误标题 -->
      <h2 class="text-xl text-gold font-display mb-3">出现了一些问题</h2>

      <!-- 错误描述 -->
      <p class="text-text-muted text-sm mb-6">
        抱歉，页面遇到了意外错误。请尝试刷新页面或联系管理员。
      </p>

      <!-- 错误详情（开发模式） -->
      <details v-if="error && import.meta.env.DEV" class="mb-6 text-left">
        <summary class="text-text-muted text-xs cursor-pointer hover:text-text transition-colors">
          查看错误详情
        </summary>
        <div class="mt-2 p-3 bg-dark rounded-lg text-xs text-crimson-light font-mono overflow-auto max-h-[200px]">
          <p class="mb-2">{{ error.message }}</p>
          <pre v-if="error.stack" class="whitespace-pre-wrap">{{ error.stack }}</pre>
        </div>
      </details>

      <!-- 操作按钮 -->
      <div class="flex gap-3 justify-center">
        <button @click="resetError" class="btn-gold">
          重试
        </button>
        <button @click="$router.push('/')" class="btn-outline">
          返回首页
        </button>
      </div>
    </div>
  </div>

  <slot v-else />
</template>
