import {
  CYBER_MERIT_BRAND,
  CYBER_MERIT_BRAND_EN,
  MERIT_GAMES,
  RELEASE_CREATURES,
} from '../../utils/cyberMeritData'
import { useCyberMeritGame } from '../../hooks/useCyberMeritGame'
import { CyberMeritLogoMark } from '../cyber-merit/CyberMeritLogoMark'
import { CyberMeritRitualBar } from '../cyber-merit/CyberMeritRitualBar'
import { MeritGameIcon } from '../cyber-merit/MeritGameIcon'
import { ReleaseCreatureIcon } from '../cyber-merit/ReleaseCreatureIcon'
import { Button, Segmented } from '../ui'
import './cyber-merit-stage.css'

function CyberMeritMainView() {
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

  const gameTabOptions = MERIT_GAMES.map((g) => ({ value: g.id, label: g.label }))

  return (
    <div className="cm-stage">
      <header className="cm-hero">
        <div className="cm-hero__mark">
          <CyberMeritLogoMark size="lg" />
        </div>
        <div>
          <p className="cm-hero__brand">{CYBER_MERIT_BRAND}</p>
          <p className="cm-hero__brand-en">{CYBER_MERIT_BRAND_EN}</p>
          <p className="cm-hero__hint">电子木鱼、赛博放生、上香祈福，一键积功德</p>
        </div>
      </header>

      <CyberMeritRitualBar step={ritualStep} />

      <section className="cm-stats" aria-label="功德统计">
        <div className="cm-stats__primary">
          <span className="cm-stats__value">{totalMerit}</span>
          <span className="cm-stats__label">总功德</span>
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
              <span className="cm-stats__item-label">{game.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cm-mode">
        <h2 className="cm-mode__title">修行法门</h2>
        <Segmented block value={activeGame} options={gameTabOptions} onChange={selectGame} />
      </section>

      <section className="cm-shrine" aria-label={activeGameInfo.title}>
        <div className="cm-shrine__head">
          <h2 className="cm-shrine__title">{activeGameInfo.title}</h2>
          <p className="cm-shrine__sub">{activeGameInfo.description}</p>
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
                aria-label="敲木鱼"
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
              {isAutoPlaying ? '停止自动' : '自动敲击'}
            </Button>
            <p className="cm-shrine__hint">{activeGameInfo.hint} · 已敲 {counts.woodfish} 次</p>
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
                      aria-label={`放生${creature.name}`}
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
                      <span className="cm-release-slot__name">{creature.name}</span>
                      {isReleasing && (
                        <span className="cm-release-slot__merit" aria-hidden>+3</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            {currentMessage && <p className="cm-current-message">{currentMessage}</p>}
            <p className="cm-shrine__hint">{activeGameInfo.hint} · 已放生 {counts.release} 次</p>
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
                aria-label="上香"
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
              {isBurning ? '香火燃烧中…' : activeGameInfo.hint} · 已上香 {counts.incense} 次
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
                aria-label="祈福"
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
              {isPraying ? '祈福中…' : activeGameInfo.hint} · 已祈福 {counts.prayer} 次
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
