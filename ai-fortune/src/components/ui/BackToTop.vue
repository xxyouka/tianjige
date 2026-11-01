<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const scrollThreshold = 300

function checkScroll() {
  visible.value = window.scrollY > scrollThreshold
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <Transition name="fade-up">
    <button
      v-if="visible"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 w-12 h-12 bg-dark-card border border-gold/30 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/30"
      aria-label="回到顶部"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
