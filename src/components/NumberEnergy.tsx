import { useState, useMemo } from 'react'
import './NumberEnergy.css'

interface NumberEnergyProps {
  onBack: () => void
}

// 数字类型
type NumberType = 'phone' | 'plate' | 'id' | 'other'

interface NumberTypeOption {
  id: NumberType
  name: string
  icon: string
  description: string
  placeholder: string
}

const numberTypes: NumberTypeOption[] = [
  { id: 'phone', name: '手机号', icon: '📱', description: '分析手机号码的能量', placeholder: '请输入11位手机号' },
  { id: 'plate', name: '车牌号', icon: '🚗', description: '分析车牌号码的能量', placeholder: '请输入车牌号（如：京A12345）' },
  { id: 'id', name: '身份证号', icon: '🆔', description: '分析身份证号码的能量', placeholder: '请输入18位身份证号' },
  { id: 'other', name: '其他数字', icon: '🔢', description: '分析任意数字的能量', placeholder: '请输入数字' },
]

// 数字能量含义
const numberMeanings: { [key: string]: { meaning: string, energy: 'positive' | 'neutral' | 'negative' } } = {
  '0': { meaning: '无限、圆满、起点', energy: 'neutral' },
  '1': { meaning: '独立、领导、创新', energy: 'positive' },
  '2': { meaning: '合作、平衡、和谐', energy: 'positive' },
  '3': { meaning: '创意、表达、社交', energy: 'positive' },
  '4': { meaning: '稳定、务实、秩序', energy: 'neutral' },
  '5': { meaning: '自由、变化、冒险', energy: 'neutral' },
  '6': { meaning: '责任、关爱、家庭', energy: 'positive' },
  '7': { meaning: '智慧、神秘、内省', energy: 'positive' },
  '8': { meaning: '财富、权力、成功', energy: 'positive' },
  '9': { meaning: '完成、智慧、博爱', energy: 'positive' },
}

// 数字组合含义
const combinationMeanings: { [key: string]: string } = {
  '11': '双一：领导力强，独立自主',
  '22': '双二：合作共赢，和谐平衡',
  '33': '双三：创意无限，表达力强',
  '44': '双四：稳定可靠，务实踏实',
  '55': '双五：变化多端，自由灵活',
  '66': '双六：责任重大，关爱他人',
  '77': '双七：智慧超群，神秘深邃',
  '88': '双八：财富丰盈，权力显赫',
  '99': '双九：智慧圆满，博爱无私',
  '123': '顺子：步步高升，顺利发展',
  '321': '倒顺：回归本源，重新开始',
  '888': '三连八：财富三倍，大富大贵',
  '666': '三连六：责任三倍，关爱无限',
  '999': '三连九：智慧三倍，圆满成功',
}

