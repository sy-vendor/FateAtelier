import type { ReadingRecord } from '../components/ReadingHistory'
import type { TarotCard } from '../data/tarotCards'
import type { DrawnCard } from './index'
import type { ReadingType } from './reading'
import type { ReadingInterpretation } from '../utils/readingInterpretation'

/** 与 `useTarotGame` 返回值一致，供 `TarotMainView` 与路由直接透传 */
export interface TarotGameApi {
  drawnCards: DrawnCard[]
  selectedCard: DrawnCard | null
  threeCardReading: DrawnCard[] | null
  readingHistory: ReadingRecord[]
  viewingHistoryReading: ReadingRecord | null
  drawingCard: { card: TarotCard; isReversed: boolean } | null
  showDrawAnimation: boolean
  drawingThreeCards: Array<{ card: TarotCard; isReversed: boolean }> | null
  showThreeCardAnimation: boolean
  showReadingTypeSelector: boolean
  readingInterpretation: ReadingInterpretation | null
  drawCard: () => void
  handleDrawAnimationComplete: () => void
  drawThreeCards: () => void
  handleReadingTypeSelected: (type: ReadingType, question?: string) => void
  handleThreeCardAnimationComplete: () => void
  reset: () => void
  selectCard: (drawnCard: DrawnCard) => void
  updateCardReversed: (cardId: number, isReversed: boolean) => void
  handleSelectCardFromBrowser: (card: TarotCard) => void
  handleViewHistoryReading: (reading: ReadingRecord) => void
  handleDeleteHistoryReading: (id: string) => Promise<void>
  handleExportReading: (reading: ReadingRecord) => void
  handleShareReading: (reading: ReadingRecord) => Promise<void>
  cancelReadingTypeSelector: () => void
}
