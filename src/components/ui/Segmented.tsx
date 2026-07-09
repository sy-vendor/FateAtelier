interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  block?: boolean
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  block,
}: SegmentedProps<T>) {
  return (
    <div className={`segmented${block ? ' segmented--block' : ''}`} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          className={`segmented__item${value === opt.value ? ' segmented__item--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
