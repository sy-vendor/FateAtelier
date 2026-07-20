import type { AppPage } from '../types/appPage'

export interface AppFeature {
  page: AppPage
  icon: string
  name: string
  seoTitle: string
  description: string
  nameEn: string
  seoTitleEn: string
  descriptionEn: string
}

export const APP_FEATURES: AppFeature[] = [
  { page: 'tarot', icon: '🔮', name: '塔罗占卜', seoTitle: '免费在线塔罗占卜', description: '在线抽取单张或过去、现在、未来三张塔罗牌，获取牌义与行动建议。', nameEn: 'Tarot Reading', seoTitleEn: 'Free Online Tarot Reading', descriptionEn: 'Draw one or three tarot cards for insight, meanings, and practical guidance.' },
  { page: 'horoscope', icon: '✦', name: '星座运势', seoTitle: '今日星座运势查询', description: '查看十二星座今日运势，了解感情、事业、财运与幸运提示。', nameEn: 'Horoscope', seoTitleEn: 'Daily Horoscope', descriptionEn: 'Explore today’s outlook for love, career, money, and luck across all zodiac signs.' },
  { page: 'almanac', icon: '📅', name: '今日黄历', seoTitle: '今日黄历宜忌查询', description: '在线查看今日农历、宜忌、吉时与冲煞信息。', nameEn: 'Daily Almanac', seoTitleEn: 'Chinese Daily Almanac', descriptionEn: 'Check the lunar date, favorable activities, auspicious hours, and daily guidance.' },
  { page: 'cybermerit', icon: '🙏', name: '赛博积德', seoTitle: '在线赛博积德', description: '敲木鱼、上香与放生的轻量解压互动体验。', nameEn: 'Cyber Merit', seoTitleEn: 'Cyber Merit Practice', descriptionEn: 'Relax with virtual wooden fish, incense, and compassionate release rituals.' },
  { page: 'bazi', icon: '☯', name: '八字算命', seoTitle: '免费八字排盘', description: '输入出生时间，查看四柱八字、五行分布与命理解读。', nameEn: 'BaZi', seoTitleEn: 'Free BaZi Chart', descriptionEn: 'Generate your Four Pillars chart and explore the balance of the five elements.' },
  { page: 'divination', icon: '🎋', name: '抽签求签', seoTitle: '在线抽签求签', description: '静心诚问，在线抽取签文并查看白话解签与行动建议。', nameEn: 'Fortune Sticks', seoTitleEn: 'Online Fortune Sticks', descriptionEn: 'Draw a fortune stick and receive a clear interpretation with practical advice.' },
  { page: 'dream', icon: '💭', name: '梦境解析', seoTitle: '免费周公解梦', description: '输入梦境关键词，查找常见意象的象征含义与心理提示。', nameEn: 'Dream Guide', seoTitleEn: 'Dream Meaning Guide', descriptionEn: 'Explore the symbolism and emotional meaning of common dream imagery.' },
  { page: 'fengshui', icon: '🧭', name: '风水罗盘', seoTitle: '在线风水罗盘', description: '使用在线风水罗盘查看方位与布局参考。', nameEn: 'Feng Shui Compass', seoTitleEn: 'Online Feng Shui Compass', descriptionEn: 'Explore directions and receive practical Feng Shui layout guidance.' },
  { page: 'auspicious', icon: '⏰', name: '择日吉时', seoTitle: '择日吉时查询', description: '按事项与日期筛选适合的日子和时辰。', nameEn: 'Auspicious Dates', seoTitleEn: 'Auspicious Date Finder', descriptionEn: 'Find favorable dates and hours for important activities.' },
  { page: 'numberenergy', icon: '🔢', name: '数字能量', seoTitle: '数字能量测试', description: '解读手机号、生日等数字组合的趣味能量倾向。', nameEn: 'Number Energy', seoTitleEn: 'Number Energy Reading', descriptionEn: 'Discover playful energy patterns in phone numbers, birthdays, and more.' },
  { page: 'luckycolor', icon: '🎨', name: '每日幸运色', seoTitle: '今日幸运色测试', description: '根据日期生成每日幸运色与穿搭灵感。', nameEn: 'Lucky Color', seoTitleEn: 'Today’s Lucky Color', descriptionEn: 'Find your daily lucky color and outfit inspiration.' },
  { page: 'qimen', icon: '⚡', name: '奇门遁甲', seoTitle: '奇门遁甲在线排盘', description: '在线起局并查看九宫、八门等盘面信息。', nameEn: 'Qi Men Dun Jia', seoTitleEn: 'Qi Men Dun Jia Chart', descriptionEn: 'Create a Qi Men chart and explore its palaces, gates, and patterns.' },
  { page: 'nametest', icon: '📝', name: '姓名测试', seoTitle: '免费姓名测试', description: '输入中文姓名，查看笔画、五格与趣味解读。', nameEn: 'Name Reading', seoTitleEn: 'Chinese Name Reading', descriptionEn: 'Explore the strokes, five grids, and playful meaning of a Chinese name.' },
  { page: 'ziwei', icon: '⭐', name: '紫微斗数', seoTitle: '紫微斗数在线排盘', description: '输入出生信息，生成紫微斗数命盘与宫位解读。', nameEn: 'Zi Wei Dou Shu', seoTitleEn: 'Zi Wei Dou Shu Chart', descriptionEn: 'Generate a Zi Wei astrology chart and explore its palaces.' },
  { page: 'shengxiao', icon: '🐲', name: '生肖配对', seoTitle: '十二生肖配对', description: '查看两个生肖的性格互动、相处优势与建议。', nameEn: 'Zodiac Match', seoTitleEn: 'Chinese Zodiac Compatibility', descriptionEn: 'Explore compatibility, strengths, and advice for two Chinese zodiac signs.' },
]
