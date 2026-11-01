<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import StarField from '../../components/ui/StarField.vue'
import { useHistory } from '../../composables/useHistory'
import { useFavorites } from '../../composables/useFavorites'
import { useBirthDate } from '../../composables/useBirthDate'
import { useApiRequest } from '../../composables/useApiRequest'
import { allFeatures, allCalcTabs } from '../../constants/features'
import { signIcons } from '../../constants'

const { addRecord, history } = useHistory()
const { favorites } = useFavorites()
const { year, month, day, hour, years, months, days, hours } = useBirthDate()
const { loading, error, request } = useApiRequest()

const router = useRouter()
const name = ref('')
const gender = ref('male')
const result = ref(null)
const activeTab = ref('bazi')

const tabs = allCalcTabs
const features = allFeatures.filter(f => f.path !== '/' && f.path !== '/history')

const activeResult = computed(() => {
  if (!result.value) return null
  return result.value.results[activeTab.value]
})

const todayStr = (() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})()

// 最近使用的功能
const recentFeatures = computed(() => {
  const recentTypes = [...new Set(history.value.map(r => r.type))].slice(0, 4)
  return recentTypes
    .map(type => features.find(f => f.path === `/${type}`))
    .filter(Boolean)
})

// 收藏的功能
const favoriteFeatures = computed(() => {
  return favorites.value
    .map(path => features.find(f => f.path === path))
    .filter(Boolean)
})

async function calculateAll() {
  if (!year.value || !month.value || !day.value || hour.value === '') {
    error.value = '请填写完整的出生时间'
    return
  }

  result.value = null

  const res = await request(({ signal }) =>
    api.calculateAll({
      year: parseInt(year.value),
      month: parseInt(month.value),
      day: parseInt(day.value),
      hour: parseInt(hour.value),
      name: name.value,
      gender: gender.value
    }, { signal })
  )

  if (res) {
    result.value = res
    addRecord({
      type: 'all',
      summary: `${res.birthData.year}年${res.birthData.month}月${res.birthData.day}日 ${res.birthData.sign}`,
      data: {
        year: year.value,
        month: month.value,
        day: day.value,
        hour: hour.value,
        name: name.value,
        gender: gender.value
      }
    })
    scrollToResult()
  }
}

function navigate(path) {
  router.push(path)
}

const resultSection = ref(null)

