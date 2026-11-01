<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import StarField from '../../components/ui/StarField.vue'
import MdRender from '../../components/fortune/MdRender.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import { api } from '../../services/api'
import { getDailyGanZhi, jiShiData, shengXiaoList } from '../../constants'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const today = new Date()
const selectedYear = ref(today.getFullYear())
const selectedMonth = ref(today.getMonth() + 1)
const selectedDay = ref(today.getDate())
const shengXiao = ref('')
const analyzed = ref(false)
const fortuneData = ref(null)
const aiInterpretation = ref('')

const months = Array.from({ length: 12 }, (_, i) => i + 1)
const currentYear = today.getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

const days = computed(() => {
  const count = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  return Array.from({ length: count }, (_, i) => i + 1)
})

watch([selectedYear, selectedMonth], () => {
  if (selectedDay.value && selectedDay.value > days.value.length) {
    selectedDay.value = days.value.length
  }
})

async function analyzeDaily() {
  const year = selectedYear.value
  const month = selectedMonth.value
  const day = selectedDay.value

  aiInterpretation.value = ''

  // 本地计算干支信息用于即时显示
  const daily = getDailyGanZhi(year, month, day)
  fortuneData.value = {
    year, month, day, daily,
    jiShi: jiShiData[daily.zhi],
    isShengXiaoDay: shengXiao.value === daily.shengXiao
  }
  analyzed.value = true

  // 调用AI后端获取解读
  const result = await request(({ signal }) =>
    api.analyzeDaily({
      year, month, day,
      shengXiao: shengXiao.value || undefined
    }, { signal })
  )

  if (result) {
    aiInterpretation.value = result.interpretation
    addRecord({
      type: 'daily',
      summary: `${year}年${month}月${day}日 每日运势`,
      data: { year, month, day }
    })
  }
}

function getLuckColor(luck) {
  if (luck === '好') return 'text-green-400'
  return 'text-text-muted'
}

function isToday() {
  return selectedYear.value === today.getFullYear() &&
    selectedMonth.value === today.getMonth() + 1 &&
    selectedDay.value === today.getDate()
}

onMounted(() => {
  analyzeDaily()
})
</script>

<template>
  <div class="animate-fade-in relative">
    <StarField />

    <PageHeader
      icon="📅"
      title="每日运势"
      subtitle="黄历宜忌、吉时查询、AI运势解读"
    />

    <!-- 日期选择 -->
    <div class="card-ancient p-6 mb-6 relative z-10">
      <div class="grid grid-cols-3 md:grid-cols-5 gap-4 items-end">
        <div>
          <label class="block text-text-muted text-sm mb-1">年份</label>
          <select v-model="selectedYear" class="input-ancient text-sm">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">月份</label>
          <select v-model="selectedMonth" class="input-ancient text-sm">
            <option v-for="m in months" :key="m" :value="m">{{ m }}月</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">日期</label>
          <select v-model="selectedDay" class="input-ancient text-sm">
            <option v-for="d in days" :key="d" :value="d">{{ d }}日</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">生肖</label>
          <select v-model="shengXiao" class="input-ancient text-sm">
            <option value="">不指定</option>
            <option v-for="s in shengXiaoList" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <button @click="analyzeDaily" :disabled="loading" class="btn-gold w-full text-sm py-2">
            {{ loading ? '分析中...' : (isToday() ? '刷新今日' : '查看运势') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading && !aiInterpretation" class="relative z-10">
      <LoadingSpinner text="AI 运势分析中，请稍候..." />
    </div>

    <!-- 错误提示 -->
    <ErrorMessage v-if="error" :message="error" @retry="analyzeDaily" class="relative z-10 mb-6" />

    <!-- 结果 -->
    <div v-if="analyzed && fortuneData" class="relative z-10">
      <!-- 今日概览 -->
      <div class="card-ancient p-6 mb-6">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="flex-1 text-center md:text-left">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-gold font-display text-xl">
                {{ fortuneData.year }}年{{ fortuneData.month }}月{{ fortuneData.day }}日
              </span>
              <span v-if="isToday()" class="bg-gold/20 text-gold text-xs px-2 py-0.5 rounded-full">今日</span>
            </div>
            <div class="text-text-muted text-sm mb-2">
              干支：<span class="text-gold font-display">{{ fortuneData.daily.ganZhi }}</span>
              · {{ fortuneData.daily.shengXiao }}日
              <span v-if="fortuneData.isShengXiaoDay" class="text-gold ml-1">★ 生肖日</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI 运势解读 -->
      <div v-if="loading && !aiInterpretation" class="card-ancient p-6 mb-6">
        <LoadingSpinner text="AI 生成运势解读中..." />
      </div>
      <div v-else-if="aiInterpretation" class="card-ancient p-6 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xl">🤖</span>
          <h3 class="text-gold font-display text-lg">AI 运势解读</h3>
        </div>
        <MdRender :content="aiInterpretation" />
      </div>

      <!-- 黄历宜忌 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display text-lg mb-4 text-center">黄历宜忌</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-green-400/5 p-4 rounded-lg border border-green-400/20">
            <div class="text-green-400 font-display mb-2 flex items-center gap-2">
              <span>✓</span> 宜
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="item in ['祭祀', '祈福', '出行', '嫁娶']" :key="item"
                class="bg-green-400/10 text-green-300 px-3 py-1 rounded-full text-sm">
                {{ item }}
              </span>
            </div>
          </div>
          <div class="bg-red-400/5 p-4 rounded-lg border border-red-400/20">
            <div class="text-red-400 font-display mb-2 flex items-center gap-2">
              <span>✗</span> 忌
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="item in ['动土', '安葬']" :key="item"
                class="bg-red-400/10 text-red-300 px-3 py-1 rounded-full text-sm">
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 吉时查询 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display text-lg mb-4 text-center">吉时查询</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div v-for="(data, zhi) in jiShiData" :key="zhi"
            class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center"
            :class="fortuneData.daily.zhi === zhi ? 'ring-2 ring-gold/60 border-gold/40' : ''">
            <div class="text-lg mb-1">{{ data.icon }}</div>
            <div class="text-gold text-sm font-display">{{ zhi }}时</div>
            <div class="text-text-muted text-xs">{{ data.time }}</div>
            <div class="text-xs mt-1" :class="getLuckColor(data.luck)">{{ data.luck }}</div>
            <div class="text-text-muted text-xs mt-1">{{ data.advice }}</div>
            <div v-if="fortuneData.daily.zhi === zhi" class="text-gold text-xs mt-1">当前时辰</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div v-if="!analyzed && !loading" class="mt-12 text-center text-text-muted text-sm relative z-10">
      <div class="flex items-center justify-center gap-4 mb-2">
        <span class="h-px w-16 bg-border"></span>
        <span class="text-gold">📅</span>
        <span class="h-px w-16 bg-border"></span>
      </div>
      <p>查看今日黄历宜忌与运势</p>
    </div>
  </div>
</template>
