/** Shared trust-page copy for SPA + SEO build. */

import trustPagesJson from './trustPages.json'

export type TrustPage =
  | 'about'
  | 'methodology'
  | 'privacy'
  | 'disclaimer'
  | 'contact'

export const TRUST_PAGES: TrustPage[] = [
  'about',
  'methodology',
  'privacy',
  'disclaimer',
  'contact',
]

export function isTrustPage(page: string): page is TrustPage {
  return (TRUST_PAGES as string[]).includes(page)
}

export interface TrustSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface TrustPageCopy {
  slug: TrustPage
  titleZh: string
  titleEn: string
  descriptionZh: string
  descriptionEn: string
  sectionsZh: TrustSection[]
  sectionsEn: TrustSection[]
}

export const TRUST_PAGE_COPY = trustPagesJson as TrustPageCopy[]

export function getTrustPageCopy(slug: TrustPage): TrustPageCopy {
  return TRUST_PAGE_COPY.find((page) => page.slug === slug)!
}
