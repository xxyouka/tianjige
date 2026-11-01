<script setup>
import { ref, reactive } from 'vue'
import StarField from '../../components/ui/StarField.vue'
import MdRender from '../../components/fortune/MdRender.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import { api } from '../../services/api'
import { faceTypes, featureOptions, featureLabels, featureIcons } from '../../constants/faceReading'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const faceType = ref('')
const features = reactive({
  forehead: '',
  eyebrows: '',
  eyes: '',
  nose: '',
  mouth: '',
  ears: ''
})
const molePosition = ref('')
const additional = ref('')
const result = ref(null)
const activeStep = ref(0)

const steps = [
  { id: 'face', name: '面型' },
  { id: 'features', name: '五官' },
  { id: 'extra', name: '补充' },
]

function nextStep() {
  if (activeStep.value < steps.length - 1) {
    activeStep.value++
  }
}

function prevStep() {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

function isFeaturesComplete() {
  return features.forehead && features.eyebrows && features.eyes && features.nose && features.mouth && features.ears
}

async function analyze() {
  if (!faceType.value || !isFeaturesComplete()) return

  result.value = null

  const res = await request(({ signal }) =>
    api.analyzeFaceReading({
      faceType: faceTypes.find(f => f.id === faceType.value)?.name || faceType.value,
      forehead: featureOptions.forehead.find(f => f.id === features.forehead)?.name || features.forehead,
      eyebrows: featureOptions.eyebrows.find(f => f.id === features.eyebrows)?.name || features.eyebrows,
      eyes: featureOptions.eyes.find(f => f.id === features.eyes)?.name || features.eyes,
      nose: featureOptions.nose.find(f => f.id === features.nose)?.name || features.nose,
      mouth: featureOptions.mouth.find(f => f.id === features.mouth)?.name || features.mouth,
      ears: featureOptions.ears.find(f => f.id === features.ears)?.name || features.ears,
      molePosition: molePosition.value.trim(),
      additional: additional.value.trim()
    }, { signal })
  )

  if (res) {
    result.value = res
    addRecord({
      type: 'faceReading',
      summary: `${faceTypes.find(f => f.id === faceType.value)?.name || ''}面相分析`,
      data: { faceType: faceType.value }
    })
  }
}

function reset() {
  faceType.value = ''
  features.forehead = ''
  features.eyebrows = ''
  features.eyes = ''
  features.nose = ''
  features.mouth = ''
  features.ears = ''
  molePosition.value = ''
  additional.value = ''
  result.value = null
  activeStep.value = 0
}
</script>

<template>
  <div class="animate-fade-in relative">
    <StarField />

    <!-- 标题 -->
    <PageHeader
      icon="👤"
      title="面相分析"
      subtitle="面相五官，洞察运势吉凶"
    />

    <!-- 未分析状态 -->
    <div v-if="!result" class="relative z-10">
      <!-- 步骤指示器 -->
      <div class="flex justify-center gap-4 mb-6">
        <button v-for="(step, i) in steps" :key="step.id"
          @click="activeStep = i"
          :class="activeStep === i ? 'text-gold border-gold' : 'text-text-muted border-border/30 hover:text-text'"
          class="px-4 py-2 text-sm border-b-2 transition-all">
          {{ step.name }}
        </button>
      </div>

      <!-- 步骤1：面型 -->
      <div v-if="activeStep === 0" class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-4">选择你的面型</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button v-for="ft in faceTypes" :key="ft.id"
            @click="faceType = ft.id"
            :class="faceType === ft.id ? 'border-gold/60 bg-gold/10 ring-1 ring-gold/40' : 'border-border/30 bg-dark/50 hover:border-gold/30'"
            class="p-4 rounded-lg border text-left transition-all">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">{{ ft.icon }}</span>
              <span class="text-text font-display">{{ ft.name }}</span>
            </div>
            <div class="text-text-muted text-xs">{{ ft.desc }}</div>
          </button>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="nextStep" :disabled="!faceType"
            class="btn-gold text-sm px-6 py-2"
            :class="!faceType ? 'opacity-50 cursor-not-allowed' : ''">
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤2：五官 -->
      <div v-if="activeStep === 1" class="space-y-6">
        <div v-for="(options, key) in featureOptions" :key="key" class="card-ancient p-6">
          <h3 class="text-gold font-display mb-1">
            <span class="mr-2">{{ featureIcons[key] }}</span>
            {{ featureLabels[key] }}特征
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            <button v-for="opt in options" :key="opt.id"
              @click="features[key] = opt.id"
              :class="features[key] === opt.id ? 'border-gold/60 bg-gold/10' : 'border-border/30 bg-dark/50 hover:border-gold/30'"
              class="p-3 rounded-lg border text-left transition-all">
              <div class="text-text text-sm">{{ opt.name }}</div>
              <div class="text-text-muted text-xs">{{ opt.desc }}</div>
            </button>
          </div>
        </div>
        <div class="flex justify-between">
          <button @click="prevStep" class="btn-outline text-sm px-6 py-2">上一步</button>
          <button @click="nextStep" :disabled="!isFeaturesComplete()"
            class="btn-gold text-sm px-6 py-2"
            :class="!isFeaturesComplete() ? 'opacity-50 cursor-not-allowed' : ''">
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤3：补充信息 -->
      <div v-if="activeStep === 2" class="card-ancient p-6 mb-6">
        <h3 class="text-gold font-display mb-4">补充信息（选填）</h3>

        <div class="mb-4">
          <label class="block text-text-muted text-sm mb-1">痣的位置</label>
          <input v-model="molePosition" class="input-ancient w-full text-sm"
            placeholder="如：右眼角下方有痣、鼻尖有痣..." />
        </div>

        <div class="mb-4">
          <label class="block text-text-muted text-sm mb-1">其他特征</label>
          <textarea v-model="additional" class="input-ancient w-full text-sm" rows="3"
            placeholder="描述其他你注意到的面相特征，如：法令纹深、酒窝、美人尖等..."></textarea>
        </div>

        <div class="flex justify-between">
          <button @click="prevStep" class="btn-outline text-sm px-6 py-2">上一步</button>
          <button @click="analyze" :disabled="loading"
            class="btn-gold text-sm px-6 py-2"
            :class="loading ? 'opacity-50 cursor-not-allowed' : ''">
            {{ loading ? '分析中...' : '开始面相分析' }}
          </button>
        </div>
      </div>

      <!-- 错误提示 -->
      <ErrorMessage v-if="error" :message="error" @retry="analyze" class="mt-4" />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="relative z-10">
      <LoadingSpinner text="面相分析中，请稍候..." />
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
          <span class="text-xl">👤</span>
          <h3 class="text-gold font-display text-lg">面相详解</h3>
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </div>

    <!-- 底部装饰 -->
    <div v-if="!result && !loading" class="mt-12 text-center text-text-muted text-sm relative z-10">
      <div class="flex items-center justify-center gap-4 mb-2">
        <span class="h-px w-16 bg-border"></span>
        <span class="text-gold">👤</span>
        <span class="h-px w-16 bg-border"></span>
      </div>
      <p>面相五官，洞察人生运势</p>
    </div>
  </div>
</template>
