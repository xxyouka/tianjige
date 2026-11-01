<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  delay: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 500
  },
  animation: {
    type: String,
    default: 'fade-up' // fade-up, fade-in, scale, slide-left, slide-right
  }
})

const visible = ref(false)

onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, props.delay)
})

const animationClasses = {
  'fade-up': 'translate-y-4 opacity-0',
  'fade-in': 'opacity-0',
  'scale': 'scale-95 opacity-0',
  'slide-left': '-translate-x-4 opacity-0',
  'slide-right': 'translate-x-4 opacity-0',
}
</script>

<template>
  <div
    :class="[
      'transition-all',
      visible ? '' : animationClasses[animation]
    ]"
    :style="{
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }"
  >
    <slot />
  </div>
</template>
