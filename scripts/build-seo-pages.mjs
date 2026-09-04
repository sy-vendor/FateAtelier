/** Build crawlable HTML entry points for every SPA feature route (zh + en). */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const origin = 'https://www.fateatelier.cloud'
const pages = pagesZh

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function absolutePath(route, english = false) {
  const cleaned = String(route || '').replace(/^\/+|\/+$/g, '')
  if (english) return cleaned ? `${origin}/en/${cleaned}` : `${origin}/en`
  return cleaned ? `${origin}/${cleaned}` : `${origin}/`
}

function hreflangBlock(route) {
  const zh = absolutePath(route, false)
  const en = absolutePath(route, true)
  return [
    `<link rel="alternate" hreflang="zh-CN" href="${zh}" />`,
    `<link rel="alternate" hreflang="en" href="${en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${zh}" />`,
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

function applyShell(html, { title, description, url, lang, locale, hreflangRoute, jsonLd, body }) {
  const brand = lang === 'en' ? 'Fate Atelier' : '命运工坊'
  let next = html
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta name="language" content="[^"]*"\s*\/>/, `<meta name="language" content="${lang}" />`)
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
    .replace('<div id="root"></div>', body)
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
  const route = english ? `en/${slug}` : slug
  const relatedTitle = english ? 'Related tools' : '相关功能'
  const homeLabel = english ? 'Back to Fate Atelier' : '返回命运工坊'
  const homeHref = english ? '/en' : '/'
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
      {
        '@type': 'HowTo',
        name: english ? `How to use ${title}` : `如何使用${title}`,
        description: intro,
        step: steps.map((text, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: english ? `Step ${index + 1}` : `步骤 ${index + 1}`,
          text,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: brand, item: english ? `${origin}/en` : origin },
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

function writeDetailPage({ route, title, description, parentName, parentHref, body, schemaType = 'Article', english = false, withHreflang = false }) {
  const brand = english ? 'Fate Atelier' : '命运工坊'
  const url = absolutePath(route, english)
  const outputRoute = english ? `en/${route}` : route
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: title,
    description,
    inLanguage: english ? 'en' : 'zh-CN',
    mainEntityOfPage: url,
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: brand },
  }
  const homeHref = english ? '/en' : '/'
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
    const href = english ? `/en/${entry.slug}` : `/${entry.slug}`
    return `<li><a href="${href}"><strong>${escapeHtml(entry.title)}</strong> — ${escapeHtml(entry.description)}</a></li>`
  }).join('')
}

// English home landing
{
  const title = 'Fate Atelier | Free Tarot, BaZi, Zi Wei & Divination Tools'
  const description = 'Free online divination workshop: tarot spreads, horoscope, Chinese almanac, BaZi, fortune sticks, dream guide, feng shui, and more—with clear how-to guides in English.'
  const intro = 'Fate Atelier is a free browser workshop for traditional and modern divination play. Each tool includes a short intro, what you can try, step-by-step how-to, and FAQ so you can start without an account.'
  const howTitle = 'How to explore'
  const howSteps = [
    'Pick a tool below that matches your question—cards, calendar, chart, or a calm ritual.',
    'Follow the on-page how-to: clarify intent, complete the draw or input, then read guidance.',
    'Use related tools to cross-check, and switch to 中文 anytime from the language control.',
  ]
  const body = `<div id="root"><main class="seo-entry"><h1>Fate Atelier</h1><p>${escapeHtml(description)}</p><h2>About the workshop</h2><p>${escapeHtml(intro)}</p><h2>${howTitle}</h2><ol>${howSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol><h2>Explore tools</h2><ul>${homeToolList(pagesEn, true)}</ul><p><a href="/">中文版</a></p></main></div>`
  const html = applyShell(template, {
    title,
    description,
    url: `${origin}/en`,
    lang: 'en',
    locale: 'en_US',
    hreflangRoute: '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Fate Atelier',
      url: `${origin}/en`,
      description,
      inLanguage: 'en',
      isAccessibleForFree: true,
    },
    body,
  })
  writeRouteHtml('en', html)
}

