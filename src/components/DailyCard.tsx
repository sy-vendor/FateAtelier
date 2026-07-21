import { useState, useEffect, useMemo } from 'react'
import { TarotCard } from '../data/tarotCards'
import { useLocale } from '../i18n/LocaleContext'
import { useTx } from '../i18n/useTx'
import { TarotCardVisual } from './tarot/TarotCardVisual'
import { getDailyTarotDraw, saveDailyTarotDraw } from '../utils/dailyTarotCard'
import { Button } from './ui'

interface DailyCardProps {
  onSelectCard: (card: TarotCard, isReversed?: boolean) => void
}

function splitKeywords(raw: string): string[] {
  return raw
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)
}

function DailyCard({ onSelectCard }: DailyCardProps) {
  const { isEnglish } = useLocale()
  const tx = useTx()
  const [dailyCard, setDailyCard] = useState<TarotCard | null>(null)
  const [isReversed, setIsReversed] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [hasViewedToday, setHasViewedToday] = useState(false)
  const [flipping, setFlipping] = useState(false)

  const reading = useMemo(() => {
    if (!dailyCard) return null
    return {
      keywords: splitKeywords(
        (isReversed ? dailyCard.meaning?.reversed : dailyCard.meaning?.upright) ?? '',
      ),
      interpretation:
        (isReversed ? dailyCard.interpretation?.reversed : dailyCard.interpretation?.upright) ?? '',
      advice: (isReversed ? dailyCard.advice?.reversed : dailyCard.advice?.upright) ?? '',
      description: dailyCard.description ?? '',
    }
  }, [dailyCard, isReversed])

  useEffect(() => {
    const { card, isReversed: reversed, revealed } = getDailyTarotDraw()
    setDailyCard(card)
    setIsReversed(reversed)
    if (revealed) {
      setShowCard(true)
      setHasViewedToday(true)
    }
  }, [])

  if (!dailyCard || !reading) {
    return null
  }

  const handleReveal = () => {
    setFlipping(true)
    setTimeout(() => {
      setShowCard(true)
      setHasViewedToday(true)
      saveDailyTarotDraw(dailyCard.id, isReversed)
    }, 400)
  }

  const toggleOrientation = () => {
    const newReversed = !isReversed
    setIsReversed(newReversed)
    saveDailyTarotDraw(dailyCard.id, newReversed)
  }

  const dateLabel = new Date().toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const typeLabel = dailyCard.type === 'major' ? tx('大阿卡纳', 'Major Arcana') : tx('小阿卡纳', 'Minor Arcana')
  const cardName = isEnglish ? dailyCard.nameEn : dailyCard.name
  const altName = isEnglish ? dailyCard.name : dailyCard.nameEn

  return (
    <section className="tarot-daily-panel" aria-label={tx('每日一牌', 'Daily Draw')}>
      <div className="tarot-daily">
        <header className="tarot-daily__head">
          <div className="tarot-daily__head-text">
            <p className="tarot-daily__eyebrow">{tx('每日一牌', 'Daily Draw')}</p>
            <h2 className="tarot-daily__title">{tx('每日一牌', 'Daily Draw')}</h2>
            <p className="tarot-daily__date">{dateLabel}</p>
          </div>
          {hasViewedToday && (
            <span className="tag tag--good tarot-daily__badge">{tx('今日已揭示', 'Revealed today')}</span>
          )}
        </header>

        {!showCard ? (
          <div className="tarot-daily__reveal">
            <div className="tarot-daily__reveal-glow" aria-hidden />
            <div className="tarot-daily__card-stage">
              <TarotCardVisual
                faceUp={flipping}
                card={flipping ? dailyCard : null}
                isReversed={isReversed}
                size="lg"
                interactive
                onClick={handleReveal}
                ariaLabel={tx('点击揭示今日牌面', 'Tap to reveal today’s card')}
              />
            </div>
            {!flipping && (
              <div className="tarot-daily__reveal-copy">
                <p className="tarot-daily__prompt">{tx('每天仅可揭示一次', 'You can reveal once per day')}</p>
                <p className="tarot-daily__prompt-sub">{tx('静心默念一个问题，轻触牌背翻开今日指引', 'Hold a question in mind, then tap the card back to reveal today’s guidance')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="tarot-daily__result">
            <div className="tarot-daily__layout">
              <aside className="tarot-daily__visual">
                <div className="tarot-daily__card-frame">
                  <TarotCardVisual
                    card={dailyCard}
                    faceUp
                    isReversed={isReversed}
                    size="md"
                    interactive
                    onClick={toggleOrientation}
                    ariaLabel={isReversed ? tx('转为正位', 'Switch to upright') : tx('转为逆位', 'Switch to reversed')}
                  />
                </div>
                <div className="tarot-daily__card-meta">
                  <h3 className="tarot-daily__card-name">{cardName}</h3>
                  <p className="tarot-daily__card-en">{altName}</p>
                  <div className="tarot-daily__tags">
                    <span className={`tarot-daily__tag tarot-daily__tag--${isReversed ? 'reversed' : 'upright'}`}>
                      {isReversed ? tx('逆位', 'Reversed') : tx('正位', 'Upright')}
                    </span>
                    <span className="tarot-daily__tag">{typeLabel}</span>
                  </div>
                </div>
                <button type="button" className="tarot-daily__flip" onClick={toggleOrientation}>
                  {isReversed ? tx('转为正位', 'Switch to upright') : tx('转为逆位', 'Switch to reversed')}
                </button>
              </aside>

              <div className="tarot-daily__content">
                {reading.keywords.length > 0 && (
                  <div className="tarot-daily__keywords">
                    {reading.keywords.map((kw) => (
                      <span key={kw} className="tarot-daily__keyword">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <article className="tarot-daily__block">
                  <h4 className="tarot-daily__block-title">{tx('牌面要义', 'Card Essence')}</h4>
                  <p className="tarot-daily__block-text">{reading.description}</p>
                </article>

                <article className="tarot-daily__block">
                  <h4 className="tarot-daily__block-title">{tx('牌意解读', 'Interpretation')}</h4>
                  <p className="tarot-daily__block-text">{reading.interpretation}</p>
                </article>

                <article className="tarot-daily__block tarot-daily__block--guide">
                  <h4 className="tarot-daily__block-title">{tx('今日指引', 'Today’s Guidance')}</h4>
                  <p className="tarot-daily__block-text">{reading.advice}</p>
                </article>
              </div>
            </div>

            <div className="tarot-daily__actions">
              <Button variant="primary" onClick={() => onSelectCard(dailyCard, isReversed)}>
                {tx('查看完整牌义', 'View Full Meaning')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default DailyCard
