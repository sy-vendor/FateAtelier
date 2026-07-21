import { useTx } from '../../i18n/useTx'

interface DivinationRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '默念', en: 'Focus' },
  { num: 2, zh: '摇签', en: 'Shake' },
  { num: 3, zh: '揭签', en: 'Reveal' },
  { num: 4, zh: '悟签', en: 'Reflect' },
] as const

export function DivinationRitualBar({ step }: DivinationRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps divination-ritual" aria-label={tx('求签流程', 'Oracle draw steps')}>
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
