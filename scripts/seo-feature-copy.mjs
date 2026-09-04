/** Bilingual SEO copy for crawlable feature landing pages. */

const FREE_VALUE_FAQ_ZH = {
  q: '需要付费或看广告吗？',
  a: '不需要。相关功能均可免费使用，无广告打扰，也无需注册登录。',
}

const FREE_VALUE_FAQ_EN = {
  q: 'Is it free? Are there ads or sign-ups?',
  a: 'Yes. Fate Atelier tools are free and ad-free, with no account required.',
}

function enrichPages(pages, faq, locale) {
  return pages.map((page) => {
    const hasFreeFaq = page.faqs.some((f) =>
      locale === 'zh'
        ? /付费|免费|广告|注册|登录/.test(`${f.q}${f.a}`)
        : /free|ads?|account|sign.?up|login/i.test(`${f.q}${f.a}`),
    )

    const faqs = hasFreeFaq
      ? page.faqs.map((f) => {
          if (locale === 'zh' && /付费|免费/.test(f.q) && !f.a.includes('无广告')) {
            return { ...f, a: `${f.a.replace(/。$/, '')}。无广告打扰，也无需注册登录。` }
          }
          if (locale === 'en' && /free/i.test(f.q) && !/ad-free/i.test(f.a)) {
            return { ...f, a: `${f.a.replace(/\.$/, '')}. It is also ad-free, with no account required.` }
          }
          if (locale === 'en' && /account/i.test(f.q) && !/ad-free|free/i.test(f.a)) {
            return { ...f, a: `${f.a.replace(/\.$/, '')} The tools stay free and ad-free.` }
          }
          if (locale === 'zh' && /登录|注册/.test(f.q) && !f.a.includes('无广告')) {
            return { ...f, a: `${f.a.replace(/。$/, '')}。全程免费、无广告。` }
          }
          return f
        })
      : [faq, ...page.faqs]

    let { description, intro } = page
    if (locale === 'zh') {
      if (!description.includes('无广告')) {
        description = `${description.replace(/。$/, '')}。免费无广告，无需注册。`
      }
      if (!intro.includes('无广告')) {
        intro = `${intro.replace(/。$/, '')}。全程免费、无广告、无需注册。`
      }
    } else {
      if (!/ad-free/i.test(description)) {
        description = `${description.replace(/\.$/, '')}. Free, ad-free, no signup.`
      }
      if (!/ad-free/i.test(intro)) {
        intro = `${intro.replace(/\.$/, '')} Free, ad-free, and no account required.`
      }
    }

    return { ...page, description, intro, faqs }
  })
}

