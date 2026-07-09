type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface DreamLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 梦境解析 · 原创标识 — 月轮 + 梦雾 */
export function DreamLogoMark({ size = 'md', className = '' }: DreamLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `dream-logo-mark ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
      <path
        d="M20 8 A10 10 0 1 0 20 24 A7 7 0 1 1 20 8"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="22" cy="10" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="25" cy="14" r="0.7" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="18" r="0.5" fill="currentColor" opacity="0.35" />
      <path
        d="M6 22 Q10 20 14 22 Q18 24 22 22 Q26 20 28 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.35"
      />
      <path
        d="M4 26 Q9 24 14 26 Q19 28 24 26 Q27 25 30 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.25"
      />
    </svg>
  )
}
