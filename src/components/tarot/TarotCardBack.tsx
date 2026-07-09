import { DECK_NAME, DECK_NAME_EN } from '../../utils/tarotCardArt'

export function TarotCardBack() {
  return (
    <div className="tarot-card-back" aria-hidden>
      <svg className="tarot-card-back__pattern" viewBox="0 0 200 320" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="back-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 L0 20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="200" height="320" fill="url(#back-grid)" />
        <rect x="10" y="10" width="180" height="300" rx="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <rect x="18" y="18" width="164" height="284" rx="8" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="160"
            x2={100 + 70 * Math.cos((deg * Math.PI) / 180)}
            y2={160 + 70 * Math.sin((deg * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}
        <circle cx="100" cy="160" r="56" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <circle cx="100" cy="160" r="40" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
        <circle cx="100" cy="160" r="24" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
        <path
          d="M100 128 L106 148 L128 148 L110 160 L118 182 L100 170 L82 182 L90 160 L72 148 L94 148 Z"
          fill="currentColor"
          opacity="0.45"
        />
      </svg>
      <div className="tarot-card-back__brand">
        <span className="tarot-card-back__mark" aria-hidden>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M12 2 L14.5 9.5 L22 10 L16.5 14.5 L18.5 22 L12 18 L5.5 22 L7.5 14.5 L2 10 L9.5 9.5 Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="tarot-card-back__name">{DECK_NAME}</span>
        <span className="tarot-card-back__name-en">{DECK_NAME_EN}</span>
      </div>
    </div>
  )
}
