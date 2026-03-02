// 这个 Service Worker 仅用于「下线旧版本并清理本域缓存」，不再做任何缓存逻辑

self.addEventListener('install', (event) => {
  // 立即进入激活阶段
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 删除当前 origin 下的所有 Cache Storage
      try {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      } catch (e) {
        // 忽略清理异常
      }

      // 取消自身注册，彻底下线 Service Worker
      try {
        await self.registration.unregister()
      } catch (e) {
        // 忽略卸载异常
      }
    })()
  )
})
