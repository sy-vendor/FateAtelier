/** Build crawlable HTML entry points for every SPA feature route (zh + en). */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { POLISH_MAJOR } from './tarot-polish/major.mjs'
import { POLISH_WANDS } from './tarot-polish/wands.mjs'
import { POLISH_CUPS } from './tarot-polish/cups.mjs'
import { POLISH_SWORDS } from './tarot-polish/swords.mjs'
import { POLISH_PENTACLES } from './tarot-polish/pentacles.mjs'
import { POLISH_ANIMALS_NATURE } from './dream-polish/animals-nature.mjs'
import { POLISH_PEOPLE_BUILDING } from './dream-polish/people-building.mjs'
import { POLISH_ITEMS_ACTIONS } from './dream-polish/items-actions.mjs'
import { POLISH_1_50 } from './divination-polish/1-50.mjs'
import { POLISH_51_100 } from './divination-polish/51-100.mjs'
import { PLAIN_POEMS } from './divination-polish/plain-poems.mjs'
import { pagesZh, pagesEn } from './seo-feature-copy.mjs'
import { EN_GUIDE_CLUSTERS } from './seo-en-guides.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const origin = 'https://www.fateatelier.cloud'
const pages = pagesZh
const TRUST_PAGE_COPY = JSON.parse(fs.readFileSync(path.join(root, 'src/content/trustPages.json'), 'utf8'))

/** Prefer git author date so CI checkouts (identical mtimes) still get stable, content-aware lastmod. */
function fileLastmod(...relativePaths) {
  let latest = 0
  for (const relative of relativePaths) {
    const full = path.join(root, relative)
    if (!fs.existsSync(full)) continue
    let stamp = 0
    try {
      const gitDate = execFileSync(
        'git',
        ['log', '-1', '--format=%cI', '--', relative],
        { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim()
      if (gitDate) stamp = Date.parse(gitDate) || 0
    } catch {
      // Fall through to filesystem mtime when git history is unavailable.
    }
    if (!stamp) stamp = fs.statSync(full).mtimeMs
    latest = Math.max(latest, stamp)
  }
  if (!latest) return null
  return new Date(latest).toISOString().slice(0, 10)
}

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function absolutePath(route, english = false) {
  const cleaned = String(route || '').replace(/^\/+|\/+$/g, '')
  if (english) return cleaned ? `${origin}/${cleaned}` : `${origin}/`
  return cleaned ? `${origin}/zh/${cleaned}` : `${origin}/zh`
}

function hreflangBlock(route) {
  const zh = absolutePath(route, false)
  const en = absolutePath(route, true)
  return [
    `<link rel="alternate" hreflang="zh-CN" href="${zh}" />`,
    `<link rel="alternate" hreflang="en" href="${en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${en}" />`,
  ].join('\n    ')
}

function writeRouteHtml(route, html) {
  const directoryTarget = path.join(dist, route)
  const cleanUrlTarget = path.join(dist, `${route}.html`)
  fs.mkdirSync(directoryTarget, { recursive: true })
  fs.mkdirSync(path.dirname(cleanUrlTarget), { recursive: true })
  fs.writeFileSync(path.join(directoryTarget, 'index.html'), html)
  fs.writeFileSync(cleanUrlTarget, html)
}

function stripTemplateNoise(html, lang = 'en') {
  // Feature/detail pages must not inherit homepage JSON-LD or a second <h1> from noscript.
  const noscript = lang === 'en'
    ? '<noscript><p><strong>Fate Atelier</strong> — free, ad-free, no-signup online divination tools. Enable JavaScript for the full experience.</p></noscript>'
    : '<noscript><p><strong>命运工坊</strong> — 免费、无广告、无需注册的在线占卜与命理工具。请启用 JavaScript 以完整体验。</p></noscript>'
  return html
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '')
    .replace(
      /<noscript>[\s\S]*?<\/noscript>/,
      noscript,
    )
}

function applyShell(html, { title, description, url, lang, locale, hreflangRoute, jsonLd, body }) {
  const brand = lang === 'en' ? 'Fate Atelier' : '命运工坊'
  let next = stripTemplateNoise(html, lang)
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:locale" content="[^"]*"\s*\/>/, `<meta property="og:locale" content="${locale}" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*"\s*\/>/, `<meta property="og:image:alt" content="${escapeHtml(brand)}" />`)
    .replace(/<meta property="og:site_name" content="[^"]*"\s*\/>/, `<meta property="og:site_name" content="${escapeHtml(brand)}" />`)
    .replace(/<meta name="twitter:url" content="[^"]*"\s*\/>/, `<meta name="twitter:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta name="twitter:image:alt" content="[^"]*"\s*\/>/, `<meta name="twitter:image:alt" content="${escapeHtml(brand)}" />`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, body)
  const headExtras = [
    hreflangRoute != null ? hreflangBlock(hreflangRoute) : '',
    jsonLd ? `<script type="application/ld+json">${escapeJson(jsonLd)}</script>` : '',
  ].filter(Boolean).join('\n    ')
  next = next.replace('</head>', `    ${headExtras}\n  </head>`)
  return next
}

function writeFeaturePage(entry, english) {
  const { slug, title, description, intro, modes = [], steps = [], faqs = [], related = [] } = entry
  const brand = english ? 'Fate Atelier' : '命运工坊'
  const url = absolutePath(slug, english)
  const route = english ? slug : `zh/${slug}`
  const relatedTitle = english ? 'Related tools' : '相关功能'
  const homeLabel = english ? 'Back to Fate Atelier' : '返回命运工坊'
  const homeHref = english ? '/' : '/zh'
  const introTitle = english ? 'About this tool' : '功能介绍'
  const modesTitle = english ? 'What you can try' : '你可以体验'
  const stepsTitle = english ? 'How to play' : '玩法介绍'
  const faqTitle = english ? 'FAQ' : '常见问题'
  const modesHtml = modes.length
    ? `<h2>${modesTitle}</h2><ul>${modes.map((mode) => `<li><strong>${escapeHtml(mode.name)}</strong>${english ? ': ' : '：'}${escapeHtml(mode.text)}</li>`).join('')}</ul>`
    : ''
  const stepsHtml = steps.length
    ? `<h2>${stepsTitle}</h2><ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>`
    : ''
  const faqHtml = faqs.length
    ? `<h2>${faqTitle}</h2>${faqs.map((item) => `<h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p>`).join('')}`
    : ''
  const relatedHtml = related.length
    ? `<h2>${relatedTitle}</h2><ul>${related.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('')}</ul>`
    : ''
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: title,
        url,
        description,
        applicationCategory: 'EntertainmentApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        inLanguage: english ? 'en' : 'zh-CN',
      },
      ...(steps.length
        ? [{
            '@type': 'HowTo',
            name: english ? `How to use ${title}` : `如何使用${title}`,
            description: intro,
            step: steps.map((text, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: english ? `Step ${index + 1}` : `步骤 ${index + 1}`,
              text,
            })),
          }]
        : []),
      ...(faqs.length
        ? [{
            '@type': 'FAQPage',
            mainEntity: faqs.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: brand, item: english ? `${origin}/` : `${origin}/zh` },
          { '@type': 'ListItem', position: 2, name: title, item: url },
        ],
      },
    ],
  }
  const body = `<div id="root"><main class="seo-entry"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><h2>${introTitle}</h2><p>${escapeHtml(intro)}</p>${modesHtml}${stepsHtml}${faqHtml}${relatedHtml}<p><a href="${homeHref}">${homeLabel}</a></p></main></div>`
  const html = applyShell(template, {
    title: `${title} | ${brand}`,
    description,
    url,
    lang: english ? 'en' : 'zh-CN',
    locale: english ? 'en_US' : 'zh_CN',
    hreflangRoute: slug,
    jsonLd: schema,
    body,
  })
  writeRouteHtml(route, html)
  return url
}

