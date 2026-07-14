import { useState, useMemo, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ToastContainer from './components/ToastContainer'
import ConfirmDialogContainer from './components/ConfirmDialogContainer'
import AppNav from './components/app/AppNav'
import AppFeatureRoutes from './components/app/AppFeatureRoutes'
import DailyJourney from './components/app/DailyJourney'
import { FeatureIcon } from './components/app/FeatureIcon'
import { APP_FEATURES } from './constants/appFeatures'
import type { AppPage } from './types/appPage'
import { getPageSubtitle } from './utils/appSubtitles'
import { useDailyJourney } from './hooks/useDailyJourney'
import { APP_NAVIGATE_EVENT } from './utils/appNavigation'
import './components/app/app-shell.css'

function App() {
  const pageFromLocation = (): AppPage => {
    const slug = window.location.pathname.split('/').filter(Boolean)[0] || 'tarot'
    return APP_FEATURES.some((feature) => feature.page === slug) ? slug as AppPage : 'tarot'
  }
  const [currentPage, setCurrentPage] = useState<AppPage>(pageFromLocation)
  const dailyJourney = useDailyJourney(currentPage)

  const currentFeature = useMemo(
    () => APP_FEATURES.find((f) => f.page === currentPage) ?? APP_FEATURES[0],
    [currentPage]
  )

  useEffect(() => {
    const onPopState = () => setCurrentPage(pageFromLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const page = (event as CustomEvent<AppPage>).detail
      if (!APP_FEATURES.some((feature) => feature.page === page)) return
      window.history.pushState(null, '', `/${page}`)
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener(APP_NAVIGATE_EVENT, onNavigate)
    return () => window.removeEventListener(APP_NAVIGATE_EVENT, onNavigate)
  }, [])

  useEffect(() => {
    // Detail landing pages are emitted with their own server-rendered metadata.
    // Preserve it after React mounts so crawlers keep the long-tail canonical.
    if (window.location.pathname.split('/').filter(Boolean).length > 1) return
    const canonicalUrl = `https://www.fateatelier.cloud/${currentPage}`
    document.title = `${currentFeature.seoTitle} | 命运工坊`
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', currentFeature.description)
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', currentFeature.description)
    document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
  }, [currentFeature, currentPage])

  const navigateTo = (page: AppPage) => {
    if (page === currentPage) return
    window.history.pushState(null, '', `/${page}`)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="shell">
      <div className="shell__backdrop aurora-orbs" aria-hidden="true">
        <span className="aurora-orb aurora-orb--violet" />
        <span className="aurora-orb aurora-orb--rose" />
        <span className="aurora-orb aurora-orb--cyan" />
      </div>

      <AppNav currentPage={currentPage} onSelect={navigateTo} />

      <div className="shell__main">
        <header className="shell-topbar">
          <div className="shell-topbar__feature">
            <span className="shell-topbar__icon" aria-hidden>
              <FeatureIcon page={currentPage} size="lg" />
            </span>
            <div className="shell-topbar__text">
              <h1 className="shell-topbar__title">{currentFeature.name}</h1>
              <p className="shell-topbar__sub">{getPageSubtitle(currentPage)}</p>
            </div>
          </div>

        </header>

        <DailyJourney {...dailyJourney} onSelect={navigateTo} />

        <main className="shell-stage">
          <AppFeatureRoutes currentPage={currentPage} />
        </main>

        <footer className="shell-footer">
          <p>
            © {new Date().getFullYear()} 命运工坊 · 仅供娱乐参考 ·{' '}
            <a
              href="https://github.com/sy-vendor/FateAtelier"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>

      <ToastContainer />
      <ConfirmDialogContainer />
      <Analytics />
    </div>
  )
}

export default App
