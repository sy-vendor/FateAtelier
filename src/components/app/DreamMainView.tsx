import { DREAM_BRAND, DREAM_BRAND_EN, MOOD_OPTIONS, getCategoryColor } from '../../utils/dreamData'
import { useDreamGame } from '../../hooks/useDreamGame'
import { DreamLogoMark } from '../dream/DreamLogoMark'
import { DreamRitualBar } from '../dream/DreamRitualBar'
import { Panel, Button, Segmented } from '../ui'
import './dream-stage.css'

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

      <section className="dream-shrine" aria-label="月轮解梦">
        <p className="dream-shrine__hint">在下方描述梦境，或轻触月轮开始解析</p>

        <div className="dream-portal">
          <button
            type="button"
            className={[
              'dream-moon',
              `dream-moon--${phase}`,
            ].join(' ')}
            onClick={handleMoonClick}
            disabled={isInterpreting}
            aria-label={phase === 'revealed' ? '再入新梦' : '开始解析梦境'}
          >
            <span className="dream-moon__aura" aria-hidden />
            <div className="dream-moon-body">
              <div className="dream-moon-disc">
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
            <Panel title="梦境符号">
              <div className="dream-symbol-grid">
                {interpretation.symbols.map((symbol, index) => (
                  <article key={index} className="dream-symbol-card">
                    <div className="dream-symbol-card__head">
                      <span className="dream-symbol-card__title">
                        {symbol.matchedKeyword}
                        <span className="dream-symbol-card__subtitle"> · {symbol.meaning}</span>
                      </span>
                      <span
                        className="dream-category-tag"
                        style={{ background: getCategoryColor(symbol.category) }}
                      >
                        {symbol.category}
                      </span>
                    </div>
                    <p className="dream-symbol-card__text">{symbol.interpretation}</p>
                    <p className="dream-symbol-card__text" style={{ color: 'rgba(34, 197, 94, 0.95)' }}>
                      <strong>吉象：</strong>
                      {symbol.positive}
                    </p>
                    <p className="dream-symbol-card__text" style={{ color: 'rgba(239, 68, 68, 0.95)' }}>
                      <strong>留意：</strong>
                      {symbol.negative}
                    </p>
                    <p className="dream-symbol-card__text">
                      <strong>建议：</strong>
                      {symbol.advice}
                    </p>
                    <div className="dream-symbol-card__themes">
                      {symbol.themes.map((theme) => (
                        <span key={theme} className="dream-theme-tag">{theme}</span>
                      ))}
                    </div>
                  </article>
                ))}
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
