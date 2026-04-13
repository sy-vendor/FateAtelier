import { useState, useMemo, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import CardBrowser from './components/CardBrowser'
import HelpGuide from './components/HelpGuide'
import Favorites from './components/Favorites'
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

  const tarotProps = useMemo(
    () => ({
      showDrawAnimation: tarot.showDrawAnimation,
      drawingCard: tarot.drawingCard,
      onDrawAnimationComplete: tarot.handleDrawAnimationComplete,
      showReadingTypeSelector: tarot.showReadingTypeSelector,
      onReadingTypeSelected: tarot.handleReadingTypeSelected,
      onCancelReadingType: tarot.cancelReadingTypeSelector,
      showThreeCardAnimation: tarot.showThreeCardAnimation,
      drawingThreeCards: tarot.drawingThreeCards,
      onThreeCardAnimationComplete: tarot.handleThreeCardAnimationComplete,
      onSelectCardFromBrowser: tarot.handleSelectCardFromBrowser,
      drawCard: tarot.drawCard,
      drawThreeCards: tarot.drawThreeCards,
      reset: tarot.reset,
      drawnCards: tarot.drawnCards,
      threeCardReading: tarot.threeCardReading,
      readingInterpretation: tarot.readingInterpretation,
      viewingHistoryReading: tarot.viewingHistoryReading,
      updateCardReversed: tarot.updateCardReversed,
      handleExportReading: tarot.handleExportReading,
      handleShareReading: tarot.handleShareReading,
      selectedCard: tarot.selectedCard,
      selectCard: tarot.selectCard,
      readingHistory: tarot.readingHistory,
      onViewHistoryReading: tarot.handleViewHistoryReading,
      onDeleteHistoryReading: tarot.handleDeleteHistoryReading,
    }),
    [tarot]
  )

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
          <div className="header-actions">
            <CardBrowser onSelectCard={tarot.handleSelectCardFromBrowser} />
            <Favorites onSelectCard={tarot.handleSelectCardFromBrowser} />
            <HelpGuide />
          </div>
        )}
      </header>

      <main className="app-main">
        <AppFeatureRoutes currentPage={currentPage} tarotProps={tarotProps} />
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
