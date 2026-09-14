import { describe, expect, it } from 'vitest'
import { buildHreflangAlternates, SITE_ORIGIN } from '../seoMetadata'

describe('buildHreflangAlternates', () => {
  it('points x-default at the Chinese URL for a feature page', () => {
    const links = buildHreflangAlternates('horoscope')
    expect(links).toEqual([
      { hreflang: 'zh-CN', href: `${SITE_ORIGIN}/horoscope` },
      { hreflang: 'en', href: `${SITE_ORIGIN}/en/horoscope` },
      { hreflang: 'x-default', href: `${SITE_ORIGIN}/horoscope` },
    ])
  })

  it('uses Chinese site root as x-default for tarot default page', () => {
    const links = buildHreflangAlternates('tarot')
    expect(links.find((item) => item.hreflang === 'x-default')?.href).toBe(`${SITE_ORIGIN}/`)
    expect(links.find((item) => item.hreflang === 'zh-CN')?.href).toBe(`${SITE_ORIGIN}/`)
    expect(links.find((item) => item.hreflang === 'en')?.href).toBe(`${SITE_ORIGIN}/en`)
  })
})