// Chinese homepage crawlable intro (keep SPA shell, enrich #root for bots)
{
  const homePath = path.join(dist, 'index.html')
  let home = fs.readFileSync(homePath, 'utf8')
  if (!home.includes('hreflang="en"')) {
    home = home.replace('</head>', `    ${hreflangBlock('')}\n  </head>`)
  }
  if (!home.includes('玩法介绍')) {
    const title = '命运工坊'
    const description = '免费在线综合占卜工坊：塔罗牌阵、星座运势、黄历宜忌、八字紫微、抽签解梦、风水择日等，含玩法介绍与常见问题。'
    const intro = '命运工坊把多种传统与现代占卜玩法放在同一个网页里：先看功能介绍与步骤，再直接体验抽牌、排盘或今日仪式，无需下载。'
    const howSteps = [
      '从下方功能中选择与问题最贴近的工具。',
      '按页面「玩法介绍」完成提问、抽取或输入。',
      '阅读结果后，可跳转相关功能交叉参考，或切换到 English。',
    ]
    const seoBody = `<div id="root"><main class="seo-entry"><h1>${title}</h1><p>${escapeHtml(description)}</p><h2>工坊介绍</h2><p>${escapeHtml(intro)}</p><h2>玩法介绍</h2><ol>${howSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol><h2>全部功能</h2><ul>${homeToolList(pages, false)}</ul><p><a href="/en">English</a></p></main></div>`
    home = home
      .replace(/<title>.*?<\/title>/, `<title>${title} | 免费在线占卜与命理工具</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace('<div id="root"></div>', seoBody)
  }
  fs.writeFileSync(homePath, home)
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
for (const card of tarotCards) {
  const route = `tarot/card/${card.id}`
  const title = `${card.name}塔罗牌义：正位与逆位解读`
  const description = `${card.name}的塔罗牌义，包含正位、逆位、感情、事业与行动建议。`
  const enData = tarotCardsEn[card.id]
  const titleEn = `${card.nameEn} Tarot Meaning: Upright & Reversed`
  const descriptionEn = `${card.nameEn} tarot meaning with upright, reversed, love, career, and action guidance.`
  const zhUrl = writeDetailPage({
    route,
    title,
    description,
    parentName: '塔罗占卜',
    parentHref: '/tarot',
    withHreflang: true,
    body: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(card.data.description)}</p><h2>${card.name}正位牌义</h2><p>${escapeHtml(card.data.interpretation.upright)}</p><p><strong>建议：</strong>${escapeHtml(card.data.advice.upright)}</p><h2>${card.name}逆位牌义</h2><p>${escapeHtml(card.data.interpretation.reversed)}</p><p><strong>建议：</strong>${escapeHtml(card.data.advice.reversed)}</p><p><a href="/tarot">在线抽取塔罗牌</a> · <a href="/tarot/cards">浏览全部牌义</a></p>`,
  })
  const enUrl = writeDetailPage({
    route,
    title: titleEn,
    description: descriptionEn,
    parentName: 'Tarot Reading',
    parentHref: '/en/tarot',
    english: true,
    withHreflang: true,
    body: `<h1>${escapeHtml(titleEn)}</h1><p>${escapeHtml(enData.description)}</p><h2>${escapeHtml(card.nameEn)} upright</h2><p>${escapeHtml(enData.interpretation.upright)}</p><p><strong>Advice:</strong> ${escapeHtml(enData.advice.upright)}</p><h2>${escapeHtml(card.nameEn)} reversed</h2><p>${escapeHtml(enData.interpretation.reversed)}</p><p><strong>Advice:</strong> ${escapeHtml(enData.advice.reversed)}</p><p><a href="/en/tarot">Draw tarot online</a> · <a href="/en/tarot/cards">Browse all card meanings</a></p>`,
  })
  detailPairs.push({ route, zhUrl, enUrl })
}

