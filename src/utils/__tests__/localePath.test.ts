import { describe, expect, it } from 'vitest'
import {
  canonicalLocalePath,
  DEFAULT_PAGE,
  localePath,
  pagePath,
  parseLocalePath,
  switchLocalePath,
} from '../localePath'

describe('localePath', () => {
  it('uses unprefixed Chinese and /en for English', () => {
    expect(localePath('', 'zh-CN')).toBe('/')
    expect(localePath('horoscope', 'zh-CN')).toBe('/horoscope')
    expect(localePath('', 'en')).toBe('/en')
    expect(localePath('horoscope', 'en')).toBe('/en/horoscope')
  })

  it('maps default tarot and legacy home to the site root', () => {
    expect(DEFAULT_PAGE).toBe('tarot')
    expect(pagePath('home', 'zh-CN')).toBe('/')
    expect(pagePath('tarot', 'zh-CN')).toBe('/')
    expect(pagePath('home', 'en')).toBe('/en')
    expect(pagePath('tarot', 'en')).toBe('/en')
    expect(pagePath('privacy', 'zh-CN')).toBe('/privacy')
    expect(pagePath('privacy', 'en')).toBe('/en/privacy')
  })

  it('parses empty path as tarot by default', () => {
    expect(parseLocalePath('/')).toMatchObject({ locale: 'zh-CN', page: 'tarot', rest: '' })
    expect(parseLocalePath('/tarot')).toMatchObject({ locale: 'zh-CN', page: 'tarot', rest: 'tarot' })
    expect(parseLocalePath('/en/tarot')).toMatchObject({ locale: 'en', page: 'tarot', rest: 'tarot' })
    expect(parseLocalePath('/horoscope')).toMatchObject({ locale: 'zh-CN', page: 'horoscope', rest: 'horoscope' })
  })

  it('recognizes legacy /zh prefix and canonicalizes /tarot to root', () => {
    expect(parseLocalePath('/zh/tarot')).toMatchObject({ locale: 'zh-CN', page: 'tarot', rest: 'tarot' })
    expect(canonicalLocalePath('/zh/tarot')).toBe('/')
    expect(canonicalLocalePath('/zh')).toBe('/')
    expect(canonicalLocalePath('/tarot')).toBe('/')
    expect(canonicalLocalePath('/en/tarot')).toBe('/en')
  })

  it('switches locale while keeping rest path', () => {
    expect(switchLocalePath('/horoscope', 'en')).toBe('/en/horoscope')
    expect(switchLocalePath('/en/privacy', 'zh-CN')).toBe('/privacy')
    expect(switchLocalePath('/', 'en')).toBe('/en')
  })
})
