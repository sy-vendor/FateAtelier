import { useState, useMemo } from 'react'
import './QimenDunjia.css'
import { calculateDayPillar, calculateHourPillar } from '../utils/bazi'
import { getSolarTermDate } from '../utils/lunarCalendar'
import { tiangan, dizhi } from '../utils/constants'

// 八门
const bamen = ['休门', '死门', '伤门', '杜门', '', '开门', '惊门', '生门', '景门']
const bamenNames = ['休', '死', '伤', '杜', '', '开', '惊', '生', '景']
const bamenMeanings: { [key: string]: { meaning: string; auspicious: boolean; description: string } } = {
  '休门': { meaning: '休息、休养', auspicious: true, description: '主休息、休养、安闲，适合静养、调整' },
  '生门': { meaning: '生长、生机', auspicious: true, description: '主生长、生机、希望，适合创业、发展' },
  '开门': { meaning: '开放、通达', auspicious: true, description: '主开放、通达、顺利，适合开始新事物' },
  '景门': { meaning: '光明、美景', auspicious: true, description: '主光明、美景、文化，适合学习、展示' },
  '死门': { meaning: '死亡、终结', auspicious: false, description: '主死亡、终结、闭塞，不宜行动' },
  '惊门': { meaning: '惊恐、不安', auspicious: false, description: '主惊恐、不安、变动，需谨慎' },
  '伤门': { meaning: '伤害、损失', auspicious: false, description: '主伤害、损失、争斗，需避免冲突' },
  '杜门': { meaning: '阻塞、封闭', auspicious: false, description: '主阻塞、封闭、隐藏，宜保守' }
}

// 九星
const jiuxing = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英']
const jiuxingNames = ['蓬', '芮', '冲', '辅', '禽', '心', '柱', '任', '英']
const jiuxingMeanings: { [key: string]: { meaning: string; auspicious: boolean; description: string } } = {
  '天蓬': { meaning: '大盗之星', auspicious: false, description: '主盗贼、破败，需防小人' },
  '天芮': { meaning: '病符之星', auspicious: false, description: '主疾病、问题，需注意健康' },
  '天冲': { meaning: '雷震之星', auspicious: true, description: '主雷震、行动，适合快速行动' },
  '天辅': { meaning: '文曲之星', auspicious: true, description: '主文曲、智慧，适合学习、教育' },
  '天禽': { meaning: '中正之星', auspicious: true, description: '主中正、稳定，适合决策' },
  '天心': { meaning: '天医之星', auspicious: true, description: '主天医、治疗，适合求医、养生' },
  '天柱': { meaning: '破军之星', auspicious: false, description: '主破军、破坏，需谨慎' },
  '天任': { meaning: '左辅之星', auspicious: true, description: '主左辅、帮助，适合合作' },
  '天英': { meaning: '右弼之星', auspicious: true, description: '主右弼、光明，适合展示' }
}

// 八神
const bashen = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天']
const bashenNames = ['符', '蛇', '阴', '合', '虎', '武', '地', '天']
const bashenMeanings: { [key: string]: { meaning: string; auspicious: boolean; description: string } } = {
  '值符': { meaning: '领导、权威', auspicious: true, description: '主领导、权威，代表最高能量' },
  '腾蛇': { meaning: '虚诈、变化', auspicious: false, description: '主虚诈、变化，需防欺骗' },
  '太阴': { meaning: '阴柔、隐藏', auspicious: true, description: '主阴柔、隐藏，适合暗中行动' },
  '六合': { meaning: '和合、合作', auspicious: true, description: '主和合、合作，适合合作、婚姻' },
  '白虎': { meaning: '凶险、争斗', auspicious: false, description: '主凶险、争斗，需避免冲突' },
  '玄武': { meaning: '盗贼、小人', auspicious: false, description: '主盗贼、小人，需防小人' },
  '九地': { meaning: '稳定、保守', auspicious: true, description: '主稳定、保守，适合守成' },
  '九天': { meaning: '高远、发展', auspicious: true, description: '主高远、发展，适合开拓' }
}

// 方位
const directions = ['东', '东南', '南', '西南', '中', '西', '西北', '北', '东北']
const directionAngles: { [key: string]: number } = {
  '东': 90, '东南': 135, '南': 180, '西南': 225,
  '中': 0, '西': 270, '西北': 315, '北': 0, '东北': 45
}

