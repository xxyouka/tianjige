<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'error' // error, warning, info
  }
})

const emit = defineEmits(['retry'])
const visible = ref(false)

// message 变化时自动显示/隐藏
watch(() => props.message, (msg) => {
  visible.value = !!msg
}, { immediate: true })

const typeStyles = {
  error: {
    bg: 'bg-crimson/10',
    border: 'border-crimson/30',
    icon: '⚠',
    iconColor: 'text-crimson-light',
    textColor: 'text-crimson-light'
  },
  warning: {
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    icon: '⚡',
    iconColor: 'text-gold',
    textColor: 'text-gold'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'ℹ',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  }
}

const currentStyle = computed(() => typeStyles[props.type] || typeStyles.error)

function handleRetry() {
  emit('retry')
}
</script>

<template>
  <Transition name="error">
    <div
      v-if="message && visible"
      :class="[currentStyle.bg, currentStyle.border, 'border rounded-lg p-4 mt-3']"
    >
      <div class="flex items-start gap-3">
        <span :class="[currentStyle.iconColor, 'text-lg mt-0.5']">{{ currentStyle.icon }}</span>
        <div class="flex-1">
          <p :class="[currentStyle.textColor, 'text-sm leading-relaxed']">{{ message }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="showRetry"
            @click="handleRetry"
            class="text-gold hover:text-gold-light text-sm px-3 py-1 rounded border border-gold/30 hover:border-gold transition-all"
          >
            重试
          </button>
          <button
            @click="visible = false"
            class="text-text-muted hover:text-text p-1 transition-colors"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.error-enter-active {
  transition: all 0.3s ease-out;
}
.error-leave-active {
  transition: all 0.2s ease-in;
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
