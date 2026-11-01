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
import { useHistory } from '../../composables/useHistory'
import { useApiRequest } from '../../composables/useApiRequest'
import { api } from '../../services/api'

const { addRecord } = useHistory()
const { loading, error, request } = useApiRequest()

const question = ref('')
const count = ref(3)
const result = ref(null)
const flipped = ref([])

async function draw() {
  result.value = null
  flipped.value = []

  const data = await request(({ signal }) =>
    api.drawRunes({
      count: count.value,
      question: question.value
    }, { signal })
  )

  if (data) {
    result.value = data
    addRecord({
      type: 'runes',
      summary: `${count.value}张卢恩符文`,
      data: { count: count.value, question: question.value }
    })

    const runes = data.data.runes
    for (let i = 0; i < runes.length; i++) {
      setTimeout(() => {
        flipped.value.push(i)
      }, i * 400)
    }
  }
}
</script>

<template>
  <div class="animate-fade-in relative">
    <!-- 背景效果 -->
    <FloatingSymbols :symbols="['ᚱ', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ']" :count="12" />
    <GlowOrb color="#3b82f6" :size="250" position="top-left" />
    <GlowOrb color="#d4a574" :size="200" position="bottom-right" />

    <!-- 标题 -->
    <PageHeader
      icon="ᚱ"
      title="卢恩符文"
      subtitle="北欧古文字，维京人的智慧"
      accentColor="blue"
    />

    <!-- 输入 -->
    <div class="card-ancient p-6 mb-6">
      <div class="mb-4">
        <label class="block text-text-muted text-sm mb-2">所问之事（选填）</label>
        <input v-model="question" class="input-ancient" placeholder="心中默念..." />
      </div>

      <div class="mb-4">
        <label class="block text-text-muted text-sm mb-2">抽取数量</label>
        <div class="flex gap-3">
          <button
            v-for="n in [1, 3, 5]"
            :key="n"
            @click="count = n"
            :class="count === n ? 'btn-gold' : 'btn-outline'"
            class="flex-1"
          >
            {{ n }} 张
          </button>
        </div>
      </div>

      <button @click="draw" :disabled="loading" class="btn-gold w-full">
        {{ loading ? '正在抽取...' : '抽取符文' }}
      </button>

      <ErrorMessage :message="error" @retry="draw" />
    </div>

    <!-- 加载中 -->
    <LoadingSpinner
      v-if="loading"
      text="正在抽取符文..."
      subtext="感受北欧古文字的力量"
    />

    <!-- 结果 -->
    <AnimateIn v-if="result">
      <!-- 符文展示 -->
      <div class="card-ancient p-6 mb-6">
        <h2 class="text-xl text-gold mb-6 font-display">符文</h2>
        <div class="flex justify-center gap-3 md:gap-6 flex-wrap">
          <div
            v-for="(rune, i) in result.data.runes"
            :key="i"
            class="relative"
          >
            <!-- 符文背 -->
            <div
              :class="[
                flipped.includes(i) ? 'opacity-0' : 'opacity-100',
                'w-24 h-32 bg-gradient-to-br from-slate-800 to-slate-950 rounded-lg border-2 border-amber-700 flex items-center justify-center transition-opacity duration-500'
              ]"
            >
              <span class="text-3xl text-amber-500">ᛟ</span>
            </div>

            <!-- 符文面 -->
            <div
              :class="[
                flipped.includes(i) ? 'opacity-100' : 'opacity-0',
                'absolute inset-0 w-24 h-32 bg-dark-card rounded-lg border-2 border-gold flex flex-col items-center justify-center p-2 transition-opacity duration-500'
              ]"
            >
              <div class="text-4xl text-gold mb-1" :style="rune.isReversed ? 'transform: rotate(180deg)' : ''">{{ rune.symbol }}</div>
              <div class="text-gold text-xs font-display">{{ rune.name }}</div>
              <div class="text-text-muted text-[10px] mt-1">{{ rune.isReversed ? rune.reversedMeaning : rune.meaning }}</div>
              <div v-if="rune.isReversed" class="text-red-500 text-[10px]">逆位</div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI 解读 -->
      <div class="card-ancient p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl text-gold font-display">符文解读</h2>
          <ShareButton
            :text="`卢恩符文\n\n${result.data.runes.map(r => `${r.name}${r.isReversed ? '（逆位）' : ''}`).join('\n')}\n\n${result.interpretation}`"
            title="卢恩符文 - 天机阁"
          />
        </div>
        <MdRender :content="result.interpretation" />
      </div>
    </AnimateIn>
  </div>
</template>
