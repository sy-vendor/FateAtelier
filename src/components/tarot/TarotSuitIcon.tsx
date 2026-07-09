export type SuitIconVariant = 'corner' | 'pip' | 'emblem'

interface TarotSuitIconProps {
  suit?: string
  variant?: SuitIconVariant
  className?: string
}

/**
 * 星穹秘典 · 原创四花色
 * 权杖=木杖  圣杯=高脚杯  宝剑=长剑  星币=圆币五角星
 */
export function TarotSuitIcon({ suit, variant = 'pip', className = '' }: TarotSuitIconProps) {
  if (!suit) return null
  const cls = `tarot-suit-icon tarot-suit-icon--${suit} tarot-suit-icon--${variant} ${className}`.trim()

  switch (suit) {
    case 'wands':
      return (
        <svg className={cls} viewBox="0 0 48 80" aria-hidden>
          {/* 杖身 — 细杆，底部仅略收圆 */}
          <path
            d="M22.5 74 C22.2 72.5 22.2 70.5 22.4 68 L23 20 C23.2 16 23.8 14 24 10
               C24.2 14 24.8 16 25 20 L25.6 68 C25.8 70.5 25.8 72.5 25.5 74 Z"
            fill="currentColor"
          />
          {/* 木纹 */}
          <path d="M23.2 24 L24.8 24" stroke="currentColor" strokeWidth="0.5" opacity="0.35" strokeLinecap="round" />
          <path d="M23 38 L25 38" stroke="currentColor" strokeWidth="0.5" opacity="0.28" strokeLinecap="round" />
          <path d="M23.2 52 L24.8 52" stroke="currentColor" strokeWidth="0.5" opacity="0.22" strokeLinecap="round" />
          {/* 嫩芽 */}
          <path
            d="M24 12 C20 9 17 12 20 15 M20 15 C17 14 16 17 19 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M24 12 C28 9 31 12 28 15 M28 15 C31 14 32 17 29 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <ellipse cx="24" cy="9" rx="1.2" ry="2" fill="currentColor" opacity="0.75" />
        </svg>
      )

    case 'cups':
      return (
        <svg className={cls} viewBox="0 0 56 64" aria-hidden>
          {/* 杯身 */}
          <path
            d="M8 18 C8 8 48 8 48 18 C48 28 28 32 28 32 C28 32 8 28 8 18 Z"
            fill="currentColor"
          />
          {/* 杯口高光 */}
          <path d="M10 16 Q28 22 46 16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          {/* 柄 */}
          <path d="M25 32 L25 48 L31 48 L31 32 Z" fill="currentColor" opacity="0.85" />
          {/* 底座 */}
          <ellipse cx="28" cy="54" rx="16" ry="4.5" fill="currentColor" />
        </svg>
      )

    case 'swords':
      return (
        <svg className={cls} viewBox="0 0 48 80" aria-hidden>
          {/* 剑刃 */}
          <path d="M24 4 L27 12 L26 58 L22 58 L21 12 Z" fill="currentColor" />
          {/* 剑尖 */}
          <path d="M24 4 L21 10 L27 10 Z" fill="currentColor" opacity="0.85" />
          {/* 护手 */}
          <path d="M14 56 L34 56 L32 62 L16 62 Z" fill="currentColor" />
          <path d="M12 58 L14 58 L14 60 L12 60 Z" fill="currentColor" opacity="0.8" />
          <path d="M36 58 L34 58 L34 60 L36 60 Z" fill="currentColor" opacity="0.8" />
          {/* 剑柄 */}
          <rect x="21" y="62" width="6" height="10" rx="1" fill="currentColor" opacity="0.9" />
          {/* 剑首圆球 */}
          <circle cx="24" cy="76" r="4" fill="currentColor" />
        </svg>
      )

    case 'pentacles':
      return (
        <svg className={cls} viewBox="0 0 56 56" aria-hidden>
          <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="28" cy="28" r="20" fill="currentColor" opacity="0.08" />
          <path
            d="M28 8 L31.5 20.5 L44.5 20.5 L34 28.5 L37.5 41 L28 33 L18.5 41 L22 28.5 L11.5 20.5 L24.5 20.5 Z"
            fill="currentColor"
          />
        </svg>
      )

    default:
      return null
  }
}
