import { useState, useRef, lazy, Suspense, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ToastContainer from './components/ToastContainer'
import ConfirmDialogContainer from './components/ConfirmDialogContainer'
import AppCarousel from './components/app/AppCarousel'
import AppFeatureRoutes from './components/app/AppFeatureRoutes'
import { APP_FEATURES } from './constants/appFeatures'
import type { AppPage } from './types/appPage'
import { getPageSubtitle } from './utils/appSubtitles'
import { useTarotGame } from './hooks/useTarotGame'
import { usePreventHorizontalScroll } from './hooks/usePreventHorizontalScroll'
import { useSyncCarouselToPage } from './hooks/useSyncCarouselToPage'
import './App.css'

const CardBrowser = lazy(() => import('./components/CardBrowser'))
const Favorites = lazy(() => import('./components/Favorites'))
const HelpGuide = lazy(() => import('./components/HelpGuide'))

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('tarot')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselRotation, setCarouselRotation] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselContainerRef = useRef<HTMLDivElement>(null)
  const tarot = useTarotGame()
  usePreventHorizontalScroll(carouselContainerRef)

  const features = APP_FEATURES

  useSyncCarouselToPage(currentPage, features, setCarouselIndex, setCarouselRotation)

  useEffect(() => {
    void import('./components/app/TarotMainView')
    void import('./components/CardBrowser')
    void import('./components/Favorites')
    void import('./components/HelpGuide')
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔮 命运工坊</h1>
        <p className="subtitle">{getPageSubtitle(currentPage)}</p>

        <AppCarousel
          ref={carouselContainerRef}
          features={features}
          carouselIndex={carouselIndex}
          setCarouselIndex={setCarouselIndex}
          carouselRotation={carouselRotation}
          setCarouselRotation={setCarouselRotation}
          touchStart={touchStart}
          setTouchStart={setTouchStart}
          touchEnd={touchEnd}
          setTouchEnd={setTouchEnd}
          setCurrentPage={setCurrentPage}
        />

        {currentPage === 'tarot' && (
          <Suspense
            fallback={
              <div
                className="header-actions"
                style={{ minHeight: '2.75rem' }}
                role="status"
                aria-live="polite"
                aria-label="加载操作栏"
              />
            }
          >
            <div className="header-actions">
              <CardBrowser onSelectCard={tarot.handleSelectCardFromBrowser} />
              <Favorites onSelectCard={tarot.handleSelectCardFromBrowser} />
              <HelpGuide />
            </div>
          </Suspense>
        )}
      </header>

      <main className="app-main">
        <AppFeatureRoutes currentPage={currentPage} tarot={tarot} />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-copyright">© {new Date().getFullYear()} 命运工坊 - 仅供娱乐参考</p>
          <div className="footer-team">
            <p className="team-label">Made with ❤️ by</p>
            <p className="team-name">默默团队</p>
          </div>
          <div className="footer-contact">
            <a
              href="https://github.com/sy-vendor/FateAtelier"
              className="contact-email"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="命运工坊 GitHub 仓库"
            >
              GitHub - FateAtelier
            </a>
          </div>
        </div>
      </footer>
      <ToastContainer />
      <ConfirmDialogContainer />
      <Analytics />
    </div>
  )
}

export default App
