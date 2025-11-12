import { useMemo } from 'react'
import './Almanac.css'

// 天干地支五行映射
const tianganWuxing: { [key: string]: string } = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
}

const dizhiWuxing: { [key: string]: string } = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
}

// 地支相冲关系（六冲）
const chongMap: { [key: string]: string } = {
  '子': '午', '午': '子', '丑': '未', '未': '丑',
  '寅': '申', '申': '寅', '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
}

// 地支对应的生肖
const dizhiToShengxiao: { [key: string]: string } = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
  '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
  '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪'
}

// 地支对应的方位
const dizhiToFangwei: { [key: string]: string } = {
  '子': '北', '丑': '东北', '寅': '东北', '卯': '东',
  '辰': '东南', '巳': '东南', '午': '南', '未': '西南',
  '申': '西南', '酉': '西', '戌': '西北', '亥': '西北'
}


// 天干地支
const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const shengxiao = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 时辰
const shichen = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 计算立春日期（简化算法，1900-2100年）
function getLichunDate(year: number): Date {
  // 立春通常在2月4日或5日
  // 1900-1999: 2月4日或5日
  // 2000-2099: 2月4日
  // 简化处理：1900-1999年，能被4整除的年份是2月4日，否则是2月5日
  // 2000年后都是2月4日
  if (year >= 2000) {
    return new Date(year, 1, 4) // 2月4日
  } else {
    const day = year % 4 === 0 ? 4 : 5
    return new Date(year, 1, day)
  }
}

// 计算节气对应的月份（简化版，实际需要精确的节气时间）
function getJieqiMonth(_year: number, month: number, day: number): number {
  // 节气大致日期（简化版）
  const jieqiDates = [
    [2, 4],   // 立春 2月4日
    [3, 6],   // 惊蛰 3月6日
    [4, 5],   // 清明 4月5日
    [5, 6],   // 立夏 5月6日
    [6, 6],   // 芒种 6月6日
    [7, 7],   // 小暑 7月7日
    [8, 8],   // 立秋 8月8日
    [9, 8],   // 白露 9月8日
    [10, 8],  // 寒露 10月8日
    [11, 7],  // 立冬 11月7日
    [12, 7],  // 大雪 12月7日
    [1, 6]    // 小寒 1月6日（次年）
  ]
  
  // 判断当前日期属于哪个节气月
  for (let i = 0; i < jieqiDates.length; i++) {
    const [jieqiMonth, jieqiDay] = jieqiDates[i]
    if (month < jieqiMonth || (month === jieqiMonth && day < jieqiDay)) {
      // 返回上一个节气月（农历月份）
      return i === 0 ? 12 : i // 如果小于立春，返回12月（上一年）
    }
  }
  return 12 // 12月（小寒后）
}

// 计算年柱（根据立春分界）
function calculateYearPillar(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 判断是否在立春之前
  const lichunDate = getLichunDate(year)
  const currentDate = new Date(year, month - 1, day)
  
  // 如果当前日期在立春之前，使用上一年的年柱
  let actualYear = year
  if (currentDate < lichunDate) {
    actualYear = year - 1
  }
  
  // 计算年柱天干地支
  const yearGan = tiangan[(actualYear - 4) % 10]
  const yearZhi = dizhi[(actualYear - 4) % 12]
  
  return yearGan + yearZhi
}

// 计算月柱（根据节气）
function calculateMonthPillar(date: Date, yearPillar: string): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 判断是否在立春之前
  const lichunDate = getLichunDate(year)
  const currentDate = new Date(year, month - 1, day)
  let actualYear = year
  if (currentDate < lichunDate) {
    actualYear = year - 1
  }
  
  // 获取节气月（农历月份，从立春开始为正月）
  const jieqiMonth = getJieqiMonth(actualYear, month, day)
  
  // 月支：正月为寅，二月为卯，以此类推
  const monthZhi = dizhi[(jieqiMonth + 1) % 12] // +1是因为正月对应寅（索引2）
  
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

