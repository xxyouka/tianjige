<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  symbols: {
    type: Array,
    default: () => ['☰', '☯', '🌸', '⚖', '字', '🎋', '📝', '⭐', '🃏', '✧', '🔢', 'ᚱ', '🌺']
  },
  count: {
    type: Number,
    default: 15
  }
})

const floatingItems = ref([])

onMounted(() => {
  floatingItems.value = Array.from({ length: props.count }, () => ({
    symbol: props.symbols[Math.floor(Math.random() * props.symbols.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.15 + 0.05
  }))
})
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none" style="z-index: 0;">
    <div
      v-for="(item, index) in floatingItems"
      :key="index"
      class="absolute animate-float"
      :style="{
        left: `${item.x}%`,
        top: `${item.y}%`,
        fontSize: `${item.size}px`,
        opacity: item.opacity,
        animationDuration: `${item.duration}s`,
        animationDelay: `${item.delay}s`
      }"
    >
      {{ item.symbol }}
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-3deg);
  }
  75% {
    transform: translateY(-30px) rotate(2deg);
  }
}

.animate-float {
  animation: float linear infinite;
}
</style>
