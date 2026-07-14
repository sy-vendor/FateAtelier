import type { AppPage } from '../types/appPage'

export const APP_NAVIGATE_EVENT = 'fate-atelier:navigate'

export function navigateToFeature(page: AppPage) {
  window.dispatchEvent(new CustomEvent<AppPage>(APP_NAVIGATE_EVENT, { detail: page }))
}
