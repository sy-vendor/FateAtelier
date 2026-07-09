type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface AlmanacLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 今日黄历 · 原创标识 — 日晷环 + 卷轴纹 */
export function AlmanacLogoMark({ size = 'md', className = '' }: AlmanacLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `almanac-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <rect
        x="4"
        y="6"
        width="24"
        height="20"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.85"
        opacity="0.3"
      />
      <path
        d="M6 9 H26 M6 12 H22 M6 15 H24 M6 18 H20"
        stroke="currentColor"
        strokeWidth="0.55"
        opacity="0.22"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
      {Array.from({ length: 12 }, (_, i) => {
        const deg = (i * 30 - 90) * (Math.PI / 180)
        const x1 = 16 + 5.5 * Math.cos(deg)
        const y1 = 16 + 5.5 * Math.sin(deg)
        const x2 = 16 + 7 * Math.cos(deg)
        const y2 = 16 + 7 * Math.sin(deg)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={i % 3 === 0 ? 0.75 : 0.45}
            opacity={i % 3 === 0 ? 0.65 : 0.35}
          />
        )
      })}
      <line x1="16" y1="16" x2="16" y2="10.5" stroke="currentColor" strokeWidth="1" opacity="0.85" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" />
      <circle cx="16" cy="10.5" r="1" fill="currentColor" opacity="0.75" />
    </svg>
  )
}
