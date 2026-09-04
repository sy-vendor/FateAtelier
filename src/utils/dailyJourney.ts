import type { AppPage, FeaturePage } from '../types/appPage'
import { isFeaturePage } from './localePath'
import { recordFeatureComplete } from './atelierJournal'
import { trackFeatureComplete } from './analytics'

/** Dispatch when a feature produces a meaningful result (draw, chart, interpretation…). */
export const DAILY_JOURNEY_COMPLETE_EVENT = 'fate-atelier:daily-complete'

/** Deduplicate same-day mission completions. */
export function withCompletedPage(completed: FeaturePage[], page: FeaturePage): FeaturePage[] {
  if (completed.includes(page)) return completed
  return [...completed, page]
}

export function markDailyJourneyComplete(page: AppPage) {
  if (typeof window === 'undefined') return
  if (!isFeaturePage(page)) return
  window.dispatchEvent(new CustomEvent<AppPage>(DAILY_JOURNEY_COMPLETE_EVENT, { detail: page }))
  recordFeatureComplete(page)
  trackFeatureComplete(page)
}
