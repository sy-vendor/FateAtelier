// 梦境符号解析数据库
export interface DreamSymbol {
  keywords: string[] // 关键词
  meaning: string // 基本含义
  positive?: string // 正面解读
  negative?: string // 负面解读
  advice?: string // 建议
  category: string // 类别
}

export const dreamSymbols: DreamSymbol[] = [
  // 动物类
  {
    keywords: ['蛇', '蟒蛇', '毒蛇'],
    meaning: '蛇在梦中通常代表变化、智慧或潜在的威胁',
    positive: '可能预示你将获得智慧或经历重要的转变',
    negative: '也可能暗示你面临某种威胁或需要警惕',
    advice: '注意观察生活中的变化，保持警觉但不要过度担心',
    category: '动物'
  },
  {
    keywords: ['龙', '神龙', '飞龙'],
    meaning: '龙象征力量、权威和好运',
    positive: '预示你将获得强大的力量或遇到贵人相助',
    negative: '也可能表示你感到压力过大',
    advice: '把握机会，展现你的能力和领导力',
    category: '动物'
  },
  {
    keywords: ['鱼', '金鱼', '大鱼', '小鱼'],
    meaning: '鱼代表财富、机遇和潜意识',
    positive: '预示财运亨通，机会即将到来',
    negative: '也可能暗示你错过了某些机会',
    advice: '保持敏锐的观察力，抓住身边的机遇',
    category: '动物'
  },
  {
    keywords: ['猫', '黑猫', '白猫'],
    meaning: '猫象征独立、神秘和直觉',
    positive: '预示你的直觉将帮助你做出正确决定',
    negative: '也可能暗示你感到孤独或需要独立',
    advice: '相信你的直觉，但也要保持与他人的联系',
    category: '动物'
  },
  {
    keywords: ['狗', '小狗', '大狗'],
    meaning: '狗代表忠诚、友谊和保护',
    positive: '预示你将得到朋友的支持和保护',
    negative: '也可能暗示你感到缺乏安全感',
    advice: '珍惜身边的友谊，寻求他人的帮助',
    category: '动物'
  },
  {
    keywords: ['鸟', '飞鸟', '小鸟', '大鸟', '鸟群'],
    meaning: '鸟象征自由、灵性和消息',
    positive: '预示你将获得自由或收到好消息',
    negative: '也可能暗示你感到被束缚',
    advice: '追求内心的自由，保持对未来的希望',
    category: '动物'
  },
  {
    keywords: ['老虎', '猛虎', '虎'],
    meaning: '虎代表力量、勇气和威严',
    positive: '预示你将展现强大的力量和勇气',
    negative: '也可能暗示你面临强大的对手',
    advice: '保持自信和勇气，但也要谨慎行事',
    category: '动物'
  },
  {
    keywords: ['马', '白马', '黑马', '骏马'],
    meaning: '马象征自由、力量和前进',
    positive: '预示你将获得自由或事业顺利',
    negative: '也可能暗示你感到被束缚',
    advice: '保持前进的动力，追求你的目标',
    category: '动物'
  },
  {
    keywords: ['猪', '小猪', '大猪'],
    meaning: '猪代表财富、满足和懒惰',
    positive: '预示财运亨通或生活富足',
    negative: '也可能暗示你过于安逸或懒惰',
    advice: '享受生活的同时，也要保持努力',
    category: '动物'
  },
  {
    keywords: ['老鼠', '耗子'],
    meaning: '老鼠代表机敏、生存和担忧',
    positive: '预示你将凭借机智度过难关',
    negative: '也可能暗示你感到担忧或不安',
    advice: '保持警觉，但不要过度焦虑',
    category: '动物'
  },

  // 自然类
  {
    keywords: ['水', '大海', '河流', '湖泊', '洪水', '雨水'],
    meaning: '水代表情感、潜意识和变化',
    positive: '预示情感丰富或即将发生积极变化',
    negative: '也可能暗示情感波动或情绪失控',
    advice: '关注自己的情感状态，保持内心平静',
    category: '自然'
  },
  {
    keywords: ['火', '大火', '火焰', '燃烧'],
    meaning: '火象征激情、能量和破坏',
    positive: '预示你将充满激情和能量',
    negative: '也可能暗示愤怒或冲突',
    advice: '控制你的情绪，将能量用于积极的方向',
    category: '自然'
  },
  {
    keywords: ['山', '高山', '爬山', '山峰'],
    meaning: '山代表挑战、目标和稳定',
    positive: '预示你将克服困难，达到目标',
    negative: '也可能暗示你面临巨大挑战',
    advice: '保持耐心和毅力，逐步攀登',
    category: '自然'
  },
  {
    keywords: ['树', '大树', '森林', '树木'],
    meaning: '树象征成长、生命和根基',
    positive: '预示你将获得成长或建立稳固基础',
    negative: '也可能暗示你感到缺乏根基',
    advice: '关注个人成长，建立稳固的基础',
    category: '自然'
  },
  {
    keywords: ['花', '花朵', '鲜花', '花海'],
    meaning: '花代表美丽、爱情和新生',
    positive: '预示爱情顺利或新的开始',
    negative: '也可能暗示美丽短暂或需要珍惜',
    advice: '珍惜当下的美好，把握新的机会',
    category: '自然'
  },
  {
    keywords: ['月亮', '满月', '新月', '月光'],
    meaning: '月亮象征情感、直觉和女性',
    positive: '预示直觉敏锐或情感丰富',
    negative: '也可能暗示情绪波动',
    advice: '相信你的直觉，关注情感需求',
    category: '自然'
  },
  {
    keywords: ['太阳', '阳光', '日出', '日落'],
    meaning: '太阳代表活力、成功和光明',
    positive: '预示事业成功或充满活力',
    negative: '也可能暗示过度暴露或压力',
    advice: '保持积极态度，但也要注意休息',
    category: '自然'
  },
  {
    keywords: ['雨', '下雨', '暴雨', '小雨'],
    meaning: '雨象征净化、情感和变化',
    positive: '预示情感得到净化或新的开始',
    negative: '也可能暗示情绪低落',
    advice: '接受变化，让情感得到释放',
    category: '自然'
  },
  {
    keywords: ['雪', '下雪', '雪花', '雪地'],
    meaning: '雪代表纯洁、冷静和隐藏',
    positive: '预示内心纯洁或冷静思考',
    negative: '也可能暗示情感冷漠或隐藏',
    advice: '保持内心的纯洁，但也要表达情感',
    category: '自然'
  },
  {
    keywords: ['风', '大风', '狂风', '微风'],
    meaning: '风象征变化、消息和自由',
    positive: '预示即将发生变化或收到消息',
    negative: '也可能暗示不稳定或混乱',
    advice: '适应变化，保持灵活性',
    category: '自然'
  },

  // 人物类
  {
    keywords: ['死人', '尸体', '死亡', '去世'],
    meaning: '死亡在梦中通常代表结束和新生',
    positive: '预示旧的事物结束，新的开始即将到来',
    negative: '也可能暗示你害怕失去或改变',
    advice: '接受变化，让过去成为过去',
    category: '人物'
  },
  {
    keywords: ['婴儿', '小孩', '孩子'],
    meaning: '婴儿代表新的开始、纯真和潜力',
    positive: '预示新的开始或新的机会',
    negative: '也可能暗示你感到不成熟或需要照顾',
    advice: '拥抱新的开始，保持纯真的心',
    category: '人物'
  },
  {
    keywords: ['老人', '长者', '老人'],
    meaning: '老人象征智慧、经验和指导',
    positive: '预示你将获得智慧或得到指导',
    negative: '也可能暗示你感到衰老或疲惫',
    advice: '寻求长者的建议，积累经验',
    category: '人物'
  },
  {
    keywords: ['陌生人', '不认识的人'],
    meaning: '陌生人代表未知、新机会或内心的一部分',
    positive: '预示新的机会或新的关系',
    negative: '也可能暗示你感到不安或陌生',
    advice: '保持开放的心态，接受新的事物',
    category: '人物'
  },
  {
    keywords: ['鬼', '鬼魂', '幽灵', '阴魂'],
    meaning: '鬼魂代表过去、恐惧或未解决的事情',
    positive: '预示你将面对并解决过去的问题',
    negative: '也可能暗示你被过去困扰',
    advice: '面对过去的恐惧，寻求解决之道',
    category: '人物'
  },
  {
    keywords: ['恋人', '爱人', '男朋友', '女朋友'],
    meaning: '恋人代表爱情、关系和情感需求',
    positive: '预示爱情顺利或关系和谐',
    negative: '也可能暗示关系问题或情感需求',
    advice: '关注情感关系，表达你的爱意',
    category: '人物'
  },
  {
    keywords: ['父母', '父亲', '母亲', '爸妈'],
    meaning: '父母代表权威、保护和指导',
    positive: '预示你将得到保护或指导',
    negative: '也可能暗示你感到被控制或依赖',
    advice: '寻求支持，但也要保持独立',
    category: '人物'
  },
  {
    keywords: ['朋友', '好友', '伙伴'],
    meaning: '朋友代表支持、友谊和合作',
    positive: '预示你将得到朋友的支持',
    negative: '也可能暗示你感到孤独',
    advice: '珍惜友谊，寻求朋友的支持',
    category: '人物'
  },
  {
    keywords: ['同学', '同窗', '同班', '同班同学', '室友'],
    meaning: '同学代表青春、回忆和成长',
    positive: '预示你将回忆起美好的时光或重新联系旧友',
    negative: '也可能暗示你怀念过去或感到时光流逝',
    advice: '珍惜当下的时光，保持与同学的联系',
    category: '人物'
  },
  {
    keywords: ['老师', '教师', '导师', '班主任', '教授'],
    meaning: '老师代表指导、知识和权威',
    positive: '预示你将得到指导或学到新知识',
    negative: '也可能暗示你感到被评判或需要指导',
    advice: '寻求导师的帮助，保持学习的态度',
    category: '人物'
  },
  {
    keywords: ['同事', '工作伙伴', '上司', '老板'],
    meaning: '同事代表工作关系、合作和竞争',
    positive: '预示工作顺利或得到同事支持',
    negative: '也可能暗示工作压力或人际关系问题',
    advice: '处理好工作关系，保持专业态度',
    category: '人物'
  },

  // 建筑类
  {
    keywords: ['房子', '房屋', '家', '住宅'],
    meaning: '房子代表自我、安全感和内心',
    positive: '预示你将找到安全感或了解自己',
    negative: '也可能暗示你感到不安全或迷失',
    advice: '关注内心世界，建立安全感',
    category: '建筑'
  },
  {
    keywords: ['学校', '教室', '上课', '校园', '操场', '图书馆', '食堂', '宿舍', '教学楼'],
    meaning: '学校代表学习、成长和挑战',
    positive: '预示你将学到新知识或成长',
    negative: '也可能暗示你感到压力或挑战',
    advice: '保持学习的态度，接受挑战',
    category: '建筑'
  },
  {
    keywords: ['医院', '看病', '医生'],
    meaning: '医院代表治疗、康复和关注健康',
    positive: '预示你将得到治疗或康复',
    negative: '也可能暗示健康问题或需要关注',
    advice: '关注身体健康，寻求治疗',
    category: '建筑'
  },
  {
    keywords: ['寺庙', '道观', '教堂', '拜佛'],
    meaning: '宗教场所代表精神、信仰和寻求',
    positive: '预示你将找到精神寄托或答案',
    negative: '也可能暗示你感到迷茫或需要指引',
    advice: '寻求精神指引，保持信仰',
    category: '建筑'
  },
  {
    keywords: ['电梯', '坐电梯', '电梯'],
    meaning: '电梯代表上升、下降或变化',
    positive: '预示你将上升或进步',
    negative: '也可能暗示你感到下降或退步',
    advice: '关注生活中的变化，把握方向',
    category: '建筑'
  },
  {
    keywords: ['楼梯', '爬楼梯', '下楼'],
    meaning: '楼梯代表进步、努力和过程',
    positive: '预示你将通过努力获得进步',
    negative: '也可能暗示你感到困难或疲惫',
    advice: '保持努力，一步一步前进',
    category: '建筑'
  },

  // 物品类
  {
    keywords: ['钱', '金钱', '钞票', '财富'],
    meaning: '钱代表价值、资源和安全感',
    positive: '预示财运亨通或获得资源',
    negative: '也可能暗示你担心财务或价值问题',
    advice: '合理管理财务，关注真正的价值',
    category: '物品'
  },
  {
    keywords: ['车', '汽车', '开车', '车祸'],
    meaning: '车代表前进、控制和方向',
    positive: '预示你将顺利前进或掌控方向',
    negative: '也可能暗示你失去控制或方向',
    advice: '保持对生活的掌控，明确方向',
    category: '物品'
  },
  {
    keywords: ['手机', '电话', '打电话'],
    meaning: '手机代表沟通、联系和消息',
    positive: '预示你将收到消息或建立联系',
    negative: '也可能暗示你感到孤立或需要沟通',
    advice: '保持与他人的联系，积极沟通',
    category: '物品'
  },
  {
    keywords: ['钥匙', '开锁', '锁'],
    meaning: '钥匙代表机会、解决方案和开启',
    positive: '预示你将找到解决方案或获得机会',
    negative: '也可能暗示你感到被困或需要答案',
    advice: '寻找解决方案，把握机会',
    category: '物品'
  },
  {
    keywords: ['镜子', '照镜子'],
    meaning: '镜子代表自我认知、真实和反思',
    positive: '预示你将更了解自己或看清真相',
    negative: '也可能暗示你害怕面对自己',
    advice: '勇敢面对自己，接受真实的自己',
    category: '物品'
  },
  {
    keywords: ['书', '读书', '看书'],
    meaning: '书代表知识、智慧和理解',
    positive: '预示你将获得知识或智慧',
    negative: '也可能暗示你感到困惑或需要学习',
    advice: '保持学习，寻求知识和智慧',
    category: '物品'
  },
  {
    keywords: ['刀', '刀子', '刀具', '被刀'],
    meaning: '刀代表分离、决定和伤害',
    positive: '预示你将做出重要决定或切断联系',
    negative: '也可能暗示你感到被伤害或威胁',
    advice: '谨慎做决定，避免伤害他人',
    category: '物品'
  },
  {
    keywords: ['衣服', '穿衣', '脱衣', '新衣服'],
    meaning: '衣服代表形象、身份和伪装',
    positive: '预示你将改变形象或展现新身份',
    negative: '也可能暗示你感到伪装或需要改变',
    advice: '展现真实的自己，但也要注意形象',
    category: '物品'
  },
  {
    keywords: ['鞋子', '穿鞋', '新鞋'],
    meaning: '鞋子代表方向、道路和基础',
    positive: '预示你将找到方向或走上新路',
    negative: '也可能暗示你感到迷失或基础不稳',
    advice: '明确方向，建立稳固的基础',
    category: '物品'
  },

  // 动作类
  {
    keywords: ['飞', '飞翔', '飞行', '飞起来'],
    meaning: '飞行代表自由、成功和超越',
    positive: '预示你将获得自由或超越限制',
    negative: '也可能暗示你感到不切实际',
    advice: '追求自由，但也要脚踏实地',
    category: '动作'
  },
  {
    keywords: ['跑', '跑步', '逃跑', '追'],
    meaning: '跑代表努力、逃避或追求',
    positive: '预示你将通过努力达到目标',
    negative: '也可能暗示你感到压力或逃避',
    advice: '保持努力，但不要逃避问题',
    category: '动作'
  },
  {
    keywords: ['掉', '掉落', '摔', '跌倒'],
    meaning: '掉落代表失败、失去控制或下降',
    positive: '预示你将放下负担或重新开始',
    negative: '也可能暗示你感到失败或失控',
    advice: '接受失败，重新站起来',
    category: '动作'
  },
  {
    keywords: ['吃', '吃饭', '吃东西'],
    meaning: '吃代表满足、吸收和需求',
    positive: '预示你将得到满足或吸收知识',
    negative: '也可能暗示你感到不满足或贪婪',
    advice: '满足基本需求，但不要过度',
    category: '动作'
  },
  {
    keywords: ['哭', '哭泣', '流泪'],
    meaning: '哭代表释放、情感和悲伤',
    positive: '预示你将释放情感或得到净化',
    negative: '也可能暗示你感到悲伤或需要释放',
    advice: '允许自己表达情感，寻求支持',
    category: '动作'
  },
  {
    keywords: ['笑', '大笑', '开心'],
    meaning: '笑代表快乐、满足和积极',
    positive: '预示你将感到快乐或满足',
    negative: '也可能暗示你感到虚假的快乐',
    advice: '保持积极态度，享受快乐',
    category: '动作'
  },
  {
    keywords: ['打架', '战斗', '冲突'],
    meaning: '打架代表冲突、竞争和解决',
    positive: '预示你将解决冲突或获得胜利',
    negative: '也可能暗示你面临冲突或竞争',
    advice: '面对冲突，寻求和平解决',
    category: '动作'
  },
  {
    keywords: ['结婚', '婚礼', '新娘', '新郎'],
    meaning: '结婚代表结合、承诺和新的开始',
    positive: '预示你将建立新的关系或承诺',
    negative: '也可能暗示你感到压力或束缚',
    advice: '珍惜关系，履行承诺',
    category: '动作'
  },
  {
    keywords: ['考试', '考试', '考试'],
    meaning: '考试代表考验、评估和压力',
    positive: '预示你将通过考验或获得认可',
    negative: '也可能暗示你感到压力或担心',
    advice: '做好准备，保持自信',
    category: '动作'
  },
  {
    keywords: ['工作', '上班', '办公室'],
    meaning: '工作代表责任、成就和压力',
    positive: '预示你将获得成就或承担责任',
    negative: '也可能暗示你感到压力或负担',
    advice: '平衡工作与生活，保持努力',
    category: '动作'
  }
]

