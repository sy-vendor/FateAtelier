const CACHE_NAME = 'fate-atelier-v2'
const CACHE_VERSION = '1.0.1'

// 日志函数（Service Worker 中简化版本）
const isDev = self.location?.hostname === 'localhost' || self.location?.hostname === '127.0.0.1'
const log = (...args) => { if (isDev) console.log(...args) }
const logError = (...args) => { if (isDev) console.error(...args) }

// 需要预缓存的关键资源（仅 HTML 和 manifest）
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
]

// 可缓存的资源类型
const CACHEABLE_TYPES = [
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'application/json',
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/webp',
  'font/woff',
  'font/woff2',
]

// 不应该缓存的资源
const EXCLUDE_PATTERNS = [
  /\/api\//,
  /\/socket\.io\//,
  /\/analytics/,
]

/**
 * 检查资源是否应该被缓存
 */
function shouldCache(request) {
  const url = new URL(request.url)
  
  // 只缓存同源请求
  if (url.origin !== self.location.origin) {
    return false
  }
  
  // 排除特定模式
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(url.pathname)) {
      return false
    }
  }
  
  // 检查资源类型
  const contentType = request.headers?.get('content-type') || ''
  return CACHEABLE_TYPES.some(type => contentType.includes(type))
}

/**
 * 获取缓存，如果失败则返回 null
 */
async function getCache() {
  try {
    return await caches.open(CACHE_NAME)
  } catch (error) {
    logError('Failed to open cache:', error)
    return null
  }
}

/**
 * 清理旧缓存
 */
async function cleanOldCaches() {
  try {
    const cacheNames = await caches.keys()
    const oldCaches = cacheNames.filter(name => name !== CACHE_NAME)
    
    if (oldCaches.length > 0) {
      log(`Cleaning up ${oldCaches.length} old cache(s)`)
      await Promise.all(oldCaches.map(name => caches.delete(name)))
    }
  } catch (error) {
    logError('Failed to clean old caches:', error)
  }
}

// 安装 Service Worker
self.addEventListener('install', (event) => {
  log('Service Worker: Installing...')
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await getCache()
        if (!cache) {
          logError('Service Worker: Cache not available, skipping pre-cache')
          return
        }
        
        log('Service Worker: Pre-caching critical resources')
        // 只预缓存关键资源，其他资源按需缓存
        await cache.addAll(CRITICAL_RESOURCES)
        log('Service Worker: Pre-cache complete')
      } catch (error) {
        logError('Service Worker: Pre-cache failed:', error)
        // 即使预缓存失败，也继续安装
      }
    })()
  )
  
  // 立即激活新的 Service Worker
  self.skipWaiting()
})

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  log('Service Worker: Activating...')
  
  event.waitUntil(
    (async () => {
      // 清理旧缓存
      await cleanOldCaches()
      
      // 立即控制所有客户端
      await self.clients.claim()
      log('Service Worker: Activated')
    })()
  )
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 只处理 GET 请求
  if (request.method !== 'GET') {
    return
  }
  
  // 只处理同源请求
  if (url.origin !== self.location.origin) {
    return
  }
  
  event.respondWith(
    (async () => {
      try {
        // 首先尝试从缓存获取
        const cache = await getCache()
        if (cache) {
          const cachedResponse = await cache.match(request)
          if (cachedResponse) {
            log(`Cache hit: ${url.pathname}`)
            return cachedResponse
          }
        }
        
        // 缓存未命中，从网络获取
        log(`Cache miss: ${url.pathname}`)
        const networkResponse = await fetch(request)
        
        // 检查响应是否有效
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse
        }
        
        // 检查是否应该缓存（避免把 HTML 当 JS/CSS 缓存导致 MIME 错误）
        const contentType = networkResponse.headers.get('content-type') || ''
        const isJsOrCss = /\.(js|css)(\?|$)/i.test(url.pathname)
        const wrongMime = isJsOrCss && contentType.includes('text/html')
        if (!wrongMime && shouldCache(request)) {
          const responseToCache = networkResponse.clone()
          cache?.put(request, responseToCache).catch(error => {
            logError(`Failed to cache ${url.pathname}:`, error)
          })
        }
        
        return networkResponse
      } catch (error) {
        logError(`Fetch failed for ${url.pathname}:`, error)
        
        // 如果是文档请求，尝试返回缓存的 index.html
        if (request.destination === 'document') {
          const cache = await getCache()
          if (cache) {
            const fallback = await cache.match('/index.html')
            if (fallback) {
              return fallback
            }
          }
        }
        
        // 返回错误响应
        return new Response('网络错误，请检查网络连接', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      }
    })()
  )
})

// 处理消息（用于手动清理缓存等操作）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      (async () => {
        try {
          await caches.delete(CACHE_NAME)
          log('Cache cleared by message')
          event.ports[0]?.postMessage({ success: true })
        } catch (error) {
          logError('Failed to clear cache:', error)
          event.ports[0]?.postMessage({ success: false, error: error.message })
        }
      })()
    )
  }
})
