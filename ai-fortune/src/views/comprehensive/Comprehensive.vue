<script setup>
import { ref } from 'vue'
import StarField from '../../components/ui/StarField.vue'
import MdRender from '../../components/fortune/MdRender.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import { api } from '../../services/api'
import { useHistory } from '../../composables/useHistory'
import { useBirthDate } from '../../composables/useBirthDate'
import { useApiRequest } from '../../composables/useApiRequest'
import { tianGan, diZhi, shengXiaoList as shengXiao, wuXingMap, wuXingColors } from '../../constants'

const { addRecord } = useHistory()
const { year, month, day, hour, years, months, days, hours } = useBirthDate()
const { loading, error, request } = useApiRequest()

const gender = ref('male')
const analyzed = ref(false)
const fortuneData = ref(null)
const aiInterpretation = ref('')

function calculateBaZi() {
  const y = parseInt(year.value)
  const m = parseInt(month.value)
  const d = parseInt(day.value)
  const h = parseInt(hour.value)

  const yearGanIdx = (y - 4) % 10
  const yearZhiIdx = (y - 4) % 12
  const monthGanIdx = (yearGanIdx * 2 + m) % 10
  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(y, m - 1, d)
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24))
  const dayGanIdx = (diffDays + 10) % 10
  const dayZhiIdx = (diffDays + 10) % 12
  const hourZhiIdx = Math.floor((h + 1) / 2) % 12

  return {
    year: tianGan[yearGanIdx] + diZhi[yearZhiIdx],
    month: tianGan[monthGanIdx] + diZhi[(yearZhiIdx * 2 + m - 1) % 12],
    day: tianGan[dayGanIdx] + diZhi[dayZhiIdx],
    hour: tianGan[(dayGanIdx * 2 + hourZhiIdx) % 10] + diZhi[hourZhiIdx]
  }
}

async function analyze() {
  if (!year.value || !month.value || !day.value || hour.value === '') return

  aiInterpretation.value = ''

  const baZi = calculateBaZi()
  const age = new Date().getFullYear() - parseInt(year.value)
  const dayWuXing = wuXingMap[baZi.day[0]] || '土'
  const shengXiaoName = shengXiao[(parseInt(year.value) - 4) % 12]

  fortuneData.value = {
    baZi, age,
    shengXiao: shengXiaoName,
    dayWuXing,
    gender: gender.value
  }
  analyzed.value = true

  const result = await request(({ signal }) =>
    api.analyzeComprehensive({
      year: parseInt(year.value),
      month: parseInt(month.value),
      day: parseInt(day.value),
      hour: parseInt(hour.value),
      gender: gender.value
    }, { signal })
  )

  if (result) {
    aiInterpretation.value = result.interpretation
    addRecord({
      type: 'comprehensive',
      summary: `${year.value}年${month.value}月${day.value}日 综合运势`,
      data: { year: year.value, month: month.value, day: day.value, hour: hour.value, gender: gender.value }
    })
  }
}
</script>

<template>
  <div class="animate-fade-in relative">
    <StarField />

    <PageHeader
      icon="🔮"
      title="综合运势"
      subtitle="全方位命理分析，AI 深度解读人生运势"
    />

    <!-- 输入表单 -->
    <div class="card-ancient p-6 mb-6 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

      <div class="mb-4">
        <label class="block text-text-muted text-sm mb-1">性别</label>
        <div class="flex gap-2">
          <button @click="gender = 'male'" :class="gender === 'male' ? 'btn-gold' : 'btn-outline'" class="flex-1 text-sm py-2" role="radio" :aria-pressed="gender === 'male'" aria-label="男">男</button>
          <button @click="gender = 'female'" :class="gender === 'female' ? 'btn-gold' : 'btn-outline'" class="flex-1 text-sm py-2" role="radio" :aria-pressed="gender === 'female'" aria-label="女">女</button>
        </div>
      </div>

      <button @click="analyze" :disabled="!year || !month || !day || hour === '' || loading"
        class="btn-gold w-full text-lg py-3"
        :class="!year || !month || !day || hour === '' || loading ? 'opacity-50 cursor-not-allowed' : ''">
        {{ loading ? '分析中...' : '开始综合分析' }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="relative z-10">
      <LoadingSpinner text="AI 综合运势分析中，请稍候..." />
    </div>

    <!-- 错误提示 -->
    <ErrorMessage v-if="error" :message="error" @retry="analyze" class="relative z-10 mb-6" />

    <!-- 分析结果 -->
    <div v-if="analyzed && fortuneData && !loading" class="relative z-10">
      <!-- 基本信息 -->
      <div class="card-ancient p-5 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div class="text-gold font-display text-lg mb-1">
              {{ year }}年{{ month }}月{{ day }}日 {{ hour }}时
            </div>
            <div class="text-text-muted text-sm">
              {{ gender === 'male' ? '男命' : '女命' }}
              · {{ fortuneData.shengXiao }}
              · {{ fortuneData.age }}岁
              · 日主{{ fortuneData.dayWuXing }}
              <span class="ml-1" :style="{ color: wuXingColors[fortuneData.dayWuXing] }">●</span>
            </div>
          </div>
          <div class="bg-dark px-4 py-2 rounded-lg">
            <span class="text-text-muted text-sm">八字 </span>
            <span class="text-gold font-display tracking-wider text-sm">
              {{ fortuneData.baZi.year }} {{ fortuneData.baZi.month }} {{ fortuneData.baZi.day }} {{ fortuneData.baZi.hour }}
            </span>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div v-if="aiInterpretation" class="card-ancient p-6 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xl">🤖</span>
          <h3 class="text-gold font-display text-lg">AI 综合运势解读</h3>
        </div>
        <MdRender :content="aiInterpretation" />
      </div>
    </div>

    <!-- 底部装饰 -->
    <div v-if="!analyzed && !loading" class="mt-12 text-center text-text-muted text-sm relative z-10">
      <div class="flex items-center justify-center gap-4 mb-2">
        <span class="h-px w-16 bg-border"></span>
        <span class="text-gold">☯</span>
        <span class="h-px w-16 bg-border"></span>
      </div>
      <p>输入出生信息，开启全方位命理分析</p>
    </div>
  </div>
</template>
