<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let animationId = null
let stars = []

onMounted(() => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')

  function resize() {
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = canvas.value.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // 创建星星
  const starCount = 80
  stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * canvas.value.width,
    y: Math.random() * canvas.value.height,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
    opacity: Math.random() * 0.8 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleOffset: Math.random() * Math.PI * 2
  }))

  let time = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    time += 0.016

    stars.forEach(star => {
      // 闪烁效果
      const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5
      const alpha = star.opacity * twinkle

      // 绘制星星
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(212, 165, 116, ${alpha})`
      ctx.fill()

      // 光晕效果
      if (star.size > 1.5) {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        )
        gradient.addColorStop(0, `rgba(212, 165, 116, ${alpha * 0.3})`)
        gradient.addColorStop(1, 'rgba(212, 165, 116, 0)')
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // 缓慢移动
      star.y -= star.speed
      if (star.y < -star.size) {
        star.y = canvas.value.height + star.size
        star.x = Math.random() * canvas.value.width
      }
    })

    // 绘制连接线（距离近的星星之间）
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x
        const dy = stars[i].y - stars[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.15
          ctx.beginPath()
          ctx.moveTo(stars[i].x, stars[i].y)
          ctx.lineTo(stars[j].x, stars[j].y)
          ctx.strokeStyle = `rgba(212, 165, 116, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()

  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas
    ref="canvas"
    class="absolute inset-0 pointer-events-none"
    style="z-index: 0;"
  ></canvas>
</template>
