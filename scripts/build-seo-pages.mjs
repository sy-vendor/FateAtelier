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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const origin = 'https://www.fateatelier.cloud'

const pages = [
  ['tarot', '免费在线塔罗占卜', '在线抽取单张或过去、现在、未来三张塔罗牌，获取牌义与行动建议。', '塔罗占卜并不是替你做决定，而是用牌面意象帮你重新观察问题。可选每日一牌、单牌或三牌时空牌阵。', '结果需要付费吗？', '不需要，所有抽牌与解读均可免费使用。', [['/tarot/cards', '浏览全部牌义'], ['/divination', '抽签求签'], ['/dream', '梦境解析']]],
  ['horoscope', '今日星座运势查询', '查看十二星座今日运势，了解感情、事业、财运与幸运提示。', '选择你的星座，查看今日整体、感情、事业与财运趋势，并获取幸运元素与当日建议。', '星座日期如何划分？', '按常见的西方十二星座太阳星座日期划分。', [['/almanac', '今日黄历'], ['/luckycolor', '每日幸运色'], ['/shengxiao', '生肖配对']]],
  ['almanac', '今日黄历宜忌查询', '在线查看今日农历、宜忌、吉时与冲煞信息。', '整合公历、农历、干支、节气、宜忌与时辰信息，方便快速查看今日民俗日历参考。', '黄历建议能代替专业决策吗？', '不能。黄历属于传统民俗参考，重要事项仍应结合现实条件。', [['/auspicious', '择日吉时'], ['/fengshui', '风水罗盘'], ['/horoscope', '星座运势']]],
  ['cybermerit', '在线赛博积德', '敲木鱼、上香与放生的轻量解压互动体验。', '通过敲木鱼、上香和趣味放生获得短暂专注，记录今日功德数值。', '这是宗教仪式吗？', '不是，这是一项仅供娱乐和放松的互动体验。', [['/divination', '抽签求签'], ['/dream', '梦境解析']]],
  ['bazi', '免费八字排盘', '输入出生时间，查看四柱八字、五行分布与命理解读。', '根据出生年、月、日、时生成四柱，展示天干地支、五行比例与相关传统文化解读。', '不知道出生时辰怎么办？', '可先使用大致时间体验，但时柱不同会影响排盘结果。', [['/ziwei', '紫微斗数'], ['/nametest', '姓名测试'], ['/qimen', '奇门遁甲']]],
  ['divination', '在线抽签求签', '静心诚问，在线抽取签文并查看白话解签与行动建议。', '从一百支签中抽取今日一签，阅读签诗、白话译解、分项提示、吉宜与注意事项。', '抽签前需要做什么？', '可先明确一个具体问题，专注于同一件事后再抽取签文。', [['/divination/sticks', '浏览全部签文'], ['/tarot', '塔罗占卜'], ['/dream', '梦境解析']]],
  ['dream', '免费周公解梦', '输入梦境关键词，查找常见意象的象征含义与心理提示。', '记录梦中人物、场景、动物和情绪，系统会组合多个梦象，提供民俗象征与心理视角的双重参考。', '梦境解析是预言吗？', '不是。它更适合用来整理情绪和联想，不应当作对未来的确定预言。', [['/dream/symbols', '浏览全部梦象'], ['/tarot', '塔罗占卜'], ['/divination', '抽签求签']]],
  ['fengshui', '在线风水罗盘', '使用在线风水罗盘查看方位与布局参考。', '借助设备方向与罗盘展示，了解八方方位、五行对应与居家布局常识。', '手机罗盘准确吗？', '结果依赖设备传感器，易受金属和磁场干扰，适合作为趣味参考。', [['/qimen', '奇门遁甲'], ['/almanac', '今日黄历'], ['/auspicious', '择日吉时']]],
  ['auspicious', '择日吉时查询', '按事项与日期筛选适合的日子和时辰。', '选择事项和日期范围，综合传统日历信息查看候选日期与时辰。', '择日结果是否绝对？', '不是。还应考虑天气、时间安排、家人与参与者的实际情况。', [['/almanac', '今日黄历'], ['/fengshui', '风水罗盘'], ['/bazi', '八字排盘']]],
  ['numberenergy', '数字能量测试', '解读手机号、生日等数字组合的趣味能量倾向。', '输入一组对你有意义的数字，查看数字结构、核心数与趣味性格提示。', '是否会保存手机号？', '分析在当前设备中完成，请仍避免输入不必要的敏感信息。', [['/nametest', '姓名测试'], ['/luckycolor', '每日幸运色']]],
  ['luckycolor', '今日幸运色测试', '根据日期生成每日幸运色与穿搭灵感。', '获取当日主色、辅助色、配色建议和穿搭灵感，为每天的衣着与配饰增加一点仪式感。', '每天的结果会变吗？', '会，结果按日期生成，同一天内查看会保持一致。', [['/horoscope', '星座运势'], ['/almanac', '今日黄历']]],
  ['qimen', '奇门遁甲在线排盘', '在线起局并查看九宫、八门等盘面信息。', '按时间起局，展示九宫格局与八门、九星、八神等传统术语对应。', '适合初学者吗？', '页面提供基础解读，可作为了解奇门盘面结构的入门工具。', [['/fengshui', '风水罗盘'], ['/bazi', '八字排盘'], ['/ziwei', '紫微斗数']]],
  ['nametest', '免费姓名测试', '输入中文姓名，查看笔画、五格与趣味解读。', '计算姓名字符笔画与五格数理，展示名字结构、音形印象和趣味文化解读。', '支持复姓吗？', '支持常见中文复姓与多字名，生僻字可能缺少笔画数据。', [['/bazi', '八字排盘'], ['/numberenergy', '数字能量'], ['/shengxiao', '生肖配对']]],
  ['ziwei', '紫微斗数在线排盘', '输入出生信息，生成紫微斗数命盘与宫位解读。', '根据出生时间生成十二宫盘，展示主星、宫位和相关传统文化解读。', '出生时间会影响结果吗？', '会，时辰是排盘所需的重要信息，建议尽量使用准确时间。', [['/bazi', '八字排盘'], ['/qimen', '奇门遁甲'], ['/horoscope', '星座运势']]],
  ['shengxiao', '十二生肖配对', '查看两个生肖的性格互动、相处优势与建议。', '选择两个生肖，查看传统合冲关系、性格互补点、相处摩擦与沟通建议。', '生肖不合就不适合吗？', '不是。生肖只是民俗文化角度，真实关系更取决于了解、沟通与共同经历。', [['/horoscope', '星座运势'], ['/nametest', '姓名测试'], ['/bazi', '八字排盘']]],
]

