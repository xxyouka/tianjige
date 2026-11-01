<script setup>
import { ref } from 'vue'
import { api } from '../../services/api'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import AnimateIn from '../../components/ui/AnimateIn.vue'
import { useHistory } from '../../composables/useHistory'
import { useBirthDate } from '../../composables/useBirthDate'
import { useApiRequest } from '../../composables/useApiRequest'
import { tianGan, diZhi, shengXiaoList as shengXiao, wuXingMap, wuXingColors, healthMap, careerMap, wealthMap, loveMap } from '../../constants'

const { addRecord } = useHistory()
const { year, month, day, hour, years, months, days, hours } = useBirthDate()
const { loading, error, request } = useApiRequest()

const result = ref(null)
const localAnalysis = ref(null)

function generateLocalAnalysis() {
  if (!year.value || !month.value || !day.value || hour.value === '') return

  const y = parseInt(year.value)
  const m = parseInt(month.value)
  const d = parseInt(day.value)
  const h = parseInt(hour.value)

  const yearGanIdx = (y - 4) % 10
  const yearZhiIdx = (y - 4) % 12
  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(y, m - 1, d)
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24))
  const dayGanIdx = (diffDays + 10) % 10
  const dayZhiIdx = (diffDays + 10) % 12
  const hourZhiIdx = Math.floor((h + 1) / 2) % 12

  const dayWuXing = wuXingMap[tianGan[dayGanIdx]] || '土'
  const age = new Date().getFullYear() - y
  const sx = shengXiao[(y - 4) % 12]

  localAnalysis.value = {
    dayWuXing, age, shengXiao: sx,
    health: healthMap[dayWuXing],
    career: careerMap[dayWuXing],
    wealth: wealthMap[dayWuXing],
    love: loveMap[dayWuXing],
    baZi: {
      year: tianGan[yearGanIdx] + diZhi[yearZhiIdx],
      day: tianGan[dayGanIdx] + diZhi[dayZhiIdx]
    }
  }
}

async function calculate() {
  if (!year.value || !month.value || !day.value || hour.value === '') {
    error.value = '请填写完整的出生信息'
    return
  }

  result.value = null
  generateLocalAnalysis()

  const res = await request(({ signal }) =>
    api.calculateBazi({
      year: parseInt(year.value),
      month: parseInt(month.value),
      day: parseInt(day.value),
      hour: parseInt(hour.value)
    }, { signal })
  )

  if (res) {
    result.value = res
    addRecord({
      type: 'bazi',
      summary: `${year.value}年${month.value}月${day.value}日${hour.value}时 八字排盘`,
      data: { year: year.value, month: month.value, day: day.value, hour: hour.value }
    })
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="☰"
      title="八字排盘"
      subtitle="输入出生时间，解读你的命格密码"
    />

    <!-- 输入表单 -->
    <div class="card-ancient p-6 mb-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-text-muted text-sm mb-2">出生年份</label>
          <select v-model="year" class="input-ancient">
            <option value="">请选择</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-2">出生月份</label>
          <select v-model="month" class="input-ancient">
            <option value="">请选择</option>
            <option v-for="m in months" :key="m" :value="m">{{ m }}月</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-2">出生日期</label>
          <select v-model="day" class="input-ancient">
            <option value="">请选择</option>
            <option v-for="d in days" :key="d" :value="d">{{ d }}日</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-2">出生时辰</label>
          <select v-model="hour" class="input-ancient">
            <option value="">请选择</option>
            <option v-for="h in hours" :key="h" :value="h">{{ h }}时</option>
          </select>
        </div>
      </div>

      <button @click="calculate" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在排盘...' : '开始排盘' }}
      </button>

      <ErrorMessage :message="error" @retry="calculate" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在排盘中..."
      subtext="请稍候片刻"
    />

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 八字信息 -->
      <div class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-4 font-display">命盘信息</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
          <div class="bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">年柱</div>
            <div class="text-2xl text-gold">{{ result.data.yearPillar }}</div>
          </div>
          <div class="bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">月柱</div>
            <div class="text-2xl text-gold">{{ result.data.monthPillar }}</div>
          </div>
          <div class="bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">日柱</div>
            <div class="text-2xl text-gold">{{ result.data.dayPillar }}</div>
          </div>
          <div class="bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">时柱</div>
            <div class="text-2xl text-gold">{{ result.data.hourPillar }}</div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="bg-dark p-3 rounded-lg">
            <span class="text-text-muted text-sm">日主：</span>
            <span class="text-gold">{{ result.data.dayMaster }}</span>
          </div>
          <div class="bg-dark p-3 rounded-lg">
            <span class="text-text-muted text-sm">流年：</span>
            <span class="text-gold">{{ result.data.yearLuck }}</span>
          </div>
        </div>
      </div>

      <!-- 五行速览 -->
      <div v-if="localAnalysis" class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-4 font-display">五行速览</h2>
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl" :style="{ color: wuXingColors[localAnalysis.dayWuXing] }">●</span>
          <div>
            <div class="text-gold font-display">日主{{ localAnalysis.dayWuXing }}</div>
            <div class="text-text-muted text-sm">{{ localAnalysis.shengXiao }} · {{ localAnalysis.age }}岁</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30">
            <div class="text-gold text-sm mb-1">事业方向</div>
            <div class="text-text-muted text-sm">{{ localAnalysis.career }}</div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30">
            <div class="text-gold text-sm mb-1">财运特点</div>
            <div class="text-text-muted text-sm">{{ localAnalysis.wealth }}</div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30">
            <div class="text-gold text-sm mb-1">感情运势</div>
            <div class="text-text-muted text-sm">{{ localAnalysis.love }}</div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30">
            <div class="text-gold text-sm mb-1">健康注意</div>
            <div class="text-text-muted text-sm">{{ localAnalysis.health.organ }} · {{ localAnalysis.health.weakness }}</div>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">AI 命理解读</h2>
          <ShareButton
            :text="`八字排盘\n\n年柱：${result.data.yearPillar}\n月柱：${result.data.monthPillar}\n日柱：${result.data.dayPillar}\n时柱：${result.data.hourPillar}\n日主：${result.data.dayMaster}\n\n${result.interpretation}`"
            title="八字排盘 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
