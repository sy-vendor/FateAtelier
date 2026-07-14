import { APP_FEATURES } from '../../constants/appFeatures'
import type { AppPage } from '../../types/appPage'
import type { DailyMission } from '../../hooks/useDailyJourney'
import { FeatureIcon } from './FeatureIcon'

interface DailyJourneyProps {
  streak: number
  missions: DailyMission[]
  visited: AppPage[]
  completed: number
  onSelect: (page: AppPage) => void
}

export default function DailyJourney({ streak, missions, visited, completed, onSelect }: DailyJourneyProps) {
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
          <p className="daily-journey__eyebrow">今日探索 · {completed}/{missions.length}</p>
          <h2 id="daily-journey-title" className="daily-journey__title">
            {allDone ? '今日的三颗星已全部点亮' : '给今天一点方向，也留一点偶然'}
          </h2>
        </div>
        <div className="daily-journey__streak" title="连续到访天数">
          <span aria-hidden>✦</span>
          <strong>{streak}</strong>
          <span>天连续</span>
        </div>
        <button className="daily-journey__toggle" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? '收起' : '展开'}
        </button>
      </div>

      <div className="daily-journey__progress" role="progressbar" aria-valuemin={0} aria-valuemax={missions.length} aria-valuenow={completed} aria-label={`今日已完成 ${completed} 项`}>
        <span style={{ width: `${(completed / missions.length) * 100}%` }} />
      </div>

      {expanded && <div className="daily-journey__missions">
        {missions.map((mission) => {
          const done = visited.includes(mission.page)
          const feature = APP_FEATURES.find((item) => item.page === mission.page)!
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
                <span className="daily-mission__eyebrow">{mission.eyebrow}</span>
                <strong>{feature.name}</strong>
                <span>{done ? '已点亮，可再次回看' : mission.prompt}</span>
              </span>
              <span className="daily-mission__arrow" aria-hidden>→</span>
            </button>
          )
        })}
      </div>}
      {expanded && allDone && <p className="daily-journey__tomorrow">明天会换一组新探索，你的连续记录会保留。</p>}
    </section>
  )
}
import { useEffect, useRef, useState } from 'react'
