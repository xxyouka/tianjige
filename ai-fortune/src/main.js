import { createApp } from 'vue'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 新版本可用，通知用户
            const event = new CustomEvent('sw-update', { detail: newWorker })
            window.dispatchEvent(event)
          }
        })
      })
    }).catch((err) => {
      console.warn('SW 注册失败:', err)
    })
  })

  // 监听控制器变化（skipWaiting 后触发）
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true
      window.location.reload()
    }
  })
}
