import { ReadingRecord } from '../components/ReadingHistory'
import { resolveThreeCardInterpretation } from './readingInterpretation'
import { isEnglishLocale } from '../i18n/locale'
import { resolveDrawnCard } from './tarotCardResolve'

export const exportReadingToText = (reading: ReadingRecord): string => {
  const en = isEnglishLocale()
  let text = en ? '🔮 Fate Atelier - Tarot Reading\n' : '🔮 命运工坊 - 玄机阁\n'
  text += '='.repeat(40) + '\n\n'

  const date = new Date(reading.timestamp)
  text += `${en ? 'Reading time' : '占卜时间'}: ${date.toLocaleString(en ? 'en-US' : 'zh-CN')}\n`
  text += `${en ? 'Type' : '占卜类型'}: ${
    reading.type === 'single' ? (en ? 'Single card' : '单牌占卜') : (en ? 'Three cards' : '三牌占卜')
  }\n\n`

  if (reading.type === 'single') {
    const resolved = resolveDrawnCard(reading.cards[0])
    const orientation = resolved.isReversed ? 'reversed' : 'upright'
    text += `${en ? 'Card' : '抽取的牌'}: ${en ? resolved.card.nameEn : resolved.card.name} (${en ? resolved.card.name : resolved.card.nameEn})\n`
    text += `${en ? 'Orientation' : '位置'}: ${
      en ? (orientation === 'reversed' ? 'Reversed' : 'Upright') : orientation === 'reversed' ? '逆位' : '正位'
    }\n\n`
    text += `${en ? 'Keywords' : '关键词'}:\n${resolved.card.meaning[orientation]}\n\n`
    text += `${en ? 'Card essence' : '牌面要义'}:\n${resolved.card.description}\n\n`
    text += `${en ? 'Interpretation' : '牌意解读'}:\n${resolved.card.interpretation[orientation]}\n\n`
    text += `${en ? 'Advice' : '行动建议'}:\n${resolved.card.advice[orientation]}\n`
  } else {
    text += en ? 'Three-card result:\n\n' : '三牌占卜结果:\n\n'
    reading.cards.forEach((drawnCard, index) => {
      const resolved = resolveDrawnCard(drawnCard)
      const positionZh = index === 0 ? '过去' : index === 1 ? '现在' : '未来'
      const positionEn = index === 0 ? 'Past' : index === 1 ? 'Present' : 'Future'
      const orientation = resolved.isReversed ? 'reversed' : 'upright'

      text += `${en ? positionEn : positionZh}: ${en ? resolved.card.nameEn : resolved.card.name} (${en ? resolved.card.name : resolved.card.nameEn})\n`
      text += `${en ? 'Orientation' : '位置'}: ${
        en ? (orientation === 'reversed' ? 'Reversed' : 'Upright') : orientation === 'reversed' ? '逆位' : '正位'
      }\n`
      text += `${en ? 'Meaning' : '牌意'}: ${resolved.card.meaning[orientation]}\n\n`
    })

    const interpretation = resolveThreeCardInterpretation(reading, en) ?? reading.interpretation

    if (interpretation) {
      if (en) {
        text += 'Synthesis:\n'
        text += `Overall trend: ${interpretation.summary}\n\n`
        text += `Past: ${interpretation.past}\n\n`
        text += `Present: ${interpretation.present}\n\n`
        text += `Future: ${interpretation.future}\n\n`
        text += `Guidance: ${interpretation.advice}\n`
      } else {
        text += '时空串联:\n'
        text += `整体趋势: ${interpretation.summary}\n\n`
        text += `过去: ${interpretation.past}\n\n`
        text += `现在: ${interpretation.present}\n\n`
        text += `未来: ${interpretation.future}\n\n`
        text += `综合指引: ${interpretation.advice}\n`
      }
    }
  }

  text += '\n' + '='.repeat(40) + '\n'
  text += en ? '© 2025 Fate Atelier — for entertainment only\n' : '© 2025 命运工坊 - 仅供娱乐参考\n'

  return text
}

export const downloadReading = (reading: ReadingRecord) => {
  const text = exportReadingToText(reading)
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `塔罗占卜_${new Date(reading.timestamp).toISOString().split('T')[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

