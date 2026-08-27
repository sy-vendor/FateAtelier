import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const checks = [
  ['tarot', '免费在线塔罗占卜'],
  ['en/tarot', 'Free Online Tarot Reading'],
  ['tarot/card/0', '愚者塔罗牌义'],
  ['en/tarot/card/0', 'The Fool Tarot Meaning'],
  ['dream/symbol/0', '梦见'],
  ['en/dream/symbol/0', 'Dream of snake'],
  ['divination/stick/1', '第1签'],
  ['en/divination/stick/1', 'Stick #1'],
  ['tarot/cards', '78 张塔罗牌牌义大全'],
  ['en/tarot/cards', 'All 78 Tarot Card Meanings'],
  ['en', 'Fate Atelier'],
]

for (const [route, expected] of checks) {
  const files = [path.join(dist, `${route}.html`), path.join(dist, route, 'index.html')]
  for (const file of files) {
    if (!fs.existsSync(file)) throw new Error(`Missing SEO route output: ${path.relative(dist, file)}`)
    const html = fs.readFileSync(file, 'utf8')
    if (!html.includes(expected)) throw new Error(`SEO route /${route} is missing expected content: ${expected}`)
    const canonicalPath = route === 'en' ? '/en' : `/${route}`
    if (!html.includes(`<link rel="canonical" href="https://www.fateatelier.cloud${canonicalPath}"`)) {
      throw new Error(`SEO route /${route} has an invalid canonical URL`)
    }
    if (!html.includes('application/ld+json')) throw new Error(`SEO route /${route} is missing JSON-LD`)
  }
}

const featureHtml = fs.readFileSync(path.join(dist, 'tarot/index.html'), 'utf8')
for (const hreflang of ['zh-CN', 'en', 'x-default']) {
  if (!featureHtml.includes(`hreflang="${hreflang}"`)) {
    throw new Error(`Chinese feature page missing hreflang=${hreflang}`)
  }
}
const featureEnHtml = fs.readFileSync(path.join(dist, 'en/tarot/index.html'), 'utf8')
if (!featureEnHtml.includes('hreflang="zh-CN"') || !featureEnHtml.includes('lang="en"')) {
  throw new Error('English feature page missing hreflang or lang=en')
}
const detailEnHtml = fs.readFileSync(path.join(dist, 'en/tarot/card/0/index.html'), 'utf8')
if (!detailEnHtml.includes('hreflang="zh-CN"') || !detailEnHtml.includes('lang="en"')) {
  throw new Error('English detail page missing hreflang or lang=en')
}

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
const required = [
  'https://www.fateatelier.cloud/',
  'https://www.fateatelier.cloud/en',
  'https://www.fateatelier.cloud/tarot',
  'https://www.fateatelier.cloud/en/tarot',
  'https://www.fateatelier.cloud/tarot/card/0',
  'https://www.fateatelier.cloud/en/tarot/card/0',
  'https://www.fateatelier.cloud/en/tarot/cards',
]
for (const url of required) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    throw new Error(`Sitemap is missing ${url}`)
  }
}
if (!sitemap.includes('xmlns:xhtml=')) throw new Error('Sitemap missing xhtml namespace for hreflang')
if (!sitemap.includes('hreflang="en"')) throw new Error('Sitemap missing hreflang en links')

const urlCount = (sitemap.match(/<loc>/g) || []).length
if (urlCount < 400) throw new Error(`Sitemap looks too small: ${urlCount} urls`)

const today = new Date().toISOString().slice(0, 10)
if (!sitemap.includes(`<lastmod>${today}</lastmod>`)) {
  throw new Error(`Sitemap lastmod was not refreshed to ${today}`)
}

if (!fs.existsSync(path.join(dist, 'og-image.png'))) {
  throw new Error('Missing dist/og-image.png')
}

console.log(`Verified ${checks.length} SEO routes and sitemap (${urlCount} urls)`)
