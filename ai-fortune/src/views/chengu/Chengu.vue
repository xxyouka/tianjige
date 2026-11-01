<script setup>
import { ref, onUnmounted } from 'vue'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import AnimateIn from '../../components/ui/AnimateIn.vue'
import { useHistory } from '../../composables/useHistory'
import { useBirthDate } from '../../composables/useBirthDate'
import { useApiRequest } from '../../composables/useApiRequest'
import { api } from '../../services/api'

const { addRecord } = useHistory()
const { year, month, day, hour, years, months, days, hours } = useBirthDate()
const { loading, error, request } = useApiRequest()

const result = ref(null)
const weighing = ref(false)
const weightDisplay = ref(0)

let weighInterval = null

function clearWeighInterval() {
  if (weighInterval) {
    clearInterval(weighInterval)
    weighInterval = null
  }
}

async function calculate() {
  if (!year.value || !month.value || !day.value || hour.value === '') {
    error.value = '请填写完整的出生时间'
    return
  }

  clearWeighInterval()
  result.value = null
  weighing.value = true
  weightDisplay.value = 0

  const data = await request(({ signal }) =>
    api.calculateChengu({
      year: parseInt(year.value),
      month: parseInt(month.value),
      day: parseInt(day.value),
      hour: parseInt(hour.value)
    }, { signal })
  )

  if (!data) {
    weighing.value = false
    return
  }

  const targetWeight = parseFloat(data.data.weight)
  if (isNaN(targetWeight)) {
    error.value = '计算结果异常'
    weighing.value = false
    return
  }

  const duration = 2000
  const steps = 30
  const increment = targetWeight / steps
  let current = 0

  weighInterval = setInterval(() => {
    current += increment
    if (current >= targetWeight) {
      current = targetWeight
      clearWeighInterval()
      weighing.value = false
      result.value = data
      addRecord({
        type: 'chengu',
        summary: `${year.value}年${month.value}月${day.value}日${hour.value}时 称骨算命`,
        data: { year: year.value, month: month.value, day: day.value, hour: hour.value }
      })
    }
    weightDisplay.value = current.toFixed(1)
  }, duration / steps)
}

onUnmounted(() => {
  clearWeighInterval()
})
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="⚖"
      title="称骨算命"
      subtitle="袁天罡称骨，骨重定命运"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-text-muted text-sm mb-1">年份</label>
          <select v-model="year" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">月份</label>
          <select v-model="month" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">日期</label>
          <select v-model="day" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">时辰</label>
          <select v-model="hour" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="h in hours" :key="h" :value="h">{{ h }}时</option>
          </select>
        </div>
      </div>

      <button @click="calculate" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在称骨...' : '称骨算命' }}
      </button>

      <ErrorMessage :message="error" @retry="calculate" />
    </div>

    <!-- 称重动画 -->
    <div v-if="weighing" class="card-ancient p-8 mb-6">
      <div class="flex flex-col items-center">
        <!-- 秤 -->
        <div class="relative mb-6">
          <!-- 秤杆 -->
          <div class="w-64 h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full"></div>
          <!-- 秤砣 -->
          <div
            class="absolute top-0 w-6 h-6 bg-gold rounded-full -mt-2 transition-all duration-100"
            :style="{ left: `${(weightDisplay / 7.2) * 100}%` }"
          ></div>
          <!-- 秤盘 -->
          <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-full"></div>
        </div>

        <div class="text-4xl text-gold font-display mt-8">{{ weightDisplay }} 两</div>
        <div class="text-text-muted text-sm mt-2">称骨中...</div>
      </div>
    </div>

    <!-- 结果 -->
    <AnimateIn v-if="result && !weighing">
      <!-- 骨重信息 -->
      <div class="card-ancient p-6 mb-6">
        <div class="text-center mb-6">
          <div class="text-3xl md:text-5xl text-gold font-display mb-2">{{ result.data.weight }} 两</div>
          <div :class="[
            result.data.level.includes('大富') || result.data.level.includes('荣华') ? 'text-green-500' :
            result.data.level.includes('先苦') || result.data.level.includes('少年') ? 'text-yellow-500' :
            'text-red-500',
            'text-xl font-display'
          ]">
            {{ result.data.level }}
          </div>
        </div>

        <div class="bg-dark p-4 rounded-lg mb-4">
          <div class="text-text-muted text-sm mb-2">骨重构成</div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
            <div>
              <div class="text-text-muted">年重</div>
              <div class="text-gold">{{ result.data.yearWeight }}</div>
              <div class="text-text-muted text-xs">（{{ result.data.zodiac }}）</div>
            </div>
            <div>
              <div class="text-text-muted">月重</div>
              <div class="text-gold">{{ result.data.monthWeight }}</div>
            </div>
            <div>
              <div class="text-text-muted">日重</div>
              <div class="text-gold">{{ result.data.dayWeight }}</div>
            </div>
            <div>
              <div class="text-text-muted">时重</div>
              <div class="text-gold">{{ result.data.hourWeight }}</div>
            </div>
          </div>
        </div>

        <div class="bg-dark p-4 rounded-lg">
          <div class="text-text leading-relaxed whitespace-pre-line text-sm font-display">{{ result.data.comment }}</div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">AI 详解</h2>
          <ShareButton
            :text="`称骨算命\n\n骨重：${result.data.weight}两\n${result.data.level}\n\n${result.interpretation}`"
            title="称骨算命 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
