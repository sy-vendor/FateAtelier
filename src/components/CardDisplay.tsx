import { TarotCard } from '../data/tarotCards'
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
  card,
  isReversed,
  onFlip,
  compact = false,
  isFavorite = false,
  onToggleFavorite,
}: CardDisplayProps) {
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
            <h3>牌意</h3>
            <p className="meaning-text">
              {isReversed ? card.meaning.reversed : card.meaning.upright}
            </p>
          </div>

          <div className="description-section">
            <h3>描述</h3>
            <p className="description-text">{card.description}</p>
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
            <h4>牌意</h4>
            <p>{isReversed ? card.meaning.reversed : card.meaning.upright}</p>
          </div>
          <div className="description-compact">
            <h4>描述</h4>
            <p>{card.description}</p>
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
