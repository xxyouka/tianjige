<script setup>
import { ref } from 'vue'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import AnimateIn from '../../components/ui/AnimateIn.vue'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'
import { api } from '../../services/api'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const method = ref('number')
const numbers = ref('')
const question = ref('')
const result = ref(null)

const methods = [
  { id: 'number', name: '数字起卦', desc: '输入两个数字' },
  { id: 'time', name: '时间起卦', desc: '以当前时间起卦' },
  { id: 'random', name: '随机起卦', desc: '心诚则灵' },
]

async function divine() {
  if (method.value === 'number') {
    const parts = numbers.value.trim().split(/\s+/).map(Number)
    if (parts.length < 2 || parts.some(isNaN)) {
      error.value = '请输入两个数字，用空格分隔'
      return
    }
  }

  result.value = null

  const body = {
    method: method.value,
    question: question.value
  }
  if (method.value === 'number') {
    body.numbers = numbers.value.trim().split(/\s+/).map(Number)
  }

  const data = await request(({ signal }) => api.divineMeihua(body, { signal }))

  if (data) {
    result.value = data
    addRecord({
      type: 'meihua',
      summary: question.value || '梅花易数',
      data: { method: method.value, question: question.value }
    })
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="🌸"
      title="梅花易数"
      subtitle="心有所感，卦由心生"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="mb-4">
        <label class="block text-text-muted text-sm mb-2">起卦方式</label>
        <div class="grid grid-cols-3 gap-2 md:gap-3">
          <div
            v-for="m in methods"
            :key="m.id"
            @click="method = m.id"
            :class="[
              method === m.id
                ? 'border-gold bg-dark-card'
                : 'border-border hover:border-gold-dark',
              'p-3 rounded-lg border cursor-pointer transition-all text-center'
            ]"
          >
            <div class="text-text text-sm">{{ m.name }}</div>
            <div class="text-text-muted text-xs mt-1">{{ m.desc }}</div>
          </div>
        </div>
      </div>

      <div v-if="method === 'number'" class="mb-4">
        <label class="block text-text-muted text-sm mb-2">输入两个数字（用空格分隔）</label>
        <input v-model="numbers" class="input-ancient" placeholder="例如：3 7" />
      </div>

      <div class="mb-4">
        <label class="block text-text-muted text-sm mb-2">所问之事（选填）</label>
        <input v-model="question" class="input-ancient" placeholder="心中所想..." />
      </div>

      <button @click="divine" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在起卦...' : '起卦' }}
      </button>

      <ErrorMessage :message="error" @retry="divine" />
    </div>

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 卦象 -->
      <div class="card-ancient p-6 mb-6">
        <div class="grid grid-cols-2 gap-3 md:gap-6 text-center">
          <div>
            <div class="text-text-muted text-sm mb-2">本卦</div>
            <div class="text-4xl mb-2">{{ result.data.hexagram }}</div>
            <div class="text-gold">{{ result.data.hexagramName }}</div>
          </div>
          <div>
            <div class="text-text-muted text-sm mb-2">变卦</div>
            <div class="text-4xl mb-2">{{ result.data.changedHexagram }}</div>
            <div class="text-gold">{{ result.data.changedHexagramName }}</div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <span class="text-text-muted text-sm">动爻：</span>
          <span class="text-crimson-light">{{ result.data.movingLines }}</span>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">梅花解卦</h2>
          <ShareButton
            :text="`梅花易数\n\n本卦：${result.data.hexagramName}\n变卦：${result.data.changedHexagramName}\n动爻：${result.data.movingLines}\n\n${result.interpretation}`"
            title="梅花易数 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
