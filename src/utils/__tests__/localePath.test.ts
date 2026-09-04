import { describe, expect, it } from 'vitest'
import {
  canonicalLocalePath,
  localePath,
  pagePath,
  parseLocalePath,
  switchLocalePath,
} from '../localePath'

describe('localePath', () => {
  it('uses unprefixed English and /zh for Chinese', () => {
    expect(localePath('', 'en')).toBe('/')
    expect(localePath('tarot', 'en')).toBe('/tarot')
    expect(localePath('', 'zh-CN')).toBe('/zh')
    expect(localePath('tarot', 'zh-CN')).toBe('/zh/tarot')
  })

  it('builds page paths for home and features', () => {
    expect(pagePath('home', 'en')).toBe('/')
    expect(pagePath('home', 'zh-CN')).toBe('/zh')
    expect(pagePath('privacy', 'en')).toBe('/privacy')
    expect(pagePath('privacy', 'zh-CN')).toBe('/zh/privacy')
  })

  it('parses unprefixed English and zh prefixes', () => {
    expect(parseLocalePath('/tarot')).toMatchObject({ locale: 'en', page: 'tarot', rest: 'tarot' })
    expect(parseLocalePath('/zh/tarot')).toMatchObject({ locale: 'zh-CN', page: 'tarot', rest: 'tarot' })
    expect(parseLocalePath('/zh-CN/dream')).toMatchObject({ locale: 'zh-CN', page: 'dream', rest: 'dream' })
  })

  it('recognizes legacy /en prefix and normalizes it away', () => {
    expect(parseLocalePath('/en/tarot')).toMatchObject({ locale: 'en', page: 'tarot', rest: 'tarot' })
    expect(canonicalLocalePath('/en/tarot')).toBe('/tarot')
    expect(canonicalLocalePath('/en')).toBe('/')
    expect(canonicalLocalePath('/zh/tarot')).toBe('/zh/tarot')
  })

  it('switches locale while keeping rest path', () => {
    expect(switchLocalePath('/tarot', 'zh-CN')).toBe('/zh/tarot')
    expect(switchLocalePath('/zh/privacy', 'en')).toBe('/privacy')
  })
})
