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

const { addRecord } = useHistory()
const { year, month, day, years, months, days } = useBirthDate({ includeHour: false })
const { loading, error, request } = useApiRequest()

const result = ref(null)

async function calculate() {
  if (!year.value || !month.value || !day.value) {
    error.value = '请填写完整的出生日期'
    return
  }

  result.value = null

  const data = await request(({ signal }) =>
    api.calculateNumerology({
      year: parseInt(year.value),
      month: parseInt(month.value),
      day: parseInt(day.value)
    }, { signal })
  )

  if (data) {
    result.value = data
    addRecord({
      type: 'numerology',
      summary: `${year.value}年${month.value}月${day.value}日 数字命理`,
      data: { year: year.value, month: month.value, day: day.value }
    })
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="🔢"
      title="数字命理"
      subtitle="生命灵数，解读你的灵魂密码"
      accentColor="blue"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="grid grid-cols-3 gap-2 md:gap-4 mb-6">
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
      </div>

      <button @click="calculate" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在计算...' : '计算生命灵数' }}
      </button>

      <ErrorMessage :message="error" @retry="calculate" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在计算灵数..."
      subtext="解读数字背后的秘密"
    />

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 数字展示 -->
      <div class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-4 font-display">你的灵数</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">生命灵数</div>
            <div class="text-3xl md:text-5xl text-gold font-display">{{ result.data.lifePathNumber }}</div>
            <div class="text-text-muted text-xs mt-1">{{ result.data.lifePathMeaning.name }}</div>
          </div>
          <div class="text-center bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">成就数</div>
            <div class="text-3xl md:text-5xl text-gold font-display">{{ result.data.destinyNumber }}</div>
            <div class="text-text-muted text-xs mt-1">{{ result.data.destinyMeaning.name }}</div>
          </div>
          <div class="text-center bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">灵魂数</div>
            <div class="text-3xl md:text-5xl text-gold font-display">{{ result.data.soulNumber }}</div>
            <div class="text-text-muted text-xs mt-1">{{ result.data.soulMeaning.name }}</div>
          </div>
          <div class="text-center bg-dark p-4 rounded-lg">
            <div class="text-text-muted text-sm mb-1">人格数</div>
            <div class="text-3xl md:text-5xl text-gold font-display">{{ result.data.personalityNumber }}</div>
            <div class="text-text-muted text-xs mt-1">{{ result.data.personalityMeaning.name }}</div>
          </div>
        </div>
      </div>

      <!-- 特质 -->
      <div class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-4 font-display">数字特质</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-dark p-4 rounded-lg">
            <div class="text-gold text-sm mb-1">生命灵数 {{ result.data.lifePathNumber }} · {{ result.data.lifePathMeaning.name }}</div>
            <div class="text-text text-sm">{{ result.data.lifePathMeaning.traits }}</div>
          </div>
          <div class="bg-dark p-4 rounded-lg">
            <div class="text-gold text-sm mb-1">成就数 {{ result.data.destinyNumber }} · {{ result.data.destinyMeaning.name }}</div>
            <div class="text-text text-sm">{{ result.data.destinyMeaning.traits }}</div>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">命理解读</h2>
          <ShareButton
            :text="`数字命理\n\n生命灵数：${result.data.lifePathNumber}\n成就数：${result.data.destinyNumber}\n灵魂数：${result.data.soulNumber}\n人格数：${result.data.personalityNumber}\n\n${result.interpretation}`"
            title="数字命理 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
