import {
  AUSPICIOUS_BRAND,
  AUSPICIOUS_BRAND_EN,
  EVENT_TYPES,
  formatAuspiciousDate,
  shichenTagClass,
} from '../../utils/auspiciousData'
import { calculateShichenPillar } from '../../utils/auspiciousEngine'
import { useAuspiciousGame } from '../../hooks/useAuspiciousGame'
import { AuspiciousLogoMark } from '../auspicious/AuspiciousLogoMark'
import { AuspiciousRitualBar } from '../auspicious/AuspiciousRitualBar'
import { Panel, Button, ChipGrid, MetaList } from '../ui'
import './picker-tools-stage.css'

function AuspiciousMainView() {
  const {
    queryYear,
    queryMonth,
    queryDay,
    setYear,
    setMonth,
    setDay,
    selectedEventType,
    selectEvent,
    dateError,
    ritualStep,
    dateObj,
    dayPillar,
    auspiciousShichens,
    bestShichens,
    scanTimes,
    hasScanned,
  } = useAuspiciousGame()

  const selectedEvent = EVENT_TYPES.find((e) => e.id === selectedEventType)

  return (
    <div className="picker-stage picker-stage--auspicious">
      <header className="picker-hero">
        <div className="picker-hero__mark">
          <AuspiciousLogoMark size="lg" />
        </div>
        <div>
          <p className="picker-hero__brand">{AUSPICIOUS_BRAND}</p>
          <p className="picker-hero__brand-en">{AUSPICIOUS_BRAND_EN}</p>
          <p className="picker-hero__hint">择事定日，推演十二时辰，趋吉避凶以行大事</p>
        </div>
      </header>

      <AuspiciousRitualBar step={ritualStep} />

      <section className="picker-section">
        <h2 className="picker-section__title">选择事件类型</h2>
        <p className="picker-section__sub">{selectedEvent?.description}</p>
        <ChipGrid
          wide
          items={EVENT_TYPES.map((event) => ({
            id: event.id,
            icon: event.icon,
            label: event.name,
          }))}
          value={selectedEventType}
          onChange={(id) => selectEvent(id as typeof selectedEventType)}
        />
      </section>

      <section className="picker-section">
        <h2 className="picker-section__title">选择日期</h2>
        <p className="picker-section__sub">输入公历年月日，推算当日日柱与吉时</p>
        <div className="picker-time__fields">
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label="年"
            placeholder="2026"
            value={queryYear}
            onChange={(e) => setYear(e.target.value)}
          />
          <span className="picker-time__sep">年</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label="月"
            placeholder="7"
            value={queryMonth}
            onChange={(e) => setMonth(e.target.value)}
          />
          <span className="picker-time__sep">月</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label="日"
            placeholder="9"
            value={queryDay}
            onChange={(e) => setDay(e.target.value)}
          />
          <span className="picker-time__sep">日</span>
        </div>
        {dateError && <p className="picker-input-error" role="alert">{dateError}</p>}
        {dateObj && dayPillar && (
          <MetaList
            rows={[
              { key: '公历', value: formatAuspiciousDate(dateObj) },
              { key: '日柱', value: `${dayPillar.gan}${dayPillar.zhi}` },
            ]}
          />
        )}
        <Button variant="primary" block onClick={scanTimes}>
          推演吉时
        </Button>
      </section>

      {!hasScanned && (
        <section className="picker-shrine" aria-hidden>
          <span className="picker-shrine__glyph">时</span>
          <p className="picker-shrine__hint">日柱既定，十二时辰待推，择吉而行</p>
        </section>
      )}

      {hasScanned && bestShichens.length > 0 && (
        <Panel title="最佳吉时推荐">
          <div className="picker-best-grid">
            {bestShichens.map((item, index) => (
              <article key={item.shichen} className="picker-best-card">
                <span className="tag tag--ok picker-best-card__rank">第{index + 1}名</span>
                <div className="picker-best-card__name">{item.time.name}</div>
                <div className="picker-best-card__range">
                  {item.time.start} – {item.time.end}
                </div>
                <div className="score-ring" style={{ width: 96, height: 96, margin: '0 auto 12px' }}>
                  <div className="score-ring__value">{item.result.score}</div>
                  <div className="score-ring__label">分</div>
                </div>
                <p className="prose">{item.result.reason}</p>
              </article>
            ))}
          </div>
        </Panel>
      )}

      {hasScanned && (
        <Panel title="全天时辰详情">
          <div className="picker-shichen-grid">
            {auspiciousShichens.map((item) => {
              const pillar = dateObj ? calculateShichenPillar(dateObj, item.shichen) : null
              return (
                <article key={item.shichen} className="picker-shichen-card">
                  <div className="picker-shichen-card__head">
                    <span className="picker-shichen-card__title">
                      {item.time.name} · {item.time.start}–{item.time.end}
                    </span>
                    <span className={shichenTagClass(item.result.isGood)}>
                      {item.result.isGood ? '吉' : '平'}
                    </span>
                  </div>
                  <MetaList
                    rows={[
                      { key: '时柱', value: pillar ? `${pillar.gan}${pillar.zhi}` : '—' },
                      { key: '评分', value: `${item.result.score}分` },
                    ]}
                  />
                  <div className="picker-score-bar">
                    <div
                      className="picker-score-bar__fill"
                      style={{ width: `${item.result.score}%` }}
                    />
                  </div>
                  <p className="aspect__text">{item.result.reason}</p>
                </article>
              )
            })}
          </div>
        </Panel>
      )}

      <Panel title="温馨提示">
        <ul className="prose" style={{ paddingLeft: '1.25rem', margin: 0 }}>
          <li>择日吉时仅供参考，重要事项请结合实际情况</li>
          <li>建议选择评分较高的时辰进行重要活动</li>
          <li>不同事件类型适合的时辰可能有所不同</li>
        </ul>
      </Panel>
    </div>
  )
}

export default AuspiciousMainView
