import { useMemo } from 'react'
import {
  LUCKY_COLOR_BRAND,
  LUCKY_COLOR_BRAND_EN,
  SHENGXIAO_LIST,
  ZODIAC_NAMES,
  formatLuckyColorDate,
  getTimeSlotLabelEn,
  getTimeSlotColorEn,
} from '../../utils/luckyColorData'
import { useLuckyColorGame } from '../../hooks/useLuckyColorGame'
import { LuckyColorLogoMark } from '../lucky-color/LuckyColorLogoMark'
import { LuckyColorRitualBar } from '../lucky-color/LuckyColorRitualBar'
import { Panel, Button, Segmented, ChipGrid, Collapsible } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './lucky-color-stage.css'

const SHENGXIAO_EN: Record<string, string> = {
  鼠: 'Rat', 牛: 'Ox', 虎: 'Tiger', 兔: 'Rabbit', 龙: 'Dragon', 蛇: 'Snake',
  马: 'Horse', 羊: 'Goat', 猴: 'Monkey', 鸡: 'Rooster', 狗: 'Dog', 猪: 'Pig',
}

const ZODIAC_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

function LuckyColorMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const colorText = (color: { name: string; nameEn?: string }) => isEnglish ? (color.nameEn ?? color.name) : color.name
  const {
    selectedDate,
    isToday,
    queryYear,
    queryMonth,
    queryDay,
    setQueryField,
    setQueryYear,
    setQueryMonth,
    setQueryDay,
    showPersonalized,
    setShowPersonalized,
    usePersonalized,
    setUsePersonalized,
    calendarType,
    birthYear,
    birthMonth,
    birthDay,
    isLunarLeapMonth,
    setIsLunarLeapMonth,
    zodiacSign,
    setZodiacSign,
    shengxiao,
    setShengxiao,
    showDetails,
    setShowDetails,
    selectedTimeSlot,
    setSelectedTimeSlot,
    copiedHex,
    currentTimeSlot,
    personalizedResult,
    luckyColor,
    secondaryColor,
    displayHex,
    ritualStep,
    resetToToday,
    copyToClipboard,
    shareColor,
    handleBirthFieldChange,
    handleCalendarTypeChange,
    colorDatabase,
  } = useLuckyColorGame()
  const localizedDate = isEnglish
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : formatLuckyColorDate(selectedDate)

  const dateFields = useMemo(() => [
    { id: 'query-year', label: tx('年', 'Year'), value: queryYear, set: setQueryYear, max: 4, ph: '2026' },
    { id: 'query-month', label: tx('月', 'Month'), value: queryMonth, set: setQueryMonth, max: 2, ph: '7' },
    { id: 'query-day', label: tx('日', 'Day'), value: queryDay, set: setQueryDay, max: 2, ph: '9' },
  ], [tx, queryYear, queryMonth, queryDay, setQueryYear, setQueryMonth, setQueryDay])

  const birthFields = useMemo(() => [
    { id: 'birth-year', label: tx('年', 'Year'), value: birthYear, ph: '1995' },
    { id: 'birth-month', label: tx('月', 'Month'), value: birthMonth, ph: '8' },
    { id: 'birth-day', label: tx('日', 'Day'), value: birthDay, ph: '10' },
  ], [tx, birthYear, birthMonth, birthDay])

  const usageItems = useMemo(() => [
    { title: tx('穿搭', 'Outfit'), text: tx(`选择含有${luckyColor.name}元素的服饰`, `Wear clothing with ${colorText(luckyColor)} tones`) },
    { title: tx('环境', 'Space'), text: tx(`在空间中点缀${luckyColor.name}装饰`, `Add ${colorText(luckyColor)} accents to your space`) },
    { title: tx('配饰', 'Accessories'), text: tx(`佩戴${luckyColor.name}色小物件`, `Wear small ${colorText(luckyColor)} accessories`) },
    { title: tx('搭配', 'Pairing'), text: tx(`与${secondaryColor.name}组合效果更佳`, `Pairs well with ${colorText(secondaryColor)}`) },
  ], [tx, isEnglish, luckyColor, secondaryColor])

  return (
    <div className="lucky-color-stage">
      <header className="lucky-color-hero">
        <div className="lucky-color-hero__mark">
          <LuckyColorLogoMark size="lg" />
        </div>
        <div>
          <p className="lucky-color-hero__brand">{tx(LUCKY_COLOR_BRAND, LUCKY_COLOR_BRAND_EN)}</p>
          <p className="lucky-color-hero__brand-en">{isEnglish ? LUCKY_COLOR_BRAND_EN.toUpperCase() : LUCKY_COLOR_BRAND_EN}</p>
          <p className="lucky-color-hero__hint">{tx('感应今日色谱，让色彩能量随行左右', 'Sense today\'s palette and carry color energy with you')}</p>
        </div>
      </header>

      <LuckyColorRitualBar step={ritualStep} />

      <section className="lucky-color-picker">
        <div className="lucky-color-picker__head">
          <div>
            <h2 className="lucky-color-picker__title">{tx('查询日期', 'Query date')}</h2>
            <p className="lucky-color-picker__sub">
              {localizedDate}
              {isToday && (
                <>
                  {' '}
                  <span className="tag tag--ok">{tx('今天', 'Today')}</span>
                </>
              )}
            </p>
          </div>
          {!isToday && (
            <Button variant="ghost" small onClick={resetToToday}>
              {tx('回到今天', 'Back to today')}
            </Button>
          )}
        </div>
        <div className="lucky-color-picker__ymd">
          {dateFields.map((field) => (
            <div key={field.id} className="lucky-color-picker__field">
              <label className="lucky-color-picker__label" htmlFor={field.id}>
                {field.label}
              </label>
              <input
                id={field.id}
                type="text"
                inputMode="numeric"
                placeholder={field.ph}
                value={field.value}
                onChange={(e) => setQueryField(field.set, e.target.value, field.max)}
                className="field__input lucky-color-picker__input"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="lucky-color-extra">
        <Collapsible
          open={showPersonalized}
          onToggle={() => setShowPersonalized(!showPersonalized)}
          label={tx('个性化推荐', 'Personalized')}
          labelOpen={tx('收起个性化', 'Close personalized')}
        >
          <div className="lucky-color-personal">
            <label className="lucky-color-picker__label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={usePersonalized}
                onChange={(e) => setUsePersonalized(e.target.checked)}
              />
              {tx('结合生辰、生肖与星座推算幸运色', 'Factor in birth date, zodiac animal, and sign')}
            </label>

            {usePersonalized && (
              <>
                <div className="lucky-color-picker__field">
                  <span className="lucky-color-picker__label">{tx('历法', 'Calendar')}</span>
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

                <div className="lucky-color-picker__ymd">
                  {birthFields.map((field) => (
                    <div key={field.id} className="lucky-color-picker__field">
                      <label className="lucky-color-picker__label" htmlFor={field.id}>
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type="text"
                        inputMode="numeric"
                        placeholder={field.ph}
                        value={field.value}
                        onChange={(e) => handleBirthFieldChange(field.id, e.target.value)}
                        className="field__input lucky-color-picker__input"
                      />
                    </div>
                  ))}
                </div>

                {calendarType === 'lunar' && (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--ds-text-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={isLunarLeapMonth}
                      onChange={(e) => setIsLunarLeapMonth(e.target.checked)}
                    />
                    {tx('闰月', 'Leap month')}
                  </label>
                )}

                <div className="field">
                  <span className="field__label">{tx('生肖', 'Zodiac animal')}</span>
                  <ChipGrid
                    wide
                    items={SHENGXIAO_LIST.map((sx) => ({
                      id: sx,
                      label: tx(sx, SHENGXIAO_EN[sx] ?? sx),
                    }))}
                    value={shengxiao}
                    onChange={setShengxiao}
                  />
                </div>

                <div className="field">
                  <span className="field__label">{tx('星座', 'Zodiac sign')}</span>
                  <ChipGrid
                    wide
                    zodiac
                    items={ZODIAC_NAMES.map((name, index) => ({
                      id: String(index),
                      label: tx(name, ZODIAC_EN[index] ?? name),
                    }))}
                    value={zodiacSign !== undefined ? String(zodiacSign) : ''}
                    onChange={(id) => setZodiacSign(Number(id))}
                  />
                </div>
              </>
            )}
          </div>
        </Collapsible>
      </div>

      {personalizedResult && (
        <p className="callout">
          <strong>{tx('推荐理由：', 'Why this color: ')}</strong>
          {personalizedResult.reason}
        </p>
      )}

      <section className="lucky-color-reveal" aria-label={tx('今日幸运色', 'Today\'s lucky color')}>
        <article className="lucky-color-swatch" style={{ backgroundColor: displayHex }}>
          <div className="lucky-color-swatch__overlay">
            <h2 className="lucky-color-swatch__name">{colorText(luckyColor)}</h2>
            <div className="lucky-color-swatch__hex-row">
              <span className="lucky-color-swatch__hex">{displayHex}</span>
              <Button
                variant="ghost"
                small
                onClick={() => copyToClipboard(displayHex, 'hex')}
              >
                {copiedHex === 'hex' ? tx('已复制', 'Copied') : tx('复制', 'Copy')}
              </Button>
            </div>
            {luckyColor.energyLevel !== undefined && (
              <div className="lucky-color-swatch__energy">
                <span>{tx('能量', 'Energy')}</span>
                <div className="lucky-color-swatch__energy-bar">
                  <div
                    className="lucky-color-swatch__energy-fill"
                    style={{ width: `${luckyColor.energyLevel}%` }}
                  />
                </div>
                <span>{luckyColor.energyLevel}</span>
              </div>
            )}
          </div>
        </article>

        <div className="lucky-color-side">
          <p className="lucky-color-side__meaning">{isEnglish ? (luckyColor.meaningEn ?? luckyColor.meaning) : luckyColor.meaning}</p>
          <div className="lucky-color-tags">
            <span className="tag tag--muted">{tx('五行', 'Element')} · {isEnglish ? (luckyColor.elementEn ?? luckyColor.element) : luckyColor.element}</span>
            <span className="tag tag--muted">{isEnglish ? (luckyColor.energyEn ?? luckyColor.energy) : luckyColor.energy}</span>
          </div>
          <div className="lucky-color-secondary">
            <div
              className="lucky-color-secondary__chip"
              style={{ backgroundColor: secondaryColor.hex }}
            />
            <div>
              <p className="lucky-color-secondary__name">{tx('搭配色', 'Pairing')} · {colorText(secondaryColor)}</p>
              <p className="lucky-color-secondary__hex">{secondaryColor.hex}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? tx('收起详情', 'Hide details') : tx('查看色彩详情', 'View color details')}
          </Button>
        </div>
      </section>

      <Panel title={tx('今日建议', 'Today\'s tips')}>
        <ul className="lucky-color-suggestions">
          {(isEnglish ? (luckyColor.suggestionsEn ?? luckyColor.suggestions) : luckyColor.suggestions).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Panel>

      <Panel title={tx('习用指南', 'How to use')}>
        <div className="lucky-color-usage">
          {usageItems.map((item) => (
            <article key={item.title} className="lucky-color-usage__item">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Panel>

      {showDetails && (
        <Panel title={tx('色彩解读', 'Color reading')}>
          {luckyColor.psychology && (
            <>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{tx('心理学意义', 'Psychology')}</h3>
              <p className="prose">{isEnglish ? (luckyColor.psychologyEn ?? luckyColor.psychology) : luckyColor.psychology}</p>
            </>
          )}
          {luckyColor.culture && (
            <>
              <h3 style={{ margin: '16px 0 8px', fontSize: '1rem' }}>{tx('文化背景', 'Cultural context')}</h3>
              <p className="prose">{isEnglish ? (luckyColor.cultureEn ?? luckyColor.culture) : luckyColor.culture}</p>
            </>
          )}
        </Panel>
      )}

      {luckyColor.timeSlots && luckyColor.timeSlots.length > 0 && (
        <Panel title={tx('时段色谱', 'Hourly palette')} description={tx('点击时段查看该时间段的幸运色', 'Tap a time slot to view its lucky color')}>
          <div className="lucky-color-times">
            {luckyColor.timeSlots.map((slot) => {
              const active = (selectedTimeSlot ?? currentTimeSlot) === slot.time
              return (
                <button
                  key={slot.time}
                  type="button"
                  className={[
                    'lucky-color-times__cell',
                    active ? 'lucky-color-times__cell--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelectedTimeSlot(slot.time)}
                >
                  <div
                    className="lucky-color-times__chip"
                    style={{ backgroundColor: slot.hex }}
                  />
                  <div>
                    <p className="lucky-color-times__label">{isEnglish ? getTimeSlotLabelEn(slot.time) : slot.time}</p>
                    <p className="lucky-color-times__sub">
                      {isEnglish ? getTimeSlotColorEn(slot.color) : slot.color} · {slot.hex}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </Panel>
      )}

      <Panel title={tx('配色方案', 'Color palette')}>
        <div className="lucky-color-palette">
          {luckyColor.compatibleColors.map((colorName) => {
            const colorInfo = Object.values(colorDatabase).find((c) => c.name === colorName)
            if (!colorInfo) return null
            return (
              <div key={colorName} className="lucky-color-palette__item">
                <div
                  className="lucky-color-palette__chip"
                  style={{ backgroundColor: colorInfo.hex }}
                />
                <span className="lucky-color-palette__label">{colorText(colorInfo)}</span>
              </div>
            )
          })}
        </div>
      </Panel>

      <Button variant="primary" block onClick={shareColor}>
        {tx('分享幸运色', 'Share lucky color')}
      </Button>

      <p className="callout">{tx('色彩能量仅供娱乐参考，请结合个人喜好与实际场景使用', 'Color energy is for fun — use what feels right for you')}</p>
    </div>
  )
}

export default LuckyColorMainView
