// 缓存版本由构建时注入，回退到时间戳
const CACHE_NAME = `tianjige-${__BUILD_HASH__ || Date.now()}`
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
]

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// 通知所有客户端有更新
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting()
  }
})

// 请求事件 - 网络优先策略
self.addEventListener('fetch', (event) => {
  // 跳过非GET请求
  if (event.request.method !== 'GET') {
    return
  }

  // 跳过API请求
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 克隆响应
        const responseClone = response.clone()

        // 缓存静态资源
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }

        return response
      })
      .catch(() => {
        // 网络失败时从缓存获取
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }

          // 如果是页面请求，返回离线页面
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }

          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        })
      })
  )
})
