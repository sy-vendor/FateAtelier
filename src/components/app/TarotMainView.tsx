import { memo, useMemo } from 'react'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './tarot-stage.css'
import CardDrawAnimation from '../CardDrawAnimation'
import ThreeCardDrawAnimation from '../ThreeCardDrawAnimation'
import ReadingTypeSelector from '../ReadingTypeSelector'
import DailyCard from '../DailyCard'
import CardDrawer from '../CardDrawer'
import CardDisplay from '../CardDisplay'
import ReadingHistory from '../ReadingHistory'
import Statistics from '../Statistics'
import { TarotCardVisual } from '../tarot/TarotCardVisual'
import { ThreeCardSlot } from '../tarot/ThreeCardSlot'
import { TarotLogoMark } from '../tarot/TarotLogoMark'
import { TarotRitualBar } from '../tarot/TarotRitualBar'
import { DECK_NAME, DECK_NAME_EN } from '../../utils/tarotCardArt'
import { useTarotFavorites } from '../../hooks/useTarotFavorites'
import { downloadAllData } from '../../utils/exportData'
import { DrawnCard } from '../../types'
import type { TarotGameApi } from '../../types/tarotGameApi'
import { Button } from '../ui'
import NextJourney from './NextJourney'

export type TarotMainViewProps = TarotGameApi

