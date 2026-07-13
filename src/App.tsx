import { useState, useMemo, useEffect, lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ToastContainer from './components/ToastContainer'
import ConfirmDialogContainer from './components/ConfirmDialogContainer'
import AppNav from './components/app/AppNav'
import AppFeatureRoutes from './components/app/AppFeatureRoutes'
import { FeatureIcon } from './components/app/FeatureIcon'
import { APP_FEATURES } from './constants/appFeatures'
import type { AppPage } from './types/appPage'
import { getPageSubtitle } from './utils/appSubtitles'
import { useTarotGame } from './hooks/useTarotGame'
import './components/app/app-shell.css'

const TarotLibrary = lazy(() => import('./components/tarot/TarotLibrary'))

function App() {
  const pageFromLocation = (): AppPage => {
    const slug = window.location.pathname.split('/').filter(Boolean)[0] || 'tarot'
    return APP_FEATURES.some((feature) => feature.page === slug) ? slug as AppPage : 'tarot'
  }
  const [currentPage, setCurrentPage] = useState<AppPage>(pageFromLocation)
  const tarot = useTarotGame()

  const currentFeature = useMemo(
    () => APP_FEATURES.find((f) => f.page === currentPage) ?? APP_FEATURES[0],
    [currentPage]
  )

  useEffect(() => {
    void import('./components/app/TarotMainView')
    void import('./components/tarot/TarotLibrary')
  }, [])

  useEffect(() => {
    const onPopState = () => setCurrentPage(pageFromLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
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

          {currentPage === 'tarot' && (
            <Suspense fallback={null}>
              <div className="shell-topbar__actions">
                <TarotLibrary onSelectCard={tarot.handleSelectCardFromBrowser} />
              </div>
            </Suspense>
          )}
        </header>

        <main className="shell-stage">
          <AppFeatureRoutes currentPage={currentPage} tarot={tarot} />
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
