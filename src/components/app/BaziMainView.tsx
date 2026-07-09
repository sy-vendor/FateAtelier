import { BAZI_BRAND, BAZI_BRAND_EN } from '../../utils/baziData'
import { useBaziGame } from '../../hooks/useBaziGame'
import { BaziLogoMark } from '../bazi/BaziLogoMark'
import { BaziRitualBar } from '../bazi/BaziRitualBar'
import { BirthDateFields } from '../tools/BirthDateFields'
import { Panel, Button, AspectGrid } from '../ui'
import './fortune-tools-stage.css'

const PILLAR_LABELS = ['年柱', '月柱', '日柱', '时柱'] as const

function BaziMainView() {
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
    insightRef,
    calculateFortune,
    dayMasterWuxing,
    shichenOptions,
  } = useBaziGame()

  return (
    <div className="tools-stage tools-stage--bazi">
      <header className="tools-hero">
        <div className="tools-hero__mark"><BaziLogoMark size="lg" /></div>
        <div>
          <p className="tools-hero__brand">{BAZI_BRAND}</p>
          <p className="tools-hero__brand-en">{BAZI_BRAND_EN}</p>
          <p className="tools-hero__hint">录生辰排四柱，察五行十神以窥命途</p>
        </div>
      </header>

      <BaziRitualBar step={ritualStep} />

      <section className="tools-form">
        <h2 className="tools-form__title">输入生辰</h2>
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
        <Button variant="primary" block onClick={calculateFortune}>
          开始排盘
        </Button>
      </section>

      {!result && (
        <section className="tools-shrine" aria-hidden>
          <span className="tools-shrine__glyph">☯</span>
          <p className="tools-shrine__hint">阴阳交感，四柱成局，命途始显</p>
        </section>
      )}

      {result && (
        <section ref={insightRef} className="tools-insight" aria-label="八字解读">
          <div className="tools-insight__banner">
            <div className="tools-insight__icon" aria-hidden>命</div>
            <div>
              <h2 className="tools-insight__title">日柱 {result.bazi[2]}</h2>
              <p className="tools-insight__sub">日主五行 · {dayMasterWuxing}</p>
            </div>
            <span className="tools-score-ring">{result.bazi[2]}</span>
          </div>

          <Panel title="四柱八字">
            <div className="tools-pillar-grid">
              {PILLAR_LABELS.map((label, index) => (
                <article key={label} className="tools-pillar-card">
                  <div className="tools-pillar-card__label">{label}</div>
                  <div className="tools-pillar-card__value">{result.bazi[index]}</div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="五行分析">
            <AspectGrid
              items={Object.entries(result.wuxing).map(([element, count]) => ({
                title: `${element}行`,
                score: count,
                text: count >= 3 ? '五行较旺' : count <= 1 ? '五行偏弱' : '状态平稳',
              }))}
            />
          </Panel>

          {result.shishen.length > 0 && (
            <Panel title="十神">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.shishen.map((s) => (
                  <span key={s} className="tag tag--info">{s}</span>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="命理解读">
            <div className="aspect-grid">
              {[
                { title: '性格特点', text: result.interpretation.personality },
                { title: '事业发展', text: result.interpretation.career },
                { title: '财运分析', text: result.interpretation.wealth },
                { title: '健康状况', text: result.interpretation.health },
                { title: '感情婚姻', text: result.interpretation.relationship },
              ].map((item) => (
                <article key={item.title} className="aspect">
                  <div className="aspect__head"><span className="aspect__title">{item.title}</span></div>
                  <p className="aspect__text">{item.text}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="综合总结">
            <p className="prose">{result.interpretation.summary}</p>
          </Panel>

          <p className="callout">八字算命仅供参考，命运掌握在自己手中，理性看待。</p>
        </section>
      )}
    </div>
  )
}

export default BaziMainView
