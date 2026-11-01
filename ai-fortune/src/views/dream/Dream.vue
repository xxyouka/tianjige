<script setup>
import { ref, computed } from 'vue'
import StarField from '../../components/ui/StarField.vue'
import MdRender from '../../components/fortune/MdRender.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import { api } from '../../services/api'
import { dreamSymbolMap, dreamCategoryIcons, dreamTimePeriods, getLevelColor } from '../../constants'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const dreamInput = ref('')
const dreamSymbols = ref([])
const dreamTime = ref('')
const freeText = ref('')
const analyzed = ref(false)
const analysisResult = ref(null)
const activeCategory = ref(null)

const categories = computed(() => {
  const cats = {}
  for (const [sym, data] of Object.entries(dreamSymbolMap)) {
    if (!cats[data.category]) cats[data.category] = []
    cats[data.category].push(sym)
  }
  return cats
})

function addSymbol(sym) {
  if (!dreamSymbols.value.includes(sym)) {
    dreamSymbols.value.push(sym)
  }
}

function removeSymbol(index) {
  dreamSymbols.value.splice(index, 1)
}

function addCustomSymbol() {
  const sym = dreamInput.value.trim()
  if (sym && !dreamSymbols.value.includes(sym)) {
    dreamSymbols.value.push(sym)
    dreamInput.value = ''
  }
}

async function analyzeDream() {
  if (dreamSymbols.value.length === 0 && !freeText.value.trim()) return

  analysisResult.value = null

  const res = await request(({ signal }) =>
    api.analyzeDream({
      symbols: dreamSymbols.value,
      dreamTime: dreamTime.value,
      freeText: freeText.value.trim()
    }, { signal })
  )

  if (res) {
    analysisResult.value = res
    analyzed.value = true
    addRecord({
      type: 'dream',
      summary: dreamSymbols.value.slice(0, 3).join('、') || '梦境解析',
      data: { symbols: dreamSymbols.value, dreamTime: dreamTime.value }
    })
  }
}

function reset() {
  dreamSymbols.value = []
  dreamInput.value = ''
  dreamTime.value = ''
  freeText.value = ''
  analyzed.value = false
  analysisResult.value = null
  activeCategory.value = null
}

</script>

