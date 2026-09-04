import { describe, expect, it } from 'vitest'
import { buildHreflangAlternates, SITE_ORIGIN } from '../seoMetadata'

describe('buildHreflangAlternates', () => {
  it('points x-default at the English URL', () => {
    const links = buildHreflangAlternates('tarot')
    expect(links).toEqual([
      { hreflang: 'zh-CN', href: `${SITE_ORIGIN}/zh/tarot` },
      { hreflang: 'en', href: `${SITE_ORIGIN}/tarot` },
      { hreflang: 'x-default', href: `${SITE_ORIGIN}/tarot` },
    ])
  })

  it('uses English homepage as x-default for home', () => {
    const links = buildHreflangAlternates('home')
    expect(links.find((item) => item.hreflang === 'x-default')?.href).toBe(`${SITE_ORIGIN}/`)
    expect(links.find((item) => item.hreflang === 'en')?.href).toBe(`${SITE_ORIGIN}/`)
    expect(links.find((item) => item.hreflang === 'zh-CN')?.href).toBe(`${SITE_ORIGIN}/zh`)
  })
})
