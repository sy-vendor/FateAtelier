import { useEffect, useState } from 'react'
import { TarotCard } from '../data/tarotCards'
import { getCardIcon } from '../utils/cardIcons'
import './ThreeCardDrawAnimation.css'

interface ThreeCardDrawAnimationProps {
  cards: Array<{ card: TarotCard, isReversed: boolean }> | null
  onComplete: () => void
}

function ThreeCardDrawAnimation({ cards, onComplete }: ThreeCardDrawAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [revealCards, setRevealCards] = useState<boolean[]>([false, false, false])

  useEffect(() => {
    if (cards && cards.length === 3) {
      setShowAnimation(true)
      setRevealCards([false, false, false])
      
      // 依次显示三张牌
      const timers: ReturnType<typeof setTimeout>[] = []
      
      // 第一张牌在1.5秒后显示
      timers.push(setTimeout(() => {
        setRevealCards([true, false, false])
      }, 1500))
      
      // 第二张牌在2.5秒后显示
      timers.push(setTimeout(() => {
        setRevealCards([true, true, false])
      }, 2500))
      
      // 第三张牌在3.5秒后显示
      timers.push(setTimeout(() => {
        setRevealCards([true, true, true])
      }, 3500))

      // 动画完成后回调
      const completeTimer = setTimeout(() => {
        setShowAnimation(false)
        onComplete()
      }, 5000)

      return () => {
        timers.forEach(timer => clearTimeout(timer))
        clearTimeout(completeTimer)
      }
    }
  }, [cards, onComplete])

  if (!showAnimation || !cards || cards.length !== 3) {
    return null
  }

  const positions = ['过去', '现在', '未来']

  return (
    <div className="three-card-draw-animation-overlay">
      <div className="three-card-draw-animation-container">
        <div className="three-card-magic-circle"></div>
        <div className="three-card-sparkles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`three-sparkle three-sparkle-${i}`}>✨</div>
          ))}
        </div>
        
        <div className="three-cards-animation-wrapper">
          {cards.map((drawnCard, index) => (
            <div key={drawnCard.card.id} className="three-card-animation-item">
              {revealCards[index] && (
                <>
                  <div className="three-card-position-label">{positions[index]}</div>
                  <div className={`three-animated-card ${drawnCard.isReversed ? 'reversed' : ''}`}>
                    <div className="three-animated-card-icon">{getCardIcon(drawnCard.card)}</div>
                    <div className="three-animated-card-name">{drawnCard.card.name}</div>
                    {drawnCard.isReversed && <div className="three-animated-reversed-badge">逆位</div>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThreeCardDrawAnimation

