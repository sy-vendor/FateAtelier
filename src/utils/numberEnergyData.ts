export const NUMBER_ENERGY_BRAND = '数脉玄机'
export const NUMBER_ENERGY_BRAND_EN = 'Numera Pulse'

export type NumberType = 'phone' | 'plate' | 'id' | 'other'

export interface NumberTypeOption {
  id: NumberType
  name: string
  icon: string
  description: string
  placeholder: string
}

export const NUMBER_TYPES: NumberTypeOption[] = [
  { id: 'phone', name: '手机号', icon: '📱', description: '分析手机号码的能量', placeholder: '请输入11位手机号' },
  { id: 'plate', name: '车牌号', icon: '🚗', description: '分析车牌号码的能量', placeholder: '请输入车牌号（如：京A12345）' },
  { id: 'id', name: '身份证号', icon: '🆔', description: '分析身份证号码的能量', placeholder: '请输入18位身份证号' },
  { id: 'other', name: '其他数字', icon: '🔢', description: '分析任意数字的能量', placeholder: '请输入数字' },
]

export interface NumberMeaning {
  meaning: string
  energy: 'positive' | 'neutral' | 'negative'
  wuxing?: string
  direction?: string
  color?: string
  personality?: string
  career?: string
  health?: string
  relationship?: string
  wealth?: string
  detail?: string
}

export interface CombinationInfo {
  meaning: string
  energy: 'positive' | 'neutral' | 'negative'
  detail?: string
  suggestion?: string
}

export const NUMBER_MEANINGS: Record<string, NumberMeaning> = {
  '0': { meaning: '无限、圆满、起点', energy: 'neutral', wuxing: '土', direction: '中', color: '白色', personality: '包容、开放、无限可能', career: '适合创新领域、自由职业', health: '注意循环系统', relationship: '善于包容，人际关系和谐', wealth: '财运平稳，需要主动创造', detail: '0代表无限和起点，象征新的开始和无限可能。在数字能量中，0具有放大其他数字能量的作用。' },
  '1': { meaning: '独立、领导、创新', energy: 'positive', wuxing: '水', direction: '北', color: '黑色、深蓝', personality: '独立自主、有领导力、创新思维', career: '适合管理、创业、科技领域', health: '注意肾脏和泌尿系统', relationship: '独立性强，需要个人空间', wealth: '财运佳，适合投资和创业', detail: '1是数字之首，代表独立、领导力和创新精神。拥有1能量的人通常具有强烈的自我意识和领导才能。' },
  '2': { meaning: '合作、平衡、和谐', energy: 'positive', wuxing: '土', direction: '西南', color: '黄色、橙色', personality: '温和、合作、善于平衡', career: '适合合作、协调、服务行业', health: '注意脾胃和消化系统', relationship: '善于合作，人际关系和谐', wealth: '财运平稳，适合合作投资', detail: '2代表合作与平衡，象征和谐与配合。拥有2能量的人通常善于合作，能够平衡各方关系。' },
  '3': { meaning: '创意、表达、社交', energy: 'positive', wuxing: '火', direction: '东', color: '红色、紫色', personality: '创意丰富、表达力强、社交活跃', career: '适合艺术、传媒、创意行业', health: '注意心脏和血液循环', relationship: '社交活跃，人际关系广泛', wealth: '财运波动，适合创意变现', detail: '3代表创意与表达，象征社交与活力。拥有3能量的人通常创意丰富，表达能力强，社交活跃。' },
  '4': { meaning: '稳定、务实、秩序', energy: 'neutral', wuxing: '木', direction: '东南', color: '绿色', personality: '稳重、务实、注重秩序', career: '适合建筑、工程、管理', health: '注意肝胆和神经系统', relationship: '稳定可靠，但可能过于保守', wealth: '财运稳定，适合稳健投资', detail: '4代表稳定与秩序，象征务实与可靠。虽然在某些文化中被视为不吉利，但4也代表稳定和坚实的基础。' },
  '5': { meaning: '自由、变化、冒险', energy: 'neutral', wuxing: '土', direction: '中', color: '黄色、棕色', personality: '自由、变化、喜欢冒险', career: '适合销售、旅游、自由职业', health: '注意脾胃和消化系统', relationship: '自由随性，需要个人空间', wealth: '财运变化大，需要灵活应对', detail: '5代表自由与变化，象征冒险与探索。拥有5能量的人通常喜欢自由，适应能力强，但需要保持稳定。' },
  '6': { meaning: '责任、关爱、家庭', energy: 'positive', wuxing: '金', direction: '西北', color: '金色、白色', personality: '负责任、关爱他人、重视家庭', career: '适合教育、医疗、服务行业', health: '注意呼吸系统和皮肤', relationship: '重视家庭，人际关系和谐', wealth: '财运稳定，适合长期投资', detail: '6代表责任与关爱，象征家庭与和谐。拥有6能量的人通常负责任，关爱他人，重视家庭关系。' },
  '7': { meaning: '智慧、神秘、内省', energy: 'positive', wuxing: '金', direction: '西', color: '银色、白色', personality: '智慧、神秘、喜欢内省', career: '适合研究、分析、咨询', health: '注意呼吸系统和皮肤', relationship: '深度思考，人际关系需要理解', wealth: '财运平稳，适合知识变现', detail: '7代表智慧与神秘，象征内省与深度。拥有7能量的人通常智慧超群，喜欢深度思考，具有神秘感。' },
  '8': { meaning: '财富、权力、成功', energy: 'positive', wuxing: '土', direction: '东北', color: '金色、黄色', personality: '追求成功、有权力欲、务实', career: '适合商业、金融、管理', health: '注意脾胃和消化系统', relationship: '重视事业，人际关系以利益为主', wealth: '财运极佳，适合投资和创业', detail: '8代表财富与成功，象征权力与成就。拥有8能量的人通常追求成功，有强烈的权力欲和财富欲。' },
  '9': { meaning: '完成、智慧、博爱', energy: 'positive', wuxing: '火', direction: '南', color: '红色、紫色', personality: '智慧、博爱、追求完美', career: '适合教育、慈善、领导', health: '注意心脏和血液循环', relationship: '博爱无私，人际关系广泛', wealth: '财运良好，适合慈善和投资', detail: '9代表完成与智慧，象征博爱与圆满。拥有9能量的人通常智慧超群，具有博爱精神，追求完美。' },
}

