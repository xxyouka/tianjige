<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  accentColor: {
    type: String,
    default: 'gold' // gold, crimson, blue, purple, green
  }
})

const colorClasses = {
  gold: 'from-gold/20 to-transparent border-gold/30',
  crimson: 'from-crimson/20 to-transparent border-crimson/30',
  blue: 'from-blue-500/20 to-transparent border-blue-500/30',
  purple: 'from-purple-500/20 to-transparent border-purple-500/30',
  green: 'from-green-500/20 to-transparent border-green-500/30',
}

const iconBgClasses = {
  gold: 'bg-gold/10 border-gold/20',
  crimson: 'bg-crimson/10 border-crimson/20',
  blue: 'bg-blue-500/10 border-blue-500/20',
  purple: 'bg-purple-500/10 border-purple-500/20',
  green: 'bg-green-500/10 border-green-500/20',
}

const iconShadowClasses = {
  gold: 'shadow-gold/20',
  crimson: 'shadow-crimson/20',
  blue: 'shadow-blue-500/20',
  purple: 'shadow-purple-500/20',
  green: 'shadow-green-500/20',
}
</script>

<template>
  <div class="mb-8 relative group">
    <!-- 装饰背景 -->
    <div :class="['absolute -inset-x-4 -inset-y-2 bg-gradient-to-b rounded-2xl opacity-50 transition-opacity duration-300 group-hover:opacity-70', colorClasses[accentColor]]"></div>

    <div class="relative flex items-center gap-4">
      <!-- 图标容器 -->
      <div :class="['w-14 h-14 rounded-xl border flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105', iconBgClasses[accentColor], iconShadowClasses[accentColor]]">
        <span class="text-3xl transition-transform duration-300 group-hover:scale-110">{{ icon }}</span>
      </div>

      <!-- 文字 -->
      <div>
        <h1 class="text-2xl md:text-3xl font-display text-gold transition-all duration-300">{{ title }}</h1>
        <p v-if="subtitle" class="text-text-muted text-sm mt-1 transition-colors duration-300">{{ subtitle }}</p>
      </div>
    </div>

    <!-- 装饰线 -->
    <div class="mt-4 flex items-center gap-2">
      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <div class="w-1.5 h-1.5 rounded-full bg-gold/40"></div>
      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </div>
  </div>
</template>
