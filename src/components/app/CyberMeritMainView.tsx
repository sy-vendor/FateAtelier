import {
  CYBER_MERIT_BRAND,
  CYBER_MERIT_BRAND_EN,
  MERIT_GAMES,
  RELEASE_CREATURES,
  type MeritGameType,
} from '../../utils/cyberMeritData'
import { useCyberMeritGame } from '../../hooks/useCyberMeritGame'
import { CyberMeritLogoMark } from '../cyber-merit/CyberMeritLogoMark'
import { CyberMeritRitualBar } from '../cyber-merit/CyberMeritRitualBar'
import { MeritGameIcon } from '../cyber-merit/MeritGameIcon'
import { ReleaseCreatureIcon } from '../cyber-merit/ReleaseCreatureIcon'
import { Button, Segmented } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './cyber-merit-stage.css'

const GAME_LABEL_EN: Record<MeritGameType, string> = {
  woodfish: 'Woodfish',
  release: 'Release',
  incense: 'Incense',
  prayer: 'Prayer',
}

const GAME_TITLE_EN: Record<MeritGameType, string> = {
  woodfish: 'Tap the digital woodfish',
  release: 'Cyber release',
  incense: 'Cyber incense',
  prayer: 'Cyber prayer',
}

const GAME_DESC_EN: Record<MeritGameType, string> = {
  woodfish: 'Tap the woodfish for merit with each strike; auto mode available',
  release: 'Release creatures back to nature and accumulate compassion',
  incense: 'Light incense in devotion as fragrant smoke rises',
  prayer: 'Press your palms together with sincerity and receive blessings',
}

const GAME_HINT_EN: Record<MeritGameType, string> = {
  woodfish: 'Tap the woodfish · +1 merit each',
  release: 'Tap a creature to release · +3 merit each',
  incense: 'Tap the censer · +2 merit each',
  prayer: 'Tap to pray · +5 merit each',
}

const CREATURE_NAME_EN: Record<string, string> = {
  carp: 'Spirit carp',
  koi: 'Koi',
  turtle: 'Spirit turtle',
  dove: 'White dove',
  butterfly: 'Mystic butterfly',
  gecko: 'Spirit gecko',
}

function CyberMeritMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const {
    activeGame,
    selectGame,
    counts,
    totalMerit,
    activeGameInfo,
    ritualStep,
    isAutoPlaying,
    toggleAutoWoodfish,
    floatingTexts,
    currentMessage,
    isKnocking,
    releasingAnimal,
    isBurning,
    isPraying,
    knockWoodfish,
    releaseLife,
    burnIncense,
    pray,
  } = useCyberMeritGame()

  const gameTabOptions = MERIT_GAMES.map((g) => ({
    value: g.id,
    label: tx(g.label, GAME_LABEL_EN[g.id]),
  }))

  const gameTitle = tx(activeGameInfo.title, GAME_TITLE_EN[activeGame])
  const gameDescription = tx(activeGameInfo.description, GAME_DESC_EN[activeGame])
  const gameHint = tx(activeGameInfo.hint, GAME_HINT_EN[activeGame])

  return (
    <div className="cm-stage">
      <header className="cm-hero">
        <div className="cm-hero__mark">
          <CyberMeritLogoMark size="lg" />
        </div>
        <div>
          <p className="cm-hero__brand">{tx(CYBER_MERIT_BRAND, CYBER_MERIT_BRAND_EN)}</p>
          <p className="cm-hero__brand-en">{isEnglish ? CYBER_MERIT_BRAND_EN.toUpperCase() : CYBER_MERIT_BRAND_EN}</p>
          <p className="cm-hero__hint">{tx('电子木鱼、赛博放生、上香祈福，一键积功德', 'Digital woodfish, cyber release, incense, and prayer — merit in one tap')}</p>
        </div>
      </header>

      <CyberMeritRitualBar step={ritualStep} />

      <section className="cm-stats" aria-label={tx('功德统计', 'Merit stats')}>
        <div className="cm-stats__primary">
          <span className="cm-stats__value">{totalMerit}</span>
          <span className="cm-stats__label">{tx('总功德', 'Total merit')}</span>
        </div>
        <div className="cm-stats__grid">
          {MERIT_GAMES.map((game) => (
            <div
              key={game.id}
              className={[
                'cm-stats__item',
                activeGame === game.id ? 'cm-stats__item--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="cm-stats__item-icon" aria-hidden>
                <MeritGameIcon game={game.id} size="sm" />
              </span>
              <span className="cm-stats__item-count">{counts[game.id]}</span>
              <span className="cm-stats__item-label">{tx(game.label, GAME_LABEL_EN[game.id])}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cm-mode">
        <h2 className="cm-mode__title">{tx('修行法门', 'Practice modes')}</h2>
        <Segmented block value={activeGame} options={gameTabOptions} onChange={selectGame} />
      </section>

      <section className="cm-shrine" aria-label={gameTitle}>
        <div className="cm-shrine__head">
          <h2 className="cm-shrine__title">{gameTitle}</h2>
          <p className="cm-shrine__sub">{gameDescription}</p>
        </div>

        {activeGame === 'woodfish' && (
          <div className="cm-woodfish-game">
            <div className="cm-woodfish-container">
              <div
                className={[
                  'cm-woodfish',
                  isAutoPlaying ? 'cm-playing' : '',
                  isKnocking ? 'cm-knocking' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={(e) => knockWoodfish(e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') knockWoodfish()
                }}
                role="button"
                tabIndex={0}
                aria-label={tx('敲木鱼', 'Tap woodfish')}
              >
                <div className="cm-woodfish-body">
                  <div className="cm-woodfish-top" />
                  <div className="cm-woodfish-bottom" />
                  <div className="cm-woodfish-mouth" />
                  <div className="cm-woodfish-pattern" />
                </div>
                <div className={`cm-woodfish-stick ${isKnocking ? 'striking' : ''}`}>
                  <div className="cm-stick-head" />
                  <div className="cm-stick-handle" />
                </div>
              </div>
            </div>
            {currentMessage && <p className="cm-current-message">{currentMessage}</p>}
            <Button variant={isAutoPlaying ? 'primary' : 'ghost'} onClick={toggleAutoWoodfish}>
              {isAutoPlaying ? tx('停止自动', 'Stop auto') : tx('自动敲击', 'Auto tap')}
            </Button>
            <p className="cm-shrine__hint">
              {gameHint} · {tx(`已敲 ${counts.woodfish} 次`, `${counts.woodfish} taps`)}
            </p>
          </div>
        )}

        {activeGame === 'release' && (
          <div className="cm-release-game">
            <div className="cm-release-pond" aria-hidden>
              <span className="cm-release-pond__ripple cm-release-pond__ripple--1" />
              <span className="cm-release-pond__ripple cm-release-pond__ripple--2" />
            </div>
            <div className="cm-release-container">
              <div className="cm-release-animals">
                {RELEASE_CREATURES.map((creature, index) => {
                  const isReleasing = releasingAnimal?.index === index
                  const motion = isReleasing ? releasingAnimal.motion : creature.motion
                  return (
                    <button
                      key={creature.id}
                      type="button"
                      className={[
                        'cm-release-slot',
                        isReleasing ? 'cm-release-slot--releasing' : '',
                        `cm-release-slot--${creature.motion}`,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={(e) => releaseLife(e, index)}
                      disabled={isReleasing}
                      aria-label={tx(`放生${creature.name}`, `Release ${CREATURE_NAME_EN[creature.id] ?? creature.name}`)}
                    >
                      <span className="cm-release-slot__ring" aria-hidden />
                      <span
                        className={[
                          'cm-release-slot__icon',
                          isReleasing ? `cm-release-slot__icon--${motion}` : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <ReleaseCreatureIcon creature={creature.id} size="xl" />
                      </span>
                      <span className="cm-release-slot__name">
                        {tx(creature.name, CREATURE_NAME_EN[creature.id] ?? creature.name)}
                      </span>
                      {isReleasing && (
                        <span className="cm-release-slot__merit" aria-hidden>+3</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            {currentMessage && <p className="cm-current-message">{currentMessage}</p>}
            <p className="cm-shrine__hint">
              {gameHint} · {tx(`已放生 ${counts.release} 次`, `${counts.release} releases`)}
            </p>
          </div>
        )}

        {activeGame === 'incense' && (
          <div className="cm-incense-game">
            <div className="cm-incense-container">
              <button
                type="button"
                className="cm-incense-burner"
                onClick={(e) => burnIncense(e)}
                disabled={isBurning}
                aria-label={tx('上香', 'Light incense')}
              >
                <div className={`cm-incense-stick ${isBurning ? 'burning' : ''}`}>
                  <div className="cm-stick-tip" />
                  <div className="cm-stick-body">
                    <div className="cm-burn-progress" />
                  </div>
                </div>
                <div className="cm-censer">
                  <div className="cm-censer-mouth" />
                  <div className="cm-censer-body" />
                  <div className="cm-censer-legs">
                    <div className="cm-leg cm-leg-1" />
                    <div className="cm-leg cm-leg-2" />
                    <div className="cm-leg cm-leg-3" />
                  </div>
                </div>
              </button>
            </div>
            {currentMessage && <p className="cm-current-message">{currentMessage}</p>}
            <p className="cm-shrine__hint">
              {isBurning ? tx('香火燃烧中…', 'Incense burning…') : gameHint} · {tx(`已上香 ${counts.incense} 次`, `${counts.incense} offerings`)}
            </p>
          </div>
        )}

        {activeGame === 'prayer' && (
          <div className="cm-prayer-game">
            <div className="cm-prayer-container">
              <button
                type="button"
                className={`cm-prayer-icon ${isPraying ? 'praying' : ''}`}
                onClick={(e) => pray(e)}
                disabled={isPraying}
                aria-label={tx('祈福', 'Pray')}
              >
                🙏
              </button>
              <div className="cm-prayer-lights">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`cm-prayer-light ${isPraying ? 'active' : ''}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              {isPraying && (
                <div className="cm-prayer-particles">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="cm-prayer-particle"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
            {currentMessage && <p className="cm-current-message">{currentMessage}</p>}
            <p className="cm-shrine__hint">
              {isPraying ? tx('祈福中…', 'Praying…') : gameHint} · {tx(`已祈福 ${counts.prayer} 次`, `${counts.prayer} prayers`)}
            </p>
          </div>
        )}
      </section>

      {floatingTexts.map((text) => (
        <div
          key={text.id}
          className={`cm-floating-text ${text.type}`}
          style={{ left: `${text.x}px`, top: `${text.y}px` }}
        >
          {text.text}
        </div>
      ))}
    </div>
  )
}

export default CyberMeritMainView