const dreamSymbols = [...POLISH_ANIMALS_NATURE, ...POLISH_PEOPLE_BUILDING, ...POLISH_ITEMS_ACTIONS]
dreamSymbols.forEach((symbol, index) => {
  const route = `dream/symbol/${index}`
  const keyword = symbol.keywords[0]
  const title = `梦见${keyword}是什么意思？${keyword}梦境解析`
  const en = dreamSymbolsEn[index]
  const enKeyword = en?.keywords?.find((word) => /^[a-z]/i.test(word)) ?? keyword
  const titleEn = `Dream of ${enKeyword}: Meaning & Guidance`
  const zhUrl = writeDetailPage({
    route,
    title,
    description: `梦见${keyword}的常见象征含义、积极暗示、需要留意的方向与行动建议。`,
    parentName: '梦境解析',
    parentHref: '/dream',
    withHreflang: true,
    body: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(symbol.interpretation)}</p><h2>积极的可能</h2><p>${escapeHtml(symbol.positive)}</p><h2>需要留意</h2><p>${escapeHtml(symbol.negative)}</p><h2>梦后建议</h2><p>${escapeHtml(symbol.advice)}</p><p><strong>相关主题：</strong>${escapeHtml(symbol.themes.join('、'))}</p><p><a href="/dream">输入完整梦境进行解析</a> · <a href="/dream/symbols">浏览全部梦象</a></p>`,
  })
  const enUrl = writeDetailPage({
    route,
    title: titleEn,
    description: en?.meaningEn || `Symbolic meaning and guidance for dreams of ${enKeyword}.`,
    parentName: 'Dream Guide',
    parentHref: '/en/dream',
    english: true,
    withHreflang: true,
    body: `<h1>${escapeHtml(titleEn)}</h1><p>${escapeHtml(en.interpretationEn)}</p><h2>Positive possibilities</h2><p>${escapeHtml(en.positiveEn)}</p><h2>Watch for</h2><p>${escapeHtml(en.negativeEn)}</p><h2>After the dream</h2><p>${escapeHtml(en.adviceEn)}</p><p><strong>Themes:</strong> ${escapeHtml(en.themesEn.join(', '))}</p><p><a href="/en/dream">Interpret a full dream</a> · <a href="/en/dream/symbols">Browse all symbols</a></p>`,
  })
  detailPairs.push({ route, zhUrl, enUrl })
})

const stickPolish = { ...POLISH_1_50, ...POLISH_51_100 }
const stickSource = fs.readFileSync(path.join(root, 'src/data/divinationSticks.ts'), 'utf8')
const stickPattern = /id:\s*(\d+),\s*\n\s*level:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)',\s*\n\s*poem:\s*'([^']+)'/g
for (const match of stickSource.matchAll(stickPattern)) {
  const id = Number(match[1]); const level = match[2]; const titleText = match[3]; const poem = match[4]; const polish = stickPolish[id]
  const route = `divination/stick/${id}`
  const title = `第${id}签${titleText}解签：${level}签签文详解`
  const en = divinationSticksEn[id]
  const titleEn = `Stick #${id}: ${en.titleEn} (${en.levelEn})`
  const zhUrl = writeDetailPage({
    route,
    title,
    description: `第${id}签「${titleText}」的签诗、白话解释、典故与行事建议。`,
    parentName: '抽签求签',
    parentHref: '/divination',
    withHreflang: true,
    body: `<h1>${escapeHtml(title)}</h1><blockquote>${escapeHtml(poem)}</blockquote><h2>签诗白话</h2><p>${escapeHtml(PLAIN_POEMS[id])}</p><h2>签意解读</h2><p>${escapeHtml(polish.interpretation)}</p><h2>行事建议</h2><p>${escapeHtml(polish.advice)}</p><p>${escapeHtml(polish.story)}</p><p><a href="/divination">在线抽取今日一签</a> · <a href="/divination/sticks">浏览全部签文</a></p>`,
  })
  const enUrl = writeDetailPage({
    route,
    title: titleEn,
    description: `Fortune stick #${id} 「${en.titleEn}」 with poem reading, meaning, and practical advice.`,
    parentName: 'Fortune Sticks',
    parentHref: '/en/divination',
    english: true,
    withHreflang: true,
    body: `<h1>${escapeHtml(titleEn)}</h1><blockquote>${escapeHtml(poem)}</blockquote><h2>Plain reading</h2><p>${escapeHtml(en.plainPoemEn)}</p><h2>Interpretation</h2><p>${escapeHtml(en.interpretationEn)}</p><h2>Advice</h2><p>${escapeHtml(en.adviceEn)}</p>${en.storyEn ? `<p>${escapeHtml(en.storyEn)}</p>` : ''}<p><a href="/en/divination">Draw today’s stick</a> · <a href="/en/divination/sticks">Browse all sticks</a></p>`,
  })
  detailPairs.push({ route, zhUrl, enUrl })
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
    parentHref: '/tarot',
    parentHrefEn: '/en/tarot',
    links: tarotCards.map((card) => [`/tarot/card/${card.id}`, `${card.name}牌义`]),
    linksEn: tarotCards.map((card) => [`/en/tarot/card/${card.id}`, `${card.nameEn} meaning`]),
  },
  {
    route: 'dream/symbols',
    title: '常见梦境意象解析大全',
    titleEn: 'Common Dream Symbol Guide',
    description: '查看动物、自然、人物、建筑、物品与动作类梦象。',
    descriptionEn: 'Explore dream symbols across animals, nature, people, places, objects, and actions.',
    parentName: '梦境解析',
    parentNameEn: 'Dream Guide',
    parentHref: '/dream',
    parentHrefEn: '/en/dream',
    links: dreamSymbols.map((symbol, index) => [`/dream/symbol/${index}`, `梦见${symbol.keywords[0]}`]),
    linksEn: dreamSymbols.map((_, index) => {
      const en = dreamSymbolsEn[index]
      const enKeyword = en?.keywords?.find((word) => /^[a-z]/i.test(word)) ?? en?.keywords?.[0] ?? `symbol-${index}`
      return [`/en/dream/symbol/${index}`, `Dream of ${enKeyword}`]
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
    parentHref: '/divination',
    parentHrefEn: '/en/divination',
    links: [...stickSource.matchAll(stickPattern)].map((match) => [`/divination/stick/${match[1]}`, `第${match[1]}签 · ${match[3]}`]),
    linksEn: [...stickSource.matchAll(stickPattern)].map((match) => {
      const id = Number(match[1])
      const en = divinationSticksEn[id]
      return [`/en/divination/stick/${id}`, `Stick #${id} · ${en?.titleEn || match[3]}`]
    }),
  },
]

const hubPairs = []
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
    body: `<h1>${hub.title}</h1><p>${hub.description}</p><ul>${list}</ul>`,
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
    body: `<h1>${escapeHtml(hub.titleEn)}</h1><p>${escapeHtml(hub.descriptionEn)}</p><ul>${listEn}</ul>`,
  })
  hubPairs.push({ route: hub.route, zhUrl, enUrl })

  const feature = hub.route.split('/')[0]
  const featurePath = path.join(dist, feature, 'index.html')
  const featureHtml = fs.readFileSync(featurePath, 'utf8').replace('</main></div>', `<p><a href="/${hub.route}">${hub.title}</a></p></main></div>`)
  fs.writeFileSync(featurePath, featureHtml)
  fs.writeFileSync(path.join(dist, `${feature}.html`), featureHtml)

  const featureEnPath = path.join(dist, 'en', feature, 'index.html')
  const featureEnHtml = fs.readFileSync(featureEnPath, 'utf8').replace('</main></div>', `<p><a href="/en/${hub.route}">${hub.titleEn}</a></p></main></div>`)
  fs.writeFileSync(featureEnPath, featureEnHtml)
  fs.writeFileSync(path.join(dist, 'en', `${feature}.html`), featureEnHtml)
}

