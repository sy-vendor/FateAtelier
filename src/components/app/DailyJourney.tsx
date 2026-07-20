import { useEffect, useRef, useState } from 'react'
import { APP_FEATURES } from '../../constants/appFeatures'
import type { AppPage } from '../../types/appPage'
import type { DailyMission } from '../../hooks/useDailyJourney'
import { FeatureIcon } from './FeatureIcon'
import { useLocale } from '../../i18n/LocaleContext'

const MISSION_EN: Partial<Record<AppPage, { eyebrow: string; prompt: string }>> = {
  horoscope: { eyebrow: 'Today’s sky', prompt: 'See where your energy flows best today' },
  almanac: { eyebrow: 'Daily rhythm', prompt: 'Explore favorable activities and hours' },
  luckycolor: { eyebrow: 'Color cue', prompt: 'Discover today’s inspiring palette' },
  tarot: { eyebrow: 'One thought, one card', prompt: 'Draw a card for what matters most now' },
  divination: { eyebrow: 'Daily oracle', prompt: 'Ask one clear question and draw a sign' },
  dream: { eyebrow: 'A note from dreams', prompt: 'Follow one symbol to its emotional thread' },
  cybermerit: { eyebrow: 'A quiet pause', prompt: 'Clear your mind with a mindful ritual' },
  numberenergy: { eyebrow: 'Number patterns', prompt: 'Read a number you have noticed lately' },
  shengxiao: { eyebrow: 'Relationship insight', prompt: 'See how two zodiac signs connect' },
  nametest: { eyebrow: 'Inside a name', prompt: 'Explore a name through sound and strokes' },
}

interface DailyJourneyProps {
  streak: number
  missions: DailyMission[]
  visited: AppPage[]
  completed: number
  onSelect: (page: AppPage) => void
}

export default function DailyJourney({ streak, missions, visited, completed, onSelect }: DailyJourneyProps) {
  const { isEnglish } = useLocale()
  const allDone = completed === missions.length
  const [expanded, setExpanded] = useState(completed === 0)
  const previousCompleted = useRef(completed)

  useEffect(() => {
    if (completed > previousCompleted.current) setExpanded(false)
    previousCompleted.current = completed
  }, [completed])

  return (
    <section className={`daily-journey${allDone ? ' daily-journey--done' : ''}${expanded ? '' : ' daily-journey--compact'}`} aria-labelledby="daily-journey-title">
      <div className="daily-journey__head">
        <div>
          <p className="daily-journey__eyebrow">{isEnglish ? 'TODAY’S JOURNEY' : '今日探索'} · {completed}/{missions.length}</p>
          <h2 id="daily-journey-title" className="daily-journey__title">
            {isEnglish
              ? (allDone ? 'All three stars are shining today' : 'A little direction, with room for surprise')
              : (allDone ? '今日的三颗星已全部点亮' : '给今天一点方向，也留一点偶然')}
          </h2>
        </div>
        <div className="daily-journey__streak" title={isEnglish ? 'Consecutive visit days' : '连续到访天数'}>
          <span aria-hidden>✦</span>
          <strong>{streak}</strong>
          <span>{isEnglish ? 'day streak' : '天连续'}</span>
        </div>
        <button className="daily-journey__toggle" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? (isEnglish ? 'Collapse' : '收起') : (isEnglish ? 'Expand' : '展开')}
        </button>
      </div>

      <div className="daily-journey__progress" role="progressbar" aria-valuemin={0} aria-valuemax={missions.length} aria-valuenow={completed} aria-label={isEnglish ? `${completed} completed today` : `今日已完成 ${completed} 项`}>
        <span style={{ width: `${(completed / missions.length) * 100}%` }} />
      </div>

      {expanded && <div className="daily-journey__missions">
        {missions.map((mission) => {
          const done = visited.includes(mission.page)
          const feature = APP_FEATURES.find((item) => item.page === mission.page)!
          const translated = MISSION_EN[mission.page]
          return (
            <button
              key={mission.page}
              type="button"
              className={`daily-mission${done ? ' daily-mission--done' : ''}`}
              onClick={() => onSelect(mission.page)}
            >
              <span className="daily-mission__icon" aria-hidden>
                {done ? '✓' : <FeatureIcon page={mission.page} size="sm" />}
              </span>
              <span className="daily-mission__copy">
                <span className="daily-mission__eyebrow">{isEnglish ? translated?.eyebrow : mission.eyebrow}</span>
                <strong>{isEnglish ? feature.nameEn : feature.name}</strong>
                <span>{done ? (isEnglish ? 'Complete — revisit anytime' : '已点亮，可再次回看') : (isEnglish ? translated?.prompt : mission.prompt)}</span>
              </span>
              <span className="daily-mission__arrow" aria-hidden>→</span>
            </button>
          )
        })}
      </div>}
      {expanded && allDone && <p className="daily-journey__tomorrow">{isEnglish ? 'A new journey arrives tomorrow. Your streak will be saved.' : '明天会换一组新探索，你的连续记录会保留。'}</p>}
    </section>
  )
}
