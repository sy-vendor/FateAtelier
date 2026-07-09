type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface HoroscopeLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 星座运势 · 原创标识 — 星轨十二宫环 + 北极星 */
export function HoroscopeLogoMark({ size = 'md', className = '' }: HoroscopeLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `horoscope-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="0.85" opacity="0.35" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="0.55" opacity="0.22" />
      {Array.from({ length: 12 }, (_, i) => {
        const deg = (i * 30 - 90) * (Math.PI / 180)
        const x = 16 + 11 * Math.cos(deg)
        const y = 16 + 11 * Math.sin(deg)
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 1.1 : 0.65}
            fill="currentColor"
            opacity={i % 3 === 0 ? 0.75 : 0.45}
          />
        )
      })}
      <path
        d="M16 7.5 L17.1 11.8 L21.5 12 L18 14.4 L19.1 18.6 L16 16.2 L12.9 18.6 L14 14.4 L10.5 12 L14.9 11.8 Z"
        fill="currentColor"
      />
      <circle cx="16" cy="16" r="1.4" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
