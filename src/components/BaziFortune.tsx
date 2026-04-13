import { useState } from 'react'
import './BaziFortune.css'
import { toast } from '../utils/toast'

// 天干地支
const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 天干对应的五行
const tianganWuxing: { [key: string]: string } = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
}

// 地支对应的五行
const dizhiWuxing: { [key: string]: string } = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
}

// 十神关系
const shishenMap: { [key: string]: { [key: string]: string } } = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
}

// 精确计算节气的日期
const getSolarTermDate = (year: number, termIndex: number): Date => {
  const solarLongitude = [315, 330, 345, 0, 15, 30, 45, 60, 75, 90, 105, 120]
  const targetLongitude = solarLongitude[termIndex]
  const springEquinox = new Date(year, 2, 20)
  const daysFromEquinox = (targetLongitude - 0 + 360) % 360
  const days = Math.round(daysFromEquinox * 365.2422 / 360)
  const termDate = new Date(springEquinox)
  termDate.setDate(termDate.getDate() + days)
  return termDate
}

// 计算立春日期
const getLichunDate = (year: number): Date => {
  return getSolarTermDate(year, 0)
}

// 计算年柱
const calculateYearPillar = (date: Date): string => {
  const year = date.getFullYear()
  const lichun = getLichunDate(year)
  const lichunNext = getLichunDate(year + 1)
  
  let actualYear = year
  if (date < lichun) {
    actualYear = year - 1
  } else if (date >= lichunNext) {
    actualYear = year + 1
  }
  
  const ganIndex = (actualYear - 4) % 10
  const zhiIndex = (actualYear - 4) % 12
  return tiangan[ganIndex] + dizhi[zhiIndex]
}

// 精确计算节气对应的月份
const getJieqiMonth = (year: number, month: number, day: number): number => {
  const currentDate = new Date(year, month - 1, day)
  
  // 判断是否在立春之前，如果是则使用上一年
  let actualYear = year
  const lichunThisYear = getSolarTermDate(year, 0) // 立春
  if (currentDate < lichunThisYear) {
    actualYear = year - 1
  }
  
  // 获取当前年份的所有节气日期
  const solarTerms: Date[] = []
  for (let i = 0; i < 12; i++) {
    solarTerms.push(getSolarTermDate(actualYear, i))
  }
  // 添加下一年的立春（用于判断小寒后的日期）
  solarTerms.push(getSolarTermDate(actualYear + 1, 0))
  
  // 判断当前日期属于哪个节气月
  for (let i = 0; i < 12; i++) {
    if (currentDate >= solarTerms[i] && currentDate < solarTerms[i + 1]) {
      // 返回节气月（农历月份，从立春开始为正月）
      return i + 1 // 立春为正月（1），惊蛰为二月（2），以此类推
    }
  }
  
  // 如果在小寒之后、立春之前，返回12月（上一年）
  return 12
}

// 计算月柱
const calculateMonthPillar = (date: Date, yearPillar: string): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 获取节气月（农历月份，从立春开始为正月）
  const jieqiMonth = getJieqiMonth(year, month, day)
  
  // 月支：正月为寅，二月为卯，以此类推
  // 正月对应寅（索引2），所以 jieqiMonth=1 时，月支索引应该是 2
  const monthZhiIndex = (jieqiMonth + 1) % 12
  const monthZhi = dizhi[monthZhiIndex]
  
  // 月干：根据年干和月支计算（五虎遁）
  // 甲己之年丙作首，乙庚之年戊为头，丙辛之年寻庚起，丁壬壬寅顺水流，若问戊癸何处起，甲寅之上好追求
  const yearGan = yearPillar[0]
  const yearGanIndex = tiangan.indexOf(yearGan)
  
  let monthGanIndex = 0
  if (yearGanIndex === 0 || yearGanIndex === 5) { // 甲或己
    monthGanIndex = (2 + jieqiMonth - 1) % 10 // 丙作首，正月为丙
  } else if (yearGanIndex === 1 || yearGanIndex === 6) { // 乙或庚
    monthGanIndex = (4 + jieqiMonth - 1) % 10 // 戊为头
  } else if (yearGanIndex === 2 || yearGanIndex === 7) { // 丙或辛
    monthGanIndex = (6 + jieqiMonth - 1) % 10 // 寻庚起
  } else if (yearGanIndex === 3 || yearGanIndex === 8) { // 丁或壬
    monthGanIndex = (8 + jieqiMonth - 1) % 10 // 壬寅顺水流
  } else { // 戊或癸
    monthGanIndex = (0 + jieqiMonth - 1) % 10 // 甲寅之上
  }
  
  const monthGan = tiangan[monthGanIndex]
  
  return monthGan + monthZhi
}

