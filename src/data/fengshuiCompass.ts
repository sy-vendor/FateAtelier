// 风水罗盘数据

// 八个基本方位
export const directions = [
  { name: '正东', angle: 90, symbol: '震', wuxing: '木', color: '#4CAF50' },
  { name: '东南', angle: 135, symbol: '巽', wuxing: '木', color: '#8BC34A' },
  { name: '正南', angle: 180, symbol: '离', wuxing: '火', color: '#F44336' },
  { name: '西南', angle: 225, symbol: '坤', wuxing: '土', color: '#FF9800' },
  { name: '正西', angle: 270, symbol: '兑', wuxing: '金', color: '#FFC107' },
  { name: '西北', angle: 315, symbol: '乾', wuxing: '金', color: '#FF9800' },
  { name: '正北', angle: 0, symbol: '坎', wuxing: '水', color: '#2196F3' },
  { name: '东北', angle: 45, symbol: '艮', wuxing: '土', color: '#9E9E9E' }
]

// 八卦信息
export const bagua = {
  '乾': { name: '乾', nature: '天', wuxing: '金', meaning: '天、父、刚健', auspicious: ['事业', '权威', '领导'] },
  '坤': { name: '坤', nature: '地', wuxing: '土', meaning: '地、母、柔顺', auspicious: ['家庭', '稳定', '包容'] },
  '震': { name: '震', nature: '雷', wuxing: '木', meaning: '雷、动、奋发', auspicious: ['行动', '创新', '突破'] },
  '巽': { name: '巽', nature: '风', wuxing: '木', meaning: '风、入、柔顺', auspicious: ['沟通', '学习', '灵活'] },
  '坎': { name: '坎', nature: '水', wuxing: '水', meaning: '水、险、智慧', auspicious: ['智慧', '流动', '变化'] },
  '离': { name: '离', nature: '火', wuxing: '火', meaning: '火、明、光明', auspicious: ['名声', '热情', '光明'] },
  '艮': { name: '艮', nature: '山', wuxing: '土', meaning: '山、止、稳重', auspicious: ['稳定', '积累', '守成'] },
  '兑': { name: '兑', nature: '泽', wuxing: '金', meaning: '泽、悦、喜悦', auspicious: ['喜悦', '交流', '收获'] }
}

// 二十四山（更详细的方位）
export const twentyFourMountains = [
  { name: '子', angle: 0, direction: '正北', wuxing: '水' },
  { name: '癸', angle: 15, direction: '正北', wuxing: '水' },
  { name: '丑', angle: 30, direction: '东北', wuxing: '土' },
  { name: '艮', angle: 45, direction: '东北', wuxing: '土' },
  { name: '寅', angle: 60, direction: '东北', wuxing: '木' },
  { name: '甲', angle: 75, direction: '正东', wuxing: '木' },
  { name: '卯', angle: 90, direction: '正东', wuxing: '木' },
  { name: '乙', angle: 105, direction: '正东', wuxing: '木' },
  { name: '辰', angle: 120, direction: '东南', wuxing: '土' },
  { name: '巽', angle: 135, direction: '东南', wuxing: '木' },
  { name: '巳', angle: 150, direction: '东南', wuxing: '火' },
  { name: '丙', angle: 165, direction: '正南', wuxing: '火' },
  { name: '午', angle: 180, direction: '正南', wuxing: '火' },
  { name: '丁', angle: 195, direction: '正南', wuxing: '火' },
  { name: '未', angle: 210, direction: '西南', wuxing: '土' },
  { name: '坤', angle: 225, direction: '西南', wuxing: '土' },
  { name: '申', angle: 240, direction: '西南', wuxing: '金' },
  { name: '庚', angle: 255, direction: '正西', wuxing: '金' },
  { name: '酉', angle: 270, direction: '正西', wuxing: '金' },
  { name: '辛', angle: 285, direction: '正西', wuxing: '金' },
  { name: '戌', angle: 300, direction: '西北', wuxing: '土' },
  { name: '乾', angle: 315, direction: '西北', wuxing: '金' },
  { name: '亥', angle: 330, direction: '西北', wuxing: '水' },
  { name: '壬', angle: 345, direction: '正北', wuxing: '水' }
]

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

// 计算日柱（使用准确的公式）
function calculateDayPillar(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 使用1900年1月1日为基准日（甲子日）
  const baseYear = 1900
  const baseMonth = 1
  const baseDay = 1
  
  // 计算从基准日到目标日的天数
  const baseDate = new Date(baseYear, baseMonth - 1, baseDay)
  const targetDate = new Date(year, month - 1, day)
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // 计算日柱
  const dayGanIndex = (daysDiff % 10 + 0) % 10
  const dayZhiIndex = (daysDiff % 12 + 0) % 12
  
  const dayGan = tiangan[dayGanIndex]
  const dayZhi = dizhi[dayZhiIndex]
  
  return dayGan + dayZhi
}

