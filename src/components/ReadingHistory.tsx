import { useState } from 'react'
import { DrawnCard } from '../types'
import { generateThreeCardReading, resolveThreeCardInterpretation } from '../utils/readingInterpretation'
import { readingTypes } from '../types/reading'
import './ReadingHistory.css'
import { Button } from './ui'

interface ReadingHistoryProps {
  readings: ReadingRecord[]
  onViewReading: (reading: ReadingRecord) => void
  onDeleteReading: (id: string) => void
  onExportAll?: () => void
}

export interface ReadingRecord {
  id: string
  type: 'single' | 'three'
  cards: DrawnCard[]
  timestamp: number
  interpretation?: ReturnType<typeof generateThreeCardReading>
  readingType?: string
  customQuestion?: string
}

function ReadingHistory({ readings, onViewReading, onDeleteReading, onExportAll }: ReadingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredReadings = readings.filter(reading => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return reading.cards.some(card => 
      card.card.name.toLowerCase().includes(searchLower) ||
      card.card.nameEn.toLowerCase().includes(searchLower)
    ) || formatDate(reading.timestamp).includes(searchTerm)
  })

  if (readings.length === 0) {
    return (
      <div className="reading-history empty">
        <p>暂无占卜记录</p>
        <p className="empty-hint">完成一次单牌或三牌占卜后，记录会显示在这里。</p>
      </div>
    )
  }

  const readingTypeLabel = (typeId?: string) =>
    readingTypes.find((t) => t.id === typeId)?.name ?? '综合占卜'

  return (
    <div className="reading-history">
      <div className="history-header-section">
        <h3>占卜历史 · {readings.length}</h3>
        {onExportAll && (
          <Button variant="ghost" small onClick={onExportAll}>
            导出全部
          </Button>
        )}
      </div>

      {readings.length > 5 && (
        <div className="history-search">
          <input
            type="text"
            placeholder="搜索占卜记录..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="history-search-input"
          />
        </div>
      )}

      <div className="history-list">
        {filteredReadings.length === 0 ? (
          <div className="history-empty-search">
            <p>未找到匹配的占卜记录</p>
          </div>
        ) : (
          filteredReadings.map((reading) => (
          <div key={reading.id} className="history-item">
            <div className="history-header">
              <div className="history-info">
                <div className="history-type-row">
                  <span className="history-type">
                    {reading.type === 'single' ? '单牌' : '三牌'}
                  </span>
                  {reading.readingType && reading.type === 'three' && (
                    <span className="history-reading-type">
                      {reading.readingType === 'custom'
                        ? reading.customQuestion || '自定义'
                        : readingTypeLabel(reading.readingType)}
                    </span>
                  )}
                </div>
                <span className="history-date">{formatDate(reading.timestamp)}</span>
              </div>
              <div className="history-actions">
                <button 
                  className="view-btn"
                  onClick={() => onViewReading(reading)}
                >
                  查看
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDeleteReading(reading.id)}
                >
                  删除
                </button>
              </div>
            </div>
            {reading.type === 'three' && (() => {
              const interpretation = resolveThreeCardInterpretation(reading) ?? reading.interpretation
              if (!interpretation) return null
              return (
                <div className="history-preview">
                  <p className="preview-text">{interpretation.summary}</p>
                </div>
              )
            })()}
          </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReadingHistory

