import {
  ALMANAC_BRAND,
  ALMANAC_BRAND_EN,
  SHICHEN_TIMES,
  WUXING_HINT,
  formatAlmanacDate,
  getShichenAdvice,
} from '../../utils/almanacData'
import { shichenTagClass } from '../../utils/almanacEngine'
import { useAlmanacGame } from '../../hooks/useAlmanacGame'
import { AlmanacLogoMark } from '../almanac/AlmanacLogoMark'
import { AlmanacRitualBar } from '../almanac/AlmanacRitualBar'
import { Panel } from '../ui'
import './almanac-stage.css'

function AlmanacMainView() {
  const {
    today,
    almanac,
    setEngaged,
    selectedShichen,
    selectedShichenItem,
    ritualStep,
    handleShichenSelect,
  } = useAlmanacGame()

  return (
    <div className="almanac-stage">
      <header className="almanac-hero">
        <div className="almanac-hero__mark">
          <AlmanacLogoMark size="lg" />
        </div>
        <div>
          <p className="almanac-hero__brand">{ALMANAC_BRAND}</p>
          <p className="almanac-hero__brand-en">{ALMANAC_BRAND_EN}</p>
          <p className="almanac-hero__hint">顺天时，知地利，察日宜忌以安行止</p>
        </div>
      </header>

      <AlmanacRitualBar step={ritualStep} />

      <section className="almanac-day-banner">
        <div>
          <p className="almanac-day-banner__date">{formatAlmanacDate(today)}</p>
          <p className="almanac-day-banner__pillar">日柱 {almanac.dayGanZhi}</p>
          <p className="almanac-day-banner__sub">{WUXING_HINT[almanac.wuxing]}</p>
        </div>
        <div className="almanac-wuxing-badge">
          <span className="almanac-wuxing-badge__value">{almanac.wuxing}</span>
          <span className="almanac-wuxing-badge__label">日主五行</span>
        </div>
      </section>

      <section className="almanac-pillars" aria-label="三柱">
        {[
          { label: '年柱', value: almanac.yearGanZhi, day: false },
          { label: '月柱', value: almanac.monthGanZhi, day: false },
          { label: '日柱', value: almanac.dayGanZhi, day: true },
        ].map((pillar) => (
          <article
            key={pillar.label}
            className={`almanac-pillar${pillar.day ? ' almanac-pillar--day' : ''}`}
          >
            <span className="almanac-pillar__label">{pillar.label}</span>
            <span className="almanac-pillar__value">{pillar.value}</span>
          </article>
        ))}
      </section>

      <section className="almanac-meta" aria-label="冲煞方位">
        <article className="almanac-meta__item">
          <span className="almanac-meta__label">冲煞</span>
          <div className="almanac-meta__row">
            <span className="almanac-meta__key">冲</span>
            <span>{almanac.chongShengxiao}</span>
          </div>
          <div className="almanac-meta__row">
            <span className="almanac-meta__key">煞</span>
            <span>{almanac.chongFang}</span>
          </div>
        </article>
        <article className="almanac-meta__item">
          <span className="almanac-meta__label">方位</span>
          <div className="almanac-meta__row">
            <span className="almanac-meta__key">吉神</span>
            <span>{almanac.jishenFangwei}</span>
          </div>
          <div className="almanac-meta__row">
            <span className="almanac-meta__key">凶神</span>
            <span>{almanac.xiongshenFangwei}</span>
          </div>
        </article>
      </section>

      <section
        id="almanac-yiji"
        className="almanac-yiji"
        onClick={() => setEngaged(true)}
        role="presentation"
      >
        <Panel title="宜">
          <div className="almanac-yiji__tags">
            {almanac.yi.map((item) => (
              <span key={item} className="tag tag--good">
                {item}
              </span>
            ))}
          </div>
        </Panel>
        <Panel title="忌">
          <div className="almanac-yiji__tags">
            {almanac.ji.map((item) => (
              <span key={item} className="tag tag--bad">
                {item}
              </span>
            ))}
          </div>
        </Panel>
      </section>

      <section className="almanac-shichen" aria-label="时辰吉凶">
        <Panel title="十二时辰" description="点击时辰查看吉凶详解，择吉时而行">
          <div className="almanac-shichen__grid">
            {almanac.shichenJixiong.map((item) => {
              const selected = selectedShichen === item.shichen
              const toneClass =
                item.jixiong === '吉'
                  ? 'almanac-shichen__cell--ji'
                  : item.jixiong === '凶'
                    ? 'almanac-shichen__cell--xiong'
                    : ''
              return (
                <button
                  key={item.shichen}
                  type="button"
                  className={[
                    'almanac-shichen__cell',
                    toneClass,
                    selected ? 'almanac-shichen__cell--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleShichenSelect(item.shichen)}
                  aria-pressed={selected}
                >
                  <span className="almanac-shichen__name">{item.shichen}时</span>
                  <span className="almanac-shichen__time">{SHICHEN_TIMES[item.shichen]}</span>
                  <span className={shichenTagClass(item.jixiong)}>{item.jixiong}</span>
                </button>
              )
            })}
          </div>

          {selectedShichenItem && (
            <div className="almanac-shichen-detail">
              <div className="almanac-shichen-detail__head">
                <h4 className="almanac-shichen-detail__title">
                  {selectedShichenItem.shichen}时 · {SHICHEN_TIMES[selectedShichenItem.shichen]}
                </h4>
                <span className={shichenTagClass(selectedShichenItem.jixiong)}>
                  {selectedShichenItem.jixiong}
                </span>
              </div>
              <p className="almanac-shichen-detail__text">
                {getShichenAdvice(selectedShichenItem.jixiong)}
              </p>
            </div>
          )}
        </Panel>
      </section>

      <p className="callout almanac-footnote">本黄历仅供参考，实际决策请结合具体情况</p>
    </div>
  )
}

export default AlmanacMainView
