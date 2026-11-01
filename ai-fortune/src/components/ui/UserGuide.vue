<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFocusTrap } from '../../composables/useFocusTrap'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const router = useRouter()
const modalRef = ref(null)
const currentStep = ref(0)

useFocusTrap(modalRef, () => props.show)
const dontShowAgain = ref(false)

const GUIDE_KEY = 'tianjige_guide_seen'

const steps = [
  {
    title: '欢迎来到天机阁',
    icon: '☯',
    description: '这是一个融合中西方命理的 AI 占卜平台，让我们一起探索命运的奥秘。',
    highlight: null
  },
  {
    title: '选择命理方式',
    icon: '☰',
    description: '左侧菜单提供了多种命理方式，包括八字、周易、塔罗牌、星座等，点击即可开始。',
    highlight: 'sidebar'
  },
  {
    title: '快捷搜索',
    icon: '🔍',
    description: '按 Ctrl+K 或 / 键可以快速搜索和导航到任何功能页面。',
    highlight: 'search'
  },
  {
    title: '收藏功能',
    icon: '★',
    description: '将常用的功能收藏，方便下次快速访问。点击菜单项右侧的星标即可收藏。',
    highlight: 'favorites'
  },
  {
    title: '历史记录',
    icon: '📜',
    description: '所有占卜结果都会自动保存，您可以随时查看历史记录并进行对比分析。',
    highlight: 'history'
  },
  {
    title: '个性化设置',
    icon: '⚙️',
    description: '支持深色/浅色主题切换、音效开关和中英文切换，打造专属体验。',
    highlight: 'settings'
  },
  {
    title: '开始探索',
    icon: '✨',
    description: '一切准备就绪！选择一种命理方式，开始您的命运探索之旅吧。',
    highlight: null
  }
]

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    closeGuide()
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function closeGuide() {
  if (dontShowAgain.value) {
    localStorage.setItem(GUIDE_KEY, 'true')
  }
  emit('close')
}

function skipGuide() {
  localStorage.setItem(GUIDE_KEY, 'true')
  emit('close')
}

function handleKeydown(e) {
  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    nextStep()
  } else if (e.key === 'ArrowLeft') {
    prevStep()
  } else if (e.key === 'Escape') {
    closeGuide()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  shouldShow: () => !localStorage.getItem(GUIDE_KEY)
})
</script>

<template>
  <Transition name="guide">
    <div
      v-if="show"
      ref="modalRef"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="closeGuide"
    >
      <div class="bg-dark-card border border-border rounded-2xl max-w-lg w-full mx-4 overflow-hidden shadow-2xl">
        <!-- 顶部进度条 -->
        <div class="h-1 bg-dark">
          <div
            class="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
            :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
          ></div>
        </div>

        <!-- 内容区域 -->
        <div class="p-8">
          <!-- 步骤指示器 -->
          <div class="flex justify-center gap-2 mb-6">
            <div
              v-for="(step, index) in steps"
              :key="index"
              :class="[
                index === currentStep
                  ? 'w-8 bg-gold'
                  : index < currentStep
                    ? 'w-2 bg-gold/50'
                    : 'w-2 bg-dark-lighter',
                'h-2 rounded-full transition-all duration-300'
              ]"
            ></div>
          </div>

          <!-- 图标 -->
          <div class="text-center mb-4">
            <span class="text-5xl inline-block animate-bounce">{{ steps[currentStep].icon }}</span>
          </div>

          <!-- 标题 -->
          <h2 class="text-2xl text-gold font-display text-center mb-3">
            {{ steps[currentStep].title }}
          </h2>

          <!-- 描述 -->
          <p class="text-text-muted text-center leading-relaxed mb-8">
            {{ steps[currentStep].description }}
          </p>

          <!-- 按钮区域 -->
          <div class="flex items-center justify-between">
            <button
              v-if="currentStep > 0"
              @click="prevStep"
              class="px-4 py-2 text-text-muted hover:text-text transition-colors"
            >
              上一步
            </button>
            <button
              v-else
              @click="skipGuide"
              class="px-4 py-2 text-text-muted hover:text-text transition-colors text-sm"
            >
              跳过引导
            </button>

            <div class="flex items-center gap-4">
              <label
                v-if="currentStep === steps.length - 1"
                class="flex items-center gap-2 text-text-muted text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="dontShowAgain"
                  class="rounded border-border bg-dark text-gold focus:ring-gold"
                />
                不再显示
              </label>

              <button
                @click="nextStep"
                class="btn-gold"
              >
                {{ currentStep === steps.length - 1 ? '开始使用' : '下一步' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 底部提示 -->
        <div class="px-8 py-3 bg-dark/50 border-t border-border text-center">
          <span class="text-text-muted text-xs">
            使用 ← → 方向键翻页，Esc 退出
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.guide-enter-active,
.guide-leave-active {
  transition: opacity 0.3s ease;
}

.guide-enter-from,
.guide-leave-to {
  opacity: 0;
}

.guide-enter-active .bg-dark-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.guide-enter-from .bg-dark-card {
  transform: scale(0.95) translateY(10px);
}
</style>
