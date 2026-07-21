import { useTx } from '../../i18n/useTx'

interface FengshuiRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '定用', en: 'Purpose' },
  { num: 2, zh: '旋盘', en: 'Compass' },
  { num: 3, zh: '察方', en: 'Direction' },
  { num: 4, zh: '明吉', en: 'Insight' },
] as const

export function FengshuiRitualBar({ step }: FengshuiRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps fengshui-ritual" aria-label={tx('风水罗盘流程', 'Feng shui compass steps')}>
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