// 计算日柱（使用准确的公式）
function calculateDayPillar(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 使用1900年1月1日为基准日（甲子日）
  // 1900年1月1日是甲子日（天干索引0，地支索引0）
  const baseYear = 1900
  const baseMonth = 1
  const baseDay = 1
  
  // 计算从基准日到目标日的天数
  const baseDate = new Date(baseYear, baseMonth - 1, baseDay)
  const targetDate = new Date(year, month - 1, day)
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // 计算日柱
  // 天干：每10天循环
  // 地支：每12天循环
  const dayGanIndex = (daysDiff % 10 + 0) % 10 // 基准日是甲（索引0）
  const dayZhiIndex = (daysDiff % 12 + 0) % 12 // 基准日是子（索引0）
  
  const dayGan = tiangan[dayGanIndex]
  const dayZhi = dizhi[dayZhiIndex]
  
  return dayGan + dayZhi
}

// 计算天干地支
function getGanZhi(year: number, month: number, day: number): { yearGanZhi: string, monthGanZhi: string, dayGanZhi: string } {
  const date = new Date(year, month - 1, day)
  const yearGanZhi = calculateYearPillar(date)
  const monthGanZhi = calculateMonthPillar(date, yearGanZhi)
  const dayGanZhi = calculateDayPillar(date)
  
  return { yearGanZhi, monthGanZhi, dayGanZhi }
}

// 根据日柱确定宜忌事项（基于传统规则）
function getYiJi(dayGanZhi: string): { yi: string[], ji: string[] } {
  const dayGan = dayGanZhi[0]
  const dayZhi = dayGanZhi[1]
  const dayGanWuxing = tianganWuxing[dayGan]
  const dayZhiWuxing = dizhiWuxing[dayZhi]
  
  // 基于天干地支的五行属性确定宜忌
  // 相生相合为吉，相冲相克为凶
  const yi: string[] = []
  const ji: string[] = []
  
  // 根据天干确定部分宜忌
  const ganIndex = tiangan.indexOf(dayGan)
  if (ganIndex % 2 === 0) { // 阳干
    yi.push('祭祀', '祈福', '开光', '出行', '解除', '修造', '动土', '入宅', '安香')
    ji.push('嫁娶', '纳采', '订盟', '安床', '入宅', '开市', '交易')
  } else { // 阴干
    yi.push('嫁娶', '纳采', '订盟', '会亲友', '进人口', '交易', '立券', '纳财', '开市')
    ji.push('祭祀', '祈福', '求嗣', '开光', '出行', '解除', '伐木', '拆卸')
  }
  
  // 根据五行确定更多宜忌
  if (dayGanWuxing === '木' || dayZhiWuxing === '木') {
    yi.push('栽种', '纳畜', '牧养')
    ji.push('伐木', '开仓', '出货财')
  }
  if (dayGanWuxing === '火' || dayZhiWuxing === '火') {
    yi.push('开光', '出火', '作灶')
    ji.push('安葬', '行丧', '修坟')
  }
  if (dayGanWuxing === '土' || dayZhiWuxing === '土') {
    yi.push('修造', '动土', '起基', '上梁', '安门', '置产')
    ji.push('破土', '安葬', '启攒')
  }
  if (dayGanWuxing === '金' || dayZhiWuxing === '金') {
    yi.push('交易', '立券', '纳财', '开市')
    ji.push('开仓', '出货财')
  }
  if (dayGanWuxing === '水' || dayZhiWuxing === '水') {
    yi.push('祭祀', '祈福', '求嗣', '解除')
    ji.push('开仓', '出货财', '置产')
  }
  
  // 去重并限制数量
  const uniqueYi = Array.from(new Set(yi)).slice(0, 10)
  const uniqueJi = Array.from(new Set(ji)).slice(0, 8)
  
  return { yi: uniqueYi, ji: uniqueJi }
}

// 根据日柱确定时辰吉凶
function getShichenJixiong(dayGanZhi: string): Array<{ shichen: string, jixiong: string }> {
  const dayZhi = dayGanZhi[1]
  const dayZhiIndex = dizhi.indexOf(dayZhi)
  
  return shichen.map((sc) => {
    const scIndex = dizhi.indexOf(sc)
    // 相冲为凶，相合为吉，同支为平
    if (chongMap[dayZhi] === sc) {
      return { shichen: sc, jixiong: '凶' }
    } else if ((scIndex - dayZhiIndex + 12) % 12 === 6) {
      return { shichen: sc, jixiong: '凶' } // 六冲
    } else if ((scIndex - dayZhiIndex + 12) % 12 === 0) {
      return { shichen: sc, jixiong: '平' } // 同支
    } else if ((scIndex - dayZhiIndex + 12) % 12 === 1 || (scIndex - dayZhiIndex + 12) % 12 === 11) {
      return { shichen: sc, jixiong: '吉' } // 相邻
    } else {
      return { shichen: sc, jixiong: '平' }
    }
  })
}

