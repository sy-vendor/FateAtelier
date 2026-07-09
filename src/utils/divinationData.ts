export const DIVINATION_BRAND = '竹语灵签'
export const DIVINATION_BRAND_EN = 'Bamboo Oracle'

export const CATEGORY_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'career', label: '事业' },
  { value: 'love', label: '感情' },
  { value: 'health', label: '健康' },
  { value: 'wealth', label: '财运' },
  { value: 'travel', label: '出行' },
] as const

export type DivinationCategory = (typeof CATEGORY_OPTIONS)[number]['value']

export type DetailField =
  | 'home'
  | 'business'
  | 'travel'
  | 'marriage'
  | 'wealth'
  | 'health'
  | 'lawsuit'
  | 'lostItem'
  | 'searchPerson'
  | 'relocation'
  | 'career'
  | 'pregnancy'
  | 'livestock'
  | 'disputes'
  | 'illness'
  | 'transaction'
  | 'traveler'

export const DETAIL_FIELD_LABELS: Record<DetailField, string> = {
  home: '家宅',
  business: '生意',
  travel: '出行',
  marriage: '婚姻',
  wealth: '求财',
  health: '求医',
  lawsuit: '诉讼',
  lostItem: '失物',
  searchPerson: '寻人',
  relocation: '移徙',
  career: '功名',
  pregnancy: '六甲',
  livestock: '六畜',
  disputes: '口舌',
  illness: '疾病',
  transaction: '交易',
  traveler: '行人',
}

/** 所问类别 → 详批字段 */
export const CATEGORY_DETAIL_KEYS: Record<string, DetailField[]> = {
  career: ['career', 'business', 'transaction'],
  love: ['marriage', 'disputes', 'home'],
  health: ['health', 'illness', 'pregnancy'],
  wealth: ['wealth', 'transaction', 'business'],
  travel: ['travel', 'traveler', 'relocation'],
}

/** 未选类别时，按签等展示的默认分项 */
export const DEFAULT_DETAIL_BY_LEVEL: Record<string, DetailField[]> = {
  上上: ['career', 'wealth', 'marriage', 'travel'],
  上: ['career', 'wealth', 'marriage', 'health'],
  中上: ['career', 'wealth', 'health', 'home'],
  中: ['career', 'wealth', 'health', 'disputes'],
  中下: ['health', 'career', 'wealth', 'disputes'],
  下: ['health', 'lawsuit', 'disputes', 'career'],
  下下: ['health', 'illness', 'lawsuit', 'disputes'],
}

export const LEVEL_META: Record<
  string,
  { tone: string; timing: string; auspicious: string[]; cautions: string[]; poemTone: string }
> = {
  上上: {
    tone: '气运极盛，万事亨通',
    timing: '近期即可见成效，宜趁势而为',
    auspicious: ['把握良机，积极行动', '以诚待人，广结善缘', '重要决定可择近日推进'],
    cautions: ['忌骄傲自满', '忌得意忘形而轻敌'],
    poemTone: '开篇即显天地开张、机缘具足之象，主所求大吉',
  },
  上: {
    tone: '顺遂向好，贵人暗助',
    timing: '一至两月内渐入佳境',
    auspicious: ['稳步推进计划', '主动沟通合作', '适时展示才华'],
    cautions: ['忌急躁冒进', '忌贪多求全'],
    poemTone: '签诗多示福泽绵长、时运相助，主吉多凶少',
  },
  中上: {
    tone: '平稳向上，渐入佳境',
    timing: '需些许耐心，秋冬易见转机',
    auspicious: ['持续积累，厚积薄发', '做好眼前事', '保持学习精进'],
    cautions: ['忌半途而废', '忌好高骛远'],
    poemTone: '签诗示进退有度，守中有进，宜稳中求进',
  },
  中: {
    tone: '平中见机，守成为上',
    timing: '宜观察三五日后再定大计',
    auspicious: ['夯实基础，循序渐进', '多听取他人意见', '以小步试探代替豪赌'],
    cautions: ['忌冲动决策', '忌与人争一时长短'],
    poemTone: '签诗示中庸之道，非大吉亦非大凶，贵在自持',
  },
  中下: {
    tone: '稍有阻滞，宜守不宜攻',
    timing: '暂缓重大变动，待情势明朗',
    auspicious: ['反躬自省，调整策略', '保守理财，量入为出', '多行善积德以转运'],
    cautions: ['忌强行推进', '忌口舌争执', '忌高风险投资'],
    poemTone: '签诗示前路有波折，宜以柔克刚、以退为进',
  },
  下: {
    tone: '运势低迷，宜静不宜动',
    timing: '当前以休整为主，转机在后段',
    auspicious: ['韬光养晦，积蓄力量', '重大决定前先征询可信之人', '修身养性，等待时机'],
    cautions: ['忌重大投资或跳槽', '忌与人结怨', '忌远行冒险'],
    poemTone: '签诗示险阻在前，宜谨慎行事、先保自身',
  },
  下下: {
    tone: '凶象显露，宜守势避险',
    timing: '短期内不宜有大动作，先渡难关',
    auspicious: ['守本分、安其心', '求助于可信之人', '从最小可行之事做起'],
    cautions: ['忌孤注一掷', '忌与人硬碰', '忌忽视身心信号'],
    poemTone: '签诗示艰难考验，然凶中有转机，守正可渐脱困',
  },
}

export type DrawPhase = 'intent' | 'shaking' | 'revealing' | 'done'

export const DRAW_PHASE_STEP: Record<DrawPhase, 1 | 2 | 3 | 4> = {
  intent: 1,
  shaking: 2,
  revealing: 3,
  done: 4,
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label ?? '建议'
}

export function getLevelColor(level: string): string {
  switch (level) {
    case '上上':
      return '#e85d5d'
    case '上':
      return '#e89a3c'
    case '中上':
      return '#d4b04a'
    case '中':
      return '#6dbf7a'
    case '中下':
      return '#5ba8c9'
    case '下':
      return '#9aa3ad'
    case '下下':
      return '#7a818a'
    default:
      return '#888'
  }
}
