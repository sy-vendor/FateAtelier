import { useState, useEffect, useMemo } from 'react'
import { divinationSticks, DivinationStick } from '../data/divinationSticks'
import { optimizeStick } from '../utils/divinationOptimizer'
import './DivinationDraw.css'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { toast } from '../utils/toast'
import { confirm } from '../utils/confirm'

interface DrawHistory {
  id: string
  stick: DivinationStick
  timestamp: number
  category?: string
}

function DivinationDraw() {
  const [isShaking, setIsShaking] = useState(false)
  const [drawnStick, setDrawnStick] = useState<DivinationStick | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [drawHistory, setDrawHistory] = useState<DrawHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showDetailed, setShowDetailed] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)
  const [historySearch, setHistorySearch] = useState('')

  // 从localStorage加载历史记录和收藏
  useEffect(() => {
    const historyResult = getStorageItem<DrawHistory[]>('divination-draw-history', [])
    if (historyResult.success && historyResult.data) {
      setDrawHistory(historyResult.data)
    } else if (historyResult.error) {
      toast.error('加载历史记录失败')
    }
    
    const favoritesResult = getStorageItem<number[]>('divination-favorites', [])
    if (favoritesResult.success && favoritesResult.data) {
      setFavorites(new Set(favoritesResult.data))
    } else if (favoritesResult.error) {
      toast.error('加载收藏失败')
    }
  }, [])

  // 保存历史记录到localStorage
  useEffect(() => {
    // 始终保存，包括空数组（用于删除所有记录的情况）
    const result = setStorageItem('divination-draw-history', drawHistory)
    if (!result.success && result.error) {
      toast.warning(result.error || '保存历史记录失败')
    }
  }, [drawHistory])

  // 保存收藏到localStorage
  useEffect(() => {
    // 始终保存，包括空集合（用于清空收藏的情况）
    const result = setStorageItem('divination-favorites', Array.from(favorites))
    if (!result.success && result.error) {
      toast.warning(result.error || '保存收藏失败')
    }
  }, [favorites])

  // 抽签动画
  const drawStick = () => {
    if (isShaking) return

    setIsShaking(true)
    setShowResult(false)
    setDrawnStick(null)

    // 摇签动画持续2秒
    setTimeout(() => {
      // 随机抽取一支签
      const randomIndex = Math.floor(Math.random() * divinationSticks.length)
      const stick = divinationSticks[randomIndex]
      
      setDrawnStick(stick)
      setIsShaking(false)
      
      // 延迟显示结果，增加仪式感
      setTimeout(() => {
        setShowResult(true)
        
        // 保存到历史记录
        const historyItem: DrawHistory = {
          id: Date.now().toString(),
          stick,
          timestamp: Date.now(),
          category: selectedCategory || undefined
        }
        setDrawHistory([historyItem, ...drawHistory])
      }, 500)
    }, 2000)
  }

  // 获取签文等级颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case '上上':
        return '#ff6b6b'
      case '上':
        return '#ffa500'
      case '中上':
        return '#ffd700'
      case '中':
        return '#90ee90'
      case '中下':
        return '#87ceeb'
      case '下':
        return '#d3d3d3'
      case '下下':
        return '#a9a9a9'
      default:
        return '#666'
    }
  }

  // 获取分类建议
  const getCategoryAdvice = (stick: DivinationStick, category: string) => {
    if (!category) return null
    return stick.categories[category as keyof typeof stick.categories]
  }

  // 优化签文解读，减少重复话术
  const optimizedStick = useMemo(() => {
    if (!drawnStick) return null
    return optimizeStick(drawnStick)
  }, [drawnStick])

  // 切换收藏
  const toggleFavorite = (stickId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(stickId)) {
        newFavorites.delete(stickId)
      } else {
        newFavorites.add(stickId)
      }
      return newFavorites
    })
  }

  // 复制签文内容
  const copyToClipboard = () => {
    if (!optimizedStick) return
    
    const text = `第 ${optimizedStick.id} 签 - ${optimizedStick.title} (${optimizedStick.level})

签诗：
${optimizedStick.poem}

解签：
${optimizedStick.interpretation}

建议：
${optimizedStick.advice}${optimizedStick.story ? `\n\n戏文简介：\n${optimizedStick.story}` : ''}${optimizedStick.dailyPoem ? `\n\n日诗：\n${optimizedStick.dailyPoem}` : ''}

来自 FateAtelier 抽签求签`
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // 复制失败，静默处理
    })
  }

  // 分享签文
  const shareStick = async () => {
    if (!optimizedStick) return
    
    const text = `第 ${optimizedStick.id} 签 - ${optimizedStick.title} (${optimizedStick.level})\n\n签诗：${optimizedStick.poem}\n\n解签：${optimizedStick.interpretation}\n\n来自 FateAtelier 抽签求签`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `第 ${optimizedStick.id} 签 - ${optimizedStick.title}`,
          text: text
        })
      } catch (err) {
        // 分享失败，静默处理
      }
    } else {
      // 降级到复制
      copyToClipboard()
    }
  }

  // 导出历史记录
  const exportHistory = () => {
    const data = JSON.stringify(drawHistory, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `抽签历史记录_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 清空历史记录
  const clearHistory = async () => {
    const confirmed = await confirm({
      title: '清空历史记录',
      message: '确定要清空所有历史记录吗？此操作不可恢复。',
      confirmText: '清空',
      cancelText: '取消',
      type: 'danger'
    })
    if (confirmed) {
      setDrawHistory([])
      setStorageItem('divination-draw-history', [])
    }
  }

  // 筛选历史记录
  const filteredHistory = useMemo(() => {
    if (!historySearch) return drawHistory
    const search = historySearch.toLowerCase()
    return drawHistory.filter(item => 
      item.stick.title.toLowerCase().includes(search) ||
      item.stick.poem.toLowerCase().includes(search) ||
      item.stick.id.toString().includes(search)
    )
  }, [drawHistory, historySearch])

  return (
    <div className="divination-draw">
      <div className="divination-header">
        <h1>🎋 抽签求签</h1>
        <p className="subtitle">心诚则灵，抽签问事</p>
      </div>

      <div className="divination-content">
        {/* 分类选择 */}
        <div className="category-selector">
          <label>求签类别（可选）：</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isShaking}
          >
            <option value="">全部</option>
            <option value="career">事业</option>
            <option value="love">感情</option>
            <option value="health">健康</option>
            <option value="wealth">财运</option>
            <option value="travel">出行</option>
          </select>
        </div>

        {/* 签筒 */}
        <div className="stick-container">
          {/* 抽签按钮 */}
          <button
            className={`draw-btn ${isShaking ? 'shaking' : ''}`}
            onClick={drawStick}
            disabled={isShaking}
          >
            {isShaking ? '摇签中...' : '摇签求签'}
          </button>

          <div className={`stick-tube ${isShaking ? 'shaking' : ''}`}>
            <div className="stick-tube-body">
              <div className="stick-tube-top"></div>
              <div className="stick-tube-bottom"></div>
              {/* 签支效果 */}
              {isShaking && (
                <div className="stick-particles">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="stick-particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="stick-tube-label">签筒</div>
          </div>
        </div>

        {/* 抽签结果 */}
        {showResult && optimizedStick && (
          <div className="result-container">
            <div className="result-card" style={{ borderColor: getLevelColor(optimizedStick.level) }}>
              <div className="result-header">
                <div className="stick-number">第 {optimizedStick.id} 签</div>
                <div className="stick-level" style={{ color: getLevelColor(optimizedStick.level) }}>
                  {optimizedStick.level}
                </div>
              </div>
              
              <div className="stick-title">{optimizedStick.title}</div>
              
              <div className="stick-poem">
                <div className="poem-label">签诗：</div>
                <div className="poem-content">{optimizedStick.poem}</div>
              </div>

              <div className="stick-interpretation">
                <div className="interpretation-label">解签：</div>
                <div className="interpretation-content">{optimizedStick.interpretation}</div>
              </div>

              {selectedCategory && getCategoryAdvice(optimizedStick, selectedCategory) && (
                <div className="category-advice">
                  <div className="advice-label">
                    {selectedCategory === 'career' ? '事业' :
                     selectedCategory === 'love' ? '感情' :
                     selectedCategory === 'health' ? '健康' :
                     selectedCategory === 'wealth' ? '财运' :
                     selectedCategory === 'travel' ? '出行' : '建议'}：
                  </div>
                  <div className="advice-content">
                    {getCategoryAdvice(optimizedStick, selectedCategory)}
                  </div>
                </div>
              )}

              <div className="stick-advice">
                <div className="advice-label">建议：</div>
                <div className="advice-content">{optimizedStick.advice}</div>
              </div>

              {/* 戏文简介 - 直接显示 */}
              {optimizedStick.story && (
                <div className="detail-item">
                  <div className="detail-label">📖 戏文简介：</div>
                  <div className="detail-text">{optimizedStick.story}</div>
                </div>
              )}

              {/* 日诗 - 直接显示 */}
              {optimizedStick.dailyPoem && (
                <div className="detail-item">
                  <div className="detail-label">📜 日诗：</div>
                  <div className="detail-text poem-style">{optimizedStick.dailyPoem}</div>
                </div>
              )}

              {/* 详细解签 - 其他详细内容需要展开 */}
              {(optimizedStick.detailedInterpretations || optimizedStick.ageGenderInterpretations) && (
                <div className="detailed-section">
                  <button
                    className="toggle-detailed-btn"
                    onClick={() => setShowDetailed(!showDetailed)}
                  >
                    {showDetailed ? '收起' : '展开'}详细解签 {showDetailed ? '▲' : '▼'}
                  </button>

                  {showDetailed && (
                    <div className="detailed-content">

                      {/* 按年龄性别解读 */}
                      {optimizedStick.ageGenderInterpretations && (
                        <div className="detail-item">
                          <div className="detail-label">👥 按年龄性别：</div>
                          <div className="age-gender-grid">
                            {optimizedStick.ageGenderInterpretations.child && (
                              <div className="age-gender-item">
                                <span className="age-label">小孩：</span>
                                <span>{optimizedStick.ageGenderInterpretations.child}</span>
                              </div>
                            )}
                            {optimizedStick.ageGenderInterpretations.youngGirl && (
                              <div className="age-gender-item">
                                <span className="age-label">小女：</span>
                                <span>{optimizedStick.ageGenderInterpretations.youngGirl}</span>
                              </div>
                            )}
                            {optimizedStick.ageGenderInterpretations.youngBoy && (
                              <div className="age-gender-item">
                                <span className="age-label">小儿：</span>
                                <span>{optimizedStick.ageGenderInterpretations.youngBoy}</span>
                              </div>
                            )}
                            {optimizedStick.ageGenderInterpretations.male && (
                              <div className="age-gender-item">
                                <span className="age-label">男：</span>
                                <span>{optimizedStick.ageGenderInterpretations.male}</span>
                              </div>
                            )}
                            {optimizedStick.ageGenderInterpretations.female && (
                              <div className="age-gender-item">
                                <span className="age-label">女：</span>
                                <span>{optimizedStick.ageGenderInterpretations.female}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 详细解读 */}
                      {optimizedStick.detailedInterpretations && (
                        <div className="detail-item">
                          <div className="detail-label">🔍 详细解读：</div>
                          <div className="interpretations-grid">
                            {optimizedStick.detailedInterpretations.home && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">家宅：</span>
                                <span>{optimizedStick.detailedInterpretations.home}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.business && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">生意：</span>
                                <span>{optimizedStick.detailedInterpretations.business}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.travel && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">出行：</span>
                                <span>{optimizedStick.detailedInterpretations.travel}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.marriage && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">婚姻：</span>
                                <span>{optimizedStick.detailedInterpretations.marriage}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.wealth && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">求财：</span>
                                <span>{optimizedStick.detailedInterpretations.wealth}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.health && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">求医：</span>
                                <span>{optimizedStick.detailedInterpretations.health}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.lawsuit && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">诉讼：</span>
                                <span>{optimizedStick.detailedInterpretations.lawsuit}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.lostItem && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">失物：</span>
                                <span>{optimizedStick.detailedInterpretations.lostItem}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.searchPerson && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">寻人：</span>
                                <span>{optimizedStick.detailedInterpretations.searchPerson}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.relocation && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">移徙：</span>
                                <span>{optimizedStick.detailedInterpretations.relocation}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.career && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">功名：</span>
                                <span>{optimizedStick.detailedInterpretations.career}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.pregnancy && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">六甲：</span>
                                <span>{optimizedStick.detailedInterpretations.pregnancy}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.livestock && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">六畜：</span>
                                <span>{optimizedStick.detailedInterpretations.livestock}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.disputes && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">口舌：</span>
                                <span>{optimizedStick.detailedInterpretations.disputes}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.illness && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">病：</span>
                                <span>{optimizedStick.detailedInterpretations.illness}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.transaction && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">交易：</span>
                                <span>{optimizedStick.detailedInterpretations.transaction}</span>
                              </div>
                            )}
                            {optimizedStick.detailedInterpretations.traveler && (
                              <div className="interpretation-item">
                                <span className="interpretation-key">行人：</span>
                                <span>{optimizedStick.detailedInterpretations.traveler}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="result-actions">
                <button
                  className={`action-btn favorite-btn1 ${optimizedStick && favorites.has(optimizedStick.id) ? 'active' : ''}`}
                  onClick={() => optimizedStick && toggleFavorite(optimizedStick.id)}
                  title={optimizedStick && favorites.has(optimizedStick.id) ? '取消收藏' : '收藏'}
                >
                  {optimizedStick && favorites.has(optimizedStick.id) ? '⭐' : '☆'} 收藏
                </button>
                <button
                  className="action-btn copy-btn1"
                  onClick={copyToClipboard}
                  title="复制签文"
                >
                  {copied ? '✓ 已复制' : '📋 复制'}
                </button>
                <button
                  className="action-btn share-btn"
                  onClick={shareStick}
                  title="分享签文"
                >
                  📤 分享
                </button>
                <button
                  className="draw-again-btn"
                  onClick={() => {
                    setShowResult(false)
                    setDrawnStick(null)
                    setShowDetailed(false)
                    setCopied(false)
                  }}
                >
                  再抽一签
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 历史记录 */}
        <div className="history-section">
          <div className="history-header-controls">
            <button
              className="history-toggle-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? '隐藏' : '显示'}历史记录 ({drawHistory.length})
            </button>
            {showHistory && drawHistory.length > 0 && (
              <div className="history-actions">
                <button className="history-action-btn" onClick={exportHistory}>
                  📥 导出
                </button>
                <button className="history-action-btn" onClick={clearHistory}>
                  🗑️ 清空
                </button>
              </div>
            )}
          </div>

          {showHistory && drawHistory.length > 0 && (
            <>
              <div className="history-search">
                <input
                  type="text"
                  placeholder="搜索历史记录..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="history-search-input"
                />
              </div>
              <div className="history-list">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => {
                    const isFavorite = favorites.has(item.stick.id)
                    return (
                      <div key={item.id} className="history-item">
                        <div className="history-header">
                          <span className="history-number">第 {item.stick.id} 签</span>
                          <span 
                            className="history-level"
                            style={{ color: getLevelColor(item.stick.level) }}
                          >
                            {item.stick.level}
                          </span>
                          <span className="history-title">{item.stick.title}</span>
                          <span className="history-time">
                            {new Date(item.timestamp).toLocaleString('zh-CN')}
                          </span>
                          <button
                            className={`history-favorite-btn ${isFavorite ? 'active' : ''}`}
                            onClick={() => toggleFavorite(item.stick.id)}
                            title={isFavorite ? '取消收藏' : '收藏'}
                          >
                            {isFavorite ? '⭐' : '☆'}
                          </button>
                        </div>
                        <button
                          className="view-detail-btn"
                          onClick={() => {
                            setDrawnStick(item.stick)
                            setShowResult(true)
                            setSelectedCategory(item.category || '')
                            setShowDetailed(false)
                          }}
                        >
                          查看详情
                        </button>
                      </div>
                    )
                  })
                ) : (
                  <div className="history-empty">没有找到匹配的历史记录</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DivinationDraw

