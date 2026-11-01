<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

const actions = [
  { icon: '🔍', label: '搜索', action: () => emit('search'), shortcut: '/' },
  { icon: '🏠', label: '首页', action: () => navigate('/'), shortcut: 'H' },
  { icon: '📜', label: '历史', action: () => navigate('/history'), shortcut: 'L' },
  { icon: '☯', label: '八字', action: () => navigate('/bazi'), shortcut: '1' },
  { icon: '🃏', label: '塔罗', action: () => navigate('/tarot'), shortcut: '2' },
  { icon: '⭐', label: '星座', action: () => navigate('/xingzuo'), shortcut: '3' },
  { icon: '🌙', label: '主题', action: () => emit('theme'), shortcut: 'T' },
  { icon: '❓', label: '帮助', action: () => emit('help'), shortcut: '?' }
]

const emit = defineEmits(['search', 'theme', 'help'])

function navigate(path) {
  router.push(path)
  isOpen.value = false
}

function toggle() {
  isOpen.value = !isOpen.value
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

// 点击外部关闭
function onClickOutside(e) {
  if (!e.target.closest('.quick-actions')) {
    isOpen.value = false
  }
}

import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="quick-actions fixed bottom-6 right-6 z-40">
    <!-- 动作按钮 -->
    <Transition name="actions">
      <div
        v-if="isOpen"
        class="absolute bottom-16 right-0 bg-dark-card border border-border rounded-2xl shadow-2xl p-2 min-w-[200px]"
      >
        <div
          v-for="(action, index) in actions"
          :key="index"
          @click="action.action"
          class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all hover:bg-dark-lighter group"
        >
          <span class="text-lg group-hover:scale-110 transition-transform">{{ action.icon }}</span>
          <span class="text-sm text-text group-hover:text-gold transition-colors flex-1">
            {{ action.label }}
          </span>
          <kbd
            v-if="action.shortcut"
            class="px-2 py-0.5 text-[10px] bg-dark rounded border border-border text-text-muted"
          >
            {{ action.shortcut }}
          </kbd>
        </div>
      </div>
    </Transition>

    <!-- 主按钮 -->
    <button
      @click.stop="toggle"
      :class="[
        'w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center',
        isOpen
          ? 'bg-crimson rotate-45'
          : 'bg-gold hover:bg-gold-light hover:scale-110'
      ]"
      aria-label="快捷操作"
    >
      <span class="text-2xl text-dark">+</span>
    </button>
  </div>
</template>

<style scoped>
.actions-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.actions-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.actions-enter-from,
.actions-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.quick-actions {
  position: fixed;
}
</style>
