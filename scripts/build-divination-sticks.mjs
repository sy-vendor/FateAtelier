/**
 * 生成 src/data/divinationSticks.ts
 * 运行: npm run build:sticks
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { POLISH_1_50 } from './divination-polish/1-50.mjs'
import { POLISH_51_100 } from './divination-polish/51-100.mjs'
import { PLAIN_POEMS } from './divination-polish/plain-poems.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/data/divinationSticks.ts')

const POLISH = { ...POLISH_1_50, ...POLISH_51_100 }

const STICKS = [
  { id: 1, level: '上上', title: '大吉大利', poem: '天开地辟结良缘，日吉时良万物全。若得此签非小可，人行忠正帝王宣。' },
  { id: 2, level: '上上', title: '福星高照', poem: '福如东海寿如山，君尔何须问中间。荣华富贵天注定，子孙昌盛满堂欢。' },
  { id: 3, level: '上上', title: '龙飞凤舞', poem: '龙腾凤舞瑞气腾，万象更新庆升平。青云有路平步上，前程锦绣乐盈盈。' },
  { id: 4, level: '上上', title: '金榜题名', poem: '十年寒窗苦读书，一朝金榜题名时。功名利禄皆在手，光宗耀祖显门楣。' },
  { id: 5, level: '上上', title: '花开富贵', poem: '牡丹花开富贵门，蜂蝶纷纷贺新春。财禄丰盈人安乐，春风得意满乾坤。' },
  { id: 6, level: '上上', title: '天降祥瑞', poem: '祥云缭绕降天门，瑞气千条护宅垣。家道兴隆人康健，福禄绵绵世代传。' },
  { id: 7, level: '上上', title: '紫气东来', poem: '紫气东来三千里，圣人将度函谷关。贵人接引机缘至，事业腾飞势莫拦。' },
  { id: 8, level: '上上', title: '龙凤呈祥', poem: '龙凤和鸣庆太平，鸳鸯比目两心倾。姻缘美满家声振，喜气盈门万事兴。' },
  { id: 9, level: '上上', title: '福禄双全', poem: '福荫高堂禄满堂，儿孙贤孝寿而康。天时地利人和备，富贵荣华岁月长。' },
  { id: 10, level: '上上', title: '天赐良缘', poem: '月下红绳系夙缘，天教才子结婵娟。百年好合鸳鸯侣，琴瑟和谐乐永年。' },
  { id: 11, level: '上', title: '前程似锦', poem: '春风得意马蹄疾，一日看尽长安花。前程锦绣凭君力，稳步青云路不赊。' },
  { id: 12, level: '上', title: '贵人相助', poem: '独行偏遇引路人，暗中有贵暗中伸。逢难自有援手至，事功渐显见新春。' },
  { id: 13, level: '上', title: '财运亨通', poem: '财源好似春江水，滚滚东来不暂停。正财稳进偏财旺，积少成多裕后昆。' },
  { id: 14, level: '上', title: '学业有成', poem: '萤窗雪案苦钻研，笔底春风化雨绵。金榜题名应有日，龙门一跃在秋天。' },
  { id: 15, level: '上', title: '家庭和睦', poem: '家和方得万事兴，堂前椿萱笑语盈。夫妻相敬如宾礼，儿女承欢膝下情。' },
  { id: 16, level: '中上', title: '稳步发展', poem: '不疾不徐步稳行，厚积方能薄发成。眼前虽无惊天事，日久自有好名声。' },
  { id: 17, level: '中上', title: '小有成就', poem: '粒粒辛劳粒粒收，小成亦是好开头。莫嫌进步微微慢，再进一层在上头。' },
  { id: 18, level: '中上', title: '渐入佳境', poem: '初行幽谷渐开扬，好景从今慢慢长。耐心守得云开日，花明又一村在旁。' },
  { id: 19, level: '中上', title: '时来运转', poem: '否极泰来运有移，寒梅经雪更芳菲。旧章翻过新篇启，转运就在此一时。' },
  { id: 20, level: '中上', title: '厚积薄发', poem: '深根固本待春风，一旦花开满院红。平日功夫无白费，发迹原在沉默中。' },
  { id: 21, level: '中上', title: '柳暗花明', poem: '山重水复疑无路，忽见垂杨映水居。困境之中藏转机，放宽心后见前途。' },
  { id: 22, level: '中上', title: '积少成多', poem: '涓涓细流汇成江，寸寸耕耘谷满仓。不贪捷径求速效，聚沙成塔见辉光。' },
  { id: 23, level: '中上', title: '循序渐进', poem: '欲速则不达其功，按部就班事乃隆。一步一印踏实走，终教攀到最高峰。' },
  { id: 24, level: '中上', title: '稳中求进', poem: '风浪虽平未可松，稳舵徐行向远峰。守成之中求进步，进而不躁是英雄。' },
  { id: 25, level: '中上', title: '水到渠成', poem: '瓜熟蒂落自天然，强求反惹事牵连。时机一到功成就，水到自然渠自圆。' },
  { id: 26, level: '中', title: '平平淡淡', poem: '平淡之中有真味，安常守分亦相宜。不求轰轰烈烈事，细水长流最可期。' },
  { id: 27, level: '中', title: '需要努力', poem: '天不下雨人耕田，收成全在己身肩。莫怨时运偏淡薄，功夫到了自成全。' },
  { id: 28, level: '中', title: '安分守己', poem: '守份安常心自宽，越界贪多反招难。本分之内勤行事，平安便是大平安。' },
  { id: 29, level: '中', title: '知足常乐', poem: '知足常足心自足，贪多嚼烂反劳神。眼前有福须珍惜，安乐何须羡他人。' },
  { id: 30, level: '中', title: '守株待兔', poem: '偶然得之不可恃，守株待兔误终身。机缘须配勤与智，空等何年见好春。' },
  { id: 31, level: '中', title: '随遇而安', poem: '随缘安命不强求，顺逆皆从心上修。境变心定风波少，处处逢源是渡舟。' },
  { id: 32, level: '中', title: '顺其自然', poem: '流水无心任去留，花开花谢两悠悠。顺天应人莫逆理，自然之道是良谋。' },
  { id: 33, level: '中', title: '以静制动', poem: '风来不动一池清，静里观机万象明。急事缓办存定力，以静制动百事成。' },
  { id: 34, level: '中', title: '以退为进', poem: '退一步时海阔天空，让三分路更从容。暂避锋芒非示弱，蓄力再来建奇功。' },
  { id: 35, level: '中', title: '韬光养晦', poem: '藏锋敛锷待时鸣，大器从来晚乃成。眼下且宜低调过，他年一鸣天下惊。' },
  { id: 36, level: '中', title: '以柔克刚', poem: '刚极必折柔可久，水滴石穿在坚持。以柔克刚真智慧，不争一时争远时。' },
  { id: 37, level: '中', title: '以逸待劳', poem: '养精蓄锐候良机，敌疲我逸胜可期。不急一时之胜负，后劲足时定出奇。' },
  { id: 38, level: '中', title: '以不变应万变', poem: '万变不离其宗理，守正持中见本真。外界纷纭心自定，以不变应万尘。' },
  { id: 39, level: '中', title: '以德服人', poem: '德高望重人自服，不必声高色厉呼。宽厚待人积阴德，口碑长是在穷途。' },
  { id: 40, level: '中', title: '以和为贵', poem: '和气生财亦生福，争执最损两家门。凡事留人三分面，和为贵处万事温。' },
  { id: 41, level: '中', title: '以诚待人', poem: '诚心所至石可开，虚诈从来不久长。待人以真天可鉴，信义二字是桥梁。' },
  { id: 42, level: '中', title: '以理服人', poem: '有理不在声调高，据理力争亦要谦。通情达理人信服，蛮干硬碰反伤廉。' },
  { id: 43, level: '中', title: '以礼待人', poem: '礼之用和为贵先，恭敬待人暖人心。谦恭有礼门庭旺，粗鲁无礼众疏离。' },
  { id: 44, level: '中', title: '以义为先', poem: '义字当头天地宽，见利忘义祸相连。守义方是立身本，不义之财莫贪沾。' },
  { id: 45, level: '中', title: '以信为本', poem: '一言既出驷马追，信用为人立业基。失信一次难再立，守信方能众相依。' },
  { id: 46, level: '中', title: '以勤为本', poem: '勤能补拙是良言，一日不勤一日偏。手勤脚勤心亦勤，天道酬勤自古然。' },
  { id: 47, level: '中', title: '以俭为本', poem: '俭以养德奢招祸，细水长流富可求。浪费从来败家道，俭朴持家福自留。' },
  { id: 48, level: '中', title: '以学为本', poem: '学然后知不足焉，温故知新日日鲜。终身学习是正道，胸有诗书气自妍。' },
  { id: 49, level: '中', title: '以忍为本', poem: '忍一时风平浪静，退一步海阔天空。小不忍则乱大谋，忍中有智是英雄。' },
  { id: 50, level: '中', title: '以恒为本', poem: '锲而不舍金石开，恒心可破万重关。半途而废空费力，持之以恒事必完。' },
  { id: 51, level: '中下', title: '需要谨慎', poem: '履薄冰兮临深渊，谨慎行来可保全。当前一步一留意，大意从来招祸端。' },
  { id: 52, level: '中下', title: '困难重重', poem: '前路崎岖石荦荦，行来步步要留神。困难虽多非绝境，咬牙挺过见新春。' },
  { id: 53, level: '中下', title: '波折不断', poem: '好事多磨古有之，一波才平一波起。波折不断心莫乱，稳住阵脚待转机。' },
  { id: 54, level: '中下', title: '阻碍重重', poem: '门外青山路几重，行来处处有拦胸。阻碍虽多可绕行，另辟蹊径亦相通。' },
  { id: 55, level: '中下', title: '挫折不断', poem: '跌倒七次八次起，挫折教人更坚志。屡败屡战终有胜，莫因一跌弃前程。' },
  { id: 56, level: '中下', title: '险象环生', poem: '虎狼在侧路崎岖，险象环生须慎之。当前宜缓不宜急，保全自身是第一。' },
  { id: 57, level: '中下', title: '危机四伏', poem: '四面风声鹤唳时，危机暗伏在未知。谨言慎行少出门，静候风波过去之。' },
  { id: 58, level: '中下', title: '荆棘满途', poem: '荆棘满途鞋脚破，行来辛苦不堪言。披荆斩棘虽费力，走过便是艳阳天。' },
  { id: 59, level: '中下', title: '前路艰难', poem: '山高水远路漫长，艰难方显志坚强。前路虽难终有尽，坚持到底见光芒。' },
  { id: 60, level: '中下', title: '前途未卜', poem: '雾锁前程看不真，吉凶未卜莫轻身。观望等待三五日，云开方见路头新。' },
  { id: 61, level: '下', title: '需要耐心', poem: '欲速则不达其功，耐心等候运方通。当前且把躁心敛，时来运转在秋冬。' },
  { id: 62, level: '下', title: '需要调整', poem: '方法不对事难成，及时调整是聪明。旧路不通试新路，转圜之间见光明。' },
  { id: 63, level: '下', title: '凶多吉少', poem: '凶多吉少势分明，凡事宁防勿侥幸。收缩战线守根本，待时而后可伸行。' },
  { id: 64, level: '下', title: '祸不单行', poem: '屋漏偏逢连夜雨，祸不单行须忍之。先安内后图外事，熬过此关有转机。' },
  { id: 65, level: '下', title: '雪上加霜', poem: '本已艰难又遇霜，雪上加霜心勿慌。先保根本再图变，寒冬过后是春阳。' },
  { id: 66, level: '下', title: '屋漏偏逢连夜雨', poem: '旧患未除新患来，屋漏连夜雨频催。先堵漏洞再前行，急缓有序免再灾。' },
  { id: 67, level: '下', title: '四面楚歌', poem: '四面歌声起楚营，孤立无援势危倾。求援借力莫独撑，退一步可保残生。' },
  { id: 68, level: '下', title: '山穷水尽', poem: '山穷水尽疑无路，绝境之中莫放弃。坚持再走三五步，往往林尽见清溪。' },
  { id: 69, level: '下', title: '走投无路', poem: '走投无路莫绝望，天无绝人之路长。求助贵人或暂退，转机常在最低旁。' },
  { id: 70, level: '下', title: '绝处逢生', poem: '绝处逢生古有训，最暗时刻最近晨。咬牙挺过这一关，回头便是好风景。' },
  { id: 71, level: '下', title: '困兽犹斗', poem: '困兽犹斗势虽凶，不可硬拼宜智取。保存实力寻出路，斗而不僵是良图。' },
  { id: 72, level: '下', title: '穷途末路', poem: '穷途末路志莫灰，末路之中有转机。放下执念换思路，新路往往在旧蹊。' },
  { id: 73, level: '下', title: '日暮途穷', poem: '日暮途穷须歇脚，强行赶路更疲劳。今夜好生安养息，明朝再作远途跑。' },
  { id: 74, level: '下', title: '进退维谷', poem: '进退维谷两为难，原地不动亦不安。择一方向坚定行，犹豫最是误时间。' },
  { id: 75, level: '下', title: '骑虎难下', poem: '骑虎难下事已成，中途退返损声名。既已上马须骑稳，小心收尾保全身。' },
  { id: 76, level: '下', title: '进退两难', poem: '进恐有险退有亏，两难之际贵知机。小步试探莫豪赌，稳中求脱是上计。' },
  { id: 77, level: '下', title: '左右为难', poem: '左也难来右也难，居中调和是良方。两害相权取其轻，果断抉择莫彷徨。' },
  { id: 78, level: '下', title: '前有狼后有虎', poem: '前有狼来后有虎，险境之中须冷静。不可盲目前与后，侧向迂回找生门。' },
  { id: 79, level: '下', title: '腹背受敌', poem: '腹背受敌势危急，内外交困心要齐。先安内患后御外，分而治之可解围。' },
  { id: 80, level: '下', title: '内忧外患', poem: '内忧外患一齐来，先治内乱后御灾。家人齐心可断金，内外兼顾事方开。' },
  { id: 81, level: '下下', title: '需要坚持', poem: '至暗时刻莫言弃，坚持一日是一日。寒冬终会过去也，梅花香自苦寒出。' },
  { id: 82, level: '下下', title: '需要反思', poem: '事有不成须自省，反求诸己是聪明。找出症结勤改正，反思之后路自平。' },
  { id: 83, level: '下下', title: '大凶之兆', poem: '乌云压城势欲摧，大凶之兆须回避。凡事收缩守本分，静待云开见日辉。' },
  { id: 84, level: '下下', title: '祸不单行', poem: '祸患相连势未休，先求自保莫强求。减少开支稳根基，祸去福来有来由。' },
  { id: 85, level: '下下', title: '雪上加霜', poem: '雪上再加霜一层，当前最忌乱方寸。守静守拙待时变，否极泰来有定分。' },
  { id: 86, level: '下下', title: '屋漏偏逢连夜雨', poem: '漏屋连夜雨不休，先遮头顶再运筹。保命保本为第一，余事且待雨停收。' },
  { id: 87, level: '下下', title: '四面楚歌', poem: '四面楚歌敌环伺，孤立之际要求济。低头认错或求助，暂忍屈辱换生机。' },
  { id: 88, level: '下下', title: '山穷水尽', poem: '山穷水尽水横流，绝境之中有渡头。寻一绳筏先渡己，留得青山不怕愁。' },
  { id: 89, level: '下下', title: '绝境逢生', poem: '绝境之中一线生，天留活路给苦人。抓住微光奋力行，绝处逢生在此辰。' },
  { id: 90, level: '下下', title: '穷途末路', poem: '穷途末路泪沾襟，末路方知情谊真。患难见人心可托，携手共度待春临。' },
  { id: 91, level: '下下', title: '走投无路', poem: '走投无路莫轻生，天无绝人之路存。求助四方寻援手，柳暗花明又一村。' },
  { id: 92, level: '下下', title: '万劫不复', poem: '万劫不复因一念，当前切忌再冒险。收手止损为上策，留得性命再图全。' },
  { id: 93, level: '下下', title: '死路一条', poem: '看似死路一条径，转角或有小门庭。换思路换方向走，死路也能变通途。' },
  { id: 94, level: '下下', title: '无路可走', poem: '无路可走且停步，原地修整养精神。待云开雾散时日，新路自会在前陈。' },
  { id: 95, level: '下下', title: '绝处无生', poem: '绝处看似无生路，天留一线在深处。静心守候莫妄动，生机常在最低处。' },
  { id: 96, level: '下下', title: '回天乏术', poem: '回天乏术势已穷，力所不及莫强弓。接受现实调心态，另起炉灶亦成功。' },
  { id: 97, level: '下下', title: '无力回天', poem: '无力回天事已休，过往成败付东流。从此低调从新计，他年亦可竞风流。' },
  { id: 98, level: '下下', title: '万念俱灰', poem: '万念俱灰心欲冷，且寻亲友暖寒衾。一念放下千般事，重整旗鼓再启程。' },
  { id: 99, level: '下下', title: '绝望至极', poem: '绝望至极夜最深，黎明总在后面等。熬过今夜明天日，太阳依旧东升升。' },
  { id: 100, level: '下下', title: '大凶大恶', poem: '大凶大恶势汹汹，凡事回避莫争锋。守正安分待时过，转运总在苦尽中。' },
]

function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function emitStick(s) {
  const p = POLISH[s.id]
  if (!p) {
    throw new Error(`Missing polish content for stick id ${s.id}`)
  }

  const daily = s.poem.split(/[，。]/).slice(0, 2).join('，') + '。'
  const detailed = p.details
  const age = p.age
  const cats = {
    career: detailed.career,
    love: detailed.marriage,
    health: detailed.health,
    wealth: detailed.wealth,
    travel: detailed.travel,
  }

  const plainPoem = PLAIN_POEMS[s.id]
  if (!plainPoem) {
    throw new Error(`Missing plain poem for stick id ${s.id}`)
  }

  let o = `  {
    id: ${s.id},
    level: '${s.level}',
    title: '${esc(s.title)}',
    poem: '${esc(s.poem)}',
    plainPoem: '${esc(plainPoem)}',
    interpretation: '${esc(p.interpretation)}',
    advice: '${esc(p.advice)}',
    story: '${esc(p.story)}',
    dailyPoem: '${esc(daily)}',
    detailedInterpretations: {
`
  for (const [k, v] of Object.entries(detailed)) {
    o += `      ${k}: '${esc(v)}',\n`
  }
  o += `    },
    ageGenderInterpretations: {
`
  for (const [k, v] of Object.entries(age)) {
    o += `      ${k}: '${esc(v)}',\n`
  }
  o += `    },
    categories: {
      career: '${esc(cats.career)}',
      love: '${esc(cats.love)}',
      health: '${esc(cats.health)}',
      wealth: '${esc(cats.wealth)}',
      travel: '${esc(cats.travel)}',
    },
  }`
  return o
}

const header = `// 签文数据 - 100支签（由 scripts/build-divination-sticks.mjs 生成）
export interface DivinationStick {
  id: number
  level: '上上' | '上' | '中上' | '中' | '中下' | '下' | '下下'
  title: string
  poem: string
  plainPoem: string
  interpretation: string
  advice: string
  story?: string
  dailyPoem?: string
  detailedInterpretations?: {
    home?: string
    business?: string
    travel?: string
    marriage?: string
    wealth?: string
    health?: string
    lawsuit?: string
    lostItem?: string
    searchPerson?: string
    relocation?: string
    career?: string
    pregnancy?: string
    livestock?: string
    disputes?: string
    illness?: string
    transaction?: string
    traveler?: string
  }
  ageGenderInterpretations?: {
    child?: string
    youngGirl?: string
    youngBoy?: string
    male?: string
    female?: string
  }
  categories: {
    career?: string
    love?: string
    health?: string
    wealth?: string
    travel?: string
  }
}

export const divinationSticks: DivinationStick[] = [
`

const body = STICKS.map(emitStick).join(',\n')
const footer = '\n]\n'

fs.writeFileSync(OUT, header + body + footer, 'utf8')
console.log(`Wrote ${STICKS.length} sticks to ${OUT}`)
