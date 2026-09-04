import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { daySeed } from '../../hooks/useDailyJourney'
import {
  DAILY_JOURNEY_COMPLETE_EVENT,
  markDailyJourneyComplete,
  withCompletedPage,
} from '../dailyJourney'
import { installBrowserShims } from './browserShim'

describe('daySeed', () => {
  it('is stable and differs for nearby dates', () => {
    expect(daySeed('2026-09-04')).toBe(daySeed('2026-09-04'))
    expect(daySeed('2026-09-04')).not.toBe(daySeed('2026-09-05'))
  })
})

describe('withCompletedPage', () => {
  it('appends a new feature page once', () => {
    expect(withCompletedPage([], 'tarot')).toEqual(['tarot'])
    expect(withCompletedPage(['tarot'], 'tarot')).toEqual(['tarot'])
    expect(withCompletedPage(['tarot'], 'dream')).toEqual(['tarot', 'dream'])
  })
})

describe('markDailyJourneyComplete', () => {
  beforeEach(() => {
    installBrowserShims('/')
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('ignores non-feature pages', () => {
    const spy = vi.fn()
    window.addEventListener(DAILY_JOURNEY_COMPLETE_EVENT, spy)
    markDailyJourneyComplete('home')
    markDailyJourneyComplete('privacy')
    expect(spy).not.toHaveBeenCalled()
  })

  it('dispatches a complete event for feature pages', () => {
    const spy = vi.fn()
    window.addEventListener(DAILY_JOURNEY_COMPLETE_EVENT, spy)
    markDailyJourneyComplete('tarot')
    expect(spy).toHaveBeenCalledTimes(1)
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toBe('tarot')
  })
})
