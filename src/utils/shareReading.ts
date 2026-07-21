import { ReadingRecord } from '../components/ReadingHistory'
import { resolveThreeCardInterpretation } from './readingInterpretation'
import { txStatic, isEnglishLocale } from '../i18n/locale'
import { toast } from './toast'
import { resolveDrawnCard } from './tarotCardResolve'

export const shareReading = async (reading: ReadingRecord): Promise<void> => {
  const text = generateShareText(reading)
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: txStatic('🔮 塔罗牌占卜结果', '🔮 Tarot reading result'),
        text: text,
      })
    } catch (err) {
      copyToClipboard(text)
    }
  } else {
    copyToClipboard(text)
  }
}

const generateShareText = (reading: ReadingRecord): string => {
  const en = isEnglishLocale()
  const date = new Date(reading.timestamp)
  let text = en ? `🔮 Fate Atelier - Tarot Reading\n\n` : `🔮 命运工坊 - 塔罗牌占卜\n\n`
  text += en
    ? `Reading time: ${date.toLocaleString('en-US')}\n`
    : `占卜时间: ${date.toLocaleString('zh-CN')}\n`
  text += en
    ? `Type: ${reading.type === 'single' ? 'Single card' : 'Three cards'}\n\n`
    : `占卜类型: ${reading.type === 'single' ? '单牌占卜' : '三牌占卜'}\n\n`

  if (reading.type === 'single') {
    const resolved = resolveDrawnCard(reading.cards[0])
    const orientation = resolved.isReversed ? 'reversed' : 'upright'
    text += en
      ? `Card: ${resolved.card.nameEn}\n`
      : `抽取的牌: ${resolved.card.name}\n`
    text += en
      ? `Orientation: ${orientation === 'reversed' ? 'Reversed' : 'Upright'}\n`
      : `位置: ${orientation === 'reversed' ? '逆位' : '正位'}\n`
    text += en
      ? `Meaning: ${resolved.card.interpretation[orientation]}\n`
      : `牌意: ${resolved.card.interpretation[orientation]}\n`
    text += en
      ? `Advice: ${resolved.card.advice[orientation]}\n`
      : `建议: ${resolved.card.advice[orientation]}\n`
  } else {
    text += en ? 'Three-card result:\n' : '三牌占卜结果:\n'
    reading.cards.forEach((card, index) => {
      const position = en
        ? (['Past', 'Present', 'Future'] as const)[index]
        : (['过去', '现在', '未来'] as const)[index]
      const cardName = en ? card.card.nameEn : card.card.name
      text += en
        ? `${position}: ${cardName} (${card.isReversed ? 'Reversed' : 'Upright'})\n`
        : `${position}: ${cardName} (${card.isReversed ? '逆位' : '正位'})\n`
    })
    const interpretation = resolveThreeCardInterpretation(reading, en) ?? reading.interpretation
    if (interpretation) {
      text += en
        ? `\nSynthesis: ${interpretation.summary}\n`
        : `\n时空串联: ${interpretation.summary}\n`
      text += en
        ? `Guidance: ${interpretation.advice}\n`
        : `综合指引: ${interpretation.advice}\n`
    }
  }

  text += en ? `\nFrom: Fate Atelier 🔮` : `\n来自: 命运工坊 🔮`
  return text
}

const copyToClipboard = (text: string): void => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(txStatic('占卜结果已复制到剪贴板！', 'Reading copied to clipboard!'))
    }).catch(() => {
      fallbackCopy(text)
    })
  } else {
    fallbackCopy(text)
  }
}

const fallbackCopy = (text: string): void => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  try {
    document.execCommand('copy')
    toast.success(txStatic('占卜结果已复制到剪贴板！', 'Reading copied to clipboard!'))
  } catch (err) {
    toast.error(txStatic('复制失败，请手动复制', 'Copy failed — please copy manually'))
  }
  document.body.removeChild(textArea)
}
