import type { CalendarType } from '../../utils/birthDateUtils'
import { SHICHEN_NAMES } from '../../utils/baziData'
import { useTx } from '../../i18n/useTx'
import { Segmented, ChipGrid } from '../ui'

interface BirthDateFieldsProps {
  calendarType: CalendarType
  onCalendarTypeChange: (v: CalendarType) => void
  solarYear: string
  solarMonth: string
  solarDay: string
  onSolarYear: (v: string) => void
  onSolarMonth: (v: string) => void
  onSolarDay: (v: string) => void
  lunarYear: string
  lunarMonth: string
  lunarDay: string
  onLunarYear: (v: string) => void
  onLunarMonth: (v: string) => void
  onLunarDay: (v: string) => void
  isLunarLeapMonth: boolean
  onLunarLeapMonth: (v: boolean) => void
  birthTime: string
  onBirthTime: (v: string) => void
  shichenOptions: readonly string[]
  inputError?: string
}

export function BirthDateFields({
  calendarType,
  onCalendarTypeChange,
  solarYear,
  solarMonth,
  solarDay,
  onSolarYear,
  onSolarMonth,
  onSolarDay,
  lunarYear,
  lunarMonth,
  lunarDay,
  onLunarYear,
  onLunarMonth,
  onLunarDay,
  isLunarLeapMonth,
  onLunarLeapMonth,
  birthTime,
  onBirthTime,
  shichenOptions,
  inputError,
}: BirthDateFieldsProps) {
  const tx = useTx()

  return (
    <>
      <div className="field">
        <span className="field__label">{tx('历法类型', 'Calendar')}</span>
        <Segmented
          block
          value={calendarType}
          options={[
            { value: 'solar', label: tx('阳历', 'Gregorian') },
            { value: 'lunar', label: tx('农历', 'Lunar') },
          ]}
          onChange={onCalendarTypeChange}
        />
      </div>

      {calendarType === 'solar' ? (
        <div className="field">
          <span className="field__label">{tx('出生日期（阳历）', 'Birth date (Gregorian)')}</span>
          <div className="tools-time__fields">
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              aria-label={tx('年', 'Year')}
              placeholder="1995"
              value={solarYear}
              onChange={(e) => onSolarYear(e.target.value)}
            />
            <span className="tools-time__sep">{tx('年', 'Y')}</span>
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              aria-label={tx('月', 'Month')}
              placeholder="8"
              value={solarMonth}
              onChange={(e) => onSolarMonth(e.target.value)}
            />
            <span className="tools-time__sep">{tx('月', 'M')}</span>
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              aria-label={tx('日', 'Day')}
              placeholder="10"
              value={solarDay}
              onChange={(e) => onSolarDay(e.target.value)}
            />
            <span className="tools-time__sep">{tx('日', 'D')}</span>
          </div>
        </div>
      ) : (
        <div className="field">
          <span className="field__label">{tx('出生日期（农历）', 'Birth date (Lunar)')}</span>
          <div className="tools-time__fields">
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              placeholder={tx('年', 'Year')}
              value={lunarYear}
              onChange={(e) => onLunarYear(e.target.value)}
              aria-label={tx('农历年', 'Lunar year')}
            />
            <span className="tools-time__sep">{tx('年', 'Y')}</span>
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              placeholder={tx('月', 'Month')}
              value={lunarMonth}
              onChange={(e) => onLunarMonth(e.target.value)}
              aria-label={tx('农历月', 'Lunar month')}
            />
            <span className="tools-time__sep">{tx('月', 'M')}</span>
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              placeholder={tx('日', 'Day')}
              value={lunarDay}
              onChange={(e) => onLunarDay(e.target.value)}
              aria-label={tx('农历日', 'Lunar day')}
            />
            <span className="tools-time__sep">{tx('日', 'D')}</span>
            <label className="tools-leap" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={isLunarLeapMonth}
                onChange={(e) => onLunarLeapMonth(e.target.checked)}
              />
              {tx('闰月', 'Leap month')}
            </label>
          </div>
          <p className="callout">{tx('支持 1900–2100 年农历转阳历。', 'Supports lunar dates from 1900 to 2100.')}</p>
        </div>
      )}

      <div className="field">
        <span className="field__label">{tx('出生时辰', 'Birth hour')}</span>
        <ChipGrid
          wide
          items={shichenOptions.map((shichen) => ({ id: shichen, label: shichen }))}
          value={birthTime}
          onChange={onBirthTime}
        />
        <p className="callout">{SHICHEN_NAMES[birthTime]}</p>
      </div>

      {inputError && <p className="tools-input-error" role="alert">{inputError}</p>}
    </>
  )
}
