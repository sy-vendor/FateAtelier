import { useTx } from '../../i18n/useTx'

interface TarotRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '静心', labelEn: 'Center' },
  { num: 2, label: '选阵', labelEn: 'Choose' },
  { num: 3, label: '抽牌', labelEn: 'Draw' },
  { num: 4, label: '解读', labelEn: 'Read' },
] as const

export function TarotRitualBar({ step }: TarotRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps tarot-ritual" aria-label={tx('占卜流程', 'Reading flow')}>
      {STEPS.map(({ num, label, labelEn }) => {
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
            <span className="ritual-step__label">{tx(label, labelEn)}</span>
          </div>
        )
      })}
    </div>
  )
}
