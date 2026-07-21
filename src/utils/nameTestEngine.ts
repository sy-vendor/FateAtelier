import { getStrokeCount, getTotalStrokeCount } from '../data/strokeCount'
import {
  type FiveGrids,
  type Wuxing,
  numberToWuxing,
  numberMeaning,
  wuxingSheng,
  wuxingKe,
} from './nameTestData'
import { WUXING_EN } from './baziData'
import { isEnglishLocale } from '../i18n/locale'

export interface NameTestResult {
  grids: FiveGrids
  wuxing: { tian: Wuxing; ren: Wuxing; di: Wuxing; wai: Wuxing; zong: Wuxing }
  sancai: string
  score: number
  analysis: string
}

function calculateFiveGrids(surname: string, givenName: string): FiveGrids {
    const surnameStrokes = getTotalStrokeCount(surname)
    const givenNameStrokes = getTotalStrokeCount(givenName)
    const surnameLastChar = surname[surname.length - 1] || ''
    const givenNameFirstChar = givenName[0] || ''
    
    // 天格：姓氏笔画数+1（单姓）或姓氏笔画数之和（复姓）
    const tianGe = surname.length === 1 ? surnameStrokes + 1 : surnameStrokes
    
    // 人格：姓氏最后一个字笔画数+名字第一个字笔画数
    const renGe = getStrokeCount(surnameLastChar) + getStrokeCount(givenNameFirstChar)
    
    // 地格：名字笔画数之和
    const diGe = givenNameStrokes
    
    // 外格：总格-人格+1（单姓单名）或其他计算方式
    const zongGe = surnameStrokes + givenNameStrokes
    let waiGe = 0
    if (surname.length === 1 && givenName.length === 1) {
      waiGe = zongGe - renGe + 1
    } else if (surname.length === 1) {
      waiGe = getStrokeCount(givenName[givenName.length - 1] || '') + 1
    } else {
      waiGe = getStrokeCount(surname[0] || '') + getStrokeCount(givenName[givenName.length - 1] || '')
    }
    
    // 总格：姓名所有字笔画数之和
    return { tianGe, renGe, diGe, waiGe, zongGe }
  }

  // 获取数理的五行
function getWuxing(num: number): Wuxing {
    const reduced = num > 81 ? ((num - 1) % 81) + 1 : num
    return numberToWuxing[reduced] || '土'
  }

  // 分析三才配置
function analyzeSancai(tian: Wuxing, ren: Wuxing, di: Wuxing): string {
    if (isEnglishLocale()) {
      const names = [tian, ren, di].map((element) => WUXING_EN[element]).join(' → ')
      if (wuxingSheng[tian] === ren && wuxingSheng[ren] === di) {
        return `Excellent Three Talents configuration: ${names}. The elements generate one another, supporting a smooth and balanced path.`
      }
      if (wuxingSheng[tian] === ren || wuxingSheng[ren] === di) {
        return `Favorable Three Talents configuration: ${names}. One productive elemental link supports progress; strengthen the remaining connection with steady effort.`
      }
      if (wuxingKe[tian] === ren || wuxingKe[ren] === di) {
        return `Challenging Three Talents configuration: ${names}. A controlling elemental link calls for patience, clear priorities, and deliberate adjustment.`
      }
      if (tian === ren && ren === di) {
        return `Mixed Three Talents configuration: ${names}. A concentrated element gives focus, though balance comes from welcoming complementary perspectives.`
      }
      return `Balanced Three Talents configuration: ${names}. The relationships are neutral overall; practical choices remain the key influence.`
    }
    // 三才配置：天格、人格、地格的五行关系
    
    // 相生关系
    if (wuxingSheng[tian] === ren && wuxingSheng[ren] === di) {
      return '三才配置大吉：天格生人格，人格生地格，五行相生，运势亨通，成功顺利。'
    }
    if (wuxingSheng[tian] === ren) {
      return '三才配置吉：天格生人格，基础稳固，但地格需注意。'
    }
    if (wuxingSheng[ren] === di) {
      return '三才配置吉：人格生地格，发展顺利，但需注意天格关系。'
    }
    
    // 相克关系
    if (wuxingKe[tian] === ren || wuxingKe[ren] === di) {
      return '三才配置凶：五行相克，运势受阻，需谨慎行事。'
    }
    
    // 相同五行
    if (tian === ren && ren === di) {
      return '三才配置半吉：三格同五行，力量集中，但可能过于单一。'
    }
    
    return '三才配置平：五行关系一般，需结合其他因素综合判断。'
  }

  // 计算姓名评分
function calculateScore(grids: FiveGrids, wuxing: { tian: Wuxing, ren: Wuxing, di: Wuxing, wai: Wuxing, zong: Wuxing }): number {
    let score = 50 // 基础分
    
    // 根据五格数理吉凶评分
    const gridsToCheck = [
      { num: grids.tianGe, name: '天格' },
      { num: grids.renGe, name: '人格' },
      { num: grids.diGe, name: '地格' },
      { num: grids.waiGe, name: '外格' },
      { num: grids.zongGe, name: '总格' }
    ]
    
    gridsToCheck.forEach(({ num }) => {
      const reduced = num > 81 ? ((num - 1) % 81) + 1 : num
      const meaning = numberMeaning[reduced]
      if (meaning) {
        if (meaning.level === '大吉') score += 8
        else if (meaning.level === '吉') score += 5
        else if (meaning.level === '半吉') score += 2
        else if (meaning.level === '凶') score -= 5
        else if (meaning.level === '大凶') score -= 10
      }
    })
    
    // 根据三才配置评分
    if (wuxingSheng[wuxing.tian] === wuxing.ren && wuxingSheng[wuxing.ren] === wuxing.di) {
      score += 15 // 三才相生
    } else if (wuxingSheng[wuxing.tian] === wuxing.ren || wuxingSheng[wuxing.ren] === wuxing.di) {
      score += 8 // 部分相生
    } else if (wuxingKe[wuxing.tian] === wuxing.ren || wuxingKe[wuxing.ren] === wuxing.di) {
      score -= 10 // 相克
    }
    
    // 人格和地格的重要性
    const renMeaning = numberMeaning[grids.renGe > 81 ? ((grids.renGe - 1) % 81) + 1 : grids.renGe]
    const diMeaning = numberMeaning[grids.diGe > 81 ? ((grids.diGe - 1) % 81) + 1 : grids.diGe]
    if (renMeaning?.level === '大吉') score += 5
    if (diMeaning?.level === '大吉') score += 5
    
    return Math.max(0, Math.min(100, score))
  }

  // 生成分析报告
