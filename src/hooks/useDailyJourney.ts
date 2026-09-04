import { useEffect, useMemo, useState } from 'react'
import type { AppPage, FeaturePage } from '../types/appPage'
import { isFeaturePage } from '../utils/localePath'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { DAILY_JOURNEY_COMPLETE_EVENT } from '../utils/dailyJourney'

interface DailyJourneyState {
  date: string
  streak: number
  /** Pages where the user produced a meaningful result today. */
  completed: FeaturePage[]
  lastVisit: string
}

const STORAGE_KEY = 'fate-atelier-daily-journey-v2'

function localDate(offsetDays = 0): string {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Stable FNV-1a hash so nearby calendar dates rarely collide. */
export function daySeed(date: string): number {
  let hash = 2166136261
  const input = `fate-atelier:daily:${date}`
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export interface DailyMission {
  page: FeaturePage
  eyebrow: string
  prompt: string
}

function migrateState(today: string): DailyJourneyState {
  const v2 = getStorageItem<DailyJourneyState | null>(STORAGE_KEY, null).data
  if (v2?.date) {
    const sameDay = v2.lastVisit === today
    const continued = v2.lastVisit === localDate(-1)
    return {
      date: today,
      lastVisit: today,
      streak: sameDay ? Math.max(1, v2.streak ?? 1) : continued ? (v2.streak ?? 0) + 1 : 1,
      completed: v2.date === today ? (v2.completed ?? []) : [],
    }
  }

  // One-time soft migrate from v1 (visited-on-open) — do not carry over “visited” as completed.
  const sameDayLegacy = getStorageItem<{ lastVisit?: string; streak?: number } | null>(
    'fate-atelier-daily-journey-v1',
    null,
  ).data
  const continued = sameDayLegacy?.lastVisit === localDate(-1)
  const sameDay = sameDayLegacy?.lastVisit === today
  return {
    date: today,
    lastVisit: today,
    streak: sameDay ? Math.max(1, sameDayLegacy?.streak ?? 1) : continued ? (sameDayLegacy?.streak ?? 0) + 1 : 1,
    completed: [],
  }
}

export function useDailyJourney(_currentPage: AppPage) {
  const today = localDate()
  const [state, setState] = useState<DailyJourneyState>(() => migrateState(today))

  useEffect(() => {
    const onComplete = (event: Event) => {
      const page = (event as CustomEvent<AppPage>).detail
      if (!page || !isFeaturePage(page)) return
      setState((previous) => {
        if (previous.completed.includes(page)) return previous
        return { ...previous, completed: [...previous.completed, page] }
      })
    }
    window.addEventListener(DAILY_JOURNEY_COMPLETE_EVENT, onComplete)
    return () => window.removeEventListener(DAILY_JOURNEY_COMPLETE_EVENT, onComplete)
  }, [])

  useEffect(() => {
    setStorageItem(STORAGE_KEY, state)
  }, [state])

  const missions = useMemo<DailyMission[]>(() => {
    const seed = daySeed(today)
    const daily: DailyMission[] = [
      { page: 'horoscope', eyebrow: '今日气象', prompt: '看看今天适合怎样发力' },
      { page: 'almanac', eyebrow: '今日节律', prompt: '查一查今日宜忌与吉时' },
      { page: 'luckycolor', eyebrow: '今日灵感', prompt: '领取今天的幸运配色' },
    ]
    const reflection: DailyMission[] = [
      { page: 'tarot', eyebrow: '一念一牌', prompt: '为当下最在意的事抽一张牌' },
      { page: 'divination', eyebrow: '今日一签', prompt: '定下一问，看今日签文' },
      { page: 'dream', eyebrow: '梦中来信', prompt: '记下一个梦象，找到情绪暗线' },
    ]
    const explore: DailyMission[] = [
      { page: 'cybermerit', eyebrow: '片刻放松', prompt: '敲几下木鱼，给大脑留白' },
      { page: 'numberenergy', eyebrow: '数字密语', prompt: '解读一组最近常见的数字' },
      { page: 'shengxiao', eyebrow: '关系灵感', prompt: '看看两个生肖如何更好相处' },
      { page: 'nametest', eyebrow: '姓名一角', prompt: '从音形与笔画重新认识一个名字' },
    ]
    return [
      daily[seed % daily.length],
      reflection[(seed + 1) % reflection.length],
      explore[(seed + 2) % explore.length],
    ]
  }, [today])

  return {
    streak: state.streak,
    missions,
    completed: missions.filter((mission) => state.completed.includes(mission.page)).length,
    visited: state.completed,
  }
}