const pagesZhRaw = [
  {
    slug: 'tarot',
    title: '免费在线塔罗占卜',
    description: '在线免费抽塔罗牌：每日一牌、单牌洞察与过去现在未来三牌牌阵，含正逆位牌义与行动建议。',
    intro: '命运工坊的塔罗占卜用牌面意象帮你换个角度看问题，而不是替你做决定。无论是想快速看今日提示，还是梳理一段关系或选择的来龙去脉，都可以在网页上完成完整抽牌与解读，无需下载、无需付费。',
    modes: [
      { name: '每日一牌', text: '每天揭示一张当日牌面，适合养成轻量的晨间或睡前仪式，快速感受今日能量与关注点。' },
      { name: '单牌洞察', text: '默念一个具体问题后抽取一张牌，获得对当下处境更直接的提示，并可切换正逆位对照阅读。' },
      { name: '三牌时空', text: '一次抽三张牌，分别对应过去、现在与未来，并附带综合解读，适合梳理事件脉络与下一步方向。' },
      { name: '牌义图鉴', text: '浏览全部 78 张大阿卡纳与小阿卡纳，按花色筛选或搜索牌名，随时查阅正位、逆位与建议。' },
    ],
    steps: [
      '先想清楚一个具体问题，或今天最想留意的主题。',
      '选择每日一牌、单牌洞察或三牌时空牌阵。',
      '翻开牌面，阅读正逆位牌义、主题提示与可执行的行动建议。',
      '需要对照时，可进入牌义图鉴查看完整 78 张牌解释。',
    ],
    faqs: [
      { q: '结果需要付费吗？', a: '不需要。抽牌、正逆位解读与行动建议均可免费使用。' },
      { q: '正位和逆位有什么区别？', a: '正位通常强调主题能量较顺畅的一面；逆位更提示阻滞、内耗或需要调整的角度。同一张牌在不同朝向下含义会有差别。' },
      { q: '塔罗结果能当最终决定吗？', a: '不建议。塔罗更适合用来整理情绪与看见选项，重要决定仍应结合现实条件与自身判断。' },
    ],
    related: [['/tarot/cards', '浏览全部牌义'], ['/divination', '抽签求签'], ['/dream', '梦境解析']],
  },
  {
    slug: 'horoscope',
    title: '今日星座运势查询',
    description: '免费查看十二星座今日运势，覆盖整体、感情、事业、财运与幸运提示，帮助安排一天节奏。',
    intro: '今日星座运势按西方太阳星座日期划分，帮你快速了解当天情绪与运势倾向。适合早晨打开看一眼，再决定沟通、推进工作或休息调整的重点。',
    modes: [
      { name: '十二星座速览', text: '切换白羊到双鱼，查看每个星座当日整体氛围。' },
      { name: '分项运势', text: '阅读感情、事业、财运等方向的当日提示，而不是只有一句笼统结论。' },
      { name: '幸运元素', text: '获取当日幸运相关提示，搭配黄历或幸运色做轻量仪式感安排。' },
    ],
    steps: [
      '确认自己的太阳星座，或按出生日期对照常见划分。',
      '打开对应星座，阅读今日整体运势。',
      '再看感情、事业、财运分项与幸运提示。',
      '把有用的一句建议落到今天的具体行动上。',
    ],
    faqs: [
      { q: '星座日期如何划分？', a: '按常见的西方十二星座太阳星座日期划分。若生日落在交界日，可对照两相邻星座阅读。' },
      { q: '每天运势会变吗？', a: '会。页面按日期更新，同一天内反复查看通常保持一致。' },
      { q: '和农历黄历冲突听谁的？', a: '两者体系不同，可作互补参考，不必互相否定；重要安排仍以现实条件为准。' },
    ],
    related: [['/almanac', '今日黄历'], ['/luckycolor', '每日幸运色'], ['/shengxiao', '生肖配对']],
  },
  {
    slug: 'almanac',
    title: '今日黄历宜忌查询',
    description: '在线查看今日农历、干支、节气、宜忌、冲煞与吉时，快速获取传统日历参考。',
    intro: '今日黄历把公历与农历信息放在一起，方便你在出行、签约、拜访或日常安排前做民俗层面的快速对照。它是文化参考工具，不是必须遵守的硬性规定。',
    modes: [
      { name: '日期总览', text: '同时查看公历、农历、干支与节气信息。' },
      { name: '宜忌清单', text: '浏览当日适宜与不宜事项，帮助避开明显冲突的安排。' },
      { name: '时辰参考', text: '结合吉时与冲煞信息，为重要时段做粗略筛选。' },
    ],
    steps: [
      '打开今日黄历，确认公历与农历日期。',
      '浏览宜忌事项，对照今天计划中的关键安排。',
      '若有重要时段，再查看时辰与冲煞提示。',
      '需要选日子时，可跳转择日吉时做更细筛选。',
    ],
    faqs: [
      { q: '黄历建议能代替专业决策吗？', a: '不能。黄历属于传统民俗参考，婚礼、开业、医疗等重要事项仍应结合现实条件与专业意见。' },
      { q: '宜忌很多，必须全部遵守吗？', a: '不必。可优先关注与今天计划直接相关的条目，其余作了解即可。' },
      { q: '时区怎么算？', a: '页面按常见历书逻辑展示当日信息；跨境旅行时请以当地日期与行程安排为主。' },
    ],
    related: [['/auspicious', '择日吉时'], ['/fengshui', '风水罗盘'], ['/horoscope', '星座运势']],
  },
  {
    slug: 'cybermerit',
    title: '在线赛博积德',
    description: '免费在线敲木鱼、上香与趣味放生，轻松解压并记录今日功德，适合碎片时间放松。',
    intro: '赛博积德是轻松向的互动体验：用敲击、上香和放生小仪式帮你把注意力拉回当下。它强调放松与节奏感，不宣扬宗教义务，也不替代真实公益行动。',
    modes: [
      { name: '敲木鱼', text: '连续轻点获得节奏反馈，适合短时专注与情绪降温。' },
      { name: '上香', text: '完成一次安静的视觉仪式，给自己几秒停顿空间。' },
      { name: '趣味放生', text: '以轻松互动表达善意想象，并累计今日功德数值。' },
    ],
    steps: [
      '进入赛博积德页面，选择想体验的互动。',
      '跟随节奏敲木鱼，或完成上香、放生动作。',
      '查看今日功德累计，把注意力放回呼吸与身体。',
      '若仍想继续静心，可再去抽签或做一次塔罗。',
    ],
    faqs: [
      { q: '这是宗教仪式吗？', a: '不是。这是娱乐向、解压向的互动体验，不代表任何宗教场所或法会。' },
      { q: '功德数值有实际意义吗？', a: '主要是趣味记录与自我激励，请勿当作现实功德或功德转让依据。' },
      { q: '需要登录吗？', a: '一般可直接体验；具体进度是否跨设备保存取决于浏览器本地状态。' },
    ],
    related: [['/divination', '抽签求签'], ['/dream', '梦境解析'], ['/tarot', '塔罗占卜']],
  },
  {
    slug: 'bazi',
    title: '免费八字排盘',
    description: '输入出生年月日时，免费生成四柱八字、天干地支与五行分布，并附传统文化向解读。',
    intro: '八字排盘根据出生年、月、日、时排出四柱，帮助你从天干地支与五行平衡的角度认识自己的命盘结构。命运工坊提供清晰盘面与基础解读，方便入门者先建立整体印象。',
    modes: [
      { name: '四柱展示', text: '查看年柱、月柱、日柱、时柱的天干地支组合。' },
      { name: '五行分布', text: '观察金木水火土比例，理解偏旺、偏弱或相对均衡的倾向。' },
      { name: '文化解读', text: '阅读面向大众的趣味与传统文化说明，降低术语门槛。' },
    ],
    steps: [
      '准备出生公历日期，尽量确认出生时辰。',
      '在页面填写年、月、日、时并生成命盘。',
      '先看四柱结构，再看五行分布是否偏颇。',
      '结合解读文字理解术语，再决定是否与紫微、奇门对照。',
    ],
    faqs: [
      { q: '不知道出生时辰怎么办？', a: '可先用大致时辰体验，但时柱不同会改变盘面，重要参考请尽量核实出生时间。' },
      { q: '八字会泄露隐私吗？', a: '排盘在网页中完成；请避免在公共场合展示含完整出生信息的截图。' },
      { q: '和紫微斗数有何不同？', a: '八字侧重四柱与五行生克；紫微以十二宫与主星格局看人生议题，可互补不宜互相替代。' },
    ],
    related: [['/ziwei', '紫微斗数'], ['/nametest', '姓名测试'], ['/qimen', '奇门遁甲']],
  },
  {
    slug: 'divination',
    title: '在线抽签求签',
    description: '静心抽取一百签中的今日一签，阅读签诗、白话、分项详批、宜忌与行事建议，全程免费。',
    intro: '抽签求签适合你已经有一个明确疑问、希望获得方向感的时候。流程强调静心、专注与事后把签意落成行动，而不是只看吉凶两个字。',
    modes: [
      { name: '选择所问方向', text: '先选定感情、事业等类别，解签会更侧重该方向展开。' },
      { name: '摇签仪式', text: '在页面完成抽取动画，从一百支签中落下今日一签。' },
      { name: '完整解签', text: '阅读签诗、白话、总览、分项详批、宜忌、建议与三步行动。' },
      { name: '签文图鉴', text: '也可浏览全部签文，对照历史签诗与解读。' },
    ],
    steps: [
      '明确一个具体问题，避免一次问太多件事。',
      '选择所问类别，进入静心抽取。',
      '阅读签诗与白话，再看分项详批与宜忌。',
      '把「三步落签」里的建议变成今天能做的小事。',
    ],
    faqs: [
      { q: '抽签前需要做什么？', a: '先明确一个具体问题，安静几秒后再抽取，效果通常比边刷手机边抽更好。' },
      { q: '同一天可以抽很多次吗？', a: '可以体验，但反复追问同一问题容易越抽越乱；建议先消化这一签再决定是否重抽。' },
      { q: '上上签就一定顺利吗？', a: '不一定。签级是态度提示，仍要看签诗语境与你当下的实际条件。' },
    ],
    related: [['/divination/sticks', '浏览全部签文'], ['/tarot', '塔罗占卜'], ['/dream', '梦境解析']],
  },
  {
    slug: 'dream',
    title: '免费周公解梦',
    description: '输入梦境关键词，组合人物、场景、动物与情绪意象，获得民俗象征与心理视角的双重参考。',
    intro: '梦境解析帮你整理梦里反复出现的画面与情绪，而不是宣称梦见什么就一定会发生什么。你可以记录多个关键词，让系统组合常见梦象给出更立体的提示。',
    modes: [
      { name: '关键词解梦', text: '输入人物、动物、场景或动作等关键词，生成组合解读。' },
      { name: '双重视角', text: '同时参考民俗象征与心理联想，避免只有单一说法。' },
      { name: '梦象图鉴', text: '浏览常见梦境意象条目，快速查找「梦见某某」的含义。' },
    ],
    steps: [
      '醒来后尽快写下梦中关键画面与情绪。',
      '在页面输入关键词，可组合多个意象。',
      '阅读解释、积极可能、需留意处与建议。',
      '把与现实相关的一点洞察记下来，而不是只记吉凶。',
    ],
    faqs: [
      { q: '梦境解析是预言吗？', a: '不是。它更适合整理情绪与联想，不应当作对未来的确定预言。' },
      { q: '噩梦一定是坏事吗？', a: '未必。噩梦常反映压力、未处理情绪或过渡期，解读重点在提醒而非恐吓。' },
      { q: '查不到我的关键词怎么办？', a: '可拆成更短的近义词，或从梦象图鉴里找相近条目对照。' },
    ],
    related: [['/dream/symbols', '浏览全部梦象'], ['/tarot', '塔罗占卜'], ['/divination', '抽签求签']],
  },
  {
    slug: 'fengshui',
    title: '在线风水罗盘',
    description: '用手机在线风水罗盘查看八方方位、五行对应与居家布局常识，适合趣味学习与空间观察。',
    intro: '风水罗盘把方向、五行与基础布局概念可视化，方便你在家里或办公室大致辨认方位。手机传感器会受环境影响，结果请当作学习与参考，而不是精密测量。',
    modes: [
      { name: '方位罗盘', text: '借助设备朝向查看八个主要方位。' },
      { name: '五行对应', text: '了解方位与五行、常见布局话题的对应关系。' },
      { name: '布局提示', text: '获取面向大众的居家摆放与空间观察建议。' },
    ],
    steps: [
      '尽量远离强磁场与大件金属，校准手机方向。',
      '打开罗盘，对准房间或大门观察方位。',
      '对照五行与布局提示，记下想调整的一两处。',
      '重大装修或风水决策请咨询专业人士并实地勘察。',
    ],
    faqs: [
      { q: '手机罗盘准确吗？', a: '取决于设备传感器，易受金属、磁吸支架和电子设备干扰，适合趣味与入门参考。' },
      { q: '需要站在房屋中心吗？', a: '入门体验可在主要活动区观察；专业勘察会有更严格的立极与量度方法。' },
      { q: '和奇门遁甲有什么关系？', a: '都涉及方位与时间概念，但奇门更侧重择时起局与九宫格局，用途不同。' },
    ],
    related: [['/qimen', '奇门遁甲'], ['/almanac', '今日黄历'], ['/auspicious', '择日吉时']],
  },
  {
    slug: 'auspicious',
    title: '择日吉时查询',
    description: '按结婚、搬家、开业、出行等事项筛选吉日吉时，结合传统日历信息给出候选日期。',
    intro: '择日吉时适合你已经有事项与大致时间窗口，需要从候选日期里缩小范围。工具会给出民俗意义上的参考日与时辰，最终仍要综合考虑天气、档期与参与者方便。',
    modes: [
      { name: '事项选择', text: '支持结婚、搬家、开业、出行、签约、仪式等常见场景。' },
      { name: '日期范围筛选', text: '在设定区间内查看更合适的候选日。' },
      { name: '时辰参考', text: '进一步浏览相对更稳妥的时段提示。' },
    ],
    steps: [
      '选择事项类型，例如结婚、搬家或开业。',
      '设定可接受的日期范围。',
      '浏览候选吉日，并结合黄历宜忌交叉确认。',
      '锁定日期后，再协调场地、人员与天气等现实因素。',
    ],
    faqs: [
      { q: '择日结果是否绝对？', a: '不是。传统择日是参考维度之一，还应考虑天气、交通、家人与参与者时间。' },
      { q: '找不到完全合适的日子怎么办？', a: '可放宽日期范围，或优先满足最关键约束（场地、亲友档期），再在剩余日期中择优。' },
      { q: '要不要结合八字？', a: '若你重视命理匹配，可再对照八字或请专业人士；本工具先解决「日历层面」的筛选。' },
    ],
    related: [['/almanac', '今日黄历'], ['/fengshui', '风水罗盘'], ['/bazi', '八字排盘']],
  },
  {
    slug: 'numberenergy',
    title: '数字能量测试',
    description: '输入手机号、生日等数字组合，免费查看数字结构、核心数与趣味性格能量提示。',
    intro: '数字能量测试用轻松方式观察一串对你有意义的数字：结构、重复规律与核心数会拼出趣味性格与节奏提示。分析侧重娱乐与自我观察，请勿过度引申到命运定论。',
    modes: [
      { name: '任意数字解读', text: '支持手机号、生日或其他你在意的数字串。' },
      { name: '结构与核心数', text: '查看组成规律、强调数字与汇总核心倾向。' },
      { name: '趣味性格提示', text: '阅读轻松向的能量与行为风格描述。' },
    ],
    steps: [
      '准备一串对你有意义的数字（建议去掉不必要的隐私位）。',
      '输入后生成结构与核心数分析。',
      '阅读趣味提示，只吸收对你有启发的部分。',
      '若关注姓名或八字，可再对照姓名测试与排盘。',
    ],
    faqs: [
      { q: '是否会保存手机号？', a: '分析在当前设备中完成。仍建议避免输入完整敏感信息或不必要的证件号。' },
      { q: '结果准不准？', a: '属于趣味解读，可当作自我观察的一面镜子，不宜作为唯一依据。' },
      { q: '生日和手机号哪个更有参考？', a: '生日更贴近「与生俱来」的时间信息；手机号更像日常使用频率高的符号，两者角度不同。' },
    ],
    related: [['/nametest', '姓名测试'], ['/luckycolor', '每日幸运色'], ['/bazi', '八字排盘']],
  },
  {
    slug: 'luckycolor',
    title: '今日幸运色测试',
    description: '按日期生成今日幸运主色与辅助色，提供配色与穿搭灵感，为日常增加一点仪式感。',
    intro: '每日幸运色把「今天穿什么/带什么点缀」变成一个轻松决定。你可以得到主色、辅助色和简单搭配想法，用来点亮通勤、约会或工作日的小细节。',
    modes: [
      { name: '主色与辅色', text: '查看当日核心色与可搭配的辅助色。' },
      { name: '穿搭灵感', text: '获得衣着、配饰层面的轻量建议。' },
      { name: '每日固定', text: '同一天内结果保持一致，方便反复查看。' },
    ],
    steps: [
      '打开每日幸运色，查看今日主色。',
      '对照辅助色，想一件单品或配饰来呼应。',
      '可与星座运势、黄历一起，组成你的「今日仪式」。',
      '明天再来，颜色会随日期更新。',
    ],
    faqs: [
      { q: '每天的结果会变吗？', a: '会。结果按日期生成，同一天内查看会保持一致。' },
      { q: '一定要全身穿这个颜色吗？', a: '不必。用丝巾、袜子、耳机壳或桌面小物点缀即可。' },
      { q: '和风水颜色有关吗？', a: '这里偏日常仪式与审美灵感；若你关注方位五行用色，可再对照风水罗盘。' },
    ],
    related: [['/horoscope', '星座运势'], ['/almanac', '今日黄历'], ['/numberenergy', '数字能量']],
  },
  {
    slug: 'qimen',
    title: '奇门遁甲在线排盘',
    description: '按时间在线起奇门局，查看九宫、八门、九星、八神等盘面结构，适合入门学习格局。',
    intro: '奇门遁甲以时间起局，把九宫中的门、星、神等符号铺开，便于观察某一时刻的格局关系。命运工坊强调盘面可读性与基础说明，帮助初学者先看懂结构再谈应用。',
    modes: [
      { name: '按时起局', text: '根据选定时间生成奇门盘。' },
      { name: '九宫总览', text: '查看各宫位中的八门、九星、八神等要素。' },
      { name: '入门释义', text: '用基础说明降低传统术语门槛。' },
    ],
    steps: [
      '确定要观察的时间（此时、某事发生时或计划时）。',
      '生成盘面，先建立九宫整体印象。',
      '逐宫查看门、星、神的组合与基础释义。',
      '把好奇点记下来，再决定是否深入学习或咨询师长。',
    ],
    faqs: [
      { q: '适合初学者吗？', a: '适合。页面提供基础解读，帮助理解盘面结构；复杂断事仍需系统学习。' },
      { q: '必须精确到分钟吗？', a: '传统奇门对时辰敏感。入门体验可用整点，正式推演请尽量准确。' },
      { q: '和风水罗盘如何一起用？', a: '罗盘偏空间方位，奇门偏时间格局；可以分开学习，不必强行混为一谈。' },
    ],
    related: [['/fengshui', '风水罗盘'], ['/bazi', '八字排盘'], ['/ziwei', '紫微斗数']],
  },
  {
    slug: 'nametest',
    title: '免费姓名测试',
    description: '输入中文姓名，免费查看笔画、五格数理、音形印象与趣味文化解读，支持常见复姓。',
    intro: '姓名测试从笔画与五格入手，帮你观察名字的结构感、声音印象与民俗数理趣味。它适合起名灵感或了解现有名字的文化读法，而不是给人生贴单一标签。',
    modes: [
      { name: '笔画与五格', text: '计算字符笔画并展示五格相关结构。' },
      { name: '音形印象', text: '从读音与字形角度给出轻松描述。' },
      { name: '文化解读', text: '阅读面向大众的趣味说明，降低术语负担。' },
    ],
    steps: [
      '输入要测试的中文姓名（含姓与名）。',
      '查看笔画、五格与结构提示。',
      '阅读音形与文化向解读，记下喜欢的方向。',
      '若用于起名，可多试几个候选再对照八字喜用。',
    ],
    faqs: [
      { q: '支持复姓吗？', a: '支持常见中文复姓与多字名；部分生僻字可能缺少笔画数据。' },
      { q: '英文名可以测吗？', a: '本工具主要面向中文姓名笔画与五格体系，英文名不适用同一套算法。' },
      { q: '五格不好就要改名吗？', a: '不必。姓名只是文化与社会层面的一个符号，改名与否应综合法律、习惯与个人意愿。' },
    ],
    related: [['/bazi', '八字排盘'], ['/numberenergy', '数字能量'], ['/shengxiao', '生肖配对']],
  },
  {
    slug: 'ziwei',
    title: '紫微斗数在线排盘',
    description: '输入出生信息免费生成紫微斗数十二宫命盘，查看主星、宫位主题与传统文化向解读。',
    intro: '紫微斗数以出生时间排出十二宫，观察不同人生领域的主星与格局气氛。命运工坊提供清晰宫位视图与基础说明，方便你先认识「盘长什么样」。',
    modes: [
      { name: '十二宫命盘', text: '一览命宫及各宫位主题分布。' },
      { name: '主星观察', text: '查看重要星曜落宫，建立第一印象。' },
      { name: '宫位解读', text: '阅读面向入门的宫位与文化说明。' },
    ],
    steps: [
      '准备尽量准确的出生年月日时。',
      '生成紫微命盘，先定位命宫与关键宫位。',
      '观察主星落点与宫位主题是否呼应你的问题。',
      '需要时再与八字、奇门对照，形成多视角参考。',
    ],
    faqs: [
      { q: '出生时间会影响结果吗？', a: '会。时辰影响宫位与星曜排布，建议使用最准确的出生时间。' },
      { q: '看不懂术语怎么办？', a: '先从宫位主题与基础说明读起，不必一次记住全部星曜名称。' },
      { q: '能预测具体事件日期吗？', a: '本页侧重盘面结构与入门解读；精细流年推演需要更系统的方法。' },
    ],
    related: [['/bazi', '八字排盘'], ['/qimen', '奇门遁甲'], ['/horoscope', '星座运势']],
  },
  {
    slug: 'shengxiao',
    title: '十二生肖配对',
    description: '选择两个生肖，查看传统合冲、性格互补、摩擦点与沟通建议，适合情感与人际参考。',
    intro: '生肖配对从民俗合冲与性格互动出发，帮你快速看到两个人相处时可能的优势与摩擦。它适合当作聊天与自我觉察的材料，而不是给关系下最终判决。',
    modes: [
      { name: '双生肖对照', text: '任选两个生肖，查看关系基调。' },
      { name: '优势与摩擦', text: '分别了解互补点与容易踩雷的地方。' },
      { name: '沟通建议', text: '获得更可执行的相处与表达提示。' },
    ],
    steps: [
      '选择自己与对方的生肖。',
      '阅读合冲关系与整体相处气氛。',
      '对照优势、摩擦与沟通建议。',
      '把有用的一条用到真实交流里，而不是只转发结论。',
    ],
    faqs: [
      { q: '生肖不合就不适合吗？', a: '不是。生肖只是民俗文化角度，真实关系更取决于了解、沟通与共同经历。' },
      { q: '可以测友情或合作吗？', a: '可以。把建议理解为相处风格参考，不限于恋爱场景。' },
      { q: '和星座配对哪个准？', a: '体系不同：生肖按农历年，星座多按太阳落座；可一起看，但都不是绝对标准。' },
    ],
    related: [['/horoscope', '星座运势'], ['/nametest', '姓名测试'], ['/bazi', '八字排盘']],
  },
]

