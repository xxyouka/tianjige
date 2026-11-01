<script setup>
import { ref } from 'vue'
import MdRender from '../../components/fortune/MdRender.vue'
import ErrorMessage from '../../components/ui/ErrorMessage.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import ShareButton from '../../components/ui/ShareButton.vue'
import AnimateIn from '../../components/ui/AnimateIn.vue'
import FloatingSymbols from '../../components/effects/FloatingSymbols.vue'
import GlowOrb from '../../components/effects/GlowOrb.vue'
import { api } from '../../services/api'
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'
import { majorArcana, tarotSpreads as spreads, tarotPositionNames as positionNames } from '../../constants/tarot'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const question = ref('')
const selectedSpread = ref('three')
const result = ref(null)
const flippedCards = ref([])
const flipTimers = []

function getCardMeaning(cardName, reversed) {
  for (const [name, data] of Object.entries(majorArcana)) {
    if (cardName.includes(name)) {
      return reversed ? data.reversed : data.upright
    }
  }
  return reversed ? '逆位：需要反思内在' : '正位：积极能量'
}

async function draw() {
  // 清除未完成的翻牌动画
  flipTimers.forEach(id => clearTimeout(id))
  flipTimers.length = 0
  result.value = null
  flippedCards.value = []

  const res = await request(({ signal }) =>
    api.drawTarot({
      spread: selectedSpread.value,
      question: question.value
    }, { signal })
  )

  if (res) {
    result.value = res

    const spreadName = spreads.find(s => s.id === selectedSpread.value)?.name || '塔罗牌'
    addRecord({
      type: 'tarot',
      summary: question.value || `${spreadName}占卜`,
      data: {
        spread: selectedSpread.value,
        question: question.value
      }
    })

    // 翻牌动画
    const cards = res.data.cards
    for (let i = 0; i < cards.length; i++) {
      const timerId = setTimeout(() => {
        flippedCards.value.push(i)
      }, i * 300)
      flipTimers.push(timerId)
    }
  }
}
</script>

<template>
  <div class="animate-fade-in relative">
    <!-- 背景效果 -->
    <FloatingSymbols :symbols="['🃏', '✦', '⭐', '🌙', '✨']" :count="10" />
    <GlowOrb color="#9333ea" :size="300" position="top-right" />
    <GlowOrb color="#d4a574" :size="200" position="bottom-left" />

    <!-- 标题 -->
    <PageHeader
      icon="🃏"
      title="塔罗牌"
      subtitle="聆听牌面的声音，洞察内心的秘密"
      accentColor="purple"
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

      <!-- 牌阵选择 -->
      <div class="mb-6">
        <label class="block text-text-muted text-sm mb-2">选择牌阵</label>
        <div class="grid grid-cols-3 gap-2 md:gap-3">
          <div
            v-for="spread in spreads"
            :key="spread.id"
            @click="selectedSpread = spread.id"
            :class="[
              selectedSpread === spread.id
                ? 'border-gold bg-dark-card'
                : 'border-border hover:border-gold-dark',
              'p-4 rounded-lg border cursor-pointer transition-all text-center'
            ]"
          >
            <div class="text-gold text-lg mb-1">{{ spread.name }}</div>
            <div class="text-text-muted text-xs">{{ spread.count }}张牌 · {{ spread.desc }}</div>
          </div>
        </div>
      </div>

      <button @click="draw" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在洗牌...' : '抽取塔罗牌' }}
      </button>

      <ErrorMessage :message="error" @retry="draw" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在洗牌..."
      subtext="请静心冥想你的问题"
    />

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 牌面展示 -->
      <div class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-6 font-display">牌面</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <div
            v-for="(card, index) in result.data.cards"
            :key="index"
            class="relative"
          >
            <!-- 牌背 -->
            <div
              :class="[
                flippedCards.includes(index) ? 'opacity-0' : 'opacity-100',
                'w-24 h-36 bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg border-2 border-purple-500/50 flex items-center justify-center transition-opacity duration-500'
              ]"
            >
              <span class="text-3xl text-purple-300">✦</span>
            </div>

            <!-- 牌面 -->
            <div
              :class="[
                flippedCards.includes(index) ? 'opacity-100' : 'opacity-0',
                'absolute inset-0 w-24 h-36 bg-dark-card rounded-lg border-2 border-gold flex flex-col items-center justify-center p-2 transition-opacity duration-500'
              ]"
              :style="card.reversed ? 'transform: rotate(180deg)' : ''"
            >
              <div class="text-gold text-xs text-center font-display leading-tight">
                {{ card.name }}
              </div>
              <div class="text-text-muted text-[10px] mt-1">
                {{ card.reversed ? '逆位' : '正位' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 牌义速览 -->
        <div v-if="flippedCards.length === result.data.cards.length" class="mt-6 space-y-2">
          <div v-for="(card, index) in result.data.cards" :key="'meaning-' + index"
            class="bg-dark/50 p-3 rounded-lg border border-border/30 flex items-start gap-3">
            <div class="flex-shrink-0 w-8 text-center">
              <span class="text-gold text-xs">
                {{ positionNames[selectedSpread]?.[index] || `牌${index + 1}` }}
              </span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-gold font-display text-sm">{{ card.name }}</span>
                <span class="text-xs" :class="card.reversed ? 'text-red-400' : 'text-green-400'">
                  {{ card.reversed ? '逆位' : '正位' }}
                </span>
              </div>
              <div class="text-text-muted text-xs">
                {{ getCardMeaning(card.name, card.reversed) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">AI 解牌</h2>
          <ShareButton
            :text="`塔罗牌解读\n\n${result.data.cards.map((c, i) => `位置${i+1}：${c.name}（${c.reversed ? '逆位' : '正位'}）`).join('\n')}\n\n${result.interpretation}`"
            title="塔罗牌解读 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