/** Load generated `*.en.ts` locale modules by stripping TS types for Node ESM. */
async function loadLocaleExport(relativePath, exportName) {
  let src = fs.readFileSync(path.join(root, relativePath), 'utf8')
  src = src.replace(/^\/\/.*$/gm, '')
  src = src.replace(/export interface[\s\S]*?\n}\n/g, '')
  src = src.replace(/export type[\s\S]*?;\n/g, '')
  src = src.replace(new RegExp(`export const ${exportName}\\s*:\\s*[^=]+=`), `const ${exportName} =`)
  src = src.replace(`export const ${exportName}`, `const ${exportName}`)
  src += `\nexport default ${exportName}\n`
  const tmp = path.join(os.tmpdir(), `${exportName}-${Date.now()}-${Math.random().toString(16).slice(2)}.mjs`)
  fs.writeFileSync(tmp, src)
  try {
    const mod = await import(pathToFileURL(tmp).href)
    return mod.default
  } finally {
    fs.unlinkSync(tmp)
  }
}

function writeDetailPage({ route, title, description, parentName, parentHref, body, schemaType = 'Article', english = false, withHreflang = false, dateModified = null }) {
  const brand = english ? 'Fate Atelier' : '命运工坊'
  const url = absolutePath(route, english)
  const outputRoute = english ? route : `zh/${route}`
  const parentUrl = parentHref.startsWith('http')
    ? parentHref
    : `${origin}${parentHref.startsWith('/') ? parentHref : `/${parentHref}`}`
  const articleNode = {
    '@type': schemaType,
    headline: title,
    description,
    inLanguage: english ? 'en' : 'zh-CN',
    mainEntityOfPage: url,
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: brand },
  }
  if (dateModified) articleNode.dateModified = dateModified
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      articleNode,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: brand, item: english ? `${origin}/` : `${origin}/zh` },
          { '@type': 'ListItem', position: 2, name: parentName, item: parentUrl },
          { '@type': 'ListItem', position: 3, name: title, item: url },
        ],
      },
    ],
  }
  const homeHref = english ? '/' : '/zh'
  const crawlable = `<div id="root"><main class="seo-entry"><nav><a href="${homeHref}">${brand}</a> › <a href="${parentHref}">${escapeHtml(parentName)}</a></nav>${body}</main></div>`
  const html = applyShell(template, {
    title: `${title} | ${brand}`,
    description,
    url,
    lang: english ? 'en' : 'zh-CN',
    locale: english ? 'en_US' : 'zh_CN',
    hreflangRoute: withHreflang ? route : null,
    jsonLd: schema,
    body: crawlable,
  })
  writeRouteHtml(outputRoute, html)
  return url
}

for (const entry of pages) writeFeaturePage(entry, false)
for (const entry of pagesEn) writeFeaturePage(entry, true)

function homeToolList(entries, english) {
  return entries.map((entry) => {
    const href = english ? `/${entry.slug}` : `/zh/${entry.slug}`
    return `<li><a href="${href}"><strong>${escapeHtml(entry.title)}</strong> — ${escapeHtml(entry.description)}</a></li>`
  }).join('')
}

