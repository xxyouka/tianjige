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
const { month, day, months, days } = useBirthDate({ includeYear: false, includeHour: false })
const { loading, error, request } = useApiRequest()

const result = ref(null)

async function lookup() {
  if (!month.value || !day.value) {
    error.value = '请选择生日'
    return
  }

  result.value = null

  const data = await request(({ signal }) =>
    api.lookupFlower({
      month: parseInt(month.value),
      day: parseInt(day.value)
    }, { signal })
  )

  if (data) {
    result.value = data
    addRecord({
      type: 'flower',
      summary: `${month.value}月${day.value}日 生日花语`,
      data: { month: month.value, day: day.value }
    })
  }
}

const flowerEmojis = {
  '白色': '🌸', '红色': '🌹', '粉色': '🌷', '黄色': '🌻',
  '紫色': '💐', '蓝色': '💙', '橙色': '🧡', '绿色': '🌿',
  '银色': '🤍', '混色': '🌺'
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="🌺"
      title="生日花语"
      subtitle="每一天都有一朵花为你绽放"
      accentColor="crimson"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-text-muted text-sm mb-1">月份</label>
          <select v-model="month" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="m in months" :key="m" :value="m">{{ m }}月</option>
          </select>
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">日期</label>
          <select v-model="day" class="input-ancient text-sm">
            <option value="">选择</option>
            <option v-for="d in days" :key="d" :value="d">{{ d }}日</option>
          </select>
        </div>
      </div>

      <button @click="lookup" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在查询...' : '查询生日花语' }}
      </button>

      <ErrorMessage :message="error" @retry="lookup" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在查询花语..."
      subtext="寻找属于你的花"
    />

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 花卉展示 -->
      <div class="card-ancient p-8 mb-6">
        <div class="text-center">
          <div class="text-4xl md:text-6xl mb-4">{{ flowerEmojis[result.data.color] || '🌸' }}</div>
          <div class="text-3xl text-gold font-display mb-2">{{ result.data.flower }}</div>
          <div class="text-text-muted text-sm mb-4">{{ month }}月{{ day }}日 · {{ result.data.color }}</div>
          <div class="inline-block bg-dark px-4 py-2 rounded-full">
            <span class="text-gold text-sm">{{ result.data.meaning }}</span>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">花语解读</h2>
          <ShareButton
            :text="`生日花语\n\n${month.value}月${day.value}日\n${result.data.flower}\n花语：${result.data.meaning}\n\n${result.interpretation}`"
            title="生日花语 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
