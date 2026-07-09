import { memo, useMemo } from 'react'
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
import { TarotLogoMark } from '../tarot/TarotLogoMark'
import { TarotRitualBar } from '../tarot/TarotRitualBar'
import { DECK_NAME, DECK_NAME_EN } from '../../utils/tarotCardArt'
import { useTarotFavorites } from '../../hooks/useTarotFavorites'
import { downloadAllData } from '../../utils/exportData'
import { DrawnCard } from '../../types'
import type { TarotGameApi } from '../../types/tarotGameApi'
import { Button } from '../ui'

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
          <p className="tarot-hero__deck">{DECK_NAME}</p>
          <p className="tarot-hero__deck-en">{DECK_NAME_EN}</p>
          <p className="tarot-hero__hint">深呼吸三次，带着你的问题进入牌阵</p>
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
            <h2 className="tarot-reading__title">三牌时空</h2>
            <p className="tarot-reading__sub">过去 · 现在 · 未来</p>
          </div>

          <div className="three-cards-container">
            {threeCardReading.map((drawnCard, index) => (
              <div key={drawnCard.card.id} className="three-card-item">
                <span className="card-position-label">
                  {index === 0 ? '过去' : index === 1 ? '现在' : '未来'}
                </span>
                <CardDisplay
                  card={drawnCard.card}
                  isReversed={drawnCard.isReversed}
                  onFlip={() => updateCardReversed(drawnCard.card.id, !drawnCard.isReversed)}
                  compact
                />
              </div>
            ))}
          </div>

          {readingInterpretation && (
            <div className="reading-interpretation">
              <div className="interpretation-header">
                <h3 className="interpretation-title">综合解读</h3>
                {viewingHistoryReading && (
                  <div className="action-buttons">
                    <Button
                      variant="ghost"
                      small
                      onClick={() => handleExportReading(viewingHistoryReading)}
                    >
                      导出
                    </Button>
                    <Button
                      variant="primary"
                      small
                      onClick={() => handleShareReading(viewingHistoryReading)}
                    >
                      分享
                    </Button>
                  </div>
                )}
              </div>

              <div className="interpretation-content">
                <div className="interpretation-summary">
                  <h4>整体趋势</h4>
                  <p>{readingInterpretation.summary}</p>
                </div>

                <div className="interpretation-stages">
                  <div className="stage-item">
                    <h4>过去</h4>
                    <p>{readingInterpretation.past}</p>
                  </div>
                  <div className="stage-item stage-item--now">
                    <h4>现在</h4>
                    <p>{readingInterpretation.present}</p>
                  </div>
                  <div className="stage-item">
                    <h4>未来</h4>
                    <p>{readingInterpretation.future}</p>
                  </div>
                </div>

                <div className="interpretation-advice">
                  <h4>建议</h4>
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
            <h2 className="tarot-reading__title">牌义详情</h2>
            <p className="tarot-reading__sub">
              {selectedCard.card.name}
              {selectedCard.isReversed ? ' · 逆位' : ' · 正位'}
            </p>
          </div>
          {viewingHistoryReading && viewingHistoryReading.type === 'single' && (
            <div className="export-section">
              <Button
                variant="ghost"
                small
                onClick={() => handleExportReading(viewingHistoryReading)}
              >
                导出
              </Button>
              <Button
                variant="primary"
                small
                onClick={() => handleShareReading(viewingHistoryReading)}
              >
                分享
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

      {drawnCards.length > 1 && (
        <section className="drawn-cards">
          <div className="drawn-cards__head">
            <h2>已抽取的牌</h2>
            <span className="drawn-cards__count">{drawnCards.length} 张</span>
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
                aria-label={`选择 ${drawnCard.card.name}`}
              >
                <TarotCardVisual
                  card={drawnCard.card}
                  isReversed={drawnCard.isReversed}
                  faceUp
                  size="xs"
                />
                <div className="card-thumbnail-name">
                  {drawnCard.card.name}
                  {drawnCard.isReversed && <span className="reversed-indicator">逆</span>}
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
