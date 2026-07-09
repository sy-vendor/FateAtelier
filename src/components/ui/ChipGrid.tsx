interface ChipItem {
  id: string
  icon?: string
  label: string
}

interface ChipGridProps {
  items: ChipItem[]
  value: string
  onChange: (id: string) => void
  wide?: boolean
  zodiac?: boolean
}

export function ChipGrid({ items, value, onChange, wide, zodiac }: ChipGridProps) {
  return (
    <div
      className={[
        'chip-grid',
        wide ? 'chip-grid--wide' : '',
        zodiac ? 'chip-grid--zodiac' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`chip${value === item.id ? ' chip--active' : ''}`}
          onClick={() => onChange(item.id)}
          title={item.label}
        >
          {item.icon && <span className="chip__icon">{item.icon}</span>}
          <span className="chip__label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
