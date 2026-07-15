/** Build crawlable HTML entry points for every SPA feature route. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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
  ['tarot', '免费在线塔罗占卜', '在线抽取单张或过去、现在、未来三张塔罗牌，获取牌义与行动建议。', '塔罗占卜并不是替你做决定，而是用牌面意象帮你重新观察问题。可选每日一牌、单牌或三牌时空牌阵。', '结果需要付费吗？', '不需要，所有抽牌与解读均可免费使用。'],
  ['horoscope', '今日星座运势查询', '查看十二星座今日运势，了解感情、事业、财运与幸运提示。', '选择你的星座，查看今日整体、感情、事业与财运趋势，并获取幸运元素与当日建议。', '星座日期如何划分？', '按常见的西方十二星座太阳星座日期划分。'],
  ['almanac', '今日黄历宜忌查询', '在线查看今日农历、宜忌、吉时与冲煞信息。', '整合公历、农历、干支、节气、宜忌与时辰信息，方便快速查看今日民俗日历参考。', '黄历建议能代替专业决策吗？', '不能。黄历属于传统民俗参考，重要事项仍应结合现实条件。'],
  ['cybermerit', '在线赛博积德', '敲木鱼、上香与放生的轻量解压互动体验。', '通过敲木鱼、上香和趣味放生获得短暂专注，记录今日功德数值。', '这是宗教仪式吗？', '不是，这是一项仅供娱乐和放松的互动体验。'],
  ['bazi', '免费八字排盘', '输入出生时间，查看四柱八字、五行分布与命理解读。', '根据出生年、月、日、时生成四柱，展示天干地支、五行比例与相关传统文化解读。', '不知道出生时辰怎么办？', '可先使用大致时间体验，但时柱不同会影响排盘结果。'],
  ['divination', '在线抽签求签', '静心诚问，在线抽取签文并查看白话解签与行动建议。', '从一百支签中抽取今日一签，阅读签诗、白话译解、分项提示、吉宜与注意事项。', '抽签前需要做什么？', '可先明确一个具体问题，专注于同一件事后再抽取签文。'],
  ['dream', '免费周公解梦', '输入梦境关键词，查找常见意象的象征含义与心理提示。', '记录梦中人物、场景、动物和情绪，系统会组合多个梦象，提供民俗象征与心理视角的双重参考。', '梦境解析是预言吗？', '不是。它更适合用来整理情绪和联想，不应当作对未来的确定预言。'],
  ['fengshui', '在线风水罗盘', '使用在线风水罗盘查看方位与布局参考。', '借助设备方向与罗盘展示，了解八方方位、五行对应与居家布局常识。', '手机罗盘准确吗？', '结果依赖设备传感器，易受金属和磁场干扰，适合作为趣味参考。'],
  ['auspicious', '择日吉时查询', '按事项与日期筛选适合的日子和时辰。', '选择事项和日期范围，综合传统日历信息查看候选日期与时辰。', '择日结果是否绝对？', '不是。还应考虑天气、时间安排、家人与参与者的实际情况。'],
  ['numberenergy', '数字能量测试', '解读手机号、生日等数字组合的趣味能量倾向。', '输入一组对你有意义的数字，查看数字结构、核心数与趣味性格提示。', '是否会保存手机号？', '分析在当前设备中完成，请仍避免输入不必要的敏感信息。'],
  ['luckycolor', '今日幸运色测试', '根据日期生成每日幸运色与穿搭灵感。', '获取当日主色、辅助色、配色建议和穿搭灵感，为每天的衣着与配饰增加一点仪式感。', '每天的结果会变吗？', '会，结果按日期生成，同一天内查看会保持一致。'],
  ['qimen', '奇门遁甲在线排盘', '在线起局并查看九宫、八门等盘面信息。', '按时间起局，展示九宫格局与八门、九星、八神等传统术语对应。', '适合初学者吗？', '页面提供基础解读，可作为了解奇门盘面结构的入门工具。'],
  ['nametest', '免费姓名测试', '输入中文姓名，查看笔画、五格与趣味解读。', '计算姓名字符笔画与五格数理，展示名字结构、音形印象和趣味文化解读。', '支持复姓吗？', '支持常见中文复姓与多字名，生僻字可能缺少笔画数据。'],
  ['ziwei', '紫微斗数在线排盘', '输入出生信息，生成紫微斗数命盘与宫位解读。', '根据出生时间生成十二宫盘，展示主星、宫位和相关传统文化解读。', '出生时间会影响结果吗？', '会，时辰是排盘所需的重要信息，建议尽量使用准确时间。'],
  ['shengxiao', '十二生肖配对', '查看两个生肖的性格互动、相处优势与建议。', '选择两个生肖，查看传统合冲关系、性格互补点、相处摩擦与沟通建议。', '生肖不合就不适合吗？', '不是。生肖只是民俗文化角度，真实关系更取决于了解、沟通与共同经历。'],
]

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function writeDetailPage({ route, title, description, parentName, body, schemaType = 'Article' }) {
  const url = `${origin}/${route}`
  const fullTitle = `${title} | 命运工坊`
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: title,
    description,
    inLanguage: 'zh-CN',
    mainEntityOfPage: url,
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: '命运工坊' },
  }
  const crawlable = `<div id="root"><main class="seo-entry"><nav><a href="/">命运工坊</a> › <a href="/${route.split('/')[0]}">${escapeHtml(parentName)}</a></nav>${body}</main></div>`
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace('<div id="root"></div>', crawlable)
    .replace('</head>', `<script type="application/ld+json">${escapeJson(schema)}</script></head>`)
  const target = path.join(dist, route)
  fs.mkdirSync(target, { recursive: true })
  fs.writeFileSync(path.join(target, 'index.html'), html)
  return url
}

for (const [slug, title, description, intro, question, answer] of pages) {
  const url = `${origin}/${slug}`
  const fullTitle = `${title} | 命运工坊`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', name: title, url, description, applicationCategory: 'EntertainmentApplication', operatingSystem: 'Web', isAccessibleForFree: true, inLanguage: 'zh-CN' },
      { '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } }] },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: '命运工坊', item: origin },
        { '@type': 'ListItem', position: 2, name: title, item: url },
      ] },
    ],
  }
  const crawlable = `<div id="root"><main class="seo-entry"><h1>${title}</h1><p>${description}</p><h2>功能介绍</h2><p>${intro}</p><h2>常见问题</h2><h3>${question}</h3><p>${answer}</p><p><a href="/">返回命运工坊</a></p></main></div>`
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${fullTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${fullTitle}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace('<div id="root"></div>', crawlable)
    .replace('</head>', `<script type="application/ld+json">${escapeJson(schema)}</script></head>`)
  const target = path.join(dist, slug)
  fs.mkdirSync(target, { recursive: true })
  fs.writeFileSync(path.join(target, 'index.html'), html)
}

const detailUrls = []
const majorNames = ['愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车', '力量', '隐者', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', '塔', '星星', '月亮', '太阳', '审判', '世界']
const courtNames = ['侍从', '骑士', '皇后', '国王']
const suits = [['权杖', POLISH_WANDS, 22], ['圣杯', POLISH_CUPS, 36], ['宝剑', POLISH_SWORDS, 50], ['星币', POLISH_PENTACLES, 64]]
const tarotCards = majorNames.map((name, id) => ({ id, name, data: POLISH_MAJOR[id] }))
for (const [suit, polish, start] of suits) {
  for (let index = 0; index < 14; index += 1) {
    tarotCards.push({ id: start + index, name: index < 10 ? `${suit}${index + 1}` : `${suit}${courtNames[index - 10]}`, data: polish[start + index] })
  }
}
for (const card of tarotCards) {
  const title = `${card.name}塔罗牌义：正位与逆位解读`
  const description = `${card.name}的塔罗牌义，包含正位、逆位、感情、事业与行动建议。`
  detailUrls.push(writeDetailPage({ route: `tarot/card/${card.id}`, title, description, parentName: '塔罗占卜', body: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(card.data.description)}</p><h2>${card.name}正位牌义</h2><p>${escapeHtml(card.data.interpretation.upright)}</p><p><strong>建议：</strong>${escapeHtml(card.data.advice.upright)}</p><h2>${card.name}逆位牌义</h2><p>${escapeHtml(card.data.interpretation.reversed)}</p><p><strong>建议：</strong>${escapeHtml(card.data.advice.reversed)}</p><p><a href="/tarot">在线抽取塔罗牌</a> · <a href="/tarot/cards">浏览全部牌义</a></p>` }))
}

const dreamSymbols = [...POLISH_ANIMALS_NATURE, ...POLISH_PEOPLE_BUILDING, ...POLISH_ITEMS_ACTIONS]
dreamSymbols.forEach((symbol, index) => {
  const keyword = symbol.keywords[0]
  const title = `梦见${keyword}是什么意思？${keyword}梦境解析`
  detailUrls.push(writeDetailPage({ route: `dream/symbol/${index}`, title, description: `梦见${keyword}的常见象征含义、积极暗示、需要留意的方向与行动建议。`, parentName: '梦境解析', body: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(symbol.interpretation)}</p><h2>积极的可能</h2><p>${escapeHtml(symbol.positive)}</p><h2>需要留意</h2><p>${escapeHtml(symbol.negative)}</p><h2>梦后建议</h2><p>${escapeHtml(symbol.advice)}</p><p><strong>相关主题：</strong>${escapeHtml(symbol.themes.join('、'))}</p><p><a href="/dream">输入完整梦境进行解析</a> · <a href="/dream/symbols">浏览全部梦象</a></p>` }))
})

const stickPolish = { ...POLISH_1_50, ...POLISH_51_100 }
const stickSource = fs.readFileSync(path.join(root, 'src/data/divinationSticks.ts'), 'utf8')
const stickPattern = /id:\s*(\d+),\s*\n\s*level:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)',\s*\n\s*poem:\s*'([^']+)'/g
for (const match of stickSource.matchAll(stickPattern)) {
  const id = Number(match[1]); const level = match[2]; const titleText = match[3]; const poem = match[4]; const polish = stickPolish[id]
  const title = `第${id}签${titleText}解签：${level}签签文详解`
  detailUrls.push(writeDetailPage({ route: `divination/stick/${id}`, title, description: `第${id}签「${titleText}」的签诗、白话解释、典故与行事建议。`, parentName: '抽签求签', body: `<h1>${escapeHtml(title)}</h1><blockquote>${escapeHtml(poem)}</blockquote><h2>签诗白话</h2><p>${escapeHtml(PLAIN_POEMS[id])}</p><h2>签意解读</h2><p>${escapeHtml(polish.interpretation)}</p><h2>行事建议</h2><p>${escapeHtml(polish.advice)}</p><p>${escapeHtml(polish.story)}</p><p><a href="/divination">在线抽取今日一签</a> · <a href="/divination/sticks">浏览全部签文</a></p>` }))
}

const hubs = [
  { route: 'tarot/cards', title: '78 张塔罗牌牌义大全', description: '浏览全部大阿卡纳与小阿卡纳的正位、逆位牌义。', parentName: '塔罗占卜', links: tarotCards.map((card) => [`/tarot/card/${card.id}`, `${card.name}牌义`]) },
  { route: 'dream/symbols', title: '常见梦境意象解析大全', description: '查看动物、自然、人物、建筑、物品与动作类梦象。', parentName: '梦境解析', links: dreamSymbols.map((symbol, index) => [`/dream/symbol/${index}`, `梦见${symbol.keywords[0]}`]) },
  { route: 'divination/sticks', title: '一百支签文解签大全', description: '浏览第一签至第一百签的签诗、白话与行事建议。', parentName: '抽签求签', links: [...stickSource.matchAll(stickPattern)].map((match) => [`/divination/stick/${match[1]}`, `第${match[1]}签 · ${match[3]}`]) },
]

for (const hub of hubs) {
  const list = hub.links.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('')
  detailUrls.push(writeDetailPage({ ...hub, schemaType: 'CollectionPage', body: `<h1>${hub.title}</h1><p>${hub.description}</p><ul>${list}</ul>` }))
  const feature = hub.route.split('/')[0]
  const featurePath = path.join(dist, feature, 'index.html')
  const featureHtml = fs.readFileSync(featurePath, 'utf8').replace('</main></div>', `<p><a href="/${hub.route}">${hub.title}</a></p></main></div>`)
  fs.writeFileSync(featurePath, featureHtml)
}

const sitemapPath = path.join(dist, 'sitemap.xml')
const sitemap = fs.readFileSync(sitemapPath, 'utf8').replace('</urlset>', `${detailUrls.map((url) => `  <url><loc>${url}</loc><lastmod>2026-07-14</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`).join('\n')}\n</urlset>`)
fs.writeFileSync(sitemapPath, sitemap)

console.log(`Built ${pages.length} feature pages and ${detailUrls.length} long-tail SEO pages`)
