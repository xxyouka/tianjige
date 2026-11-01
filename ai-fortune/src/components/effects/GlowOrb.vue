<script setup>
defineProps({
  color: {
    type: String,
    default: '#d4a574'
  },
  size: {
    type: Number,
    default: 200
  },
  position: {
    type: String,
    default: 'top-right' // top-right, top-left, bottom-right, bottom-left, center
  }
})

const positionClasses = {
  'top-right': '-top-20 -right-20',
  'top-left': '-top-20 -left-20',
  'bottom-right': '-bottom-20 -right-20',
  'bottom-left': '-bottom-20 -left-20',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
}
</script>

<template>
  <div
    :class="['absolute rounded-full blur-3xl animate-pulse-glow pointer-events-none', positionClasses[position]]"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      opacity: 0.15
    }"
  ></div>
</template>
