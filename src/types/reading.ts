export type ReadingType = 
  | 'general'      // 综合占卜
  | 'daily'        // 今日运势
  | 'love'         // 姻缘感情
  | 'wealth'       // 钱财财运
  | 'career'       // 职场事业
  | 'health'       // 健康
  | 'study'        // 学业
  | 'relationship' // 人际关系
  | 'custom'       // 自定义

export interface ReadingTypeOption {
  id: ReadingType
  name: string
  icon: string
  description: string
}

export const readingTypesEn: ReadingTypeOption[] = [
  { id: 'general', name: 'General', icon: '🔮', description: 'Guidance across every area of life' },
  { id: 'daily', name: 'Today', icon: '🌟', description: 'Overall energy and what to watch for today' },
  { id: 'love', name: 'Love', icon: '💕', description: 'Romance, relationships, and emotional bonds' },
  { id: 'wealth', name: 'Wealth', icon: '💰', description: 'Money, investments, and financial flow' },
  { id: 'career', name: 'Career', icon: '💼', description: 'Work, ambition, and professional direction' },
  { id: 'health', name: 'Health', icon: '🌿', description: 'Physical wellbeing and inner balance' },
  { id: 'study', name: 'Study', icon: '📚', description: 'Learning, exams, and intellectual growth' },
  { id: 'relationship', name: 'Relationships', icon: '🤝', description: 'Family, friends, and social dynamics' },
  { id: 'custom', name: 'Custom', icon: '✨', description: 'A question shaped by you' },
]

export const readingTypes: ReadingTypeOption[] = [
  {
    id: 'general',
    name: '综合占卜',
    icon: '🔮',
    description: '全面了解生活各个方面的指引'
  },
  {
    id: 'daily',
    name: '今日运势',
    icon: '🌟',
    description: '了解今天的整体运势和注意事项'
  },
  {
    id: 'love',
    name: '姻缘感情',
    icon: '💕',
    description: '关于爱情、感情关系的指引'
  },
  {
    id: 'wealth',
    name: '钱财财运',
    icon: '💰',
    description: '财运、投资、财务方面的建议'
  },
  {
    id: 'career',
    name: '职场事业',
    icon: '💼',
    description: '工作、事业发展的指引'
  },
  {
    id: 'health',
    name: '健康',
    icon: '🌿',
    description: '身体健康和身心平衡的建议'
  },
  {
    id: 'study',
    name: '学业',
    icon: '📚',
    description: '学习、考试、知识获取的指引'
  },
  {
    id: 'relationship',
    name: '人际关系',
    icon: '🤝',
    description: '与家人、朋友、同事的关系'
  },
  {
    id: 'custom',
    name: '自定义',
    icon: '✨',
    description: '针对特定问题的占卜'
  }
]

export function getReadingTypes(isEnglish = false): ReadingTypeOption[] {
  return isEnglish ? readingTypesEn : readingTypes
}

