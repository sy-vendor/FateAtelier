import {
  ALMANAC_BRAND,
  ALMANAC_BRAND_EN,
  SHICHEN_TIMES,
  WUXING_HINT,
  almanacActivityLabel,
  almanacDirectionLabel,
  almanacJixiongLabel,
  almanacShichenLabel,
  almanacWuxingLabel,
  formatAlmanacDate,
  getShichenAdvice,
} from '../../utils/almanacData'
import { formatGanZhi } from '../../utils/ganZhiLabel'
import { shichenTagClass } from '../../utils/almanacEngine'
import { useAlmanacGame } from '../../hooks/useAlmanacGame'
import { AlmanacLogoMark } from '../almanac/AlmanacLogoMark'
import { AlmanacRitualBar } from '../almanac/AlmanacRitualBar'
import { Panel } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './almanac-stage.css'

function AlmanacMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const {
    today,
    almanac,
    setEngaged,
    selectedShichen,
    selectedShichenItem,
    ritualStep,
    handleShichenSelect,
  } = useAlmanacGame()

  const pillars = [
    { label: tx('年柱', 'Year pillar'), value: formatGanZhi(almanac.yearGanZhi, isEnglish), day: false },
    { label: tx('月柱', 'Month pillar'), value: formatGanZhi(almanac.monthGanZhi, isEnglish), day: false },
    { label: tx('日柱', 'Day pillar'), value: formatGanZhi(almanac.dayGanZhi, isEnglish), day: true },
  ]

  return (
    <div className="almanac-stage">
      <header className="almanac-hero">
        <div className="almanac-hero__mark">
          <AlmanacLogoMark size="lg" />
        </div>
        <div>
          <p className="almanac-hero__brand">{tx(ALMANAC_BRAND, ALMANAC_BRAND_EN)}</p>
          <p className="almanac-hero__brand-en">{isEnglish ? ALMANAC_BRAND_EN.toUpperCase() : ALMANAC_BRAND_EN}</p>
          <p className="almanac-hero__hint">{tx('顺天时，知地利，察日宜忌以安行止', 'Follow the seasons, read the day, and choose your timing wisely')}</p>
        </div>
      </header>

      <AlmanacRitualBar step={ritualStep} />

      <section className="almanac-day-banner">
        <div>
          <p className="almanac-day-banner__date">{formatAlmanacDate(today)}</p>
          <p className="almanac-day-banner__pillar">{tx('日柱', 'Day pillar')} {formatGanZhi(almanac.dayGanZhi, isEnglish)}</p>
          <p className="almanac-day-banner__sub">
            {isEnglish
              ? ({
                  木: 'Wood energy supports growth, planting, and new plans.',
                  火: 'Fire energy favors expression, connection, and initiative.',
                  土: 'Earth energy favors foundations, order, and stability.',
                  金: 'Metal energy favors decisions, trade, and careful organization.',
                  水: 'Water energy favors reflection, blessings, and restoration.',
                }[almanac.wuxing] ?? WUXING_HINT[almanac.wuxing])
              : WUXING_HINT[almanac.wuxing]}
          </p>
        </div>
        <div className="almanac-wuxing-badge">
          <span className="almanac-wuxing-badge__value">{almanacWuxingLabel(almanac.wuxing)}</span>
          <span className="almanac-wuxing-badge__label">{tx('日主五行', 'Day element')}</span>
        </div>
      </section>

      <section className="almanac-pillars" aria-label={tx('三柱', 'Three pillars')}>
        {pillars.map((pillar) => (
          <article
            key={pillar.label}
            className={`almanac-pillar${pillar.day ? ' almanac-pillar--day' : ''}`}
          >
            <span className="almanac-pillar__label">{pillar.label}</span>
            <span className="almanac-pillar__value">{pillar.value}</span>
          </article>
        ))}
      </section>

      <section className="almanac-meta" aria-label={tx('冲煞方位', 'Clash and directions')}>
        <article className="almanac-meta__item">
          <span className="almanac-meta__label">{tx('冲煞', 'Clash')}</span>
          <div className="almanac-meta__row">
            <span className="almanac-meta__key">{tx('冲', 'Clash')}</span>
            <span>{tx(almanac.chongShengxiao, ({
              鼠: 'Rat', 牛: 'Ox', 虎: 'Tiger', 兔: 'Rabbit', 龙: 'Dragon', 蛇: 'Snake',
              马: 'Horse', 羊: 'Goat', 猴: 'Monkey', 鸡: 'Rooster', 狗: 'Dog', 猪: 'Pig',
            }[almanac.chongShengxiao] ?? almanac.chongShengxiao))}</span>
          </div>
          <div className="almanac-meta__row">
            <span className="almanac-meta__key">{tx('煞', 'Sha')}</span>
            <span>{almanacDirectionLabel(almanac.chongFang)}</span>
          </div>
        </article>
        <article className="almanac-meta__item">
          <span className="almanac-meta__label">{tx('方位', 'Directions')}</span>
          <div className="almanac-meta__row">
            <span className="almanac-meta__key">{tx('吉神', 'Auspicious')}</span>
            <span>{almanacDirectionLabel(almanac.jishenFangwei)}</span>
          </div>
          <div className="almanac-meta__row">
            <span className="almanac-meta__key">{tx('凶神', 'Inauspicious')}</span>
            <span>{almanacDirectionLabel(almanac.xiongshenFangwei)}</span>
          </div>
        </article>
      </section>

      <section
        id="almanac-yiji"
        className="almanac-yiji"
        onClick={() => setEngaged(true)}
        role="presentation"
      >
        <Panel title={tx('宜', 'Favorable')}>
          <div className="almanac-yiji__tags">
            {almanac.yi.map((item) => (
              <span key={item} className="tag tag--good">
                {almanacActivityLabel(item)}
              </span>
            ))}
          </div>
        </Panel>
        <Panel title={tx('忌', 'Unfavorable')}>
          <div className="almanac-yiji__tags">
            {almanac.ji.map((item) => (
              <span key={item} className="tag tag--bad">
                {almanacActivityLabel(item)}
              </span>
            ))}
          </div>
        </Panel>
      </section>

      <section className="almanac-shichen" aria-label={tx('时辰吉凶', 'Hourly fortune')}>
        <Panel title={tx('十二时辰', 'Twelve hours')} description={tx('点击时辰查看吉凶详解，择吉时而行', 'Tap an hour to view details and choose auspicious timing')}>
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
                  <span className="almanac-shichen__name">
                    {almanacShichenLabel(item.shichen)}{isEnglish ? '' : '时'}
                  </span>
                  <span className="almanac-shichen__time">{SHICHEN_TIMES[item.shichen]}</span>
                  <span className={shichenTagClass(item.jixiong)}>{almanacJixiongLabel(item.jixiong)}</span>
                </button>
              )
            })}
          </div>

          {selectedShichenItem && (
            <div className="almanac-shichen-detail">
              <div className="almanac-shichen-detail__head">
                <h4 className="almanac-shichen-detail__title">
                  {almanacShichenLabel(selectedShichenItem.shichen)}{isEnglish ? '' : '时'} · {SHICHEN_TIMES[selectedShichenItem.shichen]}
                </h4>
                <span className={shichenTagClass(selectedShichenItem.jixiong)}>
                  {almanacJixiongLabel(selectedShichenItem.jixiong)}
                </span>
              </div>
              <p className="almanac-shichen-detail__text">
                {getShichenAdvice(selectedShichenItem.jixiong)}
              </p>
            </div>
          )}
        </Panel>
      </section>

      <p className="callout almanac-footnote">{tx('本黄历仅供参考，实际决策请结合具体情况', 'This almanac is for reference only. Use your own judgment for important decisions.')}</p>
    </div>
  )
}

export default AlmanacMainView