// 生成黄历（基于天干地支规则，非随机）
function generateAlmanac(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 计算天干地支
  const { yearGanZhi, monthGanZhi, dayGanZhi } = getGanZhi(year, month, day)
  
  const dayGan = dayGanZhi[0]
  const dayZhi = dayGanZhi[1]
  
  // 冲煞：基于地支相冲
  const chongZhi = chongMap[dayZhi] || dizhi[(dizhi.indexOf(dayZhi) + 6) % 12]
  const chongShengxiao = dizhiToShengxiao[chongZhi] || shengxiao[0]
  const chongFang = dizhiToFangwei[chongZhi] || '东'
  
  // 五行：基于日柱
  const wuxingValue = tianganWuxing[dayGan] || '土'
  
  // 宜忌：基于日柱规则
  const { yi, ji } = getYiJi(dayGanZhi)
  
  // 时辰吉凶：基于日柱
  const shichenJixiong = getShichenJixiong(dayGanZhi)
  
  // 方位：基于五行和地支
  const jishenFangwei = dizhiToFangwei[dayZhi] || '东'
  const xiongshenFangwei = dizhiToFangwei[chongZhi] || '西'
  
  return {
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    chongShengxiao,
    chongFang,
    yi,
    ji,
    shichenJixiong,
    wuxing: wuxingValue,
    jishenFangwei,
    xiongshenFangwei
  }
}

interface AlmanacProps {
  onBack?: () => void
}

function Almanac({ onBack }: AlmanacProps) {
  const today = new Date()
  const almanac = useMemo(() => generateAlmanac(today), [])
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const weekday = weekdays[date.getDay()]
    return `${year}年${month}月${day}日 星期${weekday}`
  }

  return (
    <div className="almanac">
      <div className="almanac-header">
        <h2>📅 今日黄历</h2>
        {onBack && (
          <button className="back-btn" onClick={onBack}>← 返回</button>
        )}
      </div>

      <div className="almanac-date">
        <div className="date-display">{formatDate(today)}</div>
        <div className="ganzhi-display">
          <span>年柱：{almanac.yearGanZhi}</span>
          <span>月柱：{almanac.monthGanZhi}</span>
          <span>日柱：{almanac.dayGanZhi}</span>
        </div>
      </div>

      <div className="almanac-grid">
        <div className="almanac-card chongsha-card">
          <h3>冲煞</h3>
          <div className="chongsha-content">
            <p>冲<span className="highlight">{almanac.chongShengxiao}</span></p>
            <p>煞<span className="highlight">{almanac.chongFang}</span></p>
          </div>
        </div>

        <div className="almanac-card wuxing-card">
          <h3>五行</h3>
          <div className="wuxing-value">{almanac.wuxing}</div>
        </div>

        <div className="almanac-card fangwei-card">
          <h3>方位</h3>
          <div className="fangwei-content">
            <p>吉神：<span className="good">{almanac.jishenFangwei}</span></p>
            <p>凶神：<span className="bad">{almanac.xiongshenFangwei}</span></p>
          </div>
        </div>
      </div>

      <div className="almanac-section">
        <div className="yi-card">
          <h3>✅ 宜</h3>
          <div className="items-list">
            {almanac.yi.map((item, idx) => (
              <span key={idx} className="item-tag good">{item}</span>
            ))}
          </div>
        </div>

        <div className="ji-card">
          <h3>❌ 忌</h3>
          <div className="items-list">
            {almanac.ji.map((item, idx) => (
              <span key={idx} className="item-tag bad">{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="almanac-section">
        <div className="shichen-card">
          <h3>⏰ 时辰吉凶</h3>
          <div className="shichen-grid">
            {almanac.shichenJixiong.map((item, idx) => (
              <div key={idx} className={`shichen-item ${item.jixiong === '吉' ? 'good' : item.jixiong === '凶' ? 'bad' : 'neutral'}`}>
                <span className="shichen-name">{item.shichen}</span>
                <span className="shichen-jixiong">{item.jixiong}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="almanac-footer">
        <p>📌 本黄历仅供参考，实际决策请结合具体情况</p>
      </div>
    </div>
  )
}

export default Almanac

