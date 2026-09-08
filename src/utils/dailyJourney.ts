import type { AppPage, FeaturePage } from '../types/appPage'
import { isFeaturePage } from './localePath'
import { recordFeatureComplete } from './atelierJournal'
import { trackFeatureComplete } from './analytics'
import { getStorageItem, setStorageItem } from './storage'

/** Dispatch when a feature produces a meaningful result (draw, chart, interpretation…). */
export const DAILY_JOURNEY_COMPLETE_EVENT = 'fate-atelier:daily-complete'

const DEDUPE_KEY = 'fate-atelier-complete-dedupe-v1'

interface CompleteDedupeState {
  date: string
  pages: FeaturePage[]
}

function localDate(): string {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function loadDedupe(today: string): CompleteDedupeState {
  const stored = getStorageItem<CompleteDedupeState | null>(DEDUPE_KEY, null).data
  if (stored?.date === today && Array.isArray(stored.pages)) {
    return { date: today, pages: stored.pages.filter(isFeaturePage) }
  }
  return { date: today, pages: [] }
}

/** True when journal + analytics already recorded this feature today. */
export function hasCompletedToday(page: FeaturePage, today = localDate()): boolean {
  return loadDedupe(today).pages.includes(page)
}

function rememberCompletedToday(page: FeaturePage, today = localDate()) {
  const state = loadDedupe(today)
  if (state.pages.includes(page)) return
  setStorageItem(DEDUPE_KEY, {
    date: today,
    pages: [...state.pages, page],
  })
}

/** Deduplicate same-day mission completions in UI state. */
export function withCompletedPage(completed: FeaturePage[], page: FeaturePage): FeaturePage[] {
  if (completed.includes(page)) return completed
  return [...completed, page]
}

export function markDailyJourneyComplete(page: AppPage) {
  if (typeof window === 'undefined') return
  if (!isFeaturePage(page)) return

  // UI listeners always hear the event; they dedupe their own star state.
  window.dispatchEvent(new CustomEvent<AppPage>(DAILY_JOURNEY_COMPLETE_EVENT, { detail: page }))

  // Journal + analytics: once per calendar day per feature (avoids cybermerit knock spam).
  if (hasCompletedToday(page)) return
  rememberCompletedToday(page)
  recordFeatureComplete(page)
  trackFeatureComplete(page)
}
