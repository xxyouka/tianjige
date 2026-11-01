<script setup>
import { ref } from 'vue'
import StarField from '../../components/ui/StarField.vue'
import MdRender from '../../components/fortune/MdRender.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import { api } from '../../services/api'
import { handTypes, lifeLineOptions, wisdomLineOptions, heartLineOptions, fingerTypes } from '../../constants/palmistry'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const handType = ref('')
const lifeLine = ref('')
const wisdomLine = ref('')
const heartLine = ref('')
const fingerType = ref('')
const additional = ref('')
const result = ref(null)

async function analyze() {
  if (!handType.value || !lifeLine.value || !wisdomLine.value || !heartLine.value) return

  result.value = null

  const handName = handTypes.find(h => h.id === handType.value)?.name || handType.value
  const fingerName = fingerTypes.find(f => f.id === fingerType.value)?.name || ''

  const res = await request(({ signal }) =>
    api.analyzePalmistry({
      handType: handName,
      lifeLine: lifeLine.value,
      wisdomLine: wisdomLine.value,
      heartLine: heartLine.value,
      fingerType: fingerName,
      additional: additional.value.trim()
    }, { signal })
  )

  if (res) {
    result.value = res
    addRecord({
      type: 'palmistry',
      summary: `${handName}手相分析`,
      data: { handType: handType.value, lifeLine: lifeLine.value }
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
      icon="✋"
      title="手相分析"
      subtitle="掌纹密码，解读人生运势"
    />

    <!-- 未分析状态 -->
    <div v-if="!result" class="relative z-10">
      <!-- 手型选择 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-4">选择你的手型</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button v-for="ht in handTypes" :key="ht.id"
            @click="handType = ht.id"
            :class="handType === ht.id ? 'border-gold/60 bg-gold/10 ring-1 ring-gold/40' : 'border-border/30 bg-dark/50 hover:border-gold/30'"
            class="p-4 rounded-lg border text-left transition-all">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">{{ ht.icon }}</span>
              <span class="text-text font-display">{{ ht.name }}</span>
            </div>
            <div class="text-text-muted text-xs">{{ ht.desc }}</div>
          </button>
        </div>
      </div>

      <!-- 生命线 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-2">生命线特征</h3>
        <p class="text-text-muted text-xs mb-4">生命线是拇指与食指之间向手腕延伸的弧形线</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button v-for="opt in lifeLineOptions" :key="opt"
            @click="lifeLine = opt"
            :class="lifeLine === opt ? 'border-gold/60 bg-gold/10' : 'border-border/30 bg-dark/50 hover:border-gold/30'"
            class="p-3 rounded-lg border text-sm text-left transition-all text-text">
            {{ opt }}
          </button>
        </div>
      </div>

      <!-- 智慧线 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-2">智慧线特征</h3>
        <p class="text-text-muted text-xs mb-4">智慧线是拇指与食指之间横向延伸的线</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button v-for="opt in wisdomLineOptions" :key="opt"
            @click="wisdomLine = opt"
            :class="wisdomLine === opt ? 'border-gold/60 bg-gold/10' : 'border-border/30 bg-dark/50 hover:border-gold/30'"
            class="p-3 rounded-lg border text-sm text-left transition-all text-text">
            {{ opt }}
          </button>
        </div>
      </div>

      <!-- 感情线 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-2">感情线特征</h3>
        <p class="text-text-muted text-xs mb-4">感情线是小指下方横向延伸的线</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button v-for="opt in heartLineOptions" :key="opt"
            @click="heartLine = opt"
            :class="heartLine === opt ? 'border-gold/60 bg-gold/10' : 'border-border/30 bg-dark/50 hover:border-gold/30'"
            class="p-3 rounded-lg border text-sm text-left transition-all text-text">
            {{ opt }}
          </button>
        </div>
      </div>

      <!-- 手指类型 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-2">手指类型（选填）</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <button v-for="ft in fingerTypes" :key="ft.id"
            @click="fingerType = fingerType === ft.id ? '' : ft.id"
            :class="fingerType === ft.id ? 'border-gold/60 bg-gold/10' : 'border-border/30 bg-dark/50 hover:border-gold/30'"
            class="p-3 rounded-lg border text-left transition-all">
            <div class="text-text text-sm">{{ ft.name }}</div>
            <div class="text-text-muted text-xs">{{ ft.desc }}</div>
          </button>
        </div>
      </div>

      <!-- 其他特征 -->
      <div class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-2">其他特征（选填）</h3>
        <textarea v-model="additional" class="input-ancient w-full text-sm" rows="3"
          placeholder="描述其他你注意到的掌纹特征，如：有明显的太阳线、事业线清晰、婚姻线分叉等..."></textarea>
      </div>

      <!-- 提交按钮 -->
      <div class="relative z-10">
        <button @click="analyze"
          :disabled="!handType || !lifeLine || !wisdomLine || !heartLine || loading"
          class="btn-gold w-full text-lg py-3"
          :class="!handType || !lifeLine || !wisdomLine || !heartLine || loading ? 'opacity-50 cursor-not-allowed' : ''">
          {{ loading ? '分析中...' : '开始手相分析' }}
        </button>
      </div>

      <!-- 错误提示 -->
      <ErrorMessage v-if="error" :message="error" @retry="analyze" class="mt-4" />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="relative z-10">
      <LoadingSpinner text="手相分析中，请稍候..." />
    </div>

    <!-- 分析结果 -->
    <div v-if="result && !loading" class="relative z-10">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <button @click="reset" class="text-text-muted hover:text-gold transition-colors text-sm">
          ← 重新分析
        </button>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xl">✋</span>
          <h3 class="text-gold font-display text-lg">手相详解</h3>
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </div>

    <!-- 底部装饰 -->
    <div v-if="!result && !loading" class="mt-12 text-center text-text-muted text-sm relative z-10">
      <div class="flex items-center justify-center gap-4 mb-2">
        <span class="h-px w-16 bg-border"></span>
        <span class="text-gold">✋</span>
        <span class="h-px w-16 bg-border"></span>
      </div>
      <p>掌纹藏玄机，一掌定乾坤</p>
    </div>
  </div>
</template>
