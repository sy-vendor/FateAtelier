import { useState, useEffect, useRef } from 'react'
import './CyberMerit.css'
import muyuSound from '../video/muyu-2.mp3?url'
import { logger } from '../utils/logger'
import { getStorageItem, setStorageItem } from '../utils/storage'

type GameType = 'woodfish' | 'release' | 'incense' | 'prayer'

interface FloatingText {
  id: number
  text: string
  x: number
  y: number
  type: 'merit' | 'message' | 'milestone'
}

function CyberMerit() {
  const [activeGame, setActiveGame] = useState<GameType>('woodfish')
  const [woodfishCount, setWoodfishCount] = useState(0)
  const [releaseCount, setReleaseCount] = useState(0)
  const [incenseCount, setIncenseCount] = useState(0)
  const [prayerCount, setPrayerCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [isKnocking, setIsKnocking] = useState(false)
  const [releasingAnimal, setReleasingAnimal] = useState<{index: number, centerX: number, centerY: number, clickX: number, clickY: number, needFlip?: boolean} | null>(null)
  const [isBurning, setIsBurning] = useState(false)
  const [isPraying, setIsPraying] = useState(false)
  const woodfishAudioRef = useRef<HTMLAudioElement | null>(null)

  // 初始化音频
  useEffect(() => {
    woodfishAudioRef.current = new Audio(muyuSound)
    woodfishAudioRef.current.preload = 'auto'
    return () => {
      if (woodfishAudioRef.current) {
        woodfishAudioRef.current.pause()
        woodfishAudioRef.current = null
      }
    }
  }, [])

  // 从localStorage加载数据
  useEffect(() => {
    const woodfishResult = getStorageItem<number>('cyber-woodfish-count', 0)
    if (woodfishResult.success && woodfishResult.data) {
      setWoodfishCount(woodfishResult.data)
    }
    
    const releaseResult = getStorageItem<number>('cyber-release-count', 0)
    if (releaseResult.success && releaseResult.data) {
      setReleaseCount(releaseResult.data)
    }
    
    const incenseResult = getStorageItem<number>('cyber-incense-count', 0)
    if (incenseResult.success && incenseResult.data) {
      setIncenseCount(incenseResult.data)
    }
    
    const prayerResult = getStorageItem<number>('cyber-prayer-count', 0)
    if (prayerResult.success && prayerResult.data) {
      setPrayerCount(prayerResult.data)
    }
  }, [])

  // 保存数据到localStorage
  const saveCount = (type: GameType, count: number) => {
    setStorageItem(`cyber-${type}-count`, count)
  }

  // 添加浮动文字
  const addFloatingText = (text: string, x: number, y: number, type: 'merit' | 'message' | 'milestone' = 'merit') => {
    const id = Date.now() + Math.random()
    setFloatingTexts(prev => [...prev, { id, text, x, y, type }])
    
    // 3秒后自动移除
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  // 获取随机鼓励语句
  const getRandomMessage = (type: GameType, _count: number): string => {
    const messages: { [key: string]: string[] } = {
      woodfish: [
        '南无阿弥陀佛',
        '功德无量',
        '心诚则灵',
        '善哉善哉',
        '功德+1',
        '福报满满',
        '心静自然凉',
        '一念清净',
        '功德圆满',
        '善念长存'
      ],
      release: [
        '放生功德无量',
        '慈悲为怀',
        '功德+3',
        '善行善报',
        '生命可贵',
        '慈悲心起',
        '功德圆满',
        '善念长存',
        '福报满满',
        '功德无量'
      ],
      incense: [
        '香火袅袅',
        '心诚则灵',
        '功德+2',
        '福报满满',
        '香火不断',
        '虔诚祈福',
        '功德圆满',
        '善念长存',
        '功德无量',
        '心诚则灵'
      ],
      prayer: [
        '祈福成功',
        '心诚则灵',
        '功德+5',
        '福报满满',
        '虔诚祈福',
        '功德圆满',
        '善念长存',
        '功德无量',
        '心想事成',
        '福星高照'
      ]
    }
    
    const pool = messages[type] || messages.woodfish
    return pool[Math.floor(Math.random() * pool.length)]
  }

  // 检查里程碑
  const checkMilestone = (type: GameType, count: number) => {
    const milestones = [10, 50, 100, 200, 500, 1000, 2000, 5000]
    if (milestones.includes(count)) {
      const messages: { [key: string]: string } = {
        woodfish: `🎉 恭喜！已敲木鱼 ${count} 次，功德无量！`,
        release: `🎉 恭喜！已放生 ${count} 次，慈悲为怀！`,
        incense: `🎉 恭喜！已上香 ${count} 次，香火不断！`,
        prayer: `🎉 恭喜！已祈福 ${count} 次，福报满满！`
      }
      return messages[type] || `🎉 恭喜达成 ${count} 次成就！`
    }
    return null
  }

  // 播放音效（使用Web Audio API生成简单音效）
  const playSound = (frequency: number, duration: number = 100, type: 'woodfish' | 'release' | 'incense' | 'prayer' = 'woodfish') => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      if (type === 'woodfish') {
        // 木鱼声音：使用多个频率叠加，模拟木鱼的共鸣效果
        const baseFreq = 80 // 基频更低
        const overtones = [baseFreq, baseFreq * 2, baseFreq * 3] // 基频和泛音
        
        overtones.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = freq
          oscillator.type = index === 0 ? 'square' : 'sine' // 基频用方波，泛音用正弦波
          
          // 不同频率的音量不同，基频最响
          const volume = index === 0 ? 0.3 : (index === 1 ? 0.15 : 0.08)
          
          // 快速衰减，模拟木鱼的短促敲击声
          gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08) // 80ms快速衰减
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.12) // 120ms总时长
        })
      } else {
        // 其他音效保持原样
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration / 1000)
      }
    } catch (e) {
      logger.warn('音频播放失败', e)
    }
  }

  // 敲电子木鱼
  const knockWoodfish = (event?: React.MouseEvent) => {
    const x = event ? event.clientX : window.innerWidth / 2
    const y = event ? event.clientY : window.innerHeight / 2
    
    // 触发敲击动画
    setIsKnocking(true)
    setTimeout(() => setIsKnocking(false), 200)
    
    setWoodfishCount(prev => {
      const newCount = prev + 1
      saveCount('woodfish', newCount)
      
      // 添加浮动文字
      const message = getRandomMessage('woodfish', newCount)
      addFloatingText(message, x, y, 'merit')
      setCurrentMessage(message)
      
      // 检查里程碑
      const milestone = checkMilestone('woodfish', newCount)
      if (milestone) {
        setTimeout(() => {
          addFloatingText(milestone, window.innerWidth / 2, window.innerHeight / 2, 'milestone')
          setCurrentMessage(milestone)
        }, 100)
      }
      
      return newCount
    })
    
    // 播放木鱼音频
    if (woodfishAudioRef.current) {
      woodfishAudioRef.current.currentTime = 0 // 从头开始播放
      woodfishAudioRef.current.play().catch(e => {
        logger.warn('音频播放失败', e)
      })
    }
  }

  // 赛博放生
  const releaseLife = (event?: React.MouseEvent, animalIndex?: number) => {
    const x = event ? event.clientX : window.innerWidth / 2
    const y = event ? event.clientY : window.innerHeight / 2
    
    // 触发放生动画
    if (animalIndex !== undefined && event) {
      const rect = event.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      // 计算从动物中心到点击位置的方向
      const offsetX = x - centerX
      
      const animals = ['🐟', '🐠', '🐢', '🕊️', '🦋', '🦎']
      const animal = animals[animalIndex]
      
      // 生成屏幕中间区域的随机位置作为起点（避免出现在边缘看不到）
      const marginX = window.innerWidth * 0.4 // 左右各留40%边距
      const marginY = window.innerHeight * 0.4 // 上下各留40%边距
      const randomX = marginX + Math.random() * (window.innerWidth - marginX * 2)
      const randomY = marginY + Math.random() * (window.innerHeight - marginY * 2)
      
      let moveX = 0
      let moveY = 0
      
      // 根据动物类型决定移动方向
      if (animal === '🐟' || animal === '🐠') {
        // 鱼：往前游（水平方向，根据点击位置决定方向）
        const directionX = offsetX > 0 ? 1 : -1
        moveX = directionX * 800
        moveY = -50 // 稍微向上
      } else if (animal === '🕊️' || animal === '🦋') {
        // 鸟/蝴蝶：往天上飞（向上）
        moveX = offsetX * 0.3 // 稍微水平偏移
        moveY = -600 // 向上飞
      } else {
        // 其他（🐢、🦎）：往前走（水平方向，稍微向上）
        const directionX = offsetX > 0 ? 1 : -1
        moveX = directionX * 700
        moveY = -100 // 稍微向上
      }
      
      // 判断是否需要翻转（鱼面向左，向右游时需要翻转）
      const needFlip = (animal === '🐟' || animal === '🐠') && moveX > 0
      
      setReleasingAnimal({ 
        index: animalIndex, 
        centerX: randomX, // 从屏幕随机位置开始
        centerY: randomY, // 从屏幕随机位置开始
        clickX: moveX, // 移动距离
        clickY: moveY, // 移动距离
        needFlip: needFlip // 是否需要翻转
      })
      setTimeout(() => setReleasingAnimal(null), 2000)
    }
    
    setReleaseCount(prev => {
      const newCount = prev + 1
      saveCount('release', newCount)
      
      // 添加浮动文字
      const message = getRandomMessage('release', newCount)
      addFloatingText('功德+3', x, y, 'merit')
      setTimeout(() => {
        addFloatingText(message, x + 20, y - 20, 'message')
      }, 100)
      setCurrentMessage(message)
      
      // 检查里程碑
      const milestone = checkMilestone('release', newCount)
      if (milestone) {
        setTimeout(() => {
          addFloatingText(milestone, window.innerWidth / 2, window.innerHeight / 2, 'milestone')
          setCurrentMessage(milestone)
        }, 200)
      }
      
      return newCount
    })
    playSound(400, 200, 'release') // 清脆的放生音效
  }

  // 赛博上香
  const burnIncense = (event?: React.MouseEvent) => {
    const x = event ? event.clientX : window.innerWidth / 2
    const y = event ? event.clientY : window.innerHeight / 2
    
    // 如果正在燃烧，不重复触发
    if (isBurning) return
    
    // 开始燃烧动画
    setIsBurning(true)
    
    setIncenseCount(prev => {
      const newCount = prev + 1
      saveCount('incense', newCount)
      
      // 添加浮动文字
      const message = getRandomMessage('incense', newCount)
      addFloatingText('功德+2', x, y, 'merit')
      setTimeout(() => {
        addFloatingText(message, x + 20, y - 20, 'message')
      }, 100)
      setCurrentMessage(message)
      
      // 检查里程碑
      const milestone = checkMilestone('incense', newCount)
      if (milestone) {
        setTimeout(() => {
          addFloatingText(milestone, window.innerWidth / 2, window.innerHeight / 2, 'milestone')
          setCurrentMessage(milestone)
        }, 200)
      }
      
      return newCount
    })
    playSound(300, 250, 'incense') // 悠扬的香火音效
    
    // 10秒后燃烧完成
    setTimeout(() => {
      setIsBurning(false)
    }, 10000)
  }

  // 赛博祈福
  const pray = (event?: React.MouseEvent) => {
    const x = event ? event.clientX : window.innerWidth / 2
    const y = event ? event.clientY : window.innerHeight / 2
    
    // 如果正在祈福，不重复触发
    if (isPraying) return
    
    // 开始祈福动画
    setIsPraying(true)
    
    setPrayerCount(prev => {
      const newCount = prev + 1
      saveCount('prayer', newCount)
      
      // 添加浮动文字
      const message = getRandomMessage('prayer', newCount)
      addFloatingText('功德+5', x, y, 'merit')
      setTimeout(() => {
        addFloatingText(message, x + 20, y - 20, 'message')
      }, 100)
      setCurrentMessage(message)
      
      // 检查里程碑
      const milestone = checkMilestone('prayer', newCount)
      if (milestone) {
        setTimeout(() => {
          addFloatingText(milestone, window.innerWidth / 2, window.innerHeight / 2, 'milestone')
          setCurrentMessage(milestone)
        }, 200)
      }
      
      return newCount
    })
    playSound(250, 300, 'prayer') // 庄重的祈福音效
    
    // 3秒后祈福完成
    setTimeout(() => {
      setIsPraying(false)
    }, 3000)
  }

  // 自动敲木鱼
  const toggleAutoWoodfish = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (isPlaying && activeGame === 'woodfish') {
      const interval = setInterval(() => {
        knockWoodfish()
      }, 500) // 每0.5秒敲一次
      return () => clearInterval(interval)
    }
  }, [isPlaying, activeGame])

  // 清除过期的消息
  useEffect(() => {
    if (currentMessage) {
      const timer = setTimeout(() => {
        setCurrentMessage('')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentMessage])

  const getTotalMerit = () => {
    return woodfishCount + releaseCount * 3 + incenseCount * 2 + prayerCount * 5
  }

  const getGameTitle = (type: GameType) => {
    switch (type) {
      case 'woodfish': return '敲电子木鱼'
      case 'release': return '赛博放生'
      case 'incense': return '赛博上香'
      case 'prayer': return '赛博祈福'
    }
  }

  const getGameDescription = (type: GameType) => {
    switch (type) {
      case 'woodfish': return '点击木鱼，积累功德。可开启自动模式。'
      case 'release': return '点击放生，每放生一次积累3点功德。'
      case 'incense': return '点击上香，每上香一次积累2点功德。'
      case 'prayer': return '点击祈福，每次祈福积累5点功德。'
    }
  }

  return (
    <div className="cyber-merit">
      <div className="cyber-merit-header">
        <h2>🙏 赛博积德</h2>
      </div>

      <div className="merit-stats">
        <div className="stat-card">
          <div className="stat-label">总功德</div>
          <div className="stat-value">{getTotalMerit()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">木鱼次数</div>
          <div className="stat-value">{woodfishCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">放生次数</div>
          <div className="stat-value">{releaseCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">上香次数</div>
          <div className="stat-value">{incenseCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">祈福次数</div>
          <div className="stat-value">{prayerCount}</div>
        </div>
      </div>

      <div className="game-tabs">
        <button
          className={`tab-btn ${activeGame === 'woodfish' ? 'active' : ''}`}
          onClick={() => setActiveGame('woodfish')}
        >
          敲木鱼
        </button>
        <button
          className={`tab-btn ${activeGame === 'release' ? 'active' : ''}`}
          onClick={() => setActiveGame('release')}
        >
          放生
        </button>
        <button
          className={`tab-btn ${activeGame === 'incense' ? 'active' : ''}`}
          onClick={() => setActiveGame('incense')}
        >
          上香
        </button>
        <button
          className={`tab-btn ${activeGame === 'prayer' ? 'active' : ''}`}
          onClick={() => setActiveGame('prayer')}
        >
          祈福
        </button>
      </div>

      <div className="game-content">
        <div className="game-info">
          <h3>{getGameTitle(activeGame)}</h3>
          <p>{getGameDescription(activeGame)}</p>
        </div>

        {activeGame === 'woodfish' && (
          <div className="woodfish-game">
            <div className="woodfish-container">
              <div 
                className={`woodfish ${isPlaying ? 'playing' : ''} ${isKnocking ? 'knocking' : ''}`}
                onClick={(e) => knockWoodfish(e)}
              >
                <div className="woodfish-body">
                  <div className="woodfish-top"></div>
                  <div className="woodfish-bottom"></div>
                  <div className="woodfish-mouth"></div>
                  <div className="woodfish-pattern"></div>
                </div>
                <div className={`woodfish-stick ${isKnocking ? 'striking' : ''}`}>
                  <div className="stick-head"></div>
                  <div className="stick-handle"></div>
                </div>
              </div>
            </div>
            {currentMessage && (
              <div className="current-message">{currentMessage}</div>
            )}
            <div className="woodfish-controls">
              <button
                className={`auto-btn ${isPlaying ? 'active' : ''}`}
                onClick={toggleAutoWoodfish}
              >
                {isPlaying ? '⏸️ 停止自动' : '▶️ 自动敲击'}
              </button>
            </div>
            <div className="woodfish-count">
              已敲 {woodfishCount} 次
            </div>
          </div>
        )}

        {activeGame === 'release' && (
          <div className="release-game">
            <div className="release-container">
              <div className="release-animals">
                {['🐟', '🐠', '🐢', '🕊️', '🦋', '🦎'].map((animal, index) => {
                  const isReleasing = releasingAnimal?.index === index
                  return (
                    <div
                      key={index}
                      className="release-animal"
                      onClick={(e) => releaseLife(e, index)}
                      style={{
                        animationDelay: `${index * 0.2}s`
                      }}
                    >
                      <span 
                        className={`animal-emoji ${isReleasing ? 'swimming' : ''}`}
                        style={isReleasing ? {
                          left: `${releasingAnimal.centerX}px`,
                          top: `${releasingAnimal.centerY}px`,
                          '--release-x': `${releasingAnimal.clickX}px`,
                          '--release-y': `${releasingAnimal.clickY}px`,
                          '--flip-scale': releasingAnimal.needFlip ? '-1' : '1'
                        } as React.CSSProperties : {}}
                      >
                        {animal}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            {currentMessage && (
              <div className="current-message">{currentMessage}</div>
            )}
            <div className="release-info">
              <p>点击任意小动物进行放生</p>
              <p className="merit-info">每次放生 +3 功德</p>
            </div>
          </div>
        )}

        {activeGame === 'incense' && (
          <div className="incense-game">
            <div className="incense-container">
              <div className="incense-burner" onClick={(e) => burnIncense(e)}>
                <div className={`incense-stick ${isBurning ? 'burning' : ''}`}>
                  <div className="stick-tip"></div>
                  <div className="stick-body">
                    <div className="burn-progress"></div>
                  </div>
                </div>
                <div className="censer">
                  <div className="censer-mouth"></div>
                  <div className="censer-body"></div>
                  <div className="censer-legs">
                    <div className="leg leg-1"></div>
                    <div className="leg leg-2"></div>
                    <div className="leg leg-3"></div>
                  </div>
                </div>
              </div>
            </div>
            {currentMessage && (
              <div className="current-message">{currentMessage}</div>
            )}
            <div className="incense-info">
              <p>点击香火进行上香</p>
              <p className="merit-info">每次上香 +2 功德</p>
            </div>
          </div>
        )}

        {activeGame === 'prayer' && (
          <div className="prayer-game">
            <div className="prayer-container">
              <div className={`prayer-icon ${isPraying ? 'praying' : ''}`} onClick={(e) => pray(e)}>
                🙏
              </div>
              <div className="prayer-lights">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`prayer-light ${isPraying ? 'active' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              {isPraying && (
                <div className="prayer-particles">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="prayer-particle" style={{ animationDelay: `${i * 0.15}s` }}></div>
                  ))}
                </div>
              )}
            </div>
            {currentMessage && (
              <div className="current-message">{currentMessage}</div>
            )}
            <div className="prayer-info">
              <p>点击双手进行祈福</p>
              <p className="merit-info">每次祈福 +5 功德</p>
            </div>
          </div>
        )}
      </div>

      {/* 浮动文字显示 */}
      {floatingTexts.map((text) => (
        <div
          key={text.id}
          className={`floating-text ${text.type}`}
          style={{
            left: `${text.x}px`,
            top: `${text.y}px`,
          }}
        >
          {text.text}
        </div>
      ))}
    </div>
  )
}

export default CyberMerit

