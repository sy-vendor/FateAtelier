import { memo } from 'react'
import CardDrawAnimation from '../CardDrawAnimation'
import ThreeCardDrawAnimation from '../ThreeCardDrawAnimation'
import ReadingTypeSelector from '../ReadingTypeSelector'
import DailyCard from '../DailyCard'
import CardDrawer from '../CardDrawer'
import CardDisplay from '../CardDisplay'
import ReadingHistory from '../ReadingHistory'
import Statistics from '../Statistics'
import { getCardIcon, getSuitIcon } from '../../utils/cardIcons'
import { isFavorite, toggleFavorite } from '../../utils/favorites'
import { downloadAllData } from '../../utils/exportData'
import { DrawnCard } from '../../types'
import type { TarotGameApi } from '../../types/tarotGameApi'

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

  return (
    <>
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

      <DailyCard onSelectCard={handleSelectCardFromBrowser} />

      <div className="controls">
        <CardDrawer
          onDrawCard={drawCard}
          onDrawThree={drawThreeCards}
          onReset={reset}
          drawnCount={drawnCards.length}
        />
      </div>

      {threeCardReading && (
        <div className="three-card-reading">
          <h2 className="reading-title">三牌占卜</h2>
          <div className="three-cards-container">
            {threeCardReading.map((drawnCard, index) => (
              <div key={drawnCard.card.id} className="three-card-item">
                <div className="card-position-label">
                  {index === 0 ? '过去' : index === 1 ? '现在' : '未来'}
                </div>
                <CardDisplay
                  card={drawnCard.card}
                  isReversed={drawnCard.isReversed}
                  onFlip={() => updateCardReversed(drawnCard.card.id, !drawnCard.isReversed)}
                  compact={true}
                />
              </div>
            ))}
          </div>

          {readingInterpretation && (
            <div className="reading-interpretation">
              <div className="interpretation-header">
                <h3 className="interpretation-title">🔮 综合解读</h3>
                {viewingHistoryReading && (
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="export-btn"
                      onClick={() => handleExportReading(viewingHistoryReading)}
                      title="导出占卜结果"
                    >
                      💾 导出
                    </button>
                    <button
                      type="button"
                      className="share-btn"
                      onClick={() => handleShareReading(viewingHistoryReading)}
                      title="分享占卜结果"
                    >
                      📤 分享
                    </button>
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
                    <h4>📜 过去</h4>
                    <p>{readingInterpretation.past}</p>
                  </div>
                  <div className="stage-item">
                    <h4>⚡ 现在</h4>
                    <p>{readingInterpretation.present}</p>
                  </div>
                  <div className="stage-item">
                    <h4>🔮 未来</h4>
                    <p>{readingInterpretation.future}</p>
                  </div>
                </div>

                <div className="interpretation-advice">
                  <h4>💡 建议</h4>
                  <p>{readingInterpretation.advice}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedCard && !threeCardReading && (
        <div>
          {viewingHistoryReading && viewingHistoryReading.type === 'single' && (
            <div className="export-section">
              <button
                type="button"
                className="export-btn"
                onClick={() => handleExportReading(viewingHistoryReading)}
              >
                💾 导出
              </button>
              <button
                type="button"
                className="share-btn"
                onClick={() => handleShareReading(viewingHistoryReading)}
              >
                📤 分享
              </button>
            </div>
          )}
          <CardDisplay
            card={selectedCard.card}
            isReversed={selectedCard.isReversed}
            onFlip={() => updateCardReversed(selectedCard.card.id, !selectedCard.isReversed)}
            isFavorite={isFavorite(selectedCard.card.id)}
            onToggleFavorite={(card) => toggleFavorite(card.id)}
          />
        </div>
      )}

      {drawnCards.length > 1 && (
        <div className="drawn-cards">
          <h2>已抽取的牌 ({drawnCards.length})</h2>
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
                <div className="card-thumbnail-content">
                  <div className="card-thumbnail-icon">
                    {getCardIcon(drawnCard.card)}
                  </div>
                  <div className="card-thumbnail-name">
                    {drawnCard.card.name}
                    {drawnCard.isReversed && <span className="reversed-indicator">逆</span>}
                  </div>
                  <div className="card-thumbnail-type">
                    {drawnCard.card.type === 'major' ? '大阿卡纳' :
                     drawnCard.card.suit === 'wands' ? '权杖' :
                     drawnCard.card.suit === 'cups' ? '圣杯' :
                     drawnCard.card.suit === 'swords' ? '宝剑' : '星币'}
                  </div>
                  {drawnCard.card.suit && (
                    <div className="card-thumbnail-suit">{getSuitIcon(drawnCard.card.suit)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ReadingHistory
        readings={readingHistory}
        onViewReading={handleViewHistoryReading}
        onDeleteReading={handleDeleteHistoryReading}
        onExportAll={() => downloadAllData(readingHistory)}
      />

      <Statistics readings={readingHistory} />
    </>
  )
}

const TarotMainView = memo(TarotMainViewInner)
TarotMainView.displayName = 'TarotMainView'
export default TarotMainView
