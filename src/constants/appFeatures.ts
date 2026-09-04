import type { FeaturePage } from '../types/appPage'

export interface AppFeature {
  page: FeaturePage
  icon: string
  name: string
  seoTitle: string
  description: string
  nameEn: string
  seoTitleEn: string
  descriptionEn: string
}

export const APP_FEATURES: AppFeature[] = [
  { page: 'tarot', icon: '🔮', name: '塔罗占卜', seoTitle: '免费在线塔罗占卜', description: '免费无广告在线抽塔罗：单牌或三牌时空阵，含牌义与行动建议，无需注册。', nameEn: 'Tarot Reading', seoTitleEn: 'Free Online Tarot Reading', descriptionEn: 'Free, ad-free tarot draws—one or three cards—with meanings and guidance. No signup.' },
  { page: 'horoscope', icon: '✦', name: '星座运势', seoTitle: '今日星座运势查询', description: '免费查看十二星座今日运势，无广告、无需注册。', nameEn: 'Horoscope', seoTitleEn: 'Daily Horoscope', descriptionEn: 'Free daily horoscope for all signs—ad-free, no account needed.' },
  { page: 'almanac', icon: '📅', name: '今日黄历', seoTitle: '今日黄历宜忌查询', description: '免费查看今日农历、宜忌、吉时与冲煞，无广告打扰。', nameEn: 'Daily Almanac', seoTitleEn: 'Chinese Daily Almanac', descriptionEn: 'Free Chinese almanac with lunar date, dos and don’ts, and hours—ad-free.' },
  { page: 'cybermerit', icon: '🙏', name: '赛博积德', seoTitle: '在线赛博积德', description: '免费敲木鱼、上香与放生，轻量解压，无广告。', nameEn: 'Cyber Merit', seoTitleEn: 'Cyber Merit Practice', descriptionEn: 'Free virtual wooden fish and calm rituals—ad-free, no signup.' },
  { page: 'bazi', icon: '☯', name: '八字算命', seoTitle: '免费八字排盘', description: '免费生成四柱八字与五行解读，无广告、无需注册。', nameEn: 'BaZi', seoTitleEn: 'Free BaZi Chart', descriptionEn: 'Free Four Pillars chart with five-element notes—ad-free, no account.' },
  { page: 'divination', icon: '🎋', name: '抽签求签', seoTitle: '在线抽签求签', description: '免费在线抽签并查看白话解签，无广告、无需注册。', nameEn: 'Fortune Sticks', seoTitleEn: 'Online Fortune Sticks', descriptionEn: 'Free fortune-stick draws with clear advice—ad-free, no signup.' },
  { page: 'dream', icon: '💭', name: '梦境解析', seoTitle: '免费周公解梦', description: '免费解梦查意象，无广告、无需注册。', nameEn: 'Dream Guide', seoTitleEn: 'Dream Meaning Guide', descriptionEn: 'Free dream symbolism guide—ad-free, no account required.' },
  { page: 'fengshui', icon: '🧭', name: '风水罗盘', seoTitle: '在线风水罗盘', description: '免费使用在线风水罗盘查看方位与布局参考，无广告。', nameEn: 'Feng Shui Compass', seoTitleEn: 'Online Feng Shui Compass', descriptionEn: 'Free online feng shui compass—ad-free layout tips.' },
  { page: 'auspicious', icon: '⏰', name: '择日吉时', seoTitle: '择日吉时查询', description: '免费筛选吉日吉时，无广告、无需注册。', nameEn: 'Auspicious Dates', seoTitleEn: 'Auspicious Date Finder', descriptionEn: 'Free auspicious date finder—ad-free, no signup.' },
  { page: 'numberenergy', icon: '🔢', name: '数字能量', seoTitle: '数字能量测试', description: '免费解读数字能量倾向，无广告打扰。', nameEn: 'Number Energy', seoTitleEn: 'Number Energy Reading', descriptionEn: 'Free playful number-energy reading—ad-free.' },
  { page: 'luckycolor', icon: '🎨', name: '每日幸运色', seoTitle: '今日幸运色测试', description: '免费查看每日幸运色与穿搭灵感，无广告。', nameEn: 'Lucky Color', seoTitleEn: 'Today’s Lucky Color', descriptionEn: 'Free daily lucky color—ad-free, no account.' },
  { page: 'qimen', icon: '⚡', name: '奇门遁甲', seoTitle: '奇门遁甲在线排盘', description: '免费在线奇门排盘，无广告、无需注册。', nameEn: 'Qi Men Dun Jia', seoTitleEn: 'Qi Men Dun Jia Chart', descriptionEn: 'Free Qi Men chart tool—ad-free, no signup.' },
  { page: 'nametest', icon: '📝', name: '姓名测试', seoTitle: '免费姓名测试', description: '免费查看姓名笔画与五格趣味解读，无广告。', nameEn: 'Name Reading', seoTitleEn: 'Chinese Name Reading', descriptionEn: 'Free Chinese name reading—ad-free, no account.' },
  { page: 'ziwei', icon: '⭐', name: '紫微斗数', seoTitle: '紫微斗数在线排盘', description: '免费生成紫微命盘与宫位解读，无广告、无需注册。', nameEn: 'Zi Wei Dou Shu', seoTitleEn: 'Zi Wei Dou Shu Chart', descriptionEn: 'Free Zi Wei chart—ad-free, no signup required.' },
  { page: 'shengxiao', icon: '🐲', name: '生肖配对', seoTitle: '十二生肖配对', description: '免费查看生肖相处参考，无广告打扰。', nameEn: 'Zodiac Match', seoTitleEn: 'Chinese Zodiac Compatibility', descriptionEn: 'Free Chinese zodiac compatibility—ad-free.' },
]
