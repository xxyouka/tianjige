<script setup>
import { ref } from 'vue'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import AnimateIn from '../../components/ui/AnimateIn.vue'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'
import { api } from '../../services/api'
import { analyzeName } from '../../utils/enhancedNameFiveGridUtils'
import { getLevelColor } from '../../constants'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const name = ref('')
const gender = ref('male')
const result = ref(null)
const analyzing = ref(false)
const fiveGridResult = ref(null)

function getLevelBg(level) {
  if (level === '大吉' || level === '吉') return 'bg-green-400/10 border-green-400/30'
  if (level === '凶') return 'bg-red-400/10 border-red-400/30'
  return 'bg-dark/50 border-border/30'
}

function analyzeFiveGrid() {
  if (!name.value || name.value.length < 2) return
  const surname = name.value[0]
  const givenName = name.value.slice(1)
  fiveGridResult.value = analyzeName(surname, givenName)
}

async function analyze() {
  if (!name.value) {
    error.value = '请输入姓名'
    return
  }

  result.value = null
  analyzing.value = true

  analyzeFiveGrid()

  const data = await request(({ signal }) =>
    api.analyzeXingming({
      name: name.value,
      gender: gender.value
    }, { signal })
  )

  if (data) {
    result.value = data
    addRecord({
      type: 'xingming',
      summary: `姓名测算：${name.value}`,
      data: { name: name.value, gender: gender.value }
    })
    setTimeout(() => {
      analyzing.value = false
    }, 800)
  } else {
    analyzing.value = false
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="📝"
      title="姓名测算"
      subtitle="姓名藏玄机，一字定乾坤"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-text-muted text-sm mb-2">姓名</label>
          <input
            v-model="name"
            class="input-ancient text-lg"
            placeholder="请输入姓名"
            maxlength="20"
          />
        </div>
        <div>
          <label class="block text-text-muted text-sm mb-2">性别</label>
          <div class="flex gap-2">
            <button
              @click="gender = 'male'"
              :class="gender === 'male' ? 'btn-gold' : 'btn-outline'"
              class="flex-1"
            >男</button>
            <button
              @click="gender = 'female'"
              :class="gender === 'female' ? 'btn-gold' : 'btn-outline'"
              class="flex-1"
            >女</button>
          </div>
        </div>
      </div>

      <button @click="analyze" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在测算...' : '测算姓名' }}
      </button>

      <ErrorMessage :message="error" @retry="analyze" />
    </div>

    <!-- 分析动画 -->
    <div v-if="analyzing" class="card-ancient p-8 mb-6">
      <div class="flex flex-col items-center">
        <div class="text-3xl md:text-6xl text-gold mb-4 animate-pulse">{{ name }}</div>
        <div class="flex gap-2">
          <div v-for="(char, i) in name" :key="i"
            class="w-12 h-12 bg-dark border border-gold rounded-lg flex items-center justify-center text-gold text-xl animate-bounce"
            :style="{ animationDelay: `${i * 200}ms` }"
          >
            {{ char }}
          </div>
        </div>
        <div class="text-text-muted text-sm mt-4">解析姓名中...</div>
      </div>
    </div>

    <!-- 结果 -->
    <AnimateIn v-if="result && !analyzing">
      <!-- 姓名展示 -->
      <div class="card-ancient p-6 mb-6">
        <div class="text-center">
          <div class="text-3xl md:text-5xl text-gold font-display mb-2">{{ result.data.name }}</div>
          <div class="text-text-muted text-sm">姓名测算结果</div>
        </div>
      </div>

      <!-- 五格分析 -->
      <div v-if="fiveGridResult" class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold font-display mb-4 text-center">五格分析</h2>

        <!-- 五格 -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">天格</div>
            <div class="text-gold font-display text-lg">{{ fiveGridResult.wuGe.tianGe.strokes }}画</div>
            <div class="text-xs" :class="getLevelColor(fiveGridResult.wuGe.tianGe.level)">
              {{ fiveGridResult.wuGe.tianGe.level }}
            </div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">人格</div>
            <div class="text-gold font-display text-lg">{{ fiveGridResult.wuGe.renGe.strokes }}画</div>
            <div class="text-xs" :class="getLevelColor(fiveGridResult.wuGe.renGe.level)">
              {{ fiveGridResult.wuGe.renGe.level }}
            </div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">地格</div>
            <div class="text-gold font-display text-lg">{{ fiveGridResult.wuGe.diGe.strokes }}画</div>
            <div class="text-xs" :class="getLevelColor(fiveGridResult.wuGe.diGe.level)">
              {{ fiveGridResult.wuGe.diGe.level }}
            </div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">外格</div>
            <div class="text-gold font-display text-lg">{{ fiveGridResult.wuGe.waiGe.strokes }}画</div>
            <div class="text-xs" :class="getLevelColor(fiveGridResult.wuGe.waiGe.level)">
              {{ fiveGridResult.wuGe.waiGe.level }}
            </div>
          </div>
          <div class="bg-dark/50 p-3 rounded-lg border border-border/30 text-center">
            <div class="text-text-muted text-xs mb-1">总格</div>
            <div class="text-gold font-display text-lg">{{ fiveGridResult.wuGe.zongGe.strokes }}画</div>
            <div class="text-xs" :class="getLevelColor(fiveGridResult.wuGe.zongGe.level)">
              {{ fiveGridResult.wuGe.zongGe.level }}
            </div>
          </div>
        </div>

        <!-- 三才配置 -->
        <div class="bg-dark/50 p-4 rounded-lg border border-border/30 mb-4">
          <div class="text-gold font-display mb-2">三才配置</div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-text">{{ fiveGridResult.sanCai.tianWuXing }}</span>
            <span class="text-text-muted">-</span>
            <span class="text-text">{{ fiveGridResult.sanCai.renWuXing }}</span>
            <span class="text-text-muted">-</span>
            <span class="text-text">{{ fiveGridResult.sanCai.diWuXing }}</span>
            <span class="text-xs ml-2" :class="getLevelColor(fiveGridResult.sanCai.level)">
              {{ fiveGridResult.sanCai.level }}
            </span>
          </div>
          <div class="text-text-muted text-sm">{{ fiveGridResult.sanCai.description }}</div>
        </div>

        <!-- 综合评价 -->
        <div class="bg-dark/50 p-4 rounded-lg border" :class="getLevelBg(fiveGridResult.overall.level)">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-gold font-display">综合评价</span>
            <span class="text-sm" :class="getLevelColor(fiveGridResult.overall.level)">
              {{ fiveGridResult.overall.level }}
            </span>
          </div>
          <div class="text-text-muted text-sm mb-2">{{ fiveGridResult.overall.description }}</div>
          <div class="text-text-muted text-xs">
            吉格：{{ fiveGridResult.overall.jiCount }}个 · 凶格：{{ fiveGridResult.overall.xiongCount }}个
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">AI 姓名解析</h2>
          <ShareButton
            :text="`姓名测算\n\n姓名：${result.data.name}\n\n${result.interpretation}`"
            title="姓名测算 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
