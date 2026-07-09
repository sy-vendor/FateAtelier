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

export function getPageSubtitle(page: AppPage): string {
  return SUBTITLES[page] ?? SUBTITLES.tarot
}