export const COMBINATION_MEANINGS: Record<string, CombinationInfo> = {
  '11': { meaning: '双一：领导力强，独立自主', energy: 'positive', detail: '双1组合代表极强的领导力和独立性，适合创业和管理。', suggestion: '适合担任领导职务，发挥独立创新能力。' },
  '22': { meaning: '双二：合作共赢，和谐平衡', energy: 'positive', detail: '双2组合代表极强的合作能力和平衡感，适合团队合作。', suggestion: '适合合作项目，发挥协调和平衡能力。' },
  '33': { meaning: '双三：创意无限，表达力强', energy: 'positive', detail: '双3组合代表极强的创意和表达能力，适合艺术创作。', suggestion: '适合创意工作，发挥表达和社交能力。' },
  '44': { meaning: '双四：稳定可靠，务实踏实', energy: 'neutral', detail: '双4组合代表极强的稳定性和务实性，适合基础建设。', suggestion: '适合稳健发展，注重基础和秩序。' },
  '55': { meaning: '双五：变化多端，自由灵活', energy: 'neutral', detail: '双5组合代表极强的变化和适应能力，需要保持稳定。', suggestion: '适合灵活应对，但需要建立稳定的基础。' },
  '66': { meaning: '双六：责任三倍，关爱无限', energy: 'positive', detail: '双6组合代表极强的责任感和关爱精神，适合服务他人。', suggestion: '适合服务行业，发挥责任和关爱能力。' },
  '77': { meaning: '双七：智慧超群，神秘深邃', energy: 'positive', detail: '双7组合代表极强的智慧和深度思考能力，适合研究分析。', suggestion: '适合研究领域，发挥智慧和深度思考能力。' },
  '88': { meaning: '双八：财富丰盈，权力显赫', energy: 'positive', detail: '双8组合代表极强的财富和权力能量，适合商业投资。', suggestion: '适合商业投资，发挥财富和权力优势。' },
  '99': { meaning: '双九：智慧圆满，博爱无私', energy: 'positive', detail: '双9组合代表极强的智慧和博爱精神，适合教育和慈善。', suggestion: '适合教育和慈善，发挥智慧和博爱精神。' },
  '123': { meaning: '顺子：步步高升，顺利发展', energy: 'positive', detail: '123顺子代表循序渐进，步步高升，发展顺利。', suggestion: '适合稳步发展，循序渐进，不可急于求成。' },
  '321': { meaning: '倒顺：回归本源，重新开始', energy: 'neutral', detail: '321倒顺代表回归本源，重新开始，需要反思和调整。', suggestion: '适合反思过去，重新规划，寻找新的方向。' },
  '888': { meaning: '三连八：财富三倍，大富大贵', energy: 'positive', detail: '三连8代表极强的财富能量，大富大贵的象征。', suggestion: '适合大额投资，发挥财富优势，但需注意平衡。' },
  '666': { meaning: '三连六：责任三倍，关爱无限', energy: 'positive', detail: '三连6代表极强的责任和关爱能量，适合服务他人。', suggestion: '适合服务行业，发挥责任和关爱能力，但需注意自我。' },
  '999': { meaning: '三连九：智慧三倍，圆满成功', energy: 'positive', detail: '三连9代表极强的智慧和圆满能量，适合教育和领导。', suggestion: '适合教育和领导，发挥智慧和博爱精神，追求圆满。' },
  '108': { meaning: '一零八：圆满成功，功德圆满', energy: 'positive', detail: '108在佛教中代表圆满，象征功德圆满和成功。', suggestion: '适合追求圆满和成功，注重积累和功德。' },
  '168': { meaning: '一路发：一路发财，持续成功', energy: 'positive', detail: '168谐音"一路发"，代表持续的成功和财富。', suggestion: '适合持续投资，保持成功势头，一路发展。' },
  '520': { meaning: '我爱你：情感和谐，关系美满', energy: 'positive', detail: '520谐音"我爱你"，代表情感和谐和关系美满。', suggestion: '适合情感关系，注重沟通和和谐，表达爱意。' },
}

export type NumberEnergyPhase = 'type' | 'input' | 'analyze' | 'revealed'

export const NUMBER_ENERGY_PHASE_STEP: Record<NumberEnergyPhase, 1 | 2 | 3 | 4> = {
  type: 1,
  input: 2,
  analyze: 3,
  revealed: 4,
}

export type EnergyLevel = 'excellent' | 'good' | 'average' | 'poor'

export function energyTagClass(energy: 'positive' | 'neutral' | 'negative'): string {
  if (energy === 'positive') return 'tag tag--good'
  if (energy === 'negative') return 'tag tag--bad'
  return 'tag tag--muted'
}

export function levelTagClass(level: EnergyLevel): string {
  if (level === 'excellent') return 'tag tag--good'
  if (level === 'good') return 'tag tag--info'
  if (level === 'average') return 'tag tag--ok'
  return 'tag tag--bad'
}

export function getLevelColor(level: EnergyLevel): string {
  if (level === 'excellent') return '#4ade80'
  if (level === 'good') return '#60a5fa'
  if (level === 'average') return '#fbbf24'
  return '#f87171'
}
