import { useMemo, type CSSProperties } from 'react'
import { DREAM_BRAND, DREAM_BRAND_EN, MOOD_OPTIONS, getCategoryColor } from '../../utils/dreamData'
import { useDreamGame } from '../../hooks/useDreamGame'
import { DreamLogoMark } from '../dream/DreamLogoMark'
import { DreamRitualBar } from '../dream/DreamRitualBar'
import { Panel, Button, Segmented } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './dream-stage.css'
import NextJourney from './NextJourney'

const MOOD_LABEL_EN: Record<string, string> = {
  '': 'None',
  calm: 'Calm',
  fear: 'Fear',
  joy: 'Joy',
  confused: 'Confused',
  sad: 'Sad',
}

function DreamMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
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

  const moodOptions = useMemo(
    () => MOOD_OPTIONS.map((o) => ({ ...o, label: tx(o.label, MOOD_LABEL_EN[o.value] ?? o.label) })),
    [tx],
  )

  const moodLabel = (mood: string) => {
    const opt = MOOD_OPTIONS.find((o) => o.value === mood)
    return opt ? tx(opt.label, MOOD_LABEL_EN[opt.value] ?? opt.label) : getMoodLabel(mood)
  }

  const moonLabelText = useMemo(() => {
    switch (phase) {
      case 'slumber':
        return tx('月华静候 · 述梦以启', 'Moonlight awaits · describe your dream')
      case 'recount':
        return tx('梦境已录 · 轻触月轮解析', 'Dream recorded · tap the moon to interpret')
      case 'interpreting':
        return tx('梦雾流转中…', 'Dream mist swirling…')
      case 'revealed':
        return tx('梦意已显 · 再入新梦', 'Meaning revealed · begin a new dream')
      default:
        return ''
    }
  }, [phase, tx])

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
          <p className="dream-hero__brand">{tx(DREAM_BRAND, DREAM_BRAND_EN)}</p>
          <p className="dream-hero__brand-en">{isEnglish ? DREAM_BRAND_EN.toUpperCase() : DREAM_BRAND_EN}</p>
          <p className="dream-hero__hint">{tx('趁记忆尚新，述梦于月华之下，探潜意识幽径', 'While memory is fresh, tell your dream beneath the moonlight')}</p>
        </div>
      </header>

      <DreamRitualBar step={ritualStep} />

      {!showResult && (
        <section className="dream-mood">
          <h2 className="dream-mood__title">{tx('梦中情绪', 'Dream mood')}</h2>
          <p className="dream-mood__sub">{tx('选择醒后残留的感受，解梦会据此微调解读', 'Choose how you felt upon waking to fine-tune the reading')}</p>
          <div style={{ opacity: isInterpreting ? 0.6 : 1, pointerEvents: isInterpreting ? 'none' : 'auto' }}>
            <Segmented
              block
              value={selectedMood}
              options={moodOptions}
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
        aria-label={tx('月轮解梦', 'Moon dream ritual')}
      >
        {showResult ? (
          <div className="dream-shrine__done">
            <div className="dream-shrine__done-moon" aria-hidden>
              <span className="dream-shrine__done-disc" />
            </div>
            <div className="dream-shrine__done-copy">
              <p className="dream-shrine__done-eyebrow">Dream revealed</p>
              <p className="dream-shrine__done-title">{tx('梦意已显', 'Meaning revealed')}</p>
              <p className="dream-shrine__done-sub">{tx('解读在下方展开；若要再录一场新梦，点这里重新开始', 'The reading unfolds below. Tap here to record a new dream')}</p>
            </div>
            <Button variant="ghost" small onClick={resetForNewDream}>
              {tx('再入新梦', 'New dream')}
            </Button>
          </div>
        ) : (
          <>
            <div className="dream-shrine__copy">
              <p className="dream-shrine__eyebrow">Night ritual</p>
              <h2 className="dream-shrine__title">{tx('述梦于月下', 'Tell your dream by moonlight')}</h2>
              <p className="dream-shrine__hint">
                {phase === 'interpreting'
                  ? tx('梦雾正在流转，稍候片刻', 'Dream mist is swirling — one moment')
                  : phase === 'recount'
                    ? tx('梦境已录，轻触月轮或下方按钮开始解析', 'Dream recorded — tap the moon or the button below')
                    : tx('在右侧写下记忆尚新的片段，也可轻触月轮启程', 'Write fresh fragments on the right, or tap the moon to begin')}
              </p>
            </div>

            <div className="dream-portal">
              <button
                type="button"
                className={['dream-moon', `dream-moon--${phase}`].join(' ')}
                onClick={handleMoonClick}
                disabled={isInterpreting}
                aria-label={tx('开始解析梦境', 'Start dream interpretation')}
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
                <span className="dream-moon-label">{moonLabelText}</span>
              </button>

              <div className="dream-input-panel">
                <div className="field">
                  <label htmlFor="dream-content" className="field__label">
                    {tx('描述你的梦境', 'Describe your dream')}
                  </label>
                  <textarea
                    id="dream-content"
                    className="field__textarea"
                    placeholder={tx(
                      '例如：我梦见一条大蛇在追我，我拼命地跑，最后跳进了一条河里……',
                      'For example: I dreamed a large snake was chasing me. I ran hard and finally jumped into a river…',
                    )}
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
                    aria-label={tx('开始解析梦境', 'Start dream interpretation')}
                    aria-busy={isInterpreting}
                  >
                    {isInterpreting ? tx('梦雾流转中…', 'Dream mist swirling…') : tx('开始解梦', 'Interpret dream')}
                  </Button>
                  {dreamContent && (
                    <Button onClick={handleClear} disabled={isInterpreting} aria-label={tx('清空输入内容', 'Clear input')}>
                      {tx('清空', 'Clear')}
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowHistory(!showHistory)}
                    aria-label={showHistory ? tx('隐藏历史记录', 'Hide history') : tx('查看历史记录', 'View history')}
                    aria-expanded={showHistory}
                  >
                    {showHistory ? tx('隐藏历史', 'Hide history') : tx('查看历史', 'View history')}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {showHistory && history.length > 0 && (
        <Panel title={tx('解析历史', 'Interpretation history')}>
          <div className="dream-symbol-grid" style={{ gridTemplateColumns: '1fr' }}>
            {history.map((record) => (
              <article key={record.id} className="dream-history-card">
                <p className="dream-history-card__content">{record.content}</p>
                <span className="dream-history-card__meta">
                  {formatDreamDate(record.timestamp)}
                  {record.mood ? ` · ${moodLabel(record.mood)}` : ''}
                  {record.interpretation.symbols.length > 0
                    ? ` · ${tx(`${record.interpretation.symbols.length} 个符号`, `${record.interpretation.symbols.length} symbols`)}`
                    : ''}
                </span>
                <div className="dream-actions" style={{ marginTop: 12 }}>
                  <Button small onClick={() => handleViewHistory(record)}>
                    {tx('查看', 'View')}
                  </Button>
                  <Button small onClick={() => handleDeleteHistory(record.id)}>
                    {tx('删除', 'Delete')}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      )}

      {showHistory && history.length === 0 && (
        <Panel>
          <p className="prose">{tx('暂无历史记录', 'No history yet')}</p>
          <p className="callout">{tx('解析过的梦境会显示在这里。', 'Interpreted dreams will appear here.')}</p>
        </Panel>
      )}

      {showResult && interpretation && (
        <section ref={resultSectionRef} className="dream-result" aria-label={tx('解梦结果', 'Dream interpretation')}>
          <div className="dream-result__banner">
            <div className="dream-result__icon" aria-hidden>
              ☽
            </div>
            <div>
              <h2 className="dream-result__title">{tx('梦意已显', 'Meaning revealed')}</h2>
              <p className="dream-result__sub">
                {selectedMood ? `${tx('情绪基调', 'Mood')}: ${moodLabel(selectedMood)} · ` : ''}
                {tx('静心体悟，勿执于一解', 'Reflect calmly — no single reading is final')}
              </p>
            </div>
            {symbolCount > 0 && (
              <span className="dream-symbol-count">{tx(`${symbolCount} 符号`, `${symbolCount} symbols`)}</span>
            )}
          </div>

          <Panel title={tx('梦意总览', 'Overview')}>
            <p className="prose">{interpretation.overview}</p>
            {interpretation.emotionalTone && (
              <p className="callout" style={{ marginTop: 12 }}>{interpretation.emotionalTone}</p>
            )}
          </Panel>

          {interpretation.themes && (
            <Panel title={tx('主题脉络', 'Themes')}>
              <p className="prose">{interpretation.themes}</p>
            </Panel>
          )}

          {interpretation.symbolNarrative && (
            <Panel title={tx('符号串联', 'Symbol narrative')}>
              <p className="prose">{interpretation.symbolNarrative}</p>
            </Panel>
          )}

          {interpretation.symbols.length > 0 && (
            <Panel title={tx('梦境符号', 'Dream symbols')} description={tx('从梦中浮出的鲜明意象，可与上文串联对照阅读', 'Vivid images from the dream — read alongside the narrative above')}>
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
                          <span className="dream-symbol-aspect__label">{tx('吉象', 'Positive')}</span>
                          <p className="dream-symbol-aspect__text">{symbol.positive}</p>
                        </div>
                        <div className="dream-symbol-aspect dream-symbol-aspect--warn">
                          <span className="dream-symbol-aspect__label">{tx('留意', 'Caution')}</span>
                          <p className="dream-symbol-aspect__text">{symbol.negative}</p>
                        </div>
                        <div className="dream-symbol-aspect dream-symbol-aspect--tip">
                          <span className="dream-symbol-aspect__label">{tx('建议', 'Advice')}</span>
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

          <Panel title={tx('启示建议', 'Guidance')}>
            <p className="prose">{interpretation.advice}</p>
          </Panel>

          <Panel title={tx('反思手记', 'Reflection')}>
            <p className="prose">{interpretation.reflection}</p>
          </Panel>

          <p className="callout">
            {tx(
              '梦境解析仅供参考，每个人的梦境都有其独特性。最重要的是关注梦境带给你的感受和启发。',
              'Dream readings are for inspiration. Your own feelings and insights matter most.',
            )}
          </p>
          <NextJourney from="dream" />
        </section>
      )}

      {!showResult && !showHistory && (
        <Panel title={tx('述梦要诀', 'Dream journaling tips')}>
          <ul className="dream-tips">
            <li>{tx('趁记忆尚新时记录，人物、场景、动作与感受越细越好', 'Record while memory is fresh — people, scenes, actions, and feelings')}</li>
            <li>{tx('细节往往比整体情节更能揭示潜意识的信息', 'Details often reveal more than the overall plot')}</li>
            <li>{tx('记录时尽量客观陈述，不必急于赋予意义', 'Describe objectively before assigning meaning')}</li>
            <li>{tx('定期回顾梦境日志，或能发现潜藏的模式', 'Review your dream log regularly to spot patterns')}</li>
            <li>{tx('解梦是启发而非定论，内心的感受才是最终指引', 'Interpretation inspires — your inner feeling is the guide')}</li>
          </ul>
        </Panel>
      )}
    </div>
  )
}

export default DreamMainView
