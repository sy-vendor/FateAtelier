import { BAZI_BRAND, BAZI_BRAND_EN } from '../../utils/baziData'
import { useBaziGame } from '../../hooks/useBaziGame'
import { BaziLogoMark } from '../bazi/BaziLogoMark'
import { BaziRitualBar } from '../bazi/BaziRitualBar'
import { BirthDateFields } from '../tools/BirthDateFields'
import { Panel, Button, AspectGrid } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import { WUXING_EN } from '../../utils/baziData'
import { formatGanZhi } from '../../utils/ganZhiLabel'
import './fortune-tools-stage.css'

function BaziMainView() {
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
    insightRef,
    calculateFortune,
    dayMasterWuxing,
    shichenOptions,
  } = useBaziGame()

  const pillarLabels = [
    tx('年柱', 'Year pillar'),
    tx('月柱', 'Month pillar'),
    tx('日柱', 'Day pillar'),
    tx('时柱', 'Hour pillar'),
  ]

  const interpretationTitles = [
    { title: tx('性格特点', 'Personality'), key: 'personality' as const },
    { title: tx('事业发展', 'Career'), key: 'career' as const },
    { title: tx('财运分析', 'Wealth'), key: 'wealth' as const },
    { title: tx('健康状况', 'Health'), key: 'health' as const },
    { title: tx('感情婚姻', 'Relationships'), key: 'relationship' as const },
  ]

  return (
    <div className="tools-stage tools-stage--bazi">
      <header className="tools-hero">
        <div className="tools-hero__mark"><BaziLogoMark size="lg" /></div>
        <div>
          <p className="tools-hero__brand">{tx(BAZI_BRAND, BAZI_BRAND_EN)}</p>
          <p className="tools-hero__brand-en">{isEnglish ? BAZI_BRAND_EN.toUpperCase() : BAZI_BRAND_EN}</p>
          <p className="tools-hero__hint">{tx('录生辰排四柱，察五行十神以窥命途', 'Enter birth details to chart the four pillars and read your destiny')}</p>
        </div>
      </header>

      <BaziRitualBar step={ritualStep} />

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
        <Button variant="primary" block onClick={calculateFortune}>
          {tx('开始排盘', 'Generate chart')}
        </Button>
      </section>

      {!result && (
        <section className="tools-shrine" aria-hidden>
          <span className="tools-shrine__glyph">☯</span>
          <p className="tools-shrine__hint">{tx('阴阳交感，四柱成局，命途始显', 'Yin and yang converge; four pillars form and destiny emerges')}</p>
        </section>
      )}

      {result && (
        <section ref={insightRef} className="tools-insight" aria-label={tx('八字解读', 'Ba Zi reading')}>
          <div className="tools-insight__banner">
            <div className="tools-insight__icon" aria-hidden>{tx('命', 'Fate')}</div>
            <div>
              <h2 className="tools-insight__title">{tx('日柱', 'Day pillar')} {formatGanZhi(result.bazi[2], isEnglish)}</h2>
              <p className="tools-insight__sub">{tx('日主五行', 'Day master element')} · {isEnglish ? WUXING_EN[dayMasterWuxing] ?? dayMasterWuxing : dayMasterWuxing}</p>
            </div>
            <span className="tools-score-ring">{formatGanZhi(result.bazi[2], isEnglish)}</span>
          </div>

          <Panel title={tx('四柱八字', 'Four pillars')}>
            <div className="tools-pillar-grid">
              {pillarLabels.map((label, index) => (
                <article key={label} className="tools-pillar-card">
                  <div className="tools-pillar-card__label">{label}</div>
                  <div className="tools-pillar-card__value">{formatGanZhi(result.bazi[index], isEnglish)}</div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title={tx('五行分析', 'Five elements')}>
            <AspectGrid
              items={Object.entries(result.wuxing).map(([element, count]) => ({
                title: isEnglish ? WUXING_EN[element] ?? element : `${element}${tx('行', ' element')}`,
                score: count,
                text: count >= 3
                  ? tx('五行较旺', 'Relatively strong')
                  : count <= 1
                    ? tx('五行偏弱', 'Relatively weak')
                    : tx('状态平稳', 'Balanced'),
              }))}
            />
          </Panel>

          {result.shishen.length > 0 && (
            <Panel title={tx('十神', 'Ten gods')}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.shishen.map((s) => (
                  <span key={s} className="tag tag--info">{s}</span>
                ))}
              </div>
            </Panel>
          )}

          <Panel title={tx('命理解读', 'Destiny reading')}>
            <div className="aspect-grid">
              {interpretationTitles.map((item) => (
                <article key={item.title} className="aspect">
                  <div className="aspect__head"><span className="aspect__title">{item.title}</span></div>
                  <p className="aspect__text">{result.interpretation[item.key]}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title={tx('综合总结', 'Summary')}>
            <p className="prose">{result.interpretation.summary}</p>
          </Panel>

          <p className="callout">{tx('八字算命仅供参考，命运掌握在自己手中，理性看待。', 'Ba Zi readings are for reference only. Your choices shape your path.')}</p>
        </section>
      )}
    </div>
  )
}

export default BaziMainView
