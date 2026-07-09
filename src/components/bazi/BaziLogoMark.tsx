type LogoSize = 'sm' | 'md' | 'lg'
const SIZE_MAP: Record<LogoSize, number> = { sm: 18, md: 24, lg: 32 }

export function BaziLogoMark({ size = 'md', className = '' }: { size?: LogoSize; className?: string }) {
  const px = SIZE_MAP[size]
  return (
    <svg className={`tools-logo-mark ${className}`.trim()} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <path d="M16 4 A12 12 0 0 1 16 28 A8 8 0 0 0 16 4" fill="currentColor" opacity="0.85" />
      <path d="M16 4 A12 12 0 0 0 16 28 A8 8 0 0 1 16 4" fill="currentColor" opacity="0.35" />
      <line x1="8" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="16" y1="8" x2="16" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}
