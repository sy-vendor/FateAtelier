import type { CSSProperties } from 'react'
import {
  DIVINATION_BRAND,
  DIVINATION_BRAND_EN,
  CATEGORY_OPTIONS,
  DETAIL_FIELD_LABELS,
  getLevelColor,
  type DetailField,
} from '../../utils/divinationData'
import { cleanRepetitiveText } from '../../utils/divinationEngine'
import { isMobileDevice, isShakeSupported } from '../../utils/deviceShake'
import { useDivinationGame } from '../../hooks/useDivinationGame'
import { DivinationLogoMark } from '../divination/DivinationLogoMark'
import { DivinationRitualBar } from '../divination/DivinationRitualBar'
import { Panel, Button, Segmented, Collapsible } from '../ui'
import './divination-stage.css'
import NextJourney from './NextJourney'

function DivinationMainView() {
  const {
    phase,
    ritualStep,
    isShaking,
    showResult,
    selectedCategory,
    setSelectedCategory,
    drawHistory,
    showHistory,
    setShowHistory,
    showDetailed,
    setShowDetailed,
    favorites,
    copied,
    historySearch,
    setHistorySearch,
    stickReading,
    filteredHistory,
    drawStick,
    motionPermission,
    ensureMotionPermission,
    toggleFavorite,
    copyToClipboard,
    shareStick,
    exportHistory,
    clearHistory,
    resetDraw,
    viewHistoryItem,
  } = useDivinationGame()

  const stick = stickReading?.stick

  return (
    <div className="divination-stage">
      <header className="divination-hero">
        <div className="divination-hero__mark">
          <DivinationLogoMark size="lg" />
        </div>
        <div>
          <p className="divination-hero__brand">{DIVINATION_BRAND}</p>
          <p className="divination-hero__brand-en">{DIVINATION_BRAND_EN}</p>
          <p className="divination-hero__hint">静心默念所问，轻摇签筒，待签文示路</p>
        </div>
      </header>

      <DivinationRitualBar step={ritualStep} />

      <section className="divination-picker">
        <h2 className="divination-picker__title">所问何事</h2>
        <p className="divination-picker__sub">选择类别后，解签会侧重该方向展开分项详批</p>
        <div style={{ opacity: isShaking ? 0.6 : 1, pointerEvents: isShaking ? 'none' : 'auto' }}>
          <Segmented
            block
            value={selectedCategory}
            options={[...CATEGORY_OPTIONS]}
            onChange={setSelectedCategory}
          />
        </div>
      </section>

      <section className="divination-shrine" aria-label="签筒仪式">
        <p className="divination-shrine__hint">
          {isMobileDevice() && isShakeSupported() && motionPermission !== 'granted'
            ? '点击签筒开启摇一摇权限，之后可摇手机求签'
            : '点击签筒或摇一摇手机开始求签'}
        </p>
        <div className="stick-container">
          <button
            type="button"
            className={[
              'stick-tube',
              phase === 'intent' && !isShaking ? 'stick-tube--idle' : '',
              isShaking ? 'stick-tube--shaking' : '',
              phase === 'revealing' ? 'stick-tube--revealing' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              void ensureMotionPermission()
              drawStick()
            }}
            disabled={isShaking || phase === 'revealing'}
            aria-label="摇签求签"
          >
            <span className="stick-tube__aura" aria-hidden />
            <div className="stick-tube-body">
              <div className="stick-tube-opening" aria-hidden />
              <div className="stick-tube-sticks" aria-hidden>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <span key={i} className="stick-tube-stick" style={{ '--stick-i': i } as CSSProperties} />
                ))}
              </div>
              <div className="stick-tube-flyout" aria-hidden>
                <span className="stick-tube-flyout__stick" />
                <span className="stick-tube-flyout__glow" />
              </div>
              <div className="stick-tube-top" />
              <div className="stick-tube-band" aria-hidden />
              <div className="stick-tube-bottom" />
              {isShaking && (
                <div className="stick-particles" aria-hidden>
                  {Array.from({ length: 12 }, (_, i) => (
                    <span
                      key={i}
                      className="stick-particle"
                      style={{ '--particle-i': i } as CSSProperties}
                    />
                  ))}
                </div>
              )}
            </div>
            <span className="stick-tube-base" aria-hidden />
            <span className="stick-tube-label">
              {isShaking ? '签文飞出中…' : phase === 'revealing' ? '灵签已出…' : phase === 'done' ? '再求一签' : '轻触签筒 · 心诚则灵'}
            </span>
          </button>

          <Button
            variant="primary"
            block
            onClick={() => {
              void ensureMotionPermission()
              drawStick()
            }}
            disabled={isShaking || phase === 'revealing'}
          >
            {isShaking ? '摇签中…' : phase === 'revealing' ? '揭签中…' : '开始摇签'}
          </Button>
        </div>
      </section>

      {showResult && stickReading && stick && (
        <section className="divination-result" aria-label="签文结果">
          <div className="divination-result__banner">
            <div className="divination-result__num">第{stick.id}签</div>
            <div>
              <h2 className="divination-result__title">{stick.title}</h2>
              <p className="divination-result__sub">{stickReading.timing}</p>
            </div>
            <span
              className="divination-level-tag"
              style={{ background: getLevelColor(stick.level) }}
            >
              {stick.level}
            </span>
          </div>

          <Panel title="签诗">
            <p className="divination-poem">{stick.poem}</p>
            {stick.dailyPoem && stick.dailyPoem !== stick.poem && (
              <p className="divination-poem divination-poem--daily">{stick.dailyPoem}</p>
            )}
          </Panel>

          <Panel title="签意总览">
            <p className="prose">{stickReading.overview}</p>
          </Panel>

          <Panel title="签诗白话">
            <p className="prose divination-reading__poem-insight">{stickReading.poemInsight}</p>
          </Panel>

          {stickReading.categoryGuidance && stickReading.categoryLabel && (
            <Panel title={`所问 · ${stickReading.categoryLabel}`}>
              <p className="prose callout">{stickReading.categoryGuidance}</p>
            </Panel>
          )}

          {stickReading.aspects.length > 0 && (
            <Panel title="分项详批" description="结合签意，就相关事项逐一参详">
              <div className="divination-aspects">
                {stickReading.aspects.map((aspect) => (
                  <article key={aspect.label} className="divination-aspect">
                    <h3 className="divination-aspect__title">{aspect.label}</h3>
                    <p className="divination-aspect__text">{aspect.text}</p>
                  </article>
                ))}
              </div>
            </Panel>
          )}

          <div className="divination-yiji">
            <Panel title="宜">
              <ul className="divination-yiji__list divination-yiji__list--good">
                {stickReading.auspicious.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Panel>
            <Panel title="忌">
              <ul className="divination-yiji__list divination-yiji__list--warn">
                {stickReading.cautions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="行事建议">
            <p className="prose">{stickReading.advice}</p>
          </Panel>

          <Panel title="三步落签" description="不只看吉凶，把签意化成今天能做的事">
            <ol className="divination-action-steps">
              {stickReading.actionSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </Panel>

          {stickReading.storyNote && (
            <Panel title="典故启发">
              <p className="prose">{stickReading.storyNote}</p>
            </Panel>
          )}

          {stick.detailedInterpretations && (
            <Collapsible
              open={showDetailed}
              onToggle={() => setShowDetailed(!showDetailed)}
              label="展开更多分项详批"
              labelOpen="收起更多分项详批"
            >
              <div className="aspect-grid">
                {Object.entries(stick.detailedInterpretations).map(([key, text]) => {
                  if (typeof text !== 'string' || !text) return null
                  const cleaned = cleanRepetitiveText(text, stick.title)
                  const shown = stickReading.aspects.some(
                    (a) => a.text === cleaned || a.text.startsWith(cleaned.slice(0, 12)),
                  )
                  if (shown) return null
                  const label = DETAIL_FIELD_LABELS[key as DetailField] ?? key
                  return (
                    <article key={key} className="aspect">
                      <p className="aspect__title">{label}</p>
                      <p className="aspect__text">{cleaned}</p>
                    </article>
                  )
                })}
              </div>

              {stick.ageGenderInterpretations && (
                <div className="aspect-grid" style={{ marginTop: 'var(--ds-space-md)' }}>
                  {Object.entries(stick.ageGenderInterpretations).map(([key, text]) => {
                    const labels: Record<string, string> = {
                      child: '小孩',
                      youngGirl: '小女',
                      youngBoy: '小儿',
                      male: '男',
                      female: '女',
                    }
                    if (typeof text !== 'string' || !text) return null
                    return (
                      <article key={key} className="aspect">
                        <p className="aspect__title">{labels[key] ?? key}</p>
                        <p className="aspect__text">{cleanRepetitiveText(text, stick.title)}</p>
                      </article>
                    )
                  })}
                </div>
              )}
            </Collapsible>
          )}

          <div className="divination-result__actions">
            <Button variant="ghost" small onClick={() => toggleFavorite(stick.id)}>
              {favorites.has(stick.id) ? '已收藏' : '收藏'}
            </Button>
            <Button variant="ghost" small onClick={copyToClipboard}>
              {copied ? '已复制' : '复制'}
            </Button>
            <Button variant="ghost" small onClick={shareStick}>
              分享
            </Button>
          </div>

          <Button variant="primary" block onClick={resetDraw}>
            再抽一签
          </Button>
          <NextJourney from="divination" />
        </section>
      )}

      <div className="divination-extra">
        <Collapsible
          open={showHistory}
          onToggle={() => setShowHistory(!showHistory)}
          label={`求签记录 (${drawHistory.length})`}
          labelOpen={`收起记录 (${drawHistory.length})`}
        >
          {drawHistory.length > 0 ? (
            <>
              <div className="divination-result__actions" style={{ marginBottom: 'var(--ds-space-md)' }}>
                <Button variant="ghost" small onClick={exportHistory}>
                  导出
                </Button>
                <Button variant="ghost" small onClick={clearHistory}>
                  清空
                </Button>
              </div>

              <div className="field" style={{ marginBottom: 'var(--ds-space-md)' }}>
                <input
                  type="text"
                  placeholder="搜索签号、标题或签诗…"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="field__input"
                />
              </div>

              {filteredHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-sm)' }}>
                  {filteredHistory.map((item) => (
                    <article key={item.id} className="divination-history__item">
                      <div className="divination-history__head">
                        <span style={{ fontWeight: 600, color: 'var(--ds-text-muted)' }}>
                          第 {item.stick.id} 签
                        </span>
                        <span
                          className="divination-level-tag"
                          style={{ background: getLevelColor(item.stick.level), fontSize: '0.72rem', padding: '4px 10px' }}
                        >
                          {item.stick.level}
                        </span>
                        <Button variant="ghost" small onClick={() => toggleFavorite(item.stick.id)}>
                          {favorites.has(item.stick.id) ? '已收藏' : '收藏'}
                        </Button>
                      </div>
                      <h3 className="divination-history__title">{item.stick.title}</h3>
                      <span className="divination-history__time">
                        {new Date(item.timestamp).toLocaleString('zh-CN')}
                      </span>
                      <Button
                        variant="ghost"
                        small
                        block
                        style={{ marginTop: 'var(--ds-space-md)' }}
                        onClick={() => viewHistoryItem(item)}
                      >
                        查看详情
                      </Button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="prose">没有找到匹配的记录</p>
              )}
            </>
          ) : (
            <p className="prose">暂无求签记录</p>
          )}
        </Collapsible>
      </div>

      <p className="callout">签文仅供娱乐参考，重大决策请结合实际情况判断</p>
    </div>
  )
}

export default DivinationMainView
