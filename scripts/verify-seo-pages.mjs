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
  ['tarot/cards', '78 张塔罗牌牌义大全'],
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

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
const required = [
  'https://www.fateatelier.cloud/',
  'https://www.fateatelier.cloud/tarot',
  'https://www.fateatelier.cloud/tarot/card/0',
  'https://www.fateatelier.cloud/dream/symbol/0',
  'https://www.fateatelier.cloud/divination/stick/1',
  'https://www.fateatelier.cloud/tarot/cards',
]
for (const url of required) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    throw new Error(`Sitemap is missing ${url}`)
  }
}
const urlCount = (sitemap.match(/<loc>/g) || []).length
if (urlCount < 100) throw new Error(`Sitemap looks too small: ${urlCount} urls`)

const today = new Date().toISOString().slice(0, 10)
if (!sitemap.includes(`<lastmod>${today}</lastmod>`)) {
  throw new Error(`Sitemap lastmod was not refreshed to ${today}`)
}

if (!fs.existsSync(path.join(dist, 'og-image.png'))) {
  throw new Error('Missing dist/og-image.png')
}

console.log(`Verified ${checks.length} SEO routes and sitemap (${urlCount} urls)`)
