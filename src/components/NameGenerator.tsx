import { useState } from 'react'
import './NameGenerator.css'

interface NameGeneratorProps {
  onBack: () => void
}

function NameGenerator({ onBack }: NameGeneratorProps) {
  const [surname, setSurname] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [preferences, setPreferences] = useState<string[]>([])
  const [nameLength, setNameLength] = useState<'any' | '2' | '3' | '4'>('any')
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const preferenceOptions = [
    '文雅', '活泼', '沉稳', '清新', '古典', '现代', '诗意', '简洁',
    '大气', '温柔', '阳光', '智慧', '勇敢', '优雅', '自然', '富贵', '健康'
  ]

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    )
  }

  const generateNames = () => {
    if (!surname.trim()) {
      alert('请输入姓氏')
      return
    }

    setIsGenerating(true)
    
    // 模拟生成过程
    setTimeout(() => {
      const names = generateNameList(surname, gender, birthDate, birthTime, preferences, nameLength)
      setGeneratedNames(names)
      setIsGenerating(false)
    }, 1000)
  }

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
  
  // 计算立春日期（简化算法，1900-2100年）
  const getLichunDate = (year: number): Date => {
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
  const getJieqiMonth = (_year: number, month: number, day: number): number => {
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
  const calculateYearPillar = (date: Date): string => {
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
  const calculateMonthPillar = (date: Date, yearPillar: string): string => {
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
  const calculateDayPillar = (date: Date): string => {
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
  
  // 计算时柱（根据日干和时辰）
  const calculateHourPillar = (_date: Date, dayPillar: string, birthTime: string): string => {
    // 获取时辰（子时0-1，丑时1-3，寅时3-5...）
    let hour = 0
    if (birthTime) {
      const [h] = birthTime.split(':').map(Number)
      hour = h || 0
    } else {
      hour = 12 // 默认中午
    }
    
    // 计算时辰索引（子时0，丑时1，寅时2...）
    // 子时：23-1点，丑时：1-3点，寅时：3-5点...
    let hourIndex = 0
    if (hour >= 23 || hour < 1) {
      hourIndex = 0 // 子时
    } else if (hour >= 1 && hour < 3) {
      hourIndex = 1 // 丑时
    } else if (hour >= 3 && hour < 5) {
      hourIndex = 2 // 寅时
    } else if (hour >= 5 && hour < 7) {
      hourIndex = 3 // 卯时
    } else if (hour >= 7 && hour < 9) {
      hourIndex = 4 // 辰时
    } else if (hour >= 9 && hour < 11) {
      hourIndex = 5 // 巳时
    } else if (hour >= 11 && hour < 13) {
      hourIndex = 6 // 午时
    } else if (hour >= 13 && hour < 15) {
      hourIndex = 7 // 未时
    } else if (hour >= 15 && hour < 17) {
      hourIndex = 8 // 申时
    } else if (hour >= 17 && hour < 19) {
      hourIndex = 9 // 酉时
    } else if (hour >= 19 && hour < 21) {
      hourIndex = 10 // 戌时
    } else {
      hourIndex = 11 // 亥时
    }
    
    const hourZhi = dizhi[hourIndex]
    
    // 时干：根据日干和时支计算（五鼠遁）
    // 甲己还生甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
    const dayGan = dayPillar[0]
    const dayGanIndex = tiangan.indexOf(dayGan)
    
    let hourGanIndex = 0
    if (dayGanIndex === 0 || dayGanIndex === 5) { // 甲或己
      hourGanIndex = (0 + hourIndex) % 10 // 甲己还生甲
    } else if (dayGanIndex === 1 || dayGanIndex === 6) { // 乙或庚
      hourGanIndex = (2 + hourIndex) % 10 // 乙庚丙作初
    } else if (dayGanIndex === 2 || dayGanIndex === 7) { // 丙或辛
      hourGanIndex = (4 + hourIndex) % 10 // 丙辛从戊起
    } else if (dayGanIndex === 3 || dayGanIndex === 8) { // 丁或壬
      hourGanIndex = (6 + hourIndex) % 10 // 丁壬庚子居
    } else { // 戊或癸
      hourGanIndex = (8 + hourIndex) % 10 // 戊癸何方发，壬子是真途
    }
    
    const hourGan = tiangan[hourGanIndex]
    
    return hourGan + hourZhi
  }
  
  // 计算生辰八字（完整版）
  const calculateBazi = (birthDate: string, birthTime: string): string[] => {
    if (!birthDate) return []
    
    const date = new Date(birthDate)
    
    // 计算年柱（根据立春分界）
    const yearPillar = calculateYearPillar(date)
    
    // 计算月柱（根据节气和年柱）
    const monthPillar = calculateMonthPillar(date, yearPillar)
    
    // 计算日柱
    const dayPillar = calculateDayPillar(date)
    
    // 计算时柱（根据日柱和时辰）
    const hourPillar = calculateHourPillar(date, dayPillar, birthTime)
    
    return [yearPillar, monthPillar, dayPillar, hourPillar]
  }
  
  // 分析五行
  const analyzeWuxing = (bazi: string[]): { [key: string]: number } => {
    const wuxingCount: { [key: string]: number } = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
    
    if (bazi.length === 0) return wuxingCount
    
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
  
  // 字符到五行的映射（常用字）
  const charToWuxing: { [key: string]: string } = {
    // 金
    '金': '金', '银': '金', '钢': '金', '铁': '金', '锋': '金', '锐': '金', '剑': '金', '刀': '金',
    '刚': '金', '强': '金', '坚': '金', '利': '金', '铭': '金', '钟': '金',
    '锦': '金', '钱': '金', '财': '金', '富': '金', '贵': '金', '鑫': '金', '钧': '金', '钊': '金',
    // 木
    '木': '木', '林': '木', '森': '木', '树': '木', '花': '木', '草': '木', '竹': '木', '梅': '木',
    '兰': '木', '菊': '木', '莲': '木', '荷': '木', '桃': '木', '李': '木', '杏': '木', '梨': '木',
    '樱': '木', '桂': '木', '桐': '木', '柳': '木', '松': '木', '柏': '木', '杨': '木', '枫': '木',
    '杰': '木', '栋': '木', '梁': '木', '材': '木', '彬': '木', '荣': '木', '华': '木',
    // 水
    '水': '水', '海': '水', '江': '水', '河': '水', '湖': '水', '泉': '水', '溪': '水', '流': '水',
    '波': '水', '涛': '水', '浪': '水', '潮': '水', '雨': '水', '雪': '水', '冰': '水', '霜': '水',
    '露': '水', '雾': '水', '云': '水', '风': '水', '涵': '水', '润': '水', '泽': '水', '清': '水',
    '洁': '水', '净': '水', '浩': '水', '瀚': '水', '洋': '水', '渊': '水', '深': '水', '浅': '水',
    // 火
    '火': '火', '炎': '火', '焰': '火', '烈': '火', '热': '火', '光': '火', '明': '火', '亮': '火',
    '辉': '火', '煌': '火', '灿': '火', '烂': '火', '阳': '火', '日': '火', '星': '火', '月': '火',
    '晨': '火', '晓': '火', '旭': '火', '曦': '火', '晴': '火', '暖': '火', '照': '火', '耀': '火',
    '智': '火', '慧': '火', '聪': '火', '敏': '火', '灵': '火', '心': '火', '思': '火', '念': '火',
    // 土
    '土': '土', '地': '土', '山': '土', '峰': '土', '岭': '土', '岩': '土', '石': '土', '城': '土',
    '壁': '土', '固': '土', '稳': '土', '安': '土', '宁': '土', '静': '土', '定': '土',
    '厚': '土', '实': '土', '诚': '土', '信': '土', '德': '土', '义': '土', '仁': '土', '善': '土',
    '宇': '土', '堂': '土', '基': '土', '础': '土', '培': '土', '育': '土', '养': '土', '成': '土'
  }
  
  // 获取字符的五行（如果没有映射，返回null）
  const getCharWuxing = (char: string): string | null => {
    return charToWuxing[char] || null
  }

  const generateNameList = (
    surname: string,
    gender: string,
    birthDate: string,
    birthTime: string,
    preferences: string[],
    length: 'any' | '2' | '3' | '4'
  ): string[] => {
    // 计算生辰八字并分析五行
    const bazi = calculateBazi(birthDate, birthTime)
    const wuxingCount = analyzeWuxing(bazi)
    
    // 找出缺失或较少的五行
    const wuxingValues = Object.values(wuxingCount)
    const avgCount = wuxingValues.reduce((a, b) => a + b, 0) / 5
    
    // 需要补充的五行（数量少于平均值的）
    const neededWuxing: string[] = []
    Object.entries(wuxingCount).forEach(([wuxing, count]) => {
      if (count < avgCount) {
        neededWuxing.push(wuxing)
      }
    })
    
    // 不再使用固定的名字库，改为一个字一个字随机组合生成
    // 单个字库（用于随机组合生成）
    const maleChars = [
      '浩', '轩', '佑', '杰', '博', '强', '明', '辉', '昊', '涵',
      '宇', '文', '渊', '天', '远', '墨', '彬', '恒', '涛', '伟',
      '豪', '超', '翔', '龙', '鹏', '安', '峰', '瑞', '凯', '勇',
      '健', '军', '赐', '成', '阳', '德', '诚', '华', '清', '秀',
      '康', '泽', '启', '宏', '辰', '睿', '智', '信', '仁', '义',
      '毅', '刚', '正', '直', '和', '平', '乐', '福', '祥', '吉',
      '利', '顺', '通', '达', '进', '升', '高', '兴', '旺', '荣',
      '华', '昌', '盛', '光', '亮', '新', '美', '优', '良', '佳',
      '妙', '奇', '凡', '众', '超', '群', '卓', '越', '杰', '秀',
      '精', '英', '才', '华', '学', '识', '知', '识', '智', '慧',
      '聪', '明', '敏', '捷', '灵', '活', '创', '新', '开', '拓',
      '进', '取', '奋', '斗', '勤', '奋', '专', '注', '认', '真',
      '承', '诺', '守', '信', '诚', '实', '真', '诚', '善', '良',
      '友', '爱', '和', '睦', '温', '柔', '周', '到', '完', '美',
      '全', '面', '深', '刻', '透', '彻', '子', '宸', '睿', '哲',
      '思', '源', '修', '齐', '治', '平', '君', '礼', '义', '廉',
      '忠', '孝', '节', '温', '良', '恭', '俭', '让', '谦', '逊',
      '宽', '厚', '仁', '慈', '爱', '钰', '瑾', '琛', '璞', '琨',
      '琰', '琮', '璎', '珞', '璨', '璟', '瑜', '琦', '瑶', '琼',
      '润', '泽', '澜', '涛', '波', '潮', '瀚', '海', '江', '河',
      '湖', '溪', '泉', '源', '流', '清', '澈', '澄', '湛', '深',
      '渊', '洋', '浩', '瀚', '沛', '沐', '浴', '洗', '涤', '净'
    ]

    const femaleChars = [
      '雨', '涵', '怡', '思', '诗', '馨', '瑶', '萱', '语', '嫣',
      '桐', '悦', '琪', '欣', '晴', '妍', '颖', '雅', '儿', '婷',
      '柔', '梦', '菲', '晨', '静', '宁', '和', '平', '美', '丽',
      '慧', '敏', '灵', '雪', '月', '星', '花', '兰', '梅', '竹',
      '菊', '莲', '荷', '桂', '桃', '梨', '樱', '杏', '李', '彩',
      '光', '亮', '清', '净', '洁', '纯', '真', '诚', '实', '信',
      '仁', '德', '礼', '智', '勇', '健', '康', '安', '全', '完',
      '整', '齐', '友', '爱', '关', '怀', '温', '柔', '周', '到',
      '完', '美', '优', '雅', '高', '贵', '典', '雅', '端', '庄',
      '大', '方', '文', '静', '秀', '气', '清', '新', '自', '然',
      '纯', '真', '可', '爱', '活', '泼', '开', '朗', '乐', '观',
      '积', '极', '向', '上', '进', '取', '勤', '奋', '专', '注',
      '认', '真', '承', '诺', '守', '信', '诚', '实', '善', '良',
      '友', '爱', '和', '睦', '精', '细', '微', '妙', '巧', '妙',
      '奇', '凡', '众', '超', '群', '卓', '越', '杰', '秀', '精',
      '英', '才', '华', '学', '识', '知', '识', '智', '慧', '聪',
      '明', '敏', '捷', '灵', '活', '创', '新', '开', '拓', '进',
      '取', '勤', '奋', '专', '注', '认', '真', '承', '诺', '守',
      '信', '诚', '实', '善', '良', '友', '爱', '和', '睦', '温',
      '柔', '周', '到', '完', '美', '子', '若', '如', '初', '念',
      '忆', '惜', '怜', '珍', '宝', '珠', '玉', '翡', '翠', '珊',
      '瑚', '玛', '瑙', '水', '晶', '钻', '石', '金', '银', '婉',
      '约', '娴', '淑', '惠', '贤', '德', '容', '貌', '姿', '色',
      '态', '度', '风', '韵', '气', '质', '品', '格', '钰', '瑾',
      '琛', '璞', '琨', '琰', '琮', '璎', '珞', '璨', '璟', '瑜',
      '琦', '琼', '润', '泽', '澜', '沁', '沐', '浴', '洗', '涤',
      '澄', '澈', '湛', '深', '渊', '洋', '沛', '涵', '漪', '涟',
      '波', '潮', '瀚', '海', '江', '河', '湖', '溪', '泉', '源',
      '流', '清', '澈', '澄', '湛', '深', '渊', '洋', '沛', '沐'
    ]

    const neutralChars = [
      '文', '静', '远', '雅', '源', '心', '齐', '慧', '明', '清',
      '安', '秀', '诚', '德', '华', '思', '博', '宁', '和', '平',
      '康', '乐', '福', '祥', '瑞', '吉', '利', '顺', '通', '达',
      '进', '升', '高', '兴', '旺', '荣', '华', '昌', '盛', '光',
      '亮', '新', '美', '好', '优', '良', '佳', '妙', '奇', '凡',
      '众', '超', '群', '卓', '越', '杰', '秀', '精', '英', '才',
      '华', '学', '识', '知', '识', '智', '慧', '聪', '明', '敏',
      '捷', '灵', '活', '创', '新', '开', '拓', '进', '取', '奋',
      '斗', '勤', '奋', '专', '注', '认', '真', '承', '诺', '守',
      '信', '诚', '实', '真', '诚', '善', '良', '友', '爱', '和',
      '睦', '温', '柔', '周', '到', '完', '美', '全', '面', '深',
      '刻', '透', '彻', '精', '细', '微', '妙', '巧', '妙', '子',
      '若', '如', '初', '念', '忆', '惜', '怜', '珍', '宝', '珠',
      '玉', '翡', '翠', '珊', '瑚', '水', '晶', '钻', '石', '金',
      '银', '婉', '约', '娴', '淑', '惠', '贤', '德', '容', '貌',
      '姿', '色', '态', '度', '风', '韵', '气', '质', '品', '格',
      '修', '养', '钰', '瑾', '琛', '璞', '琨', '琰', '琮', '璎',
      '珞', '璨', '璟', '瑜', '琦', '瑶', '琼', '润', '泽', '澜',
      '沁', '沐', '浴', '洗', '涤', '澄', '澈', '湛', '深', '渊',
      '洋', '沛', '涵', '漪', '涟', '波', '潮', '瀚', '海', '江',
      '河', '湖', '溪', '泉', '源', '流', '清', '澈', '澄', '湛'
    ]

    // 计算姓氏长度
    const surnameLength = surname.length
    
    // 根据性别选择字符库（用于随机组合）
    let charPool: string[] = []
    
    if (gender === 'male') {
      charPool = maleChars
    } else if (gender === 'female') {
      charPool = femaleChars
    } else {
      charPool = [...maleChars, ...femaleChars, ...neutralChars]
    }
    
    // 如果选择了偏好，优先选择符合偏好的字符
    if (preferences.length > 0) {
      const preferenceMap: { [key: string]: string[] } = {
        '文雅': ['文', '雅', '诗', '涵', '静', '慧', '清', '秀', '书', '墨', '琴', '棋', '画', '韵', '致', '品', '质', '格', '调', '风', '度', '气', '质', '修', '养', '德', '行', '礼', '仪', '端', '庄'],
        '活泼': ['欣', '悦', '乐', '欢', '笑', '阳', '明', '亮', '开', '朗', '活', '泼', '动', '感', '跳', '跃', '生', '机', '朝', '气', '蓬', '勃', '热', '情', '奔', '放', '自', '由', '无', '拘'],
        '沉稳': ['志', '远', '博', '文', '德', '诚', '安', '宁', '稳', '重', '深', '沉', '内', '敛', '持', '重', '成', '熟', '理', '智', '冷', '静', '从', '容', '淡', '定', '泰', '然', '自', '若'],
        '清新': ['雨', '晴', '桐', '欣', '柔', '雅', '清', '新', '爽', '朗', '透', '明', '纯', '净', '洁', '白', '淡', '雅', '素', '净', '自', '然', '淡', '泊', '简', '约', '素', '雅', '清', '淡'],
        '古典': ['诗', '涵', '文', '雅', '墨', '轩', '博', '远', '古', '典', '典', '雅', '传', '统', '文', '化', '书', '香', '门', '第', '儒', '雅', '风', '范', '文', '人', '墨', '客', '雅', '士'],
        '现代': ['可', '欣', '悦', '乐', '阳', '明', '亮', '新', '时', '尚', '潮', '流', '前', '卫', '创', '新', '革', '新', '进', '步', '发', '展', '未', '来', '科', '技', '智', '能', '数', '字'],
        '诗意': ['诗', '雨', '涵', '雅', '墨', '文', '心', '语', '词', '句', '韵', '律', '意', '境', '情', '怀', '感', '悟', '思', '念', '梦', '想', '幻', '想', '浪', '漫', '唯', '美', '艺', '术'],
        '简洁': ['文', '明', '静', '安', '乐', '欣', '雅', '清', '简', '单', '纯', '粹', '精', '炼', '凝', '练', '干', '净', '利', '落', '直', '接', '明', '了', '清', '晰', '透', '彻', '简', '明'],
        '大气': ['天', '宇', '浩', '瀚', '宏', '伟', '博', '远', '宽', '广', '辽', '阔', '无', '边', '磅', '礴', '雄', '壮', '豪', '迈', '壮', '阔', '宏', '大', '雄', '伟', '壮', '观', '宏', '伟'],
        '温柔': ['柔', '婉', '温', '和', '静', '宁', '雅', '馨', '暖', '心', '体', '贴', '细', '腻', '温', '润', '柔', '和', '温', '柔', '善', '良', '慈', '爱', '关', '怀', '呵', '护', '爱', '护'],
        '阳光': ['阳', '光', '明', '亮', '晨', '曦', '旭', '辉', '日', '照', '灿', '烂', '光', '芒', '闪', '耀', '明', '媚', '温', '暖', '热', '烈', '炽', '热', '火', '热', '热', '情', '活', '力'],
        '智慧': ['智', '慧', '睿', '聪', '明', '敏', '思', '学', '才', '华', '学', '识', '见', '闻', '知', '识', '博', '学', '多', '才', '才', '智', '过', '人', '聪', '颖', '机', '智', '灵', '巧'],
        '勇敢': ['勇', '强', '刚', '毅', '坚', '韧', '豪', '杰', '英', '雄', '无', '畏', '无', '惧', '坚', '强', '不', '屈', '顽', '强', '刚', '强', '果', '敢', '决', '断', '果', '决', '坚', '定'],
        '优雅': ['优', '雅', '贵', '典', '端', '庄', '淑', '娴', '高', '贵', '典', '雅', '雍', '容', '华', '贵', '气', '质', '出', '众', '风', '度', '翩', '翩', '举', '止', '优', '雅', '仪', '态'],
        '自然': ['山', '水', '林', '森', '花', '草', '竹', '梅', '松', '柏', '兰', '菊', '莲', '荷', '桃', '李', '杏', '梨', '樱', '桂', '柳', '杨', '枫', '桐', '石', '岩', '峰', '岭', '溪', '泉'],
        '富贵': ['富', '贵', '荣', '华', '昌', '盛', '兴', '旺', '发', '达', '繁', '荣', '兴', '隆', '昌', '隆', '兴', '盛', '繁', '华', '锦', '绣', '前', '程', '光', '明', '前', '途', '无', '量'],
        '健康': ['健', '康', '安', '全', '强', '壮', '福', '寿', '长', '寿', '平', '安', '顺', '利', '吉', '祥', '如', '意', '幸', '福', '快', '乐', '愉', '快', '舒', '适', '安', '逸', '惬', '意']
      }

      const preferredChars: string[] = []
      preferences.forEach(pref => {
        if (preferenceMap[pref]) {
          preferredChars.push(...preferenceMap[pref])
        }
      })

      if (preferredChars.length > 0) {
        // 优先使用偏好字符，但保留一些其他字符以保证多样性
        const preferredPool = charPool.filter(char => preferredChars.includes(char))
        const otherPool = charPool.filter(char => !preferredChars.includes(char))
        // 70% 偏好字符，30% 其他字符
        charPool = [
          ...preferredPool,
          ...otherPool.slice(0, Math.floor(otherPool.length * 0.3))
        ]
        if (charPool.length === 0) {
          charPool = preferredChars
        }
      }
    }
    
    // 根据生辰八字调整字符优先级
    if (neededWuxing.length > 0 && birthDate) {
      // 将字符库按五行分类
      const wuxingChars: { [key: string]: string[] } = {
        '金': [], '木': [], '水': [], '火': [], '土': []
      }
      
      charPool.forEach(char => {
        const wuxing = getCharWuxing(char)
        if (wuxing && wuxingChars[wuxing]) {
          wuxingChars[wuxing].push(char)
        }
      })
      
      // 优先使用需要补充的五行字符
      const priorityChars: string[] = []
      neededWuxing.forEach(wuxing => {
        priorityChars.push(...wuxingChars[wuxing])
      })
      
      // 其他字符
      const otherChars = charPool.filter(char => {
        const wuxing = getCharWuxing(char)
        return !wuxing || !neededWuxing.includes(wuxing)
      })
      
      // 重新组合：60% 需要补充的五行字符，40% 其他字符
      if (priorityChars.length > 0) {
        charPool = [
          ...priorityChars,
          ...otherChars.slice(0, Math.floor(otherChars.length * 0.4))
        ]
      }
    }

    // 根据选择的名字长度和姓氏长度生成（一个字一个字随机组合）
    const selectedNames: string[] = []
    const nameCount = 10
    const usedNames = new Set<string>() // 用于去重
    
    // 计算名字部分的长度：总长度 - 姓氏长度 = 名字部分长度
    const getNamePartLength = (totalLength: number): number => {
      return totalLength - surnameLength
    }
    
    // 从字符库中随机选择字符组合生成名字
    const generateRandomName = (charCount: number): string => {
      const shuffled = [...charPool].sort(() => Math.random() - 0.5)
      let name = ''
      const usedChars = new Set<string>() // 避免同一名字中重复字符
      
      for (let i = 0; i < charCount && i < shuffled.length; i++) {
        // 尝试找到一个未使用的字符
        let attempts = 0
        let char = shuffled[i]
        while (usedChars.has(char) && attempts < shuffled.length) {
          const nextIndex = (i + attempts + 1) % shuffled.length
          char = shuffled[nextIndex]
          attempts++
        }
        if (!usedChars.has(char)) {
          name += char
          usedChars.add(char)
        }
      }
      return name
    }
    
    if (length === 'any') {
      // 任意长度：根据姓氏长度动态分配
      if (surnameLength === 1) {
        // 单姓：30% 2字（1字名），40% 3字（2字名），20% 4字（3字名），10% 自定义
        const count2 = Math.floor(nameCount * 0.3)
        const count3 = Math.floor(nameCount * 0.4)
        const count4 = Math.floor(nameCount * 0.2)
        const customCount = nameCount - count2 - count3 - count4

        // 生成2字名字（1字名）
        for (let i = 0; i < count2; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(1)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 生成3字名字（2字名）
        for (let i = 0; i < count3; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(2)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 生成4字名字（3字名）
        for (let i = 0; i < count4; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(3)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 自定义组合（1-3个字随机）
        for (let i = 0; i < customCount; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            const charCount = Math.floor(Math.random() * 3) + 1 // 1-3个字
            name = generateRandomName(charCount)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }
      } else {
        // 复姓：30% 3字（1字名），40% 4字（2字名），20% 5字（3字名），10% 自定义
        const count3 = Math.floor(nameCount * 0.3)
        const count4 = Math.floor(nameCount * 0.4)
        const count5 = Math.floor(nameCount * 0.2)
        const customCount = nameCount - count3 - count4 - count5

        // 生成3字名字（1字名）
        for (let i = 0; i < count3; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(1)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 生成4字名字（2字名）
        for (let i = 0; i < count4; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(2)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 生成5字名字（3字名）
        for (let i = 0; i < count5; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(3)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 自定义组合（1-3个字随机）
        for (let i = 0; i < customCount; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            const charCount = Math.floor(Math.random() * 3) + 1 // 1-3个字
            name = generateRandomName(charCount)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }
      }

      // 如果名字不够，继续生成直到达到数量
      while (selectedNames.length < nameCount) {
        let attempts = 0
        let name = ''
        const charCount = surnameLength === 1 
          ? Math.floor(Math.random() * 3) + 1 // 1-3个字
          : Math.floor(Math.random() * 3) + 1 // 1-3个字
        while (attempts < 50) {
          name = generateRandomName(charCount)
          const fullName = surname + name
          if (!usedNames.has(fullName)) {
            selectedNames.push(fullName)
            usedNames.add(fullName)
            break
          }
          attempts++
        }
        if (attempts >= 50) break // 避免无限循环
      }
    } else {
      // 指定长度
      const totalLength = parseInt(length)
      const namePartLength = getNamePartLength(totalLength)
      
      if (namePartLength <= 0) {
        // 如果姓氏长度已经达到或超过总长度，只返回姓氏
        return [surname]
      }
      
      // 根据名字部分长度，一个字一个字随机组合
      for (let i = 0; i < nameCount; i++) {
        let attempts = 0
        let name = ''
        while (attempts < 50) {
          name = generateRandomName(namePartLength)
          const fullName = surname + name
          if (!usedNames.has(fullName)) {
            selectedNames.push(fullName)
            usedNames.add(fullName)
            break
          }
          attempts++
        }
        if (attempts >= 50) break // 避免无限循环
      }
    }

    // 打乱顺序并去重
    const uniqueNames = Array.from(new Set(selectedNames))
    return uniqueNames.sort(() => Math.random() - 0.5).slice(0, nameCount)
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      alert(`已复制：${name}`)
    }).catch(() => {
      alert('复制失败，请手动复制')
    })
  }

  return (
    <div className="name-generator-page">
      <div className="name-generator-header">
        <button className="back-button" onClick={onBack}>
          ← 返回
        </button>
        <h1>✨ 智能取名</h1>
        <p className="subtitle">根据您的信息，为您推荐合适的名字</p>
      </div>

      <div className={`name-generator-content ${generatedNames.length > 0 ? 'has-results' : ''}`}>
        <div className="input-section">
          <div className="input-group">
            <label>姓氏 *</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="请输入姓氏"
              className="name-input"
              maxLength={5}
            />
          </div>

          <div className="input-group">
            <label>性别</label>
            <div className="gender-buttons">
              <button
                className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >
                👦 男
              </button>
              <button
                className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                👧 女
              </button>
              <button
                className={`gender-btn ${gender === '' ? 'active' : ''}`}
                onClick={() => setGender('')}
              >
                🌈 不限
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>出生日期（可选）</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="name-input"
            />
          </div>

          <div className="input-group">
            <label>出生时间（可选）</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="name-input"
            />
          </div>

          <div className="input-group">
            <label>名字长度</label>
            <div className="length-buttons">
              <button
                className={`length-btn ${nameLength === 'any' ? 'active' : ''}`}
                onClick={() => setNameLength('any')}
              >
                任意
              </button>
              {surname.length <= 1 && (
                <button
                  className={`length-btn ${nameLength === '2' ? 'active' : ''}`}
                  onClick={() => setNameLength('2')}
                >
                  两个字
                </button>
              )}
              <button
                className={`length-btn ${nameLength === '3' ? 'active' : ''}`}
                onClick={() => setNameLength('3')}
                disabled={surname.length > 1 && nameLength === '2'}
              >
                三个字
              </button>
              <button
                className={`length-btn ${nameLength === '4' ? 'active' : ''}`}
                onClick={() => setNameLength('4')}
              >
                四个字
              </button>
            </div>
            {surname.length > 1 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                复姓从三个字开始
              </p>
            )}
          </div>

          <div className="input-group">
            <label>个人偏好（可多选）</label>
            <div className="preference-tags">
              {preferenceOptions.map(pref => (
                <button
                  key={pref}
                  className={`preference-tag ${preferences.includes(pref) ? 'active' : ''}`}
                  onClick={() => togglePreference(pref)}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={generateNames}
            disabled={!surname.trim() || isGenerating}
          >
            {isGenerating ? '生成中...' : '✨ 开始生成名字'}
          </button>
        </div>

        {generatedNames.length > 0 && (
          <div className="results-section">
            <h2>为您推荐的名字</h2>
            <div className="names-grid">
              {generatedNames.map((name, index) => (
                <div key={index} className="name-card">
                  <div className="name-text">{name}</div>
                  <button
                    className="copy-btn"
                    onClick={() => copyName(name)}
                    title="复制"
                  >
                    📋
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NameGenerator

