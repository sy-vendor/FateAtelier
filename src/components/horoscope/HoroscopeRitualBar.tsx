import { useTx } from '../../i18n/useTx'

interface HoroscopeRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '选座', en: 'Choose' },
  { num: 2, zh: '定频', en: 'Timing' },
  { num: 3, zh: '观星', en: 'Reading' },
  { num: 4, zh: '万象', en: 'Insight' },
] as const

export function HoroscopeRitualBar({ step }: HoroscopeRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps horoscope-ritual" aria-label={tx('观星流程', 'Horoscope steps')}>
      {STEPS.map(({ num, zh, en }) => {
        const done = num < step
        const active = num === step
        const cls = [
          'ritual-step',
          done ? 'ritual-step--done' : '',
          active ? 'ritual-step--active' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div key={num} className={cls} aria-current={active ? 'step' : undefined}>
            <span className="ritual-step__num">{done ? '✓' : num}</span>
            <span className="ritual-step__label">{tx(zh, en)}</span>
          </div>
        )
      })}
    </div>
  )
}
