type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface LuckyColorLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 每日幸运色 · 原创标识 — 色轮环 + 中心光点 */
export function LuckyColorLogoMark({ size = 'md', className = '' }: LuckyColorLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `lucky-color-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="0.85" opacity="0.35" />
      {[
        '#FF6B6B',
        '#FFB347',
        '#FFE066',
        '#69DB7C',
        '#4DABF7',
        '#9775FA',
        '#F783AC',
      ].map((fill, i) => {
        const start = (i * 51.4 - 90) * (Math.PI / 180)
        const end = ((i + 1) * 51.4 - 90) * (Math.PI / 180)
        const x1 = 16 + 10 * Math.cos(start)
        const y1 = 16 + 10 * Math.sin(start)
        const x2 = 16 + 10 * Math.cos(end)
        const y2 = 16 + 10 * Math.sin(end)
        return (
          <path
            key={fill}
            d={`M16 16 L${x1} ${y1} A10 10 0 0 1 ${x2} ${y2} Z`}
            fill={fill}
            opacity="0.85"
          />
        )
      })}
      <circle cx="16" cy="16" r="4.5" fill="var(--ds-bg-elevated, #12121a)" stroke="currentColor" strokeWidth="0.7" opacity="0.9" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" opacity="0.9" />
    </svg>
  )
}
