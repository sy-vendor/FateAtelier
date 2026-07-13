import type { DrawnCard } from '../../types'
import { THREE_CARD_POSITION_HINT } from '../../utils/readingInterpretation'
import { TarotCardVisual } from './TarotCardVisual'

function splitKeywords(raw: string): string[] {
  return raw
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4)
}

interface ThreeCardSlotProps {
  label: '过去' | '现在' | '未来'
  drawnCard: DrawnCard
  highlight?: boolean
  onFlip: () => void
}

export function ThreeCardSlot({ label, drawnCard, highlight, onFlip }: ThreeCardSlotProps) {
  const { card, isReversed } = drawnCard
  const keywords = splitKeywords(isReversed ? card.meaning.reversed : card.meaning.upright)
  const interpretation = isReversed ? card.interpretation.reversed : card.interpretation.upright
  const advice = isReversed ? card.advice.reversed : card.advice.upright
  const typeLabel = card.type === 'major' ? '大阿卡纳' : '小阿卡纳'

  return (
    <article
      className={[
        'three-card-slot',
        highlight ? 'three-card-slot--now' : '',
      ].filter(Boolean).join(' ')}
    >
      <header className="three-card-slot__head">
        <span className="three-card-slot__position">{label}</span>
        <span className="three-card-slot__hint">{THREE_CARD_POSITION_HINT[label]}</span>
      </header>

      <div className="three-card-slot__card-frame">
        <TarotCardVisual
          card={card}
          faceUp
          isReversed={isReversed}
          size="md"
          interactive
          onClick={onFlip}
          ariaLabel={isReversed ? '转为正位' : '转为逆位'}
        />
      </div>

      <div className="three-card-slot__meta">
        <h3 className="three-card-slot__name">{card.name}</h3>
        <p className="three-card-slot__en">{card.nameEn}</p>
        <div className="three-card-slot__tags">
          <span className={`three-card-slot__tag three-card-slot__tag--${isReversed ? 'reversed' : 'upright'}`}>
            {isReversed ? '逆位' : '正位'}
          </span>
          <span className="three-card-slot__tag">{typeLabel}</span>
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="three-card-slot__keywords">
          {keywords.map((kw) => (
            <span key={kw} className="three-card-slot__keyword">
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="three-card-slot__body">
        <div className="three-card-slot__block">
          <h4 className="three-card-slot__block-title">牌意解读</h4>
          <p className="three-card-slot__block-text">{interpretation}</p>
        </div>
        <div className="three-card-slot__block three-card-slot__block--advice">
          <h4 className="three-card-slot__block-title">行动建议</h4>
          <p className="three-card-slot__block-text">{advice}</p>
        </div>
      </div>

      <button type="button" className="three-card-slot__flip" onClick={onFlip}>
        {isReversed ? '转为正位' : '转为逆位'}
      </button>
    </article>
  )
}
