type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface DivinationLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 抽签求签 · 原创标识 — 竹筒 + 灵签 */
export function DivinationLogoMark({ size = 'md', className = '' }: DivinationLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `divination-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <rect
        x="10"
        y="5"
        width="12"
        height="22"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect x="11" y="6" width="10" height="4" rx="1.5" fill="currentColor" opacity="0.25" />
      <rect x="11" y="22" width="10" height="4" rx="1.5" fill="currentColor" opacity="0.2" />
      <line x1="13" y1="12" x2="19" y2="8" stroke="currentColor" strokeWidth="0.9" opacity="0.85" />
      <line x1="13" y1="14" x2="19" y2="10" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
      <line x1="13" y1="16" x2="19" y2="12" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
      <circle cx="19" cy="8" r="1.1" fill="currentColor" opacity="0.9" />
      <path
        d="M6 18 Q4 20 6 24 Q8 26 10 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.35"
      />
      <path
        d="M26 18 Q28 20 26 24 Q24 26 22 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.35"
      />
    </svg>
  )
}
