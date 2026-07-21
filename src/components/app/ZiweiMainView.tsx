import { ZIWEI_BRAND, ZIWEI_BRAND_EN, KEY_PALACE_NAMES, palaceNames, palaceNamesEn } from '../../utils/ziweiData'
import { useZiweiGame } from '../../hooks/useZiweiGame'
import { ZiweiLogoMark } from '../ziwei/ZiweiLogoMark'
import { ZiweiRitualBar } from '../ziwei/ZiweiRitualBar'
import { BirthDateFields } from '../tools/BirthDateFields'
import { Panel, Button } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './fortune-tools-stage.css'

function ZiweiMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const {
    calendarType,
    setCalendarType,
    solarYear,
    solarMonth,
    solarDay,
    setSolarYear,
    setSolarMonth,
    setSolarDay,
    lunarYear,
    lunarMonth,
    lunarDay,
    setLunarYear,
    setLunarMonth,
    setLunarDay,
    isLunarLeapMonth,
    setIsLunarLeapMonth,
    birthTime,
    setBirthTime,
    ritualStep,
    inputError,
    result,
    focusedPalaceIndex,
    setFocusedPalaceIndex,
    insightRef,
    calculateChart,
    shenGongPalaceIndex,
    shichenOptions,
  } = useZiweiGame()

  const focusedPalace = result?.palaces[focusedPalaceIndex]
  const keyPalaceNames = isEnglish ? KEY_PALACE_NAMES.map((name) => palaceNamesEn[palaceNames.indexOf(name)]) : KEY_PALACE_NAMES

  return (
    <div className="tools-stage tools-stage--ziwei">
      <header className="tools-hero">
        <div className="tools-hero__mark"><ZiweiLogoMark size="lg" /></div>
        <div>
          <p className="tools-hero__brand">{tx(ZIWEI_BRAND, ZIWEI_BRAND_EN)}</p>
          <p className="tools-hero__brand-en">{isEnglish ? ZIWEI_BRAND_EN.toUpperCase() : ZIWEI_BRAND_EN}</p>
          <p className="tools-hero__hint">{tx('安星布宫，十二宫位照见命途轨迹', 'Place the stars across twelve palaces to trace your destiny')}</p>
        </div>
      </header>

      <ZiweiRitualBar step={ritualStep} />

      <section className="tools-form">
        <h2 className="tools-form__title">{tx('输入生辰', 'Enter birth details')}</h2>
        <BirthDateFields
          calendarType={calendarType}
          onCalendarTypeChange={setCalendarType}
          solarYear={solarYear}
          solarMonth={solarMonth}
          solarDay={solarDay}
          onSolarYear={setSolarYear}
          onSolarMonth={setSolarMonth}
          onSolarDay={setSolarDay}
          lunarYear={lunarYear}
          lunarMonth={lunarMonth}
          lunarDay={lunarDay}
          onLunarYear={setLunarYear}
          onLunarMonth={setLunarMonth}
          onLunarDay={setLunarDay}
          isLunarLeapMonth={isLunarLeapMonth}
          onLunarLeapMonth={setIsLunarLeapMonth}
          birthTime={birthTime}
          onBirthTime={setBirthTime}
          shichenOptions={shichenOptions}
          inputError={inputError}
        />
        <Button variant="primary" block onClick={calculateChart}>
          {tx('生成命盘', 'Generate chart')}
        </Button>
      </section>

      {!result && (
        <section className="tools-shrine" aria-hidden>
          <span className="tools-shrine__glyph">⭐</span>
          <p className="tools-shrine__hint">{tx('紫微临垣，众星拱照，命盘待启', 'Purple Star ascends; the chart awaits')}</p>
        </section>
      )}

      {result && (
        <section ref={insightRef} className="tools-insight" aria-label={tx('紫微命盘', 'Zi Wei chart')}>
          <div className="tools-insight__banner">
            <div className="tools-insight__icon" aria-hidden>{tx('垣', 'Star')}</div>
            <div>
              <h2 className="tools-insight__title">{tx('命宫', 'Life palace')} · {(isEnglish ? palaceNamesEn : palaceNames)[result.mingGong]}</h2>
              <p className="tools-insight__sub">
                {tx('身宫', 'Body palace')} · {(isEnglish ? palaceNamesEn : palaceNames)[result.shenGong]} · {tx('点击宫位细察', 'Tap a palace for details')}
              </p>
            </div>
          </div>

          <Panel title={tx('十二宫位', 'Twelve palaces')}>
            <div className="tools-palace-grid">
              {result.palaces.map((palace, index) => {
                const isMing = index === 0
                const isShen = index === shenGongPalaceIndex
                return (
                  <button
                    key={palace.name}
                    type="button"
                    className={[
                      'tools-palace-card',
                      focusedPalaceIndex === index ? 'tools-palace-card--active' : '',
                      isShen && !isMing ? 'tools-palace-card--shen' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setFocusedPalaceIndex(index)}
                  >
                    <div className="tools-palace-card__head">
                      <h3 className="tools-palace-card__name">{palace.name}</h3>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {isMing && <span className="tag tag--info">{tx('命', 'Life')}</span>}
                        {isShen && <span className="tag tag--ok">{tx('身', 'Body')}</span>}
                      </div>
                    </div>
                    <div className="tools-palace-card__stars">
                      {palace.mainStars.map((star) => (
                        <span key={star} className="tag tag--info">{star}</span>
                      ))}
                      {palace.minorStars.slice(0, 3).map((star) => (
                        <span key={star} className="tag tag--muted">{star}</span>
                      ))}
                      {palace.mainStars.length === 0 && palace.minorStars.length === 0 && (
                        <span style={{ color: 'var(--ds-text-muted)', fontSize: '0.82rem' }}>{tx('空宫', 'Empty')}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </Panel>

          {focusedPalace && (
            <Panel title={`${focusedPalace.name}${tx('解读', ' reading')}`}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {focusedPalace.mainStars.map((s) => <span key={s} className="tag tag--info">{s}</span>)}
                {focusedPalace.sihua.map((s) => <span key={s} className="tag tag--ok">{s}</span>)}
              </div>
              <p className="prose">{focusedPalace.analysis}</p>
            </Panel>
          )}

          <Panel title={tx('重点宫位', 'Key palaces')}>
            <div className="aspect-grid">
              {result.palaces
                .filter((p) => keyPalaceNames.includes(p.name))
                .map((palace) => (
                  <article key={palace.name} className="aspect">
                    <div className="aspect__head">
                      <span className="aspect__title">{palace.name}</span>
                      {palace.mainStars.slice(0, 2).map((s) => (
                        <span key={s} className="tag tag--info">{s}</span>
                      ))}
                    </div>
                    <p className="aspect__text">{palace.analysis}</p>
                  </article>
                ))}
            </div>
          </Panel>
        </section>
      )}
    </div>
  )
}

export default ZiweiMainView
