<script setup>
import { ref } from 'vue'
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
import { signIcons } from '../../constants'

const { addRecord } = useHistory()
const { year, month, day, hour, years, months, days, hours } = useBirthDate()
const { loading, error, request } = useApiRequest()

const result = ref(null)

async function calculate() {
  if (!year.value || !month.value || !day.value || hour.value === '') {
    error.value = '请填写完整的出生信息'
    return
  }

  result.value = null

  const data = await request(({ signal }) =>
    api.calculateAstrology({
      year: parseInt(year.value),
      month: parseInt(month.value),
      day: parseInt(day.value),
      hour: parseInt(hour.value)
    }, { signal })
  )

  if (data) {
    result.value = data
    addRecord({
      type: 'astrology',
      summary: `${year.value}年${month.value}月${day.value}日 星盘`,
      data: { year: year.value, month: month.value, day: day.value, hour: hour.value }
    })
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="✧"
      title="星盘"
      subtitle="行星位置，解读你的灵魂蓝图"
      accentColor="purple"
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
        {{ loading ? '正在绘制星盘...' : '生成星盘' }}
      </button>

      <ErrorMessage :message="error" @retry="calculate" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在绘制星盘..."
      subtext="解读星辰的奥秘"
    />

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 三大主星 -->
      <div class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-4 font-display">三大主星</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div class="text-center bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">太阳星座</div>
            <div class="text-3xl mb-1">{{ signIcons[result.data.sunSign] }}</div>
            <div class="text-gold">{{ result.data.sunSign }}</div>
            <div class="text-text-muted text-xs mt-1">核心自我</div>
          </div>
          <div class="text-center bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">月亮星座</div>
            <div class="text-3xl mb-1">{{ signIcons[result.data.moonSign] }}</div>
            <div class="text-gold">{{ result.data.moonSign }}</div>
            <div class="text-text-muted text-xs mt-1">内在情感</div>
          </div>
          <div class="text-center bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">上升星座</div>
            <div class="text-3xl mb-1">{{ signIcons[result.data.risingSign] }}</div>
            <div class="text-gold">{{ result.data.risingSign }}</div>
            <div class="text-text-muted text-xs mt-1">外在形象</div>
          </div>
        </div>
      </div>

      <!-- 行星位置 -->
      <div class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-4 font-display">行星位置</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div v-for="p in result.data.planets" :key="p.planet" class="bg-dark p-3 rounded-lg text-center">
            <div class="text-text-muted text-xs">{{ p.planet }}</div>
            <div class="text-gold text-sm">{{ signIcons[p.sign] }} {{ p.sign }}</div>
            <div class="text-text-muted text-xs">{{ p.degree }}°</div>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">星盘解读</h2>
          <ShareButton
            :text="`星盘\n\n太阳星座：${result.data.sunSign}\n月亮星座：${result.data.moonSign}\n上升星座：${result.data.risingSign}\n\n${result.interpretation}`"
            title="星盘 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
