import { useState } from 'react'
import { ReadingType, readingTypes } from '../types/reading'
import './ReadingTypeSelector.css'
import { toast } from '../utils/toast'
import { Button } from './ui'
import { TarotLogoMark } from './tarot/TarotLogoMark'

interface ReadingTypeSelectorProps {
  onSelect: (type: ReadingType, customQuestion?: string) => void
  onCancel: () => void
}

function ReadingTypeSelector({ onSelect, onCancel }: ReadingTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null)
  const [customQuestion, setCustomQuestion] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleTypeClick = (type: ReadingType) => {
    if (type === 'custom') {
      setShowCustomInput(true)
      setSelectedType('custom')
    } else {
      setSelectedType(type)
      setShowCustomInput(false)
    }
  }

  const handleConfirm = () => {
    if (selectedType) {
      if (selectedType === 'custom' && !customQuestion.trim()) {
        toast.warning('请输入您的问题')
        return
      }
      onSelect(selectedType, selectedType === 'custom' ? customQuestion : undefined)
    }
  }

  return (
    <div
      className="reading-type-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reading-type-title"
    >
      <div className="reading-type-container" onClick={(e) => e.stopPropagation()}>
        <div className="reading-type-header">
          <div className="reading-type-header__text">
            <TarotLogoMark size="sm" />
            <h2 id="reading-type-title">选择占卜主题</h2>
            <p>三牌时空 · 针对你的问题选取解读方向</p>
          </div>
          <button
            type="button"
            className="close-type-selector"
            onClick={onCancel}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <div className="reading-type-grid" role="radiogroup" aria-labelledby="reading-type-title">
          {readingTypes.map((type) => (
            <div
              key={type.id}
              className={`reading-type-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => handleTypeClick(type.id)}
              role="radio"
              aria-checked={selectedType === type.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTypeClick(type.id)
                }
              }}
            >
              <div className="reading-type-name">{type.name}</div>
              <div className="reading-type-desc">{type.description}</div>
            </div>
          ))}
        </div>

        {showCustomInput && (
          <div className="custom-question-input">
            <label htmlFor="custom-question-textarea">请输入您的问题</label>
            <textarea
              id="custom-question-textarea"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="例如：我最近的工作会顺利吗？"
              rows={3}
              className="custom-question-textarea"
            />
          </div>
        )}

        <div className="reading-type-actions">
          <Button variant="ghost" onClick={onCancel}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedType || (selectedType === 'custom' && !customQuestion.trim())}
          >
            开始抽牌
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReadingTypeSelector
