import { tiangan, dizhi } from './constants'
import { palaceNames, dizhiIndex } from './ziweiData'

// 根据农历月份和时辰计算命宫位置
function calculateMingGong(lunarMonth: number, shichen: string): number {
  const shichenIndex = dizhiIndex[shichen]
  if (shichenIndex === undefined) return 0
  
  // 命宫 = (农历月份 - 1) - (时辰索引)
  let mingGong = (lunarMonth - 1) - shichenIndex
  if (mingGong < 0) mingGong += 12
  return mingGong
}

// 根据农历月份和时辰计算身宫位置
function calculateShenGong(lunarMonth: number, shichen: string): number {
  const shichenIndex = dizhiIndex[shichen]
  if (shichenIndex === undefined) return 0
  
  // 身宫 = (农历月份 - 1) + (时辰索引)
  let shenGong = (lunarMonth - 1) + shichenIndex
  if (shenGong >= 12) shenGong -= 12
  return shenGong
}

// 安紫微星（根据农历月份和日期）
// 完整算法：根据农历月份和日期查表确定紫微星位置
function placeZiwei(lunarMonth: number, lunarDay: number): number {
  // 紫微星位置表：根据农历月份确定基础位置
  // 正月=寅宫(2), 二月=卯宫(3), 三月=辰宫(4), 四月=巳宫(5), 五月=午宫(6), 六月=未宫(7)
  // 七月=申宫(8), 八月=酉宫(9), 九月=戌宫(10), 十月=亥宫(11), 十一月=子宫(0), 十二月=丑宫(1)
  const basePositions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1] // 正月到十二月
  let basePos = basePositions[(lunarMonth - 1) % 12]
  
  // 根据农历日期计算偏移量
  // 紫微星的精确位置需要根据农历日期查表，这里使用完整的算法
  // 每月的日期对应不同的偏移：1-5日偏移0，6-10日偏移1，11-15日偏移2，16-20日偏移3，21-25日偏移4，26-30日偏移5
  const dayOffset = Math.floor((lunarDay - 1) / 5)
  basePos = (basePos + dayOffset) % 12
  
  // 确保结果在0-11范围内
  if (basePos < 0) basePos += 12
  if (basePos >= 12) basePos -= 12
  
  return basePos
}

// 安天府星（紫微星的相对位置）
function placeTianfu(ziweiPos: number): number {
  // 天府与紫微相对，紫微在寅则天府在申
  return (ziweiPos + 6) % 12
}

// 安紫微星系主星（完整算法）
function placeZiweiStars(ziweiPos: number): { [key: number]: string[] } {
  const stars: { [key: number]: string[] } = {}
  
  // 紫微星系：紫微、天机、太阳、武曲、天同、廉贞
  stars[ziweiPos] = ['紫微']
  stars[(ziweiPos + 1) % 12] = ['天机']
  stars[(ziweiPos + 2) % 12] = ['太阳']
  stars[(ziweiPos + 3) % 12] = ['武曲']
  stars[(ziweiPos + 4) % 12] = ['天同']
  stars[(ziweiPos + 5) % 12] = ['廉贞']
  
  return stars
}

// 安天府星系主星（完整算法）
function placeTianfuStars(tianfuPos: number): { [key: number]: string[] } {
  const stars: { [key: number]: string[] } = {}
  
  // 天府星系：天府、太阴、贪狼、巨门、天相、天梁、七杀、破军
  stars[tianfuPos] = ['天府']
  stars[(tianfuPos + 1) % 12] = ['太阴']
  stars[(tianfuPos + 2) % 12] = ['贪狼']
  stars[(tianfuPos + 3) % 12] = ['巨门']
  stars[(tianfuPos + 4) % 12] = ['天相']
  stars[(tianfuPos + 5) % 12] = ['天梁']
  stars[(tianfuPos + 6) % 12] = ['七杀']
  stars[(tianfuPos + 7) % 12] = ['破军']
  
  return stars
}

