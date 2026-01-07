import { useState, useEffect } from 'react'
import { TarotCard } from '../data/tarotCards'
import { tarotCards } from '../data/tarotCards'
import CardDisplay from './CardDisplay'
import { logger } from '../utils/logger'
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
    const saved = localStorage.getItem(DAILY_CARD_STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.date === todayKey) {
          setShowCard(true)
          setHasViewedToday(true)
          setIsReversed(data.isReversed || reversed)
        }
      } catch (e) {
        logger.error('Failed to load daily card state', e)
      }
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
    localStorage.setItem(DAILY_CARD_STORAGE_KEY, JSON.stringify({
      date: todayKey,
      isReversed: isReversed
    }))
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
              // 保存翻转状态
              const todayKey = getTodayKey()
              localStorage.setItem(DAILY_CARD_STORAGE_KEY, JSON.stringify({
                date: todayKey,
                isReversed: newReversed
              }))
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

