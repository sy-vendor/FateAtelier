import {
  LUCKY_COLOR_BRAND,
  LUCKY_COLOR_BRAND_EN,
  SHENGXIAO_LIST,
  ZODIAC_NAMES,
  formatLuckyColorDate,
} from '../../utils/luckyColorData'
import { useLuckyColorGame } from '../../hooks/useLuckyColorGame'
import { LuckyColorLogoMark } from '../lucky-color/LuckyColorLogoMark'
import { LuckyColorRitualBar } from '../lucky-color/LuckyColorRitualBar'
import { Panel, Button, Segmented, ChipGrid, Collapsible } from '../ui'
import './lucky-color-stage.css'

function LuckyColorMainView() {
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

  return (
    <div className="lucky-color-stage">
      <header className="lucky-color-hero">
        <div className="lucky-color-hero__mark">
          <LuckyColorLogoMark size="lg" />
        </div>
        <div>
          <p className="lucky-color-hero__brand">{LUCKY_COLOR_BRAND}</p>
          <p className="lucky-color-hero__brand-en">{LUCKY_COLOR_BRAND_EN}</p>
          <p className="lucky-color-hero__hint">感应今日色谱，让色彩能量随行左右</p>
        </div>
      </header>

      <LuckyColorRitualBar step={ritualStep} />

      <section className="lucky-color-picker">
        <div className="lucky-color-picker__head">
          <div>
            <h2 className="lucky-color-picker__title">查询日期</h2>
            <p className="lucky-color-picker__sub">
              {formatLuckyColorDate(selectedDate)}
              {isToday && (
                <>
                  {' '}
                  <span className="tag tag--ok">今天</span>
                </>
              )}
            </p>
          </div>
          {!isToday && (
            <Button variant="ghost" small onClick={resetToToday}>
              回到今天
            </Button>
          )}
        </div>
        <div className="lucky-color-picker__ymd">
          {[
            { id: 'query-year', label: '年', value: queryYear, set: setQueryYear, max: 4, ph: '2026' },
            { id: 'query-month', label: '月', value: queryMonth, set: setQueryMonth, max: 2, ph: '7' },
            { id: 'query-day', label: '日', value: queryDay, set: setQueryDay, max: 2, ph: '9' },
          ].map((field) => (
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
          label="个性化推荐"
          labelOpen="收起个性化"
        >
          <div className="lucky-color-personal">
            <label className="lucky-color-picker__label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={usePersonalized}
                onChange={(e) => setUsePersonalized(e.target.checked)}
              />
              结合生辰、生肖与星座推算幸运色
            </label>

            {usePersonalized && (
              <>
                <div className="lucky-color-picker__field">
                  <span className="lucky-color-picker__label">历法</span>
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

                <div className="lucky-color-picker__ymd">
                  {[
                    { id: 'birth-year', label: '年', value: birthYear, ph: '1995' },
                    { id: 'birth-month', label: '月', value: birthMonth, ph: '8' },
                    { id: 'birth-day', label: '日', value: birthDay, ph: '10' },
                  ].map((field) => (
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
                    闰月
                  </label>
                )}

                <div className="field">
                  <span className="field__label">生肖</span>
                  <ChipGrid
                    wide
                    items={SHENGXIAO_LIST.map((sx) => ({ id: sx, label: sx }))}
                    value={shengxiao}
                    onChange={setShengxiao}
                  />
                </div>

                <div className="field">
                  <span className="field__label">星座</span>
                  <ChipGrid
                    wide
                    zodiac
                    items={ZODIAC_NAMES.map((name, index) => ({ id: String(index), label: name }))}
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
          <strong>推荐理由：</strong>
          {personalizedResult.reason}
        </p>
      )}

      <section className="lucky-color-reveal" aria-label="今日幸运色">
        <article className="lucky-color-swatch" style={{ backgroundColor: displayHex }}>
          <div className="lucky-color-swatch__overlay">
            <h2 className="lucky-color-swatch__name">{luckyColor.name}</h2>
            <div className="lucky-color-swatch__hex-row">
              <span className="lucky-color-swatch__hex">{displayHex}</span>
              <Button
                variant="ghost"
                small
                onClick={() => copyToClipboard(displayHex, 'hex')}
              >
                {copiedHex === 'hex' ? '已复制' : '复制'}
              </Button>
            </div>
            {luckyColor.energyLevel !== undefined && (
              <div className="lucky-color-swatch__energy">
                <span>能量</span>
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
          <p className="lucky-color-side__meaning">{luckyColor.meaning}</p>
          <div className="lucky-color-tags">
            <span className="tag tag--muted">五行 · {luckyColor.element}</span>
            <span className="tag tag--muted">{luckyColor.energy}</span>
          </div>
          <div className="lucky-color-secondary">
            <div
              className="lucky-color-secondary__chip"
              style={{ backgroundColor: secondaryColor.hex }}
            />
            <div>
              <p className="lucky-color-secondary__name">搭配色 · {secondaryColor.name}</p>
              <p className="lucky-color-secondary__hex">{secondaryColor.hex}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? '收起详情' : '查看色彩详情'}
          </Button>
        </div>
      </section>

      <Panel title="今日建议">
        <ul className="lucky-color-suggestions">
          {luckyColor.suggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Panel>

      <Panel title="习用指南">
        <div className="lucky-color-usage">
          {[
            { title: '穿搭', text: `选择含有${luckyColor.name}元素的服饰` },
            { title: '环境', text: `在空间中点缀${luckyColor.name}装饰` },
            { title: '配饰', text: `佩戴${luckyColor.name}色小物件` },
            { title: '搭配', text: `与${secondaryColor.name}组合效果更佳` },
          ].map((item) => (
            <article key={item.title} className="lucky-color-usage__item">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Panel>

      {showDetails && (
        <Panel title="色彩解读">
          {luckyColor.psychology && (
            <>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>心理学意义</h3>
              <p className="prose">{luckyColor.psychology}</p>
            </>
          )}
          {luckyColor.culture && (
            <>
              <h3 style={{ margin: '16px 0 8px', fontSize: '1rem' }}>文化背景</h3>
              <p className="prose">{luckyColor.culture}</p>
            </>
          )}
        </Panel>
      )}

      {luckyColor.timeSlots && luckyColor.timeSlots.length > 0 && (
        <Panel title="时段色谱" description="点击时段查看该时间段的幸运色">
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
                    <p className="lucky-color-times__label">{slot.time}</p>
                    <p className="lucky-color-times__sub">
                      {slot.color} · {slot.hex}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </Panel>
      )}

      <Panel title="配色方案">
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
                <span className="lucky-color-palette__label">{colorName}</span>
              </div>
            )
          })}
        </div>
      </Panel>

      <Button variant="primary" block onClick={shareColor}>
        分享幸运色
      </Button>

      <p className="callout">色彩能量仅供娱乐参考，请结合个人喜好与实际场景使用</p>
    </div>
  )
}

export default LuckyColorMainView
