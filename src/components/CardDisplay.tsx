import { TarotCard } from '../data/tarotCards'
import { resolveCanonicalTarotCard } from '../utils/tarotCardResolve'
import { TarotCardVisual } from './tarot/TarotCardVisual'
import './CardDisplay.css'

interface CardDisplayProps {
  card: TarotCard
  isReversed: boolean
  onFlip: () => void
  compact?: boolean
  isFavorite?: boolean
  onToggleFavorite?: (card: TarotCard) => void
}

function CardDisplay({
  card: rawCard,
  isReversed,
  onFlip,
  compact = false,
  isFavorite = false,
  onToggleFavorite,
}: CardDisplayProps) {
  const card = resolveCanonicalTarotCard(rawCard)
  const meaning = (isReversed ? card.meaning?.reversed : card.meaning?.upright) ?? ''
  const interpretation = (isReversed ? card.interpretation?.reversed : card.interpretation?.upright) ?? ''
  const advice = (isReversed ? card.advice?.reversed : card.advice?.upright) ?? ''

  return (
    <div className={`card-display ${compact ? 'compact' : ''}`}>
      <TarotCardVisual
        card={card}
        faceUp
        isReversed={isReversed}
        size={compact ? 'sm' : 'lg'}
        interactive
        onClick={onFlip}
      />
      <p className="card-display__caption">
        {card.name}
        <span className="card-display__caption-en">{card.nameEn}</span>
      </p>

      {!compact && (
        <div className="card-meaning">
          <div className="meaning-section">
            <h3>关键词</h3>
            <p className="meaning-text">{meaning}</p>
          </div>

          <div className="description-section">
            <h3>牌面要义</h3>
            <p className="description-text">{card.description}</p>
          </div>

          <div className="interpretation-section">
            <h3>牌意解读</h3>
            <p className="interpretation-text">{interpretation}</p>
          </div>

          <div className="advice-section">
            <h3>行动建议</h3>
            <p className="advice-text">{advice}</p>
          </div>

          <div className="card-actions">
            <button type="button" className="flip-button" onClick={onFlip}>
              {isReversed ? '转为正位' : '转为逆位'}
            </button>
            {onToggleFavorite && (
              <button
                type="button"
                className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(card)
                }}
                title={isFavorite ? '取消收藏' : '收藏'}
                aria-label={isFavorite ? '取消收藏' : '收藏'}
              >
                {isFavorite ? '⭐' : '☆'} {isFavorite ? '已收藏' : '收藏'}
              </button>
            )}
          </div>
        </div>
      )}

      {compact && (
        <div className="card-meaning-compact">
          <div className="meaning-compact">
            <h4>牌意解读</h4>
            <p>{interpretation}</p>
          </div>
          <div className="description-compact">
            <h4>行动建议</h4>
            <p>{advice}</p>
          </div>
          <button type="button" className="flip-button-compact" onClick={onFlip}>
            {isReversed ? '转为正位' : '转为逆位'}
          </button>
        </div>
      )}
    </div>
  )
}

export default CardDisplay
