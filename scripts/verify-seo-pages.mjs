import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const checks = [
  ['zh/tarot', '玩法介绍'],
  ['tarot', 'How to play'],
  ['zh/tarot', '每日一牌'],
  ['tarot', 'Daily Draw'],
  ['zh/tarot', '免费在线塔罗占卜'],
  ['tarot', 'Free Online Tarot Reading'],
  ['zh/tarot', '无广告'],
  ['tarot', 'ad-free'],
  ['zh/tarot/card/0', '愚者塔罗牌义'],
  ['tarot/card/0', 'The Fool Tarot Meaning'],
  ['zh/dream/symbol/0', '梦见'],
  ['dream/symbol/0', 'Dream of snake'],
  ['zh/divination/stick/1', '第1签'],
  ['divination/stick/1', 'Stick #1'],
  ['zh/tarot/cards', '78 张塔罗牌牌义大全'],
  ['tarot/cards', 'All 78 Tarot Card Meanings'],
  ['zh/methodology', '三种结果机制'],
  ['methodology', 'Three result mechanisms'],
  ['zh/privacy', '本地优先'],
  ['privacy', 'Local first'],
  ['zh/disclaimer', '仅供娱乐'],
  ['disclaimer', 'Entertainment'],
  ['guides/one-card-tarot', 'One Card Tarot'],
  ['guides', 'English Divination Guides'],
  ['zh/tarot/card/0', '感情与关系'],
  ['tarot/card/0', 'Love & relationships'],
  ['zh/tarot/card/0', '常见误读'],
]

for (const [route, expected] of checks) {
  const files = [path.join(dist, `${route}.html`), path.join(dist, route, 'index.html')]
  for (const file of files) {
    if (!fs.existsSync(file)) throw new Error(`Missing SEO route output: ${path.relative(dist, file)}`)
    const html = fs.readFileSync(file, 'utf8')
    if (!html.includes(expected)) throw new Error(`SEO route /${route} is missing expected content: ${expected}`)
    const canonicalPath = `/${route}`
    if (!html.includes(`<link rel="canonical" href="https://www.fateatelier.cloud${canonicalPath}"`)) {
      throw new Error(`SEO route /${route} has an invalid canonical URL`)
    }
    if (!html.includes('application/ld+json')) throw new Error(`SEO route /${route} is missing JSON-LD`)
  }
}

const homeHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!homeHtml.includes('How to explore') || !homeHtml.includes('lang="en"')) {
  throw new Error('English homepage (/) missing How to explore or lang=en')
}
if (!homeHtml.includes('ad-free')) throw new Error('English homepage missing ad-free')

const zhHomeHtml = fs.readFileSync(path.join(dist, 'zh/index.html'), 'utf8')
if (!zhHomeHtml.includes('玩法介绍') || !zhHomeHtml.includes('lang="zh-CN"')) {
  throw new Error('Chinese homepage (/zh) missing 玩法介绍 or lang=zh-CN')
}

const featureZhHtml = fs.readFileSync(path.join(dist, 'zh/tarot/index.html'), 'utf8')
for (const hreflang of ['zh-CN', 'en', 'x-default']) {
  if (!featureZhHtml.includes(`hreflang="${hreflang}"`)) {
    throw new Error(`Chinese feature page missing hreflang=${hreflang}`)
  }
}
const featureEnHtml = fs.readFileSync(path.join(dist, 'tarot/index.html'), 'utf8')
if (!featureEnHtml.includes('hreflang="zh-CN"') || !featureEnHtml.includes('lang="en"')) {
  throw new Error('English feature page missing hreflang or lang=en')
}
if (!featureEnHtml.includes('twitter:title') || !featureEnHtml.includes('Free Online Tarot Reading')) {
  throw new Error('English feature page missing localized Twitter title')
}
const detailEnHtml = fs.readFileSync(path.join(dist, 'tarot/card/0/index.html'), 'utf8')
if (!detailEnHtml.includes('hreflang="zh-CN"') || !detailEnHtml.includes('lang="en"')) {
  throw new Error('English detail page missing hreflang or lang=en')
}

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
const required = [
  'https://www.fateatelier.cloud/',
  'https://www.fateatelier.cloud/zh',
  'https://www.fateatelier.cloud/tarot',
  'https://www.fateatelier.cloud/zh/tarot',
  'https://www.fateatelier.cloud/tarot/card/0',
  'https://www.fateatelier.cloud/zh/tarot/card/0',
  'https://www.fateatelier.cloud/tarot/cards',
  'https://www.fateatelier.cloud/methodology',
  'https://www.fateatelier.cloud/zh/methodology',
  'https://www.fateatelier.cloud/guides/one-card-tarot',
]
for (const url of required) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    throw new Error(`Sitemap is missing ${url}`)
  }
}
if (!sitemap.includes('xmlns:xhtml=')) throw new Error('Sitemap missing xhtml namespace for hreflang')
if (!sitemap.includes('hreflang="en"')) throw new Error('Sitemap missing hreflang en links')
if (!sitemap.includes('hreflang="x-default" href="https://www.fateatelier.cloud/"')) {
  throw new Error('Sitemap x-default should point at English homepage')
}

const urlCount = (sitemap.match(/<loc>/g) || []).length
if (urlCount < 400) throw new Error(`Sitemap looks too small: ${urlCount} urls`)

const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1])
if (lastmods.length < 10) throw new Error('Sitemap should include lastmod for content-aware URLs')
for (const value of lastmods) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid sitemap lastmod: ${value}`)
}
const uniqueLastmods = new Set(lastmods)
if (uniqueLastmods.size < 2) {
  throw new Error('Sitemap lastmod looks stamped identically across the site; expected content-source dates')
}

const today = new Date().toISOString().slice(0, 10)
const todayCount = lastmods.filter((value) => value === today).length
if (todayCount === lastmods.length) {
  throw new Error('Sitemap lastmod was refreshed to today for every URL — use content source mtimes instead')
}

if (!fs.existsSync(path.join(dist, 'og-image.png'))) {
  throw new Error('Missing dist/og-image.png')
}

function countJsonLd(html) {
  return (html.match(/application\/ld\+json/g) || []).length
}

const tarotHtml = fs.readFileSync(path.join(dist, 'tarot/index.html'), 'utf8')
if (countJsonLd(tarotHtml) !== 1) {
  throw new Error(`Feature /tarot should have exactly 1 JSON-LD block, found ${countJsonLd(tarotHtml)}`)
}
if ((tarotHtml.match(/<h1[\s>]/g) || []).length !== 1) {
  throw new Error('Feature /tarot should have exactly one <h1>')
}
if (tarotHtml.includes('"@type":"WebSite"') || tarotHtml.includes('"@type": "WebSite"')) {
  throw new Error('Feature /tarot must not inherit homepage WebSite JSON-LD')
}

const cardHtml = fs.readFileSync(path.join(dist, 'tarot/card/0/index.html'), 'utf8')
if (countJsonLd(cardHtml) !== 1) {
  throw new Error(`Detail /tarot/card/0 should have exactly 1 JSON-LD block, found ${countJsonLd(cardHtml)}`)
}
if ((cardHtml.match(/<h1[\s>]/g) || []).length !== 1) {
  throw new Error('Detail /tarot/card/0 should have exactly one <h1>')
}

console.log(`Verified ${checks.length} SEO routes and sitemap (${urlCount} urls)`)