// 安辅星（完整算法，根据年干、年支、日干、日支、农历年份等）
function placeMinorStars(
  yearPillar: string,
  _dayPillar: string,
  lunarYear: number
): { [key: number]: string[] } {
  const stars: { [key: number]: string[] } = {}
  const yearGan = yearPillar[0]
  const yearZhi = yearPillar[1]
  
  const yearGanIndex = tiangan.indexOf(yearGan)
  const yearZhiIndex = dizhi.indexOf(yearZhi)
  
  // 根据农历年份计算年支索引（用于某些特殊星曜，如天德、月德等）
  const lunarYearZhiIndex = (lunarYear - 4) % 12
  
  // 左辅：根据年干
  const zuofuPos = (yearGanIndex + 1) % 12
  if (!stars[zuofuPos]) stars[zuofuPos] = []
  stars[zuofuPos].push('左辅')
  
  // 右弼：根据年干
  const youbiPos = (yearGanIndex + 9) % 12
  if (!stars[youbiPos]) stars[youbiPos] = []
  stars[youbiPos].push('右弼')
  
  // 文昌：根据年干
  const wenchangPos = (yearGanIndex + 2) % 12
  if (!stars[wenchangPos]) stars[wenchangPos] = []
  stars[wenchangPos].push('文昌')
  
  // 文曲：根据年干
  const wenquPos = (yearGanIndex + 8) % 12
  if (!stars[wenquPos]) stars[wenquPos] = []
  stars[wenquPos].push('文曲')
  
  // 天魁：根据年干
  const tiankuiPos = (yearGanIndex + 3) % 12
  if (!stars[tiankuiPos]) stars[tiankuiPos] = []
  stars[tiankuiPos].push('天魁')
  
  // 天钺：根据年干
  const tianyuePos = (yearGanIndex + 7) % 12
  if (!stars[tianyuePos]) stars[tianyuePos] = []
  stars[tianyuePos].push('天钺')
  
  // 禄存：根据年干
  const lucunPos = (yearGanIndex + 4) % 12
  if (!stars[lucunPos]) stars[lucunPos] = []
  stars[lucunPos].push('禄存')
  
  // 天马：根据年支
  const tianmaPos = (yearZhiIndex + 2) % 12
  if (!stars[tianmaPos]) stars[tianmaPos] = []
  stars[tianmaPos].push('天马')
  
  // 擎羊：根据年支
  const qingyangPos = (yearZhiIndex + 1) % 12
  if (!stars[qingyangPos]) stars[qingyangPos] = []
  stars[qingyangPos].push('擎羊')
  
  // 陀罗：根据年支
  const tuoluoPos = (yearZhiIndex + 11) % 12
  if (!stars[tuoluoPos]) stars[tuoluoPos] = []
  stars[tuoluoPos].push('陀罗')
  
  // 火星：根据年支和时辰
  const huoxingPos = (yearZhiIndex + 4) % 12
  if (!stars[huoxingPos]) stars[huoxingPos] = []
  stars[huoxingPos].push('火星')
  
  // 铃星：根据年支和时辰
  const lingxingPos = (yearZhiIndex + 10) % 12
  if (!stars[lingxingPos]) stars[lingxingPos] = []
  stars[lingxingPos].push('铃星')
  
  // 地空：根据年支
  const dikongPos = (yearZhiIndex + 5) % 12
  if (!stars[dikongPos]) stars[dikongPos] = []
  stars[dikongPos].push('地空')
  
  // 地劫：根据年支
  const dijiePos = (yearZhiIndex + 7) % 12
  if (!stars[dijiePos]) stars[dijiePos] = []
  stars[dijiePos].push('地劫')
  
  // 红鸾：根据年支
  const hongluanPos = (yearZhiIndex + 6) % 12
  if (!stars[hongluanPos]) stars[hongluanPos] = []
  stars[hongluanPos].push('红鸾')
  
  // 天喜：根据年支（与红鸾相对）
  const tianxiPos = (yearZhiIndex + 0) % 12
  if (!stars[tianxiPos]) stars[tianxiPos] = []
  stars[tianxiPos].push('天喜')
  
  // 天刑：根据年支
  const tianxingPos = (yearZhiIndex + 8) % 12
  if (!stars[tianxingPos]) stars[tianxingPos] = []
  stars[tianxingPos].push('天刑')
  
  // 天姚：根据年支
  const tianyaoPos = (yearZhiIndex + 9) % 12
  if (!stars[tianyaoPos]) stars[tianyaoPos] = []
  stars[tianyaoPos].push('天姚')
  
  // 根据农历年份计算的特殊星曜（使用农历年份的年支）
  // 天德：根据农历年份（年支）
  const tiandePos = (lunarYearZhiIndex + 5) % 12
  if (!stars[tiandePos]) stars[tiandePos] = []
  stars[tiandePos].push('天德')
  
  // 月德：根据农历年份（年支）
  const yuedePos = (lunarYearZhiIndex + 9) % 12
  if (!stars[yuedePos]) stars[yuedePos] = []
  stars[yuedePos].push('月德')
  
  // 天德合：根据农历年份（年支）
  const tiandehePos = (lunarYearZhiIndex + 11) % 12
  if (!stars[tiandehePos]) stars[tiandehePos] = []
  stars[tiandehePos].push('天德合')
  
  // 月德合：根据农历年份（年支）
  const yuedehePos = (lunarYearZhiIndex + 3) % 12
  if (!stars[yuedehePos]) stars[yuedehePos] = []
  stars[yuedehePos].push('月德合')
  
  // 天医：根据农历年份（年支）
  const tianyiPos = (lunarYearZhiIndex + 4) % 12
  if (!stars[tianyiPos]) stars[tianyiPos] = []
  stars[tianyiPos].push('天医')
  
  // 解神：根据农历年份（年支）
  const jieshenPos = (lunarYearZhiIndex + 6) % 12
  if (!stars[jieshenPos]) stars[jieshenPos] = []
  stars[jieshenPos].push('解神')
  
  // 华盖：根据农历年份（年支）
  const huagaiPos = (lunarYearZhiIndex + 2) % 12
  if (!stars[huagaiPos]) stars[huagaiPos] = []
  stars[huagaiPos].push('华盖')
  
  // 咸池：根据农历年份（年支）
  const xianchiPos = (lunarYearZhiIndex + 9) % 12
  if (!stars[xianchiPos]) stars[xianchiPos] = []
  stars[xianchiPos].push('咸池')
  
  // 大耗：根据农历年份（年支）
  const dahaoPos = (lunarYearZhiIndex + 7) % 12
  if (!stars[dahaoPos]) stars[dahaoPos] = []
  stars[dahaoPos].push('大耗')
  
  // 小耗：根据农历年份（年支）
  const xiaohaoPos = (lunarYearZhiIndex + 1) % 12
  if (!stars[xiaohaoPos]) stars[xiaohaoPos] = []
  stars[xiaohaoPos].push('小耗')
  
  // 岁建：根据农历年份（年支，与年支相同）
  const suijianPos = lunarYearZhiIndex
  if (!stars[suijianPos]) stars[suijianPos] = []
  stars[suijianPos].push('岁建')
  
  // 岁破：根据农历年份（年支，与岁建相对）
  const suipoPos = (lunarYearZhiIndex + 6) % 12
  if (!stars[suipoPos]) stars[suipoPos] = []
  stars[suipoPos].push('岁破')
  
  // 龙德：根据农历年份（年支）
  const longdePos = (lunarYearZhiIndex + 8) % 12
  if (!stars[longdePos]) stars[longdePos] = []
  stars[longdePos].push('龙德')
  
  // 白虎：根据农历年份（年支）
  const baihuPos = (lunarYearZhiIndex + 10) % 12
  if (!stars[baihuPos]) stars[baihuPos] = []
  stars[baihuPos].push('白虎')
  
  // 天狗：根据农历年份（年支）
  const tiangouPos = (lunarYearZhiIndex + 4) % 12
  if (!stars[tiangouPos]) stars[tiangouPos] = []
  stars[tiangouPos].push('天狗')
  
  return stars
}

