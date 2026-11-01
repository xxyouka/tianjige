<script setup>
import { ref, computed, onMounted } from 'vue'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import AnimateIn from '../../components/ui/AnimateIn.vue'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'
import { api } from '../../services/api'
import { signIcons } from '../../constants'
import { signDetails, elementColors } from '../../constants/xingzuo'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const signs = ref([])
const selectedSign = ref('')
const period = ref('今日')
const result = ref(null)

const periods = ['今日', '本周', '本月']

const currentSignDetail = computed(() => {
  return selectedSign.value ? signDetails[selectedSign.value] : null
})

onMounted(async () => {
  try {
    const res = await api.getSigns()
    signs.value = res.signs
  } catch (err) {
    error.value = '获取星座列表失败'
  }
})

async function predict() {
  if (!selectedSign.value) {
    error.value = '请选择星座'
    return
  }

  result.value = null

  const res = await request(({ signal }) =>
    api.predictXingzuo({
      sign: selectedSign.value,
      period: period.value
    }, { signal })
  )

  if (res) {
    result.value = res
    addRecord({
      type: 'xingzuo',
      summary: `${selectedSign.value} ${period.value}运势`,
      data: { sign: selectedSign.value, period: period.value }
    })
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="⭐"
      title="星座运势"
      subtitle="十二星座运势，每日更新"
    />

    <!-- 星座选择 -->
    <div class="card-ancient p-6 mb-6">
      <h2 class="text-lg text-gold mb-4">选择星座</h2>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-3 mb-6">
        <div
          v-for="sign in signs"
          :key="sign"
          @click="selectedSign = sign"
          :class="[
            selectedSign === sign
              ? 'border-gold bg-dark-card glow-gold'
              : 'border-border hover:border-gold-dark',
            'p-3 rounded-lg border cursor-pointer transition-all text-center'
          ]"
        >
          <div class="text-2xl mb-1">{{ signIcons[sign] }}</div>
          <div class="text-xs text-text">{{ sign }}</div>
        </div>
      </div>

      <!-- 时间范围 -->
      <div class="mb-6">
        <label class="block text-text-muted text-sm mb-2">时间范围</label>
        <div class="flex gap-3">
          <button
            v-for="p in periods"
            :key="p"
            @click="period = p"
            :class="[
              period === p ? 'btn-gold' : 'btn-outline',
              'flex-1'
            ]"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <button @click="predict" :disabled="loading || !selectedSign" class="btn-gold w-full">
        {{ loading ? '正在获取运势...' : '查看运势' }}
      </button>

      <ErrorMessage :message="error" @retry="predict" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在获取运势..."
      subtext="请稍候"
    />

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 星座信息 -->
      <div class="card-ancient p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl">{{ signIcons[result.data.sign] }}</span>
            <div>
              <h2 class="text-2xl text-gold font-display">{{ result.data.sign }}</h2>
              <p class="text-text-muted text-sm">{{ result.data.period }}运势 · {{ result.data.date }}</p>
            </div>
          </div>
          <ShareButton
            :text="`${result.data.sign} ${result.data.period}运势\n\n${result.interpretation}`"
            title="星座运势 - 天机阁"
          />
        </div>

        <!-- 星座详情 -->
        <div v-if="currentSignDetail" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">日期范围</div>
            <div class="text-gold text-sm">{{ currentSignDetail.date }}</div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">元素</div>
            <div class="text-sm" :class="elementColors[currentSignDetail.element]">{{ currentSignDetail.element }}</div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">守护星</div>
            <div class="text-gold text-sm">{{ currentSignDetail.planet }}</div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">幸运数</div>
            <div class="text-gold text-sm">{{ currentSignDetail.lucky.join(', ') }}</div>
          </div>
        </div>
        <div v-if="currentSignDetail" class="mt-3 bg-dark/50 p-3 rounded-lg border border-border/30">
          <span class="text-text-muted text-sm">性格特点：</span>
          <span class="text-text text-sm">{{ currentSignDetail.trait }}</span>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
