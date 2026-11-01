<script setup>
import { ref, onUnmounted } from 'vue'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import AnimateIn from '../../components/ui/AnimateIn.vue'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'
import { api } from '../../services/api'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const question = ref('')
const result = ref(null)
const shaking = ref(false)
const shakeCount = ref(0)
const showResult = ref(false)
let shakeInterval = null

onUnmounted(() => {
  if (shakeInterval) clearInterval(shakeInterval)
})

async function startShake() {
  if (loading.value) return

  shaking.value = true
  shakeCount.value = 0
  showResult.value = false
  result.value = null

  // 摇签动画
  shakeInterval = setInterval(() => {
    shakeCount.value++
    if (shakeCount.value >= 10) {
      clearInterval(shakeInterval)
      shaking.value = false
      drawLot()
    }
  }, 200)
}

async function drawLot() {
  const data = await request(({ signal }) =>
    api.drawLingqian({ question: question.value }, { signal })
  )

  if (data) {
    result.value = data
    addRecord({
      type: 'lingqian',
      summary: `第${data.data.number}签 ${data.data.level}`,
      data: { question: question.value }
    })
    setTimeout(() => {
      showResult.value = true
    }, 500)
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="🎋"
      title="灵签"
      subtitle="心诚则灵，摇签问事"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="mb-4">
        <label class="block text-text-muted text-sm mb-2">所问之事（可选）</label>
        <input
          v-model="question"
          class="input-ancient"
          placeholder="心中默念你的问题..."
        />
      </div>

      <!-- 签筒区域 -->
      <div class="flex flex-col items-center py-8">
        <!-- 签筒 -->
        <div
          :class="[
            shaking ? 'animate-shake' : '',
            'relative mb-8'
          ]"
        >
          <!-- 签筒主体 -->
          <div class="w-32 h-48 bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-3xl rounded-t-lg border-2 border-amber-600 relative overflow-hidden">
            <!-- 签条 -->
            <div class="absolute inset-x-2 top-4 bottom-4 flex flex-col items-center gap-1">
              <div
                v-for="i in 12"
                :key="i"
                :class="[
                  shaking ? 'animate-stick-shake' : '',
                  'w-1.5 h-8 bg-amber-300 rounded-full opacity-80'
                ]"
                :style="{ animationDelay: `${i * 50}ms` }"
              ></div>
            </div>
            <!-- 筒口 -->
            <div class="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-lg border-b border-amber-500"></div>
          </div>

          <!-- 签筒底座 -->
          <div class="w-36 h-4 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-lg mx-auto -mt-1"></div>
        </div>

        <!-- 摇签按钮 -->
        <button
          @click="startShake"
          :disabled="shaking || loading"
          :class="[
            shaking ? 'opacity-50 cursor-not-allowed' : 'btn-gold',
            'text-lg px-8 py-3'
          ]"
        >
          {{ shaking ? '摇签中...' : loading ? '正在解签...' : '摇签' }}
        </button>

        <!-- 摇签次数 -->
        <div v-if="shaking" class="mt-4 text-text-muted text-sm">
          已摇 {{ shakeCount }} 次...
        </div>
      </div>

      <ErrorMessage :message="error" @retry="startShake" />
    </div>

    <!-- 结果 -->
    <AnimateIn v-if="result" :delay="showResult ? 0 : 500">
      <!-- 签文 -->
      <div class="card-ancient p-6 mb-6">
        <div class="text-center mb-4">
          <div class="text-3xl text-gold mb-2">第{{ result.data.number }}签</div>
          <div :class="[
            result.data.level.includes('上') ? 'text-green-500' :
            result.data.level.includes('中') ? 'text-yellow-500' :
            'text-red-500',
            'text-xl font-display'
          ]">
            {{ result.data.level }}
          </div>
        </div>

        <div class="bg-dark p-6 rounded-lg text-center">
          <div class="text-text text-lg leading-relaxed whitespace-pre-line font-display">{{ result.data.poem }}</div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">解签</h2>
          <ShareButton
            :text="`灵签\n\n第${result.data.number}签 ${result.data.level}\n${result.data.poem}\n\n${result.interpretation}`"
            title="灵签 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(-15deg); }
  20% { transform: rotate(15deg); }
  30% { transform: rotate(-10deg); }
  40% { transform: rotate(10deg); }
  50% { transform: rotate(-5deg); }
  60% { transform: rotate(5deg); }
  70% { transform: rotate(-3deg); }
  80% { transform: rotate(3deg); }
  90% { transform: rotate(-1deg); }
}

@keyframes stick-shake {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-3px) rotate(-2deg); }
  75% { transform: translateX(3px) rotate(2deg); }
}

.animate-shake {
  animation: shake 1.5s ease-in-out;
}

.animate-stick-shake {
  animation: stick-shake 0.3s ease-in-out infinite;
}
</style>
