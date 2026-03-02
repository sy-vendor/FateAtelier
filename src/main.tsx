import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import { logger } from './utils/logger'

/** 强制清理：卸载当前 origin 下所有 Service Worker，并删除所有 Cache Storage */
function forceClearSwAndCache(): Promise<void> {
  if (!('serviceWorker' in navigator)) return Promise.resolve()
  return navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => Promise.all(registrations.map((r) => r.unregister())))
    .then(() => {
      if (!('caches' in window)) return
      return caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
    })
    .then(() => { logger.log('强制清理完成：已卸载 SW 并清空缓存') })
    .catch((e) => { logger.warn('强制清理失败：', e) })
}

// 通过 URL 参数 ?clearCache 触发一次强制清理（任意环境可用）
if (typeof window !== 'undefined' && window.location.search.includes('clearCache')) {
  forceClearSwAndCache().then(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete('clearCache')
    window.history.replaceState(null, '', url.pathname + url.search)
    window.location.reload()
  })
} else if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // 生产环境：注册「清理型」sw.js，老用户下次访问时会自动替换旧 SW、清缓存并自注销，无需用户手动清理
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    })
  } else {
    // 开发环境：每次加载都强制清理 SW 与全部缓存，避免 localhost:5173 影响其它项目
    forceClearSwAndCache()
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