// 根据梦境内容查找相关符号
export function findDreamSymbols(dreamContent: string): DreamSymbol[] {
  const found: DreamSymbol[] = []
  const content = dreamContent.toLowerCase()
  
  for (const symbol of dreamSymbols) {
    for (const keyword of symbol.keywords) {
      if (content.includes(keyword.toLowerCase())) {
        if (!found.find(s => s.keywords[0] === symbol.keywords[0])) {
          found.push(symbol)
        }
        break
      }
    }
  }
  
  return found
}

// 生成梦境解析
export function interpretDream(dreamContent: string): {
  symbols: DreamSymbol[]
  overall: string
  advice: string
} {
  const symbols = findDreamSymbols(dreamContent)
  
  if (symbols.length === 0) {
    return {
      symbols: [],
      overall: '你的梦境内容较为独特，可能代表你内心的深层想法或潜意识的信息。建议你关注梦境中的情感和感受，这些往往比具体内容更重要。',
      advice: '保持对梦境的记录和反思，随着时间的推移，你可能会发现其中的意义。'
    }
  }
  
  // 生成综合解析
  const categories = symbols.map(s => s.category)
  const uniqueCategories = [...new Set(categories)]
  
  let overall = '根据你梦境中的符号，'
  if (symbols.length === 1) {
    overall += `主要涉及${symbols[0].category}类的内容。${symbols[0].meaning}`
  } else {
    overall += `涉及${uniqueCategories.join('、')}等多个方面。这些符号共同反映了你当前的心理状态和潜在的变化。`
  }
  
  // 生成建议
  const advices = symbols.map(s => s.advice).filter(Boolean)
  const advice = advices.length > 0 
    ? advices.join(' ') 
    : '保持对生活的观察和反思，梦境往往是内心状态的反映。'
  
  return {
    symbols,
    overall,
    advice
  }
}

