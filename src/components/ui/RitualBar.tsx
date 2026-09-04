import { useTx } from '../../i18n/useTx'

export type RitualStepIndex = 1 | 2 | 3 | 4

export interface RitualStepDef {
  num: RitualStepIndex
  zh: string
  en: string
}

interface RitualBarProps {
  step: RitualStepIndex
  steps: readonly RitualStepDef[]
  ariaLabelZh: string
  ariaLabelEn: string
  /** Extra class on the root, e.g. `tools-ritual` or `picker-ritual`. */
  className?: string
}

export function RitualBar({ step, steps, ariaLabelZh, ariaLabelEn, className }: RitualBarProps) {
  const tx = useTx()
  const rootClass = ['ritual-steps', className].filter(Boolean).join(' ')

  return (
    <div className={rootClass} aria-label={tx(ariaLabelZh, ariaLabelEn)}>
      {steps.map(({ num, zh, en }) => {
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