const sitemapPath = path.join(dist, 'sitemap.xml')
const today = new Date().toISOString().slice(0, 10)
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

function sitemapUrlEntry({ loc, changefreq, priority, alternates }) {
  const lines = [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
  ]
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
    alternates: [['zh-CN', `${origin}/`], ['en', `${origin}/en`], ['x-default', `${origin}/`]],
  }),
  sitemapUrlEntry({
    loc: `${origin}/en`,
    changefreq: 'daily',
    priority: '0.9',
    alternates: [['zh-CN', `${origin}/`], ['en', `${origin}/en`], ['x-default', `${origin}/`]],
  }),
  ...pages.flatMap(({ slug }) => {
    const zh = absolutePath(slug, false)
    const en = absolutePath(slug, true)
    const alternates = [['zh-CN', zh], ['en', en], ['x-default', zh]]
    return [
      sitemapUrlEntry({
        loc: zh,
        changefreq: featureChangeFreq[slug] || 'weekly',
        priority: featurePriority[slug] || '0.7',
        alternates,
      }),
      sitemapUrlEntry({
        loc: en,
        changefreq: featureChangeFreq[slug] || 'weekly',
        priority: featurePriority[slug] || '0.7',
        alternates,
      }),
    ]
  }),
  ...[...detailPairs, ...hubPairs].flatMap(({ route, zhUrl, enUrl }) => {
    const alternates = [['zh-CN', zhUrl], ['en', enUrl], ['x-default', zhUrl]]
    const isHub = route.endsWith('/cards') || route.endsWith('/symbols') || route.endsWith('/sticks')
    const isDetail = route.includes('/card/') || route.includes('/symbol/') || route.includes('/stick/')
    return [
      sitemapUrlEntry({
        loc: zhUrl,
        changefreq: isDetail ? 'monthly' : 'weekly',
        priority: isHub ? '0.6' : '0.5',
        alternates,
      }),
      sitemapUrlEntry({
        loc: enUrl,
        changefreq: isDetail ? 'monthly' : 'weekly',
        priority: isHub ? '0.6' : '0.5',
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

console.log(`Built ${pages.length} zh + ${pagesEn.length} en feature pages, ${detailPairs.length} bilingual details, ${hubPairs.length} bilingual hubs, sitemap ${sitemapEntries.length} urls`)
