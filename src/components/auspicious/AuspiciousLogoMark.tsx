type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface AuspiciousLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 择日吉时 · 原创标识 — 日晷 + 吉字纹 */
export function AuspiciousLogoMark({ size = 'md', className = '' }: AuspiciousLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `auspicious-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" opacity="0.85" />
      <line x1="16" y1="16" x2="16" y2="7" stroke="currentColor" strokeWidth="1" opacity="0.9" />
      <line x1="16" y1="16" x2="22" y2="19" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <path
        d="M10 22 Q16 26 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.35"
      />
      <text x="16" y="28" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.7">
        吉
      </text>
    </svg>
  )
}
