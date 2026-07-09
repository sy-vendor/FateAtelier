type LogoSize = 'sm' | 'md' | 'lg'
const SIZE_MAP: Record<LogoSize, number> = { sm: 18, md: 24, lg: 32 }

export function ShengxiaoLogoMark({ size = 'md', className = '' }: { size?: LogoSize; className?: string }) {
  const px = SIZE_MAP[size]
  return (
    <svg className={`tools-logo-mark ${className}`.trim()} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="11" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <circle cx="21" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M14 12 Q11 8 8 10" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <path d="M24 16 Q27 12 29 14" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" opacity="0.7" />
      <circle cx="23" cy="16" r="0.8" fill="currentColor" opacity="0.7" />
      <path d="M13 20 Q16 24 16 26" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <path d="M19 22 Q16 26 16 28" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
    </svg>
  )
}
