import { onMounted, onUnmounted, watch } from 'vue'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(containerRef, active) {
  let previousFocus = null

  function trap(e) {
    if (!containerRef.value) return
    const focusable = containerRef.value.querySelectorAll(FOCUSABLE)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }

  function activate() {
    previousFocus = document.activeElement
    document.addEventListener('keydown', trap)
    // 延迟聚焦，等待 DOM 更新
    requestAnimationFrame(() => {
      if (containerRef.value) {
        const first = containerRef.value.querySelector(FOCUSABLE)
        first?.focus()
      }
    })
  }

  function deactivate() {
    document.removeEventListener('keydown', trap)
    previousFocus?.focus()
  }

  watch(active, (isActive) => {
    if (isActive) {
      activate()
    } else {
      deactivate()
    }
  })

  onUnmounted(() => {
    deactivate()
  })
}
