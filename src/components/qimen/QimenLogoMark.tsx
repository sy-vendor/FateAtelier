type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface QimenLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 奇门遁甲 · 原创标识 — 九宫 + 罗盘针 */
export function QimenLogoMark({ size = 'md', className = '' }: QimenLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `qimen-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <rect
        x="5"
        y="5"
        width="22"
        height="22"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <line x1="16" y1="5" x2="16" y2="27" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="8" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      <line x1="24" y1="8" x2="8" y2="24" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.3" />
      <path
        d="M16 9 L17.5 15 L16 13.5 L14.5 15 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M16 23 L14.5 17 L16 18.5 L17.5 17 Z"
        fill="currentColor"
        opacity="0.45"
      />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" opacity="0.85" />
    </svg>
  )
}
