import type { AppPage } from '../types/appPage'

const SUBTITLES: Record<AppPage, string> = {
  tarot: '探索塔罗牌的奥秘',
  name: '智能取名服务',
  horoscope: '星座运势 · 娱乐参考',
  almanac: '今日黄历 · 传统历法',
  cybermerit: '赛博积德 · 功德无量',
  bazi: '八字算命 · 传统命理',
  divination: '抽签求签 · 心诚则灵',
  dream: '梦境解析 · 探索潜意识',
  fengshui: '风水罗盘 · 方位吉凶',
  auspicious: '择日吉时 · 良辰吉日',
  numberenergy: '数字能量 · 数字命理',
  luckycolor: '每日幸运色 · 色彩能量',
  qimen: '奇门遁甲 · 传统预测术',
  nametest: '姓名测试 · 五格数理',
  ziwei: '紫微斗数 · 传统命理学',
  shengxiao: '生肖配对 · 相合相冲',
}

export function getPageSubtitle(page: AppPage): string {
  return SUBTITLES[page] ?? SUBTITLES.tarot
}
