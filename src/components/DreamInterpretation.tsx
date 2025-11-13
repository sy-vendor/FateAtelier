import { useState, useEffect } from 'react'
import { interpretDream, DreamSymbol } from '../data/dreamSymbols'
import './DreamInterpretation.css'

interface DreamInterpretationProps {
  onBack?: () => void
}

interface DreamRecord {
  id: string
  content: string
  interpretation: {
    symbols: DreamSymbol[]
    overall: string
    advice: string
  }
  timestamp: number
}

function DreamInterpretation({ onBack }: DreamInterpretationProps) {
  const [dreamContent, setDreamContent] = useState('')
  const [interpretation, setInterpretation] = useState<{
    symbols: DreamSymbol[]
    overall: string
    advice: string
  } | null>(null)
  const [history, setHistory] = useState<DreamRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isInterpreting, setIsInterpreting] = useState(false)

  // 从localStorage加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('dream-interpretation-history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load dream history', e)
      }
    }
  }, [])

  // 保存历史记录到localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('dream-interpretation-history', JSON.stringify(history))
    }
  }, [history])

  const handleInterpret = () => {
    if (!dreamContent.trim()) {
      alert('请输入梦境内容')
      return
    }

    setIsInterpreting(true)
    
    // 模拟解析过程，增加真实感
    setTimeout(() => {
      const result = interpretDream(dreamContent)
      setInterpretation(result)
      
      // 保存到历史记录
      const record: DreamRecord = {
        id: Date.now().toString(),
        content: dreamContent,
        interpretation: result,
        timestamp: Date.now()
      }
      setHistory([record, ...history].slice(0, 50)) // 最多保存50条
      
      setIsInterpreting(false)
      // 滚动到结果区域
      setTimeout(() => {
        const resultElement = document.getElementById('dream-result')
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }, 800)
  }

  const handleClear = () => {
    setDreamContent('')
    setInterpretation(null)
  }

  const handleViewHistory = (record: DreamRecord) => {
    setDreamContent(record.content)
    setInterpretation(record.interpretation)
    setShowHistory(false)
    setTimeout(() => {
      const resultElement = document.getElementById('dream-result')
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleDeleteHistory = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      setHistory(history.filter(r => r.id !== id))
    }
  }

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

  return (
    <div className="dream-interpretation">
      <div className="dream-header">
        <h2>💭 梦境解析</h2>
        <p className="dream-subtitle">记录你的梦境，探索潜意识的奥秘</p>
      </div>

      <div className="dream-input-section">
        <div className="dream-input-wrapper">
          <label htmlFor="dream-content">描述你的梦境：</label>
          <textarea
            id="dream-content"
            className="dream-textarea"
            placeholder="例如：我梦见一条大蛇在追我，我拼命地跑，最后跳进了一条河里..."
            value={dreamContent}
            onChange={(e) => setDreamContent(e.target.value)}
            rows={6}
          />
          <div className="dream-actions">
            <button
              className="dream-interpret-btn"
              onClick={handleInterpret}
              disabled={isInterpreting || !dreamContent.trim()}
            >
              {isInterpreting ? '解析中...' : '🔮 开始解析'}
            </button>
            {dreamContent && (
              <button className="dream-clear-btn" onClick={handleClear}>
                清空
              </button>
            )}
            <button
              className="dream-history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? '📝 隐藏历史' : '📚 查看历史'}
            </button>
          </div>
        </div>
      </div>

      {showHistory && history.length > 0 && (
        <div className="dream-history-section">
          <h3>解析历史</h3>
          <div className="dream-history-list">
            {history.map((record) => (
              <div key={record.id} className="dream-history-item">
                <div className="dream-history-content">
                  <p className="dream-history-text">{record.content}</p>
                  <span className="dream-history-date">{formatDate(record.timestamp)}</span>
                </div>
                <div className="dream-history-actions">
                  <button
                    className="dream-view-btn"
                    onClick={() => handleViewHistory(record)}
                  >
                    查看
                  </button>
                  <button
                    className="dream-delete-btn"
                    onClick={() => handleDeleteHistory(record.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showHistory && history.length === 0 && (
        <div className="dream-empty-history">
          <p>暂无历史记录</p>
        </div>
      )}

      {interpretation && (
        <div id="dream-result" className="dream-result-section">
          <h3>✨ 解析结果</h3>
          
          <div className="dream-overall">
            <div className="dream-overall-content">
              <p>{interpretation.overall}</p>
            </div>
          </div>

          {interpretation.symbols.length > 0 && (
            <div className="dream-symbols">
              <h4>梦境符号解析</h4>
              <div className="dream-symbols-list">
                {interpretation.symbols.map((symbol, index) => (
                  <div key={index} className="dream-symbol-item">
                    <div className="dream-symbol-header">
                      <span className="dream-symbol-keywords">
                        {symbol.keywords.slice(0, 3).join('、')}
                        {symbol.keywords.length > 3 && '...'}
                      </span>
                      <span className="dream-symbol-category">{symbol.category}</span>
                    </div>
                    <div className="dream-symbol-meaning">
                      <p><strong>含义：</strong>{symbol.meaning}</p>
                      {symbol.positive && (
                        <p className="dream-positive"><strong>正面解读：</strong>{symbol.positive}</p>
                      )}
                      {symbol.negative && (
                        <p className="dream-negative"><strong>需要注意：</strong>{symbol.negative}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="dream-advice">
            <h4>💡 建议</h4>
            <p>{interpretation.advice}</p>
          </div>

          <div className="dream-note">
            <p>💭 提示：梦境解析仅供参考，每个人的梦境都有其独特性。最重要的是关注梦境带给你的感受和启发。</p>
          </div>
        </div>
      )}

      {!interpretation && !showHistory && (
        <div className="dream-tips">
          <h3>💡 使用提示</h3>
          <ul>
            <li>尽可能详细地描述你的梦境，包括人物、场景、动作和感受</li>
            <li>梦境中的细节往往比整体情节更重要</li>
            <li>记录梦境时尽量保持客观，不要过度解读</li>
            <li>定期回顾你的梦境记录，可能会发现一些规律</li>
            <li>梦境解析仅供参考，最重要的是你内心的感受</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default DreamInterpretation

