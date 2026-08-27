import type { Locale } from '../i18n/locale'
import { APP_FEATURES } from '../constants/appFeatures'
import type { AppPage } from '../types/appPage'

const FEATURE_PAGES = new Set(APP_FEATURES.map((feature) => feature.page))

export interface LocalePathParts {
  locale: Locale
  /** Path without leading locale segment, e.g. `tarot` or `tarot/card/0` */
  rest: string
  page: AppPage
  segments: string[]
}

export function parseLocalePath(pathname = window.location.pathname): LocalePathParts {
  const segments = pathname.split('/').filter(Boolean)
  const isEnglish = segments[0] === 'en'
  const restSegments = isEnglish ? segments.slice(1) : segments
  const pageSlug = restSegments[0] || 'tarot'
  const page = (FEATURE_PAGES.has(pageSlug as AppPage) ? pageSlug : 'tarot') as AppPage
  return {
    locale: isEnglish ? 'en' : 'zh-CN',
    rest: restSegments.join('/'),
    page,
    segments: restSegments,
  }
}

/** Build an absolute site path for the given locale. */
export function localePath(rest: string, locale: Locale): string {
  const cleaned = rest.replace(/^\/+|\/+$/g, '')
  if (locale === 'en') {
    return cleaned ? `/en/${cleaned}` : '/en'
  }
  return cleaned ? `/${cleaned}` : '/'
}

export function withCurrentLocale(rest: string, locale: Locale = parseLocalePath().locale): string {
  return localePath(rest, locale)
}

/** Swap zh <-> en while keeping the same rest path. */
export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const { rest } = parseLocalePath(pathname)
  return localePath(rest, nextLocale)
}
