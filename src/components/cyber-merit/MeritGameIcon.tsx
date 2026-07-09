import type { MeritGameType } from '../../utils/cyberMeritData'
import { MERIT_GAME_ART } from '../../utils/cyberMeritAssets'

export { ReleaseCreatureIcon } from './ReleaseCreatureIcon'

type IconSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<IconSize, number> = {
  sm: 22,
  md: 28,
  lg: 36,
}

interface MeritGameIconProps {
  game: MeritGameType
  size?: IconSize
  className?: string
}

/** 修行法门图标 · 木鱼线稿 + Twemoji 彩色图 */
export function MeritGameIcon({ game, size = 'md', className = '' }: MeritGameIconProps) {
  const px = SIZE_MAP[size]
  const art = MERIT_GAME_ART[game]

  if (art) {
    return (
      <img
        className={`cm-game-img ${className}`.trim()}
        src={art}
        alt=""
        width={px}
        height={px}
        draggable={false}
      />
    )
  }

  const cls = `cm-game-icon ${className}`.trim()

  return (
    <svg className={cls} width={px} height={px} viewBox="0 0 32 32" aria-hidden>
      <ellipse cx="16" cy="18" rx="9" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.85" />
      <path d="M9 18 Q16 15 23 18" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      <line x1="21" y1="9" x2="17" y2="16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="21" cy="8" r="1.8" fill="currentColor" />
    </svg>
  )
}
