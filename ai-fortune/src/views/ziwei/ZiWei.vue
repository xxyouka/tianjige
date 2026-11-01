<script setup>
import { ref, computed } from 'vue'
import StarField from '../../components/ui/StarField.vue'
import MdRender from '../../components/fortune/MdRender.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import { api } from '../../services/api'
import { shengXiaoList } from '../../constants'
import { useHistory } from '../../composables/useHistory'
import { useBirthDate } from '../../composables/useBirthDate'
import { useApiRequest } from '../../composables/useApiRequest'

const { addRecord } = useHistory()
const { year, month, day, hour, years, months, days, hours } = useBirthDate()
const { loading, error, request } = useApiRequest()

const gender = ref('male')
const result = ref(null)

const shengXiao = computed(() => {
  if (!year.value) return ''
  return shengXiaoList[(parseInt(year.value) - 4) % 12]
})

async function analyze() {
  if (!year.value || !month.value || !day.value || hour.value === '') return

  result.value = null

  const res = await request(({ signal }) =>
    api.analyzeZiwei({
      year: parseInt(year.value),
      month: parseInt(month.value),
      day: parseInt(day.value),
      hour: parseInt(hour.value),
      gender: gender.value
    }, { signal })
  )

  if (res) {
    result.value = res
    addRecord({
      type: 'ziwei',
      summary: `${year.value}年${month.value}月${day.value}日 紫微斗数`,
      data: { year: year.value, month: month.value, day: day.value, hour: hour.value, gender: gender.value }
    })
  }
}

function reset() {
  result.value = null
}
</script>

<template>
  <div class="animate-fade-in relative">
    <StarField />

    <PageHeader
      icon="⭐"
      title="紫微斗数"
      subtitle="紫微星曜排盘，十二宫命理分析"
    />

    <!-- 输入表单 -->
    <div class="card-ancient p-6 mb-6 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-text-muted text-sm mb-1">出生年份</label>
          <select v-model="year" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">出生月份</label>
          <select v-model="month" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="m in months" :key="m" :value="m">{{ m }}月</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">出生日期</label>
          <select v-model="day" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="d in days" :key="d" :value="d">{{ d }}日</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">出生时辰</label>
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

      <div v-if="shengXiao" class="text-text-muted text-sm mb-4 text-center">
        生肖：<span class="text-gold">{{ shengXiao }}</span>
      </div>

      <button @click="analyze"
        :disabled="!year || !month || !day || hour === '' || loading"
        class="btn-gold w-full text-lg py-3"
        :class="!year || !month || !day || hour === '' || loading ? 'opacity-50 cursor-not-allowed' : ''">
        {{ loading ? '排盘中...' : '开始排盘' }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="relative z-10">
      <LoadingSpinner text="紫微斗数排盘中，请稍候..." />
    </div>

    <!-- 错误提示 -->
    <ErrorMessage v-if="error" :message="error" @retry="analyze" class="relative z-10 mb-6" />

    <!-- 分析结果 -->
    <div v-if="result && !loading" class="relative z-10">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <button @click="reset" class="text-text-muted hover:text-gold transition-colors text-sm">
          ← 重新排盘
        </button>
      </div>

      <!-- 基本信息 -->
      <div class="card-ancient p-5 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div class="text-gold font-display text-lg mb-1">
              紫微斗数命盘
            </div>
            <div class="text-text-muted text-sm">
              {{ result.data.year }}年{{ result.data.month }}月{{ result.data.day }}日{{ result.data.hour }}时
              · {{ gender === 'male' ? '男命' : '女命' }}
              · {{ result.data.shengXiao }}
            </div>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">⭐</span>
            <h3 class="text-gold font-display text-lg">紫微斗数详解</h3>
          </div>
          <ShareButton
            :text="`紫微斗数\n\n${result.data.year}年${result.data.month}月${result.data.day}日${result.data.hour}时\n${result.interpretation}`"
            title="紫微斗数 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </div>

    <!-- 底部装饰 -->
    <div v-if="!result && !loading" class="mt-12 text-center text-text-muted text-sm relative z-10">
      <div class="flex items-center justify-center gap-4 mb-2">
        <span class="h-px w-16 bg-border"></span>
        <span class="text-gold">⭐</span>
        <span class="h-px w-16 bg-border"></span>
      </div>
      <p>紫微斗数，星曜命盘，洞悉人生格局</p>
    </div>
  </div>
</template>
