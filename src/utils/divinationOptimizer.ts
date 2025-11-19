// 签文解读优化工具 - 减少重复话术，生成更个性化的解读

/**
 * 优化签文解读，去除重复话术，生成更个性化的内容
 */
export function optimizeInterpretation(
  originalText: string,
  _stickTitle: string,
  stickLevel: string
): string {
  let optimized = originalText

  // 根据签文标题和等级生成一个种子，用于选择同义词变化
  const seed = (_stickTitle.charCodeAt(0) + stickLevel.charCodeAt(0)) % 100

  // 替换重复话术为更个性化的表达
  optimized = optimized
    .replace(/宜敬神拜佛，可保家宅安宁/g, '保持虔诚之心，家庭和睦安宁')
    .replace(/宜扩大经营，可获大利/g, '把握市场机遇，拓展业务范围')
    .replace(/宜向东方或高处寻找/g, '可在东方或高处方向寻找')
    .replace(/宜向北方或水边寻找/g, '可在北方或水边方向寻找')
    .replace(/宜寻良医，配合治疗，可早日康复/g, '寻求专业医疗，积极配合治疗')
    .replace(/宜谨言慎行，避免争执，可保平安，无口舌之灾/g, '保持冷静理智，避免不必要的争执')
    .replace(/宜悉心教导，可成材，前途光明/g, '耐心引导教育，培养良好品格')
    .replace(/宜努力进取，可获成功，前途光明/g, '持续努力，把握机会')
    .replace(/宜悉心照料，可健康成长，前途光明/g, '细心呵护，关注成长')
    .replace(/宜把握时机，可获成功，前途光明/g, '把握机遇，积极行动')
    .replace(/宜善待家人，可获幸福，前途光明/g, '关爱家人，营造和谐氛围')
    .replace(/宜择吉日搬迁，可获平安，家运昌隆/g, '选择合适时机，做好充分准备')
    .replace(/宜注意保养，可顺利生产，母子平安/g, '注意身体调理，保持良好状态')
    .replace(/宜精心照料，可获丰收，六畜兴旺/g, '用心管理，科学饲养')
    .replace(/有贵人相助，一路平安，事事顺遂/g, '有贵人相助，进展顺利')
    .replace(/可获平安，事事顺遂，早日归来/g, '平安顺利，早日归来')
    .replace(/可获平安，事事顺遂/g, '平安顺利')
    .replace(/可获成功，前途光明/g, '有望成功')
    .replace(/可获成功/g, '有望达成')
    .replace(/前途光明/g, '前景可期')
    .replace(/家运昌隆/g, '家运兴旺')
    .replace(/生意兴隆/g, '经营顺利')
    .replace(/财源广进/g, '财运亨通')
    .replace(/富贵荣华/g, '生活富足')
    .replace(/荣华富贵/g, '生活富足')
    // 更多重复话术替换
    .replace(/天时地利人和/g, '时机成熟，条件具备')
    .replace(/单身者将遇佳偶/g, '单身者有望遇到合适的人')
    .replace(/有伴者关系和谐/g, '有伴者关系融洽')
    .replace(/可成好事/g, '有望达成')
    .replace(/百年好合/g, '长久幸福')
    .replace(/正财偏财皆旺/g, '财运整体向好')
    .replace(/投资理财有收益/g, '理财投资有回报')
    .replace(/宜把握机会/g, '把握时机')
    .replace(/宜把握良机/g, '把握良机')
    .replace(/有理有据/g, '理由充分')
    .replace(/宜积极应对/g, '积极应对')
    .replace(/可获胜诉/g, '有望胜诉')
    .replace(/正义得伸/g, '正义得以伸张')
    .replace(/有望找回/g, '可能找回')
    .replace(/可获消息/g, '可能获得消息')
    .replace(/需要时间/g, '需要耐心等待')
    .replace(/可获小利/g, '可能获得小利')
    .replace(/可获小成/g, '可能获得小成')
    .replace(/可获小收/g, '可能获得小收')
    .replace(/可获小收益/g, '可能获得小收益')
    .replace(/可获小胜/g, '可能获得小胜')
    .replace(/可逐渐康复/g, '将逐渐康复')
    .replace(/可顺利生产/g, '将顺利生产')
    .replace(/母子平安/g, '母子健康平安')
    .replace(/六畜兴旺/g, '六畜健康')
    .replace(/无口舌之灾/g, '避免口舌是非')
    .replace(/身体健康/g, '身体康健')
    .replace(/交易顺利/g, '交易顺畅')
    .replace(/早日归来/g, '尽快归来')
    // 替换重复的"渐佳"、"渐入佳境"等模式
    .replace(/渐佳，渐入佳境/g, () => {
      const options = ['逐步改善', '稳步提升', '持续向好', '日渐好转', '逐步好转']
      return options[seed % options.length]
    })
    .replace(/渐入佳境/g, () => {
      const options = ['逐步改善', '稳步提升', '持续向好', '日渐好转', '逐步好转']
      return options[(seed + 1) % options.length]
    })
    .replace(/步步高升有前程/g, () => {
      const options = ['稳步上升，前景良好', '持续进步，未来可期', '逐步提升，前景光明', '稳步发展，未来可期', '持续向好，前景良好']
      return options[(seed + 2) % options.length]
    })
    .replace(/日积月累到成功/g, () => {
      const options = ['持续积累，终将成功', '逐步积累，达成目标', '长期积累，获得成就', '慢慢积累，实现目标', '逐步积累，取得成功']
      return options[(seed + 3) % options.length]
    })
    .replace(/不用愁/g, () => {
      const options = ['无需担忧', '不必担心', '可以放心', '无需忧虑', '不必忧虑']
      return options[(seed + 4) % options.length]
    })
    .replace(/有前程/g, () => {
      const options = ['前景良好', '未来可期', '前途可期', '前景光明', '未来光明']
      return options[(seed + 5) % options.length]
    })
    .replace(/到成功/g, () => {
      const options = ['取得成功', '获得成功', '实现目标', '达成目标', '获得成就']
      return options[(seed + 6) % options.length]
    })
    .replace(/可能获得小成/g, () => {
      const options = ['有望取得进展', '可能有所收获', '有望获得成果', '可能取得进步', '有望获得进展']
      return options[(seed + 7) % options.length]
    })
    .replace(/可能获得小利/g, () => {
      const options = ['有望获得收益', '可能有所收获', '有望获得回报', '可能取得收益', '有望获得利润']
      return options[(seed + 8) % options.length]
    })
    .replace(/需要持续努力/g, () => {
      const options = ['需要坚持不懈', '需要持之以恒', '需要持续付出', '需要不断努力', '需要坚持努力']
      return options[(seed + 9) % options.length]
    })
    .replace(/需要耐心等待/g, () => {
      const options = ['需要耐心', '需要等待时机', '需要保持耐心', '需要等待', '需要耐心等待']
      return options[(seed + 10) % options.length]
    })
    .replace(/将逐渐康复/g, () => {
      const options = ['会逐渐好转', '将逐步恢复', '会慢慢好转', '将逐步改善', '会逐渐恢复']
      return options[(seed + 11) % options.length]
    })
    .replace(/把握时机/g, () => {
      const options = ['抓住机会', '把握机会', '抓住时机', '把握机遇', '抓住机遇']
      return options[(seed + 12) % options.length]
    })
    .replace(/积极应对/g, () => {
      const options = ['主动应对', '积极处理', '主动处理', '积极面对', '主动面对']
      return options[(seed + 13) % options.length]
    })
    .replace(/保持冷静理智/g, () => {
      const options = ['保持冷静', '保持理智', '保持清醒', '保持冷静', '保持理性']
      return options[(seed + 14) % options.length]
    })
    .replace(/避免不必要的争执/g, () => {
      const options = ['避免争执', '避免冲突', '避免矛盾', '避免纠纷', '避免争吵']
      return options[(seed + 15) % options.length]
    })
    // 替换"天时地利"等重复模式
    .replace(/天时地利/g, () => {
      const options = ['时机有利', '条件有利', '时机成熟', '条件具备', '时机良好']
      return options[(seed + 16) % options.length]
    })
    // 替换更多重复模式，增加变化
    .replace(/单身者需要时间/g, () => {
      const options = ['单身者需要等待', '单身者需要耐心', '单身者需要时间', '单身者需要等待时机', '单身者需要保持耐心']
      return options[(seed + 17) % options.length]
    })
    .replace(/有伴者关系稳定/g, () => {
      const options = ['有伴者关系融洽', '有伴者关系和谐', '有伴者关系稳定', '有伴者关系和睦', '有伴者关系良好']
      return options[(seed + 18) % options.length]
    })
    .replace(/良缘可期/g, () => {
      const options = ['良缘可期', '良缘有望', '良缘将至', '良缘可待', '良缘有望']
      return options[(seed + 19) % options.length]
    })
    .replace(/财源稳定/g, () => {
      const options = ['财源稳定', '财运稳定', '收入稳定', '财源平稳', '财运平稳']
      return options[(seed + 20) % options.length]
    })
    .replace(/投资理财需谨慎/g, () => {
      const options = ['投资理财需谨慎', '理财投资需谨慎', '投资需谨慎', '理财需谨慎', '投资理财要谨慎']
      return options[(seed + 21) % options.length]
    })
    .replace(/病情稳定/g, () => {
      const options = ['病情稳定', '状况稳定', '情况稳定', '状态稳定', '病情平稳']
      return options[(seed + 22) % options.length]
    })
    .replace(/配合治疗/g, () => {
      const options = ['配合治疗', '积极配合治疗', '配合医疗', '配合医生', '积极配合']
      return options[(seed + 23) % options.length]
    })
    .replace(/人口平安/g, () => {
      const options = ['人口平安', '家人平安', '家人健康', '人口健康', '家人安康']
      return options[(seed + 24) % options.length]
    })
    .replace(/远行有利/g, () => {
      const options = ['远行有利', '出行有利', '旅行有利', '远行顺利', '出行顺利']
      return options[(seed + 25) % options.length]
    })
    .replace(/新居有利/g, () => {
      const options = ['新居有利', '新居顺利', '新居吉利', '新居有利', '新居吉祥']
      return options[(seed + 26) % options.length]
    })
    .replace(/考试顺利/g, () => {
      const options = ['考试顺利', '考试有利', '考试有望', '考试顺利', '考试有望']
      return options[(seed + 27) % options.length]
    })
    .replace(/母子健康/g, () => {
      const options = ['母子健康', '母子平安', '母子安康', '母子健康平安', '母子平安健康']
      return options[(seed + 28) % options.length]
    })
    .replace(/饲养有利/g, () => {
      const options = ['饲养有利', '饲养顺利', '饲养有望', '饲养有利', '饲养顺利']
      return options[(seed + 29) % options.length]
    })
    .replace(/买卖有利/g, () => {
      const options = ['买卖有利', '交易有利', '买卖顺利', '交易顺利', '买卖有望']
      return options[(seed + 30) % options.length]
    })
    // 替换重复的句子结构
    .replace(/健康聪明，宜悉心教导，可成材/g, () => {
      const options = ['健康聪明，需要耐心引导，有望成材', '健康聪明，悉心教导，可成材', '健康聪明，耐心培养，有望成才', '健康聪明，悉心引导，可成材', '健康聪明，耐心教导，有望成材']
      return options[(seed + 31) % options.length]
    })
    .replace(/学业稳定，宜努力进取/g, () => {
      const options = ['学业稳定，需要努力进取', '学业稳定，努力进取', '学业稳定，需要持续努力', '学业稳定，积极进取', '学业稳定，需要不断努力']
      return options[(seed + 32) % options.length]
    })
    .replace(/健康活泼，宜悉心照料/g, () => {
      const options = ['健康活泼，需要悉心照料', '健康活泼，悉心照料', '健康活泼，需要细心呵护', '健康活泼，细心照料', '健康活泼，需要精心照料']
      return options[(seed + 33) % options.length]
    })
    .replace(/家庭和睦，宜善待家人/g, () => {
      const options = ['家庭和睦，需要善待家人', '家庭和睦，善待家人', '家庭和睦，需要关爱家人', '家庭和睦，关爱家人', '家庭和睦，需要呵护家人']
      return options[(seed + 34) % options.length]
    })
    .replace(/事业需要稳步前进/g, () => {
      const options = ['事业需要稳步前进', '事业需要持续努力', '事业需要坚持不懈', '事业需要持之以恒', '事业需要持续付出']
      return options[(seed + 35) % options.length]
    })
    // 替换重复的结尾模式
    .replace(/，不用愁。$/g, () => {
      const options = ['，无需担忧。', '，不必担心。', '，可以放心。', '，无需忧虑。', '，不必忧虑。']
      return options[(seed + 36) % options.length]
    })
    .replace(/，需要时间。$/g, () => {
      const options = ['，需要耐心等待。', '，需要等待时机。', '，需要保持耐心。', '，需要等待。', '，需要耐心。']
      return options[(seed + 37) % options.length]
    })
    .replace(/，需要持续努力。$/g, () => {
      const options = ['，需要坚持不懈。', '，需要持之以恒。', '，需要持续付出。', '，需要不断努力。', '，需要坚持努力。']
      return options[(seed + 38) % options.length]
    })

  // 根据签文等级调整语气
  if (stickLevel === '上上' || stickLevel === '上') {
    optimized = optimized
      .replace(/宜/g, '可以')
      .replace(/可/g, '将')
      .replace(/需要/g, '建议')
  } else if (stickLevel === '下' || stickLevel === '下下') {
    optimized = optimized
      .replace(/宜/g, '建议')
      .replace(/可/g, '需')
      .replace(/将/g, '可能')
  }

  // 去除多余的重复词汇和标点
  optimized = optimized
    .replace(/([，。])\1+/g, '$1') // 去除重复的标点
    .replace(/\s+/g, ' ') // 去除多余空格
    .replace(/([，。])\s*([，。])/g, '$1') // 去除标点之间的空格
    .trim()

  return optimized
}

