import { useEffect, useMemo, useState } from 'react'
import type { AppPage } from '../types/appPage'
import { getStorageItem, setStorageItem } from '../utils/storage'

interface DailyJourneyState {
  date: string
  streak: number
  visited: AppPage[]
  lastVisit: string
}

const STORAGE_KEY = 'fate-atelier-daily-journey-v1'

function localDate(offsetDays = 0): string {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function daySeed(date: string): number {
  return [...date].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

export interface DailyMission {
  page: AppPage
  eyebrow: string
  prompt: string
}

export function useDailyJourney(currentPage: AppPage) {
  const today = localDate()
  const [state, setState] = useState<DailyJourneyState>(() => {
    const saved = getStorageItem<DailyJourneyState | null>(STORAGE_KEY, null).data
    const sameDay = saved?.lastVisit === today
    const continued = saved?.lastVisit === localDate(-1)
    return {
      date: today,
      lastVisit: today,
      streak: sameDay ? Math.max(1, saved?.streak ?? 1) : continued ? (saved?.streak ?? 0) + 1 : 1,
      visited: saved?.date === today ? saved.visited : [],
    }
  })

  useEffect(() => {
    setState((previous) => {
      if (previous.visited.includes(currentPage)) return previous
      return { ...previous, visited: [...previous.visited, currentPage] }
    })
  }, [currentPage])

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
    return [daily[seed % daily.length], reflection[(seed + 1) % reflection.length], explore[(seed + 2) % explore.length]]
  }, [today])

  return {
    streak: state.streak,
    missions,
    completed: missions.filter((mission) => state.visited.includes(mission.page)).length,
    visited: state.visited,
  }
}
