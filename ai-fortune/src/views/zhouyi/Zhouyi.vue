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

const question = ref('')
const method = ref('random')
const result = ref(null)

const methods = [
  { value: 'random', label: '随机起卦', desc: '心诚则灵' },
  { value: 'coin', label: '三钱法', desc: '模拟投掷铜钱' },
  { value: 'time', label: '时间起卦', desc: '以当前时间起卦' }
]

async function divine() {
  result.value = null

  const res = await request(({ signal }) =>
    api.divineZhouyi({
      method: method.value,
      question: question.value
    }, { signal })
  )

  if (res) {
    result.value = res
    addRecord({
      type: 'zhouyi',
      summary: question.value || '周易占卜',
      data: { method: method.value, question: question.value }
    })
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="☯"
      title="周易占卜"
      subtitle="心诚则灵，摇卦问事"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="mb-4">
        <label class="block text-text-muted text-sm mb-2">所问之事（可选）</label>
        <input
          v-model="question"
          class="input-ancient"
          placeholder="想问什么就写什么..."
        />
      </div>

      <div class="mb-6">
        <label class="block text-text-muted text-sm mb-2">起卦方式</label>
        <div class="grid grid-cols-3 gap-2 md:gap-3">
          <div
            v-for="m in methods"
            :key="m.value"
            @click="method = m.value"
            :class="[
              method === m.value
                ? 'border-gold bg-dark-card'
                : 'border-border hover:border-gold-dark',
              'p-3 rounded-lg border cursor-pointer transition-all text-center'
            ]"
          >
            <div class="text-text text-sm">{{ m.label }}</div>
            <div class="text-text-muted text-xs mt-1">{{ m.desc }}</div>
          </div>
        </div>
      </div>

      <button @click="divine" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在起卦...' : '开始占卜' }}
      </button>

      <ErrorMessage :message="error" @retry="divine" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在起卦..."
      subtext="心诚则灵"
    />

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 卦象 -->
      <div class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-4 font-display">卦象</h2>

        <div class="grid grid-cols-2 gap-3 md:gap-6 mb-4">
          <div class="text-center bg-dark/50 p-5 rounded-xl border border-border/30">
            <div class="text-text-muted text-xs mb-2">本卦</div>
            <div class="text-4xl mb-2">{{ result.data.hexagram }}</div>
            <div class="text-gold font-display">{{ result.data.hexagramName }}</div>
          </div>
          <div class="text-center bg-dark/50 p-5 rounded-xl border border-border/30">
            <div class="text-text-muted text-xs mb-2">变卦</div>
            <div class="text-4xl mb-2">{{ result.data.changedHexagram }}</div>
            <div class="text-gold font-display">{{ result.data.changedHexagramName }}</div>
          </div>
        </div>

        <div class="text-center mb-4">
          <span class="bg-dark/50 px-4 py-1.5 rounded-full text-sm">
            <span class="text-text-muted">动爻：</span>
            <span class="text-crimson-light font-display">{{ result.data.movingLines }}</span>
          </span>
        </div>

        <!-- 卦象解释 -->
        <div class="bg-dark/50 p-4 rounded-lg border border-border/30">
          <div class="text-gold text-sm mb-2">卦象解读</div>
          <div class="text-text-muted text-sm space-y-1">
            <p>本卦代表当前状况，变卦代表发展趋势</p>
            <p>动爻是变化的关键，提示需要注意的方面</p>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">AI 解卦</h2>
          <ShareButton
            :text="`周易占卜\n\n本卦：${result.data.hexagramName}\n变卦：${result.data.changedHexagramName}\n动爻：${result.data.movingLines}\n\n${result.interpretation}`"
            title="周易占卜 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
