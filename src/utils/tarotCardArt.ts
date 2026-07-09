import type { TarotCard } from '../data/tarotCards'
import { getMajorPalette } from './majorPalettes'

export const DECK_NAME = '星穹秘典'
export const DECK_NAME_EN = 'Celestial Codex'

export const MAJOR_ROMAN = [
  '0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
] as const

export interface SuitTheme {
  accent: string
  accentSoft: string
  glow: string
  label: string
}

const SUIT_THEMES: Record<string, SuitTheme> = {
  wands: {
    accent: '#d4a054',
    accentSoft: 'rgba(212, 160, 84, 0.18)',
    glow: 'rgba(212, 160, 84, 0.35)',
    label: '权杖',
  },
  cups: {
    accent: '#5eb8c9',
    accentSoft: 'rgba(94, 184, 201, 0.18)',
    glow: 'rgba(94, 184, 201, 0.35)',
    label: '圣杯',
  },
  swords: {
    accent: '#9aa8c4',
    accentSoft: 'rgba(154, 168, 196, 0.18)',
    glow: 'rgba(154, 168, 196, 0.35)',
    label: '宝剑',
  },
  pentacles: {
    accent: '#c9b07a',
    accentSoft: 'rgba(201, 176, 122, 0.18)',
    glow: 'rgba(201, 176, 122, 0.35)',
    label: '星币',
  },
}

const MAJOR_THEME: SuitTheme = {
  accent: '#b8abf8',
  accentSoft: 'rgba(184, 171, 248, 0.15)',
  glow: 'rgba(184, 171, 248, 0.4)',
  label: '大阿卡纳',
}

export function getCardTheme(card: TarotCard): SuitTheme {
  if (card.type === 'major') return getMajorTheme(card.id)
  return SUIT_THEMES[card.suit ?? ''] ?? MAJOR_THEME
}

/** Per-card palette for major arcana */
export function getMajorTheme(cardId: number): SuitTheme {
  const p = getMajorPalette(cardId)
  return {
    accent: p.accent,
    accentSoft: p.accentSoft,
    glow: p.glow,
    label: '大阿卡纳',
  }
}

export function getCardIndexLabel(card: TarotCard): string {
  if (card.type === 'major') return MAJOR_ROMAN[card.id] ?? String(card.id)
  if (card.number) {
    const romans = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
    return romans[card.number] ?? String(card.number)
  }
  const court = getCourtRank(card)
  if (court === 'page') return 'P'
  if (court === 'knight') return 'N'
  if (court === 'queen') return 'Q'
  if (court === 'king') return 'K'
  return ''
}

export function getCourtRank(card: TarotCard): 'page' | 'knight' | 'queen' | 'king' | null {
  if (card.type !== 'minor' || card.number) return null
  const en = card.nameEn.toLowerCase()
  if (en.includes('page')) return 'page'
  if (en.includes('knight')) return 'knight'
  if (en.includes('queen')) return 'queen'
  if (en.includes('king')) return 'king'
  return null
}

/** Pip positions as percentage x/y within the art frame */
export function getPipPositions(count: number): Array<{ x: number; y: number }> {
  const layouts: Record<number, Array<{ x: number; y: number }>> = {
    1: [{ x: 50, y: 50 }],
    2: [
      { x: 50, y: 28 },
      { x: 50, y: 72 },
    ],
    3: [
      { x: 50, y: 22 },
      { x: 50, y: 50 },
      { x: 50, y: 78 },
    ],
    4: [
      { x: 32, y: 30 },
      { x: 68, y: 30 },
      { x: 32, y: 70 },
      { x: 68, y: 70 },
    ],
    5: [
      { x: 32, y: 24 },
      { x: 68, y: 24 },
      { x: 50, y: 50 },
      { x: 32, y: 76 },
      { x: 68, y: 76 },
    ],
    6: [
      { x: 32, y: 26 },
      { x: 68, y: 26 },
      { x: 32, y: 50 },
      { x: 68, y: 50 },
      { x: 32, y: 74 },
      { x: 68, y: 74 },
    ],
    7: [
      { x: 50, y: 16 },
      { x: 32, y: 36 },
      { x: 68, y: 36 },
      { x: 50, y: 50 },
      { x: 32, y: 68 },
      { x: 68, y: 68 },
      { x: 50, y: 84 },
    ],
    8: [
      { x: 32, y: 18 },
      { x: 68, y: 18 },
      { x: 32, y: 38 },
      { x: 68, y: 38 },
      { x: 32, y: 62 },
      { x: 68, y: 62 },
      { x: 32, y: 82 },
      { x: 68, y: 82 },
    ],
    9: [
      { x: 32, y: 20 },
      { x: 50, y: 20 },
      { x: 68, y: 20 },
      { x: 32, y: 50 },
      { x: 50, y: 50 },
      { x: 68, y: 50 },
      { x: 32, y: 80 },
      { x: 50, y: 80 },
      { x: 68, y: 80 },
    ],
    10: [
      { x: 28, y: 18 },
      { x: 72, y: 18 },
      { x: 28, y: 38 },
      { x: 72, y: 38 },
      { x: 50, y: 50 },
      { x: 28, y: 62 },
      { x: 72, y: 62 },
      { x: 28, y: 82 },
      { x: 72, y: 82 },
      { x: 50, y: 82 },
    ],
  }
  return layouts[count] ?? [{ x: 50, y: 50 }]
}