// 九宫格位置（从左上到右下）
const palacePositions = [
  { row: 0, col: 0, name: '巽宫', direction: '东南' },
  { row: 0, col: 1, name: '离宫', direction: '南' },
  { row: 0, col: 2, name: '坤宫', direction: '西南' },
  { row: 1, col: 0, name: '震宫', direction: '东' },
  { row: 1, col: 1, name: '中宫', direction: '中' },
  { row: 1, col: 2, name: '兑宫', direction: '西' },
  { row: 2, col: 0, name: '艮宫', direction: '东北' },
  { row: 2, col: 1, name: '坎宫', direction: '北' },
  { row: 2, col: 2, name: '乾宫', direction: '西北' }
]

// 计算24节气的完整日期（基于天文算法）
function getAllSolarTerms(year: number): Date[] {
  const terms: Date[] = []
  // 24节气：立春、雨水、惊蛰、春分、清明、谷雨、立夏、小满、芒种、夏至、小暑、大暑、立秋、处暑、白露、秋分、寒露、霜降、立冬、小雪、大雪、冬至、小寒、大寒
  // getSolarTermDate 支持12个主要节气，我们需要计算完整的24个
  
  // 先计算12个主要节气
  for (let i = 0; i < 12; i++) {
    terms.push(getSolarTermDate(year, i))
  }
  
  // 计算另外12个节气（通过插值）
  // 每个节气间隔约15.2天
  const daysPerTerm = 365.2422 / 24
  
  // 从立春开始计算所有24个节气
  const lichun = getSolarTermDate(year, 0) // 立春
  const allTerms: Date[] = []
  
  for (let i = 0; i < 24; i++) {
    const termDate = new Date(lichun)
    termDate.setDate(termDate.getDate() + Math.round(i * daysPerTerm))
    allTerms.push(termDate)
  }
  
  return allTerms
}

// 确定用局（根据具体节气日期）
function getYongJu(year: number, month: number, day: number): number {
  const currentDate = new Date(year, month - 1, day)
  
  // 计算当前年份和下一年份的24节气
  const thisYearTerms = getAllSolarTerms(year)
  const nextYearTerms = getAllSolarTerms(year + 1)
  
  // 24节气索引：0=立春, 1=雨水, 2=惊蛰, 3=春分, 4=清明, 5=谷雨, 6=立夏, 7=小满, 8=芒种, 9=夏至, 10=小暑, 11=大暑, 12=立秋, 13=处暑, 14=白露, 15=秋分, 16=寒露, 17=霜降, 18=立冬, 19=小雪, 20=大雪, 21=冬至, 22=小寒, 23=大寒
  
  // 找到当前日期所在的节气区间
  let termIndex = -1
  
  // 检查当前年份的节气
  for (let i = 0; i < 24; i++) {
    const termDate = thisYearTerms[i]
    const nextTermDate = i < 23 ? thisYearTerms[i + 1] : nextYearTerms[0]
    
    if (currentDate >= termDate && currentDate < nextTermDate) {
      termIndex = i
      break
    }
  }
  
  // 如果没找到，检查是否在上一年的冬至到立春之间
  if (termIndex === -1) {
    const prevYearTerms = getAllSolarTerms(year - 1)
    const dongzhi = prevYearTerms[21] // 冬至
    const lichun = thisYearTerms[0] // 立春
    
    if (currentDate >= dongzhi && currentDate < lichun) {
      // 在冬至到立春之间，需要判断是小寒还是大寒
      const xiaohan = prevYearTerms[22] // 小寒
      const dahan = prevYearTerms[23] // 大寒
      
      if (currentDate >= dongzhi && currentDate < xiaohan) {
        termIndex = 21 // 冬至
      } else if (currentDate >= xiaohan && currentDate < dahan) {
        termIndex = 22 // 小寒
      } else {
        termIndex = 23 // 大寒
      }
    }
  }
  
  // 根据节气索引确定用局
  let ju = 1
  
  if (termIndex === -1) {
    // 如果无法确定，使用默认值
    return 1
  }
  
  // 阳遁：冬至(21)到夏至(9)前
  if (termIndex >= 21 || termIndex < 9) {
    // 冬至(21)、小寒(22)：阳遁1局
    if (termIndex === 21 || termIndex === 22) {
      ju = 1
    }
    // 大寒(23)、立春(0)：阳遁3局
    else if (termIndex === 23 || termIndex === 0) {
      ju = 3
    }
    // 雨水(1)、惊蛰(2)：阳遁9局
    else if (termIndex === 1 || termIndex === 2) {
      ju = 9
    }
    // 春分(3)、清明(4)：阳遁3局
    else if (termIndex === 3 || termIndex === 4) {
      ju = 3
    }
    // 谷雨(5)、立夏(6)：阳遁4局
    else if (termIndex === 5 || termIndex === 6) {
      ju = 4
    }
    // 小满(7)、芒种(8)：阳遁5局
    else if (termIndex === 7 || termIndex === 8) {
      ju = 5
    }
  }
  // 阴遁：夏至(9)到冬至(21)前
  else {
    // 夏至(9)、小暑(10)：阴遁9局
    if (termIndex === 9 || termIndex === 10) {
      ju = 9
    }
    // 大暑(11)、立秋(12)：阴遁3局
    else if (termIndex === 11 || termIndex === 12) {
      ju = 3
    }
    // 处暑(13)、白露(14)：阴遁6局
    else if (termIndex === 13 || termIndex === 14) {
      ju = 6
    }
    // 秋分(15)、寒露(16)：阴遁6局
    else if (termIndex === 15 || termIndex === 16) {
      ju = 6
    }
    // 霜降(17)、立冬(18)：阴遁6局
    else if (termIndex === 17 || termIndex === 18) {
      ju = 6
    }
    // 小雪(19)、大雪(20)：阴遁6局
    else if (termIndex === 19 || termIndex === 20) {
      ju = 6
    }
  }
  
  return ju
}