// 计算日柱
const calculateDayPillar = (date: Date): string => {
  const baseDate = new Date(1900, 0, 1)
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  const ganIndex = (daysDiff + 6) % 10
  const zhiIndex = (daysDiff + 8) % 12
  return tiangan[ganIndex] + dizhi[zhiIndex]
}

// 计算时柱
const calculateHourPillar = (dayPillar: string, birthTime: string): string => {
  const shichen = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  const hourZhi = birthTime || '子'
  const hourIndex = shichen.indexOf(hourZhi)
  if (hourIndex === -1) return ''
  
  const dayGan = dayPillar[0]
  const dayGanIndex = tiangan.indexOf(dayGan)
  
  let hourGanIndex = 0
  if (dayGanIndex === 0 || dayGanIndex === 5) {
    hourGanIndex = (0 + hourIndex) % 10
  } else if (dayGanIndex === 1 || dayGanIndex === 6) {
    hourGanIndex = (2 + hourIndex) % 10
  } else if (dayGanIndex === 2 || dayGanIndex === 7) {
    hourGanIndex = (4 + hourIndex) % 10
  } else if (dayGanIndex === 3 || dayGanIndex === 8) {
    hourGanIndex = (6 + hourIndex) % 10
  } else {
    hourGanIndex = (8 + hourIndex) % 10
  }
  
  return tiangan[hourGanIndex] + hourZhi
}

// 分析五行
const analyzeWuxing = (bazi: string[]): { [key: string]: number } => {
  const wuxingCount: { [key: string]: number } = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  
  bazi.forEach(pillar => {
    if (pillar.length >= 2) {
      const gan = pillar[0]
      const zhi = pillar[1]
      if (tianganWuxing[gan]) wuxingCount[tianganWuxing[gan]]++
      if (dizhiWuxing[zhi]) wuxingCount[dizhiWuxing[zhi]]++
    }
  })
  
  return wuxingCount
}

// 分析十神
const analyzeShishen = (bazi: string[]): string[] => {
  if (bazi.length < 4) return []
  const dayGan = bazi[2][0]
  const shishen: string[] = []
  
  bazi.forEach((pillar, index) => {
    if (index !== 2 && pillar.length >= 1) {
      const gan = pillar[0]
      const shishenName = shishenMap[dayGan]?.[gan] || ''
      if (shishenName) shishen.push(`${pillar}(${shishenName})`)
    }
  })
  
  return shishen
}

// 命理解读
const interpretBazi = (bazi: string[], wuxing: { [key: string]: number }, shishen: string[]): {
  personality: string
  career: string
  wealth: string
  health: string
  relationship: string
  summary: string
} => {
  const dayGan = bazi[2]?.[0] || ''
  const dayWuxing = tianganWuxing[dayGan] || '土'
  
  // 找出最多的五行
  const maxWuxing = Object.entries(wuxing).reduce((a, b) => wuxing[a[0]] > wuxing[b[0]] ? a : b)[0]
  const minWuxing = Object.entries(wuxing).reduce((a, b) => wuxing[a[0]] < wuxing[b[0]] ? a : b)[0]
  
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

// 农历数据表（1900-2100年，共201年）
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520, 0x0f968, 0x05580, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0,
  0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3,
  0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50,
  0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50,
  0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52,
  0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7,
  0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0,
  0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63, 0x09370, 0x049f8, 0x04970,
  0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, 0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557,
  0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, 0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0,
  0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, 0x0b273, 0x06930, 0x07337, 0x06aa0,
  0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, 0x0e968, 0x0d520, 0x0daa0, 0x16aa6,
  0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0f968, 0x05580, 0x0b540
]

