<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fortune = ref('')
const fortunes = [
  '此路不通，另寻他径',
  '迷途知返，善莫大焉',
  '此非汝之归处',
  '天机不可泄露于此',
  '卦象显示：回头是岸',
  '此路已封，改道而行',
  '命中注定，此页与你无缘',
  '冥冥之中，自有安排',
]

onMounted(() => {
  fortune.value = fortunes[Math.floor(Math.random() * fortunes.length)]
})

function goHome() {
  router.push('/')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="animate-fade-in text-center py-16 md:py-24">
    <!-- 大号404 -->
    <div class="relative mb-8">
      <div class="text-[120px] md:text-[180px] font-display text-gold/10 leading-none select-none">
        404
      </div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-6xl md:text-8xl animate-spin-slow" style="animation-duration: 10s;">☯</div>
      </div>
    </div>

    <!-- 标题 -->
    <h1 class="text-2xl md:text-3xl font-display text-gold mb-4">此路不通</h1>

    <!-- 随机签文 -->
    <div class="mb-8">
      <div class="inline-block bg-dark-card border border-border rounded-lg px-6 py-3">
        <p class="text-text-muted text-sm italic">「{{ fortune }}」</p>
      </div>
    </div>

    <!-- 描述 -->
    <p class="text-text-muted mb-8 max-w-md mx-auto">
      天机不可泄露，此页亦不存在。<br>
      也许是命运的安排，让你在此停留片刻。
    </p>

    <!-- 按钮 -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button @click="goHome" class="btn-gold">
        返回首页
      </button>
      <button @click="goBack" class="btn-outline">
        返回上页
      </button>
    </div>

    <!-- 装饰 -->
    <div class="mt-16 flex items-center justify-center gap-4 text-text-muted text-xs">
      <span class="h-px w-12 bg-border"></span>
      <span>迷途旅人</span>
      <span class="h-px w-12 bg-border"></span>
    </div>
  </div>
</template>
