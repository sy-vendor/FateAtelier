import type { TarotCard } from '../data/tarotCards'

/** 公版 Rider-Waite-Smith · compressed from @cometpisces/tarot-kit-images (PD) */
const MAJOR_FILES = [
  '00-TheFool.webp',
  '01-TheMagician.webp',
  '02-TheHighPriestess.webp',
  '03-TheEmpress.webp',
  '04-TheEmperor.webp',
  '05-TheHierophant.webp',
  '06-TheLovers.webp',
  '07-TheChariot.webp',
  '08-Strength.webp',
  '09-TheHermit.webp',
  '10-WheelOfFortune.webp',
  '11-Justice.webp',
  '12-TheHangedMan.webp',
  '13-Death.webp',
  '14-Temperance.webp',
  '15-TheDevil.webp',
  '16-TheTower.webp',
  '17-TheStar.webp',
  '18-TheMoon.webp',
  '19-TheSun.webp',
  '20-Judgement.webp',
  '21-TheWorld.webp',
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

const ART_BASE = '/tarot-art/'
const FALLBACK = `${ART_BASE}00-TheFool.webp`

export function getTarotArtImage(card: TarotCard): string {
  if (card.type === 'major') {
    const file = MAJOR_FILES[card.id]
    return file ? `${ART_BASE}${file}` : FALLBACK
  }

  const suit = card.suit
  if (!suit) return FALLBACK

  const idx = card.id - SUIT_START[suit] + 1
  const file = `${SUIT_PREFIX[suit]}${String(idx).padStart(2, '0')}.webp`
  return `${ART_BASE}${file}`
}