// 获取闰月月份
function getLeapMonth(year: number): number {
  const yearIndex = year - 1900
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) return 0
  const info = lunarInfo[yearIndex]
  return info & 0xf
}

// 获取闰月天数
function getLeapDays(year: number): number {
  const leapMonth = getLeapMonth(year)
  if (leapMonth === 0) return 0
  const yearIndex = year - 1900
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) return 0
  const info = lunarInfo[yearIndex]
  return (info & 0x10000) ? 30 : 29
}

// 获取农历年总天数
function getLunarYearDays(year: number): number {
  const yearIndex = year - 1900
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) return 0
  const info = lunarInfo[yearIndex]
  let total = 0
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    total += (info & i) ? 30 : 29
  }
  return total + getLeapDays(year)
}

// 获取农历月天数
function getLunarMonthDays(year: number, month: number): number {
  const yearIndex = year - 1900
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) return 0
  const info = lunarInfo[yearIndex]
  
  // 处理闰月：month > 12 表示闰某月
  const isLeapMonth = month > 12
  const baseMonth = isLeapMonth ? month - 12 : month
  
  if (baseMonth < 1 || baseMonth > 12) return 0
  
  // 如果是闰月，返回闰月天数
  if (isLeapMonth) {
    return (info & 0x10000) ? 30 : 29
  }
  
  // 普通月份
  return (info & (0x10000 >> baseMonth)) ? 30 : 29
}

// 农历转阳历
function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number): Date | null {
  if (lunarYear < 1900 || lunarYear > 2100) {
    return null
  }
  
  const yearIndex = lunarYear - 1900
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) {
    return null
  }
  
  const leapMonth = getLeapMonth(lunarYear)
  const isLeapMonth = lunarMonth > 12
  const baseMonth = isLeapMonth ? lunarMonth - 12 : lunarMonth

  if (baseMonth < 1 || baseMonth > 12) {
    return null
  }
  if (isLeapMonth && baseMonth !== leapMonth) {
    return null
  }
  
  const monthDays = getLunarMonthDays(lunarYear, lunarMonth)
  if (lunarDay < 1 || lunarDay > monthDays) {
    return null
  }
  
  let totalDays = 0
  const baseDate = new Date(1900, 0, 31)
  
  for (let y = 1900; y < lunarYear; y++) {
    totalDays += getLunarYearDays(y)
  }
  
  for (let m = 1; m < baseMonth; m++) {
    totalDays += getLunarMonthDays(lunarYear, m)
    if (leapMonth > 0 && m === leapMonth) {
      totalDays += getLunarMonthDays(lunarYear, leapMonth + 12)
    }
  }
  if (isLeapMonth) totalDays += getLunarMonthDays(lunarYear, baseMonth)
  
  totalDays += lunarDay - 1
  
  const solarDate = new Date(baseDate)
  solarDate.setDate(solarDate.getDate() + totalDays)
  
  return solarDate
}