// 确定值符（根据时干）
function getZhiFu(shiGan: string): number {
  const ganIndex = tiangan.indexOf(shiGan)
  // 值符对应九星：甲-天蓬(0), 乙-天芮(1), 丙-天冲(2), 丁-天辅(3), 戊-天禽(4), 己-天心(5), 庚-天柱(6), 辛-天任(7), 壬-天英(8), 癸-天蓬(0)
  const zhiFuMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0]
  return zhiFuMap[ganIndex]
}

// 确定值使（根据时干）
function getZhiShi(shiGan: string): number {
  const ganIndex = tiangan.indexOf(shiGan)
  // 值使对应八门：甲-休门(0), 乙-死门(1), 丙-伤门(2), 丁-杜门(3), 戊-开门(5), 己-惊门(6), 庚-生门(7), 辛-景门(8), 壬-休门(0), 癸-死门(1)
  const zhiShiMap = [0, 1, 2, 3, 5, 6, 7, 8, 0, 1]
  return zhiShiMap[ganIndex]
}

// 排九星（根据用局、值符和时支）
function placeJiuxing(yongJu: number, zhiFu: number, shiZhi: string): string[] {
  const result: string[] = new Array(9).fill('')
  
  // 天禽固定在中宫
  result[4] = jiuxing[4] // 天禽
  
  // 九宫顺序（代码索引）：0=巽, 1=离, 2=坤, 3=震, 4=中, 5=兑, 6=乾, 7=坎, 8=艮
  // 传统九宫顺序：1=坎, 2=坤, 3=震, 4=巽, 5=中, 6=乾, 7=兑, 8=艮, 9=离
  // 映射关系：传统1(坎)->代码7, 传统2(坤)->代码2, 传统3(震)->代码3, 传统4(巽)->代码0, 
  //           传统6(乾)->代码6, 传统7(兑)->代码5, 传统8(艮)->代码8, 传统9(离)->代码1
  const traditionalToCode: { [key: number]: number } = {
    1: 7, // 坎
    2: 2, // 坤
    3: 3, // 震
    4: 0, // 巽
    5: 4, // 中
    6: 6, // 乾
    7: 5, // 兑
    8: 8, // 艮
    9: 1  // 离
  }
  
  // 根据用局确定阳遁/阴遁
  const isYangDun = yongJu <= 6
  
  // 根据时支确定时干所在宫位（值符跟随时干）
  const shiZhiIndex = dizhi.indexOf(shiZhi)
  // 时支对应传统九宫：子(0)-坎(1), 丑(1)-艮(8), 寅(2)-震(3), 卯(3)-震(3), 
  // 辰(4)-巽(4), 巳(5)-离(9), 午(6)-离(9), 未(7)-坤(2), 申(8)-兑(7), 
  // 酉(9)-兑(7), 戌(10)-乾(6), 亥(11)-坎(1)
  const zhiToTraditionalPalace = [1, 8, 3, 3, 4, 9, 9, 2, 7, 7, 6, 1]
  const shiGanTraditionalPalace = zhiToTraditionalPalace[shiZhiIndex]
  const shiGanPalace = traditionalToCode[shiGanTraditionalPalace]
  
  // 值符星跟随时干，所以值符星在时干宫位
  if (shiGanPalace !== 4) {
    result[shiGanPalace] = jiuxing[zhiFu]
  }
  
  // 从值符星开始，按照阳遁/阴遁规则排列其他星
  // 九星顺序：天蓬(0), 天芮(1), 天冲(2), 天辅(3), 天禽(4), 天心(5), 天柱(6), 天任(7), 天英(8)
  let starIdx = 0
  
  // 从值符星的位置开始排列
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue // 中宫已确定
    
    // 计算目标宫位
    let targetPalace = 0
    if (isYangDun) {
      // 阳遁顺排：从时干宫位开始顺时针
      targetPalace = (shiGanPalace + i) % 9
      if (targetPalace === 4) {
        targetPalace = (targetPalace + 1) % 9 // 跳过中宫
      }
    } else {
      // 阴遁逆排：从时干宫位开始逆时针
      targetPalace = (shiGanPalace - i + 9) % 9
      if (targetPalace === 4) {
        targetPalace = (targetPalace - 1 + 9) % 9 // 跳过中宫
      }
    }
    
    // 如果目标宫位已有星（值符星），跳过
    if (result[targetPalace]) continue
    
    // 找到下一个未使用的星（跳过值符星和天禽）
    while (starIdx === zhiFu || starIdx === 4) {
      starIdx = (starIdx + 1) % 9
    }
    
    result[targetPalace] = jiuxing[starIdx]
    starIdx = (starIdx + 1) % 9
  }
  
  return result
}

