type LogoSize = 'sm' | 'md' | 'lg'
const SIZE_MAP: Record<LogoSize, number> = { sm: 18, md: 24, lg: 32 }

export function NameTestLogoMark({ size = 'md', className = '' }: { size?: LogoSize; className?: string }) {
  const px = SIZE_MAP[size]
  return (
    <svg className={`tools-logo-mark ${className}`.trim()} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <rect x="8" y="6" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
      <path d="M12 12 L20 12 M12 16 L18 16 M12 20 L16 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M22 8 L26 6 L24 10 Z" fill="currentColor" opacity="0.5" />
      <circle cx="11" cy="10" r="1" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