const pagesEn = [
  ['tarot', 'Free Online Tarot Reading', 'Draw one or three tarot cards for insight, meanings, and practical guidance.', 'Tarot does not decide for you—it uses card imagery to help you see your question from a fresh angle. Choose a daily card, a single draw, or a past-present-future spread on Fate Atelier.', 'Is tarot reading free?', 'Yes. All card draws and readings are free on Fate Atelier.', [['/en/tarot/cards', 'Browse all card meanings'], ['/en/divination', 'Online fortune sticks'], ['/en/dream', 'Dream meaning guide']]],
  ['horoscope', 'Daily Horoscope', 'Explore today’s outlook for love, career, money, and luck across all zodiac signs.', 'Pick your sign to review today’s overall mood, love, career, and wealth trends, plus lucky elements and daily tips.', 'How are zodiac sign dates defined?', 'By standard Western sun-sign date ranges used in most horoscope calendars.', [['/en/almanac', 'Chinese daily almanac'], ['/en/luckycolor', 'Today’s lucky color'], ['/en/shengxiao', 'Chinese zodiac compatibility']]],
  ['almanac', 'Chinese Daily Almanac', 'Check the lunar date, favorable activities, auspicious hours, and daily guidance.', 'See Gregorian and lunar dates, stems and branches, solar terms, daily dos and don’ts, and hour guidance in one quick traditional calendar view.', 'Can almanac advice replace professional decisions?', 'No. It is cultural reference only—important choices should still follow real-world conditions.', [['/en/auspicious', 'Auspicious date finder'], ['/en/fengshui', 'Online feng shui compass'], ['/en/horoscope', 'Daily horoscope']]],
  ['cybermerit', 'Cyber Merit Practice', 'Relax with virtual wooden fish, incense, and compassionate release rituals.', 'Tap a wooden fish, light incense, and try a playful release ritual for a moment of calm while tracking your daily merit score.', 'Is this a religious ritual?', 'No. It is a light, entertainment-focused relaxation experience on Fate Atelier.', [['/en/divination', 'Online fortune sticks'], ['/en/dream', 'Dream meaning guide']]],
  ['bazi', 'Free BaZi Chart', 'Generate your Four Pillars chart and explore the balance of the five elements.', 'Enter your birth year, month, day, and hour to generate the Four Pillars, view stems and branches, element balance, and traditional cultural readings.', 'What if I do not know my birth hour?', 'You can try an approximate time, but a different hour pillar will change the chart.', [['/en/ziwei', 'Zi Wei Dou Shu chart'], ['/en/nametest', 'Chinese name reading'], ['/en/qimen', 'Qi Men Dun Jia chart']]],
  ['divination', 'Online Fortune Sticks', 'Draw a fortune stick and receive a clear interpretation with practical advice.', 'Draw one stick from a hundred, then read the poem, plain-language meaning, themed tips, auspicious notes, and cautions.', 'What should I do before drawing a stick?', 'Focus on one clear question, then draw when you feel ready.', [['/en/divination/sticks', 'Browse all stick readings'], ['/en/tarot', 'Free online tarot reading'], ['/en/dream', 'Dream meaning guide']]],
  ['dream', 'Dream Meaning Guide', 'Explore the symbolism and emotional meaning of common dream imagery.', 'Log people, scenes, animals, and emotions from your dream—the tool combines symbols for folk meaning and psychological perspective.', 'Is dream analysis a prophecy?', 'No. It helps sort emotions and associations, not predict the future with certainty.', [['/en/dream/symbols', 'Browse all dream symbols'], ['/en/tarot', 'Free online tarot reading'], ['/en/divination', 'Online fortune sticks']]],
  ['fengshui', 'Online Feng Shui Compass', 'Explore directions and receive practical Feng Shui layout guidance.', 'Use your device orientation and a compass view to explore the eight directions, element correspondences, and home layout basics.', 'Is the phone compass accurate?', 'It depends on your device sensor and can be affected by metal or magnets—best used as a fun reference.', [['/en/qimen', 'Qi Men Dun Jia chart'], ['/en/almanac', 'Chinese daily almanac'], ['/en/auspicious', 'Auspicious date finder']]],
  ['auspicious', 'Auspicious Date Finder', 'Find favorable dates and hours for important activities.', 'Choose an activity and date range, then review candidate days and hours through traditional calendar cues.', 'Are auspicious dates guaranteed to work?', 'No. Also consider weather, schedules, and everyone involved in the event.', [['/en/almanac', 'Chinese daily almanac'], ['/en/fengshui', 'Online feng shui compass'], ['/en/bazi', 'Free BaZi chart']]],
  ['numberenergy', 'Number Energy Reading', 'Discover playful energy patterns in phone numbers, birthdays, and more.', 'Enter numbers that matter to you—phone, birthday, or other combinations—to see structure, core numbers, and playful personality hints.', 'Do you store my phone number?', 'Analysis runs on your device. Avoid entering unnecessary sensitive information.', [['/en/nametest', 'Chinese name reading'], ['/en/luckycolor', 'Today’s lucky color']]],
  ['luckycolor', 'Today’s Lucky Color', 'Find your daily lucky color and outfit inspiration.', 'Get today’s main color, accent palette, pairing tips, and outfit ideas to add a little daily ritual.', 'Does the result change every day?', 'Yes. Results are date-based and stay the same throughout the day.', [['/en/horoscope', 'Daily horoscope'], ['/en/almanac', 'Chinese daily almanac']]],
  ['qimen', 'Qi Men Dun Jia Chart', 'Create a Qi Men chart and explore its palaces, gates, and patterns.', 'Chart by time to view the nine palaces with gates, stars, and spirits—traditional terms with basic explanations for newcomers.', 'Is this good for beginners?', 'Yes. The page offers basic explanations as an entry point to Qi Men chart structure.', [['/en/fengshui', 'Online feng shui compass'], ['/en/bazi', 'Free BaZi chart'], ['/en/ziwei', 'Zi Wei Dou Shu chart']]],
  ['nametest', 'Chinese Name Reading', 'Explore the strokes, five grids, and playful meaning of a Chinese name.', 'Calculates Chinese name strokes and five-grid numerology with structure, sound, and playful cultural notes.', 'Does it support compound surnames?', 'Yes for common Chinese compound surnames. Rare characters may lack stroke data.', [['/en/bazi', 'Free BaZi chart'], ['/en/numberenergy', 'Number energy reading'], ['/en/shengxiao', 'Chinese zodiac compatibility']]],
  ['ziwei', 'Zi Wei Dou Shu Chart', 'Generate a Zi Wei astrology chart and explore its palaces.', 'Generate a twelve-palace chart from birth time with major stars, palace themes, and traditional readings.', 'Does birth time affect the chart?', 'Yes. The hour matters, so use the most accurate birth time you have.', [['/en/bazi', 'Free BaZi chart'], ['/en/qimen', 'Qi Men Dun Jia chart'], ['/en/horoscope', 'Daily horoscope']]],
  ['shengxiao', 'Chinese Zodiac Compatibility', 'Explore compatibility, strengths, and advice for two Chinese zodiac signs.', 'Pick two zodiac signs to explore traditional harmony and clash, strengths, friction points, and communication tips.', 'If signs clash, is the match doomed?', 'No. Zodiac is one cultural lens—real relationships depend on communication and shared experience.', [['/en/horoscope', 'Daily horoscope'], ['/en/nametest', 'Chinese name reading'], ['/en/bazi', 'Free BaZi chart']]],
]

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
    .replace('<div id="root"></div>', body)
  const headExtras = [
    hreflangRoute != null ? hreflangBlock(hreflangRoute) : '',
    jsonLd ? `<script type="application/ld+json">${escapeJson(jsonLd)}</script>` : '',
  ].filter(Boolean).join('\n    ')
  next = next.replace('</head>', `    ${headExtras}\n  </head>`)
  return next
}

