import type { ReleaseCreatureId } from '../../utils/cyberMeritData'
import { RELEASE_CREATURE_ART } from '../../utils/cyberMeritAssets'

type IconSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_MAP: Record<IconSize, number> = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 56,
}

interface ReleaseCreatureIconProps {
  creature: ReleaseCreatureId
  size?: IconSize
  className?: string
  animated?: boolean
}

/** 放生生灵 · Twemoji 彩色图（本地资源） */
export function ReleaseCreatureIcon({
  creature,
  size = 'lg',
  className = '',
  animated = true,
}: ReleaseCreatureIconProps) {
  const px = SIZE_MAP[size]
  const cls = [
    'cm-creature-img',
    `cm-creature-img--${creature}`,
    animated ? 'cm-creature-img--idle' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <img
      className={cls}
      src={RELEASE_CREATURE_ART[creature]}
      alt=""
      width={px}
      height={px}
      draggable={false}
    />
  )
}
