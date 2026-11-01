<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCustomTheme } from '../../composables/useCustomTheme'
import { useFocusTrap } from '../../composables/useFocusTrap'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])
const modalRef = ref(null)

useFocusTrap(modalRef, () => props.show)

const {
  currentTheme,
  loadTheme,
  setThemeColor,
  applyPreset,
  resetTheme,
  getPresetThemes
} = useCustomTheme()

const presets = getPresetThemes()
const activeTab = ref('presets')

const colorFields = [
  { key: 'primary', label: '主色调', icon: '🎨' },
  { key: 'accent', label: '强调色', icon: '✨' },
  { key: 'background', label: '背景色', icon: '🖼️' },
  { key: 'card', label: '卡片色', icon: '🃏' },
  { key: 'text', label: '文字色', icon: '📝' },
  { key: 'textMuted', label: '次要文字', icon: '📄' }
]

function handleColorChange(key, event) {
  setThemeColor(key, event.target.value)
}

function handleReset() {
  if (confirm('确定要重置为默认主题吗？')) {
    resetTheme()
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  loadTheme()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="modal">
    <div
      v-if="show"
      ref="modalRef"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="bg-dark-card border border-border rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl">
        <!-- 标题栏 -->
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 class="text-xl text-gold font-display">主题自定义</h2>
          <button
            @click="$emit('close')"
            class="text-text-muted hover:text-text transition-colors p-1"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <!-- 选项卡 -->
        <div class="flex border-b border-border">
          <button
            @click="activeTab = 'presets'"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors',
              activeTab === 'presets'
                ? 'text-gold border-b-2 border-gold'
                : 'text-text-muted hover:text-text'
            ]"
          >
            预设主题
          </button>
          <button
            @click="activeTab = 'custom'"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors',
              activeTab === 'custom'
                ? 'text-gold border-b-2 border-gold'
                : 'text-text-muted hover:text-text'
            ]"
          >
            自定义颜色
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="p-6 max-h-[60vh] overflow-y-auto">
          <!-- 预设主题 -->
          <div v-if="activeTab === 'presets'" class="grid grid-cols-2 gap-3">
            <button
              v-for="preset in presets"
              :key="preset.key"
              @click="applyPreset(preset.key)"
              class="p-4 rounded-xl border border-border hover:border-gold transition-all text-left group"
            >
              <!-- 颜色预览 -->
              <div class="flex gap-2 mb-3">
                <div
                  class="w-6 h-6 rounded-full"
                  :style="{ backgroundColor: preset.preview.primary }"
                ></div>
                <div
                  class="w-6 h-6 rounded-full"
                  :style="{ backgroundColor: preset.preview.background }"
                ></div>
                <div
                  class="w-6 h-6 rounded-full"
                  :style="{ backgroundColor: preset.preview.card }"
                ></div>
              </div>
              <span class="text-sm text-text group-hover:text-gold transition-colors">
                {{ preset.name }}
              </span>
            </button>
          </div>

          <!-- 自定义颜色 -->
          <div v-else class="space-y-4">
            <div
              v-for="field in colorFields"
              :key="field.key"
              class="flex items-center gap-4"
            >
              <span class="text-lg">{{ field.icon }}</span>
              <span class="text-sm text-text flex-1">{{ field.label }}</span>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  :value="currentTheme[field.key]"
                  @input="handleColorChange(field.key, $event)"
                  class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <span class="text-xs text-text-muted font-mono">
                  {{ currentTheme[field.key] }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="px-6 py-4 border-t border-border flex justify-between">
          <button
            @click="handleReset"
            class="text-sm text-text-muted hover:text-crimson transition-colors"
          >
            重置默认
          </button>
          <button
            @click="$emit('close')"
            class="btn-gold text-sm"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  </Transition>
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

input[type="color"] {
  -webkit-appearance: none;
  border: none;
  padding: 0;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
