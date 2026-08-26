import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const checks = [
  ['tarot', '免费在线塔罗占卜'],
  ['tarot/card/0', '愚者塔罗牌义'],
  ['dream/symbol/0', '梦见'],
  ['divination/stick/1', '第1签'],
]

for (const [route, expected] of checks) {
  const files = [path.join(dist, `${route}.html`), path.join(dist, route, 'index.html')]
  for (const file of files) {
    if (!fs.existsSync(file)) throw new Error(`Missing SEO route output: ${path.relative(dist, file)}`)
    const html = fs.readFileSync(file, 'utf8')
    if (!html.includes(expected)) throw new Error(`SEO route /${route} is missing expected content: ${expected}`)
    if (!html.includes(`<link rel="canonical" href="https://www.fateatelier.cloud/${route}"`)) {
      throw new Error(`SEO route /${route} has an invalid canonical URL`)
    }
    if (!html.includes('application/ld+json')) throw new Error(`SEO route /${route} is missing JSON-LD`)
  }
}

console.log(`Verified ${checks.length} representative SEO routes`)