// English homepage is the site root (default locale)
{
  const title = 'Fate Atelier | Free Tarot, BaZi, Zi Wei & Divination Tools'
  const description = 'Free, ad-free online divination workshop: tarot, horoscope, Chinese almanac, BaZi, fortune sticks, dream guide, feng shui, and more—no signup required, with clear how-to guides in English.'
  const intro = 'Fate Atelier is a free, ad-free browser workshop for traditional and modern divination play. Each tool includes a short intro, what you can try, step-by-step how-to, and FAQ so you can start without an account.'
  const howTitle = 'How to explore'
  const howSteps = [
    'Pick a tool below that matches your question—cards, calendar, chart, or a calm ritual.',
    'Follow the on-page how-to: clarify intent, complete the draw or input, then read guidance.',
    'Use related tools to cross-check, and switch to 中文 anytime from the language control.',
  ]
  const homePath = path.join(dist, 'index.html')
  let home = fs.readFileSync(homePath, 'utf8')
  if (!home.includes('hreflang="en"')) {
    home = home.replace('</head>', `    ${hreflangBlock('')}\n  </head>`)
  }
  const seoBody = `<div id="root"><main class="seo-entry"><h1>Fate Atelier</h1><p>${escapeHtml(description)}</p><h2>About the workshop</h2><p>${escapeHtml(intro)}</p><h2>${howTitle}</h2><ol>${howSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol><h2>Explore tools</h2><ul>${homeToolList(pagesEn, true)}</ul><h2>Guides &amp; trust</h2><ul><li><a href="/guides">English divination guides</a></li><li><a href="/methodology">Methodology</a></li><li><a href="/privacy">Privacy</a></li><li><a href="/disclaimer">Disclaimer</a></li><li><a href="/about">About</a></li></ul><p><a href="/zh">中文版</a></p></main></div>`
  home = applyShell(home.includes('<div id="root"></div>') ? home : home.replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>'), {
    title,
    description,
    url: `${origin}/`,
    lang: 'en',
    locale: 'en_US',
    hreflangRoute: '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Fate Atelier',
      alternateName: '命运工坊',
      url: `${origin}/`,
      description,
      inLanguage: 'en',
      isAccessibleForFree: true,
    },
    body: seoBody,
  })
  fs.writeFileSync(homePath, home)
}

// Chinese homepage under /zh
{
  const title = '命运工坊'
  const description = '免费无广告的在线综合占卜工坊：塔罗牌阵、星座运势、黄历宜忌、八字紫微、抽签解梦、风水择日等，无需注册，含玩法介绍与常见问题。'
  const intro = '命运工坊把多种传统与现代占卜玩法放在同一个网页里：先看功能介绍与步骤，再直接体验抽牌、排盘或今日仪式。全程免费、无广告、无需下载与注册。'
  const howSteps = [
    '从下方功能中选择与问题最贴近的工具。',
    '按页面「玩法介绍」完成提问、抽取或输入。',
    '阅读结果后，可跳转相关功能交叉参考，或切换到 English。',
  ]
  const body = `<div id="root"><main class="seo-entry"><h1>${title}</h1><p>${escapeHtml(description)}</p><h2>工坊介绍</h2><p>${escapeHtml(intro)}</p><h2>玩法介绍</h2><ol>${howSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol><h2>全部功能</h2><ul>${homeToolList(pages, false)}</ul><h2>信任与说明</h2><ul><li><a href="/zh/methodology">演算与内容方法</a></li><li><a href="/zh/privacy">隐私说明</a></li><li><a href="/zh/disclaimer">免责声明</a></li><li><a href="/zh/about">关于命运工坊</a></li><li><a href="/zh/contact">联系我们</a></li></ul><p><a href="/">English</a></p></main></div>`
  const html = applyShell(template, {
    title: `${title} | 免费在线占卜与命理工具`,
    description,
    url: `${origin}/zh`,
    lang: 'zh-CN',
    locale: 'zh_CN',
    hreflangRoute: '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '命运工坊',
      alternateName: 'Fate Atelier',
      url: `${origin}/zh`,
      description,
      inLanguage: 'zh-CN',
      isAccessibleForFree: true,
    },
    body,
  })
  writeRouteHtml('zh', html)
}

const [tarotCardsEn, dreamSymbolsEn, divinationSticksEn] = await Promise.all([
  loadLocaleExport('src/data/tarotCards.en.ts', 'tarotCardsEn'),
  loadLocaleExport('src/data/dreamSymbols.en.ts', 'dreamSymbolsEn'),
  loadLocaleExport('src/data/divinationSticks.en.ts', 'divinationSticksEn'),
])