const pagesEnRaw = [
  {
    slug: 'tarot',
    title: 'Free Online Tarot Reading',
    description: 'Free online tarot: daily card, single-card insight, and a past-present-future spread with upright, reversed, and action guidance.',
    intro: 'Fate Atelier’s tarot tools use imagery to help you see a question from a new angle—not to decide for you. Whether you want a quick daily cue or a three-card timeline, you can draw and read entirely in the browser, free and without downloads.',
    modes: [
      { name: 'Daily Draw', text: 'Reveal one card each day for a light morning or evening ritual and a fast read on today’s focus.' },
      { name: 'Single Card', text: 'Hold one clear question, draw a card, and compare upright vs reversed meanings.' },
      { name: 'Three-Card Spread', text: 'Draw past, present, and future cards with a synthesized reading across the timeline.' },
      { name: 'Card Library', text: 'Browse all 78 Major and Minor Arcana, filter by suit, and open full meanings anytime.' },
    ],
    steps: [
      'Clarify one question or the theme you want to watch today.',
      'Choose Daily Draw, Single Card, or the three-card spread.',
      'Flip the cards and read upright/reversed meanings plus practical advice.',
      'Use the library when you want the full 78-card reference.',
    ],
    faqs: [
      { q: 'Is tarot reading free?', a: 'Yes. Draws, orientations, and guidance are free on Fate Atelier.' },
      { q: 'What is the difference between upright and reversed?', a: 'Upright often highlights a clearer flow of the theme; reversed points to friction, delay, or an inner adjustment. The same card shifts tone by orientation.' },
      { q: 'Should I treat the cards as a final decision?', a: 'No. Tarot is best for clarity and options. Important choices still need real-world judgment.' },
    ],
    related: [['/en/tarot/cards', 'Browse all card meanings'], ['/en/divination', 'Online fortune sticks'], ['/en/dream', 'Dream meaning guide']],
  },
  {
    slug: 'horoscope',
    title: 'Daily Horoscope',
    description: 'Check today’s free horoscope for all 12 signs—overall mood, love, career, money, and lucky cues to plan your day.',
    intro: 'Daily horoscope follows common Western sun-sign date ranges so you can skim today’s emotional weather. Use it as a quick morning check before you prioritize talks, deep work, or rest.',
    modes: [
      { name: 'All 12 signs', text: 'Switch from Aries to Pisces for each sign’s daily tone.' },
      { name: 'Love, career, money', text: 'Read themed outlooks instead of one vague sentence.' },
      { name: 'Lucky cues', text: 'Pick up light lucky hints and pair them with almanac or lucky color if you like ritual.' },
    ],
    steps: [
      'Confirm your sun sign, or check boundary birthdays against neighboring signs.',
      'Open your sign and read today’s overall outlook.',
      'Scan love, career, and wealth notes plus lucky cues.',
      'Turn one useful line into a concrete action for today.',
    ],
    faqs: [
      { q: 'How are zodiac sign dates defined?', a: 'By standard Western sun-sign ranges. If you were born on a cusp, read both neighboring signs.' },
      { q: 'Does the horoscope change every day?', a: 'Yes. It updates by date and usually stays consistent within the same day.' },
      { q: 'What if it conflicts with the Chinese almanac?', a: 'They are different systems—use them as complementary references, and prioritize real-world constraints.' },
    ],
    related: [['/en/almanac', 'Chinese daily almanac'], ['/en/luckycolor', 'Today’s lucky color'], ['/en/shengxiao', 'Chinese zodiac compatibility']],
  },
  {
    slug: 'almanac',
    title: 'Chinese Daily Almanac',
    description: 'Free Chinese almanac with lunar date, stems and branches, solar terms, daily dos and don’ts, and hour guidance.',
    intro: 'The daily almanac puts Gregorian and lunar details in one place for a quick traditional-calendar check before travel, meetings, or ceremonies. Treat it as cultural reference, not a rigid rulebook.',
    modes: [
      { name: 'Date overview', text: 'See Gregorian, lunar, stem-branch, and solar-term info together.' },
      { name: 'Dos and don’ts', text: 'Scan favorable and unfavorable activities for the day.' },
      { name: 'Hour notes', text: 'Use hour and clash cues as a rough filter for important timing.' },
    ],
    steps: [
      'Open today’s almanac and confirm both calendars.',
      'Review dos and don’ts against your actual plans.',
      'Check hour guidance if timing matters.',
      'For multi-day planning, continue in the auspicious date finder.',
    ],
    faqs: [
      { q: 'Can almanac advice replace professional decisions?', a: 'No. It is cultural reference—weddings, medical care, and major contracts still need real-world planning.' },
      { q: 'Must I follow every item?', a: 'No. Focus on entries that relate to today’s plans and treat the rest as optional context.' },
      { q: 'How does timezone work?', a: 'The page shows a conventional daily view; when traveling, prioritize local date and logistics.' },
    ],
    related: [['/en/auspicious', 'Auspicious date finder'], ['/en/fengshui', 'Online feng shui compass'], ['/en/horoscope', 'Daily horoscope']],
  },
  {
    slug: 'cybermerit',
    title: 'Cyber Merit Practice',
    description: 'Relax with free virtual wooden fish, incense, and playful release rituals while tracking a light daily merit score.',
    intro: 'Cyber Merit is a playful calm break: tap, light incense, and try a gentle release ritual to return attention to the present. It is entertainment-focused—not a religious obligation and not a substitute for real-world kindness.',
    modes: [
      { name: 'Wooden fish', text: 'Tap a steady rhythm to cool down and refocus for a minute.' },
      { name: 'Incense', text: 'Complete a short visual pause when you need quiet.' },
      { name: 'Playful release', text: 'Express a light gesture of goodwill and watch your daily merit count grow.' },
    ],
    steps: [
      'Open Cyber Merit and pick an interaction.',
      'Tap the wooden fish or complete incense / release actions.',
      'Notice your breath while the daily score updates.',
      'Continue with fortune sticks or tarot if you want another quiet round.',
    ],
    faqs: [
      { q: 'Is this a religious ritual?', a: 'No. It is a light relaxation experience and does not represent a temple service.' },
      { q: 'Does the merit score mean anything real?', a: 'It is a playful tracker for motivation—not transferable merit or religious credit.' },
      { q: 'Do I need an account?', a: 'You can usually play right away; cross-device progress depends on local browser state.' },
    ],
    related: [['/en/divination', 'Online fortune sticks'], ['/en/dream', 'Dream meaning guide'], ['/en/tarot', 'Free online tarot reading']],
  },
  {
    slug: 'bazi',
    title: 'Free BaZi Chart',
    description: 'Enter birth date and hour for a free Four Pillars chart with stems, branches, five-element balance, and cultural notes.',
    intro: 'BaZi (Four Pillars) charts your year, month, day, and hour pillars so you can explore stem-branch structure and five-element balance. Fate Atelier keeps the board readable for beginners who want a clear first look.',
    modes: [
      { name: 'Four Pillars board', text: 'View year, month, day, and hour pillars together.' },
      { name: 'Five-element mix', text: 'See whether wood, fire, earth, metal, and water lean strong, weak, or steadier.' },
      { name: 'Cultural reading', text: 'Get approachable notes that explain terms without heavy jargon.' },
    ],
    steps: [
      'Prepare your birth date and the best hour you know.',
      'Generate the chart on the page.',
      'Read the four pillars first, then the element balance.',
      'Compare with Zi Wei or Qi Men only after you understand the basics.',
    ],
    faqs: [
      { q: 'What if I do not know my birth hour?', a: 'You can try an approximate hour, but the hour pillar changes the chart—verify when accuracy matters.' },
      { q: 'Is my birth data private?', a: 'Charting runs in the page flow; avoid sharing screenshots that expose full birth details in public.' },
      { q: 'How is BaZi different from Zi Wei?', a: 'BaZi focuses on pillars and element dynamics; Zi Wei maps twelve palaces and star patterns. They complement rather than replace each other.' },
    ],
    related: [['/en/ziwei', 'Zi Wei Dou Shu chart'], ['/en/nametest', 'Chinese name reading'], ['/en/qimen', 'Qi Men Dun Jia chart']],
  },
  {
    slug: 'divination',
    title: 'Online Fortune Sticks',
    description: 'Draw one of 100 fortune sticks online, then read the poem, plain meaning, themed details, dos and don’ts, and action steps—free.',
    intro: 'Fortune sticks work best when you already have one clear question and want directional guidance. The flow emphasizes calm focus and turning the reading into actions—not only a lucky or unlucky label.',
    modes: [
      { name: 'Choose a focus', text: 'Pick a category such as love or career so details lean that way.' },
      { name: 'Draw ritual', text: 'Complete the on-page draw from a hundred sticks.' },
      { name: 'Full reading', text: 'Read poem, plain language, overview, aspects, cautions, advice, and three next steps.' },
      { name: 'Stick library', text: 'Browse all stick texts when you want the full set.' },
    ],
    steps: [
      'Hold one specific question instead of many at once.',
      'Choose a category and begin the calm draw.',
      'Read the poem and plain meaning before the detailed aspects.',
      'Convert the three action steps into something you can do today.',
    ],
    faqs: [
      { q: 'What should I do before drawing a stick?', a: 'Clarify one question and pause briefly—better than drawing while distracted.' },
      { q: 'Can I draw many times in one day?', a: 'You can, but repeating the same question often adds noise. Digest one reading first.' },
      { q: 'Does a top-tier stick guarantee success?', a: 'No. Stick level is tone, not a contract—read the poem in context with your real situation.' },
    ],
    related: [['/en/divination/sticks', 'Browse all stick readings'], ['/en/tarot', 'Free online tarot reading'], ['/en/dream', 'Dream meaning guide']],
  },
  {
    slug: 'dream',
    title: 'Dream Meaning Guide',
    description: 'Enter dream keywords to combine people, places, animals, and emotions into folk symbolism and psychological perspective—free.',
    intro: 'Dream Guide helps you sort recurring images and feelings—not claim that a dream will come true. Log several keywords so common symbols can combine into a fuller reading.',
    modes: [
      { name: 'Keyword reading', text: 'Enter people, animals, scenes, or actions for a combined interpretation.' },
      { name: 'Two lenses', text: 'Compare folk symbolism with psychological associations.' },
      { name: 'Symbol library', text: 'Browse common “dream of …” entries when you want a quick lookup.' },
    ],
    steps: [
      'Write down key images and emotions soon after waking.',
      'Enter keywords—combine more than one when helpful.',
      'Read meaning, positives, cautions, and advice.',
      'Keep the insight that maps to waking life, not only a good/bad label.',
    ],
    faqs: [
      { q: 'Is dream analysis a prophecy?', a: 'No. It helps sort emotions and associations, not predict the future with certainty.' },
      { q: 'Are nightmares always bad omens?', a: 'Not necessarily. They often reflect stress or unfinished feelings—and the value is in the reminder.' },
      { q: 'What if my keyword is missing?', a: 'Try shorter synonyms or browse nearby symbols in the library.' },
    ],
    related: [['/en/dream/symbols', 'Browse all dream symbols'], ['/en/tarot', 'Free online tarot reading'], ['/en/divination', 'Online fortune sticks']],
  },
  {
    slug: 'fengshui',
    title: 'Online Feng Shui Compass',
    description: 'Use an online feng shui compass to explore eight directions, five-element links, and beginner home-layout tips.',
    intro: 'The compass visualizes directions and basic layout ideas for home or office. Phone sensors can be noisy, so treat results as learning aids—not a survey-grade reading.',
    modes: [
      { name: 'Direction compass', text: 'Use device orientation to explore the eight main directions.' },
      { name: 'Element links', text: 'See how directions relate to five-element themes.' },
      { name: 'Layout tips', text: 'Get beginner-friendly notes for observing a space.' },
    ],
    steps: [
      'Move away from strong magnets and large metal objects if you can.',
      'Open the compass and face a door or room edge.',
      'Note one or two layout ideas worth trying.',
      'For major renovations, consult a professional on site.',
    ],
    faqs: [
      { q: 'Is the phone compass accurate?', a: 'It depends on the sensor and interference from metal or magnets—best as a fun reference.' },
      { q: 'Must I stand at the center of the house?', a: 'For casual use, any main living area is fine; formal surveys use stricter methods.' },
      { q: 'How does this relate to Qi Men?', a: 'Both touch space and time ideas, but Qi Men focuses on timed charts and palace structures.' },
    ],
    related: [['/en/qimen', 'Qi Men Dun Jia chart'], ['/en/almanac', 'Chinese daily almanac'], ['/en/auspicious', 'Auspicious date finder']],
  },
  {
    slug: 'auspicious',
    title: 'Auspicious Date Finder',
    description: 'Filter auspicious dates and hours for weddings, moving, openings, travel, and more using traditional calendar cues.',
    intro: 'Use this when you already have an event type and a date window. It narrows candidates in a traditional-calendar sense—then you still weigh weather, venues, and people’s schedules.',
    modes: [
      { name: 'Event types', text: 'Cover weddings, moving, openings, travel, signing, ceremonies, and more.' },
      { name: 'Date-range filter', text: 'Scan better candidate days inside your window.' },
      { name: 'Hour hints', text: 'Review relatively steadier hours after picking a day.' },
    ],
    steps: [
      'Choose the event type.',
      'Set an acceptable date range.',
      'Review candidate days and cross-check the daily almanac.',
      'Lock a date only after logistics and people align.',
    ],
    faqs: [
      { q: 'Are auspicious dates guaranteed to work?', a: 'No. Also consider weather, schedules, and everyone involved.' },
      { q: 'What if no day looks perfect?', a: 'Widen the range, or prioritize hard constraints first, then choose the best remaining day.' },
      { q: 'Should I also check BaZi?', a: 'If that matters to you, compare afterward. This tool focuses on calendar-level filtering first.' },
    ],
    related: [['/en/almanac', 'Chinese daily almanac'], ['/en/fengshui', 'Online feng shui compass'], ['/en/bazi', 'Free BaZi chart']],
  },
  {
    slug: 'numberenergy',
    title: 'Number Energy Reading',
    description: 'Enter a phone number, birthday, or other meaningful digits for a free playful read of structure, core numbers, and style hints.',
    intro: 'Number Energy is a light way to notice patterns in digits that matter to you—structure, repeats, and core numbers. Keep it playful; it is not a destiny verdict.',
    modes: [
      { name: 'Any meaningful digits', text: 'Try phone numbers, birthdays, or other personal sequences.' },
      { name: 'Structure and core', text: 'See composition patterns and summarized core tendencies.' },
      { name: 'Playful style notes', text: 'Read light personality and rhythm hints.' },
    ],
    steps: [
      'Pick digits that matter (avoid unnecessary sensitive IDs).',
      'Generate the structure and core-number view.',
      'Keep only the notes that feel useful.',
      'Compare with name reading or BaZi if you want another lens.',
    ],
    faqs: [
      { q: 'Do you store my phone number?', a: 'Analysis runs on your device. Still avoid entering unnecessary sensitive information.' },
      { q: 'How accurate is it?', a: 'It is entertainment and self-reflection—not a sole decision tool.' },
      { q: 'Birthday or phone number?', a: 'Birthdays lean toward “born with” timing; phone numbers are everyday symbols—different angles.' },
    ],
    related: [['/en/nametest', 'Chinese name reading'], ['/en/luckycolor', 'Today’s lucky color'], ['/en/bazi', 'Free BaZi chart']],
  },
  {
    slug: 'luckycolor',
    title: 'Today’s Lucky Color',
    description: 'Get today’s free lucky main color and accents with simple outfit ideas—a small daily ritual for clothes and accessories.',
    intro: 'Lucky Color turns “what should I wear or accent today?” into a light choice. Use the main color and accents as a tiny ritual for commute, dates, or workdays.',
    modes: [
      { name: 'Main and accent colors', text: 'See today’s core color plus supporting tones.' },
      { name: 'Outfit ideas', text: 'Get light clothing and accessory suggestions.' },
      { name: 'Same all day', text: 'Results stay consistent within the date.' },
    ],
    steps: [
      'Open today’s lucky color and note the main hue.',
      'Pick one item or accessory that echoes an accent.',
      'Optional: pair with horoscope or almanac for a daily ritual set.',
      'Come back tomorrow—the palette updates with the date.',
    ],
    faqs: [
      { q: 'Does the result change every day?', a: 'Yes. It is date-based and stable throughout that day.' },
      { q: 'Must I dress head to toe in it?', a: 'No. A scarf, socks, case, or desk accent is enough.' },
      { q: 'Is this the same as feng shui colors?', a: 'This page is daily ritual and style. For directional five-element color ideas, also see the compass.' },
    ],
    related: [['/en/horoscope', 'Daily horoscope'], ['/en/almanac', 'Chinese daily almanac'], ['/en/numberenergy', 'Number energy reading']],
  },
  {
    slug: 'qimen',
    title: 'Qi Men Dun Jia Chart',
    description: 'Create a free Qi Men chart by time and explore nine palaces with gates, stars, and spirits—clear structure for beginners.',
    intro: 'Qi Men Dun Jia charts a moment across nine palaces so you can see gates, stars, and spirits in relation. Fate Atelier prioritizes a readable board and basic explanations before advanced judgment.',
    modes: [
      { name: 'Time-based chart', text: 'Generate a Qi Men board for a chosen time.' },
      { name: 'Nine-palace view', text: 'Inspect gates, stars, and spirits palace by palace.' },
      { name: 'Beginner notes', text: 'Use plain explanations to lower the jargon barrier.' },
    ],
    steps: [
      'Pick the time you want to observe.',
      'Generate the board and skim the nine palaces.',
      'Read basic notes for combinations that stand out.',
      'Decide later whether to study deeper or consult a teacher.',
    ],
    faqs: [
      { q: 'Is this good for beginners?', a: 'Yes. Basic explanations help you learn structure; complex judgments still need study.' },
      { q: 'Do minutes matter?', a: 'Traditional Qi Men is time-sensitive. Whole hours are fine for exploration; use precise time for serious work.' },
      { q: 'How should I use it with the feng shui compass?', a: 'Compass leans space; Qi Men leans timed patterns—learn them as related but separate tools.' },
    ],
    related: [['/en/fengshui', 'Online feng shui compass'], ['/en/bazi', 'Free BaZi chart'], ['/en/ziwei', 'Zi Wei Dou Shu chart']],
  },
  {
    slug: 'nametest',
    title: 'Chinese Name Reading',
    description: 'Enter a Chinese name for free stroke counts, five-grid structure, sound-and-form notes, and playful cultural reading.',
    intro: 'Name Reading looks at strokes and five-grid structure so you can explore how a Chinese name feels in form and sound. Use it for naming ideas or cultural curiosity—not a single life label.',
    modes: [
      { name: 'Strokes and five grids', text: 'Calculate character strokes and related structure.' },
      { name: 'Sound and form', text: 'Read light notes on pronunciation and visual impression.' },
      { name: 'Cultural notes', text: 'Get approachable explanations without heavy jargon.' },
    ],
    steps: [
      'Enter the Chinese surname and given name.',
      'Review strokes, grids, and structure hints.',
      'Read sound, form, and cultural notes.',
      'If naming, try several candidates and optionally compare with BaZi preferences.',
    ],
    faqs: [
      { q: 'Does it support compound surnames?', a: 'Yes for common Chinese compound surnames. Rare characters may lack stroke data.' },
      { q: 'Can I test an English name?', a: 'This tool follows Chinese stroke and five-grid logic, so English names are not a fit.' },
      { q: 'Should I rename if grids look weak?', a: 'Not necessarily. A name is one social-cultural symbol—legal, personal, and practical factors matter more.' },
    ],
    related: [['/en/bazi', 'Free BaZi chart'], ['/en/numberenergy', 'Number energy reading'], ['/en/shengxiao', 'Chinese zodiac compatibility']],
  },
  {
    slug: 'ziwei',
    title: 'Zi Wei Dou Shu Chart',
    description: 'Generate a free Zi Wei twelve-palace chart from birth time with major stars, palace themes, and beginner-friendly notes.',
    intro: 'Zi Wei Dou Shu maps twelve palaces from birth time so you can see where major stars sit across life themes. Fate Atelier focuses on a clear palace view and first-step explanations.',
    modes: [
      { name: 'Twelve-palace chart', text: 'See the life palace and other palace themes at a glance.' },
      { name: 'Major stars', text: 'Notice key stars and their palace placements.' },
      { name: 'Palace notes', text: 'Read beginner-friendly cultural explanations.' },
    ],
    steps: [
      'Prepare the most accurate birth date and hour you have.',
      'Generate the chart and locate the life palace.',
      'Relate star placements to the question you care about.',
      'Compare with BaZi or Qi Men only after the board feels familiar.',
    ],
    faqs: [
      { q: 'Does birth time affect the chart?', a: 'Yes. The hour matters for palace and star placement—use the best time available.' },
      { q: 'What if I do not know the terms?', a: 'Start with palace themes and basic notes; you do not need every star name on day one.' },
      { q: 'Can it pinpoint exact event dates?', a: 'This page emphasizes structure and entry-level reading; fine timing needs deeper methods.' },
    ],
    related: [['/en/bazi', 'Free BaZi chart'], ['/en/qimen', 'Qi Men Dun Jia chart'], ['/en/horoscope', 'Daily horoscope']],
  },
  {
    slug: 'shengxiao',
    title: 'Chinese Zodiac Compatibility',
    description: 'Pick two Chinese zodiac signs to explore harmony and clash, strengths, friction points, and communication tips.',
    intro: 'Chinese zodiac matching uses traditional harmony/clash ideas plus personality interplay. Treat it as conversation and self-awareness material—not a final verdict on a relationship.',
    modes: [
      { name: 'Two-sign compare', text: 'Choose any pair to see the relationship tone.' },
      { name: 'Strengths and friction', text: 'Learn where you complement and where you may clash.' },
      { name: 'Communication tips', text: 'Get practical notes for clearer day-to-day relating.' },
    ],
    steps: [
      'Select both zodiac animals.',
      'Read the overall harmony/clash tone.',
      'Review strengths, friction, and communication tips.',
      'Apply one useful tip in a real conversation.',
    ],
    faqs: [
      { q: 'If signs clash, is the match doomed?', a: 'No. Zodiac is one cultural lens—real relationships depend on communication and shared experience.' },
      { q: 'Can I use this for friendship or teamwork?', a: 'Yes. Read the advice as style notes, not romance-only rules.' },
      { q: 'Which is more accurate, zodiac or star sign?', a: 'Different systems: Chinese zodiac by lunar year, sun signs by ecliptic position. Use both lightly.' },
    ],
    related: [['/en/horoscope', 'Daily horoscope'], ['/en/nametest', 'Chinese name reading'], ['/en/bazi', 'Free BaZi chart']],
  },
]

export const pagesZh = enrichPages(pagesZhRaw, FREE_VALUE_FAQ_ZH, 'zh')
export const pagesEn = enrichPages(pagesEnRaw, FREE_VALUE_FAQ_EN, 'en')