function generateAnalysis(grids: FiveGrids, wuxing: { tian: Wuxing, ren: Wuxing, di: Wuxing, wai: Wuxing, zong: Wuxing }): string {
    if (isEnglishLocale()) {
      const levelEn: Record<string, string> = { 大吉: 'Great Fortune', 吉: 'Favorable', 半吉: 'Mixed Fortune', 凶: 'Challenging', 大凶: 'Great Challenge' }
      const gridNames = [
        { num: grids.tianGe, name: 'Heaven Grid', wuxing: wuxing.tian },
        { num: grids.renGe, name: 'Human Grid', wuxing: wuxing.ren },
        { num: grids.diGe, name: 'Earth Grid', wuxing: wuxing.di },
        { num: grids.waiGe, name: 'Outer Grid', wuxing: wuxing.wai },
        { num: grids.zongGe, name: 'Total Grid', wuxing: wuxing.zong },
      ]
      const lines = ['[Five-grid numerology]']
      gridNames.forEach(({ num, name, wuxing: element }) => {
        const reduced = num > 81 ? ((num - 1) % 81) + 1 : num
        const meaning = numberMeaning[reduced]
        if (meaning) lines.push(`${name}: ${num} (${WUXING_EN[element]}) — ${levelEn[meaning.level]}. This number describes the traditional tendency of the grid; use it as reflection, not a verdict.`)
      })
      const counts = Object.values(wuxing).reduce<Record<string, number>>((total, element) => {
        total[element] = (total[element] ?? 0) + 1
        return total
      }, {})
      lines.push('\n[Three Talents]')
      lines.push(analyzeSancai(wuxing.tian, wuxing.ren, wuxing.di))
      lines.push('\n[Element balance]')
      lines.push(`Distribution: ${Object.entries(counts).map(([element, count]) => `${WUXING_EN[element]} ${count}`).join(', ')}`)
      return lines.join('\n')
    }
    const analysis: string[] = []
    
    // 五格分析
    analysis.push('【五格数理分析】')
    const gridsInfo = [
      { num: grids.tianGe, name: '天格', wuxing: wuxing.tian },
      { num: grids.renGe, name: '人格', wuxing: wuxing.ren },
      { num: grids.diGe, name: '地格', wuxing: wuxing.di },
      { num: grids.waiGe, name: '外格', wuxing: wuxing.wai },
      { num: grids.zongGe, name: '总格', wuxing: wuxing.zong }
    ]
    
    gridsInfo.forEach(({ num, name, wuxing: wx }) => {
      const reduced = num > 81 ? ((num - 1) % 81) + 1 : num
      const meaning = numberMeaning[reduced]
      if (meaning) {
        analysis.push(`${name}：${num}（${wx}）${meaning.level} - ${meaning.meaning}`)
      }
    })
    
    // 三才配置分析
    analysis.push('\n【三才配置】')
    analysis.push(`${wuxing.tian}${wuxing.ren}${wuxing.di}`)
    analysis.push(analyzeSancai(wuxing.tian, wuxing.ren, wuxing.di))
    
    // 五行分析
    analysis.push('\n【五行分析】')
    const wuxingCount: { [key in Wuxing]: number } = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
    Object.values(wuxing).forEach(wx => wuxingCount[wx]++)
    const wuxingDesc = Object.entries(wuxingCount)
      .filter(([_, count]) => count > 0)
      .map(([wx, count]) => `${wx}${count}`)
      .join('、')
    analysis.push(`五行分布：${wuxingDesc}`)
    
    return analysis.join('\n')
  }

  // 测试姓名
export function computeNameTest(surname: string, givenName: string): NameTestResult {
  const grids = calculateFiveGrids(surname, givenName)
  const wuxing = {
    tian: getWuxing(grids.tianGe),
    ren: getWuxing(grids.renGe),
    di: getWuxing(grids.diGe),
    wai: getWuxing(grids.waiGe),
    zong: getWuxing(grids.zongGe),
  }
  const sancai = analyzeSancai(wuxing.tian, wuxing.ren, wuxing.di)
  const score = calculateScore(grids, wuxing)
  const analysis = generateAnalysis(grids, wuxing)
  return { grids, wuxing, sancai, score, analysis }
}

export function getGridLevel(num: number): string {
  const reduced = num > 81 ? ((num - 1) % 81) + 1 : num
  const level = numberMeaning[reduced]?.level || '平'
  if (!isEnglishLocale()) return level
  return ({ 大吉: 'Great Fortune', 吉: 'Favorable', 半吉: 'Mixed Fortune', 凶: 'Challenging', 大凶: 'Great Challenge', 平: 'Neutral' } as Record<string, string>)[level]
}
