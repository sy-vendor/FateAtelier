type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
}

interface TarotLogoMarkProps {
  size?: LogoSize
  className?: string
}

/** 塔罗占卜 · 原创标识 — 星穹秘典八芒星 + 牌框 */
export function TarotLogoMark({ size = 'md', className = '' }: TarotLogoMarkProps) {
  const px = SIZE_MAP[size]
  const cls = `tarot-logo-mark ${className}`.trim()

  return (
    <svg
      className={cls}
      width={px}
      height={px}
      viewBox="0 0 32 32"
      aria-hidden
    >
      <rect
        x="5"
        y="4"
        width="22"
        height="24"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.45"
      />
      <rect
        x="8"
        y="7"
        width="16"
        height="18"
        rx="2"
        fill="currentColor"
        opacity="0.06"
      />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="currentColor" strokeWidth="0.55" opacity="0.28" />
      <path
        d="M16 9.5 L17.4 14.2 L22.2 14.5 L18.4 17.4 L19.8 22 L16 19.2 L12.2 22 L13.6 17.4 L9.8 14.5 L14.6 14.2 Z"
        fill="currentColor"
      />
      <circle cx="16" cy="16" r="1.3" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

interface TarotSpreadIconProps {
  variant: 'single' | 'three'
  className?: string
}

/** 牌阵选择图标 */
export function TarotSpreadIcon({ variant, className = '' }: TarotSpreadIconProps) {
  const cls = `tarot-spread-icon ${className}`.trim()

  if (variant === 'single') {
    return (
      <svg className={cls} viewBox="0 0 40 48" width="40" height="48" aria-hidden>
        <rect x="8" y="4" width="24" height="36" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 14 L21.2 18 L25.5 18.3 L22.2 20.8 L23.5 25 L20 22.8 L16.5 25 L17.8 20.8 L14.5 18.3 L18.8 18 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <line x1="12" y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <line x1="14" y1="34" x2="26" y2="34" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      </svg>
    )
  }

  return (
    <svg className={cls} viewBox="0 0 56 48" width="56" height="48" aria-hidden>
      <rect x="2" y="10" width="18" height="28" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" transform="rotate(-12 11 24)" />
      <rect x="19" y="4" width="18" height="28" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="36" y="10" width="18" height="28" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" transform="rotate(12 45 24)" />
      <path
        d="M28 14 L29 17.5 L32.5 17.8 L29.8 19.8 L30.8 23 L28 21.2 L25.2 23 L26.2 19.8 L23.5 17.8 L27 17.5 Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  )
}
