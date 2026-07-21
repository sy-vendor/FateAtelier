import { useMemo } from 'react'
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
import { OracleVessel } from '../divination/OracleVessel'
import { Panel, Button, Segmented, Collapsible } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import { divinationSticksEn } from '../../data/divinationSticks.en'
import './divination-stage.css'
import NextJourney from './NextJourney'

const CATEGORY_LABEL_EN: Record<string, string> = {
  '': 'All',
  career: 'Career',
  love: 'Love',
  health: 'Health',
  wealth: 'Wealth',
  travel: 'Travel',
}

const DETAIL_FIELD_LABEL_EN: Record<DetailField, string> = {
  home: 'Home',
  business: 'Business',
  travel: 'Travel',
  marriage: 'Marriage',
  wealth: 'Wealth',
  health: 'Health',
  lawsuit: 'Lawsuit',
  lostItem: 'Lost item',
  searchPerson: 'Search person',
  relocation: 'Relocation',
  career: 'Career',
  pregnancy: 'Pregnancy',
  livestock: 'Livestock',
  disputes: 'Disputes',
  illness: 'Illness',
  transaction: 'Transaction',
  traveler: 'Traveler',
}

const AGE_GENDER_LABEL_EN: Record<string, string> = {
  child: 'Child',
  youngGirl: 'Young girl',
  youngBoy: 'Young boy',
  male: 'Male',
  female: 'Female',
}

function DivinationMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
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

  const categoryOptions = useMemo(
    () => CATEGORY_OPTIONS.map((o) => ({
      ...o,
      label: tx(o.label, CATEGORY_LABEL_EN[o.value] ?? o.label),
    })),
    [tx],
  )

  const shrineEyebrow = phase === 'done' && showResult
    ? tx('本次指引', 'This reading')
    : tx('静心片刻', 'A quiet moment')

  const shrineTitle = phase === 'done' && showResult
    ? tx('答案已经落下', 'The answer has fallen')
    : tx('把问题留在心里', 'Hold your question within')

  const shrineHint = isShaking
    ? tx('保持呼吸，让杂念慢慢安静', 'Breathe steadily and let your thoughts settle')
    : phase === 'revealing'
      ? tx('抽取完成，正在展开你的结果', 'Draw complete — unfolding your result')
      : phase === 'done' && showResult
        ? tx('向下查看这次抽取的完整解读', 'Scroll down for the full reading')
        : isMobileDevice() && isShakeSupported() && motionPermission !== 'granted'
          ? tx('准备好后轻触右侧器物，也可以直接点击按钮', 'When ready, tap the vessel or use the button below')
          : tx('不必说出口。想清楚你此刻最在意的一件事，然后开始。', 'No need to speak aloud. Focus on what matters most right now, then begin.')

  const statusText = isShaking
    ? tx('正在摇动…', 'Shaking…')
    : phase === 'revealing'
      ? tx('正在展开…', 'Unfolding…')
      : phase === 'done'
        ? tx('本次抽取已完成', 'Draw complete')
        : tx('轻触器物或使用下方按钮', 'Tap the vessel or use the button below')

  const drawButtonText = isShaking
    ? tx('请稍候…', 'Please wait…')
    : phase === 'revealing'
      ? tx('正在展开…', 'Unfolding…')
      : phase === 'done'
        ? tx('重新抽取', 'Draw again')
        : tx('开始抽取', 'Begin draw')

  return (
    <div className="divination-stage">
      <header className="divination-hero">
        <div className="divination-hero__mark">
          <DivinationLogoMark size="lg" />
        </div>
        <div>
          <p className="divination-hero__brand">{tx(DIVINATION_BRAND, DIVINATION_BRAND_EN)}</p>
          <p className="divination-hero__brand-en">{isEnglish ? DIVINATION_BRAND_EN.toUpperCase() : DIVINATION_BRAND_EN}</p>
          <p className="divination-hero__hint">{tx('静心默念所问，轻摇签筒，待签文示路', 'Focus on your question, shake the oracle, and let the stick guide you')}</p>
        </div>
      </header>

      <DivinationRitualBar step={ritualStep} />

      <section className="divination-picker">
        <h2 className="divination-picker__title">{tx('所问何事', 'What do you ask?')}</h2>
        <p className="divination-picker__sub">{tx('选择类别后，解签会侧重该方向展开分项详批', 'Choose a category to focus the detailed reading')}</p>
        <div style={{ opacity: isShaking ? 0.6 : 1, pointerEvents: isShaking ? 'none' : 'auto' }}>
          <Segmented
            block
            value={selectedCategory}
            options={categoryOptions}
            onChange={setSelectedCategory}
          />
        </div>
      </section>

      <section
        className={[
          'divination-shrine',
          phase === 'done' && showResult ? 'divination-shrine--settled' : '',
          isShaking ? 'divination-shrine--shaking' : '',
          phase === 'revealing' ? 'divination-shrine--revealing' : '',
        ].filter(Boolean).join(' ')}
        aria-label={tx('签筒仪式', 'Oracle ritual')}
      >
        <div className="divination-shrine__altar">
          <div className="divination-shrine__copy">
            <p className="divination-shrine__eyebrow">{shrineEyebrow}</p>
            <h2 className="divination-shrine__title">{shrineTitle}</h2>
            <p className="divination-shrine__hint">{shrineHint}</p>

            <ol className="divination-shrine__flow" aria-label={tx('抽取流程', 'Draw flow')}>
              <li className="is-complete"><span>1</span>{tx('选择方向', 'Choose focus')}</li>
              <li className={phase !== 'intent' ? 'is-complete' : 'is-current'}><span>2</span>{tx('静心抽取', 'Draw calmly')}</li>
              <li className={phase === 'done' ? 'is-complete' : ''}><span>3</span>{tx('查看解读', 'Read result')}</li>
            </ol>
          </div>

          <div className="divination-shrine__interaction">
            <button
              type="button"
              className={[
                'stick-tube',
                phase === 'intent' && !isShaking ? 'stick-tube--idle' : '',
                isShaking ? 'stick-tube--shaking' : '',
                phase === 'revealing' ? 'stick-tube--revealing' : '',
                phase === 'done' ? 'stick-tube--done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                void ensureMotionPermission()
                drawStick()
              }}
              disabled={isShaking || phase === 'revealing'}
              aria-label={tx('开始抽取', 'Begin draw')}
            >
              <span className="stick-tube__haze" aria-hidden />
              <span className="stick-tube__glow" aria-hidden />
              <OracleVessel />
            </button>

            <p className="divination-shrine__status" aria-live="polite">
              {statusText}
            </p>

            <Button
              variant="primary"
              className="divination-draw-button"
              onClick={() => {
                void ensureMotionPermission()
                drawStick()
              }}
              disabled={isShaking || phase === 'revealing'}
            >
              {drawButtonText}
            </Button>
          </div>
        </div>
      </section>

      {showResult && stickReading && stick && (
        <section className="divination-result" aria-label={tx('签文结果', 'Oracle result')}>
          <div className="divination-result__banner">
            <div className="divination-result__num">{tx(`第${stick.id}签`, `Stick #${stick.id}`)}</div>
            <div>
              <h2 className="divination-result__title">{stick.title}</h2>
              <p className="divination-result__sub">{stickReading.timing}</p>
            </div>
            <span
              className="divination-level-tag"
              style={{ background: getLevelColor(stick.level) }}
            >
              {isEnglish ? (divinationSticksEn[stick.id]?.levelEn ?? stick.level) : stick.level}
            </span>
          </div>

          <Panel title={tx('签诗', 'Poem')}>
            <p className="divination-poem">{stick.poem}</p>
            {stick.dailyPoem && stick.dailyPoem !== stick.poem && (
              <p className="divination-poem divination-poem--daily">{stick.dailyPoem}</p>
            )}
          </Panel>

          <Panel title={tx('签意总览', 'Overview')}>
            <p className="prose">{stickReading.overview}</p>
          </Panel>

          <Panel title={tx('签诗白话', 'Poem in plain language')}>
            <p className="prose divination-reading__poem-insight">{stickReading.poemInsight}</p>
          </Panel>

          {stickReading.categoryGuidance && stickReading.categoryLabel && (
            <Panel title={`${tx('所问', 'Question')} · ${stickReading.categoryLabel}`}>
              <p className="prose callout">{stickReading.categoryGuidance}</p>
            </Panel>
          )}

          {stickReading.aspects.length > 0 && (
            <Panel title={tx('分项详批', 'Detailed aspects')} description={tx('结合签意，就相关事项逐一参详', 'Aspect-by-aspect reading based on the stick meaning')}>
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
            <Panel title={tx('宜', 'Favorable')}>
              <ul className="divination-yiji__list divination-yiji__list--good">
                {stickReading.auspicious.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Panel>
            <Panel title={tx('忌', 'Unfavorable')}>
              <ul className="divination-yiji__list divination-yiji__list--warn">
                {stickReading.cautions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title={tx('行事建议', 'Practical advice')}>
            <p className="prose">{stickReading.advice}</p>
          </Panel>

          <Panel title={tx('三步落签', 'Three action steps')} description={tx('不只看吉凶，把签意化成今天能做的事', 'Turn the reading into actions you can take today')}>
            <ol className="divination-action-steps">
              {stickReading.actionSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </Panel>

          {stickReading.storyNote && (
            <Panel title={tx('典故启发', 'Historical note')}>
              <p className="prose">{stickReading.storyNote}</p>
            </Panel>
          )}

          {stick.detailedInterpretations && (
            <Collapsible
              open={showDetailed}
              onToggle={() => setShowDetailed(!showDetailed)}
              label={tx('展开更多分项详批', 'Show more details')}
              labelOpen={tx('收起更多分项详批', 'Hide more details')}
            >
              <div className="aspect-grid">
                {Object.entries(stick.detailedInterpretations).map(([key, text]) => {
                  if (typeof text !== 'string' || !text) return null
                  const cleaned = cleanRepetitiveText(text, stick.title)
                  const shown = stickReading.aspects.some(
                    (a) => a.text === cleaned || a.text.startsWith(cleaned.slice(0, 12)),
                  )
                  if (shown) return null
                  const field = key as DetailField
                  const label = tx(DETAIL_FIELD_LABELS[field] ?? key, DETAIL_FIELD_LABEL_EN[field] ?? key)
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
                      child: tx('小孩', 'Child'),
                      youngGirl: tx('小女', 'Young girl'),
                      youngBoy: tx('小儿', 'Young boy'),
                      male: tx('男', 'Male'),
                      female: tx('女', 'Female'),
                    }
                    if (typeof text !== 'string' || !text) return null
                    return (
                      <article key={key} className="aspect">
                        <p className="aspect__title">{labels[key] ?? tx(key, AGE_GENDER_LABEL_EN[key] ?? key)}</p>
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
              {favorites.has(stick.id) ? tx('已收藏', 'Saved') : tx('收藏', 'Save')}
            </Button>
            <Button variant="ghost" small onClick={copyToClipboard}>
              {copied ? tx('已复制', 'Copied') : tx('复制', 'Copy')}
            </Button>
            <Button variant="ghost" small onClick={shareStick}>
              {tx('分享', 'Share')}
            </Button>
          </div>

          <Button variant="primary" block onClick={resetDraw}>
            {tx('再抽一签', 'Draw again')}
          </Button>
          <NextJourney from="divination" />
        </section>
      )}

      <div className="divination-extra">
        <Collapsible
          open={showHistory}
          onToggle={() => setShowHistory(!showHistory)}
          label={tx(`求签记录 (${drawHistory.length})`, `Draw history (${drawHistory.length})`)}
          labelOpen={tx(`收起记录 (${drawHistory.length})`, `Hide history (${drawHistory.length})`)}
        >
          {drawHistory.length > 0 ? (
            <>
              <div className="divination-result__actions" style={{ marginBottom: 'var(--ds-space-md)' }}>
                <Button variant="ghost" small onClick={exportHistory}>
                  {tx('导出', 'Export')}
                </Button>
                <Button variant="ghost" small onClick={clearHistory}>
                  {tx('清空', 'Clear')}
                </Button>
              </div>

              <div className="field" style={{ marginBottom: 'var(--ds-space-md)' }}>
                <input
                  type="text"
                  placeholder={tx('搜索签号、标题或签诗…', 'Search by number, title, or poem…')}
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
                          {tx(`第 ${item.stick.id} 签`, `Stick #${item.stick.id}`)}
                        </span>
                        <span
                          className="divination-level-tag"
                          style={{ background: getLevelColor(item.stick.level), fontSize: '0.72rem', padding: '4px 10px' }}
                        >
                          {isEnglish ? (divinationSticksEn[item.stick.id]?.levelEn ?? item.stick.level) : item.stick.level}
                        </span>
                        <Button variant="ghost" small onClick={() => toggleFavorite(item.stick.id)}>
                          {favorites.has(item.stick.id) ? tx('已收藏', 'Saved') : tx('收藏', 'Save')}
                        </Button>
                      </div>
                      <h3 className="divination-history__title">{item.stick.title}</h3>
                      <span className="divination-history__time">
                        {new Date(item.timestamp).toLocaleString(isEnglish ? 'en-US' : 'zh-CN')}
                      </span>
                      <Button
                        variant="ghost"
                        small
                        block
                        style={{ marginTop: 'var(--ds-space-md)' }}
                        onClick={() => viewHistoryItem(item)}
                      >
                        {tx('查看详情', 'View details')}
                      </Button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="prose">{tx('没有找到匹配的记录', 'No matching records found')}</p>
              )}
            </>
          ) : (
            <p className="prose">{tx('暂无求签记录', 'No draw history yet')}</p>
          )}
        </Collapsible>
      </div>

      <p className="callout">{tx('签文仅供娱乐参考，重大决策请结合实际情况判断', 'Oracle readings are for fun — use your own judgment for important decisions')}</p>
    </div>
  )
}

export default DivinationMainView
