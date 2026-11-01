<script setup>
defineProps({
  text: {
    type: String,
    default: '加载中...'
  },
  subtext: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="text-center py-12 animate-fade-in">
    <div class="relative inline-block mb-6">
      <!-- 外圈光晕 -->
      <div class="absolute inset-0 rounded-full bg-gold/10 animate-ping"></div>
      <!-- 主图标 -->
      <div class="relative text-5xl animate-spin-slow" style="animation-duration: 3s;">☯</div>
    </div>
    <p class="text-text-muted text-lg">{{ text }}</p>
    <p v-if="subtext" class="text-text-muted text-sm mt-2 opacity-70">{{ subtext }}</p>
    <!-- 加载进度点 -->
    <div class="flex justify-center gap-1.5 mt-4">
      <div class="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style="animation-delay: 0s;"></div>
      <div class="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style="animation-delay: 0.15s;"></div>
      <div class="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style="animation-delay: 0.3s;"></div>
    </div>
  </div>
</template>
