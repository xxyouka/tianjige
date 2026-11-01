<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let toastId = 0

function addToast(message, type = 'info', duration = 3000) {
  const id = ++toastId
  // 限制最多 5 个 toast
  if (toasts.value.length >= 5) {
    const oldest = toasts.value[0]
    removeToast(oldest.id)
  }
  toasts.value.push({ id, message, type, visible: true })

  setTimeout(() => {
    removeToast(id)
  }, duration)
}

function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value[index].visible = false
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 300)
  }
}

// 暴露方法给父组件
defineExpose({
  addToast,
  success: (msg) => addToast(msg, 'success'),
  error: (msg) => addToast(msg, 'error', 5000),
  warning: (msg) => addToast(msg, 'warning', 4000),
  info: (msg) => addToast(msg, 'info')
})

const typeStyles = {
  success: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    icon: '✓',
    iconColor: 'text-green-400'
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    icon: '✕',
    iconColor: 'text-red-400'
  },
  warning: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    icon: '⚡',
    iconColor: 'text-yellow-400'
  },
  info: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    icon: 'ℹ',
    iconColor: 'text-blue-400'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm" role="alert" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          typeStyles[toast.type].bg,
          typeStyles[toast.type].border,
          'border rounded-lg p-4 shadow-lg backdrop-blur-sm cursor-pointer'
        ]"
        @click="removeToast(toast.id)"
      >
        <div class="flex items-center gap-3">
          <span :class="[typeStyles[toast.type].iconColor, 'text-lg']">
            {{ typeStyles[toast.type].icon }}
          </span>
          <p class="text-text text-sm flex-1">{{ toast.message }}</p>
          <button
            class="text-text-muted hover:text-text p-1 transition-colors"
            aria-label="关闭"
            @click.stop="removeToast(toast.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
