import { ReadingRecord } from './ReadingHistory'
import { tarotCards } from '../data/tarotCards'
import { useLocale } from '../i18n/LocaleContext'
import { useTx } from '../i18n/useTx'
import './Statistics.css'

interface StatisticsProps {
  readings: ReadingRecord[]
}

function Statistics({ readings }: StatisticsProps) {
  const { isEnglish } = useLocale()
  const tx = useTx()

  if (readings.length === 0) {
    return null
  }

  // 统计各种数据
  const totalReadings = readings.length
  const singleReadings = readings.filter(r => r.type === 'single').length
  const threeReadings = readings.filter(r => r.type === 'three').length

  // 统计最常出现的牌
  const cardCounts: Record<number, number> = {}
  readings.forEach(reading => {
    reading.cards.forEach(card => {
      cardCounts[card.card.id] = (cardCounts[card.card.id] || 0) + 1
    })
  })

  const mostFrequentCards = Object.entries(cardCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      card: tarotCards.find((item) => item.id === parseInt(id, 10)),
      count
    }))
    .filter((item): item is { card: (typeof tarotCards)[number]; count: number } => Boolean(item.card))

  // 统计正逆位比例
  let uprightCount = 0
  let reversedCount = 0
  readings.forEach(reading => {
    reading.cards.forEach(card => {
      if (card.isReversed) {
        reversedCount++
      } else {
        uprightCount++
      }
    })
  })

  const totalCards = uprightCount + reversedCount
  const uprightPercent = totalCards > 0 ? Math.round((uprightCount / totalCards) * 100) : 0
  const reversedPercent = totalCards > 0 ? Math.round((reversedCount / totalCards) * 100) : 0

  return (
    <div className="statistics-section">
      <h3>{tx('占卜统计', 'Reading Stats')}</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalReadings}</div>
          <div className="stat-label">{tx('总占卜次数', 'Total readings')}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{singleReadings}</div>
          <div className="stat-label">{tx('单牌占卜', 'Single-card')}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{threeReadings}</div>
          <div className="stat-label">{tx('三牌占卜', 'Three-card')}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{totalCards}</div>
          <div className="stat-label">{tx('抽取牌数', 'Cards drawn')}</div>
        </div>
      </div>

      <div className="stats-details">
        <div className="stat-detail-card">
          <h4>{tx('正逆位分布', 'Upright vs Reversed')}</h4>
          <div className="position-distribution">
            <div className="position-bar">
              <div className="position-label">{tx('正位', 'Upright')}</div>
              <div className="position-progress">
                <div 
                  className="position-fill upright"
                  style={{ width: `${uprightPercent}%` }}
                ></div>
                <span className="position-percent">{uprightPercent}%</span>
              </div>
            </div>
            <div className="position-bar">
              <div className="position-label">{tx('逆位', 'Reversed')}</div>
              <div className="position-progress">
                <div 
                  className="position-fill reversed"
                  style={{ width: `${reversedPercent}%` }}
                ></div>
                <span className="position-percent">{reversedPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {mostFrequentCards.length > 0 && (
          <div className="stat-detail-card">
            <h4>{tx('最常出现的牌', 'Most Frequent Cards')}</h4>
            <div className="frequent-cards">
              {mostFrequentCards.map(({ card, count }) => (
                <div key={card.id} className="frequent-card-item">
                  <span className="card-name">{isEnglish ? card.nameEn : card.name}</span>
                  <span className="card-count">{tx(`${count}次`, `${count}×`)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Statistics

