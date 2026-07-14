import { lazy, Suspense } from 'react'
import { useTarotGame } from '../../hooks/useTarotGame'
import TarotMainView from './TarotMainView'

const TarotLibrary = lazy(() => import('../tarot/TarotLibrary'))

/** Keep the full deck and tarot state out of every non-tarot entry bundle. */
export default function TarotFeatureRoute() {
  const tarot = useTarotGame()

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
