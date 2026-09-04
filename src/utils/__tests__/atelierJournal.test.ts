import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  JOURNAL_CAP,
  appendJournalEntry,
  listJournalEntries,
  listRecentCompletions,
  recordFeatureComplete,
} from '../atelierJournal'
import { installBrowserShims } from './browserShim'

describe('atelierJournal', () => {
  beforeEach(() => {
    installBrowserShims('/')
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('records feature completions and lists recent ones', () => {
    recordFeatureComplete('tarot')
    recordFeatureComplete('dream')
    const recent = listRecentCompletions(5)
    expect(recent).toHaveLength(2)
    expect(recent[0].page).toBe('dream')
    expect(recent[0].kind).toBe('complete')
    expect(recent[1].page).toBe('tarot')
  })

  it('recovers from corrupted storage', () => {
    localStorage.setItem('fate-atelier-journal-v1', '{not-json')
    expect(listJournalEntries()).toEqual([])
    recordFeatureComplete('almanac')
    expect(listRecentCompletions(1)[0]?.page).toBe('almanac')
  })

  it('recovers when entries is not an array', () => {
    localStorage.setItem('fate-atelier-journal-v1', JSON.stringify({ entries: 'bad' }))
    expect(listJournalEntries()).toEqual([])
  })

  it('caps stored entries at JOURNAL_CAP', () => {
    for (let i = 0; i < JOURNAL_CAP + 12; i += 1) {
      appendJournalEntry({
        page: 'tarot',
        kind: 'note',
        summary: `entry-${i}`,
        title: `n-${i}`,
      })
    }
    expect(listJournalEntries()).toHaveLength(JOURNAL_CAP)
    expect(listJournalEntries()[0].summary).toBe(`entry-${JOURNAL_CAP + 11}`)
  })
})
