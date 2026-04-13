import { useState } from 'react'
import { getStrokeCount, getTotalStrokeCount } from '../data/strokeCount'
import './NameTest.css'
import { toast } from '../utils/toast'

// 五格数理配置
interface FiveGrids {
  tianGe: number // 天格
  renGe: number // 人格
  diGe: number // 地格
  waiGe: number // 外格
  zongGe: number // 总格
}

// 五行属性
type Wuxing = '金' | '木' | '水' | '火' | '土'

// 数理对应的五行
const numberToWuxing: { [key: number]: Wuxing } = {
  1: '木', 2: '木', 3: '火', 4: '火', 5: '土', 6: '土', 7: '金', 8: '金', 9: '水', 10: '水',
  11: '木', 12: '木', 13: '火', 14: '火', 15: '土', 16: '土', 17: '金', 18: '金', 19: '水', 20: '水',
  21: '木', 22: '木', 23: '火', 24: '火', 25: '土', 26: '土', 27: '金', 28: '金', 29: '水', 30: '水',
  31: '木', 32: '木', 33: '火', 34: '火', 35: '土', 36: '土', 37: '金', 38: '金', 39: '水', 40: '水',
  41: '木', 42: '木', 43: '火', 44: '火', 45: '土', 46: '土', 47: '金', 48: '金', 49: '水', 50: '水',
  51: '木', 52: '木', 53: '火', 54: '火', 55: '土', 56: '土', 57: '金', 58: '金', 59: '水', 60: '水',
  61: '木', 62: '木', 63: '火', 64: '火', 65: '土', 66: '土', 67: '金', 68: '金', 69: '水', 70: '水',
  71: '木', 72: '木', 73: '火', 74: '火', 75: '土', 76: '土', 77: '金', 78: '金', 79: '水', 80: '水',
  81: '木'
}

