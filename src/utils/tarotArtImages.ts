import type { TarotCard } from '../data/tarotCards'

/** 公版 Rider-Waite-Smith · @cometpisces/tarot-kit-images (PD) */
const MAJOR_FILES = [
  '00-TheFool.png',
  '01-TheMagician.png',
  '02-TheHighPriestess.png',
  '03-TheEmpress.png',
  '04-TheEmperor.png',
  '05-TheHierophant.png',
  '06-TheLovers.png',
  '07-TheChariot.png',
  '08-Strength.png',
  '09-TheHermit.png',
  '10-WheelOfFortune.png',
  '11-Justice.png',
  '12-TheHangedMan.png',
  '13-Death.png',
  '14-Temperance.png',
  '15-TheDevil.png',
  '16-TheTower.png',
  '17-TheStar.png',
  '18-TheMoon.png',
  '19-TheSun.png',
  '20-Judgement.png',
  '21-TheWorld.png',
] as const

const SUIT_PREFIX = {
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  pentacles: 'Pentacles',
} as const

const SUIT_START = {
  wands: 22,
  cups: 36,
  swords: 50,
  pentacles: 64,
} as const

const imageModules = import.meta.glob<string>(
  '../../node_modules/@cometpisces/tarot-kit-images/images/*.png',
  { eager: true, import: 'default' }
)

const byFilename: Record<string, string> = {}
for (const [path, url] of Object.entries(imageModules)) {
  const name = path.split('/').pop()
  if (name) byFilename[name] = url
}

const FALLBACK = byFilename['00-TheFool.png'] ?? ''

export function getTarotArtImage(card: TarotCard): string {
  if (card.type === 'major') {
    const file = MAJOR_FILES[card.id]
    return (file && byFilename[file]) || FALLBACK
  }

  const suit = card.suit
  if (!suit) return FALLBACK

  const idx = card.id - SUIT_START[suit] + 1
  const file = `${SUIT_PREFIX[suit]}${String(idx).padStart(2, '0')}.png`
  return byFilename[file] ?? FALLBACK
}