// 排八门（根据值使和时支）
function placeBamen(zhiShi: number, shiZhi: string): string[] {
  const positions: string[] = new Array(9).fill('')
  
  // 中宫无门
  positions[4] = ''
  
  // 根据时支确定值使所在宫位
  const shiZhiIndex = dizhi.indexOf(shiZhi)
  // 时支对应宫位：子(0)-坎(1), 丑(1)-艮(8), 寅(2)-震(3), 卯(3)-震(3), 辰(4)-巽(0), 巳(5)-离(4), 午(6)-离(4), 未(7)-坤(2), 申(8)-兑(6), 酉(9)-兑(6), 戌(10)-乾(7), 亥(11)-坎(1)
  const zhiToPalace = [1, 8, 3, 3, 0, 4, 4, 2, 6, 6, 7, 1]
  const zhiShiPalace = zhiToPalace[shiZhiIndex]
  
  // 八门顺序：休(0), 死(1), 伤(2), 杜(3), 开(5), 惊(6), 生(7), 景(8)
  const menOrder = [0, 1, 2, 3, 5, 6, 7, 8]
  
  // 值使在对应宫位
  if (zhiShiPalace !== 4) {
    positions[zhiShiPalace] = bamen[zhiShi]
  }
  
  // 其他门按顺序排列
  let menIdx = 0
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue // 中宫
    if (positions[i]) continue
    
    while (menOrder[menIdx] === zhiShi || menOrder[menIdx] === 4) {
      menIdx = (menIdx + 1) % 8
    }
    positions[i] = bamen[menOrder[menIdx]]
    menIdx = (menIdx + 1) % 8
  }
  
  return positions
}

