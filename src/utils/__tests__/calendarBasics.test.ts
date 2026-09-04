import { describe, expect, it } from 'vitest'
import { calculateHourPillar, calculateYearPillar } from '../bazi'
import { getZodiacSignByDate } from '../horoscopeEngine'
import { daySeed } from '../../hooks/useDailyJourney'
import { solarToLunar, lunarToSolar, getLichunDate } from '../lunarCalendar'

describe('daySeed', () => {
  it('is stable for the same date', () => {
    expect(daySeed('2026-09-04')).toBe(daySeed('2026-09-04'))
  })

  it('differs across nearby dates more often than char-sum seeds', () => {
    const a = daySeed('2026-09-04')
    const b = daySeed('2026-09-05')
    const c = daySeed('2026-09-13')
    expect(a).not.toBe(b)
    expect(a).not.toBe(c)
  })
})

describe('getZodiacSignByDate', () => {
  it('maps known mid-sign dates', () => {
    expect(getZodiacSignByDate(4, 10)).toBe(0) // Aries
    expect(getZodiacSignByDate(5, 10)).toBe(1) // Taurus
  })

  it('handles cusp-adjacent days consistently', () => {
    expect(getZodiacSignByDate(3, 20)).toBe(11) // Pisces
    expect(getZodiacSignByDate(3, 21)).toBe(0) // Aries
  })
})

describe('calculateYearPillar', () => {
  it('returns two-character pillars that change across years', () => {
    const mid2023 = calculateYearPillar(new Date(2023, 5, 1))
    const mid2025 = calculateYearPillar(new Date(2025, 5, 1))
    expect(mid2023).toHaveLength(2)
    expect(mid2025).toHaveLength(2)
    expect(mid2023).not.toBe(mid2025)
  })

  it('exposes a Lichun estimate date object (simplified, may fall outside the named year)', () => {
    const lichun = getLichunDate(2024)
    expect(lichun).toBeInstanceOf(Date)
    expect(Number.isNaN(lichun.getTime())).toBe(false)
    // Approximate window for Lichun around early February.
    expect(lichun.getMonth()).toBe(1)
    expect(lichun.getDate()).toBeGreaterThanOrEqual(3)
    expect(lichun.getDate()).toBeLessThanOrEqual(5)
  })
})

describe('calculateHourPillar', () => {
  it('treats 23:00 as Zi hour start', () => {
    const day = '甲子'
    const at23 = calculateHourPillar(day, 23)
    const at0 = calculateHourPillar(day, 0)
    expect(at23).toBeTruthy()
    expect(at0).toBeTruthy()
    expect(at23).toBe(at0)
  })

  it('changes across common hour boundaries', () => {
    const day = '甲子'
    expect(calculateHourPillar(day, 1)).not.toBe(calculateHourPillar(day, 3))
  })
})

describe('lunarCalendar round-trip samples', () => {
  it('converts a known solar date to lunar and back within range', () => {
    const solar = new Date(2024, 1, 10) // 2024-02-10
    const lunar = solarToLunar(solar)
    expect(lunar).not.toBeNull()
    if (!lunar) return
    const back = lunarToSolar(lunar.year, lunar.isLeapMonth ? lunar.month + 12 : lunar.month, lunar.day)
    expect(back).not.toBeNull()
    if (!back) return
    expect(back.getFullYear()).toBe(solar.getFullYear())
    expect(back.getMonth()).toBe(solar.getMonth())
    expect(back.getDate()).toBe(solar.getDate())
  })
})
