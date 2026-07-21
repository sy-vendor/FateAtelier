import { tianganWuxing } from './constants'
import {
  calculateYearPillar,
  calculateMonthPillar,
  calculateDayPillar,
  analyzeWuxingFromBazi,
} from './bazi'
import { tiangan, dizhi } from './constants'
import { shishenMap, SHISHEN_EN, WUXING_EN } from './baziData'
import { isEnglishLocale } from '../i18n/locale'
import { formatGanZhi } from './ganZhiLabel'

export function calculateHourPillarFromShichen(dayPillar: string, shichen: string): string {
  const hourIndex = dizhi.indexOf(shichen)
  if (hourIndex === -1) return ''
  const dayGan = dayPillar[0]
  const dayGanIndex = tiangan.indexOf(dayGan)
  let hourGanIndex = 0
  if (dayGanIndex === 0 || dayGanIndex === 5) hourGanIndex = (0 + hourIndex) % 10
  else if (dayGanIndex === 1 || dayGanIndex === 6) hourGanIndex = (2 + hourIndex) % 10
  else if (dayGanIndex === 2 || dayGanIndex === 7) hourGanIndex = (4 + hourIndex) % 10
  else if (dayGanIndex === 3 || dayGanIndex === 8) hourGanIndex = (6 + hourIndex) % 10
  else hourGanIndex = (8 + hourIndex) % 10
  return tiangan[hourGanIndex] + shichen
}

export function analyzeShishen(bazi: string[]): string[] {
  if (bazi.length < 4) return []
  const dayGan = bazi[2][0]
  const shishen: string[] = []
  bazi.forEach((pillar, index) => {
    if (index !== 2 && pillar.length >= 1) {
      const gan = pillar[0]
      const shishenName = shishenMap[dayGan]?.[gan] || ''
      if (shishenName) {
        shishen.push(isEnglishLocale()
          ? `${formatGanZhi(pillar, true)} (${SHISHEN_EN[shishenName] ?? shishenName})`
          : `${pillar}(${shishenName})`)
      }
    }
  })
  return shishen
}

export interface BaziInterpretation {
  personality: string
  career: string
  wealth: string
  health: string
  relationship: string
  summary: string
}

function interpretBaziEnglish(
  wuxing: { [key: string]: number },
  shishen: string[],
  dayGan: string,
  dayWuxing: string,
  maxWuxing: string,
  minWuxing: string,
): BaziInterpretation {
  const element = WUXING_EN[dayWuxing] ?? dayWuxing
  const strongest = WUXING_EN[maxWuxing] ?? maxWuxing
  const weakest = WUXING_EN[minWuxing] ?? minWuxing
  const profiles: Record<string, { personality: string; career: string }> = {
    木: {
      personality: 'You are growth-minded, empathetic, and adaptable. You tend to connect people and ideas naturally; clear boundaries help your generosity remain sustainable.',
      career: 'Education, design, planning, consulting, culture, and people-focused leadership can reward your ability to develop ideas and help others grow.',
    },
    火: {
      personality: 'You bring warmth, visibility, and momentum to a room. Your directness inspires action; pausing before decisive moments keeps enthusiasm from becoming impatience.',
      career: 'Communication, sales, media, hospitality, entrepreneurship, and fast-moving creative work suit your presence and ability to motivate others.',
    },
    土: {
      personality: 'You are dependable, practical, and patient. Others value your steadiness; staying open to small experiments prevents stability from turning into inertia.',
      career: 'Operations, finance, property, administration, planning, and long-term project work benefit from your discipline and sense of responsibility.',
    },
    金: {
      personality: 'You are focused, principled, and analytical. You set high standards and execute with care; flexibility and warmth make your precision even more effective.',
      career: 'Technology, engineering, finance, law, quality control, and specialist work suit your judgement, structure, and drive for mastery.',
    },
    水: {
      personality: 'You are observant, resourceful, and responsive to change. Your intuition and communication skills are strengths; a clear routine helps focus your many ideas.',
      career: 'Research, trade, logistics, strategy, media, consulting, and creative work can make good use of your adaptability and insight.',
    },
  }
  const profile = profiles[dayWuxing] ?? profiles.土
  const strongNote = wuxing[dayWuxing] >= 3
    ? ` Your ${element} day master is pronounced, so lead with its strengths while leaving room for other viewpoints.`
    : wuxing[dayWuxing] <= 1
      ? ` Your ${element} day master is relatively light; deliberate practice and supportive routines can build confidence.`
      : ''
  const wealth = maxWuxing === '金' || maxWuxing === '土'
    ? 'Your chart favors patient accumulation and structured money management. Set long-term goals, research commitments carefully, and let consistency do the work.'
    : maxWuxing === '火'
      ? 'You can spot opportunities and act quickly, but returns may be uneven. Pair initiative with a spending limit and a clear risk plan.'
      : 'Your financial outlook improves through flexibility, diversified skills, and a simple plan for saving and investing rather than impulsive decisions.'
  const health = `The lighter ${weakest} element suggests making recovery and balance a priority. Keep regular sleep, movement, and nutrition habits, and seek professional care for health concerns.`
  const relationship = shishen.some((s) => /Direct Officer|Direct Wealth|Eating God/.test(s))
    ? 'You value reliability and sincere effort in relationships. Shared routines and direct conversations can deepen trust.'
    : 'Relationships benefit from expressing needs early and allowing both closeness and personal space. Curiosity is more useful than trying to control the outcome.'
  return {
    personality: `${profile.personality}${strongNote}`,
    career: profile.career,
    wealth,
    health,
    relationship,
    summary: `Your day master is ${dayGan} (${element}). ${strongest} is the strongest element and ${weakest} is the lightest. ${profile.personality} In work, ${profile.career.toLowerCase()} Financially, ${wealth}`,
  }
}

