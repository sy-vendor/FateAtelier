import { useTx } from '../../i18n/useTx'

interface QimenRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '择时', en: 'Timing' },
  { num: 2, zh: '定方', en: 'Direction' },
  { num: 3, zh: '排盘', en: 'Chart' },
  { num: 4, zh: '悟机', en: 'Insight' },
] as const

export function QimenRitualBar({ step }: QimenRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps qimen-ritual" aria-label={tx('奇门流程', 'Qi Men steps')}>
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
