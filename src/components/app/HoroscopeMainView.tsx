import {
  HOROSCOPE_BRAND,
  HOROSCOPE_BRAND_EN,
  ZODIAC_SIGNS,
  ELEMENT_LABEL,
  ELEMENT_PEERS,
  PERIOD_OPTIONS,
  PERIOD_HEADLINE,
  ELEMENT_LABEL_EN,
  ELEMENT_PEERS_EN,
  PERIOD_OPTIONS_EN,
  PERIOD_HEADLINE_EN,
} from '../../utils/horoscopeData'
import { compatTagClass, relTagClass } from '../../utils/horoscopeEngine'
import { useHoroscopeGame } from '../../hooks/useHoroscopeGame'
import { HoroscopeLogoMark } from '../horoscope/HoroscopeLogoMark'
import { HoroscopeRitualBar } from '../horoscope/HoroscopeRitualBar'
import { Panel, Button, Segmented, ChipGrid, AspectGrid, Collapsible } from '../ui'
import './horoscope-stage.css'
import { useLocale } from '../../i18n/LocaleContext'

function HoroscopeMainView() {
  const { isEnglish } = useLocale()
  const tx = (zh: string, en: string) => isEnglish ? en : zh
  const game = useHoroscopeGame()
  const {
    period,
    sign,
    result,
    ritualStep,
    calendarType,
    birthYear,
    birthMonth,
    birthDay,
    showBirthInput,
    setShowBirthInput,
    isLunarLeapMonth,
    setIsLunarLeapMonth,
    birthQueryResult,
    birthQueryError,
    showPairing,
    setShowPairing,
    pairingSign1,
    setPairingSign1,
    pairingSign2,
    setPairingSign2,
    pairingResult,
    lunarSolarPreview,
    handleBirthFieldChange,
    setBirthYear,
    setBirthMonth,
    setBirthDay,
    handleSignChange,
    handlePeriodChange,
    handleCalendarTypeChange,
    handleQueryByBirthday,
    clearBirthQueryFeedback,
    runPairing,
    scrollToHoroscopeReading,
  } = game

  return (
    <div className="horoscope-stage">
      <header className="horoscope-hero">
        <div className="horoscope-hero__mark">
          <HoroscopeLogoMark size="lg" />
        </div>
        <div>
          <p className="horoscope-hero__brand">{isEnglish ? 'Stellar Observatory' : HOROSCOPE_BRAND}</p>
          <p className="horoscope-hero__brand-en">{isEnglish ? 'HOROSCOPE' : HOROSCOPE_BRAND_EN}</p>
          <p className="horoscope-hero__hint">{tx('仰望星空，聆听十二宫的低语', 'Look to the stars and listen to the zodiac')}</p>
        </div>
      </header>

      <HoroscopeRitualBar step={ritualStep} />

      <section className="horoscope-picker">
        <div className="horoscope-picker__intro">
          <h2 className="horoscope-picker__title">{tx('选择你的星座', 'Choose your zodiac sign')}</h2>
          <p className="horoscope-picker__sub">{tx('点击星座符号，聆听星轨指引', 'Select a sign to reveal your celestial guidance')}</p>
        </div>

        <div className="horoscope-picker__period">
          <span className="horoscope-picker__period-label">{tx('观星频率', 'Forecast period')}</span>
          <Segmented block value={period} options={isEnglish ? PERIOD_OPTIONS_EN : PERIOD_OPTIONS} onChange={handlePeriodChange} />
        </div>

        <ChipGrid
          zodiac
          items={ZODIAC_SIGNS.map((z) => ({ id: z.id, icon: z.symbol, label: isEnglish ? z.nameEn : z.name }))}
          value={sign.id}
          onChange={handleSignChange}
        />
      </section>

      <section id="horoscope-reading" className="horoscope-reading">
        <div className="horoscope-reading__banner">
          <div className="horoscope-sign-badge">
            <span className="horoscope-sign-badge__symbol">{sign.symbol}</span>
            <span className="horoscope-sign-badge__element">{isEnglish ? ELEMENT_LABEL_EN[sign.element] : `${sign.element}象`}</span>
          </div>
          <div className="horoscope-reading__meta">
            <h2>{isEnglish ? sign.nameEn : sign.name}</h2>
            <p className="horoscope-reading__dates">{sign.dates}</p>
            <p className="horoscope-reading__period">{(isEnglish ? PERIOD_HEADLINE_EN : PERIOD_HEADLINE)[period]}</p>
          </div>
          <div className="horoscope-score-ring">
            <span className="horoscope-score-ring__value">{result.overall}</span>
            <span className="horoscope-score-ring__label">{tx('综合指数', 'Overall')}</span>
          </div>
        </div>

        <div className="horoscope-lucky">
          <div className="horoscope-lucky__item">
            <span className="horoscope-lucky__label">{tx('幸运颜色', 'Lucky color')}</span>
            <span className="horoscope-lucky__value">{result.color}</span>
          </div>
          <div className="horoscope-lucky__item">
            <span className="horoscope-lucky__label">{tx('幸运物品', 'Lucky item')}</span>
            <span className="horoscope-lucky__value">{result.item}</span>
          </div>
        </div>

        <Panel title={tx('星象概览', 'Celestial overview')}>
          <p className="prose">{result.summary}</p>
          <p className="callout" style={{ marginTop: 12 }}>
            {(isEnglish ? ELEMENT_LABEL_EN : ELEMENT_LABEL)[result.element]} · {(isEnglish ? ELEMENT_PEERS_EN : ELEMENT_PEERS)[result.element]}
          </p>
        </Panel>

        <AspectGrid
          items={result.details.map((d) => ({
            title: d.key,
            score: d.value,
            text: d.text,
          }))}
        />

        <Panel title={tx('星轨建议', 'Guidance')}>
          <p className="prose">{result.advice}</p>
        </Panel>
      </section>

      <div className="horoscope-extra">
        <Collapsible
          open={showBirthInput}
          onToggle={() => setShowBirthInput(!showBirthInput)}
          label={tx('生日定位星座', 'Find sign by birthday')}
          labelOpen={tx('收起生日查询', 'Close birthday finder')}
        >
          <div className="horoscope-birth-card">
            <p className="horoscope-birth-card__hint">{tx('输入出生日期，自动匹配所属星座', 'Enter a birth date to find the matching zodiac sign')}</p>

            <div className="horoscope-birth-card__calendar">
              <span className="horoscope-birth-card__label">{tx('历法', 'Calendar')}</span>
              <Segmented
                block
                value={calendarType}
                options={[
                  { value: 'solar', label: tx('阳历', 'Gregorian') },
                  { value: 'lunar', label: tx('农历', 'Lunar') },
                ]}
                onChange={handleCalendarTypeChange}
              />
            </div>

            <div className="horoscope-birth-card__ymd">
              <div className="horoscope-birth-card__field">
                <label className="horoscope-birth-card__label" htmlFor="horoscope-birth-year">
                  {tx('年', 'Year')}
                </label>
                <input
                  id="horoscope-birth-year"
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday-year"
                  placeholder="1995"
                  value={birthYear}
                  onChange={(e) => handleBirthFieldChange(setBirthYear, e.target.value, 4)}
                  className="field__input horoscope-birth-card__input"
                />
              </div>
              <div className="horoscope-birth-card__field">
                <label className="horoscope-birth-card__label" htmlFor="horoscope-birth-month">
                  {tx('月', 'Month')}
                </label>
                <input
                  id="horoscope-birth-month"
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday-month"
                  placeholder="8"
                  value={birthMonth}
                  onChange={(e) => handleBirthFieldChange(setBirthMonth, e.target.value, 2)}
                  className="field__input horoscope-birth-card__input"
                />
              </div>
              <div className="horoscope-birth-card__field">
                <label className="horoscope-birth-card__label" htmlFor="horoscope-birth-day">
                  {tx('日', 'Day')}
                </label>
                <input
                  id="horoscope-birth-day"
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday-day"
                  placeholder="10"
                  value={birthDay}
                  onChange={(e) => handleBirthFieldChange(setBirthDay, e.target.value, 2)}
                  className="field__input horoscope-birth-card__input"
                />
              </div>
            </div>

            {calendarType === 'lunar' && (
              <>
                <label className="horoscope-birth-card__leap">
                  <input
                    type="checkbox"
                    checked={isLunarLeapMonth}
                    onChange={(e) => {
                      setIsLunarLeapMonth(e.target.checked)
                      clearBirthQueryFeedback()
                    }}
                  />
                  <span>{tx('闰月', 'Leap month')}</span>
                </label>
                {lunarSolarPreview ? (
                  <p className="horoscope-birth-card__preview">{lunarSolarPreview}</p>
                ) : (
                  <p className="horoscope-birth-card__note">{tx('支持 1900–2100 年农历转阳历', 'Supports lunar dates from 1900 to 2100')}</p>
                )}
              </>
            )}

            {calendarType === 'solar' && (
              <p className="horoscope-birth-card__note">{tx('星座按阳历月日计算', 'Zodiac signs use Gregorian month and day')}</p>
            )}

            {birthQueryError && (
              <p className="horoscope-birth-card__error" role="alert">
                {birthQueryError}
              </p>
            )}

            {birthQueryResult && (
              <div className="horoscope-birth-card__result">
                <div className="horoscope-birth-card__result-main">
                  <span className="horoscope-birth-card__result-symbol" aria-hidden>
                    {ZODIAC_SIGNS[birthQueryResult.signIndex].symbol}
                  </span>
                  <div>
                    <p className="horoscope-birth-card__result-title">
                      {isEnglish ? ZODIAC_SIGNS[birthQueryResult.signIndex].nameEn : ZODIAC_SIGNS[birthQueryResult.signIndex].name}
                    </p>
                    <p className="horoscope-birth-card__result-sub">{tx('已定位你的星座，运势内容已更新', 'Your sign was found and the forecast has been updated')}</p>
                    {birthQueryResult.detail && (
                      <p className="horoscope-birth-card__result-detail">{birthQueryResult.detail}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" small onClick={scrollToHoroscopeReading}>
                  {tx('查看运势', 'View forecast')}
                </Button>
              </div>
            )}

            <Button variant="primary" block onClick={handleQueryByBirthday}>
              {tx('定位星座', 'Find my sign')}
            </Button>
          </div>
        </Collapsible>

        <Collapsible
          open={showPairing}
          onToggle={() => setShowPairing(!showPairing)}
          label={tx('星座配对 · 双星合盘', 'Zodiac compatibility')}
          labelOpen={tx('收起配对', 'Close compatibility')}
        >
          <Panel title={tx('选择两个星座', 'Choose two zodiac signs')}>
            <div className="field">
              <span className="field__label">{tx('第一个星座', 'First sign')}</span>
              <ChipGrid
                wide
                items={ZODIAC_SIGNS.map((z, idx) => ({
                  id: String(idx),
                  icon: z.symbol,
                  label: isEnglish ? z.nameEn : z.name,
                }))}
                value={pairingSign1 !== null ? String(pairingSign1) : ''}
                onChange={(id) => setPairingSign1(Number(id))}
              />
            </div>
            <div className="field">
              <span className="field__label">{tx('第二个星座', 'Second sign')}</span>
              <ChipGrid
                wide
                items={ZODIAC_SIGNS.map((z, idx) => ({
                  id: String(idx),
                  icon: z.symbol,
                  label: isEnglish ? z.nameEn : z.name,
                }))}
                value={pairingSign2 !== null ? String(pairingSign2) : ''}
                onChange={(id) => setPairingSign2(Number(id))}
              />
            </div>
            <Button variant="primary" block onClick={runPairing}>
              {tx('开始合盘分析', 'Analyze compatibility')}
            </Button>

            {pairingResult && (
              <div className="horoscope-pairing-result">
                <div className="horoscope-pairing-result__head">
                  <h3 className="horoscope-pairing-result__title">{tx('合盘结果', 'Compatibility result')}</h3>
                  <div className="horoscope-pairing-result__signs">
                    <span className="horoscope-pairing-result__sign">
                      <span aria-hidden>{pairingResult.sign1.symbol}</span>
                      {isEnglish ? ZODIAC_SIGNS[pairingSign1 ?? 0].nameEn : pairingResult.sign1.name}
                    </span>
                    <span className="horoscope-pairing-result__times" aria-hidden>×</span>
                    <span className="horoscope-pairing-result__sign">
                      <span aria-hidden>{pairingResult.sign2.symbol}</span>
                      {isEnglish ? ZODIAC_SIGNS[pairingSign2 ?? 0].nameEn : pairingResult.sign2.name}
                    </span>
                  </div>
                  <p className="horoscope-pairing-result__element">
                    {(isEnglish ? ELEMENT_LABEL_EN : ELEMENT_LABEL)[pairingResult.sign1.element]} × {(isEnglish ? ELEMENT_LABEL_EN : ELEMENT_LABEL)[pairingResult.sign2.element]}
                  </p>
                </div>

                <div className="horoscope-pairing-result__hero">
                  <div className="horoscope-pairing-result__score">
                    <span className="horoscope-pairing-result__score-value">{pairingResult.score}</span>
                    <span className="horoscope-pairing-result__score-label">{tx('配对指数', 'Match score')}</span>
                  </div>
                  <div className="horoscope-pairing-result__compat">
                    <span className="field__label">{tx('契合度', 'Compatibility')}</span>
                    <span className={compatTagClass(pairingResult.compatibility)}>
                      {pairingResult.compatibility}
                    </span>
                  </div>
                </div>

                <p className="horoscope-pairing-result__summary callout">{pairingResult.summary}</p>
                <p className="horoscope-pairing-result__dynamic">{pairingResult.elementDynamic}</p>

                <div className="horoscope-pairing-result__section">
                  <span className="field__label">{tx('相位关系', 'Astrological aspects')}</span>
                  <div className="horoscope-pairing-result__notes">
                    {pairingResult.relationshipNotes.map((note) => (
                      <article key={note.type} className="horoscope-pairing-result__note">
                        <span className={relTagClass(note.type)}>{note.type}</span>
                        <p>{note.description}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="horoscope-pairing-result__section">
                  <span className="field__label">{tx('维度解析', 'Dimensions')}</span>
                  <AspectGrid
                    items={pairingResult.dimensions.map((d) => ({
                      title: d.key,
                      score: d.value,
                      text: d.text,
                    }))}
                  />
                </div>

                <Panel title={tx('综合分析', 'Overall analysis')}>
                  <p className="prose">{pairingResult.analysis}</p>
                </Panel>

                <div className="horoscope-pairing-result__lists">
                  <Panel title={tx('优势亮点', 'Strengths')}>
                    <ul className="horoscope-pairing-result__list">
                      {pairingResult.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Panel>
                  <Panel title={tx('潜在挑战', 'Potential challenges')}>
                    <ul className="horoscope-pairing-result__list horoscope-pairing-result__list--warn">
                      {pairingResult.challenges.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Panel>
                </div>

                <Panel title={tx('相处建议', 'Relationship advice')}>
                  <p className="prose">{pairingResult.advice}</p>
                </Panel>
              </div>
            )}
          </Panel>
        </Collapsible>
      </div>
    </div>
  )
}

export default HoroscopeMainView