export function interpretBazi(bazi: string[], wuxing: { [key: string]: number }, shishen: string[]): {
  personality: string
  career: string
  wealth: string
  health: string
  relationship: string
  summary: string
} {
  const dayGan = bazi[2]?.[0] || ''
  const dayWuxing = tianganWuxing[dayGan] || '土'
  
  // 找出最多的五行
  const maxWuxing = Object.entries(wuxing).reduce((a, b) => wuxing[a[0]] > wuxing[b[0]] ? a : b)[0]
  const minWuxing = Object.entries(wuxing).reduce((a, b) => wuxing[a[0]] < wuxing[b[0]] ? a : b)[0]
  if (isEnglishLocale()) {
    return interpretBaziEnglish(wuxing, shishen, dayGan, dayWuxing, maxWuxing, minWuxing)
  }
  
  // 性格分析（更丰富）
  const getPersonalityAnalysis = (dayWuxing: string, wuxing: { [key: string]: number }, shishen: string[]): string => {
    const basePersonality: { [key: string]: string[] } = {
      '木': [
        '性格温和善良，富有同情心和同理心，容易与他人建立良好关系。思维活跃，富有创造力和想象力，喜欢探索新事物。',
        '性格开朗乐观，喜欢自由自在的生活，不喜欢被束缚和限制。有领导才能和组织能力，善于协调团队关系。',
        '性格坚韧不拔，面对困难不轻易放弃，有强烈的责任感和使命感。喜欢学习和成长，追求精神层面的满足。',
        '性格温和但内心坚定，有自己的原则和底线。善于倾听他人，是很好的朋友和伙伴。',
        '性格灵活变通，适应能力强，能够快速融入新环境。有艺术天赋，对美的事物有敏锐的感知力。'
      ],
      '火': [
        '性格热情开朗，充满活力和正能量，是人群中的焦点。行动力强，做事果断迅速，不喜欢拖泥带水。',
        '性格外向活泼，喜欢社交和与人交流，人缘很好。有领导魅力，能够激励和带动他人。',
        '性格急躁但真诚，说话直接，不喜欢拐弯抹角。有强烈的正义感，见不得不公平的事情。',
        '性格乐观向上，面对挫折能够快速调整心态。有表演天赋，喜欢展示自己，享受被关注的感觉。',
        '性格热情但有时缺乏耐心，需要学会控制情绪。有很强的执行力和决断力，适合做决策者。'
      ],
      '土': [
        '性格稳重踏实，值得信赖，是朋友和同事眼中的可靠之人。做事认真负责，有强烈的责任心和使命感。',
        '性格温和包容，不喜争执，善于化解矛盾。有很强的耐心和毅力，能够坚持完成长期目标。',
        '性格保守但务实，不喜欢冒险，更倾向于稳健的发展。有理财天赋，善于积累财富。',
        '性格固执但忠诚，一旦认定的事情不会轻易改变。有很强的组织能力和管理才能。',
        '性格内敛但内心丰富，不善于表达但情感细腻。有很强的学习能力和适应能力。'
      ],
      '金': [
        '性格刚强坚毅，意志坚定，目标明确，不达目的不罢休。做事有条理，执行力强，效率很高。',
        '性格严肃认真，对自己和他人要求都很高。有很强的原则性，不会轻易妥协。',
        '性格冷静理性，善于分析和思考，能够客观看待问题。有很强的逻辑思维能力和判断力。',
        '性格独立自主，不喜欢依赖他人，有很强的自我管理能力。有技术天赋，适合做专业技术人员。',
        '性格果断决绝，面对选择能够快速做出决定。有很强的组织能力和领导才能，但有时过于严厉。'
      ],
      '水': [
        '性格聪明灵活，适应力强，能够快速应对各种变化。思维敏捷，善于思考和总结，有很强的学习能力。',
        '性格温和善良，善于沟通和协调，是很好的倾听者和调解者。有很强的同理心，能够理解他人的感受。',
        '性格灵活变通，不喜欢一成不变的生活。有很强的创造力和想象力，适合从事创意工作。',
        '性格情绪化但真诚，情感丰富，对感情很重视。有很强的直觉和洞察力，能够看透事物的本质。',
        '性格温和但内心坚强，面对困难能够保持冷静。有很强的适应能力和应变能力，能够在逆境中成长。'
      ]
    }
    
    // 根据五行强弱调整
    const wuxingStrength = wuxing[dayWuxing] || 0
    const isStrong = wuxingStrength >= 3
    const isWeak = wuxingStrength <= 1
    
    let personality = basePersonality[dayWuxing]?.[Math.floor(Math.random() * basePersonality[dayWuxing].length)] || ''
    
    if (isStrong) {
      personality += ' 您的日主五行较旺，性格特点会更加明显，但需要注意不要过于强势，学会倾听和包容。'
    } else if (isWeak) {
      personality += ' 您的日主五行较弱，性格可能较为内敛，需要增强自信，主动表达自己的想法和需求。'
    }
    
    // 根据十神调整
    if (shishen.some(s => s.includes('正官'))) {
      personality += ' 命中有正官，您有很强的责任感和正义感，做事有原则，容易得到他人的尊重和信任。'
    }
    if (shishen.some(s => s.includes('正印'))) {
      personality += ' 命中有正印，您有很强的学习能力和智慧，喜欢思考，有很好的文化修养。'
    }
    if (shishen.some(s => s.includes('食神'))) {
      personality += ' 命中有食神，您性格温和，有艺术天赋，喜欢享受生活，人缘很好。'
    }
    
    return personality || '性格特点需要综合分析'
  }
  
  const personality = getPersonalityAnalysis(dayWuxing, wuxing, shishen)
  
  // 事业分析（更丰富）
  const getCareerAnalysis = (dayWuxing: string, _wuxing: { [key: string]: number }, shishen: string[]): string => {
    const baseCareer: { [key: string]: string[] } = {
      '木': [
        '适合从事教育、文化、艺术、出版、传媒等相关工作。您有很强的表达能力和感染力，能够很好地传递知识和理念。',
        '适合从事管理、组织、人力资源等相关工作。您有很强的领导才能和组织能力，善于协调团队关系，能够带领团队达成目标。',
        '适合创业，特别是文化创意、教育培训、咨询服务等领域。您有开拓精神和创新思维，能够发现和把握市场机会。',
        '适合从事设计、策划、咨询等需要创意和思考的工作。您有很强的想象力和创造力，能够提出独特的解决方案。',
        '适合从事医疗、健康、养生等相关工作。您有很强的同理心和责任感，能够帮助他人改善生活质量。'
      ],
      '火': [
        '适合从事销售、营销、公关、广告等相关工作。您有很强的沟通能力和说服力，能够很好地推广产品和服务。',
        '适合从事领导、管理、创业等工作。您有很强的领导魅力和执行力，能够激励团队，推动事业发展。',
        '适合从事传媒、娱乐、表演等相关工作。您有很强的表现力和感染力，能够吸引和影响他人。',
        '适合从事餐饮、旅游、服务等相关工作。您有很强的服务意识和热情，能够为他人提供优质的服务体验。',
        '适合从事互联网、科技、创新等相关工作。您有很强的行动力和创新精神，能够快速适应新技术和新趋势。'
      ],
      '土': [
        '适合从事金融、投资、房地产、建筑等相关工作。您有很强的理财能力和风险控制意识，能够稳健地积累财富。',
        '适合从事稳定、传统的行业，如制造业、农业、物流等。您有很强的执行力和稳定性，能够长期坚持做好一件事。',
        '适合从事管理、行政、人力资源等相关工作。您有很强的组织能力和协调能力，能够维护团队的稳定和和谐。',
        '适合从事咨询、规划、设计等相关工作。您有很强的分析能力和规划能力，能够制定长期的发展战略。',
        '适合从事教育、培训、文化传承等相关工作。您有很强的责任感和使命感，能够传承和发扬优秀的文化传统。'
      ],
      '金': [
        '适合从事技术、工程、制造、研发等相关工作。您有很强的逻辑思维能力和技术能力，能够解决复杂的技术问题。',
        '适合从事金融、投资、会计、审计等相关工作。您有很强的分析能力和风险控制能力，能够做出准确的判断和决策。',
        '适合从事法律、执法、安全等相关工作。您有很强的原则性和正义感，能够维护公平和正义。',
        '适合从事管理、监督、质量控制等相关工作。您有很强的执行力和监督能力，能够确保工作的高质量完成。',
        '适合从事专业技术人员，如医生、工程师、科学家等。您有很强的专业能力和钻研精神，能够在专业领域取得成就。'
      ],
      '水': [
        '适合从事贸易、物流、运输、供应链等相关工作。您有很强的协调能力和应变能力，能够处理复杂的业务关系。',
        '适合从事咨询、策划、分析等相关工作。您有很强的思维能力和分析能力，能够提供专业的建议和方案。',
        '适合从事互联网、电商、新媒体等相关工作。您有很强的适应能力和创新能力，能够快速把握市场趋势。',
        '适合从事服务、销售、客服等相关工作。您有很强的沟通能力和服务意识，能够很好地满足客户需求。',
        '适合从事创意、设计、艺术等相关工作。您有很强的想象力和创造力，能够创造出独特的作品和方案。'
      ]
    }
    
    let career = baseCareer[dayWuxing]?.[Math.floor(Math.random() * baseCareer[dayWuxing].length)] || ''
    
    // 根据十神调整
    if (shishen.some(s => s.includes('正官'))) {
      career += ' 命中有正官，您适合在体制内或大型企业工作，有很好的晋升机会，容易获得权威和地位。'
    }
    if (shishen.some(s => s.includes('偏官') || s.includes('七杀'))) {
      career += ' 命中有七杀，您有很强的竞争意识和冒险精神，适合创业或在竞争激烈的行业工作，能够应对挑战。'
    }
    if (shishen.some(s => s.includes('正财'))) {
      career += ' 命中有正财，您有稳定的收入来源，适合从事传统、稳定的工作，能够通过努力获得财富。'
    }
    if (shishen.some(s => s.includes('偏财'))) {
      career += ' 命中有偏财，您有很好的投资和理财能力，适合从事金融、投资等工作，能够通过投资获得额外收入。'
    }
    if (shishen.some(s => s.includes('食神'))) {
      career += ' 命中有食神，您有艺术天赋和创造力，适合从事文化、艺术、创意等相关工作，能够发挥自己的才华。'
    }
    if (shishen.some(s => s.includes('伤官'))) {
      career += ' 命中有伤官，您有很强的表达能力和创新能力，适合从事传媒、设计、技术等相关工作，能够展现自己的才华。'
    }
    
    return career || '事业发展需要结合实际情况'
  }
  
  const career = getCareerAnalysis(dayWuxing, wuxing, shishen)
  
  // 财运分析（更丰富）
  const getWealthAnalysis = (maxWuxing: string, _minWuxing: string, wuxing: { [key: string]: number }, shishen: string[]): string => {
    let wealthText = ''
    
    // 基础财运分析
    if (maxWuxing === '金' || maxWuxing === '土') {
      wealthText = '您的财运较好，有很强的理财天赋和积累财富的能力。适合稳健投资，如房地产、金融产品等。'
      wealthText += ' 您对金钱有很好的敏感度，能够发现和把握投资机会。建议制定长期的理财计划，通过稳健的方式积累财富。'
    } else if (maxWuxing === '火') {
      wealthText = '您的财运起伏较大，有很强的赚钱能力，但花钱也比较快。适合积极进取的投资方式，但需要谨慎控制风险。'
      wealthText += ' 您有很强的商业头脑和执行力，适合创业或投资高风险高回报的项目。建议做好风险控制，避免过度投资。'
    } else if (maxWuxing === '水') {
      wealthText = '您的财运平稳，有很好的理财规划能力。适合通过多种渠道获得收入，如主业加副业、投资理财等。'
      wealthText += ' 您有很强的适应能力和应变能力，能够根据市场变化调整投资策略。建议保持灵活性，不要过于保守。'
    } else {
      wealthText = '您的财运平稳，需要合理规划，避免冲动消费。适合稳健的理财方式，如定期存款、基金定投等。'
      wealthText += ' 您有很好的学习能力，可以通过学习理财知识来提升自己的财富管理能力。建议制定详细的财务计划。'
    }
    
    // 根据十神调整
    if (shishen.some(s => s.includes('正财'))) {
      wealthText += ' 命中有正财，您有稳定的收入来源，能够通过努力工作获得财富。建议保持稳定的工作，同时做好理财规划。'
    }
    if (shishen.some(s => s.includes('偏财'))) {
      wealthText += ' 命中有偏财，您有很好的投资和理财能力，能够通过投资、副业等方式获得额外收入。建议把握投资机会，但要注意风险控制。'
    }
    if (shishen.some(s => s.includes('比肩') || s.includes('劫财'))) {
      wealthText += ' 命中有比劫，您有很强的赚钱能力，但花钱也比较快。建议做好财务规划，避免过度消费，学会储蓄和投资。'
    }
    
    // 根据五行强弱调整
    if (wuxing['金'] >= 3) {
      wealthText += ' 五行中金较旺，您有很强的理财能力和风险控制意识，适合从事金融、投资等相关工作，能够通过专业能力获得财富。'
    }
    if (wuxing['土'] >= 3) {
      wealthText += ' 五行中土较旺，您有很强的积累财富的能力，适合稳健投资，如房地产、土地等，能够通过长期持有获得收益。'
    }
    
    return wealthText
  }
  
  const wealthText = getWealthAnalysis(maxWuxing, minWuxing, wuxing, shishen)
  
  // 健康分析（更丰富）
  const getHealthAnalysis = (minWuxing: string, wuxing: { [key: string]: number }, dayWuxing: string): string => {
    let healthText = ''
    
    // 基础健康分析
    if (minWuxing === '水') {
      healthText = '您需要注意肾脏、泌尿系统、生殖系统的健康。建议多补充水分，保持规律的作息，避免过度劳累。'
      healthText += ' 平时可以多吃一些黑色食物，如黑豆、黑芝麻等，有助于补肾。避免熬夜和过度饮酒，保持充足的睡眠。'
    } else if (minWuxing === '火') {
      healthText = '您需要注意心脏、血液循环、心血管系统的健康。建议保持情绪稳定，避免过度激动和压力。'
      healthText += ' 平时可以多做一些有氧运动，如散步、慢跑等，有助于促进血液循环。避免过度劳累和情绪波动，保持心情愉悦。'
    } else if (minWuxing === '木') {
      healthText = '您需要注意肝胆、神经系统、眼睛的健康。建议保持规律作息，避免熬夜和过度用眼。'
      healthText += ' 平时可以多吃一些绿色食物，如青菜、水果等，有助于护肝。避免过度饮酒和情绪波动，保持心情舒畅。'
    } else if (minWuxing === '金') {
      healthText = '您需要注意呼吸系统、皮肤、大肠的健康。建议避免过度劳累，保持充足的休息，注意保暖。'
      healthText += ' 平时可以多吃一些白色食物，如白萝卜、梨等，有助于润肺。避免吸烟和接触有害气体，保持空气流通。'
    } else {
      healthText = '您的身体健康状况总体良好，但需要注意脾胃、消化系统的健康。建议保持规律的饮食和作息。'
      healthText += ' 平时可以多吃一些黄色食物，如小米、南瓜等，有助于健脾。避免暴饮暴食和过度劳累，保持适度运动。'
    }
    
    // 根据日主五行调整
    if (dayWuxing === '木' && wuxing['木'] < 2) {
      healthText += ' 您的日主为木但木较弱，需要特别注意肝胆健康，建议多进行户外活动，接触自然，有助于提升木的能量。'
    }
    if (dayWuxing === '火' && wuxing['火'] < 2) {
      healthText += ' 您的日主为火但火较弱，需要特别注意心脏健康，建议多进行适度的运动，保持心情愉悦，有助于提升火的能量。'
    }
    if (dayWuxing === '土' && wuxing['土'] < 2) {
      healthText += ' 您的日主为土但土较弱，需要特别注意脾胃健康，建议保持规律的饮食，避免暴饮暴食，有助于提升土的能量。'
    }
    if (dayWuxing === '金' && wuxing['金'] < 2) {
      healthText += ' 您的日主为金但金较弱，需要特别注意呼吸系统健康，建议多进行深呼吸练习，保持空气流通，有助于提升金的能量。'
    }
    if (dayWuxing === '水' && wuxing['水'] < 2) {
      healthText += ' 您的日主为水但水较弱，需要特别注意肾脏健康，建议多补充水分，保持规律的作息，有助于提升水的能量。'
    }
    
    return healthText
  }
  
  const healthText = getHealthAnalysis(minWuxing, wuxing, dayWuxing)
  
  // 感情分析（更丰富）
  const getRelationshipAnalysis = (shishen: string[], _dayWuxing: string, wuxing: { [key: string]: number }): string => {
    let relationshipText = ''
    
    // 基础感情分析
    if (shishen.some(s => s.includes('正官'))) {
      relationshipText = '您的感情运势较好，容易遇到合适的伴侣，婚姻稳定幸福。您有很强的责任感和家庭观念，能够很好地经营感情和婚姻。'
      relationshipText += ' 您对感情认真负责，不会轻易放弃，能够与伴侣共同面对生活中的困难和挑战。建议保持沟通和理解，共同成长。'
    } else if (shishen.some(s => s.includes('正财'))) {
      relationshipText = '您的感情运势平稳，能够遇到合适的伴侣，婚姻生活和谐稳定。您有很强的理财能力，能够为家庭提供稳定的经济基础。'
      relationshipText += ' 您对感情忠诚专一，重视家庭和亲情，能够与伴侣共同规划未来。建议保持浪漫和惊喜，让感情保持新鲜感。'
    } else if (shishen.some(s => s.includes('七杀') || s.includes('偏官'))) {
      relationshipText = '您的感情经历较为丰富，容易遇到不同类型的异性，但需要找到真正适合自己的人。您有很强的个人魅力，但有时过于强势。'
      relationshipText += ' 您对感情有很高的要求，不容易满足，需要学会包容和理解。建议保持真诚和沟通，找到能够相互理解和支持的伴侣。'
    } else if (shishen.some(s => s.includes('偏财'))) {
      relationshipText = '您的感情运势起伏较大，容易遇到桃花，但需要谨慎选择。您有很强的个人魅力，但有时过于花心，需要学会专一。'
      relationshipText += ' 您对感情有很高的要求，喜欢新鲜感和刺激，但需要找到能够真正理解和支持自己的人。建议保持真诚和责任感。'
    } else if (shishen.some(s => s.includes('食神'))) {
      relationshipText = '您的感情运势较好，容易遇到温柔体贴的伴侣，婚姻生活和谐美满。您有很强的艺术气质和浪漫情怀，能够为感情增添色彩。'
      relationshipText += ' 您对感情重视精神层面的交流，喜欢与伴侣分享生活中的美好。建议保持沟通和理解，共同创造美好的回忆。'
    } else if (shishen.some(s => s.includes('伤官'))) {
      relationshipText = '您的感情运势较为复杂，容易遇到性格差异较大的伴侣，需要学会包容和理解。您有很强的表达能力和个人魅力，但有时过于挑剔。'
      relationshipText += ' 您对感情有很高的要求，不容易满足，需要学会欣赏和珍惜。建议保持真诚和沟通，找到能够相互理解和支持的伴侣。'
    } else {
      relationshipText = '您的感情运势平稳，需要主动把握机会，真诚对待感情。您有很强的责任感和家庭观念，能够很好地经营感情和婚姻。'
      relationshipText += ' 您对感情认真负责，不会轻易放弃，能够与伴侣共同面对生活中的困难和挑战。建议保持沟通和理解，共同成长。'
    }
    
    // 根据五行调整
    if (wuxing['火'] >= 3) {
      relationshipText += ' 五行中火较旺，您有很强的热情和魅力，容易吸引异性，但需要注意控制情绪，避免过于急躁和冲动。'
    }
    if (wuxing['水'] >= 3) {
      relationshipText += ' 五行中水较旺，您有很强的感情和同理心，能够很好地理解和支持伴侣，但需要注意情绪管理，避免过于敏感。'
    }
    if (wuxing['金'] >= 3) {
      relationshipText += ' 五行中金较旺，您对感情有很高的要求，不容易满足，需要学会包容和理解，找到真正适合自己的人。'
    }
    if (wuxing['木'] >= 3) {
      relationshipText += ' 五行中木较旺，您有很强的责任感和家庭观念，能够很好地经营感情和婚姻，但需要注意不要过于固执。'
    }
    if (wuxing['土'] >= 3) {
      relationshipText += ' 五行中土较旺，您对感情忠诚专一，重视家庭和亲情，能够为家庭提供稳定的基础，但需要注意不要过于保守。'
    }
    
    return relationshipText
  }
  
  const relationshipText = getRelationshipAnalysis(shishen, dayWuxing, wuxing)
  
  // 总结
  const summary = `您的日主为${dayGan}(${dayWuxing})，五行中${maxWuxing}较旺，${minWuxing}较弱。整体来说，您${personality}，在${career}方面有优势。财运方面${wealthText}。健康方面${healthText}。感情方面${relationshipText}。`
  
  return {
    personality,
    career,
    wealth: wealthText,
    health: healthText,
    relationship: relationshipText,
    summary
  }
}

export interface BaziFortuneResult {
  bazi: string[]
  wuxing: { [key: string]: number }
  shishen: string[]
  interpretation: BaziInterpretation
}

export function computeBaziFortune(date: Date, shichen: string): BaziFortuneResult | null {
  const yearPillar = calculateYearPillar(date)
  const monthPillar = calculateMonthPillar(date, yearPillar)
  const dayPillar = calculateDayPillar(date)
  const hourPillar = calculateHourPillarFromShichen(dayPillar, shichen)
  if (!hourPillar) return null
  const bazi = [yearPillar, monthPillar, dayPillar, hourPillar]
  const wuxing = analyzeWuxingFromBazi(bazi)
  const shishen = analyzeShishen(bazi)
  const interpretation = interpretBazi(bazi, wuxing, shishen)
  return { bazi, wuxing, shishen, interpretation }
}
