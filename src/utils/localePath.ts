import type { Locale } from '../i18n/locale'
import { APP_FEATURES } from '../constants/appFeatures'
import { isTrustPage } from '../content/trustPages'
import type { AppPage, FeaturePage } from '../types/appPage'

const FEATURE_PAGES = new Set(APP_FEATURES.map((feature) => feature.page))

/** English locale path prefix. Chinese uses unprefixed routes (product default). */
export const EN_PREFIX = 'en'

/** @deprecated Legacy Chinese prefix — still parsed for old bookmarks / redirects. */
export const ZH_PREFIX = 'zh'

/** Default SPA tool when the path has no feature slug. */
export const DEFAULT_PAGE: FeaturePage = 'tarot'

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
  if (first === EN_PREFIX) {
    return { locale: 'en', restSegments: segments.slice(1) }
  }
  // Legacy Chinese prefixes — recognized so old /zh bookmarks keep working until redirects land.
  if (first === ZH_PREFIX || first === 'zh-CN') {
    return { locale: 'zh-CN', restSegments: segments.slice(1) }
  }
  return { locale: 'zh-CN', restSegments: segments }
}

export function parseLocalePath(pathname = window.location.pathname): LocalePathParts {
  const segments = pathname.split('/').filter(Boolean)
  const { locale, restSegments } = stripLocalePrefix(segments)
  const pageSlug = restSegments[0]
  let page: AppPage = DEFAULT_PAGE
  if (pageSlug) {
    if (isFeaturePage(pageSlug) || isTrustPage(pageSlug)) {
      page = pageSlug
    } else {
      page = DEFAULT_PAGE
    }
  }
  return {
    locale,
    rest: restSegments.join('/'),
    page,
    segments: restSegments,
  }
}

/** Build an absolute site path. Chinese is unprefixed; English uses `/en`. */
export function localePath(rest: string, locale: Locale): string {
  const cleaned = rest.replace(/^\/+|\/+$/g, '')
  if (locale === 'en') {
    return cleaned ? `/${EN_PREFIX}/${cleaned}` : `/${EN_PREFIX}`
  }
  return cleaned ? `/${cleaned}` : '/'
}

/** Path for an SPA page. Tarot (default) and legacy `home` use the site root. */
export function pagePath(page: AppPage, locale: Locale): string {
  if (page === 'home' || page === DEFAULT_PAGE) return localePath('', locale)
  return localePath(page, locale)
}

export function withCurrentLocale(rest: string, locale: Locale = parseLocalePath().locale): string {
  return localePath(rest, locale)
}

/** Swap zh <-> en while keeping the same rest path. */
export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const { rest } = parseLocalePath(pathname)
  return localePath(rest === DEFAULT_PAGE ? '' : rest, nextLocale)
}

/** Normalize legacy `/zh/...` and `/tarot` default aliases to canonical paths. */
export function canonicalLocalePath(pathname: string): string {
  const { locale, rest } = parseLocalePath(pathname)
  const cleaned = rest === DEFAULT_PAGE ? '' : rest
  return localePath(cleaned, locale)
}
