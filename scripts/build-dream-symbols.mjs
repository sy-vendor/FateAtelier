/**
 * 生成 src/data/dreamSymbols.ts
 * 运行: npm run build:dream
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { POLISH_ANIMALS_NATURE } from './dream-polish/animals-nature.mjs'
import { POLISH_PEOPLE_BUILDING } from './dream-polish/people-building.mjs'
import { POLISH_ITEMS_ACTIONS } from './dream-polish/items-actions.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/data/dreamSymbols.ts')

const ALL_SYMBOLS = [
  ...POLISH_ANIMALS_NATURE,
  ...POLISH_PEOPLE_BUILDING,
  ...POLISH_ITEMS_ACTIONS,
]

function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function emitSymbol(s) {
  const kw = s.keywords.map((k) => `'${esc(k)}'`).join(', ')
  const themes = s.themes.map((t) => `'${esc(t)}'`).join(', ')
  return `  {
    keywords: [${kw}],
    category: '${esc(s.category)}',
    meaning: '${esc(s.meaning)}',
    interpretation: '${esc(s.interpretation)}',
    positive: '${esc(s.positive)}',
    negative: '${esc(s.negative)}',
    advice: '${esc(s.advice)}',
    themes: [${themes}],
  }`
}

const header = `// 梦境符号数据（由 scripts/build-dream-symbols.mjs 生成）
export interface DreamSymbol {
  keywords: string[]
  category: string
  meaning: string
  interpretation: string
  positive: string
  negative: string
  advice: string
  themes: string[]
}

export interface MatchedDreamSymbol extends DreamSymbol {
  matchedKeyword: string
}

export const dreamSymbols: DreamSymbol[] = [
`

const body = ALL_SYMBOLS.map(emitSymbol).join(',\n')
const footer = `
]

export function findDreamSymbols(dreamContent: string): MatchedDreamSymbol[] {
  const found: MatchedDreamSymbol[] = []
  const content = dreamContent.toLowerCase()

  for (const symbol of dreamSymbols) {
    for (const keyword of symbol.keywords) {
      if (content.includes(keyword.toLowerCase())) {
        if (!found.some((s) => s.keywords[0] === symbol.keywords[0])) {
          found.push({ ...symbol, matchedKeyword: keyword })
        }
        break
      }
    }
  }

  return found
}
`

fs.writeFileSync(OUT, header + body + footer, 'utf8')
console.log(`Wrote ${ALL_SYMBOLS.length} dream symbols to ${OUT}`)
