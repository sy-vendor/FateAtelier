type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface NumberEnergyLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 数字能量 · 原创标识 — 数脉波纹 */
export function NumberEnergyLogoMark({ size = 'md', className = '' }: NumberEnergyLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `number-energy-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
      <circle cx="16" cy="16" r="7" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.85" />
      <text x="16" y="18" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor" opacity="0.9">
        8
      </text>
      <path
        d="M6 16 Q10 12 16 16 T26 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.4"
      />
      <path
        d="M6 20 Q12 16 16 20 T26 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  )
}
