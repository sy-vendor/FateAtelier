type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface CyberMeritLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 赛博积德 · 原创标识 — 木鱼 + 功德光晕 */
export function CyberMeritLogoMark({ size = 'md', className = '' }: CyberMeritLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `cm-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <ellipse cx="16" cy="18" rx="10" ry="6" fill="currentColor" opacity="0.25" />
      <ellipse cx="16" cy="17" rx="8" ry="5" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
      <path
        d="M10 17 Q16 14 22 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.4"
      />
      <line x1="22" y1="8" x2="18" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.85" />
      <circle cx="22" cy="7" r="2" fill="currentColor" opacity="0.9" />
      <circle cx="16" cy="10" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="12" cy="8" r="0.8" fill="currentColor" opacity="0.35" />
      <circle cx="20" cy="11" r="0.6" fill="currentColor" opacity="0.3" />
    </svg>
  )
}
