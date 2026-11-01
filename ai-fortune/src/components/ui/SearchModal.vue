<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { allFeatures } from '../../constants/features'
import { useFocusTrap } from '../../composables/useFocusTrap'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const router = useRouter()
const modalRef = ref(null)
const searchInput = ref(null)

useFocusTrap(modalRef, () => props.show)
const query = ref('')
const selectedIndex = ref(0)

const menuItems = allFeatures

const filteredItems = computed(() => {
  if (!query.value) return menuItems
  const q = query.value.toLowerCase()
  return menuItems.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.keywords.some(k => k.includes(q))
  )
})

watch(query, () => {
  selectedIndex.value = 0
})

watch(() => props.show, (val) => {
  if (val) {
    query.value = ''
    selectedIndex.value = 0
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})

function navigate(path) {
  router.push(path)
  emit('close')
}

function handleKeydown(e) {
  // modal 关闭时不处理键盘事件
  if (!props.show) return

  if (e.key === 'Escape') {
    emit('close')
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredItems.value.length - 1)
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    return
  }

  if (e.key === 'Enter' && filteredItems.value[selectedIndex.value]) {
    navigate(filteredItems.value[selectedIndex.value].path)
    return
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
    <div v-if="show" ref="modalRef" class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- 搜索框 -->
      <div class="relative w-full max-w-lg mx-4">
        <div class="bg-dark-lighter border border-border rounded-xl shadow-2xl overflow-hidden">
          <!-- 输入框 -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
            <span class="text-gold text-lg">🔍</span>
            <input
              ref="searchInput"
              v-model="query"
              class="flex-1 bg-transparent text-text outline-none placeholder:text-text-muted"
              placeholder="搜索命理功能..."
              aria-label="搜索命理功能"
              autocomplete="off"
            />
            <kbd class="px-2 py-1 text-xs text-text-muted bg-dark rounded border border-border">Esc</kbd>
          </div>

          <!-- 结果列表 -->
          <div class="max-h-[300px] overflow-y-auto py-2">
            <div
              v-for="(item, index) in filteredItems"
              :key="item.path"
              @click="navigate(item.path)"
              @mouseenter="selectedIndex = index"
              :class="[
                selectedIndex === index ? 'bg-dark-card text-gold' : 'text-text',
                'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors'
              ]"
            >
              <span class="text-lg w-6 text-center">{{ item.icon }}</span>
              <span class="text-sm">{{ item.name }}</span>
              <span v-if="selectedIndex === index" class="ml-auto text-xs text-gold">
                <kbd class="px-1 py-0.5 bg-dark rounded text-[10px]">↵</kbd>
              </span>
            </div>

            <div v-if="filteredItems.length === 0" class="px-4 py-8 text-center text-text-muted text-sm">
              未找到匹配的功能
            </div>
          </div>

          <!-- 底部提示 -->
          <div class="px-4 py-2 border-t border-border text-text-muted text-xs flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1 py-0.5 bg-dark rounded text-[10px]">↑</kbd>
              <kbd class="px-1 py-0.5 bg-dark rounded text-[10px]">↓</kbd>
              导航
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1 py-0.5 bg-dark rounded text-[10px]">↵</kbd>
              选择
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1 py-0.5 bg-dark rounded text-[10px]">Esc</kbd>
              关闭
            </span>
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
