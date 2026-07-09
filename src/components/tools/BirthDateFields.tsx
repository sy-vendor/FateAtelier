import type { CalendarType } from '../../utils/birthDateUtils'
import { SHICHEN_NAMES } from '../../utils/baziData'
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
  return (
    <>
      <div className="field">
        <span className="field__label">历法类型</span>
        <Segmented
          block
          value={calendarType}
          options={[
            { value: 'solar', label: '阳历' },
            { value: 'lunar', label: '农历' },
          ]}
          onChange={onCalendarTypeChange}
        />
      </div>

      {calendarType === 'solar' ? (
        <div className="field">
          <span className="field__label">出生日期（阳历）</span>
          <div className="tools-time__fields">
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              aria-label="年"
              placeholder="1995"
              value={solarYear}
              onChange={(e) => onSolarYear(e.target.value)}
            />
            <span className="tools-time__sep">年</span>
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              aria-label="月"
              placeholder="8"
              value={solarMonth}
              onChange={(e) => onSolarMonth(e.target.value)}
            />
            <span className="tools-time__sep">月</span>
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              aria-label="日"
              placeholder="10"
              value={solarDay}
              onChange={(e) => onSolarDay(e.target.value)}
            />
            <span className="tools-time__sep">日</span>
          </div>
        </div>
      ) : (
        <div className="field">
          <span className="field__label">出生日期（农历）</span>
          <div className="tools-time__fields">
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              placeholder="年"
              value={lunarYear}
              onChange={(e) => onLunarYear(e.target.value)}
              aria-label="农历年"
            />
            <span className="tools-time__sep">年</span>
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              placeholder="月"
              value={lunarMonth}
              onChange={(e) => onLunarMonth(e.target.value)}
              aria-label="农历月"
            />
            <span className="tools-time__sep">月</span>
            <input
              type="text"
              inputMode="numeric"
              className="field__input"
              placeholder="日"
              value={lunarDay}
              onChange={(e) => onLunarDay(e.target.value)}
              aria-label="农历日"
            />
            <span className="tools-time__sep">日</span>
            <label className="tools-leap" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={isLunarLeapMonth}
                onChange={(e) => onLunarLeapMonth(e.target.checked)}
              />
              闰月
            </label>
          </div>
          <p className="callout">支持 1900–2100 年农历转阳历。</p>
        </div>
      )}

      <div className="field">
        <span className="field__label">出生时辰</span>
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