// 排八神（根据值符星所在宫位）
function placeBashen(zhiFuStarPalace: number): string[] {
  const positions: string[] = new Array(9).fill('')
  
  // 值符神跟随值符星所在宫位
  // 如果值符星在中宫，值符神也在中宫
  if (zhiFuStarPalace === 4) {
    positions[4] = bashen[0] // 值符
  } else {
    // 值符神在值符星所在宫位
    positions[zhiFuStarPalace] = bashen[0] // 值符
    // 中宫放置值符（值符神同时在中宫和值符星宫位）
    positions[4] = bashen[0] // 值符
  }
  
  // 八神顺序：值符(0), 腾蛇(1), 太阴(2), 六合(3), 白虎(4), 玄武(5), 九地(6), 九天(7)
  // 从值符星所在宫位开始，按照固定顺序排列其他神
  // 排列顺序：值符星宫位 -> 顺时针排列（八神排列固定为顺时针）
  
  // 确定起始宫位（值符星所在宫位）
  let startPalace = zhiFuStarPalace
  if (startPalace === 4) {
    // 如果值符星在中宫，从坎宫（7）开始
    startPalace = 7
  }
  
  // 九宫顺序（顺时针）：从起始宫位开始
  // 0=巽, 1=离, 2=坤, 3=震, 4=中, 5=兑, 6=乾, 7=坎, 8=艮
  // 顺时针顺序：7(坎) -> 8(艮) -> 0(巽) -> 1(离) -> 2(坤) -> 3(震) -> 5(兑) -> 6(乾) -> 7(坎)
  const clockwiseOrder = [7, 8, 0, 1, 2, 3, 5, 6] // 跳过中宫(4)
  
  // 找到起始宫位在顺时针顺序中的位置
  let startIdx = clockwiseOrder.indexOf(startPalace)
  if (startIdx === -1) {
    startIdx = 0 // 默认从坎宫开始
  }
  
  // 从值符开始排列八神
  let shenIdx = 0 // 从值符开始
  for (let i = 0; i < 8; i++) {
    const palaceIdx = clockwiseOrder[(startIdx + i) % 8]
    if (palaceIdx === 4) continue // 跳过中宫（已处理）
    
    // 如果这个宫位已经有值符，跳过（值符已经在前面放置了）
    if (positions[palaceIdx] === bashen[0]) {
      shenIdx = (shenIdx + 1) % 8
      continue
    }
    
    positions[palaceIdx] = bashen[shenIdx]
    shenIdx = (shenIdx + 1) % 8
  }
  
  return positions
}

// 计算奇门遁甲盘
function calculateQimenPan(
  year: number,
  month: number,
  day: number,
  hour: number,
  direction: string
): {
  palaces: Array<{
    name: string
    direction: string
    bamen: string
    jiuxing: string
    bashen: string
    auspicious: boolean
    score: number
  }>
  overallAnalysis: string
  directionAnalysis: string
  timeAnalysis: string
} {
  const date = new Date(year, month - 1, day, hour)
  
  // 计算准确的时干支
  const dayPillar = calculateDayPillar(date)
  const hourPillar = calculateHourPillar(dayPillar, hour)
  
  // 使用完整的时干支计算算法（五鼠遁）
  if (!hourPillar) {
    // 如果计算失败，抛出错误（不应该发生）
    throw new Error(`无法计算时干支：hour=${hour}`)
  }
  
  const shiGanZhi = hourPillar
  
  const shiGan = shiGanZhi[0]
  const shiZhi = shiGanZhi[1]
  
  // 确定用局
  const yongJu = getYongJu(year, month, day)
  
  // 确定值符和值使
  const zhiFu = getZhiFu(shiGan)
  const zhiShi = getZhiShi(shiGan)
  
  // 排九星
  const jiuxingPositions = placeJiuxing(yongJu, zhiFu, shiZhi)
  
  // 找到值符星所在宫位（用于排八神）
  let zhiFuStarPalace = 4 // 默认中宫
  for (let i = 0; i < 9; i++) {
    if (jiuxingPositions[i] === jiuxing[zhiFu]) {
      zhiFuStarPalace = i
      break
    }
  }
  
  // 排八门
  const bamenPositions = placeBamen(zhiShi, shiZhi)
  
  // 排八神（根据值符星所在宫位）
  const bashenPositions = placeBashen(zhiFuStarPalace)
  
  // 生成九宫格数据
  const palaces = palacePositions.map((pos, index) => {
    const bamenName = bamenPositions[index]
    const jiuxingName = jiuxingPositions[index]
    const bashenName = bashenPositions[index]
    
    // 计算吉凶分数
    let score = 50 // 基础分
    if (bamenName && bamenMeanings[bamenName]) {
      score += bamenMeanings[bamenName].auspicious ? 15 : -15
    }
    if (jiuxingMeanings[jiuxingName]) {
      score += jiuxingMeanings[jiuxingName].auspicious ? 15 : -15
    }
    if (bashenMeanings[bashenName]) {
      score += bashenMeanings[bashenName].auspicious ? 10 : -10
    }
    
    // 如果是指定方位，额外加分
    if (pos.direction === direction) {
      score += 20
    }
    
    const auspicious = score >= 60
    
    return {
      name: pos.name,
      direction: pos.direction,
      bamen: bamenName,
      jiuxing: jiuxingName,
      bashen: bashenName,
      auspicious,
      score: Math.max(0, Math.min(100, score))
    }
  })
  
  // 分析指定方位
  const targetPalace = palaces.find(p => p.direction === direction) || palaces[4]
  const directionAnalysis = targetPalace.auspicious
    ? `${direction}方位为吉，${targetPalace.bamen ? `遇${targetPalace.bamen}，` : ''}${targetPalace.jiuxing}临，${targetPalace.bashen}护，适合${direction}方行动。`
    : `${direction}方位为凶，${targetPalace.bamen ? `遇${targetPalace.bamen}，` : ''}${targetPalace.jiuxing}临，${targetPalace.bashen}现，不宜${direction}方行动。`
  
  // 时间分析
  const timeAnalysis = `时干支：${shiGanZhi}，用局：${yongJu}局。此时${targetPalace.auspicious ? '吉' : '凶'}，${targetPalace.bamen ? `${targetPalace.bamen}主${bamenMeanings[targetPalace.bamen]?.meaning}，` : ''}${targetPalace.jiuxing}主${jiuxingMeanings[targetPalace.jiuxing]?.meaning}，${targetPalace.bashen}主${bashenMeanings[targetPalace.bashen]?.meaning}。`
  
  // 整体分析
  const auspiciousCount = palaces.filter(p => p.auspicious).length
  const overallAnalysis = `当前盘面：${auspiciousCount}宫为吉，${9 - auspiciousCount}宫为凶。${targetPalace.auspicious ? '整体趋势向好' : '整体趋势需谨慎'}，建议${targetPalace.auspicious ? '把握时机' : '保守行事'}。`
  
  return {
    palaces,
    overallAnalysis,
    directionAnalysis,
    timeAnalysis
  }
}

