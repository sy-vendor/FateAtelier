import { useMemo, useState } from 'react'
import { toast } from '../../utils/toast'
import {
  HOROSCOPE_BRAND,
  HOROSCOPE_BRAND_EN,
  ZODIAC_SIGNS,
  ELEMENT_LABEL,
  ELEMENT_PEERS,
  PERIOD_OPTIONS,
  type HoroscopePeriod,
} from '../../utils/horoscopeData'
import {
  analyzeZodiacPairing,
  compatTagClass,
  generateHoroscope,
  getHoroscopeSeed,
  getZodiacSignByDate,
  relTagClass,
  type PairingResult,
} from '../../utils/horoscopeEngine'
import { lunarToSolar } from '../../utils/horoscopeLunar'
import { HoroscopeLogoMark } from '../horoscope/HoroscopeLogoMark'
import { HoroscopeRitualBar } from '../horoscope/HoroscopeRitualBar'
import { Panel, Button, Segmented, ChipGrid, AspectGrid, Collapsible } from '../ui'
import '../app/horoscope-stage.css'

type CalendarType = 'solar' | 'lunar'

type BirthQueryResult = {
  signIndex: number
  detail?: string
}

const PERIOD_HEADLINE: Record<HoroscopePeriod, string> = {
  today: '今日星象',
  week: '本周星轨',
  month: '本月天象',
}

function digitsOnly(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

function scrollToHoroscopeReading() {
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('horoscope-reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  })
}

function HoroscopeMainView() {
  const [period, setPeriod] = useState<HoroscopePeriod>('today')
  const [signIndex, setSignIndex] = useState(0)
  const [engaged, setEngaged] = useState(false)
  const [calendarType, setCalendarType] = useState<CalendarType>('solar')
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [showBirthInput, setShowBirthInput] = useState(false)
  const [isLunarLeapMonth, setIsLunarLeapMonth] = useState(false)
  const [birthQueryResult, setBirthQueryResult] = useState<BirthQueryResult | null>(null)
  const [birthQueryError, setBirthQueryError] = useState<string | null>(null)
  const [showPairing, setShowPairing] = useState(false)
  const [pairingSign1, setPairingSign1] = useState<number | null>(null)
  const [pairingSign2, setPairingSign2] = useState<number | null>(null)
  const [pairingResult, setPairingResult] = useState<PairingResult | null>(null)

  const today = new Date()
  const sign = ZODIAC_SIGNS[signIndex]

  const result = useMemo(() => {
    const seed = getHoroscopeSeed(today, signIndex, period)
    return generateHoroscope(seed, sign.element)
  }, [today, signIndex, period, sign.element])

  const ritualStep = useMemo((): 1 | 2 | 3 | 4 => {
    if (pairingResult) return 4
    if (showPairing || engaged) return 3
    return 1
  }, [pairingResult, showPairing, engaged])

  const lunarSolarPreview = useMemo(() => {
    if (calendarType !== 'lunar' || !birthYear || !birthMonth || !birthDay) return null

    const year = parseInt(birthYear, 10)
    const month = parseInt(birthMonth, 10)
    const day = parseInt(birthDay, 10)

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null

    const solarDate = lunarToSolar(year, isLunarLeapMonth ? month + 12 : month, day)
    if (!solarDate) return null

    return `对应阳历 ${solarDate.getFullYear()}年${solarDate.getMonth() + 1}月${solarDate.getDate()}日`
  }, [calendarType, birthYear, birthMonth, birthDay, isLunarLeapMonth])

  const clearBirthQueryFeedback = () => {
    setBirthQueryResult(null)
    setBirthQueryError(null)
  }

  const handleBirthFieldChange = (
    setter: (value: string) => void,
    value: string,
    maxLength: number,
  ) => {
    setter(digitsOnly(value, maxLength))
    clearBirthQueryFeedback()
  }

  const handleSignChange = (id: string) => {
    const idx = ZODIAC_SIGNS.findIndex((z) => z.id === id)
    if (idx >= 0) {
      setSignIndex(idx)
      setEngaged(true)
    }
  }

  const handleQueryByBirthday = () => {
    setBirthQueryError(null)
    setBirthQueryResult(null)

    if (!birthYear || !birthMonth || !birthDay) {
      setBirthQueryError('请完整填写年、月、日')
      return
    }

    const year = parseInt(birthYear, 10)
    const month = parseInt(birthMonth, 10)
    const day = parseInt(birthDay, 10)

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setBirthQueryError('请输入有效的数字日期')
      return
    }

    if (year < 1900 || year > 2100) {
      setBirthQueryError('年份需在 1900–2100 之间')
      return
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      setBirthQueryError('月日范围不正确')
      return
    }

    if (calendarType === 'solar') {
      const calculatedSign = getZodiacSignByDate(month, day)
      setSignIndex(calculatedSign)
      setEngaged(true)
      setBirthQueryResult({ signIndex: calculatedSign })
      scrollToHoroscopeReading()
      return
    }

    const lunarMonthParam = isLunarLeapMonth ? month + 12 : month
    const solarDate = lunarToSolar(year, lunarMonthParam, day)
    if (!solarDate) {
      setBirthQueryError('农历日期转换失败，请检查日期或闰月是否正确')
      return
    }

    const calculatedSign = getZodiacSignByDate(solarDate.getMonth() + 1, solarDate.getDate())
    const solarMonth = solarDate.getMonth() + 1
    const solarDay = solarDate.getDate()
    setSignIndex(calculatedSign)
    setEngaged(true)
    setBirthQueryResult({
      signIndex: calculatedSign,
      detail: `农历 ${year}年${isLunarLeapMonth ? '闰' : ''}${month}月${day}日 → 阳历 ${solarDate.getFullYear()}年${solarMonth}月${solarDay}日`,
    })
    scrollToHoroscopeReading()
  }

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
          <Segmented
            block
            value={period}
            options={PERIOD_OPTIONS}
            onChange={(v) => {
              setPeriod(v)
              setEngaged(true)
            }}
          />
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
                onChange={(v) => {
                  setCalendarType(v)
                  if (v === 'solar') setIsLunarLeapMonth(false)
                  clearBirthQueryFeedback()
                }}
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
            <Button
              variant="primary"
              block
              onClick={() => {
                if (pairingSign1 !== null && pairingSign2 !== null) {
                  setPairingResult(analyzeZodiacPairing(pairingSign1, pairingSign2))
                  setEngaged(true)
                } else {
                  toast.warning('请选择两个星座')
                }
              }}
            >
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
