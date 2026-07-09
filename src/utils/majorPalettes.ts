export interface MajorPalette {
  accent: string
  gold: string
  skyTop: string
  skyBottom: string
  accentSoft: string
  glow: string
}

/** 大阿卡纳 · 每张牌独立配色 */
export const MAJOR_PALETTES: Record<number, MajorPalette> = {
  0: { accent: '#f4d078', gold: '#ffe8a8', skyTop: '#1e2848', skyBottom: '#0c1020', accentSoft: 'rgba(244,208,120,0.18)', glow: 'rgba(244,208,120,0.35)' },
  1: { accent: '#c4b0f8', gold: '#e8d090', skyTop: '#1a1430', skyBottom: '#0a0814', accentSoft: 'rgba(196,176,248,0.18)', glow: 'rgba(196,176,248,0.35)' },
  2: { accent: '#a8c8e8', gold: '#d8e8f8', skyTop: '#141830', skyBottom: '#080810', accentSoft: 'rgba(168,200,232,0.16)', glow: 'rgba(168,200,232,0.32)' },
  3: { accent: '#e8a0c0', gold: '#f0d0a0', skyTop: '#281828', skyBottom: '#100810', accentSoft: 'rgba(232,160,192,0.16)', glow: 'rgba(232,160,192,0.32)' },
  4: { accent: '#d08050', gold: '#f0c878', skyTop: '#201810', skyBottom: '#0c0808', accentSoft: 'rgba(208,128,80,0.16)', glow: 'rgba(208,128,80,0.32)' },
  5: { accent: '#c8b888', gold: '#f0e0b0', skyTop: '#201c14', skyBottom: '#0c0a08', accentSoft: 'rgba(200,184,136,0.16)', glow: 'rgba(200,184,136,0.32)' },
  6: { accent: '#f0a0b0', gold: '#ffd0d8', skyTop: '#281820', skyBottom: '#100810', accentSoft: 'rgba(240,160,176,0.16)', glow: 'rgba(240,160,176,0.32)' },
  7: { accent: '#88c0e8', gold: '#d0e8f8', skyTop: '#142030', skyBottom: '#080c14', accentSoft: 'rgba(136,192,232,0.16)', glow: 'rgba(136,192,232,0.32)' },
  8: { accent: '#f0c060', gold: '#ffe898', skyTop: '#282010', skyBottom: '#100c08', accentSoft: 'rgba(240,192,96,0.16)', glow: 'rgba(240,192,96,0.32)' },
  9: { accent: '#b0b8d0', gold: '#e0e8f8', skyTop: '#181820', skyBottom: '#080810', accentSoft: 'rgba(176,184,208,0.16)', glow: 'rgba(176,184,208,0.32)' },
  10: { accent: '#d0a0f0', gold: '#f0d878', skyTop: '#201028', skyBottom: '#0c0810', accentSoft: 'rgba(208,160,240,0.16)', glow: 'rgba(208,160,240,0.32)' },
  11: { accent: '#e8e8f0', gold: '#f0d080', skyTop: '#181820', skyBottom: '#0a0a10', accentSoft: 'rgba(232,232,240,0.14)', glow: 'rgba(232,232,240,0.28)' },
  12: { accent: '#90b8e0', gold: '#c8d8f0', skyTop: '#142028', skyBottom: '#080c10', accentSoft: 'rgba(144,184,224,0.16)', glow: 'rgba(144,184,224,0.32)' },
  13: { accent: '#c8c8d8', gold: '#e8e0c0', skyTop: '#101018', skyBottom: '#060608', accentSoft: 'rgba(200,200,216,0.14)', glow: 'rgba(200,200,216,0.28)' },
  14: { accent: '#a0d8e8', gold: '#f0e8c0', skyTop: '#142028', skyBottom: '#081018', accentSoft: 'rgba(160,216,232,0.16)', glow: 'rgba(160,216,232,0.32)' },
  15: { accent: '#d06068', gold: '#c0a060', skyTop: '#280808', skyBottom: '#100404', accentSoft: 'rgba(208,96,104,0.16)', glow: 'rgba(208,96,104,0.32)' },
  16: { accent: '#f0a040', gold: '#ffe070', skyTop: '#281808', skyBottom: '#100804', accentSoft: 'rgba(240,160,64,0.16)', glow: 'rgba(240,160,64,0.35)' },
  17: { accent: '#88d0f0', gold: '#f0f0ff', skyTop: '#0c1830', skyBottom: '#040810', accentSoft: 'rgba(136,208,240,0.16)', glow: 'rgba(136,208,240,0.32)' },
  18: { accent: '#c0b8e8', gold: '#e8e0f8', skyTop: '#141028', skyBottom: '#080610', accentSoft: 'rgba(192,184,232,0.16)', glow: 'rgba(192,184,232,0.32)' },
  19: { accent: '#ffd060', gold: '#fff0a0', skyTop: '#302010', skyBottom: '#140c04', accentSoft: 'rgba(255,208,96,0.18)', glow: 'rgba(255,208,96,0.38)' },
  20: { accent: '#e8d0a0', gold: '#fff8e0', skyTop: '#201810', skyBottom: '#0c0808', accentSoft: 'rgba(232,208,160,0.16)', glow: 'rgba(232,208,160,0.32)' },
  21: { accent: '#a0e8c8', gold: '#f0d878', skyTop: '#102820', skyBottom: '#081410', accentSoft: 'rgba(160,232,200,0.16)', glow: 'rgba(160,232,200,0.32)' },
}

export function getMajorPalette(cardId: number): MajorPalette {
  return MAJOR_PALETTES[cardId] ?? MAJOR_PALETTES[0]
}