function QimenDunjia() {
  const today = new Date()
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [selectedHour, setSelectedHour] = useState(today.getHours())
  const [selectedDirection, setSelectedDirection] = useState('东')
  
  const result = useMemo(() => {
    return calculateQimenPan(selectedYear, selectedMonth, selectedDay, selectedHour, selectedDirection)
  }, [selectedYear, selectedMonth, selectedDay, selectedHour, selectedDirection])
  
  const resetToNow = () => {
    const now = new Date()
    setSelectedYear(now.getFullYear())
    setSelectedMonth(now.getMonth() + 1)
    setSelectedDay(now.getDate())
    setSelectedHour(now.getHours())
  }
  
  return (
    <div className="qimen-dunjia">
      <div className="qimen-header">
        <h1>🔮 奇门遁甲</h1>
        <p className="qimen-subtitle">传统预测术，分析吉凶方位和时间</p>
      </div>
      
      <div className="qimen-content">
        {/* 时间选择 */}
        <div className="time-selector">
          <h3>📅 选择时间</h3>
          <div className="time-inputs">
            <div className="time-input-group">
              <label>年</label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value) || 2024)}
                min="1900"
                max="2100"
              />
            </div>
            <div className="time-input-group">
              <label>月</label>
              <input
                type="number"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value) || 1)}
                min="1"
                max="12"
              />
            </div>
            <div className="time-input-group">
              <label>日</label>
              <input
                type="number"
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value) || 1)}
                min="1"
                max="31"
              />
            </div>
            <div className="time-input-group">
              <label>时</label>
              <input
                type="number"
                value={selectedHour}
                onChange={(e) => setSelectedHour(parseInt(e.target.value) || 0)}
                min="0"
                max="23"
              />
            </div>
            <button className="reset-btn" onClick={resetToNow}>
              ⏰ 当前时间
            </button>
          </div>
        </div>
        
        {/* 方位选择 */}
        <div className="direction-selector">
          <h3>🧭 选择方位</h3>
          <div className="direction-buttons">
            {directions.filter(d => d !== '中').map(dir => (
              <button
                key={dir}
                className={`direction-btn ${selectedDirection === dir ? 'active' : ''}`}
                onClick={() => setSelectedDirection(dir)}
                style={{
                  transform: `rotate(${directionAngles[dir]}deg)`,
                  transformOrigin: 'center'
                }}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>
        
        {/* 九宫格盘 */}
        <div className="qimen-pan">
          <h3>📊 奇门遁甲盘</h3>
          <div className="jiugong-grid">
            {result.palaces.map((palace, index) => (
              <div
                key={index}
                className={`palace-cell ${palace.auspicious ? 'auspicious' : 'inauspicious'} ${palace.direction === selectedDirection ? 'selected' : ''}`}
              >
                <div className="palace-header">
                  <div className="palace-name">{palace.name}</div>
                  <div className="palace-direction">{palace.direction}</div>
                </div>
                <div className="palace-content">
                  {palace.bamen && (
                    <div className="palace-item bamen">
                      <span className="item-label">门：</span>
                      <span className={`item-value ${bamenMeanings[palace.bamen]?.auspicious ? 'auspicious' : 'inauspicious'}`}>
                        {bamenNames[bamen.indexOf(palace.bamen)]}
                      </span>
                    </div>
                  )}
                  <div className="palace-item jiuxing">
                    <span className="item-label">星：</span>
                    <span className={`item-value ${jiuxingMeanings[palace.jiuxing]?.auspicious ? 'auspicious' : 'inauspicious'}`}>
                      {jiuxingNames[jiuxing.indexOf(palace.jiuxing)]}
                    </span>
                  </div>
                  <div className="palace-item bashen">
                    <span className="item-label">神：</span>
                    <span className={`item-value ${bashenMeanings[palace.bashen]?.auspicious ? 'auspicious' : 'inauspicious'}`}>
                      {bashenNames[bashen.indexOf(palace.bashen)]}
                    </span>
                  </div>
                </div>
                <div className="palace-score">
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{ width: `${palace.score}%` }}
                    />
                  </div>
                  <span className="score-text">{palace.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 分析结果 */}
        <div className="qimen-analysis">
          <div className="analysis-section">
            <h3>📋 整体分析</h3>
            <p>{result.overallAnalysis}</p>
          </div>
          
          <div className="analysis-section">
            <h3>🧭 方位分析</h3>
            <p>{result.directionAnalysis}</p>
            {result.palaces.find(p => p.direction === selectedDirection) && (
              <div className="direction-detail">
                {(() => {
                  const palace = result.palaces.find(p => p.direction === selectedDirection)!
                  return (
                    <>
                      {palace.bamen && bamenMeanings[palace.bamen] && (
                        <div className="detail-item">
                          <strong>{palace.bamen}：</strong>
                          {bamenMeanings[palace.bamen].description}
                        </div>
                      )}
                      {jiuxingMeanings[palace.jiuxing] && (
                        <div className="detail-item">
                          <strong>{palace.jiuxing}：</strong>
                          {jiuxingMeanings[palace.jiuxing].description}
                        </div>
                      )}
                      {bashenMeanings[palace.bashen] && (
                        <div className="detail-item">
                          <strong>{palace.bashen}：</strong>
                          {bashenMeanings[palace.bashen].description}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </div>
          
          <div className="analysis-section">
            <h3>⏰ 时间分析</h3>
            <p>{result.timeAnalysis}</p>
          </div>
          
          {/* 吉凶方位建议 */}
          <div className="analysis-section">
            <h3>💡 方位建议</h3>
            <div className="direction-suggestions">
              <div className="suggestion-group">
                <h4>✅ 吉方位</h4>
                <div className="suggestion-list">
                  {result.palaces
                    .filter(p => p.auspicious && p.direction !== '中')
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map(p => (
                      <div key={p.direction} className="suggestion-item auspicious">
                        <span className="suggestion-direction">{p.direction}</span>
                        <span className="suggestion-score">吉分：{p.score}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="suggestion-group">
                <h4>❌ 凶方位</h4>
                <div className="suggestion-list">
                  {result.palaces
                    .filter(p => !p.auspicious && p.direction !== '中')
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 3)
                    .map(p => (
                      <div key={p.direction} className="suggestion-item inauspicious">
                        <span className="suggestion-direction">{p.direction}</span>
                        <span className="suggestion-score">凶分：{p.score}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QimenDunjia


