import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import './components/ui/ui.css'
import { logger } from './utils/logger'
import { LocaleProvider } from './i18n/LocaleContext'

// Pause decorative infinite animations while the tab is hidden.
document.addEventListener('visibilitychange', () => {
  document.documentElement.classList.toggle('app-background-paused', document.hidden)
})

const SW_RETIRED_KEY = 'fate-atelier-sw-retired-v1'

/** Unregister leftover Service Workers and drop Cache Storage. App is not a PWA. */
function clearSwAndCache(): Promise<void> {
  if (!('serviceWorker' in navigator)) return Promise.resolve()
  return navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => Promise.all(registrations.map((r) => r.unregister())))
    .then(() => {
      if (!('caches' in window)) return
      return caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
    })
    .then(() => {
      logger.log('Service Worker / cache cleanup finished')
    })
    .catch((e) => {
      logger.warn('Service Worker / cache cleanup failed:', e)
    })
}

if (typeof window !== 'undefined') {
  if (window.location.search.includes('clearCache')) {
    void clearSwAndCache().then(() => {
      try {
        localStorage.setItem(SW_RETIRED_KEY, '1')
      } catch {
        // ignore
      }
      const url = new URL(window.location.href)
      url.searchParams.delete('clearCache')
      window.history.replaceState(null, '', url.pathname + url.search)
      window.location.reload()
    })
  } else if ('serviceWorker' in navigator) {
    let alreadyCleared = false
    try {
      alreadyCleared = localStorage.getItem(SW_RETIRED_KEY) === '1'
    } catch {
      alreadyCleared = false
    }
    if (!alreadyCleared) {
      void clearSwAndCache().then(() => {
        try {
          localStorage.setItem(SW_RETIRED_KEY, '1')
        } catch {
          // ignore
        }
      })
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
