type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface FengshuiLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 风水罗盘 · 原创标识 — 罗盘针 + 八卦环 */
export function FengshuiLogoMark({ size = 'md', className = '' }: FengshuiLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `fengshui-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M16 6 L17.5 15 L16 13 L14.5 15 Z" fill="currentColor" opacity="0.9" />
      <path d="M16 26 L14.5 17 L16 19 L17.5 17 Z" fill="currentColor" opacity="0.45" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" opacity="0.85" />
      <line x1="16" y1="4" x2="16" y2="7" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <line x1="16" y1="25" x2="16" y2="28" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <line x1="4" y1="16" x2="7" y2="16" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <line x1="25" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    </svg>
  )
}
