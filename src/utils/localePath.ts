import type { Locale } from '../i18n/locale'
import { APP_FEATURES } from '../constants/appFeatures'
import { isTrustPage } from '../content/trustPages'
import type { AppPage, FeaturePage } from '../types/appPage'

const FEATURE_PAGES = new Set(APP_FEATURES.map((feature) => feature.page))

/** Chinese locale path prefix. English uses unprefixed routes. */
export const ZH_PREFIX = 'zh'

export interface LocalePathParts {
  locale: Locale
  /** Path without leading locale segment, e.g. `tarot` or `tarot/card/0` */
  rest: string
  page: AppPage
  segments: string[]
}

export function isFeaturePage(page: string): page is FeaturePage {
  return FEATURE_PAGES.has(page as FeaturePage)
}

function stripLocalePrefix(segments: string[]): { locale: Locale; restSegments: string[] } {
  const first = segments[0]
  if (first === ZH_PREFIX || first === 'zh-CN') {
    return { locale: 'zh-CN', restSegments: segments.slice(1) }
  }
  // Legacy English prefix — still recognized so old bookmarks keep working until redirects land.
  if (first === 'en') {
    return { locale: 'en', restSegments: segments.slice(1) }
  }
  return { locale: 'en', restSegments: segments }
}

export function parseLocalePath(pathname = window.location.pathname): LocalePathParts {
  const segments = pathname.split('/').filter(Boolean)
  const { locale, restSegments } = stripLocalePrefix(segments)
  const pageSlug = restSegments[0]
  let page: AppPage = 'home'
  if (pageSlug) {
    if (isFeaturePage(pageSlug) || isTrustPage(pageSlug)) {
      page = pageSlug
    } else {
      page = 'home'
    }
  }
  return {
    locale,
    rest: restSegments.join('/'),
    page,
    segments: restSegments,
  }
}

/** Build an absolute site path for the given locale. English is unprefixed; Chinese uses `/zh`. */
export function localePath(rest: string, locale: Locale): string {
  const cleaned = rest.replace(/^\/+|\/+$/g, '')
  if (locale === 'zh-CN') {
    return cleaned ? `/${ZH_PREFIX}/${cleaned}` : `/${ZH_PREFIX}`
  }
  return cleaned ? `/${cleaned}` : '/'
}

/** Path for an SPA page (home → `/` or `/zh`). */
export function pagePath(page: AppPage, locale: Locale): string {
  if (page === 'home') return localePath('', locale)
  return localePath(page, locale)
}

export function withCurrentLocale(rest: string, locale: Locale = parseLocalePath().locale): string {
  return localePath(rest, locale)
}

/** Swap zh <-> en while keeping the same rest path. */
export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const { rest } = parseLocalePath(pathname)
  return localePath(rest, nextLocale)
}

/** Normalize legacy `/en/...` URLs to unprefixed English paths. */
export function canonicalLocalePath(pathname: string): string {
  const { locale, rest } = parseLocalePath(pathname)
  return localePath(rest, locale)
}
