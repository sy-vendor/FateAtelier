import { useState, useEffect, useRef } from 'react'
import './SnowEffect.css'

interface Snowflake {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  rotation: number
  rotationSpeed: number
}

interface ClickEffect {
  id: number
  x: number
  y: number
  type: 'sparkle' | 'text' | 'particle'
  text?: string
}

interface SnowEffectProps {
  enabled?: boolean
  intensity?: 'light' | 'medium' | 'heavy'
}

const SURPRISE_MESSAGES = [
  '❄️ 雪花飘飘',
  '✨ 许个愿吧',
  '🌟 好运降临',
  '💫 心想事成',
  '🎁 惊喜礼物',
  '🎄 圣诞快乐',
  '🎊 新年快乐',
  '🌸 春暖花开',
  '☀️ 阳光明媚',
  '🌈 彩虹出现',
  '🦄 魔法时刻',
  '⭐ 愿望成真',
  '🎈 生日快乐',
  '🎉 恭喜发财',
  '💝 爱意满满',
]

function SnowEffect({ enabled = true, intensity = 'medium' }: SnowEffectProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  // 根据强度设置雪花数量
  const getSnowflakeCount = () => {
    switch (intensity) {
      case 'light':
        return 30
      case 'medium':
        return 50
      case 'heavy':
        return 80
      default:
        return 50
    }
  }

  // 初始化雪花
  useEffect(() => {
    if (!enabled) return

    const count = getSnowflakeCount()
    const newSnowflakes: Snowflake[] = []

    for (let i = 0; i < count; i++) {
      newSnowflakes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -100, // 从上方开始
        size: Math.random() * 12 + 8, // 8-20px，增大尺寸
        speed: Math.random() * 0.5 + 0.2, // 0.2-0.7px/frame，减慢速度
        opacity: Math.random() * 0.5 + 0.5, // 0.5-1
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5, // -0.25 到 0.25 度/frame，减慢旋转
      })
    }

    setSnowflakes(newSnowflakes)
  }, [enabled, intensity])

  // 动画循环 - 使用时间戳确保恒定速度
  useEffect(() => {
    if (!enabled || snowflakes.length === 0) return

    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // 限制帧率，避免过快更新
      const frameTime = Math.min(deltaTime, 16.67) // 约60fps

      setSnowflakes((prev) =>
        prev.map((flake) => {
          // 基于时间的速度，确保恒定
          const speedPerMs = flake.speed / 16.67 // 将每帧速度转换为每毫秒速度
          const distance = speedPerMs * frameTime
          
          let newY = flake.y + distance
          let newX = flake.x + Math.sin(flake.y * 0.01) * 0.3 // 轻微左右摆动

          // 如果雪花落到底部，重新从顶部开始
          if (newY > 100) {
            newY = -10
            newX = Math.random() * 100
          }

          // 基于时间的旋转
          const rotationPerMs = flake.rotationSpeed / 16.67
          const rotationDelta = rotationPerMs * frameTime

          return {
            ...flake,
            x: newX,
            y: newY,
            rotation: flake.rotation + rotationDelta,
          }
        })
      )

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled, snowflakes.length])

  // 处理点击雪花
  const handleSnowflakeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const effectId = Date.now()

    // 创建粒子爆炸效果
    const particles: ClickEffect[] = []
    for (let i = 0; i < 12; i++) {
      particles.push({
        id: effectId + i,
        x,
        y,
        type: 'particle',
      })
    }

    // 创建文字提示
    const message = SURPRISE_MESSAGES[Math.floor(Math.random() * SURPRISE_MESSAGES.length)]
    particles.push({
      id: effectId + 100,
      x,
      y,
      type: 'text',
      text: message,
    })

    // 创建闪烁效果
    for (let i = 0; i < 6; i++) {
      particles.push({
        id: effectId + 200 + i,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        type: 'sparkle',
      })
    }

    setClickEffects((prev) => [...prev, ...particles])

    // 清理效果
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id < effectId))
    }, 2000)
  }

  if (!enabled) return null

  return (
    <div
      ref={containerRef}
      className="snow-effect-container"
      onClick={handleSnowflakeClick}
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            transform: `translate(-50%, -50%) rotate(${flake.rotation}deg)`,
          }}
        >
          ❄️
        </div>
      ))}

      {/* 点击效果 */}
      {clickEffects.map((effect) => {
        if (effect.type === 'particle') {
          const angle = (Math.random() * 360 * Math.PI) / 180
          const distance = 30 + Math.random() * 40
          const offsetX = Math.cos(angle) * distance
          const offsetY = Math.sin(angle) * distance

          return (
            <div
              key={effect.id}
              className="click-particle"
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
                '--offset-x': `${offsetX}px`,
                '--offset-y': `${offsetY}px`,
              } as React.CSSProperties}
            />
          )
        }

        if (effect.type === 'sparkle') {
          return (
            <div
              key={effect.id}
              className="click-sparkle"
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
              }}
            >
              ✨
            </div>
          )
        }

        if (effect.type === 'text') {
          return (
            <div
              key={effect.id}
              className="click-text"
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
              }}
            >
              {effect.text}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default SnowEffect

