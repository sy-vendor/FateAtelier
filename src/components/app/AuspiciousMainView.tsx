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
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './picker-tools-stage.css'

const EVENT_NAME_EN: Record<string, string> = {
  marriage: 'Wedding',
  move: 'Moving',
  open: 'Business opening',
  travel: 'Travel',
  sign: 'Contract signing',
  ceremony: 'Ceremony',
  other: 'Other',
}

const EVENT_DESC_EN: Record<string, string> = {
  marriage: 'Choose an auspicious day for your wedding',
  move: 'Choose a good day to move into a new home',
  open: 'Choose an auspicious day to open for business',
  travel: 'Choose a favorable day for travel',
  sign: 'Choose a good day to sign agreements',
  ceremony: 'Choose an auspicious day for a ceremony',
  other: 'Choose an auspicious day for important matters',
}

function AuspiciousMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
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
          <p className="picker-hero__brand">{tx(AUSPICIOUS_BRAND, AUSPICIOUS_BRAND_EN)}</p>
          <p className="picker-hero__brand-en">{isEnglish ? AUSPICIOUS_BRAND_EN.toUpperCase() : AUSPICIOUS_BRAND_EN}</p>
          <p className="picker-hero__hint">{tx('择事定日，推演十二时辰，趋吉避凶以行大事', 'Choose the event and date, then find auspicious hours for what matters')}</p>
        </div>
      </header>

      <AuspiciousRitualBar step={ritualStep} />

      <section className="picker-section">
        <h2 className="picker-section__title">{tx('选择事件类型', 'Choose event type')}</h2>
        <p className="picker-section__sub">
          {selectedEvent
            ? tx(selectedEvent.description, EVENT_DESC_EN[selectedEvent.id] ?? selectedEvent.description)
            : ''}
        </p>
        <ChipGrid
          wide
          items={EVENT_TYPES.map((event) => ({
            id: event.id,
            icon: event.icon,
            label: tx(event.name, EVENT_NAME_EN[event.id] ?? event.name),
          }))}
          value={selectedEventType}
          onChange={(id) => selectEvent(id as typeof selectedEventType)}
        />
      </section>

      <section className="picker-section">
        <h2 className="picker-section__title">{tx('选择日期', 'Choose date')}</h2>
        <p className="picker-section__sub">{tx('输入公历年月日，推算当日日柱与吉时', 'Enter a Gregorian date to calculate the day pillar and auspicious hours')}</p>
        <div className="picker-time__fields">
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label={tx('年', 'Year')}
            placeholder="2026"
            value={queryYear}
            onChange={(e) => setYear(e.target.value)}
          />
          <span className="picker-time__sep">{tx('年', 'Year')}</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label={tx('月', 'Month')}
            placeholder="7"
            value={queryMonth}
            onChange={(e) => setMonth(e.target.value)}
          />
          <span className="picker-time__sep">{tx('月', 'Month')}</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label={tx('日', 'Day')}
            placeholder="9"
            value={queryDay}
            onChange={(e) => setDay(e.target.value)}
          />
          <span className="picker-time__sep">{tx('日', 'Day')}</span>
        </div>
        {dateError && <p className="picker-input-error" role="alert">{dateError}</p>}
        {dateObj && dayPillar && (
          <MetaList
            rows={[
              { key: tx('公历', 'Gregorian'), value: formatAuspiciousDate(dateObj) },
              { key: tx('日柱', 'Day pillar'), value: `${dayPillar.gan}${dayPillar.zhi}` },
            ]}
          />
        )}
        <Button variant="primary" block onClick={scanTimes}>
          {tx('推演吉时', 'Find auspicious hours')}
        </Button>
      </section>

      {!hasScanned && (
        <section className="picker-shrine" aria-hidden>
          <span className="picker-shrine__glyph">时</span>
          <p className="picker-shrine__hint">{tx('日柱既定，十二时辰待推，择吉而行', 'Day pillar set; twelve hours await your choice')}</p>
        </section>
      )}

      {hasScanned && bestShichens.length > 0 && (
        <Panel title={tx('最佳吉时推荐', 'Best auspicious hours')}>
          <div className="picker-best-grid">
            {bestShichens.map((item, index) => (
              <article key={item.shichen} className="picker-best-card">
                <span className="tag tag--ok picker-best-card__rank">
                  {tx(`第${index + 1}名`, `#${index + 1}`)}
                </span>
                <div className="picker-best-card__name">{item.time.name}</div>
                <div className="picker-best-card__range">
                  {item.time.start} – {item.time.end}
                </div>
                <div className="score-ring" style={{ width: 96, height: 96, margin: '0 auto 12px' }}>
                  <div className="score-ring__value">{item.result.score}</div>
                  <div className="score-ring__label">{tx('分', 'pts')}</div>
                </div>
                <p className="prose">{item.result.reason}</p>
              </article>
            ))}
          </div>
        </Panel>
      )}

      {hasScanned && (
        <Panel title={tx('全天时辰详情', 'All hours of the day')}>
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
                      {item.result.isGood ? tx('吉', 'Good') : tx('平', 'Neutral')}
                    </span>
                  </div>
                  <MetaList
                    rows={[
                      { key: tx('时柱', 'Hour pillar'), value: pillar ? `${pillar.gan}${pillar.zhi}` : '—' },
                      { key: tx('评分', 'Score'), value: `${item.result.score}${tx('分', ' pts')}` },
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

      <Panel title={tx('温馨提示', 'Tips')}>
        <ul className="prose" style={{ paddingLeft: '1.25rem', margin: 0 }}>
          <li>{tx('择日吉时仅供参考，重要事项请结合实际情况', 'Auspicious timing is for reference; use your own judgment for important matters')}</li>
          <li>{tx('建议选择评分较高的时辰进行重要活动', 'Prefer higher-scored hours for significant activities')}</li>
          <li>{tx('不同事件类型适合的时辰可能有所不同', 'Different events may favor different hours')}</li>
        </ul>
      </Panel>
    </div>
  )
}

export default AuspiciousMainView
