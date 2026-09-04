import type { AppPage } from '../types/appPage'
import { pagePath } from './localePath'

export const SITE_ORIGIN = 'https://www.fateatelier.cloud'

export interface HreflangLink {
  hreflang: 'zh-CN' | 'en' | 'x-default'
  href: string
}

/** Canonical hreflang set: English is x-default (unprefixed paths). */
export function buildHreflangAlternates(page: AppPage, origin = SITE_ORIGIN): HreflangLink[] {
  const zhUrl = `${origin}${pagePath(page, 'zh-CN')}`
  const enUrl = `${origin}${pagePath(page, 'en')}`
  return [
    { hreflang: 'zh-CN', href: zhUrl },
    { hreflang: 'en', href: enUrl },
    { hreflang: 'x-default', href: enUrl },
  ]
}
