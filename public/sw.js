const CACHE_NAME = 'fate-atelier-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/App.css'
]

// 日志函数（Service Worker 中简化版本）
const isDev = self.location?.hostname === 'localhost' || self.location?.hostname === '127.0.0.1'
const log = (...args) => { if (isDev) console.log(...args) }
const logError = (...args) => { if (isDev) console.error(...args) }

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        log('Service Worker: 缓存已打开')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        logError('Service Worker: 缓存失败', error)
      })
  )
  self.skipWaiting()
})

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            log('Service Worker: 删除旧缓存', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果在缓存中找到，返回缓存版本
        if (response) {
          return response
        }
        // 否则从网络获取
        return fetch(event.request).then((response) => {
          // 检查响应是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          // 克隆响应
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
      })
      .catch(() => {
        // 如果网络请求失败，可以返回离线页面
        if (event.request.destination === 'document') {
          return caches.match('/index.html')
        }
      })
  )
})