function scrollToResult() {
  nextTick(() => {
    if (resultSection.value) {
      resultSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}
</script>

<template>
  <div class="animate-fade-in relative">
    <!-- 星空背景 -->
    <StarField />

    <!-- 标题区 -->
    <div class="text-center mb-8 relative z-10">
      <div class="text-4xl md:text-5xl mb-3 animate-spin-slow inline-block">☯</div>
      <h1 class="text-3xl font-display text-gold glow-gold-text mb-2">天机阁</h1>
      <p class="text-text-muted">窥探天机，解读命运</p>
    </div>

    <!-- 功能导航卡片（未出结果时显示） -->
    <div v-if="!result" class="mb-8">
      <!-- 收藏功能 -->
      <div v-if="favoriteFeatures.length > 0" class="mb-6">
        <h2 class="text-gold text-sm font-display mb-3 flex items-center gap-2">
          <span>★</span>
          <span>收藏功能</span>
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="f in favoriteFeatures"
            :key="f.path"
            @click="navigate(f.path)"
            @keydown.enter="navigate(f.path)"
            role="link"
            tabindex="0"
            :aria-label="f.name"
            class="card-ancient p-4 cursor-pointer hover:border-gold/60 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 group border-gold/30"
          >
            <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">{{ f.icon }}</div>
            <div class="text-text text-sm font-display mb-1">{{ f.name }}</div>
            <div class="text-text-muted text-xs leading-relaxed">{{ f.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 最近使用 -->
      <div v-if="recentFeatures.length > 0" class="mb-6">
        <h2 class="text-gold text-sm font-display mb-3 flex items-center gap-2">
          <span>🕐</span>
          <span>最近使用</span>
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="f in recentFeatures"
            :key="f.path"
            @click="navigate(f.path)"
            @keydown.enter="navigate(f.path)"
            role="link"
            tabindex="0"
            :aria-label="f.name"
            class="card-ancient p-4 cursor-pointer hover:border-gold/60 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 group"
          >
            <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">{{ f.icon }}</div>
            <div class="text-text text-sm font-display mb-1">{{ f.name }}</div>
            <div class="text-text-muted text-xs leading-relaxed">{{ f.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 全部功能 -->
      <div>
        <h2 class="text-gold text-sm font-display mb-3 flex items-center gap-2">
          <span>🔮</span>
          <span>全部功能</span>
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="f in features"
            :key="f.path"
            @click="navigate(f.path)"
            @keydown.enter="navigate(f.path)"
            role="link"
            tabindex="0"
            :aria-label="f.name"
            class="card-ancient p-4 cursor-pointer hover:border-gold/60 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 group"
          >
            <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">{{ f.icon }}</div>
            <div class="text-text text-sm font-display mb-1">{{ f.name }}</div>
            <div class="text-text-muted text-xs leading-relaxed">{{ f.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分隔线 -->
    <div v-if="!result" class="flex items-center gap-4 mb-6">
      <span class="h-px flex-1 bg-border"></span>
      <span class="text-gold text-sm">或一键推算全部</span>
      <span class="h-px flex-1 bg-border"></span>
    </div>

    <!-- 输入表单 -->
    <div class="card-ancient p-6 mb-6">
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

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-text-muted text-sm mb-1">姓名（选填）</label>
          <input v-model="name" class="input-ancient text-sm" placeholder="用于姓名测算" />
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-1">性别</label>
          <div class="flex gap-2">
            <button
              @click="gender = 'male'"
              :class="gender === 'male' ? 'btn-gold' : 'btn-outline'"
              class="flex-1 text-sm py-2"
              role="radio"
              :aria-pressed="gender === 'male'"
              aria-label="男"
            >男</button>
            <button
              @click="gender = 'female'"
              :class="gender === 'female' ? 'btn-gold' : 'btn-outline'"
              class="flex-1 text-sm py-2"
              role="radio"
              :aria-pressed="gender === 'female'"
              aria-label="女"
            >女</button>
          </div>
        </div>
      </div>

      <button @click="calculateAll" :disabled="loading" class="btn-gold w-full text-lg py-3">
        {{ loading ? '正在为你推算天机...' : '一键推算' }}
      </button>

      <ErrorMessage :message="error" @retry="calculateAll" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在为你推算天机，请稍候..."
      subtext="十一术并算，需要一点时间"
    />

    <!-- 结果展示 -->
    <div v-if="result && !loading" ref="resultSection" class="animate-fade-in">
      <!-- 基本信息卡片 -->
      <div class="card-ancient p-5 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div class="text-gold font-display text-lg mb-1">
              {{ result.birthData.year }}年{{ result.birthData.month }}月{{ result.birthData.day }}日{{ result.birthData.hour }}时
            </div>
            <div class="text-text-muted text-sm">
              {{ result.birthData.gender === 'male' ? '男命' : '女命' }}
              · {{ result.birthData.sign }}
              <span class="ml-2">{{ signIcons[result.birthData.sign] }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-dark px-4 py-2 rounded-lg">
            <span class="text-text-muted text-sm">八字</span>
            <span class="text-gold font-display tracking-wider">{{ result.birthData.bazi }}</span>
          </div>
        </div>
      </div>

      <!-- 返回首页按钮 -->
      <div class="mb-4">
        <button @click="result = null" class="text-text-muted hover:text-gold transition-colors text-sm">
          ← 返回功能导航
        </button>
      </div>

      <!-- Tab 切换 -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'bg-gold text-dark shadow-lg shadow-gold/20'
              : 'bg-dark-card text-text-muted hover:text-text hover:bg-dark-lighter',
            'px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-1.5'
          ]"
        >
          <span class="text-base">{{ tab.icon }}</span>
          <span>{{ tab.name }}</span>
          <span
            v-if="result.results[tab.id]?.success"
            class="w-1.5 h-1.5 bg-green-500 rounded-full"
          ></span>
          <span v-else class="w-1.5 h-1.5 bg-red-500/50 rounded-full"></span>
        </button>
      </div>

      <!-- 结果内容 -->
      <div v-if="activeResult" class="card-ancient overflow-hidden">
        <div v-if="activeResult.success">
          <!-- 八字特殊展示 -->
          <div v-if="activeTab === 'bazi' && activeResult.data" class="p-6 pb-0">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-6">
              <div class="bg-dark/80 p-4 rounded-xl border border-border/50">
                <div class="text-text-muted text-xs mb-2">年柱</div>
                <div class="text-2xl text-gold font-display">{{ activeResult.data.yearPillar }}</div>
              </div>
              <div class="bg-dark/80 p-4 rounded-xl border border-border/50">
                <div class="text-text-muted text-xs mb-2">月柱</div>
                <div class="text-2xl text-gold font-display">{{ activeResult.data.monthPillar }}</div>
              </div>
              <div class="bg-dark/80 p-4 rounded-xl border border-gold/30">
                <div class="text-text-muted text-xs mb-2">日柱</div>
                <div class="text-2xl text-gold font-display">{{ activeResult.data.dayPillar }}</div>
                <div class="text-[10px] text-gold/60 mt-1">日主</div>
              </div>
              <div class="bg-dark/80 p-4 rounded-xl border border-border/50">
                <div class="text-text-muted text-xs mb-2">时柱</div>
                <div class="text-2xl text-gold font-display">{{ activeResult.data.hourPillar }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div class="bg-dark/50 px-4 py-2 rounded-lg text-sm">
                <span class="text-text-muted">十神：</span>
                <span class="text-text">{{ activeResult.data.tenGods }}</span>
              </div>
              <div class="bg-dark/50 px-4 py-2 rounded-lg text-sm">
                <span class="text-text-muted">大运：</span>
                <span class="text-text text-xs">{{ activeResult.data.majorLuck }}</span>
              </div>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- 周易特殊展示 -->
          <div v-if="activeTab === 'zhouyi' && activeResult.data" class="p-6 pb-0">
            <div class="grid grid-cols-2 gap-3 md:gap-6 mb-6">
              <div class="text-center bg-dark/80 p-5 rounded-xl border border-border/50">
                <div class="text-text-muted text-xs mb-2">本卦</div>
                <div class="text-4xl mb-2">{{ activeResult.data.hexagram }}</div>
                <div class="text-gold font-display">{{ activeResult.data.hexagramName }}</div>
              </div>
              <div class="text-center bg-dark/80 p-5 rounded-xl border border-border/50">
                <div class="text-text-muted text-xs mb-2">变卦</div>
                <div class="text-4xl mb-2">{{ activeResult.data.changedHexagram }}</div>
                <div class="text-gold font-display">{{ activeResult.data.changedHexagramName }}</div>
              </div>
            </div>
            <div class="text-center mb-6">
              <span class="bg-dark/50 px-4 py-1.5 rounded-full text-sm">
                <span class="text-text-muted">动爻：</span>
                <span class="text-crimson-light">{{ activeResult.data.movingLines }}</span>
              </span>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- 塔罗特殊展示 -->
          <div v-if="activeTab === 'tarot' && activeResult.data" class="p-6 pb-0">
            <div class="flex justify-center gap-5 mb-6">
              <div
                v-for="(card, i) in activeResult.data.cards"
                :key="i"
                class="flex flex-col items-center"
              >
                <div
                  class="w-20 h-28 bg-gradient-to-br from-dark-card to-dark border-2 border-gold/60 rounded-xl flex flex-col items-center justify-center shadow-lg"
                  :style="card.reversed ? 'transform: rotate(180deg)' : ''"
                >
                  <div class="text-gold text-xs font-display text-center px-1">{{ card.name }}</div>
                </div>
                <div class="mt-2 text-xs" :class="card.reversed ? 'text-crimson-light' : 'text-text-muted'">
                  {{ card.reversed ? '逆位' : '正位' }}
                </div>
              </div>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- 星座特殊展示 -->
          <div v-if="activeTab === 'xingzuo'" class="p-6 pb-0">
            <div class="text-center mb-6">
              <div class="text-4xl md:text-5xl mb-2">{{ signIcons[activeResult.data?.sign] }}</div>
              <div class="text-gold font-display text-xl">{{ activeResult.data?.sign }}</div>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- 称骨特殊展示 -->
          <div v-if="activeTab === 'chengu' && activeResult.data" class="p-6 pb-0">
            <div class="text-center mb-6">
              <div class="text-4xl text-gold font-display mb-1">{{ activeResult.data.weight }} 两</div>
              <div class="text-text-muted text-sm">{{ activeResult.data.level }}</div>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- 测字特殊展示 -->
          <div v-if="activeTab === 'cezi'" class="p-6 pb-0">
            <div class="text-center mb-6">
              <div class="text-4xl md:text-6xl text-gold font-display">{{ name ? name[0] : '字' }}</div>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- 紫微斗数特殊展示 -->
          <div v-if="activeTab === 'ziwei'" class="p-6 pb-0">
            <div class="text-center mb-6">
              <div class="text-4xl mb-2">⭐</div>
              <div class="text-gold font-display text-lg">紫微斗数命盘</div>
              <div class="text-text-muted text-sm">{{ result.birthData.gender === 'male' ? '男命' : '女命' }} · {{ result.birthData.sign }}</div>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- 综合运势特殊展示 -->
          <div v-if="activeTab === 'comprehensive'" class="p-6 pb-0">
            <div class="text-center mb-6">
              <div class="text-4xl mb-2">🔮</div>
              <div class="text-gold font-display text-lg">综合运势分析</div>
              <div class="text-text-muted text-sm">七大维度 · 全方位解读</div>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- 每日运势特殊展示 -->
          <div v-if="activeTab === 'daily'" class="p-6 pb-0">
            <div class="text-center mb-6">
              <div class="text-4xl mb-2">📅</div>
              <div class="text-gold font-display text-lg">今日运势</div>
              <div class="text-text-muted text-sm">{{ todayStr }}</div>
            </div>
            <hr class="border-border/30">
          </div>

          <div v-if="activeTab === 'meihua'" class="p-6 pb-0">
            <div class="text-center mb-6">
              <div class="text-4xl mb-2">🌸</div>
              <div class="text-gold font-display text-lg">梅花易数</div>
              <div class="text-text-muted text-sm">心有所感，卦由心生</div>
            </div>
            <hr class="border-border/30">
          </div>

          <div v-if="activeTab === 'xingming'" class="p-6 pb-0">
            <div class="text-center mb-6">
              <div class="text-4xl mb-2">📝</div>
              <div class="text-gold font-display text-lg">姓名测算</div>
              <div class="text-text-muted text-sm">姓名藏玄机，一字定乾坤</div>
            </div>
            <hr class="border-border/30">
          </div>

          <!-- AI 解读文本 -->
          <div class="p-6">
            <MdRender :content="activeResult.result" />
          </div>
        </div>

        <div v-else class="p-12 text-center">
          <div class="text-4xl mb-3">⚠️</div>
          <p class="text-crimson-light">解读失败：{{ activeResult.error }}</p>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div v-if="!result" class="mt-12 text-center text-text-muted text-sm">
      <div class="flex items-center justify-center gap-4 mb-2">
        <span class="h-px w-16 bg-border"></span>
        <span class="text-gold">☰</span>
        <span class="h-px w-16 bg-border"></span>
      </div>
      <p>输入信息，一键推算十一命理</p>
    </div>
  </div>
</template>
