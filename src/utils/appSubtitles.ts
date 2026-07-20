import type { AppPage } from '../types/appPage'

const SUBTITLES: Record<AppPage, string> = {
  tarot: '星穹秘典 · 静心抽牌，解读命运',
  horoscope: '星轨观测站 · 十二宫运势指引',
  almanac: '岁时纪历 · 顺天时察宜忌',
  cybermerit: '赛博积德 · 电子福田积功德',
  bazi: '四柱玄机 · 录辰排柱窥命途',
  divination: '竹语灵签 · 静心默念得解',
  dream: '梦渊解语 · 月华述梦探幽径',
  fengshui: '罗盘玄枢 · 旋盘察八方辨吉凶',
  auspicious: '吉日良辰 · 择事定日推吉时',
  numberenergy: '数脉玄机 · 析号码五行气运',
  luckycolor: '霓彩灵枢 · 感应今日色谱',
  qimen: '奇门玄枢 · 择时定局察吉凶',
  nametest: '名理灵鉴 · 五格三才鉴姓名',
  ziwei: '紫微星垣 · 安星布宫照命途',
  shengxiao: '生肖缘谱 · 合参测缘论配对',
}

const SUBTITLES_EN: Record<AppPage, string> = {
  tarot: 'Starlit Arcana · Draw with intention',
  horoscope: 'Celestial Observatory · Guidance for every sign',
  almanac: 'Seasonal Almanac · Move with the rhythm of the day',
  cybermerit: 'Cyber Merit · A quiet moment of digital practice',
  bazi: 'Four Pillars · Read the pattern of your birth',
  divination: 'Bamboo Oracle · Ask sincerely and draw a sign',
  dream: 'Dream Guide · Follow the symbols beneath the surface',
  fengshui: 'Compass Studio · Explore balance in every direction',
  auspicious: 'Favorable Timing · Choose a date with intention',
  numberenergy: 'Number Patterns · Discover the energy in digits',
  luckycolor: 'Color Oracle · Meet today’s inspiring palette',
  qimen: 'Qi Men Compass · Read timing, place, and possibility',
  nametest: 'Name Mirror · Explore form, sound, and strokes',
  ziwei: 'Purple Star Astrology · Map the palaces of destiny',
  shengxiao: 'Zodiac Bonds · Explore chemistry and connection',
}

export function getPageSubtitle(page: AppPage, isEnglish = false): string {
  return (isEnglish ? SUBTITLES_EN : SUBTITLES)[page]
}
