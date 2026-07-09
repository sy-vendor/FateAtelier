import {
  HOROSCOPE_BRAND,
  HOROSCOPE_BRAND_EN,
  ZODIAC_SIGNS,
  ELEMENT_LABEL,
  ELEMENT_PEERS,
  PERIOD_OPTIONS,
  PERIOD_HEADLINE,
} from '../../utils/horoscopeData'
import { compatTagClass, relTagClass } from '../../utils/horoscopeEngine'
import { useHoroscopeGame } from '../../hooks/useHoroscopeGame'
import { HoroscopeLogoMark } from '../horoscope/HoroscopeLogoMark'
import { HoroscopeRitualBar } from '../horoscope/HoroscopeRitualBar'
import { Panel, Button, Segmented, ChipGrid, AspectGrid, Collapsible } from '../ui'
import './horoscope-stage.css'

function HoroscopeMainView() {
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
          <p className="horoscope-hero__brand">{HOROSCOPE_BRAND}</p>
          <p className="horoscope-hero__brand-en">{HOROSCOPE_BRAND_EN}</p>
          <p className="horoscope-hero__hint">仰望星空，聆听十二宫的低语</p>
        </div>
      </header>

      <HoroscopeRitualBar step={ritualStep} />

      <section className="horoscope-picker">
        <div className="horoscope-picker__intro">
          <h2 className="horoscope-picker__title">选择你的星座</h2>
          <p className="horoscope-picker__sub">点击星座符号，聆听星轨指引</p>
        </div>

        <div className="horoscope-picker__period">
          <span className="horoscope-picker__period-label">观星频率</span>
          <Segmented block value={period} options={PERIOD_OPTIONS} onChange={handlePeriodChange} />
        </div>

        <ChipGrid
          zodiac
          items={ZODIAC_SIGNS.map((z) => ({ id: z.id, icon: z.symbol, label: z.name }))}
          value={sign.id}
          onChange={handleSignChange}
        />
      </section>

      <section id="horoscope-reading" className="horoscope-reading">
        <div className="horoscope-reading__banner">
          <div className="horoscope-sign-badge">
            <span className="horoscope-sign-badge__symbol">{sign.symbol}</span>
            <span className="horoscope-sign-badge__element">{sign.element}象</span>
          </div>
          <div className="horoscope-reading__meta">
            <h2>{sign.name}</h2>
            <p className="horoscope-reading__dates">{sign.dates}</p>
            <p className="horoscope-reading__period">{PERIOD_HEADLINE[period]}</p>
          </div>
          <div className="horoscope-score-ring">
            <span className="horoscope-score-ring__value">{result.overall}</span>
            <span className="horoscope-score-ring__label">综合指数</span>
          </div>
        </div>

        <div className="horoscope-lucky">
          <div className="horoscope-lucky__item">
            <span className="horoscope-lucky__label">幸运颜色</span>
            <span className="horoscope-lucky__value">{result.color}</span>
          </div>
          <div className="horoscope-lucky__item">
            <span className="horoscope-lucky__label">幸运物品</span>
            <span className="horoscope-lucky__value">{result.item}</span>
          </div>
        </div>

        <Panel title="星象概览">
          <p className="prose">{result.summary}</p>
          <p className="callout" style={{ marginTop: 12 }}>
            {ELEMENT_LABEL[result.element]} · {ELEMENT_PEERS[result.element]}
          </p>
        </Panel>

        <AspectGrid
          items={result.details.map((d) => ({
            title: d.key,
            score: d.value,
            text: d.text,
          }))}
        />

        <Panel title="星轨建议">
          <p className="prose">{result.advice}</p>
        </Panel>
      </section>

      <div className="horoscope-extra">
        <Collapsible
          open={showBirthInput}
          onToggle={() => setShowBirthInput(!showBirthInput)}
          label="生日定位星座"
          labelOpen="收起生日查询"
        >
          <div className="horoscope-birth-card">
            <p className="horoscope-birth-card__hint">输入出生日期，自动匹配所属星座</p>

            <div className="horoscope-birth-card__calendar">
              <span className="horoscope-birth-card__label">历法</span>
              <Segmented
                block
                value={calendarType}
                options={[
                  { value: 'solar', label: '阳历' },
                  { value: 'lunar', label: '农历' },
                ]}
                onChange={handleCalendarTypeChange}
              />
            </div>

            <div className="horoscope-birth-card__ymd">
              <div className="horoscope-birth-card__field">
                <label className="horoscope-birth-card__label" htmlFor="horoscope-birth-year">
                  年
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
                  月
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
                  日
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
                  <span>闰月</span>
                </label>
                {lunarSolarPreview ? (
                  <p className="horoscope-birth-card__preview">{lunarSolarPreview}</p>
                ) : (
                  <p className="horoscope-birth-card__note">支持 1900–2100 年农历转阳历</p>
                )}
              </>
            )}

            {calendarType === 'solar' && (
              <p className="horoscope-birth-card__note">星座按阳历月日计算</p>
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
                      {ZODIAC_SIGNS[birthQueryResult.signIndex].name}
                    </p>
                    <p className="horoscope-birth-card__result-sub">已定位你的星座，运势内容已更新</p>
                    {birthQueryResult.detail && (
                      <p className="horoscope-birth-card__result-detail">{birthQueryResult.detail}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" small onClick={scrollToHoroscopeReading}>
                  查看运势
                </Button>
              </div>
            )}

            <Button variant="primary" block onClick={handleQueryByBirthday}>
              定位星座
            </Button>
          </div>
        </Collapsible>

        <Collapsible
          open={showPairing}
          onToggle={() => setShowPairing(!showPairing)}
          label="星座配对 · 双星合盘"
          labelOpen="收起配对"
        >
          <Panel title="选择两个星座">
            <div className="field">
              <span className="field__label">第一个星座</span>
              <ChipGrid
                wide
                items={ZODIAC_SIGNS.map((z, idx) => ({
                  id: String(idx),
                  icon: z.symbol,
                  label: z.name,
                }))}
                value={pairingSign1 !== null ? String(pairingSign1) : ''}
                onChange={(id) => setPairingSign1(Number(id))}
              />
            </div>
            <div className="field">
              <span className="field__label">第二个星座</span>
              <ChipGrid
                wide
                items={ZODIAC_SIGNS.map((z, idx) => ({
                  id: String(idx),
                  icon: z.symbol,
                  label: z.name,
                }))}
                value={pairingSign2 !== null ? String(pairingSign2) : ''}
                onChange={(id) => setPairingSign2(Number(id))}
              />
            </div>
            <Button variant="primary" block onClick={runPairing}>
              开始合盘分析
            </Button>

            {pairingResult && (
              <div className="horoscope-pairing-result">
                <div className="horoscope-pairing-result__head">
                  <h3 className="horoscope-pairing-result__title">合盘结果</h3>
                  <div className="horoscope-pairing-result__signs">
                    <span className="horoscope-pairing-result__sign">
                      <span aria-hidden>{pairingResult.sign1.symbol}</span>
                      {pairingResult.sign1.name}
                    </span>
                    <span className="horoscope-pairing-result__times" aria-hidden>×</span>
                    <span className="horoscope-pairing-result__sign">
                      <span aria-hidden>{pairingResult.sign2.symbol}</span>
                      {pairingResult.sign2.name}
                    </span>
                  </div>
                  <p className="horoscope-pairing-result__element">
                    {ELEMENT_LABEL[pairingResult.sign1.element]} × {ELEMENT_LABEL[pairingResult.sign2.element]}
                  </p>
                </div>

                <div className="horoscope-pairing-result__hero">
                  <div className="horoscope-pairing-result__score">
                    <span className="horoscope-pairing-result__score-value">{pairingResult.score}</span>
                    <span className="horoscope-pairing-result__score-label">配对指数</span>
                  </div>
                  <div className="horoscope-pairing-result__compat">
                    <span className="field__label">契合度</span>
                    <span className={compatTagClass(pairingResult.compatibility)}>
                      {pairingResult.compatibility}
                    </span>
                  </div>
                </div>

                <p className="horoscope-pairing-result__summary callout">{pairingResult.summary}</p>
                <p className="horoscope-pairing-result__dynamic">{pairingResult.elementDynamic}</p>

                <div className="horoscope-pairing-result__section">
                  <span className="field__label">相位关系</span>
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
                  <span className="field__label">维度解析</span>
                  <AspectGrid
                    items={pairingResult.dimensions.map((d) => ({
                      title: d.key,
                      score: d.value,
                      text: d.text,
                    }))}
                  />
                </div>

                <Panel title="综合分析">
                  <p className="prose">{pairingResult.analysis}</p>
                </Panel>

                <div className="horoscope-pairing-result__lists">
                  <Panel title="优势亮点">
                    <ul className="horoscope-pairing-result__list">
                      {pairingResult.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Panel>
                  <Panel title="潜在挑战">
                    <ul className="horoscope-pairing-result__list horoscope-pairing-result__list--warn">
                      {pairingResult.challenges.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Panel>
                </div>

                <Panel title="相处建议">
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