/**
 * 优化整个签文对象
 */
export function optimizeStick(stick: any): any {
  // 保留所有原始字段，包括 story 和 dailyPoem
  const optimized = { 
    ...stick,
    story: stick.story, // 明确保留戏文简介
    dailyPoem: stick.dailyPoem, // 明确保留日诗
    poem: stick.poem, // 保留签诗
    title: stick.title, // 保留标题
    id: stick.id, // 保留ID
    level: stick.level // 保留等级
  }

  // 优化主解读
  if (optimized.interpretation) {
    optimized.interpretation = optimizeInterpretation(
      optimized.interpretation,
      optimized.title,
      optimized.level
    )
  }

  // 优化建议
  if (optimized.advice) {
    optimized.advice = optimizeInterpretation(
      optimized.advice,
      optimized.title,
      optimized.level
    )
  }

  // 优化详细解读
  if (optimized.detailedInterpretations) {
    const detailed = { ...optimized.detailedInterpretations }
    for (const key in detailed) {
      if (detailed[key]) {
        detailed[key] = optimizeInterpretation(
          detailed[key],
          optimized.title,
          optimized.level
        )
      }
    }
    optimized.detailedInterpretations = detailed
  }

  // 优化年龄性别解读
  if (optimized.ageGenderInterpretations) {
    const ageGender = { ...optimized.ageGenderInterpretations }
    for (const key in ageGender) {
      if (ageGender[key]) {
        ageGender[key] = optimizeInterpretation(
          ageGender[key],
          optimized.title,
          optimized.level
        )
      }
    }
    optimized.ageGenderInterpretations = ageGender
  }

  // 优化分类建议
  if (optimized.categories) {
    const categories = { ...optimized.categories }
    for (const key in categories) {
      if (categories[key]) {
        categories[key] = optimizeInterpretation(
          categories[key],
          optimized.title,
          optimized.level
        )
      }
    }
    optimized.categories = categories
  }

  return optimized
}

