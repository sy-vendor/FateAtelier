import { lazy, Suspense, useEffect } from 'react'
import { useTarotGame } from '../../hooks/useTarotGame'
import { tarotCards } from '../../data/tarotCards'
import TarotMainView from './TarotMainView'

const TarotLibrary = lazy(() => import('../tarot/TarotLibrary'))

/** Keep the full deck and tarot state out of every non-tarot entry bundle. */
export default function TarotFeatureRoute() {
  const tarot = useTarotGame()

  useEffect(() => {
    const match = window.location.pathname.match(/^\/tarot\/card\/(\d+)\/?$/)
    if (!match) return
    const card = tarotCards.find((item) => item.id === Number(match[1]))
    if (card) tarot.handleSelectCardFromBrowser(card)
  }, [tarot.handleSelectCardFromBrowser])

  return (
    <>
      <div className="tarot-route-tools">
        <Suspense fallback={null}>
          <TarotLibrary onSelectCard={tarot.handleSelectCardFromBrowser} />
        </Suspense>
      </div>
      <TarotMainView {...tarot} />
    </>
  )
}
