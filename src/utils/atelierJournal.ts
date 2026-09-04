import type { AppPage, FeaturePage } from '../types/appPage'
import { getStorageItem, setStorageItem } from './storage'
import { APP_FEATURES } from '../constants/appFeatures'
import { isEnglishLocale } from '../i18n/locale'
import { isFeaturePage } from './localePath'

export type JournalKind = 'complete' | 'reflection' | 'note'

export interface JournalEntry {
  id: string
  page: FeaturePage
  kind: JournalKind
  title: string
  summary: string
  timestamp: number
}

const STORAGE_KEY = 'fate-atelier-journal-v1'
export const JOURNAL_CAP = 80

interface JournalState {
  entries: JournalEntry[]
}

function loadJournal(): JournalState {
  const result = getStorageItem<JournalState>(STORAGE_KEY, { entries: [] })
  if (result.success && result.data && Array.isArray(result.data.entries)) {
    return { entries: result.data.entries.slice(0, JOURNAL_CAP) }
  }
  return { entries: [] }
}

function saveJournal(state: JournalState) {
  setStorageItem(STORAGE_KEY, {
    entries: state.entries.slice(0, JOURNAL_CAP),
  })
}

function featureLabel(page: FeaturePage): string {
  const feature = APP_FEATURES.find((item) => item.page === page)
  if (!feature) return page
  return isEnglishLocale() ? feature.nameEn : feature.name
}

export function appendJournalEntry(
  partial: Omit<JournalEntry, 'id' | 'timestamp' | 'title'> & { title?: string },
): JournalEntry {
  const entry: JournalEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    timestamp: Date.now(),
    title: partial.title ?? featureLabel(partial.page),
    page: partial.page,
    kind: partial.kind,
    summary: partial.summary,
  }
  const state = loadJournal()
  state.entries = [entry, ...state.entries].slice(0, JOURNAL_CAP)
  saveJournal(state)
  return entry
}

export function listJournalEntries(): JournalEntry[] {
  return loadJournal().entries
}

export function listRecentCompletions(limit = 6): JournalEntry[] {
  return listJournalEntries()
    .filter((entry) => entry.kind === 'complete')
    .slice(0, limit)
}

export function listWeekEntries(now = Date.now()): JournalEntry[] {
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000
  return listJournalEntries().filter((entry) => entry.timestamp >= weekAgo)
}

export function addReflection(page: FeaturePage, text: string): JournalEntry | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  return appendJournalEntry({
    page,
    kind: 'reflection',
    title: isEnglishLocale() ? 'Reflection' : '一句感受',
    summary: trimmed.slice(0, 280),
  })
}

/** Record a meaningful feature completion into the unified journal. */
export function recordFeatureComplete(page: AppPage, summary?: string) {
  if (!isFeaturePage(page)) return
  appendJournalEntry({
    page,
    kind: 'complete',
    summary:
      summary ??
      (isEnglishLocale()
        ? `Completed a ${featureLabel(page)} session`
        : `完成一次${featureLabel(page)}体验`),
  })
}
