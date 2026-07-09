import type { CSSProperties } from 'react'
import type { TarotCard } from '../../data/tarotCards'
import { getCardIndexLabel, getCardTheme, getMajorTheme } from '../../utils/tarotCardArt'
import { getTarotArtImage } from '../../utils/tarotArtImages'
import { getMajorPalette } from '../../utils/majorPalettes'
import { TarotSuitIcon } from './TarotSuitIcon'
import { TarotRwsArt } from './TarotRwsArt'
import type { TarotCardVariant } from './TarotCardVisual'

interface TarotCardFaceProps {
  card: TarotCard
  isReversed?: boolean
  variant?: TarotCardVariant
}

function CornerIndex({ card }: { card: TarotCard }) {
  return (
    <>
      <span className="tarot-card-face__index">{getCardIndexLabel(card)}</span>
      {card.suit && <TarotSuitIcon suit={card.suit} variant="corner" />}
    </>
  )
}

function CardArt({ card, bare }: { card: TarotCard; bare: boolean }) {
  const src = getTarotArtImage(card)
  const theme = card.type === 'major' ? getMajorTheme(card.id) : getCardTheme(card)
  const palette = card.type === 'major' ? getMajorPalette(card.id) : null

  return (
    <div className="tarot-card-face__scene">
      <TarotRwsArt
        src={src}
        accent={theme.accent}
        gold={palette?.gold ?? theme.accent}
        skyTop={palette?.skyTop}
        skyBottom={palette?.skyBottom}
        bare={bare}
      />
    </div>
  )
}

export function TarotCardFace({ card, isReversed, variant = 'play' }: TarotCardFaceProps) {
  const bare = variant === 'library'
  const theme = card.type === 'major' ? getMajorTheme(card.id) : getCardTheme(card)
  const suitClass = card.suit ? `tarot-card-face--${card.suit}` : 'tarot-card-face--major'

  return (
    <div
      className={`tarot-card-face ${suitClass}${bare ? ' tarot-card-face--library' : ''}${isReversed ? ' tarot-card-face--reversed' : ''}`}
      style={
        {
          '--tarot-accent': theme.accent,
          '--tarot-accent-soft': theme.accentSoft,
          '--tarot-glow': theme.glow,
        } as CSSProperties
      }
    >
      <div className="tarot-card-face__plate">
        {!bare && (
          <>
            <div className="tarot-card-face__corner tarot-card-face__corner--tl">
              <CornerIndex card={card} />
            </div>
            <div className="tarot-card-face__corner tarot-card-face__corner--br">
              <CornerIndex card={card} />
            </div>
          </>
        )}

        <div className="tarot-card-face__art">
          <CardArt card={card} bare={bare} />
        </div>
      </div>
    </div>
  )
}