function TarotMainViewInner(props: TarotMainViewProps) {
  const {
    showDrawAnimation,
    drawingCard,
    handleDrawAnimationComplete,
    showReadingTypeSelector,
    handleReadingTypeSelected,
    cancelReadingTypeSelector,
    showThreeCardAnimation,
    drawingThreeCards,
    handleThreeCardAnimationComplete,
    handleSelectCardFromBrowser,
    drawCard,
    drawThreeCards,
    reset,
    drawnCards,
    threeCardReading,
    readingInterpretation,
    viewingHistoryReading,
    updateCardReversed,
    handleExportReading,
    handleShareReading,
    selectedCard,
    selectCard,
    readingHistory,
    handleViewHistoryReading,
    handleDeleteHistoryReading,
  } = props

  const { isEnglish } = useLocale()
  const tx = useTx()
  const { isFavorite, toggleFavorite } = useTarotFavorites()

  const ritualStep = useMemo((): 1 | 2 | 3 | 4 => {
    if (selectedCard || threeCardReading) return 4
    if (showDrawAnimation || showThreeCardAnimation) return 3
    if (showReadingTypeSelector) return 2
    return 1
  }, [
    selectedCard,
    threeCardReading,
    showDrawAnimation,
    showThreeCardAnimation,
    showReadingTypeSelector,
  ])

  return (
    <div className="tarot-stage">
      {showDrawAnimation && drawingCard && (
        <CardDrawAnimation
          card={drawingCard.card}
          isReversed={drawingCard.isReversed}
          onComplete={handleDrawAnimationComplete}
        />
      )}

      {showReadingTypeSelector && (
        <ReadingTypeSelector
          onSelect={handleReadingTypeSelected}
          onCancel={cancelReadingTypeSelector}
        />
      )}

      {showThreeCardAnimation && drawingThreeCards && (
        <ThreeCardDrawAnimation
          cards={drawingThreeCards}
          onComplete={handleThreeCardAnimationComplete}
        />
      )}

      <header className="tarot-hero">
        <div className="tarot-hero__mark">
          <TarotLogoMark size="lg" />
        </div>
        <div className="tarot-hero__text">
          <p className="tarot-hero__deck">{isEnglish ? DECK_NAME_EN : DECK_NAME}</p>
          <p className="tarot-hero__hint">{tx('深呼吸三次，带着你的问题进入牌阵', 'Take three deep breaths and enter the spread with your question')}</p>
        </div>
      </header>

      <TarotRitualBar step={ritualStep} />

      <DailyCard onSelectCard={handleSelectCardFromBrowser} />

      <CardDrawer
        onDrawCard={drawCard}
        onDrawThree={drawThreeCards}
        onReset={reset}
        drawnCount={drawnCards.length}
      />

      {threeCardReading && (
        <section className="tarot-reading tarot-reading--three">
          <div className="tarot-reading__head">
            <p className="tarot-reading__eyebrow">{tx('三牌占卜', 'Three Cards')}</p>
            <h2 className="tarot-reading__title">{tx('三牌时空', 'Three-Card Spread')}</h2>
            <p className="tarot-reading__sub">{tx('过去 · 现在 · 未来', 'Past · Present · Future')}</p>
          </div>

          <div className="three-cards-grid">
            {threeCardReading.map((drawnCard, index) => (
              <ThreeCardSlot
                key={drawnCard.card.id}
                positionIndex={index as 0 | 1 | 2}
                drawnCard={drawnCard}
                highlight={index === 1}
                onFlip={() => updateCardReversed(drawnCard.card.id, !drawnCard.isReversed)}
              />
            ))}
          </div>

          {readingInterpretation && (
            <div className="reading-interpretation">
              <div className="interpretation-header">
                <h3 className="interpretation-title">{tx('时空串联', 'Across Time')}</h3>
                {viewingHistoryReading && (
                  <div className="action-buttons">
                    <Button
                      variant="ghost"
                      small
                      onClick={() => handleExportReading(viewingHistoryReading)}
                    >
                      {tx('导出', 'Export')}
                    </Button>
                    <Button
                      variant="primary"
                      small
                      onClick={() => handleShareReading(viewingHistoryReading)}
                    >
                      {tx('分享', 'Share')}
                    </Button>
                  </div>
                )}
              </div>

              <div className="interpretation-content">
                <div className="interpretation-summary">
                  <h4>{tx('整体趋势', 'Overall Trend')}</h4>
                  <p>{readingInterpretation.summary}</p>
                </div>

                <div className="interpretation-stages">
                  <div className="stage-item">
                    <h4>{tx('过去', 'Past')}</h4>
                    <p>{readingInterpretation.past}</p>
                  </div>
                  <div className="stage-item stage-item--now">
                    <h4>{tx('现在', 'Present')}</h4>
                    <p>{readingInterpretation.present}</p>
                  </div>
                  <div className="stage-item">
                    <h4>{tx('未来', 'Future')}</h4>
                    <p>{readingInterpretation.future}</p>
                  </div>
                </div>

                <div className="interpretation-advice">
                  <h4>{tx('综合指引', 'Guidance')}</h4>
                  <p>{readingInterpretation.advice}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {selectedCard && !threeCardReading && (
        <section id="tarot-card-detail" className="tarot-reading tarot-reading--single">
          <div className="tarot-reading__head">
            <h2 className="tarot-reading__title">{tx('牌义详情', 'Card Meaning')}</h2>
            <p className="tarot-reading__sub">
              {isEnglish ? selectedCard.card.nameEn : selectedCard.card.name}
              {selectedCard.isReversed ? tx(' · 逆位', ' · Reversed') : tx(' · 正位', ' · Upright')}
            </p>
          </div>
          {viewingHistoryReading && viewingHistoryReading.type === 'single' && (
            <div className="export-section">
              <Button
                variant="ghost"
                small
                onClick={() => handleExportReading(viewingHistoryReading)}
              >
                {tx('导出', 'Export')}
              </Button>
              <Button
                variant="primary"
                small
                onClick={() => handleShareReading(viewingHistoryReading)}
              >
                {tx('分享', 'Share')}
              </Button>
            </div>
          )}
          <CardDisplay
            card={selectedCard.card}
            isReversed={selectedCard.isReversed}
            onFlip={() => updateCardReversed(selectedCard.card.id, !selectedCard.isReversed)}
            isFavorite={isFavorite(selectedCard.card.id)}
            onToggleFavorite={(card) => toggleFavorite(card.id)}
          />
        </section>
      )}

      {(selectedCard || threeCardReading) && <NextJourney from="tarot" />}

      {drawnCards.length > 1 && (
        <section className="drawn-cards">
          <div className="drawn-cards__head">
            <h2>{tx('已抽取的牌', 'Drawn Cards')}</h2>
            <span className="drawn-cards__count">{tx(`${drawnCards.length} 张`, `${drawnCards.length} cards`)}</span>
          </div>
          <div className="cards-grid">
            {drawnCards.map((drawnCard: DrawnCard) => (
              <div
                key={drawnCard.card.id}
                className={`card-thumbnail ${selectedCard?.card.id === drawnCard.card.id ? 'selected' : ''}`}
                onClick={() => selectCard(drawnCard)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    selectCard(drawnCard)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={tx(`选择 ${drawnCard.card.name}`, `Select ${drawnCard.card.nameEn}`)}
              >
                <TarotCardVisual
                  card={drawnCard.card}
                  isReversed={drawnCard.isReversed}
                  faceUp
                  size="xs"
                />
                <div className="card-thumbnail-name">
                  {isEnglish ? drawnCard.card.nameEn : drawnCard.card.name}
                  {drawnCard.isReversed && <span className="reversed-indicator">{tx('逆', 'R')}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ReadingHistory
        readings={readingHistory}
        onViewReading={handleViewHistoryReading}
        onDeleteReading={handleDeleteHistoryReading}
        onExportAll={() => downloadAllData(readingHistory)}
      />

      <Statistics readings={readingHistory} />
    </div>
  )
}

const TarotMainView = memo(TarotMainViewInner)
TarotMainView.displayName = 'TarotMainView'
export default TarotMainView
