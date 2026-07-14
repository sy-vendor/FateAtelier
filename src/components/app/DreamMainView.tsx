import type { CSSProperties } from 'react'
import { DREAM_BRAND, DREAM_BRAND_EN, MOOD_OPTIONS, getCategoryColor } from '../../utils/dreamData'
import { useDreamGame } from '../../hooks/useDreamGame'
import { DreamLogoMark } from '../dream/DreamLogoMark'
import { DreamRitualBar } from '../dream/DreamRitualBar'
import { Panel, Button, Segmented } from '../ui'
import './dream-stage.css'
import NextJourney from './NextJourney'

function DreamMainView() {
  const {
    dreamContent,
    setDreamContent,
    selectedMood,
    setSelectedMood,
    interpretation,
    phase,
    ritualStep,
    inputError,
    setInputError,
    history,
    showHistory,
    setShowHistory,
    resultSectionRef,
    symbolCount,
    moonLabel,
    handleInterpret,
    handleClear,
    handleViewHistory,
    handleDeleteHistory,
    resetForNewDream,
    formatDreamDate,
    getMoodLabel,
  } = useDreamGame()

  const isInterpreting = phase === 'interpreting'
  const showResult = phase === 'revealed' && interpretation !== null

  const handleMoonClick = () => {
    if (phase === 'revealed') {
      resetForNewDream()
      return
    }
    if (!isInterpreting) {
      handleInterpret()
    }
  }

  return (
    <div className="dream-stage">
      <header className="dream-hero">
        <div className="dream-hero__mark">
          <DreamLogoMark size="lg" />
        </div>
        <div>
          <p className="dream-hero__brand">{DREAM_BRAND}</p>
          <p className="dream-hero__brand-en">{DREAM_BRAND_EN}</p>
          <p className="dream-hero__hint">趁记忆尚新，述梦于月华之下，探潜意识幽径</p>
        </div>
      </header>

      <DreamRitualBar step={ritualStep} />

      {!showResult && (
        <section className="dream-mood">
          <h2 className="dream-mood__title">梦中情绪</h2>
          <p className="dream-mood__sub">选择醒后残留的感受，解梦会据此微调解读</p>
          <div style={{ opacity: isInterpreting ? 0.6 : 1, pointerEvents: isInterpreting ? 'none' : 'auto' }}>
            <Segmented
              block
              value={selectedMood}
              options={[...MOOD_OPTIONS]}
              onChange={setSelectedMood}
            />
          </div>
        </section>
      )}

      <section
        className={[
          'dream-shrine',
          `dream-shrine--${phase}`,
          showResult ? 'dream-shrine--collapsed' : '',
        ].filter(Boolean).join(' ')}
        aria-label="月轮解梦"
      >
        {showResult ? (
          <div className="dream-shrine__done">
            <div className="dream-shrine__done-moon" aria-hidden>
              <span className="dream-shrine__done-disc" />
            </div>
            <div className="dream-shrine__done-copy">
              <p className="dream-shrine__done-eyebrow">Dream revealed</p>
              <p className="dream-shrine__done-title">梦意已显</p>
              <p className="dream-shrine__done-sub">解读在下方展开；若要再录一场新梦，点这里重新开始</p>
            </div>
            <Button variant="ghost" small onClick={resetForNewDream}>
              再入新梦
            </Button>
          </div>
        ) : (
          <>
            <div className="dream-shrine__copy">
              <p className="dream-shrine__eyebrow">Night ritual</p>
              <h2 className="dream-shrine__title">述梦于月下</h2>
              <p className="dream-shrine__hint">
                {phase === 'interpreting'
                  ? '梦雾正在流转，稍候片刻'
                  : phase === 'recount'
                    ? '梦境已录，轻触月轮或下方按钮开始解析'
                    : '在右侧写下记忆尚新的片段，也可轻触月轮启程'}
              </p>
            </div>

            <div className="dream-portal">
              <button
                type="button"
                className={['dream-moon', `dream-moon--${phase}`].join(' ')}
                onClick={handleMoonClick}
                disabled={isInterpreting}
                aria-label="开始解析梦境"
              >
                <span className="dream-moon__orbit" aria-hidden>
                  <span className="dream-moon__star dream-moon__star--1" />
                  <span className="dream-moon__star dream-moon__star--2" />
                  <span className="dream-moon__star dream-moon__star--3" />
                </span>
                <span className="dream-moon__aura" aria-hidden />
                <div className="dream-moon-body">
                  <div className="dream-moon-disc">
                    <span className="dream-moon-crater dream-moon-crater--a" aria-hidden />
                    <span className="dream-moon-crater dream-moon-crater--b" aria-hidden />
                    <span className="dream-moon-shadow" aria-hidden />
                  </div>
                  <div className="dream-mist" aria-hidden>
                    {Array.from({ length: 8 }, (_, i) => (
                      <span key={i} className="dream-mist-particle" />
                    ))}
                  </div>
                </div>
                <span className="dream-moon-label">{moonLabel}</span>
              </button>

              <div className="dream-input-panel">
                <div className="field">
                  <label htmlFor="dream-content" className="field__label">
                    描述你的梦境
                  </label>
                  <textarea
                    id="dream-content"
                    className="field__textarea"
                    placeholder="例如：我梦见一条大蛇在追我，我拼命地跑，最后跳进了一条河里……"
                    value={dreamContent}
                    onChange={(e) => {
                      setDreamContent(e.target.value)
                      if (inputError) setInputError('')
                    }}
                    rows={5}
                    disabled={isInterpreting}
                  />
                  {inputError && <p className="dream-input-error" role="alert">{inputError}</p>}
                </div>

                <div className="dream-actions">
                  <Button
                    variant="primary"
                    onClick={handleInterpret}
                    disabled={isInterpreting || !dreamContent.trim()}
                    aria-label="开始解析梦境"
                    aria-busy={isInterpreting}
                  >
                    {isInterpreting ? '梦雾流转中…' : '开始解梦'}
                  </Button>
                  {dreamContent && (
                    <Button onClick={handleClear} disabled={isInterpreting} aria-label="清空输入内容">
                      清空
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowHistory(!showHistory)}
                    aria-label={showHistory ? '隐藏历史记录' : '查看历史记录'}
                    aria-expanded={showHistory}
                  >
                    {showHistory ? '隐藏历史' : '查看历史'}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {showHistory && history.length > 0 && (
        <Panel title="解析历史">
          <div className="dream-symbol-grid" style={{ gridTemplateColumns: '1fr' }}>
            {history.map((record) => (
              <article key={record.id} className="dream-history-card">
                <p className="dream-history-card__content">{record.content}</p>
                <span className="dream-history-card__meta">
                  {formatDreamDate(record.timestamp)}
                  {record.mood ? ` · ${getMoodLabel(record.mood)}` : ''}
                  {record.interpretation.symbols.length > 0
                    ? ` · ${record.interpretation.symbols.length} 个符号`
                    : ''}
                </span>
                <div className="dream-actions" style={{ marginTop: 12 }}>
                  <Button small onClick={() => handleViewHistory(record)}>
                    查看
                  </Button>
                  <Button small onClick={() => handleDeleteHistory(record.id)}>
                    删除
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      )}

      {showHistory && history.length === 0 && (
        <Panel>
          <p className="prose">暂无历史记录</p>
          <p className="callout">解析过的梦境会显示在这里。</p>
        </Panel>
      )}

      {showResult && interpretation && (
        <section ref={resultSectionRef} className="dream-result" aria-label="解梦结果">
          <div className="dream-result__banner">
            <div className="dream-result__icon" aria-hidden>
              ☽
            </div>
            <div>
              <h2 className="dream-result__title">梦意已显</h2>
              <p className="dream-result__sub">
                {selectedMood ? `情绪基调：${getMoodLabel(selectedMood)} · ` : ''}
                静心体悟，勿执于一解
              </p>
            </div>
            {symbolCount > 0 && (
              <span className="dream-symbol-count">{symbolCount} 符号</span>
            )}
          </div>

          <Panel title="梦意总览">
            <p className="prose">{interpretation.overview}</p>
            {interpretation.emotionalTone && (
              <p className="callout" style={{ marginTop: 12 }}>{interpretation.emotionalTone}</p>
            )}
          </Panel>

          {interpretation.themes && (
            <Panel title="主题脉络">
              <p className="prose">{interpretation.themes}</p>
            </Panel>
          )}

          {interpretation.symbolNarrative && (
            <Panel title="符号串联">
              <p className="prose">{interpretation.symbolNarrative}</p>
            </Panel>
          )}

          {interpretation.symbols.length > 0 && (
            <Panel title="梦境符号" description="从梦中浮出的鲜明意象，可与上文串联对照阅读">
              <div
                className={[
                  'dream-symbol-grid',
                  interpretation.symbols.length === 1 ? 'dream-symbol-grid--single' : '',
                ].filter(Boolean).join(' ')}
              >
                {interpretation.symbols.map((symbol, index) => {
                  const accent = getCategoryColor(symbol.category)
                  return (
                    <article
                      key={index}
                      className="dream-symbol-card"
                      style={{ '--symbol-accent': accent } as CSSProperties}
                    >
                      <div className="dream-symbol-card__head">
                        <div className="dream-symbol-card__identity">
                          <span className="dream-symbol-card__glyph" aria-hidden>
                            {symbol.matchedKeyword.slice(0, 1)}
                          </span>
                          <div>
                            <h3 className="dream-symbol-card__title">
                              {symbol.matchedKeyword}
                              <span className="dream-symbol-card__subtitle">{symbol.meaning}</span>
                            </h3>
                          </div>
                        </div>
                        <span className="dream-category-tag">{symbol.category}</span>
                      </div>

                      <p className="dream-symbol-card__text">{symbol.interpretation}</p>

                      <div className="dream-symbol-card__aspects">
                        <div className="dream-symbol-aspect dream-symbol-aspect--good">
                          <span className="dream-symbol-aspect__label">吉象</span>
                          <p className="dream-symbol-aspect__text">{symbol.positive}</p>
                        </div>
                        <div className="dream-symbol-aspect dream-symbol-aspect--warn">
                          <span className="dream-symbol-aspect__label">留意</span>
                          <p className="dream-symbol-aspect__text">{symbol.negative}</p>
                        </div>
                        <div className="dream-symbol-aspect dream-symbol-aspect--tip">
                          <span className="dream-symbol-aspect__label">建议</span>
                          <p className="dream-symbol-aspect__text">{symbol.advice}</p>
                        </div>
                      </div>

                      {symbol.themes.length > 0 && (
                        <div className="dream-symbol-card__themes">
                          {symbol.themes.map((theme) => (
                            <span key={theme} className="dream-theme-tag">{theme}</span>
                          ))}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </Panel>
          )}

          <Panel title="启示建议">
            <p className="prose">{interpretation.advice}</p>
          </Panel>

          <Panel title="反思手记">
            <p className="prose">{interpretation.reflection}</p>
          </Panel>

          <p className="callout">
            梦境解析仅供参考，每个人的梦境都有其独特性。最重要的是关注梦境带给你的感受和启发。
          </p>
          <NextJourney from="dream" />
        </section>
      )}

      {!showResult && !showHistory && (
        <Panel title="述梦要诀">
          <ul className="dream-tips">
            <li>趁记忆尚新时记录，人物、场景、动作与感受越细越好</li>
            <li>细节往往比整体情节更能揭示潜意识的信息</li>
            <li>记录时尽量客观陈述，不必急于赋予意义</li>
            <li>定期回顾梦境日志，或能发现潜藏的模式</li>
            <li>解梦是启发而非定论，内心的感受才是最终指引</li>
          </ul>
        </Panel>
      )}
    </div>
  )
}

export default DreamMainView
