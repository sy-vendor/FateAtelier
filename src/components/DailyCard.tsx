import { useState, useEffect, useMemo } from 'react'
import { tarotCards, TarotCard } from '../data/tarotCards'
import CardDisplay from './CardDisplay'
import { TarotCardVisual } from './tarot/TarotCardVisual'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { Panel, Button } from './ui'

interface DailyCardProps {
  onSelectCard: (card: TarotCard, isReversed?: boolean) => void
}

const DAILY_CARD_STORAGE_KEY = 'tarot-daily-card'
const getTodayKey = () => {
  const today = new Date()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${mm}-${dd}`
}

function DailyCard({ onSelectCard }: DailyCardProps) {
  const [dailyCard, setDailyCard] = useState<TarotCard | null>(null)
  const [isReversed, setIsReversed] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [hasViewedToday, setHasViewedToday] = useState(false)
  const [flipping, setFlipping] = useState(false)

  const dailyTip = useMemo(() => {
    if (!dailyCard) return ''
    const raw = isReversed ? dailyCard.meaning.reversed : dailyCard.meaning.upright
    const first = raw.split(/[，。；;,.]/)[0] || raw
    const keywords = first
      .split(/[、\s/]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join('、')
    if (!keywords) return ''
    return isReversed
      ? `今日提示：放慢节奏，留意「${keywords}」`
      : `今日提示：顺势而为，把握「${keywords}」`
  }, [dailyCard, isReversed])

  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const cardIndex = dayOfYear % tarotCards.length
    const card = tarotCards[cardIndex]
    const reversed = dayOfYear % 2 === 0

    setDailyCard(card)
    setIsReversed(reversed)

    const todayKey = getTodayKey()
    const result = getStorageItem<{ date: string; isReversed: boolean }>(DAILY_CARD_STORAGE_KEY)
    if (result.success && result.data && result.data.date === todayKey) {
      setShowCard(true)
      setHasViewedToday(true)
      setIsReversed(result.data.isReversed || reversed)
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
      const todayKey = getTodayKey()
      setStorageItem(DAILY_CARD_STORAGE_KEY, {
        date: todayKey,
        isReversed: isReversed,
      })
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
                setStorageItem(DAILY_CARD_STORAGE_KEY, {
                  date: getTodayKey(),
                  isReversed: newReversed,
                })
              }}
              compact
            />
            {dailyTip && <p className="tarot-daily__tip callout">{dailyTip}</p>}
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
