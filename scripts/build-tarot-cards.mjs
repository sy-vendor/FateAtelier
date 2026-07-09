/**
 * 生成 src/data/tarotCards.ts
 * 运行: npm run build:tarot
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { POLISH_MAJOR } from './tarot-polish/major.mjs'
import { POLISH_WANDS } from './tarot-polish/wands.mjs'
import { POLISH_CUPS } from './tarot-polish/cups.mjs'
import { POLISH_SWORDS } from './tarot-polish/swords.mjs'
import { POLISH_PENTACLES } from './tarot-polish/pentacles.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/data/tarotCards.ts')

const POLISH = {
  ...POLISH_MAJOR,
  ...POLISH_WANDS,
  ...POLISH_CUPS,
  ...POLISH_SWORDS,
  ...POLISH_PENTACLES,
}

const MAJOR = [
  { id: 0, name: '愚者', nameEn: 'The Fool' },
  { id: 1, name: '魔术师', nameEn: 'The Magician' },
  { id: 2, name: '女祭司', nameEn: 'The High Priestess' },
  { id: 3, name: '皇后', nameEn: 'The Empress' },
  { id: 4, name: '皇帝', nameEn: 'The Emperor' },
  { id: 5, name: '教皇', nameEn: 'The Hierophant' },
  { id: 6, name: '恋人', nameEn: 'The Lovers' },
  { id: 7, name: '战车', nameEn: 'The Chariot' },
  { id: 8, name: '力量', nameEn: 'Strength' },
  { id: 9, name: '隐者', nameEn: 'The Hermit' },
  { id: 10, name: '命运之轮', nameEn: 'Wheel of Fortune' },
  { id: 11, name: '正义', nameEn: 'Justice' },
  { id: 12, name: '倒吊人', nameEn: 'The Hanged Man' },
  { id: 13, name: '死神', nameEn: 'Death' },
  { id: 14, name: '节制', nameEn: 'Temperance' },
  { id: 15, name: '恶魔', nameEn: 'The Devil' },
  { id: 16, name: '塔', nameEn: 'The Tower' },
  { id: 17, name: '星星', nameEn: 'The Star' },
  { id: 18, name: '月亮', nameEn: 'The Moon' },
  { id: 19, name: '太阳', nameEn: 'The Sun' },
  { id: 20, name: '审判', nameEn: 'Judgement' },
  { id: 21, name: '世界', nameEn: 'The World' },
]

const MINOR_EN = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']
const COURT_ZH = ['侍从', '骑士', '皇后', '国王']

function minorCards(suit, suitEn, suitZh, idStart) {
  return Array.from({ length: 14 }, (_, i) => {
    const isPip = i < 10
    return {
      id: idStart + i,
      name: isPip ? `${suitZh}${i + 1}` : `${suitZh}${COURT_ZH[i - 10]}`,
      nameEn: `${suitEn} ${MINOR_EN[i]}`,
      type: 'minor',
      suit,
      number: isPip ? i + 1 : undefined,
    }
  })
}

const BASE = [
  ...MAJOR.map((c) => ({ ...c, type: 'major' })),
  ...minorCards('wands', 'Wands', '权杖', 22),
  ...minorCards('cups', 'Cups', '圣杯', 36),
  ...minorCards('swords', 'Swords', '宝剑', 50),
  ...minorCards('pentacles', 'Pentacles', '星币', 64),
]

function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function emitCategories(cats) {
  let o = '    categories: {\n'
  for (const [k, v] of Object.entries(cats)) {
    o += `      ${k}: {\n`
    o += `        upright: '${esc(v.upright)}',\n`
    o += `        reversed: '${esc(v.reversed)}',\n`
    o += `      },\n`
  }
  o += '    },\n'
  return o
}

function emitCard(base) {
  const p = POLISH[base.id]
  if (!p) throw new Error(`Missing polish for card id ${base.id}`)

  let o = `  {
    id: ${base.id},
    name: '${esc(base.name)}',
    nameEn: '${esc(base.nameEn)}',
    type: '${base.type}',`

  if (base.suit) o += `\n    suit: '${base.suit}',`
  if (base.number !== undefined) o += `\n    number: ${base.number},`

  o += `
    meaning: {
      upright: '${esc(p.meaning.upright)}',
      reversed: '${esc(p.meaning.reversed)}',
    },
    description: '${esc(p.description)}',
    interpretation: {
      upright: '${esc(p.interpretation.upright)}',
      reversed: '${esc(p.interpretation.reversed)}',
    },
    advice: {
      upright: '${esc(p.advice.upright)}',
      reversed: '${esc(p.advice.reversed)}',
    },
${emitCategories(p.categories)}  }`

  return o
}

const header = `// 塔罗牌数据 - 78张（由 scripts/build-tarot-cards.mjs 生成）
export interface TarotCategoryReading {
  upright: string
  reversed: string
}

export interface TarotCard {
  id: number
  name: string
  nameEn: string
  type: 'major' | 'minor'
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles'
  number?: number
  meaning: {
    upright: string
    reversed: string
  }
  description: string
  interpretation: {
    upright: string
    reversed: string
  }
  advice: {
    upright: string
    reversed: string
  }
  categories: {
    love: TarotCategoryReading
    career: TarotCategoryReading
    wealth: TarotCategoryReading
    health: TarotCategoryReading
  }
}

export const tarotCards: TarotCard[] = [
`

const body = BASE.map(emitCard).join(',\n')
const footer = '\n]\n'

fs.writeFileSync(OUT, header + body + footer, 'utf8')
console.log(`Wrote ${BASE.length} cards to ${OUT}`)
