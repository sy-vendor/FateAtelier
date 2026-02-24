import { useState, useEffect } from 'react'
import { TarotCard } from '../data/tarotCards'
import { tarotCards } from '../data/tarotCards'
import CardDisplay from './CardDisplay'
import { getStorageItem, setStorageItem } from '../utils/storage'
import './DailyCard.css'

interface DailyCardProps {
  onSelectCard: (card: TarotCard) => void
}

const DAILY_CARD_STORAGE_KEY = 'tarot-daily-card'
const getTodayKey = () => {
  const today = new Date()
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
}

function DailyCard({ onSelectCard }: DailyCardProps) {
  const [dailyCard, setDailyCard] = useState<TarotCard | null>(null)
  const [isReversed, setIsReversed] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [hasViewedToday, setHasViewedToday] = useState(false)

  useEffect(() => {
    // 根据日期生成每日一牌
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const cardIndex = dayOfYear % tarotCards.length
    const card = tarotCards[cardIndex]
    const reversed = dayOfYear % 2 === 0
    
    setDailyCard(card)
    setIsReversed(reversed)

    // 检查今天是否已经查看过
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
    setShowCard(true)
    setHasViewedToday(true)
    
    // 保存查看状态到localStorage
    const todayKey = getTodayKey()
    setStorageItem(DAILY_CARD_STORAGE_KEY, {
      date: todayKey,
      isReversed: isReversed
    })
  }

  return (
    <div className="daily-card-section">
      <div className="daily-card-header">
        <div className="daily-card-title-row">
          <h3>🌟 每日一牌</h3>
          {hasViewedToday && (
            <span className="viewed-badge">✓ 今日已查看</span>
          )}
        </div>
        <p className="daily-date">{new Date().toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}</p>
      </div>

      {!showCard ? (
        <div className="daily-card-hidden" onClick={handleReveal}>
          <div className="card-back">
            <div className="card-back-pattern"></div>
            <div className="card-back-icon">🔮</div>
            <p className="reveal-hint">点击揭示今日牌面</p>
          </div>
        </div>
      ) : (
        <div className="daily-card-revealed">
          <CardDisplay
            card={dailyCard}
            isReversed={isReversed}
            onFlip={() => {
              const newReversed = !isReversed
              setIsReversed(newReversed)
              const todayKey = getTodayKey()
              setStorageItem(DAILY_CARD_STORAGE_KEY, { date: todayKey, isReversed: newReversed })
            }}
            compact={false}
          />
          <button 
            className="view-detail-btn"
            onClick={() => onSelectCard(dailyCard)}
          >
            📖 查看详情
          </button>
        </div>
      )}
    </div>
  )
}

export default DailyCard

