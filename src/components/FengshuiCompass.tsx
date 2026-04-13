import { useState, useEffect, useRef } from 'react'
import { directions, getTodayAuspiciousDirections, getDirectionInterpretation, recommendDirectionForPurpose, bagua } from '../data/fengshuiCompass'
import './FengshuiCompass.css'

function FengshuiCompass() {
  const [rotation, setRotation] = useState(0)
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [selectedPurpose, setSelectedPurpose] = useState<string>('')
  const compassRef = useRef<HTMLDivElement>(null)
  
  const todayDirections = getTodayAuspiciousDirections()
  const interpretation = selectedDirection ? getDirectionInterpretation(selectedDirection) : null

  // 处理鼠标按下
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!compassRef.current) return
    setIsDragging(true)
    const rect = compassRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI
    setStartAngle(angle - rotation)
  }

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !compassRef.current) return
    const rect = compassRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI
    setRotation(angle - startAngle)
  }

  // 处理鼠标释放
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 点击方位
  const handleDirectionClick = (directionName: string) => {
    setSelectedDirection(directionName)
  }

  // 重置罗盘
  const handleReset = () => {
    setRotation(0)
    setSelectedDirection(null)
  }

  // 自动对齐到方位
  const handleAlignToDirection = (directionName: string) => {
    const direction = directions.find(d => d.name === directionName)
    if (direction) {
      setRotation(-direction.angle)
      setSelectedDirection(directionName)
    }
  }

  // 根据用途推荐
  const handlePurposeSelect = (purpose: string) => {
    setSelectedPurpose(purpose)
    const recommended = recommendDirectionForPurpose(purpose)
    if (recommended.length > 0) {
      handleAlignToDirection(recommended[0])
    }
  }

  // 添加鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!compassRef.current) return
        const rect = compassRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI
        setRotation(angle - startAngle)
      }

      const handleGlobalMouseUp = () => {
        setIsDragging(false)
      }

      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove)
        window.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging, startAngle])

  return (
    <div className="fengshui-compass">
      <div className="compass-header">
        <h2>🧭 风水罗盘</h2>
        <p className="compass-subtitle">探索方位吉凶，把握风水运势</p>
      </div>

      <div className="compass-container">
        <div className="compass-main">
          <div 
            ref={compassRef}
            className="compass-disk"
            style={{ transform: `rotate(${rotation}deg)` }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* 中心点 */}
            <div className="compass-center">
              <div className="compass-center-dot"></div>
              <div className="compass-center-line"></div>
            </div>

            {/* 方位标记 */}
            {directions.map((dir, index) => {
              const angle = dir.angle
              const isAuspicious = todayDirections.auspicious.includes(dir.name)
              const isInauspicious = todayDirections.inauspicious.includes(dir.name)
              
              return (
                <div
                  key={index}
                  className={`compass-direction ${selectedDirection === dir.name ? 'selected' : ''} ${isAuspicious ? 'auspicious' : ''} ${isInauspicious ? 'inauspicious' : ''}`}
                  style={{
                    transform: `rotate(${angle + rotation}deg) translateY(-180px)`,
                    color: dir.color
                  }}
                  onClick={() => handleDirectionClick(dir.name)}
                >
                  <div className="direction-marker"></div>
                  <div 
                    className="direction-label"
                    style={{
                      transform: `rotate(${-rotation}deg) scale(1)`,
                      '--rotation': `-${rotation}deg`
                    } as React.CSSProperties & { '--rotation': string }}
                  >
                    <div className="direction-name">{dir.name}</div>
                    <div className="direction-symbol">{dir.symbol}</div>
                    <div className="direction-wuxing">{dir.wuxing}</div>
                  </div>
                </div>
              )
            })}

            {/* 八卦圆环 */}
            <div className="compass-bagua-ring">
              {directions.map((dir, index) => {
                const angle = dir.angle
                const gua = bagua[dir.symbol as keyof typeof bagua]
                return (
                  <div
                    key={index}
                    className="bagua-item"
                    style={{
                      transform: `rotate(${angle + rotation}deg) translateY(-140px)`
                    }}
                  >
                    <div 
                      className="bagua-symbol"
                      style={{
                        transform: `rotate(${-rotation}deg)`
                      }}
                    >
                      {gua?.name}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 刻度线 */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="compass-tick"
                style={{
                  transform: `rotate(${i * 15}deg)`,
                  height: i % 3 === 0 ? '20px' : '10px',
                  opacity: i % 3 === 0 ? 1 : 0.5
                }}
              />
            ))}
          </div>

          {/* 固定指针（指向正北） */}
          <div className="compass-pointer">
            <div className="pointer-north">N</div>
            <div className="pointer-arrow">↑</div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="compass-controls">
          <div className="control-section">
            <h3>快速选择</h3>
            <div className="direction-buttons">
              {directions.map((dir) => (
                <button
                  key={dir.name}
                  className={`direction-btn ${selectedDirection === dir.name ? 'active' : ''} ${todayDirections.auspicious.includes(dir.name) ? 'auspicious' : ''} ${todayDirections.inauspicious.includes(dir.name) ? 'inauspicious' : ''}`}
                  onClick={() => handleAlignToDirection(dir.name)}
                  style={{ borderColor: dir.color }}
                >
                  {dir.name}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>用途推荐</h3>
            <div className="purpose-buttons">
              {['事业', '财运', '学业', '健康', '感情', '搬家', '开业', '出行'].map((purpose) => (
                <button
                  key={purpose}
                  className={`purpose-btn ${selectedPurpose === purpose ? 'active' : ''}`}
                  onClick={() => handlePurposeSelect(purpose)}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <button className="reset-btn" onClick={handleReset}>
              🔄 重置罗盘
            </button>
          </div>
        </div>
      </div>

      {/* 今日吉凶方位 */}
      <div className="today-directions">
        <h3>📅 今日方位吉凶</h3>
        <div className="direction-status">
          <div className="status-group">
            <span className="status-label auspicious">吉方：</span>
            <span>{todayDirections.auspicious.join('、') || '无'}</span>
          </div>
          <div className="status-group">
            <span className="status-label inauspicious">凶方：</span>
            <span>{todayDirections.inauspicious.join('、') || '无'}</span>
          </div>
          <div className="status-group">
            <span className="status-label neutral">平方：</span>
            <span>{todayDirections.neutral.join('、') || '无'}</span>
          </div>
        </div>
      </div>

      {/* 方位详情 */}
      {interpretation && (
        <div className="direction-detail">
          <h3>📍 {interpretation.direction}方位详情</h3>
          <div className="detail-content">
            <div className="detail-row">
              <span className="detail-label">八卦：</span>
              <span className="detail-value">{interpretation.symbol}卦 ({interpretation.guaInfo?.nature})</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">五行：</span>
              <span className="detail-value" style={{ color: interpretation.color }}>
                {interpretation.wuxing}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">含义：</span>
              <span className="detail-value">{interpretation.guaInfo?.meaning}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">吉凶：</span>
              <span className={`detail-value ${interpretation.auspicious ? 'auspicious' : interpretation.inauspicious ? 'inauspicious' : 'neutral'}`}>
                {interpretation.auspicious ? '吉' : interpretation.inauspicious ? '凶' : '平'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">适合：</span>
              <span className="detail-value">{interpretation.suitableFor.join('、')}</span>
            </div>
            <div className="detail-advice">
              <p>{interpretation.advice}</p>
            </div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="compass-instructions">
        <h3>💡 使用说明</h3>
        <ul>
          <li>拖动罗盘可以旋转，查看不同方位</li>
          <li>点击方位标记或快速选择按钮，查看详细解析</li>
          <li>根据用途选择，系统会推荐合适的方位</li>
          <li>今日吉凶方位会根据日期自动计算</li>
          <li>红色标记表示吉方，橙色标记表示凶方</li>
        </ul>
      </div>
    </div>
  )
}

export default FengshuiCompass

