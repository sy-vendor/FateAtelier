import type { TarotCard } from '../../data/tarotCards'
import { TarotCardBack } from './TarotCardBack'
import { TarotCardFace } from './TarotCardFace'
import './tarot-card.css'

export type TarotCardSize = 'lg' | 'md' | 'sm' | 'xs'
export type TarotCardVariant = 'play' | 'library'

export interface TarotCardVisualProps {
  card?: TarotCard | null
  /** false = show back, true = show face */
  faceUp?: boolean
  isReversed?: boolean
  size?: TarotCardSize
  /** play = 占卜牌面；library = 图鉴缩略（原图、无角标叠层） */
  variant?: TarotCardVariant
  interactive?: boolean
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

export function TarotCardVisual({
  card,
  faceUp = true,
  isReversed = false,
  size = 'md',
  variant = 'play',
  interactive = false,
  onClick,
  className = '',
  ariaLabel,
}: TarotCardVisualProps) {
  const Tag = onClick ? 'button' : 'div'
  const label = ariaLabel ?? (card ? `${card.name}${isReversed ? ' 逆位' : ''}` : '塔罗牌背')
  const isLibrary = variant === 'library'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={[
        'tarot-card',
        isLibrary ? 'tarot-card--library' : `tarot-card--${size}`,
        faceUp ? 'tarot-card--face-up' : 'tarot-card--back-up',
        interactive || onClick ? 'tarot-card--interactive' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      aria-label={label}
    >
      <div className="tarot-card__scene">
        <div className="tarot-card__inner">
          <div className="tarot-card__side tarot-card__side--face">
            {card ? <TarotCardFace card={card} isReversed={isReversed} variant={variant} /> : null}
          </div>
          <div className="tarot-card__side tarot-card__side--back">
            <TarotCardBack />
          </div>
        </div>
      </div>
    </Tag>
  )
}