// 数理吉凶
const numberMeaning: { [key: number]: { level: '大吉' | '吉' | '半吉' | '凶' | '大凶', meaning: string } } = {
  1: { level: '大吉', meaning: '太极之数，万物开泰，生发无穷，利禄亨通。' },
  2: { level: '凶', meaning: '两仪之数，混沌未开，进退保守，志望难达。' },
  3: { level: '大吉', meaning: '三才之数，天地人和，大事大业，繁荣昌隆。' },
  4: { level: '凶', meaning: '四象之数，待于生发，万事慎重，不具营谋。' },
  5: { level: '大吉', meaning: '五行俱权，循环相生，圆通畅达，福祉无穷。' },
  6: { level: '大吉', meaning: '六爻之数，发展变化，天赋美德，吉祥安泰。' },
  7: { level: '吉', meaning: '七政之数，精悍严谨，天赋之力，吉星照耀。' },
  8: { level: '吉', meaning: '八卦之数，乾坎艮震，巽离坤兑，无穷无尽。' },
  9: { level: '凶', meaning: '大成之数，蕴涵凶险，或成或败，难以把握。' },
  10: { level: '凶', meaning: '终结之数，雪暗飘零，偶或有成，回顾茫然。' },
  11: { level: '大吉', meaning: '旱苗逢雨，万物更新，调顺发达，恢弘泽世。' },
  12: { level: '凶', meaning: '掘井无泉，无理之数，发展薄弱，虽生不足。' },
  13: { level: '大吉', meaning: '春日牡丹，智略超群，富学艺才能，有先见之明。' },
  14: { level: '凶', meaning: '破兆，家庭缘薄，孤独遭难，谋事不达，悲惨不测。' },
  15: { level: '大吉', meaning: '福寿双全，立身兴家，富贵荣华，德高望重。' },
  16: { level: '大吉', meaning: '厚重载德，安富尊荣，财官双美，功成名就。' },
  17: { level: '半吉', meaning: '刚强，突破万难，如能容忍，必获成功。' },
  18: { level: '半吉', meaning: '权威显达，博得名利，且养柔德，功成名就。' },
  19: { level: '凶', meaning: '风云蔽日，辛苦重来，虽有智谋，万事挫折。' },
  20: { level: '凶', meaning: '非业破运，灾难重重，进退维谷，万事难成。' },
  21: { level: '大吉', meaning: '明月中天，万物确立，官运亨通，大博名利。' },
  22: { level: '凶', meaning: '秋草逢霜，困难疾弱，虽出豪杰，人生波折。' },
  23: { level: '大吉', meaning: '旭日东升，壮丽壮观，权威旺盛，功名荣达。' },
  24: { level: '大吉', meaning: '金钱丰盈，白手成家，财源广进，家道昌盛。' },
  25: { level: '半吉', meaning: '英俊刚毅，资性英敏，成功发达，但性情过刚。' },
  26: { level: '凶', meaning: '变怪之象，波澜重叠，英雄豪杰，但多波折。' },
  27: { level: '半吉', meaning: '欲望无止，自我强烈，多受诽谤，尚可成功。' },
  28: { level: '凶', meaning: '阔水浮萍，遭难之数，豪杰气概，四海漂泊。' },
  29: { level: '半吉', meaning: '智谋优秀，财力归集，名闻海内，成就大业。' },
  30: { level: '半吉', meaning: '沉浮不定，凶吉难变，若明若暗，大成大败。' },
  31: { level: '大吉', meaning: '春日花开，智勇得志，博得名利，统领众人。' },
  32: { level: '大吉', meaning: '宝马金鞍，侥幸多望，贵人得助，财帛如裕。' },
  33: { level: '大吉', meaning: '旭日升天，鸾凤相会，名闻天下，隆昌至极。' },
  34: { level: '凶', meaning: '破家之身，见识短小，辛苦遭逢，灾祸至极。' },
  35: { level: '大吉', meaning: '温和平静，智达通畅，文昌技艺，奏功洋洋。' },
  36: { level: '半吉', meaning: '波澜重叠，常陷穷困，动不如静，有才无命。' },
  37: { level: '大吉', meaning: '权威显达，热诚忠信，宜着雅量，终身荣富。' },
  38: { level: '半吉', meaning: '意志薄弱，刻意经营，才识不凡，技艺有成。' },
  39: { level: '大吉', meaning: '富贵荣华，财帛丰盈，暗藏险象，德泽四方。' },
  40: { level: '半吉', meaning: '智谋胆力，冒险投机，沉浮不定，退保平安。' },
  41: { level: '大吉', meaning: '纯阳独秀，德高望重，和顺畅达，博得名利。' },
  42: { level: '半吉', meaning: '博识多能，精通世情，如能专心，尚可成功。' },
  43: { level: '凶', meaning: '散财破产，诸事不遂，虽有智谋，财来财去。' },
  44: { level: '凶', meaning: '破家亡身，暗藏惨淡，事不如意，乱世怪杰。' },
  45: { level: '大吉', meaning: '新生泰和，顺风扬帆，智谋经纬，富贵繁荣。' },
  46: { level: '凶', meaning: '载宝沉舟，浪里淘金，大难尝尽，大功有成。' },
  47: { level: '大吉', meaning: '点石成金，花开之象，万事如意，祯祥吉庆。' },
  48: { level: '大吉', meaning: '古松立鹤，智谋兼备，德量荣达，威望成师。' },
  49: { level: '半吉', meaning: '转变吉凶，处吉则吉，处凶则凶，惟靠谨慎。' },
  50: { level: '半吉', meaning: '一成一败，一盛一衰，惟靠谨慎，可守成功。' },
  51: { level: '半吉', meaning: '盛衰交加，波澜重叠，如能慎始，必获成功。' },
  52: { level: '大吉', meaning: '卓识达眼，先见之明，智谋超群，名利双收。' },
  53: { level: '半吉', meaning: '外祥内患，外祸内安，先富后贫，先贫后富。' },
  54: { level: '凶', meaning: '石上栽花，难得有活，忧闷烦来，辛惨不绝。' },
  55: { level: '半吉', meaning: '善善得恶，恶恶得善，吉到极限，反生凶险。' },
  56: { level: '凶', meaning: '浪里行舟，历尽艰辛，事与愿违，终难成功。' },
  57: { level: '半吉', meaning: '寒雪青松，夜莺吟春，必遭一过，繁荣白事。' },
  58: { level: '半吉', meaning: '沉浮多端，先苦后甜，宽宏扬名，富贵繁荣。' },
  59: { level: '凶', meaning: '寒蝉悲风，意志衰退，缺乏忍耐，苦难不休。' },
  60: { level: '凶', meaning: '无谋之人，漂泊不定，晦暝暗黑，动摇不安。' },
  61: { level: '半吉', meaning: '牡丹芙蓉，花开富贵，名利双收，定享天赋。' },
  62: { level: '凶', meaning: '衰败之象，内外不和，志望难达，灾祸频至。' },
  63: { level: '大吉', meaning: '舟归平海，富贵荣华，身心安泰，雨露惠泽。' },
  64: { level: '凶', meaning: '非命非运，沉沦逆境，凶煞频临，残废徒刑。' },
  65: { level: '大吉', meaning: '巨流归海，意望成功，家破亡身，再兴家业。' },
  66: { level: '凶', meaning: '进退维谷，艰难不堪，等待时机，一跃而起。' },
  67: { level: '半吉', meaning: '天赋幸运，四通八达，家道繁昌，富贵东来。' },
  68: { level: '大吉', meaning: '智虑周密，志向坚定，勤勉力行，发展奋进。' },
  69: { level: '凶', meaning: '非业非力，精神迫滞，灾害交至，遍尝痛苦。' },
  70: { level: '凶', meaning: '残菊逢霜，寂寞无碍，惨淡忧愁，晚景凄凉。' },
  71: { level: '半吉', meaning: '石上金花，内心劳苦，贯彻始终，定可昌隆。' },
  72: { level: '半吉', meaning: '劳苦相伴，阴云蔽月，外表吉祥，内实凶祸。' },
  73: { level: '半吉', meaning: '盛衰交加，徒有高志，天梯攀登，步步艰难。' },
  74: { level: '凶', meaning: '残菊经霜，秋叶寂寞，无能无智，辛苦繁多。' },
  75: { level: '半吉', meaning: '退守保吉，发迹甚迟，虽有吉象，无谋难成。' },
  76: { level: '凶', meaning: '倾覆离散，骨肉分离，内外不和，劳而无功。' },
  77: { level: '半吉', meaning: '家庭有悦，半凶半吉，能获援护，陷落不幸。' },
  78: { level: '半吉', meaning: '祸福参半，先天智能，中年发达，晚景困苦。' },
  79: { level: '凶', meaning: '云头望月，身疲力尽，穷迫不伸，精神不定。' },
  80: { level: '凶', meaning: '辛苦不绝，早入隐遁，安心立命，化凶转吉。' },
  81: { level: '大吉', meaning: '最极之数，还本归元，能得繁荣，发达成功。' },
}

