import { track } from '@vercel/analytics'
import type { AppPage } from '../types/appPage'

type EventProps = Record<string, string | number | boolean | undefined>

/** Light retention analytics — safe no-op outside production if track fails. */
export function trackEvent(name: string, props: EventProps = {}) {
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