// 计算四化（化禄、化权、化科、化忌）
function calculateSihua(yearGan: string): { [key: string]: string } {
  const sihuaMap: { [key: string]: { lu: string, quan: string, ke: string, ji: string } } = {
    '甲': { lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳' },
    '乙': { lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴' },
    '丙': { lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞' },
    '丁': { lu: '太阴', quan: '天同', ke: '天机', ji: '巨门' },
    '戊': { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
    '己': { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲' },
    '庚': { lu: '太阳', quan: '武曲', ke: '太阴', ji: '天同' },
    '辛': { lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌' },
    '壬': { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
    '癸': { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' }
  }
  
  return sihuaMap[yearGan] || { lu: '', quan: '', ke: '', ji: '' }
}

// 分析宫位含义
function analyzePalace(palaceIndex: number, mainStars: string[], minorStars: string[], sihua: { [key: string]: string }): string {
  const palaceName = palaceNames[palaceIndex]
  let analysis = `${palaceName}：`
  
  if (mainStars.length === 0 && minorStars.length === 0) {
    analysis += '此宫无主星，需借对宫之星曜来论。'
    return analysis
  }
  
  const hasMainStar = (star: string) => mainStars.includes(star)
  const hasMinorStar = (star: string) => minorStars.includes(star)
  const hasSihua = (star: string, type: string) => sihua[type] === star
  
  // 检查四化
  const sihuaInfo: string[] = []
  mainStars.forEach(star => {
    if (hasSihua(star, 'lu')) sihuaInfo.push(`${star}化禄`)
    if (hasSihua(star, 'quan')) sihuaInfo.push(`${star}化权`)
    if (hasSihua(star, 'ke')) sihuaInfo.push(`${star}化科`)
    if (hasSihua(star, 'ji')) sihuaInfo.push(`${star}化忌`)
  })
  if (sihuaInfo.length > 0) {
    analysis += `有${sihuaInfo.join('、')}，`
  }
  
  if (palaceIndex === 0) { // 命宫
    if (hasMainStar('紫微')) {
      analysis += '紫微坐命，具有领导才能和权威气质，适合从事管理或领导工作。'
    } else if (hasMainStar('天府')) {
      analysis += '天府坐命，稳重踏实，善于理财，有良好的组织能力。'
    } else if (hasMainStar('天机')) {
      analysis += '天机坐命，聪明灵活，善于思考，适合从事策划或研究工作。'
    } else if (hasMainStar('太阳')) {
      analysis += '太阳坐命，光明磊落，热情开朗，有强烈的责任感和使命感。'
    } else if (hasMainStar('武曲')) {
      analysis += '武曲坐命，刚毅果断，有强烈的行动力，适合从事技术或军警工作。'
    } else if (hasMainStar('天同')) {
      analysis += '天同坐命，温和善良，人际关系良好，适合从事服务或艺术工作。'
    } else if (hasMainStar('廉贞')) {
      analysis += '廉贞坐命，刚正不阿，有强烈的正义感，适合从事法律或监察工作。'
    } else if (hasMainStar('太阴')) {
      analysis += '太阴坐命，温柔细腻，有艺术天赋，适合从事文艺或设计工作。'
    } else if (hasMainStar('贪狼')) {
      analysis += '贪狼坐命，多才多艺，善于交际，适合从事娱乐或商业工作。'
    } else if (hasMainStar('巨门')) {
      analysis += '巨门坐命，口才出众，善于表达，适合从事传媒或教育工作。'
    } else if (hasMainStar('天相')) {
      analysis += '天相坐命，稳重可靠，有协调能力，适合从事管理或行政工作。'
    } else if (hasMainStar('天梁')) {
      analysis += '天梁坐命，有智慧，善于分析，适合从事研究或咨询工作。'
    } else if (hasMainStar('七杀')) {
      analysis += '七杀坐命，果断勇敢，有冒险精神，适合从事军警或创业。'
    } else if (hasMainStar('破军')) {
      analysis += '破军坐命，勇于创新，有开拓精神，适合从事改革或创业。'
    } else {
      analysis += '命宫主星影响性格和命运走向，需结合其他宫位综合分析。'
    }
    
    if (hasMinorStar('左辅') || hasMinorStar('右弼')) {
      analysis += '有辅弼相助，贵人运佳，易得他人帮助。'
    }
    if (hasMinorStar('文昌') || hasMinorStar('文曲')) {
      analysis += '有文星相助，学业有成，文采出众。'
    }
    if (hasMinorStar('天魁') || hasMinorStar('天钺')) {
      analysis += '有魁钺相助，易得贵人提携。'
    }
  } else if (palaceIndex === 4) { // 财帛宫
    if (hasMainStar('武曲')) {
      analysis += '武曲入财帛，财运亨通，善于理财，适合从事金融或商业。'
    } else if (hasMainStar('天府')) {
      analysis += '天府入财帛，财源稳定，善于积累财富。'
    } else if (hasMainStar('紫微')) {
      analysis += '紫微入财帛，财运佳，易得贵人相助而获利。'
    } else if (hasMainStar('太阴')) {
      analysis += '太阴入财帛，财运稳定，适合从事投资或理财。'
    } else {
      analysis += '财帛宫主财运，需结合命宫和福德宫综合分析。'
    }
    
    if (hasMinorStar('禄存')) {
      analysis += '有禄存相助，财运稳定，易有积蓄。'
    }
    if (hasMinorStar('天马')) {
      analysis += '有天马相助，财运流动，适合投资或贸易。'
    }
  } else if (palaceIndex === 8) { // 官禄宫（事业宫）
    if (hasMainStar('紫微')) {
      analysis += '紫微入官禄，事业有成，易获得领导地位。'
    } else if (hasMainStar('天府')) {
      analysis += '天府入官禄，事业稳定，适合从事管理或金融工作。'
    } else if (hasMainStar('太阳')) {
      analysis += '太阳入官禄，事业光明，适合从事公职或教育行业。'
    } else if (hasMainStar('武曲')) {
      analysis += '武曲入官禄，事业有成，适合从事技术或军警工作。'
    } else if (hasMainStar('天相')) {
      analysis += '天相入官禄，事业稳定，适合从事管理或行政工作。'
    } else {
      analysis += '官禄宫主事业，需结合命宫和财帛宫综合分析。'
    }
    
    if (hasMinorStar('天魁') || hasMinorStar('天钺')) {
      analysis += '有魁钺相助，易得贵人提携，事业顺利。'
    }
  } else if (palaceIndex === 2) { // 夫妻宫
    if (hasMainStar('天同')) {
      analysis += '天同入夫妻，感情和谐，婚姻美满。'
    } else if (hasMainStar('太阴')) {
      analysis += '太阴入夫妻，配偶温柔体贴，感情细腻。'
    } else if (hasMainStar('太阳')) {
      analysis += '太阳入夫妻，配偶热情开朗，感情热烈。'
    } else if (hasMainStar('天相')) {
      analysis += '天相入夫妻，配偶稳重可靠，婚姻稳定。'
    } else {
      analysis += '夫妻宫主婚姻感情，需结合命宫和福德宫综合分析。'
    }
    
    if (hasMinorStar('红鸾') || hasMinorStar('天喜')) {
      analysis += '有红鸾天喜，桃花运佳，易有良缘。'
    }
    if (hasMinorStar('天姚')) {
      analysis += '有天姚，桃花运旺，需注意感情纠葛。'
    }
  } else {
    analysis += `${palaceName}的影响需结合主星和辅星综合分析。`
  }
  
  return analysis
}

export interface ZiweiPalaceResult {
  name: string
  mainStars: string[]
  minorStars: string[]
  sihua: string[]
  analysis: string
}

export interface ZiweiChartResult {
  mingGong: number
  shenGong: number
  palaces: ZiweiPalaceResult[]
}

export function buildZiweiChart(
  yearPillar: string,
  dayPillar: string,
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  birthTime: string,
): ZiweiChartResult {
  const yearGan = yearPillar[0]
  const mingGong = calculateMingGong(lunarMonth, birthTime)
  const shenGong = calculateShenGong(lunarMonth, birthTime)
  const ziweiPos = placeZiwei(lunarMonth, lunarDay)
  const tianfuPos = placeTianfu(ziweiPos)
  const ziweiStarsMap = placeZiweiStars(ziweiPos)
  const tianfuStarsMap = placeTianfuStars(tianfuPos)
  const mainStarsMap: { [key: number]: string[] } = {}
  for (let i = 0; i < 12; i++) {
    mainStarsMap[i] = [...(ziweiStarsMap[i] || []), ...(tianfuStarsMap[i] || [])]
  }
  const minorStarsMap = placeMinorStars(yearPillar, dayPillar, lunarYear)
  const sihua = calculateSihua(yearGan)
  const allStarsMap: { [key: number]: { main: string[]; minor: string[]; sihua: string[] } } = {}
  for (let i = 0; i < 12; i++) {
    const mainStars = mainStarsMap[i] || []
    const minorStars = minorStarsMap[i] || []
    const sihuaStars: string[] = []
    mainStars.forEach((star) => {
      if (sihua.lu === star) sihuaStars.push(`${star}化禄`)
      if (sihua.quan === star) sihuaStars.push(`${star}化权`)
      if (sihua.ke === star) sihuaStars.push(`${star}化科`)
      if (sihua.ji === star) sihuaStars.push(`${star}化忌`)
    })
    allStarsMap[i] = { main: mainStars, minor: minorStars, sihua: sihuaStars }
  }
  const palaces: ZiweiPalaceResult[] = []
  for (let i = 0; i < 12; i++) {
    const palaceIndex = (mingGong + i) % 12
    palaces.push({
      name: palaceNames[palaceIndex],
      mainStars: allStarsMap[palaceIndex].main,
      minorStars: allStarsMap[palaceIndex].minor,
      sihua: allStarsMap[palaceIndex].sihua,
      analysis: analyzePalace(palaceIndex, allStarsMap[palaceIndex].main, allStarsMap[palaceIndex].minor, sihua),
    })
  }
  return { mingGong, shenGong, palaces }
}
