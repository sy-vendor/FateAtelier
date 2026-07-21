import { useState } from 'react'
import { DrawnCard } from '../types'
import { useLocale } from '../i18n/LocaleContext'
import { useTx } from '../i18n/useTx'
import { generateThreeCardReading, resolveThreeCardInterpretation } from '../utils/readingInterpretation'
import { getReadingTypes } from '../types/reading'
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
  const { isEnglish } = useLocale()
  const tx = useTx()
  const [searchTerm, setSearchTerm] = useState('')
  const readingTypes = getReadingTypes(isEnglish)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString(isEnglish ? 'en-US' : 'zh-CN', {
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
        <p>{tx('暂无占卜记录', 'No readings yet')}</p>
        <p className="empty-hint">{tx('完成一次单牌或三牌占卜后，记录会显示在这里。', 'Complete a single or three-card reading and it will appear here.')}</p>
      </div>
    )
  }

  const readingTypeLabel = (typeId?: string) =>
    readingTypes.find((t) => t.id === typeId)?.name ?? tx('综合占卜', 'General')

  return (
    <div className="reading-history">
      <div className="history-header-section">
        <h3>{tx('占卜历史', 'Reading History')} · {readings.length}</h3>
        {onExportAll && (
          <Button variant="ghost" small onClick={onExportAll}>
            {tx('导出全部', 'Export all')}
          </Button>
        )}
      </div>

      {readings.length > 5 && (
        <div className="history-search">
          <input
            type="text"
            placeholder={tx('搜索占卜记录...', 'Search readings...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="history-search-input"
          />
        </div>
      )}

      <div className="history-list">
        {filteredReadings.length === 0 ? (
          <div className="history-empty-search">
            <p>{tx('未找到匹配的占卜记录', 'No matching readings found')}</p>
          </div>
        ) : (
          filteredReadings.map((reading) => (
          <div key={reading.id} className="history-item">
            <div className="history-header">
              <div className="history-info">
                <div className="history-type-row">
                  <span className="history-type">
                    {reading.type === 'single' ? tx('单牌', 'Single') : tx('三牌', 'Three')}
                  </span>
                  {reading.readingType && reading.type === 'three' && (
                    <span className="history-reading-type">
                      {reading.readingType === 'custom'
                        ? reading.customQuestion || tx('自定义', 'Custom')
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
                  {tx('查看', 'View')}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDeleteReading(reading.id)}
                >
                  {tx('删除', 'Delete')}
                </button>
              </div>
            </div>
            {reading.type === 'three' && (() => {
              const interpretation = resolveThreeCardInterpretation(reading, isEnglish) ?? reading.interpretation
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