// 计算数字总和
function calculateSum(numbers: string): number {
  return numbers.split('').reduce((sum, char) => {
    const num = parseInt(char)
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
}

// 计算数字总和直到个位数
function reduceToSingleDigit(num: number): number {
  while (num >= 10) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  }
  return num
}

// 分析数字能量
function analyzeNumberEnergy(input: string, type: NumberType) {
  // 提取数字
  const numbers = input.replace(/\D/g, '')
  
  if (numbers.length === 0) {
    return null
  }

  // 数字统计
  const digitCount: { [key: string]: number } = {}
  numbers.split('').forEach(digit => {
    digitCount[digit] = (digitCount[digit] || 0) + 1
  })

  // 计算总和
  const sum = calculateSum(numbers)
  const finalDigit = reduceToSingleDigit(sum)

  // 分析数字组合
  const combinations: string[] = []
  for (let i = 0; i < numbers.length - 1; i++) {
    const twoDigit = numbers.substring(i, i + 2)
    if (combinationMeanings[twoDigit]) {
      combinations.push(twoDigit)
    }
    if (i < numbers.length - 2) {
      const threeDigit = numbers.substring(i, i + 3)
      if (combinationMeanings[threeDigit]) {
        combinations.push(threeDigit)
      }
    }
  }

  // 计算能量评分（0-100）
  let score = 50 // 基础分

  // 根据最终数字调整
  if (finalDigit === 1 || finalDigit === 6 || finalDigit === 8) score += 15
  else if (finalDigit === 2 || finalDigit === 3 || finalDigit === 7 || finalDigit === 9) score += 10
  else if (finalDigit === 4) score -= 5
  else if (finalDigit === 5) score += 5

  // 根据数字组合调整
  score += combinations.length * 5

  // 根据数字含义调整
  const positiveCount = Object.keys(digitCount).filter(d => numberMeanings[d]?.energy === 'positive').length
  const negativeCount = Object.keys(digitCount).filter(d => numberMeanings[d]?.energy === 'negative').length
  score += positiveCount * 3
  score -= negativeCount * 2

  // 根据类型调整
  if (type === 'phone' && numbers.length === 11) score += 5
  else if (type === 'id' && numbers.length === 18) score += 5
  else if (type === 'plate' && numbers.length >= 5) score += 5

  // 限制在 0-100 之间
  score = Math.max(0, Math.min(100, score))

  // 判断等级
  let level: 'excellent' | 'good' | 'average' | 'poor'
  let levelText: string
  let levelColor: string

  if (score >= 80) {
    level = 'excellent'
    levelText = '极佳'
    levelColor = '#4ade80'
  } else if (score >= 60) {
    level = 'good'
    levelText = '良好'
    levelColor = '#60a5fa'
  } else if (score >= 40) {
    level = 'average'
    levelText = '一般'
    levelColor = '#fbbf24'
  } else {
    level = 'poor'
    levelText = '较差'
    levelColor = '#f87171'
  }

  // 生成建议
  const suggestions: string[] = []
  
  if (score < 60) {
    suggestions.push('建议选择包含更多吉利数字（1、6、8、9）的组合')
    suggestions.push('避免过多使用数字4，可考虑用其他数字替代')
  }
  
  if (combinations.length === 0) {
    suggestions.push('可以尝试选择包含特殊数字组合的号码')
  }
  
  if (finalDigit === 4) {
    suggestions.push('最终数字为4，建议调整以改善整体能量')
  }
  
  if (positiveCount < 3) {
    suggestions.push('增加吉利数字的使用频率，提升整体能量')
  }

  if (suggestions.length === 0) {
    suggestions.push('当前数字能量良好，继续保持')
  }

  return {
    numbers,
    digitCount,
    sum,
    finalDigit,
    combinations: Array.from(new Set(combinations)),
    score,
    level,
    levelText,
    levelColor,
    suggestions,
  }
}

function NumberEnergy({ onBack }: NumberEnergyProps) {
  const [input, setInput] = useState('')
  const [selectedType, setSelectedType] = useState<NumberType>('phone')

  const analysis = useMemo(() => {
    if (!input.trim()) return null
    return analyzeNumberEnergy(input, selectedType)
  }, [input, selectedType])

  const selectedTypeInfo = numberTypes.find(t => t.id === selectedType)

  return (
    <div className="number-energy">
      <button className="back-button" onClick={onBack}>
        ← 返回
      </button>

      <div className="number-energy-header">
        <h1>🔢 数字能量</h1>
        <p className="subtitle">分析数字的能量，解读数字背后的含义</p>
      </div>

      <div className="number-energy-content">
        {/* 数字类型选择 */}
        <div className="number-type-section">
          <h2>选择数字类型</h2>
          <div className="number-type-grid">
            {numberTypes.map(type => (
              <div
                key={type.id}
                className={`number-type-card ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedType(type.id)
                  setInput('')
                }}
              >
                <div className="type-icon">{type.icon}</div>
                <div className="type-name">{type.name}</div>
                <div className="type-desc">{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="input-section">
          <h2>输入数字</h2>
          <div className="input-wrapper">
            <input
              type="text"
              className="number-input"
              placeholder={selectedTypeInfo?.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={selectedType === 'phone' ? 11 : selectedType === 'id' ? 18 : 50}
            />
            {input && (
              <button className="clear-button" onClick={() => setInput('')}>
                ✕
              </button>
            )}
          </div>
          {selectedType === 'phone' && input.length > 0 && input.length !== 11 && (
            <p className="input-hint">请输入11位手机号</p>
          )}
          {selectedType === 'id' && input.length > 0 && input.length !== 18 && (
            <p className="input-hint">请输入18位身份证号</p>
          )}
        </div>

        {/* 分析结果 */}
        {analysis && (
          <div className="analysis-section">
            <h2>能量分析</h2>

            {/* 总体评分 */}
            <div className="score-card">
              <div className="score-header">
                <span className="score-label">能量评分</span>
                <span className="score-level" style={{ color: analysis.levelColor }}>
                  {analysis.levelText}
                </span>
              </div>
              <div className="score-value">
                <span className="score-number">{analysis.score}</span>
                <span className="score-total">/ 100</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${analysis.score}%`,
                    backgroundColor: analysis.levelColor,
                  }}
                />
              </div>
            </div>

            {/* 数字信息 */}
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">提取的数字</div>
                <div className="info-value">{analysis.numbers}</div>
              </div>
              <div className="info-card">
                <div className="info-label">数字总和</div>
                <div className="info-value">{analysis.sum}</div>
              </div>
              <div className="info-card">
                <div className="info-label">最终数字</div>
                <div className="info-value highlight">{analysis.finalDigit}</div>
              </div>
            </div>

            {/* 数字统计 */}
            <div className="digit-statistics">
              <h3>数字统计</h3>
              <div className="digit-grid">
                {Object.entries(analysis.digitCount)
                  .sort((a, b) => b[1] - a[1])
                  .map(([digit, count]) => {
                    const meaning = numberMeanings[digit]
                    return (
                      <div key={digit} className="digit-item">
                        <div className="digit-number">{digit}</div>
                        <div className="digit-count">出现 {count} 次</div>
                        {meaning && (
                          <div className={`digit-meaning ${meaning.energy}`}>
                            {meaning.meaning}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* 数字组合 */}
            {analysis.combinations.length > 0 && (
              <div className="combinations-section">
                <h3>特殊组合</h3>
                <div className="combinations-list">
                  {analysis.combinations.map((combo, index) => (
                    <div key={index} className="combination-item">
                      <span className="combination-number">{combo}</span>
                      <span className="combination-meaning">{combinationMeanings[combo]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 数字含义 */}
            <div className="meanings-section">
              <h3>数字含义</h3>
              <div className="meanings-grid">
                {Array.from(new Set(analysis.numbers.split(''))).map(digit => {
                  const meaning = numberMeanings[digit]
                  if (!meaning) return null
                  return (
                    <div key={digit} className={`meaning-item ${meaning.energy}`}>
                      <div className="meaning-digit">{digit}</div>
                      <div className="meaning-text">{meaning.meaning}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 建议 */}
            <div className="suggestions-section">
              <h3>💡 建议</h3>
              <ul className="suggestions-list">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 提示信息 */}
        {!analysis && input && (
          <div className="empty-state">
            <p>请输入有效的数字进行分析</p>
          </div>
        )}

        {!input && (
          <div className="empty-state">
            <p>👆 请在上方输入数字开始分析</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NumberEnergy