function writeFeaturePage(entry, english) {
  const [slug, title, description, intro, question, answer, related = []] = entry
  const brand = english ? 'Fate Atelier' : '命运工坊'
  const url = absolutePath(slug, english)
  const route = english ? `en/${slug}` : slug
  const relatedTitle = english ? 'Related tools' : '相关功能'
  const homeLabel = english ? 'Back to Fate Atelier' : '返回命运工坊'
  const homeHref = english ? '/en' : '/'
  const introTitle = english ? 'About this tool' : '功能介绍'
  const faqTitle = english ? 'FAQ' : '常见问题'
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
        '@type': 'FAQPage',
        mainEntity: [{ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } }],
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
  const body = `<div id="root"><main class="seo-entry"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><h2>${introTitle}</h2><p>${escapeHtml(intro)}</p><h2>${faqTitle}</h2><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>${relatedHtml}<p><a href="${homeHref}">${homeLabel}</a></p></main></div>`
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

// English home landing
{
  const title = 'Fate Atelier | Tarot, BaZi, Zi Wei & Divination Tools'
  const description = 'Free online divination tools: tarot, horoscope, Chinese almanac, BaZi, fortune sticks, dream guide, and more.'
  const links = pagesEn.map(([slug, , , , , , ], index) => {
    const name = pagesEn[index][1]
    return `<li><a href="/en/${slug}">${escapeHtml(name)}</a></li>`
  }).join('')
  const body = `<div id="root"><main class="seo-entry"><h1>Fate Atelier</h1><p>${escapeHtml(description)}</p><h2>Explore tools</h2><ul>${links}</ul><p><a href="/">中文版</a></p></main></div>`
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

// Add hreflang to Chinese homepage template output if present
{
  const homePath = path.join(dist, 'index.html')
  let home = fs.readFileSync(homePath, 'utf8')
  if (!home.includes('hreflang="en"')) {
    home = home
      .replace('</head>', `    ${hreflangBlock('')}\n  </head>`)
    fs.writeFileSync(homePath, home)
  }
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
  ...pages.flatMap(([slug]) => {
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
