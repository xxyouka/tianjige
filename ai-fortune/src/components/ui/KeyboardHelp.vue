<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFocusTrap } from '../../composables/useFocusTrap'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])
const modalRef = ref(null)

useFocusTrap(modalRef, () => props.show)

const shortcuts = [
  { key: '/', desc: '打开搜索' },
  { key: 'Ctrl + K', desc: '打开搜索' },
  { key: 'H', desc: '返回首页' },
  { key: 'L', desc: '查看历史' },
  { key: '1-9', desc: '快速导航' },
  { key: 'Esc', desc: '关闭弹窗/侧边栏' },
  { key: '?', desc: '显示快捷键帮助' },
]

function handleKeydown(e) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" ref="modalRef" class="fixed inset-0 z-[100] flex items-center justify-center">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- 内容 -->
      <div class="relative w-full max-w-md mx-4">
        <div class="bg-dark-lighter border border-border rounded-xl shadow-2xl overflow-hidden">
          <!-- 标题 -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 class="text-lg text-gold font-display">键盘快捷键</h2>
            <button
              @click="$emit('close')"
              class="text-text-muted hover:text-text p-1 transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- 快捷键列表 -->
          <div class="px-6 py-4 space-y-3">
            <div
              v-for="shortcut in shortcuts"
              :key="shortcut.key"
              class="flex items-center justify-between py-2"
            >
              <span class="text-text text-sm">{{ shortcut.desc }}</span>
              <kbd class="px-3 py-1.5 text-sm bg-dark rounded-lg border border-border text-gold font-mono">
                {{ shortcut.key }}
              </kbd>
            </div>
          </div>

          <!-- 底部 -->
          <div class="px-6 py-3 border-t border-border text-center">
            <p class="text-text-muted text-xs">按 <kbd class="px-1.5 py-0.5 bg-dark rounded text-[10px]">Esc</kbd> 关闭</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active {
  transition: all 0.2s ease-out;
}
.modal-leave-active {
  transition: all 0.15s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(-10px);
}
</style>