<template>
  <div class="animate-fade-in relative">
    <StarField />

    <!-- 标题 -->
    <PageHeader
      icon="🌙"
      title="梦境解析"
      subtitle="周公解梦，解读梦境中的秘密"
    />

    <!-- 未分析状态 -->
    <div v-if="!analyzed && !loading" class="relative z-10">
      <!-- 输入区 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-4">记录你的梦境</h3>

        <!-- 自由描述 -->
        <div class="mb-4">
          <label class="block text-text-muted text-sm mb-2">梦境描述（选填，越详细解读越准确）</label>
          <textarea v-model="freeText" class="input-ancient w-full text-sm" rows="3"
            placeholder="描述你的梦境，如：梦到自己在天空中飞翔，看到下面有条大河..."></textarea>
        </div>

        <div class="flex gap-2 mb-4">
          <input v-model="dreamInput" class="input-ancient flex-1 text-sm"
            placeholder="输入梦境关键词，如：飞翔、水、龙..."
            @keyup.enter="addCustomSymbol" />
          <button @click="addCustomSymbol" class="btn-gold text-sm px-4">添加</button>
        </div>

        <!-- 已选符号 -->
        <div v-if="dreamSymbols.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span v-for="(sym, i) in dreamSymbols" :key="i"
            class="bg-dark-card border border-gold/30 text-gold px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 group">
            <span>{{ sym }}</span>
            <span v-if="dreamSymbolMap[sym]" class="text-xs" :class="getLevelColor(dreamSymbolMap[sym].level)">
              {{ dreamSymbolMap[sym].level }}
            </span>
            <button @click="removeSymbol(i)" class="text-text-muted hover:text-red-400 transition-colors" aria-label="移除标签">×</button>
          </span>
        </div>

        <!-- 梦境时间 -->
        <div class="mb-4">
          <label class="block text-text-muted text-sm mb-2">梦境时间（选填）</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button v-for="tp in dreamTimePeriods" :key="tp.id"
              @click="dreamTime = dreamTime === tp.id ? '' : tp.id"
              :class="dreamTime === tp.id ? 'btn-gold' : 'btn-outline'"
              class="text-xs py-2 px-3">
              {{ tp.name }}
            </button>
          </div>
        </div>

        <button @click="analyzeDream"
          :disabled="(dreamSymbols.length === 0 && !freeText.trim()) || loading"
          class="btn-gold w-full text-lg py-3"
          :class="(dreamSymbols.length === 0 && !freeText.trim()) || loading ? 'opacity-50 cursor-not-allowed' : ''">
          {{ loading ? '解析中...' : '解析梦境' }}
        </button>
      </div>

      <!-- 错误提示 -->
      <ErrorMessage v-if="error" :message="error" @retry="analyzeDream" class="mb-6" />

      <!-- 符号库 -->
      <div class="card-ancient p-6">
        <h3 class="text-gold font-display mb-4">梦境符号库</h3>
        <p class="text-text-muted text-sm mb-4">点击添加你梦境中出现的元素</p>

        <!-- 分类切换 -->
        <div class="flex flex-wrap gap-2 mb-4">
          <button @click="activeCategory = null"
            :class="activeCategory === null ? 'bg-gold text-dark' : 'bg-dark-card text-text-muted hover:text-text'"
            class="px-3 py-1.5 rounded-lg text-sm transition-all">
            全部
          </button>
          <button v-for="(symbols, cat) in categories" :key="cat"
            @click="activeCategory = cat"
            :class="activeCategory === cat ? 'bg-gold text-dark' : 'bg-dark-card text-text-muted hover:text-text'"
            class="px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1">
            <span>{{ dreamCategoryIcons[cat] }}</span>
            <span>{{ cat }}</span>
          </button>
        </div>

        <!-- 符号网格 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          <template v-for="(symbols, cat) in categories" :key="cat">
            <template v-if="!activeCategory || activeCategory === cat">
              <button v-for="sym in symbols" :key="sym"
                @click="addSymbol(sym)"
                :class="dreamSymbols.includes(sym) ? 'border-gold/60 bg-gold/10' : 'border-border/30 bg-dark/50 hover:border-gold/30'"
                class="p-2 rounded-lg border text-sm transition-all text-left">
                <div class="flex items-center justify-between">
                  <span class="text-text">{{ sym }}</span>
                  <span class="text-xs" :class="getLevelColor(dreamSymbolMap[sym]?.level)">
                    {{ dreamSymbolMap[sym]?.level }}
                  </span>
                </div>
                <div class="text-text-muted text-xs mt-0.5 truncate">{{ dreamSymbolMap[sym]?.meaning }}</div>
              </button>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="relative z-10">
      <LoadingSpinner text="梦境解析中，请稍候..." />
    </div>

    <!-- 分析结果 -->
    <div v-if="analyzed && analysisResult && !loading" class="relative z-10">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <button @click="reset" class="text-text-muted hover:text-gold transition-colors text-sm">
          ← 重新解析
        </button>
      </div>

      <!-- 基本信息 -->
      <div class="card-ancient p-6 mb-6">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-2xl">🌙</span>
          <h3 class="text-gold font-display text-xl">AI 梦境解读</h3>
        </div>
        <div class="text-text-muted text-sm mb-3">
          解析符号：<span class="text-gold">{{ analysisResult.data.symbols.join('、') }}</span>
          <span v-if="analysisResult.data.dreamTime"> · 时间：{{ dreamTimePeriods.find(t => t.id === analysisResult.data.dreamTime)?.name }}</span>
        </div>
      </div>

      <!-- AI 解读内容 -->
      <div class="card-ancient p-6 mb-6">
        <MdRender :content="analysisResult.interpretation" />
      </div>

      <!-- 解梦小贴士 -->
      <div class="card-ancient p-6">
        <h3 class="text-gold font-display mb-4">解梦小贴士</h3>
        <div class="space-y-2 text-sm text-text-muted">
          <p>· 梦境是潜意识的表达，不必过度担忧</p>
          <p>· 同一梦境对不同人可能有不同含义</p>
          <p>· 关注梦境中的情绪感受，比具体情节更重要</p>
          <p>· 反复出现的梦境值得深入思考</p>
          <p>· 记录梦境有助于更好地了解自己</p>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div v-if="!analyzed && !loading" class="mt-12 text-center text-text-muted text-sm relative z-10">
      <div class="flex items-center justify-center gap-4 mb-2">
        <span class="h-px w-16 bg-border"></span>
        <span class="text-gold">🌙</span>
        <span class="h-px w-16 bg-border"></span>
      </div>
      <p>记录梦境，解读潜意识的秘密</p>
    </div>
  </div>
</template>