// 根据日期计算今日吉凶方位（基于天干地支和五行相生相克）
export function getTodayAuspiciousDirections(date: Date = new Date()): {
  auspicious: string[]
  inauspicious: string[]
  neutral: string[]
} {
  // 计算日柱
  const dayGanZhi = calculateDayPillar(date)
  const dayGan = dayGanZhi[0]
  const dayZhi = dayGanZhi[1]
  
  // 获取日柱的五行（天干和地支）
  const dayGanWuxing = tianganWuxing[dayGan] || '土'
  const dayZhiWuxing = dizhiWuxing[dayZhi] || '土'
  
  // 使用天干五行作为主要判断依据
  // 如果天干地支五行相同，则能量更强，可以增强吉凶判断
  const todayWuxing = dayGanWuxing
  const isWuxingMatch = dayGanWuxing === dayZhiWuxing // 天干地支五行相同，能量更强
  
  // 五行相生相克关系
  const wuxingRelations: { [key: string]: { sheng: string[], ke: string[], beiKe: string[] } } = {
    '木': { sheng: ['火'], ke: ['土'], beiKe: ['金'] },
    '火': { sheng: ['土'], ke: ['金'], beiKe: ['水'] },
    '土': { sheng: ['金'], ke: ['水'], beiKe: ['木'] },
    '金': { sheng: ['水'], ke: ['木'], beiKe: ['火'] },
    '水': { sheng: ['木'], ke: ['火'], beiKe: ['土'] }
  }
  
  const relations = wuxingRelations[todayWuxing] || { sheng: [], ke: [], beiKe: [] }
  
  // 吉方：相生和相同五行
  const auspicious: string[] = []
  // 凶方：被克
  const inauspicious: string[] = []
  // 平方：其他
  const neutral: string[] = []
  
  directions.forEach(dir => {
    // 如果天干地支五行相同，能量更强，判断更严格
    if (isWuxingMatch) {
      // 天干地支五行相同时，只选择完全匹配的方位为吉方
      if (dir.wuxing === todayWuxing) {
        auspicious.push(dir.name)
      } else if (relations.beiKe.includes(dir.wuxing)) {
        inauspicious.push(dir.name)
      } else {
        neutral.push(dir.name)
      }
    } else {
      // 天干地支五行不同时，使用标准判断
      if (dir.wuxing === todayWuxing || relations.sheng.includes(dir.wuxing)) {
        auspicious.push(dir.name)
      } else if (relations.beiKe.includes(dir.wuxing)) {
        inauspicious.push(dir.name)
      } else {
        neutral.push(dir.name)
      }
    }
  })
  
  return { auspicious, inauspicious, neutral }
}

// 获取方位的详细解析
export function getDirectionInterpretation(directionName: string, date: Date = new Date()) {
  const direction = directions.find(d => d.name === directionName)
  if (!direction) return null
  
  const { auspicious, inauspicious } = getTodayAuspiciousDirections(date)
  const isAuspicious = auspicious.includes(directionName)
  const isInauspicious = inauspicious.includes(directionName)
  
  const gua = bagua[direction.symbol as keyof typeof bagua]
  
  return {
    direction: directionName,
    symbol: direction.symbol,
    wuxing: direction.wuxing,
    color: direction.color,
    guaInfo: gua,
    auspicious: isAuspicious,
    inauspicious: isInauspicious,
    neutral: !isAuspicious && !isInauspicious,
    suitableFor: gua?.auspicious || [],
    meaning: gua?.meaning || '',
    advice: isAuspicious 
      ? `今日${directionName}方位为吉方，适合进行重要活动。`
      : isInauspicious
      ? `今日${directionName}方位为凶方，宜谨慎行事。`
      : `今日${directionName}方位为平方，可正常使用。`
  }
}

// 根据用途推荐方位
export function recommendDirectionForPurpose(purpose: string): string[] {
  const purposeMap: { [key: string]: string[] } = {
    '事业': ['正东', '正南', '西北'],
    '财运': ['正西', '西南', '东北'],
    '学业': ['正东', '东南'],
    '健康': ['正北', '东北'],
    '感情': ['正南', '西南'],
    '搬家': ['正东', '正南', '正西'],
    '开业': ['正东', '正南', '东南'],
    '出行': ['正东', '正南', '东南']
  }
  
  return purposeMap[purpose] || ['正东', '正南', '正西', '正北']
}

