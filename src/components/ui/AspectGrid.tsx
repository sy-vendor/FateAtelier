interface AspectItem {
  title: string
  score: number
  text: string
}

interface AspectGridProps {
  items: AspectItem[]
}

export function AspectGrid({ items }: AspectGridProps) {
  return (
    <div className="aspect-grid">
      {items.map((item) => (
        <article key={item.title} className="aspect">
          <div className="aspect__head">
            <span className="aspect__title">{item.title}</span>
            <span className="aspect__score">{item.score}</span>
          </div>
          <p className="aspect__text">{item.text}</p>
        </article>
      ))}
    </div>
  )
}