// 五行相生相克
const wuxingSheng: { [key in Wuxing]: Wuxing } = {
  '木': '火',
  '火': '土',
  '土': '金',
  '金': '水',
  '水': '木'
}

const wuxingKe: { [key in Wuxing]: Wuxing } = {
  '木': '土',
  '火': '金',
  '土': '水',
  '金': '木',
  '水': '火'
}

function NameTest() {
  const [surname, setSurname] = useState('')
  const [givenName, setGivenName] = useState('')
  const [result, setResult] = useState<{
    grids: FiveGrids
    wuxing: { tian: Wuxing, ren: Wuxing, di: Wuxing, wai: Wuxing, zong: Wuxing }
    sancai: string
    score: number
    analysis: string
  } | null>(null)

  // 计算五格数理
  const calculateFiveGrids = (surname: string, givenName: string): FiveGrids => {
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
  const getWuxing = (num: number): Wuxing => {
    const reduced = num > 81 ? ((num - 1) % 81) + 1 : num
    return numberToWuxing[reduced] || '土'
  }

  // 分析三才配置
  const analyzeSancai = (tian: Wuxing, ren: Wuxing, di: Wuxing): string => {
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
  const calculateScore = (grids: FiveGrids, wuxing: { tian: Wuxing, ren: Wuxing, di: Wuxing, wai: Wuxing, zong: Wuxing }): number => {
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
  const generateAnalysis = (grids: FiveGrids, wuxing: { tian: Wuxing, ren: Wuxing, di: Wuxing, wai: Wuxing, zong: Wuxing }): string => {
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
  const testName = () => {
    if (!surname.trim() || !givenName.trim()) {
      toast.warning('请输入完整的姓名（姓氏和名字）')
      return
    }
    
    const grids = calculateFiveGrids(surname.trim(), givenName.trim())
    const wuxing = {
      tian: getWuxing(grids.tianGe),
      ren: getWuxing(grids.renGe),
      di: getWuxing(grids.diGe),
      wai: getWuxing(grids.waiGe),
      zong: getWuxing(grids.zongGe)
    }
    
    const sancai = analyzeSancai(wuxing.tian, wuxing.ren, wuxing.di)
    const score = calculateScore(grids, wuxing)
    const analysis = generateAnalysis(grids, wuxing)
    
    setResult({ grids, wuxing, sancai, score, analysis })
  }

  return (
    <div className="name-test">
      <div className="name-test-header">
        <h1>📝 姓名测试</h1>
        <p className="subtitle">五格数理、三才配置、姓名评分</p>
      </div>

      <div className="name-test-content">
        <div className="input-section">
          <div className="input-group">
            <label>姓氏：</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="请输入姓氏"
              maxLength={4}
            />
          </div>
          <div className="input-group">
            <label>名字：</label>
            <input
              type="text"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              placeholder="请输入名字"
              maxLength={4}
            />
          </div>
          <button className="test-btn" onClick={testName}>
            开始测试
          </button>
        </div>

        {result && (
          <div className="result-section">
            <div className="score-card">
              <div className="score-value">{result.score}</div>
              <div className="score-label">姓名评分</div>
            </div>

            <div className="grids-section">
              <h3>五格数理</h3>
              <div className="grids-grid">
                <div className="grid-item">
                  <div className="grid-name">天格</div>
                  <div className="grid-number">{result.grids.tianGe}</div>
                  <div className="grid-wuxing" data-wuxing={result.wuxing.tian}>{result.wuxing.tian}</div>
                  <div className="grid-meaning" data-level={numberMeaning[result.grids.tianGe > 81 ? ((result.grids.tianGe - 1) % 81) + 1 : result.grids.tianGe]?.level || '平'}>
                    {numberMeaning[result.grids.tianGe > 81 ? ((result.grids.tianGe - 1) % 81) + 1 : result.grids.tianGe]?.level || '平'}
                  </div>
                </div>
                <div className="grid-item">
                  <div className="grid-name">人格</div>
                  <div className="grid-number">{result.grids.renGe}</div>
                  <div className="grid-wuxing" data-wuxing={result.wuxing.ren}>{result.wuxing.ren}</div>
                  <div className="grid-meaning" data-level={numberMeaning[result.grids.renGe > 81 ? ((result.grids.renGe - 1) % 81) + 1 : result.grids.renGe]?.level || '平'}>
                    {numberMeaning[result.grids.renGe > 81 ? ((result.grids.renGe - 1) % 81) + 1 : result.grids.renGe]?.level || '平'}
                  </div>
                </div>
                <div className="grid-item">
                  <div className="grid-name">地格</div>
                  <div className="grid-number">{result.grids.diGe}</div>
                  <div className="grid-wuxing" data-wuxing={result.wuxing.di}>{result.wuxing.di}</div>
                  <div className="grid-meaning" data-level={numberMeaning[result.grids.diGe > 81 ? ((result.grids.diGe - 1) % 81) + 1 : result.grids.diGe]?.level || '平'}>
                    {numberMeaning[result.grids.diGe > 81 ? ((result.grids.diGe - 1) % 81) + 1 : result.grids.diGe]?.level || '平'}
                  </div>
                </div>
                <div className="grid-item">
                  <div className="grid-name">外格</div>
                  <div className="grid-number">{result.grids.waiGe}</div>
                  <div className="grid-wuxing" data-wuxing={result.wuxing.wai}>{result.wuxing.wai}</div>
                  <div className="grid-meaning" data-level={numberMeaning[result.grids.waiGe > 81 ? ((result.grids.waiGe - 1) % 81) + 1 : result.grids.waiGe]?.level || '平'}>
                    {numberMeaning[result.grids.waiGe > 81 ? ((result.grids.waiGe - 1) % 81) + 1 : result.grids.waiGe]?.level || '平'}
                  </div>
                </div>
                <div className="grid-item">
                  <div className="grid-name">总格</div>
                  <div className="grid-number">{result.grids.zongGe}</div>
                  <div className="grid-wuxing" data-wuxing={result.wuxing.zong}>{result.wuxing.zong}</div>
                  <div className="grid-meaning" data-level={numberMeaning[result.grids.zongGe > 81 ? ((result.grids.zongGe - 1) % 81) + 1 : result.grids.zongGe]?.level || '平'}>
                    {numberMeaning[result.grids.zongGe > 81 ? ((result.grids.zongGe - 1) % 81) + 1 : result.grids.zongGe]?.level || '平'}
                  </div>
                </div>
              </div>
            </div>

            <div className="sancai-section">
              <h3>三才配置</h3>
              <div className="sancai-display">
                <div className="sancai-item">
                  <div className="sancai-label">天格</div>
                  <div className="sancai-wuxing">{result.wuxing.tian}</div>
                </div>
                <div className="sancai-arrow">→</div>
                <div className="sancai-item">
                  <div className="sancai-label">人格</div>
                  <div className="sancai-wuxing">{result.wuxing.ren}</div>
                </div>
                <div className="sancai-arrow">→</div>
                <div className="sancai-item">
                  <div className="sancai-label">地格</div>
                  <div className="sancai-wuxing">{result.wuxing.di}</div>
                </div>
              </div>
              <div className="sancai-analysis">{result.sancai}</div>
            </div>

            <div className="analysis-section">
              <h3>详细分析</h3>
              <div className="analysis-content">
                <pre>{result.analysis}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NameTest

