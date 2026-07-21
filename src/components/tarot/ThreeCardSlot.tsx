import type { DrawnCard } from '../../types'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import { getThreeCardPositionHint, getThreeCardPositionLabel } from '../../utils/readingInterpretation'
import { resolveDrawnCard } from '../../utils/tarotCardResolve'
import { TarotCardVisual } from './TarotCardVisual'

function splitKeywords(raw: string): string[] {
  return raw
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4)
}

interface ThreeCardSlotProps {
  positionIndex: 0 | 1 | 2
  drawnCard: DrawnCard
  highlight?: boolean
  onFlip: () => void
}

export function ThreeCardSlot({ positionIndex, drawnCard, highlight, onFlip }: ThreeCardSlotProps) {
  const { isEnglish } = useLocale()
  const tx = useTx()
  const { card, isReversed } = resolveDrawnCard(drawnCard)
  const keywords = splitKeywords(
    (isReversed ? card.meaning?.reversed : card.meaning?.upright) ?? '',
  )
  const interpretation = (isReversed ? card.interpretation?.reversed : card.interpretation?.upright) ?? ''
  const advice = (isReversed ? card.advice?.reversed : card.advice?.upright) ?? ''
  const typeLabel = card.type === 'major' ? tx('大阿卡纳', 'Major Arcana') : tx('小阿卡纳', 'Minor Arcana')
  const cardName = isEnglish ? card.nameEn : card.name
  const altName = isEnglish ? card.name : card.nameEn
  const label = getThreeCardPositionLabel(positionIndex, isEnglish)
  const hint = getThreeCardPositionHint(label, isEnglish)

  return (
    <article
      className={[
        'three-card-slot',
        highlight ? 'three-card-slot--now' : '',
      ].filter(Boolean).join(' ')}
    >
      <header className="three-card-slot__head">
        <span className="three-card-slot__position">{label}</span>
        <span className="three-card-slot__hint">{hint}</span>
      </header>

      <div className="three-card-slot__card-frame">
        <TarotCardVisual
          card={card}
          faceUp
          isReversed={isReversed}
          size="md"
          interactive
          onClick={onFlip}
          ariaLabel={isReversed ? tx('转为正位', 'Switch to upright') : tx('转为逆位', 'Switch to reversed')}
        />
      </div>

      <div className="three-card-slot__meta">
        <h3 className="three-card-slot__name">{cardName}</h3>
        <p className="three-card-slot__en">{altName}</p>
        <div className="three-card-slot__tags">
          <span className={`three-card-slot__tag three-card-slot__tag--${isReversed ? 'reversed' : 'upright'}`}>
            {isReversed ? tx('逆位', 'Reversed') : tx('正位', 'Upright')}
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
          <h4 className="three-card-slot__block-title">{tx('牌意解读', 'Interpretation')}</h4>
          <p className="three-card-slot__block-text">{interpretation}</p>
        </div>
        <div className="three-card-slot__block three-card-slot__block--advice">
          <h4 className="three-card-slot__block-title">{tx('行动建议', 'Advice')}</h4>
          <p className="three-card-slot__block-text">{advice}</p>
        </div>
      </div>

      <button type="button" className="three-card-slot__flip" onClick={onFlip}>
        {isReversed ? tx('转为正位', 'Switch to upright') : tx('转为逆位', 'Switch to reversed')}
      </button>
    </article>
  )
}
