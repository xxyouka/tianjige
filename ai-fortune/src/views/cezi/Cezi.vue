<script setup>
import { ref } from 'vue'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import AnimateIn from '../../components/ui/AnimateIn.vue'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'
import { api } from '../../services/api'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const character = ref('')
const question = ref('')
const result = ref(null)
const animating = ref(false)

async function analyze() {
  if (!character.value || character.value.length !== 1) {
    error.value = '请输入一个汉字'
    return
  }

  result.value = null
  animating.value = true

  const res = await request(({ signal }) =>
    Promise.all([
      api.analyzeCezi({
        character: character.value,
        question: question.value
      }, { signal }),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]).then(([data]) => data)
  )

  animating.value = false

  if (res) {
    result.value = res
    addRecord({
      type: 'cezi',
      summary: `测字：${character.value}`,
      data: { character: character.value, question: question.value }
    })
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="字"
      title="测字"
      subtitle="一字定乾坤，拆字知吉凶"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-text-muted text-sm mb-2">输入一个汉字</label>
          <input
            v-model="character"
            class="input-ancient text-2xl text-center"
            maxlength="1"
            placeholder="字"
          />
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-2">所问之事（选填）</label>
          <input
            v-model="question"
            class="input-ancient"
            placeholder="想问什么..."
          />
        </div>
      </div>

      <button @click="analyze" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在测字...' : '测字' }}
      </button>

      <ErrorMessage :message="error" @retry="analyze" />
    </div>

    <!-- 拆字动画 -->
    <div v-if="animating" class="flex justify-center py-12">
      <div class="relative">
        <div class="text-8xl text-gold animate-split">{{ character }}</div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 border-2 border-gold rounded-full animate-ping opacity-30"></div>
        </div>
      </div>
    </div>

    <!-- 结果 -->
    <AnimateIn v-if="result && !animating">
      <!-- 测字展示 -->
      <div class="card-ancient p-6 mb-6">
        <div class="text-center">
          <div class="text-8xl text-gold mb-4 font-display">{{ result.data.character }}</div>
          <div class="text-text-muted text-sm">测字结果</div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">解字</h2>
          <ShareButton
            :text="`测字\n\n字：${result.data.character}\n\n${result.interpretation}`"
            title="测字 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>

<style scoped>
@keyframes split {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; letter-spacing: 20px; }
  100% { transform: scale(1); opacity: 1; letter-spacing: 0; }
}

.animate-split {
  animation: split 1.5s ease-in-out;
}
</style>
