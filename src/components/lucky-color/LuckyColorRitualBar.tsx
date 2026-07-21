import { useTx } from '../../i18n/useTx'

interface LuckyColorRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '定日', en: 'Date' },
  { num: 2, zh: '赋色', en: 'Color' },
  { num: 3, zh: '感能', en: 'Energy' },
  { num: 4, zh: '习用', en: 'Apply' },
] as const

export function LuckyColorRitualBar({ step }: LuckyColorRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps lucky-color-ritual" aria-label={tx('幸运色流程', 'Lucky color steps')}>
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
