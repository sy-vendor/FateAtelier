import { useState, useEffect, useMemo } from 'react'
import { TarotCard } from '../data/tarotCards'
import CardDisplay from './CardDisplay'
import { TarotCardVisual } from './tarot/TarotCardVisual'
import { getDailyTarotDraw, saveDailyTarotDraw } from '../utils/dailyTarotCard'
import { Panel, Button } from './ui'

interface DailyCardProps {
  onSelectCard: (card: TarotCard, isReversed?: boolean) => void
}

function DailyCard({ onSelectCard }: DailyCardProps) {
  const [dailyCard, setDailyCard] = useState<TarotCard | null>(null)
  const [isReversed, setIsReversed] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [hasViewedToday, setHasViewedToday] = useState(false)
  const [flipping, setFlipping] = useState(false)

  const dailyTip = useMemo(() => {
    if (!dailyCard) return ''
    return isReversed ? dailyCard.advice.reversed : dailyCard.advice.upright
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

  if (!dailyCard) {
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

  const dateLabel = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <Panel>
      <div className="tarot-daily">
        <header className="tarot-daily__head">
          <div className="tarot-daily__head-text">
            <h2 className="tarot-daily__title">每日一牌</h2>
            <p className="tarot-daily__date">{dateLabel}</p>
          </div>
          {hasViewedToday && (
            <span className="tag tag--good tarot-daily__badge">今日已揭示</span>
          )}
        </header>

        {!showCard ? (
          <div className="tarot-daily__reveal">
            <div className="tarot-daily__card-stage">
              <TarotCardVisual
                faceUp={flipping}
                card={flipping ? dailyCard : null}
                isReversed={isReversed}
                size="lg"
                interactive
                onClick={handleReveal}
                ariaLabel="点击揭示今日牌面"
              />
            </div>
            {!flipping && (
              <p className="tarot-daily__prompt">
                每天仅可揭示一次 · 带着一个问题，点击牌背翻开
              </p>
            )}
          </div>
        ) : (
          <div className="tarot-daily__result">
            <CardDisplay
              card={dailyCard}
              isReversed={isReversed}
              onFlip={() => {
                const newReversed = !isReversed
                setIsReversed(newReversed)
                saveDailyTarotDraw(dailyCard.id, newReversed)
              }}
              compact
            />
            {dailyTip && <p className="tarot-daily__tip callout">今日指引：{dailyTip}</p>}
            <div className="tarot-daily__actions">
              <Button variant="primary" onClick={() => onSelectCard(dailyCard, isReversed)}>
                查看牌义详情
              </Button>
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}

export default DailyCard
