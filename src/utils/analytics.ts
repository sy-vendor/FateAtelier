import { track } from '@vercel/analytics'
import type { AppPage } from '../types/appPage'
import { getStorageItem, setStorageItem } from './storage'

type EventProps = Record<string, string | number | boolean | undefined>

export const ANALYTICS_PREF_KEY = 'fate-atelier-analytics-opt-in-v1'
export const ANALYTICS_PREF_EVENT = 'fate-atelier:analytics-pref'

/** Default on; users can opt out on the privacy page. Respect DNT when no preference is stored. */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  const stored = getStorageItem<boolean | null>(ANALYTICS_PREF_KEY, null)
  if (stored.success && typeof stored.data === 'boolean') return stored.data
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return false
  return true
}

export function setAnalyticsEnabled(enabled: boolean) {
  setStorageItem(ANALYTICS_PREF_KEY, enabled)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ANALYTICS_PREF_EVENT, { detail: enabled }))
  }
}

/** Light retention analytics — safe no-op when opted out or if track fails. */
export function trackEvent(name: string, props: EventProps = {}) {
  if (!isAnalyticsEnabled()) return
  try {
    const cleaned: Record<string, string | number | boolean> = {}
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) cleaned[key] = value
    }
    track(name, cleaned)
  } catch {
    // Analytics must never break gameplay.
  }
}

export function trackPageEnter(page: AppPage) {
  trackEvent('page_enter', { page })
}

export function trackFeatureStart(page: AppPage, detail?: string) {
  trackEvent('feature_start', { page, detail })
}

export function trackFeatureComplete(page: AppPage) {
  trackEvent('feature_complete', { page })
}

export function trackFeatureSave(page: AppPage) {
  trackEvent('feature_save', { page })
}

export function trackFeatureShare(page: AppPage) {
  trackEvent('feature_share', { page })
}

export function trackContinuePlay(from: AppPage, to: AppPage) {
  trackEvent('continue_play', { from, to })
}

export function trackIntentSelect(intentId: string, page: AppPage) {
  trackEvent('intent_select', { intent: intentId, page })
}
