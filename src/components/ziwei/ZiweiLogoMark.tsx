type LogoSize = 'sm' | 'md' | 'lg'
const SIZE_MAP: Record<LogoSize, number> = { sm: 18, md: 24, lg: 32 }

export function ZiweiLogoMark({ size = 'md', className = '' }: { size?: LogoSize; className?: string }) {
  const px = SIZE_MAP[size]
  return (
    <svg className={`tools-logo-mark ${className}`.trim()} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.9" />
      <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="16" y1="5" x2="16" y2="9" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
      <line x1="16" y1="23" x2="16" y2="27" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="5" y1="16" x2="9" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="23" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <circle cx="16" cy="5" r="1.2" fill="currentColor" opacity="0.85" />
      <circle cx="27" cy="16" r="0.8" fill="currentColor" opacity="0.6" />
      <circle cx="16" cy="27" r="0.8" fill="currentColor" opacity="0.5" />
      <circle cx="5" cy="16" r="0.8" fill="currentColor" opacity="0.5" />
    </svg>
  )
}
