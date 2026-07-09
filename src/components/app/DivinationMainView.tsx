import type { CSSProperties } from 'react'
import {
  DIVINATION_BRAND,
  DIVINATION_BRAND_EN,
  CATEGORY_OPTIONS,
  getCategoryLabel,
  getLevelColor,
} from '../../utils/divinationData'
import { useDivinationGame } from '../../hooks/useDivinationGame'
import { DivinationLogoMark } from '../divination/DivinationLogoMark'
import { DivinationRitualBar } from '../divination/DivinationRitualBar'
import { Panel, Button, Segmented, Collapsible } from '../ui'
import './divination-stage.css'

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
    optimizedStick,
    filteredHistory,
    drawStick,
    toggleFavorite,
    getCategoryAdvice,
    copyToClipboard,
    shareStick,
    exportHistory,
    clearHistory,
    resetDraw,
    viewHistoryItem,
  } = useDivinationGame()

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
        <p className="divination-picker__sub">选择类别后，签文会侧重该方向解读</p>
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
        <p className="divination-shrine__hint">点击签筒或摇一摇手机开始求签</p>
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
            onClick={drawStick}
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

          <Button variant="primary" block onClick={drawStick} disabled={isShaking || phase === 'revealing'}>
            {isShaking ? '摇签中…' : phase === 'revealing' ? '揭签中…' : '开始摇签'}
          </Button>
        </div>
      </section>

      {showResult && optimizedStick && (
        <section className="divination-result" aria-label="签文结果">
          <div className="divination-result__banner">
            <div className="divination-result__num">第{optimizedStick.id}签</div>
            <div>
              <h2 className="divination-result__title">{optimizedStick.title}</h2>
              <p className="divination-result__sub">签文已示，静心体悟</p>
            </div>
            <span
              className="divination-level-tag"
              style={{ background: getLevelColor(optimizedStick.level) }}
            >
              {optimizedStick.level}
            </span>
          </div>

          <Panel title="签诗">
            <p className="divination-poem">{optimizedStick.poem}</p>
          </Panel>

          <Panel title="解签">
            <p className="prose" style={{ whiteSpace: 'pre-line' }}>
              {optimizedStick.interpretation}
            </p>
          </Panel>

          {selectedCategory && getCategoryAdvice(optimizedStick, selectedCategory) && (
            <Panel title={getCategoryLabel(selectedCategory)}>
              <p className="prose" style={{ whiteSpace: 'pre-line' }}>
                {getCategoryAdvice(optimizedStick, selectedCategory)}
              </p>
            </Panel>
          )}

          <Panel title="建议">
            <p className="prose" style={{ whiteSpace: 'pre-line' }}>
              {optimizedStick.advice}
            </p>
          </Panel>

          {optimizedStick.story && (
            <Panel title="戏文简介">
              <p className="prose">{optimizedStick.story}</p>
            </Panel>
          )}

          {optimizedStick.dailyPoem && (
            <Panel title="日诗">
              <p className="divination-poem" style={{ fontSize: '0.95rem' }}>
                {optimizedStick.dailyPoem}
              </p>
            </Panel>
          )}

          {(optimizedStick.detailedInterpretations || optimizedStick.ageGenderInterpretations) && (
            <Collapsible
              open={showDetailed}
              onToggle={() => setShowDetailed(!showDetailed)}
              label="展开详细解签"
              labelOpen="收起详细解签"
            >
              {optimizedStick.ageGenderInterpretations && (
                <div className="aspect-grid">
                  {Object.entries(optimizedStick.ageGenderInterpretations).map(([key, text]) => {
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
                        <p className="aspect__text">{text}</p>
                      </article>
                    )
                  })}
                </div>
              )}

              {optimizedStick.detailedInterpretations && (
                <div className="aspect-grid" style={{ marginTop: 'var(--ds-space-md)' }}>
                  {Object.entries(optimizedStick.detailedInterpretations).map(([key, text]) => {
                    const labels: Record<string, string> = {
                      home: '家宅',
                      business: '生意',
                      travel: '出行',
                      marriage: '婚姻',
                      wealth: '求财',
                      health: '求医',
                      lawsuit: '诉讼',
                      lostItem: '失物',
                      searchPerson: '寻人',
                      relocation: '移徙',
                      career: '功名',
                      pregnancy: '六甲',
                      livestock: '六畜',
                      disputes: '口舌',
                      illness: '病',
                      transaction: '交易',
                      traveler: '行人',
                    }
                    if (typeof text !== 'string' || !text) return null
                    return (
                      <article key={key} className="aspect">
                        <p className="aspect__title">{labels[key] ?? key}</p>
                        <p className="aspect__text">{text}</p>
                      </article>
                    )
                  })}
                </div>
              )}
            </Collapsible>
          )}

          <div className="divination-result__actions">
            <Button
              variant="ghost"
              small
              onClick={() => toggleFavorite(optimizedStick.id)}
            >
              {favorites.has(optimizedStick.id) ? '已收藏' : '收藏'}
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
                        <Button
                          variant="ghost"
                          small
                          onClick={() => toggleFavorite(item.stick.id)}
                        >
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
