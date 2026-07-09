import { ReadingRecord } from '../components/ReadingHistory'

export const exportReadingToText = (reading: ReadingRecord): string => {
  let text = '🔮 命运工坊 - 玄机阁\n'
  text += '='.repeat(40) + '\n\n'

  const date = new Date(reading.timestamp)
  text += `占卜时间: ${date.toLocaleString('zh-CN')}\n`
  text += `占卜类型: ${reading.type === 'single' ? '单牌占卜' : '三牌占卜'}\n\n`

  if (reading.type === 'single') {
    const card = reading.cards[0]
    text += `抽取的牌: ${card.card.name} (${card.card.nameEn})\n`
    text += `位置: ${card.isReversed ? '逆位' : '正位'}\n\n`
    text += `关键词:\n${card.isReversed ? card.card.meaning.reversed : card.card.meaning.upright}\n\n`
    text += `牌面要义:\n${card.card.description}\n\n`
    text += `牌意解读:\n${card.isReversed ? card.card.interpretation.reversed : card.card.interpretation.upright}\n\n`
    text += `行动建议:\n${card.isReversed ? card.card.advice.reversed : card.card.advice.upright}\n`
  } else {
    text += '三牌占卜结果:\n\n'
    reading.cards.forEach((card, index) => {
      const position = index === 0 ? '过去' : index === 1 ? '现在' : '未来'
      text += `${position}: ${card.card.name} (${card.card.nameEn})\n`
      text += `位置: ${card.isReversed ? '逆位' : '正位'}\n`
      text += `牌意: ${card.isReversed ? card.card.meaning.reversed : card.card.meaning.upright}\n\n`
    })

    if (reading.interpretation) {
      text += '综合解读:\n'
      text += `整体趋势: ${reading.interpretation.summary}\n\n`
      text += `过去: ${reading.interpretation.past}\n\n`
      text += `现在: ${reading.interpretation.present}\n\n`
      text += `未来: ${reading.interpretation.future}\n\n`
      text += `建议: ${reading.interpretation.advice}\n`
    }
  }

  text += '\n' + '='.repeat(40) + '\n'
  text += '© 2025 命运工坊 - 仅供娱乐参考\n'

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