const detailPairs = []
const majorNames = ['愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车', '力量', '隐者', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', '塔', '星星', '月亮', '太阳', '审判', '世界']
const majorNamesEn = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World']
const courtNames = ['侍从', '骑士', '皇后', '国王']
const courtNamesEn = ['Page', 'Knight', 'Queen', 'King']
const suits = [['权杖', POLISH_WANDS, 22, 'Wands'], ['圣杯', POLISH_CUPS, 36, 'Cups'], ['宝剑', POLISH_SWORDS, 50, 'Swords'], ['星币', POLISH_PENTACLES, 64, 'Pentacles']]
const tarotCards = majorNames.map((name, id) => ({ id, name, nameEn: majorNamesEn[id], data: POLISH_MAJOR[id] }))
for (const [suit, polish, start, suitEn] of suits) {
  for (let index = 0; index < 14; index += 1) {
    tarotCards.push({
      id: start + index,
      name: index < 10 ? `${suit}${index + 1}` : `${suit}${courtNames[index - 10]}`,
      nameEn: index < 10 ? `${suitEn} ${index + 1}` : `${courtNamesEn[index - 10]} of ${suitEn}`,
      data: polish[start + index],
    })
  }
}
const tarotSourceFiles = {
  major: 'scripts/tarot-polish/major.mjs',
  wands: 'scripts/tarot-polish/wands.mjs',
  cups: 'scripts/tarot-polish/cups.mjs',
  swords: 'scripts/tarot-polish/swords.mjs',
  pentacles: 'scripts/tarot-polish/pentacles.mjs',
}
const tarotSourceById = (id) => {
  if (id <= 21) return tarotSourceFiles.major
  if (id <= 35) return tarotSourceFiles.wands
  if (id <= 49) return tarotSourceFiles.cups
  if (id <= 63) return tarotSourceFiles.swords
  return tarotSourceFiles.pentacles
}

for (const card of tarotCards) {
  const route = `tarot/card/${card.id}`
  const title = `${card.name}塔罗牌义：正位与逆位解读`
  const description = `${card.name}的塔罗牌义，包含正位、逆位、感情、事业情境与行动建议。`
  const enData = tarotCardsEn[card.id]
  const titleEn = `${card.nameEn} Tarot Meaning: Upright & Reversed`
  const descriptionEn = `${card.nameEn} tarot meaning with upright, reversed, love, career situations, and action guidance.`
  const reviewed = fileLastmod(tarotSourceById(card.id), 'src/data/tarotCards.en.ts')
  const relatedIds = [card.id - 1, card.id + 1].filter((id) => id >= 0 && id <= 77 && id !== card.id)
  const relatedZh = relatedIds
    .map((id) => tarotCards.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => `<li><a href="/zh/tarot/card/${item.id}">${escapeHtml(item.name)}牌义</a> — 邻近牌面，便于对照主题变化</li>`)
    .join('')
  const relatedEn = relatedIds
    .map((id) => tarotCards.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => `<li><a href="/tarot/card/${item.id}">${escapeHtml(item.nameEn)} meaning</a> — nearby card for theme contrast</li>`)
    .join('')
  const editorialZh = `<p class="seo-editorial"><em>内容口径：娱乐与文化参考。内容源最近修订：${reviewed || '—'}。详见 <a href="/zh/methodology">演算与内容方法</a>。</em></p>`
  const editorialEn = `<p class="seo-editorial"><em>Editorial note: entertainment and cultural reference. Source last revised: ${reviewed || '—'}. See <a href="/methodology">Methodology</a>.</em></p>`
  const zhUrl = writeDetailPage({
    route,
    title,
    description,
    parentName: '塔罗占卜',
    parentHref: '/zh/tarot',
    withHreflang: true,
    dateModified: reviewed,
    body: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(card.data.description)}</p><h2>${card.name}正位牌义</h2><p>${escapeHtml(card.data.interpretation.upright)}</p><p><strong>建议：</strong>${escapeHtml(card.data.advice.upright)}</p><h2>${card.name}逆位牌义</h2><p>${escapeHtml(card.data.interpretation.reversed)}</p><p><strong>建议：</strong>${escapeHtml(card.data.advice.reversed)}</p><h2>感情与关系</h2><p><strong>正位：</strong>${escapeHtml(card.data.categories.love.upright)}</p><p><strong>逆位：</strong>${escapeHtml(card.data.categories.love.reversed)}</p><h2>事业与行动</h2><p><strong>正位：</strong>${escapeHtml(card.data.categories.career.upright)}</p><p><strong>逆位：</strong>${escapeHtml(card.data.categories.career.reversed)}</p><h2>常见误读</h2><p>不要把逆位直接等同于「坏事」；它更常提示节奏受阻、内心抗拒或需要换一种问法。重大决定仍应回到现实条件与沟通。</p><h2>相关牌义</h2><ul>${relatedZh}</ul>${editorialZh}<p><a href="/zh/tarot">在线抽取塔罗牌</a> · <a href="/zh/tarot/cards">浏览全部牌义</a> · <a href="/zh/methodology">演算方法说明</a></p>`,
  })
  const enUrl = writeDetailPage({
    route,
    title: titleEn,
    description: descriptionEn,
    parentName: 'Tarot Reading',
    parentHref: '/tarot',
    english: true,
    withHreflang: true,
    dateModified: reviewed,
    body: `<h1>${escapeHtml(titleEn)}</h1><p>${escapeHtml(enData.description)}</p><h2>${escapeHtml(card.nameEn)} upright</h2><p>${escapeHtml(enData.interpretation.upright)}</p><p><strong>Advice:</strong> ${escapeHtml(enData.advice.upright)}</p><h2>${escapeHtml(card.nameEn)} reversed</h2><p>${escapeHtml(enData.interpretation.reversed)}</p><p><strong>Advice:</strong> ${escapeHtml(enData.advice.reversed)}</p><h2>Love & relationships</h2><p><strong>Upright:</strong> ${escapeHtml(enData.categories.love.upright)}</p><p><strong>Reversed:</strong> ${escapeHtml(enData.categories.love.reversed)}</p><h2>Career & action</h2><p><strong>Upright:</strong> ${escapeHtml(enData.categories.career.upright)}</p><p><strong>Reversed:</strong> ${escapeHtml(enData.categories.career.reversed)}</p><h2>Common misread</h2><p>Reversed is not automatic misfortune. It often flags friction, delay, or an inner resistance—and invites a clearer question. Keep major decisions grounded in real constraints.</p><h2>Related meanings</h2><ul>${relatedEn}</ul>${editorialEn}<p><a href="/tarot">Draw tarot online</a> · <a href="/tarot/cards">Browse all card meanings</a> · <a href="/guides/one-card-tarot">One-card asking guide</a></p>`,
  })
  detailPairs.push({ route, zhUrl, enUrl, lastmod: reviewed })
}

const dreamSymbols = [...POLISH_ANIMALS_NATURE, ...POLISH_PEOPLE_BUILDING, ...POLISH_ITEMS_ACTIONS]
const dreamReviewed = fileLastmod(
  'scripts/dream-polish/animals-nature.mjs',
  'scripts/dream-polish/people-building.mjs',
  'scripts/dream-polish/items-actions.mjs',
  'src/data/dreamSymbols.en.ts',
)
dreamSymbols.forEach((symbol, index) => {
  const route = `dream/symbol/${index}`
  const keyword = symbol.keywords[0]
  const title = `梦见${keyword}是什么意思？${keyword}梦境解析`
  const en = dreamSymbolsEn[index]
  const enKeyword = en?.keywords?.find((word) => /^[a-z]/i.test(word)) ?? keyword
  const titleEn = `Dream of ${enKeyword}: Meaning & Guidance`
  const related = [index - 1, index + 1]
    .filter((id) => id >= 0 && id < dreamSymbols.length)
    .map((id) => {
      const item = dreamSymbols[id]
      const enItem = dreamSymbolsEn[id]
      const enKey = enItem?.keywords?.find((word) => /^[a-z]/i.test(word)) ?? item.keywords[0]
      return {
        zh: `<li><a href="/zh/dream/symbol/${id}">梦见${escapeHtml(item.keywords[0])}</a> — 同属${escapeHtml(item.category)}主题，可对照情绪色调</li>`,
        en: `<li><a href="/dream/symbol/${id}">Dream of ${escapeHtml(enKey)}</a> — same ${escapeHtml(enItem?.categoryEn || item.category)} cluster for tone contrast</li>`,
      }
    })
  const zhUrl = writeDetailPage({
    route,
    title,
    description: `梦见${keyword}的常见象征含义、积极暗示、需要留意的方向、适用情境与行动建议。`,
    parentName: '梦境解析',
    parentHref: '/zh/dream',
    withHreflang: true,
    dateModified: dreamReviewed,
    body: `<h1>${escapeHtml(title)}</h1><p><strong>核心意象：</strong>${escapeHtml(symbol.meaning)}</p><p>${escapeHtml(symbol.interpretation)}</p><h2>积极的可能</h2><p>${escapeHtml(symbol.positive)}</p><h2>需要留意</h2><p>${escapeHtml(symbol.negative)}</p><h2>适用情境</h2><p>当你最近在「${escapeHtml(symbol.themes.join('、'))}」相关议题上反复纠结，又说不清白天情绪从何而来时，这个梦象尤其值得写下细节后对照。</p><h2>常见误读</h2><p>单一梦象不是判决书。同一符号在不同情绪与生活事件中含义会偏移；先记录梦里的动作与感受，再看象征。</p><h2>梦后建议</h2><p>${escapeHtml(symbol.advice)}</p><h2>相关梦象</h2><ul>${related.map((item) => item.zh).join('')}</ul><p class="seo-editorial"><em>内容口径：娱乐与文化参考。内容源最近修订：${dreamReviewed || '—'}。详见 <a href="/zh/methodology">演算与内容方法</a>。</em></p><p><a href="/zh/dream">输入完整梦境进行解析</a> · <a href="/zh/dream/symbols">浏览全部梦象</a></p>`,
  })
  const enUrl = writeDetailPage({
    route,
    title: titleEn,
    description: en?.meaningEn || `Symbolic meaning, situations, and guidance for dreams of ${enKeyword}.`,
    parentName: 'Dream Guide',
    parentHref: '/dream',
    english: true,
    withHreflang: true,
    dateModified: dreamReviewed,
    body: `<h1>${escapeHtml(titleEn)}</h1><p><strong>Core image:</strong> ${escapeHtml(en.meaningEn || symbol.meaning)}</p><p>${escapeHtml(en.interpretationEn)}</p><h2>Positive possibilities</h2><p>${escapeHtml(en.positiveEn)}</p><h2>Watch for</h2><p>${escapeHtml(en.negativeEn)}</p><h2>When it often appears</h2><p>This symbol is especially useful when waking life keeps circling themes of ${(en.themesEn || symbol.themes).map((theme) => escapeHtml(theme)).join(', ')}, yet the daytime feeling is hard to name.</p><h2>Common misread</h2><p>One symbol is not a verdict. The same image shifts with mood and life events—capture the action and feeling in the dream before locking onto a keyword.</p><h2>After the dream</h2><p>${escapeHtml(en.adviceEn)}</p><h2>Related symbols</h2><ul>${related.map((item) => item.en).join('')}</ul><p class="seo-editorial"><em>Editorial note: entertainment and cultural reference. Source last revised: ${dreamReviewed || '—'}. See <a href="/methodology">Methodology</a>.</em></p><p><a href="/dream">Interpret a full dream</a> · <a href="/dream/symbols">Browse all symbols</a></p>`,
  })
  detailPairs.push({ route, zhUrl, enUrl, lastmod: dreamReviewed })
})

const stickPolish = { ...POLISH_1_50, ...POLISH_51_100 }
const stickReviewed = fileLastmod(
  'scripts/divination-polish/1-50.mjs',
  'scripts/divination-polish/51-100.mjs',
  'scripts/divination-polish/plain-poems.mjs',
  'src/data/divinationSticks.en.ts',
)
const stickSource = fs.readFileSync(path.join(root, 'src/data/divinationSticks.ts'), 'utf8')
const stickPattern = /id:\s*(\d+),\s*\n\s*level:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)',\s*\n\s*poem:\s*'([^']+)'/g
for (const match of stickSource.matchAll(stickPattern)) {
  const id = Number(match[1]); const level = match[2]; const titleText = match[3]; const poem = match[4]; const polish = stickPolish[id]
  const route = `divination/stick/${id}`
  const title = `第${id}签${titleText}解签：${level}签签文详解`
  const en = divinationSticksEn[id]
  const titleEn = `Stick #${id}: ${en.titleEn} (${en.levelEn})`
  const situationZh = polish.details
    ? `<h2>适用情境摘录</h2><ul><li><strong>事业：</strong>${escapeHtml(polish.details.career)}</li><li><strong>感情：</strong>${escapeHtml(polish.details.marriage)}</li><li><strong>财运：</strong>${escapeHtml(polish.details.wealth)}</li></ul>`
    : ''
  const situationEn = en.detailsEn
    ? `<h2>Situation notes</h2><ul><li><strong>Career:</strong> ${escapeHtml(en.detailsEn.career)}</li><li><strong>Relationships:</strong> ${escapeHtml(en.detailsEn.marriage)}</li><li><strong>Wealth:</strong> ${escapeHtml(en.detailsEn.wealth)}</li></ul>`
    : (polish.details
      ? `<h2>Situation notes</h2><ul><li><strong>Career:</strong> ${escapeHtml(polish.details.career)}</li><li><strong>Relationships:</strong> ${escapeHtml(polish.details.marriage)}</li><li><strong>Wealth:</strong> ${escapeHtml(polish.details.wealth)}</li></ul>`
      : '')
  const relatedIds = [id - 1, id + 1].filter((value) => value >= 1 && value <= 100)
  const relatedZh = relatedIds.map((value) => `<li><a href="/zh/divination/stick/${value}">第${value}签</a> — 相邻签文，便于比较语气强弱</li>`).join('')
  const relatedEn = relatedIds.map((value) => {
    const neighbor = divinationSticksEn[value]
    return `<li><a href="/divination/stick/${value}">Stick #${value}${neighbor ? `: ${escapeHtml(neighbor.titleEn)}` : ''}</a> — neighboring lot for tone contrast</li>`
  }).join('')
  const zhUrl = writeDetailPage({
    route,
    title,
    description: `第${id}签「${titleText}」的签诗、白话解释、典故、情境摘录与行事建议。`,
    parentName: '抽签求签',
    parentHref: '/zh/divination',
    withHreflang: true,
    dateModified: stickReviewed,
    body: `<h1>${escapeHtml(title)}</h1><blockquote>${escapeHtml(poem)}</blockquote><h2>签诗白话</h2><p>${escapeHtml(PLAIN_POEMS[id])}</p><h2>签意解读</h2><p>${escapeHtml(polish.interpretation)}</p>${situationZh}<h2>常见误读</h2><p>签级（如${escapeHtml(level)}）是语气而非判决。先问自己能立刻改变的一步，再决定是否换签重抽。</p><h2>行事建议</h2><p>${escapeHtml(polish.advice)}</p><p>${escapeHtml(polish.story)}</p><h2>相关签文</h2><ul>${relatedZh}</ul><p class="seo-editorial"><em>内容口径：娱乐与文化参考。内容源最近修订：${stickReviewed || '—'}。详见 <a href="/zh/methodology">演算与内容方法</a>。</em></p><p><a href="/zh/divination">在线抽取今日一签</a> · <a href="/zh/divination/sticks">浏览全部签文</a></p>`,
  })
  const enUrl = writeDetailPage({
    route,
    title: titleEn,
    description: `Fortune stick #${id} 「${en.titleEn}」 with poem reading, situations, meaning, and practical advice.`,
    parentName: 'Fortune Sticks',
    parentHref: '/divination',
    english: true,
    withHreflang: true,
    dateModified: stickReviewed,
    body: `<h1>${escapeHtml(titleEn)}</h1><blockquote>${escapeHtml(poem)}</blockquote><h2>Plain reading</h2><p>${escapeHtml(en.plainPoemEn)}</p><h2>Interpretation</h2><p>${escapeHtml(en.interpretationEn)}</p>${situationEn}<h2>Common misread</h2><p>Auspicious tiers (such as ${escapeHtml(en.levelEn)}) are tone, not a verdict. Name one action you control before redrawing.</p><h2>Advice</h2><p>${escapeHtml(en.adviceEn)}</p>${en.storyEn ? `<p>${escapeHtml(en.storyEn)}</p>` : ''}<h2>Related sticks</h2><ul>${relatedEn}</ul><p class="seo-editorial"><em>Editorial note: entertainment and cultural reference. Source last revised: ${stickReviewed || '—'}. See <a href="/methodology">Methodology</a> and <a href="/guides/fortune-stick-meaning">fortune stick guide</a>.</em></p><p><a href="/divination">Draw today’s stick</a> · <a href="/divination/sticks">Browse all sticks</a></p>`,
  })
  detailPairs.push({ route, zhUrl, enUrl, lastmod: stickReviewed })
}

const hubs = [
  {
    route: 'tarot/cards',
    title: '78 张塔罗牌牌义大全',
    titleEn: 'All 78 Tarot Card Meanings',
    description: '浏览全部大阿卡纳与小阿卡纳的正位、逆位牌义。',
    descriptionEn: 'Browse upright and reversed meanings for the Major and Minor Arcana.',
    parentName: '塔罗占卜',
    parentNameEn: 'Tarot Reading',
    parentHref: '/zh/tarot',
    parentHrefEn: '/tarot',
    links: tarotCards.map((card) => [`/zh/tarot/card/${card.id}`, `${card.name}牌义`]),
    linksEn: tarotCards.map((card) => [`/tarot/card/${card.id}`, `${card.nameEn} meaning`]),
  },
  {
    route: 'dream/symbols',
    title: '常见梦境意象解析大全',
    titleEn: 'Common Dream Symbol Guide',
    description: '查看动物、自然、人物、建筑、物品与动作类梦象。',
    descriptionEn: 'Explore dream symbols across animals, nature, people, places, objects, and actions.',
    parentName: '梦境解析',
    parentNameEn: 'Dream Guide',
    parentHref: '/zh/dream',
    parentHrefEn: '/dream',
    links: dreamSymbols.map((symbol, index) => [`/zh/dream/symbol/${index}`, `梦见${symbol.keywords[0]}`]),
    linksEn: dreamSymbols.map((_, index) => {
      const en = dreamSymbolsEn[index]
      const enKeyword = en?.keywords?.find((word) => /^[a-z]/i.test(word)) ?? en?.keywords?.[0] ?? `symbol-${index}`
      return [`/dream/symbol/${index}`, `Dream of ${enKeyword}`]
    }),
  },
  {
    route: 'divination/sticks',
    title: '一百支签文解签大全',
    titleEn: '100 Fortune Stick Readings',
    description: '浏览第一签至第一百签的签诗、白话与行事建议。',
    descriptionEn: 'Browse poems, plain readings, and advice for sticks 1 through 100.',
    parentName: '抽签求签',
    parentNameEn: 'Fortune Sticks',
    parentHref: '/zh/divination',
    parentHrefEn: '/divination',
    links: [...stickSource.matchAll(stickPattern)].map((match) => [`/zh/divination/stick/${match[1]}`, `第${match[1]}签 · ${match[3]}`]),
    linksEn: [...stickSource.matchAll(stickPattern)].map((match) => {
      const id = Number(match[1])
      const en = divinationSticksEn[id]
      return [`/divination/stick/${id}`, `Stick #${id} · ${en?.titleEn || match[3]}`]
    }),
  },
]

const hubPairs = []
const hubReviewed = fileLastmod(
  'scripts/build-seo-pages.mjs',
  'src/data/tarotCards.en.ts',
  'src/data/dreamSymbols.en.ts',
  'src/data/divinationSticks.en.ts',
)
for (const hub of hubs) {
  const list = hub.links.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('')
  const zhUrl = writeDetailPage({
    route: hub.route,
    title: hub.title,
    description: hub.description,
    parentName: hub.parentName,
    parentHref: hub.parentHref,
    schemaType: 'CollectionPage',
    withHreflang: true,
    dateModified: hubReviewed,
    body: `<h1>${hub.title}</h1><p>${hub.description}</p><ul>${list}</ul><p class="seo-editorial"><em>内容口径：娱乐与文化参考。索引最近修订：${hubReviewed || '—'}。</em></p>`,
  })
  const listEn = hub.linksEn.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('')
  const enUrl = writeDetailPage({
    route: hub.route,
    title: hub.titleEn,
    description: hub.descriptionEn,
    parentName: hub.parentNameEn,
    parentHref: hub.parentHrefEn,
    schemaType: 'CollectionPage',
    english: true,
    withHreflang: true,
    dateModified: hubReviewed,
    body: `<h1>${escapeHtml(hub.titleEn)}</h1><p>${escapeHtml(hub.descriptionEn)}</p><ul>${listEn}</ul><p class="seo-editorial"><em>Editorial note: entertainment and cultural reference. Index last revised: ${hubReviewed || '—'}.</em></p>`,
  })
  hubPairs.push({ route: hub.route, zhUrl, enUrl, lastmod: hubReviewed })

  const feature = hub.route.split('/')[0]
  const featureZhPath = path.join(dist, 'zh', feature, 'index.html')
  const featureZhHtml = fs.readFileSync(featureZhPath, 'utf8').replace('</main></div>', `<p><a href="/zh/${hub.route}">${hub.title}</a></p></main></div>`)
  fs.writeFileSync(featureZhPath, featureZhHtml)
  fs.writeFileSync(path.join(dist, 'zh', `${feature}.html`), featureZhHtml)

  const featureEnPath = path.join(dist, feature, 'index.html')
  const featureEnHtml = fs.readFileSync(featureEnPath, 'utf8').replace('</main></div>', `<p><a href="/${hub.route}">${hub.titleEn}</a></p></main></div>`)
  fs.writeFileSync(featureEnPath, featureEnHtml)
  fs.writeFileSync(path.join(dist, `${feature}.html`), featureEnHtml)
}

// Trust / policy pages (zh + en)
const trustReviewed = fileLastmod('src/content/trustPages.json')
const trustPairs = []
for (const entry of TRUST_PAGE_COPY) {
  const sectionsToHtml = (sections) => sections.map((section) => {
    const paragraphs = (section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')
    const bullets = section.bullets?.length
      ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`
      : ''
    return `<h2>${escapeHtml(section.heading)}</h2>${paragraphs}${bullets}`
  }).join('')
  const tocZh = TRUST_PAGE_COPY.map((item) => `<li><a href="/zh/${item.slug}">${escapeHtml(item.titleZh)}</a></li>`).join('')
  const tocEn = TRUST_PAGE_COPY.map((item) => `<li><a href="/${item.slug}">${escapeHtml(item.titleEn)}</a></li>`).join('')
  const zhUrl = writeDetailPage({
    route: entry.slug,
    title: entry.titleZh,
    description: entry.descriptionZh,
    parentName: '命运工坊',
    parentHref: '/zh',
    schemaType: 'WebPage',
    withHreflang: true,
    dateModified: trustReviewed,
    body: `<h1>${escapeHtml(entry.titleZh)}</h1><p>${escapeHtml(entry.descriptionZh)}</p><nav><ul>${tocZh}</ul></nav>${sectionsToHtml(entry.sectionsZh)}`,
  })
  const enUrl = writeDetailPage({
    route: entry.slug,
    title: entry.titleEn,
    description: entry.descriptionEn,
    parentName: 'Fate Atelier',
    parentHref: '/',
    schemaType: 'WebPage',
    english: true,
    withHreflang: true,
    dateModified: trustReviewed,
    body: `<h1>${escapeHtml(entry.titleEn)}</h1><p>${escapeHtml(entry.descriptionEn)}</p><nav><ul>${tocEn}</ul></nav>${sectionsToHtml(entry.sectionsEn)}`,
  })
  trustPairs.push({ route: entry.slug, zhUrl, enUrl, lastmod: trustReviewed })
}

// English search-intent guide clusters (EN only)
const guideReviewed = fileLastmod('scripts/seo-en-guides.mjs')
const guideUrls = []
const guideHubLinks = EN_GUIDE_CLUSTERS.map((guide) => [`/${guide.route}`, guide.title])
for (const guide of EN_GUIDE_CLUSTERS) {
  const sectionsHtml = guide.sections
    .map((section) => `<h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p>`)
    .join('')
  const linksHtml = `<h2>Continue</h2><ul>${guide.links.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('')}</ul>`
  const moreGuides = `<h2>English guide cluster</h2><ul>${guideHubLinks
    .filter(([href]) => href !== `/${guide.route}`)
    .map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
    .join('')}</ul>`
  const url = writeDetailPage({
    route: guide.route,
    title: guide.title,
    description: guide.description,
    parentName: guide.parentName,
    parentHref: guide.parentHref,
    schemaType: 'Article',
    english: true,
    withHreflang: false,
    dateModified: guideReviewed,
    body: `<h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p>${sectionsHtml}${linksHtml}${moreGuides}<p class="seo-editorial"><em>Written for English search intent—not a literal mirror of Chinese keywords. Source revised: ${guideReviewed || '—'}.</em></p>`,
  })
  guideUrls.push({ route: guide.route, url, lastmod: guideReviewed })
}

{
  const list = guideHubLinks.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('')
  const url = writeDetailPage({
    route: 'guides',
    title: 'English Divination Guides',
    description: 'English-first guides for one-card tarot, three-card spreads, Chinese almanac today, BaZi basics, zodiac compatibility, and fortune sticks.',
    parentName: 'Fate Atelier',
    parentHref: '/',
    schemaType: 'CollectionPage',
    english: true,
    withHreflang: false,
    dateModified: guideReviewed,
    body: `<h1>English Divination Guides</h1><p>These pages are written around English search intent—how to ask, what to expect, and which Fate Atelier tool to open next.</p><ul>${list}</ul>`,
  })
  guideUrls.push({ route: 'guides', url, lastmod: guideReviewed })
}

const sitemapPath = path.join(dist, 'sitemap.xml')
const featureCopyLastmod = fileLastmod('scripts/seo-feature-copy.mjs')
const homeLastmod = fileLastmod('index.html', 'scripts/build-seo-pages.mjs', 'src/content/trustPages.json')
const featureChangeFreq = {
  horoscope: 'daily',
  almanac: 'daily',
  cybermerit: 'daily',
  luckycolor: 'daily',
}
const featurePriority = {
  tarot: '0.9',
  horoscope: '0.8',
  almanac: '0.8',
  cybermerit: '0.8',
  bazi: '0.8',
}

function sitemapUrlEntry({ loc, changefreq, priority, alternates, lastmod }) {
  const lines = [
    '  <url>',
    `    <loc>${loc}</loc>`,
  ]
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`)
  lines.push(
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
  )
  if (alternates) {
    for (const [hreflang, href] of alternates) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    }
  }
  lines.push('  </url>')
  return lines.join('\n')
}

const sitemapEntries = [
  sitemapUrlEntry({
    loc: `${origin}/`,
    changefreq: 'daily',
    priority: '1.0',
    lastmod: homeLastmod,
    alternates: [['zh-CN', `${origin}/zh`], ['en', `${origin}/`], ['x-default', `${origin}/`]],
  }),
  sitemapUrlEntry({
    loc: `${origin}/zh`,
    changefreq: 'daily',
    priority: '0.9',
    lastmod: homeLastmod,
    alternates: [['zh-CN', `${origin}/zh`], ['en', `${origin}/`], ['x-default', `${origin}/`]],
  }),
  ...pages.flatMap(({ slug }) => {
    const zh = absolutePath(slug, false)
    const en = absolutePath(slug, true)
    const alternates = [['zh-CN', zh], ['en', en], ['x-default', en]]
    return [
      sitemapUrlEntry({
        loc: zh,
        changefreq: featureChangeFreq[slug] || 'weekly',
        priority: featurePriority[slug] || '0.7',
        lastmod: featureCopyLastmod,
        alternates,
      }),
      sitemapUrlEntry({
        loc: en,
        changefreq: featureChangeFreq[slug] || 'weekly',
        priority: featurePriority[slug] || '0.7',
        lastmod: featureCopyLastmod,
        alternates,
      }),
    ]
  }),
  ...trustPairs.flatMap(({ zhUrl, enUrl, lastmod }) => {
    const alternates = [['zh-CN', zhUrl], ['en', enUrl], ['x-default', enUrl]]
    return [
      sitemapUrlEntry({ loc: zhUrl, changefreq: 'monthly', priority: '0.4', lastmod, alternates }),
      sitemapUrlEntry({ loc: enUrl, changefreq: 'monthly', priority: '0.4', lastmod, alternates }),
    ]
  }),
  ...guideUrls.map(({ url, lastmod }) => sitemapUrlEntry({
    loc: url,
    changefreq: 'monthly',
    priority: '0.55',
    lastmod,
  })),
  ...[...detailPairs, ...hubPairs].flatMap(({ route, zhUrl, enUrl, lastmod }) => {
    const alternates = [['zh-CN', zhUrl], ['en', enUrl], ['x-default', enUrl]]
    const isHub = route.endsWith('/cards') || route.endsWith('/symbols') || route.endsWith('/sticks')
    const isDetail = route.includes('/card/') || route.includes('/symbol/') || route.includes('/stick/')
    return [
      sitemapUrlEntry({
        loc: zhUrl,
        changefreq: isDetail ? 'monthly' : 'weekly',
        priority: isHub ? '0.6' : '0.5',
        lastmod,
        alternates,
      }),
      sitemapUrlEntry({
        loc: enUrl,
        changefreq: isDetail ? 'monthly' : 'weekly',
        priority: isHub ? '0.6' : '0.5',
        lastmod,
        alternates,
      }),
    ]
  }),
]

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...sitemapEntries,
  '</urlset>',
  '',
].join('\n')
fs.writeFileSync(sitemapPath, sitemapXml)
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemapXml)

console.log(`Built ${pages.length} zh + ${pagesEn.length} en feature pages, ${detailPairs.length} bilingual details, ${hubPairs.length} bilingual hubs, ${trustPairs.length} trust pairs, ${guideUrls.length} EN guides, sitemap ${sitemapEntries.length} urls`)