function BaziFortune() {
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar')
  const [birthDate, setBirthDate] = useState('')
  const [lunarYear, setLunarYear] = useState('')
  const [lunarMonth, setLunarMonth] = useState('')
  const [lunarDay, setLunarDay] = useState('')
  const [isLunarLeapMonth, setIsLunarLeapMonth] = useState(false)
  const [birthTime, setBirthTime] = useState('子')
  const [result, setResult] = useState<{
    bazi: string[]
    wuxing: { [key: string]: number }
    shishen: string[]
    interpretation: {
      personality: string
      career: string
      wealth: string
      health: string
      relationship: string
      summary: string
    }
  } | null>(null)

  const shichenOptions = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const shichenNames: { [key: string]: string } = {
    '子': '子时(23:00-01:00)', '丑': '丑时(01:00-03:00)', '寅': '寅时(03:00-05:00)',
    '卯': '卯时(05:00-07:00)', '辰': '辰时(07:00-09:00)', '巳': '巳时(09:00-11:00)',
    '午': '午时(11:00-13:00)', '未': '未时(13:00-15:00)', '申': '申时(15:00-17:00)',
    '酉': '酉时(17:00-19:00)', '戌': '戌时(19:00-21:00)', '亥': '亥时(21:00-23:00)'
  }

  const calculateFortune = () => {
    let date: Date | null = null

    if (calendarType === 'solar') {
      if (!birthDate) {
        toast.warning('请输入出生日期')
        return
      }
      date = new Date(birthDate)
      if (isNaN(date.getTime())) {
        toast.error('请输入有效的日期')
        return
      }
    } else {
      // 农历
      if (!lunarYear || !lunarMonth || !lunarDay) {
        toast.warning('请完整输入农历日期')
        return
      }

      const year = parseInt(lunarYear)
      const month = parseInt(lunarMonth)
      const day = parseInt(lunarDay)

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        toast.error('请输入有效的日期')
        return
      }

      if (year < 1900 || year > 2100) {
        toast.warning('请输入1900-2100年之间的日期')
        return
      }

      const lunarMonthParam = isLunarLeapMonth ? month + 12 : month
      const solarDate = lunarToSolar(year, lunarMonthParam, day)
      
      if (!solarDate) {
        toast.error('农历日期转换失败，可能原因：\n1. 日期超出支持范围（1900-2100年）\n2. 输入的日期无效\n3. 该年没有对应的农历月份\n\n请检查输入的日期是否正确。')
        return
      }
      
      date = solarDate
    }

    if (!date) {
      toast.error('日期计算失败')
      return
    }

    // 计算八字
    const yearPillar = calculateYearPillar(date)
    const monthPillar = calculateMonthPillar(date, yearPillar)
    const dayPillar = calculateDayPillar(date)
    const hourPillar = calculateHourPillar(dayPillar, birthTime)

    if (!hourPillar) {
      toast.warning('请选择出生时辰')
      return
    }

    const bazi = [yearPillar, monthPillar, dayPillar, hourPillar]
    const wuxing = analyzeWuxing(bazi)
    const shishen = analyzeShishen(bazi)
    const interpretation = interpretBazi(bazi, wuxing, shishen)

    setResult({
      bazi,
      wuxing,
      shishen,
      interpretation
    })
  }

  return (
    <div className="bazi-fortune-container">
      <div className="bazi-header">
        <h1>🔮 八字算命</h1>
        <p className="subtitle">通过生辰八字分析您的性格、事业、财运、健康和感情</p>
      </div>

      <div className="bazi-input-section">
        <div className="input-group">
          <label>历法类型</label>
          <div className="calendar-type-toggle">
            <button
              className={`toggle-btn ${calendarType === 'solar' ? 'active' : ''}`}
              onClick={() => setCalendarType('solar')}
            >
              阳历
            </button>
            <button
              className={`toggle-btn ${calendarType === 'lunar' ? 'active' : ''}`}
              onClick={() => setCalendarType('lunar')}
            >
              农历
            </button>
          </div>
        </div>

        {calendarType === 'solar' ? (
          <div className="input-group">
            <label>出生日期（阳历）</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        ) : (
          <>
            <div className="input-group">
              <label>出生日期（农历）</label>
              <div className="lunar-inputs">
                <input
                  type="number"
                  placeholder="年"
                  value={lunarYear}
                  onChange={(e) => setLunarYear(e.target.value)}
                  min="1900"
                  max="2100"
                />
                <span className="input-separator">年</span>
                <input
                  type="number"
                  placeholder="月"
                  value={lunarMonth}
                  onChange={(e) => setLunarMonth(e.target.value)}
                  min="1"
                  max="12"
                />
                <span className="input-separator">月</span>
                <input
                  type="number"
                  placeholder="日"
                  value={lunarDay}
                  onChange={(e) => setLunarDay(e.target.value)}
                  min="1"
                  max="30"
                />
                <span className="input-separator">日</span>
              </div>
            </div>
            <div className="input-group">
              <label className="leap-checkbox-label">
                <input
                  type="checkbox"
                  checked={isLunarLeapMonth}
                  onChange={(e) => setIsLunarLeapMonth(e.target.checked)}
                />
                <span>闰月</span>
              </label>
            </div>
          </>
        )}

        <div className="input-group">
          <label>出生时辰</label>
          <select
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
          >
            {shichenOptions.map(shichen => (
              <option key={shichen} value={shichen}>
                {shichenNames[shichen]}
              </option>
            ))}
          </select>
        </div>

        <button className="calculate-btn" onClick={calculateFortune}>
          开始算命
        </button>
      </div>

      {result && (
        <div className="bazi-result-section">
          <div className="bazi-pillars">
            <h3>您的八字</h3>
            <div className="pillars-display">
              <div className="pillar">
                <div className="pillar-label">年柱</div>
                <div className="pillar-value">{result.bazi[0]}</div>
              </div>
              <div className="pillar">
                <div className="pillar-label">月柱</div>
                <div className="pillar-value">{result.bazi[1]}</div>
              </div>
              <div className="pillar">
                <div className="pillar-label">日柱</div>
                <div className="pillar-value">{result.bazi[2]}</div>
              </div>
              <div className="pillar">
                <div className="pillar-label">时柱</div>
                <div className="pillar-value">{result.bazi[3]}</div>
              </div>
            </div>
          </div>

          <div className="wuxing-analysis">
            <h3>五行分析</h3>
            <div className="wuxing-bars">
              {Object.entries(result.wuxing).map(([wuxing, count]) => (
                <div key={wuxing} className="wuxing-item">
                  <div className="wuxing-label">{wuxing}</div>
                  <div className="wuxing-bar">
                    <div
                      className="wuxing-fill"
                      style={{ width: `${(count / 8) * 100}%` }}
                    />
                  </div>
                  <div className="wuxing-count">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {result.shishen.length > 0 && (
            <div className="shishen-analysis">
              <h3>十神分析</h3>
              <div className="shishen-tags">
                {result.shishen.map((s, index) => (
                  <span key={index} className="shishen-tag">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="interpretation-section">
            <h3>命理解读</h3>
            <div className="interpretation-cards">
              <div className="interpretation-card">
                <h4>性格特点</h4>
                <p>{result.interpretation.personality}</p>
              </div>
              <div className="interpretation-card">
                <h4>事业发展</h4>
                <p>{result.interpretation.career}</p>
              </div>
              <div className="interpretation-card">
                <h4>财运分析</h4>
                <p>{result.interpretation.wealth}</p>
              </div>
              <div className="interpretation-card">
                <h4>健康状况</h4>
                <p>{result.interpretation.health}</p>
              </div>
              <div className="interpretation-card">
                <h4>感情婚姻</h4>
                <p>{result.interpretation.relationship}</p>
              </div>
            </div>
            <div className="summary-card">
              <h4>综合总结</h4>
              <p>{result.interpretation.summary}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bazi-tips">
        <h4>温馨提示</h4>
        <ul>
          <li>八字算命仅供参考，不应过度依赖</li>
          <li>命运掌握在自己手中，努力和选择同样重要</li>
          <li>传统命理与现代科学结合，理性看待</li>
          <li>如有疑问，建议咨询专业命理师</li>
        </ul>
      </div>
    </div>
  )
}

export default BaziFortune

