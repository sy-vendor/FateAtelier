import { TarotCard } from '../data/tarotCards'
import { getCardIcon, getSuitIcon, getSuitColor, getCardDecoration } from '../utils/cardIcons'
import './CardDisplay.css'

interface CardDisplayProps {
  card: TarotCard
  isReversed: boolean
  onFlip: () => void
  compact?: boolean
  /** 是否显示收藏按钮；传入 onToggleFavorite 时显示 */
  isFavorite?: boolean
  onToggleFavorite?: (card: TarotCard) => void
}

function CardDisplay({ card, isReversed, onFlip, compact = false, isFavorite = false, onToggleFavorite }: CardDisplayProps) {
  const getCardColor = () => {
    if (card.type === 'major') return 'var(--color-major)'
    return getSuitColor(card.suit)
  }

  const cardIcon = getCardIcon(card)
  const suitIcon = getSuitIcon(card.suit)
  const decoration = getCardDecoration(card)

  return (
    <div className={`card-display ${compact ? 'compact' : ''}`}>
      <div
        className={`card ${isReversed ? 'reversed' : ''} ${card.type === 'major' ? 'major-card' : 'minor-card'}`}
        style={{ 
          borderColor: getCardColor(),
          '--card-color': getCardColor()
        } as React.CSSProperties}
        onClick={onFlip}
      >
        {/* 背景装饰 */}
        <div className="card-background-decoration">
          <div className="decoration-icon">{decoration}</div>
        </div>

        <div className="card-header">
          <div className="card-number">
            {card.type === 'major' ? card.id : card.number || ''}
          </div>
          <div className="card-suit-icon">{suitIcon}</div>
        </div>
        
        <div className="card-body">
          <div className="card-main-icon">{cardIcon}</div>
          <h2 className="card-name">{card.name}</h2>
          <p className="card-name-en">{card.nameEn}</p>
          {isReversed && <div className="reversed-badge">逆位</div>}
        </div>

        <div className="card-footer">
          <div className="card-type">
            {card.type === 'major' ? '大阿卡纳' : 
             card.suit === 'wands' ? '权杖' :
             card.suit === 'cups' ? '圣杯' :
             card.suit === 'swords' ? '宝剑' : '星币'}
          </div>
        </div>

        {/* 角落装饰 */}
        <div className="card-corner top-left">{cardIcon}</div>
        <div className="card-corner top-right">{cardIcon}</div>
        <div className="card-corner bottom-left">{cardIcon}</div>
        <div className="card-corner bottom-right">{cardIcon}</div>
      </div>

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
            <button className="flip-button" onClick={onFlip}>
              {isReversed ? '转为正位' : '转为逆位'}
            </button>
            {onToggleFavorite && (
              <button
                type="button"
                className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(card) }}
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
          <button className="flip-button-compact" onClick={onFlip}>
            {isReversed ? '转为正位' : '转为逆位'}
          </button>
        </div>
      )}
    </div>
  )
}

export default CardDisplay

