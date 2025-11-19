import { useState } from 'react'
import { lunarToSolar, getLeapMonth, getLunarMonthDays } from '../utils/lunarCalendar'
import './DateInput.css'

interface DateInputProps {
  calendarType: 'solar' | 'lunar'
  onCalendarTypeChange: (type: 'solar' | 'lunar') => void
  solarDate: string
  onSolarDateChange: (date: string) => void
  lunarYear: string
  onLunarYearChange: (year: string) => void
  lunarMonth: string
  onLunarMonthChange: (month: string) => void
  lunarDay: string
  onLunarDayChange: (day: string) => void
  isLunarLeapMonth: boolean
  onLunarLeapMonthChange: (isLeap: boolean) => void
  onResetToNow?: () => void
  title?: string
  showResetButton?: boolean
}

export default function DateInput({
  calendarType,
  onCalendarTypeChange,
  solarDate,
  onSolarDateChange,
  lunarYear,
  onLunarYearChange,
  lunarMonth,
  onLunarMonthChange,
  lunarDay,
  onLunarDayChange,
  isLunarLeapMonth,
  onLunarLeapMonthChange,
  onResetToNow,
  title = '选择日期',
  showResetButton = true
}: DateInputProps) {
  const [convertedSolarDate, setConvertedSolarDate] = useState<string>('')

  // 农历转阳历预览
  const handleLunarChange = () => {
    if (lunarYear && lunarMonth && lunarDay) {
      const year = parseInt(lunarYear)
      const month = parseInt(lunarMonth)
      const day = parseInt(lunarDay)
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day) && year >= 1900 && year <= 2100) {
        const lunarMonthParam = isLunarLeapMonth ? month + 12 : month
        const solarDate = lunarToSolar(year, lunarMonthParam, day)
        if (solarDate) {
          const year = solarDate.getFullYear()
          const month = String(solarDate.getMonth() + 1).padStart(2, '0')
          const day = String(solarDate.getDate()).padStart(2, '0')
          setConvertedSolarDate(`${year}-${month}-${day}`)
        } else {
          setConvertedSolarDate('')
        }
      } else {
        setConvertedSolarDate('')
      }
    } else {
      setConvertedSolarDate('')
    }
  }

  // 获取农历月份的最大天数
  const getMaxLunarDay = (): number => {
    if (!lunarYear || !lunarMonth) return 30
    const year = parseInt(lunarYear)
    const month = parseInt(lunarMonth)
    if (isNaN(year) || isNaN(month) || year < 1900 || year > 2100) return 30
    const lunarMonthParam = isLunarLeapMonth ? month + 12 : month
    return getLunarMonthDays(year, lunarMonthParam) || 30
  }

  // 检查是否有闰月
  const hasLeapMonth = (): boolean => {
    if (!lunarYear) return false
    const year = parseInt(lunarYear)
    if (isNaN(year) || year < 1900 || year > 2100) return false
    return getLeapMonth(year) > 0
  }

  // 获取闰月月份
  const getLeapMonthNumber = (): number => {
    if (!lunarYear) return 0
    const year = parseInt(lunarYear)
    if (isNaN(year) || year < 1900 || year > 2100) return 0
    return getLeapMonth(year)
  }

  return (
    <div className="date-input-container">
      {title && <h3>{title}</h3>}
      
      {/* 历法类型选择 */}
      <div className="calendar-type-selector">
        <button
          className={`calendar-type-btn ${calendarType === 'solar' ? 'active' : ''}`}
          onClick={() => onCalendarTypeChange('solar')}
        >
          阳历
        </button>
        <button
          className={`calendar-type-btn ${calendarType === 'lunar' ? 'active' : ''}`}
          onClick={() => onCalendarTypeChange('lunar')}
        >
          农历
        </button>
        {showResetButton && onResetToNow && (
          <button className="reset-to-now-btn" onClick={onResetToNow}>
            ⏰ 当前时间
          </button>
        )}
      </div>

      {/* 阳历输入 */}
      {calendarType === 'solar' && (
        <div className="solar-input-group">
          <label>日期</label>
          <input
            type="date"
            value={solarDate}
            onChange={(e) => onSolarDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      )}

      {/* 农历输入 */}
      {calendarType === 'lunar' && (
        <div className="lunar-input-group">
          <div className="lunar-inputs">
            <div className="lunar-input-item">
              <label>年</label>
              <input
                type="number"
                value={lunarYear}
                onChange={(e) => {
                  onLunarYearChange(e.target.value)
                  setTimeout(handleLunarChange, 100)
                }}
                min="1900"
                max="2100"
                placeholder="1900-2100"
              />
            </div>
            <div className="lunar-input-item">
              <label>月</label>
              <input
                type="number"
                value={lunarMonth}
                onChange={(e) => {
                  onLunarMonthChange(e.target.value)
                  setTimeout(handleLunarChange, 100)
                }}
                min="1"
                max="12"
                placeholder="1-12"
              />
            </div>
            <div className="lunar-input-item">
              <label>日</label>
              <input
                type="number"
                value={lunarDay}
                onChange={(e) => {
                  onLunarDayChange(e.target.value)
                  setTimeout(handleLunarChange, 100)
                }}
                min="1"
                max={getMaxLunarDay()}
                placeholder="1-30"
              />
            </div>
          </div>
          
          {/* 闰月选择 */}
          {hasLeapMonth() && parseInt(lunarMonth) === getLeapMonthNumber() && (
            <div className="leap-month-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={isLunarLeapMonth}
                  onChange={(e) => {
                    onLunarLeapMonthChange(e.target.checked)
                    setTimeout(handleLunarChange, 100)
                  }}
                />
                <span>闰月</span>
              </label>
            </div>
          )}
          
          {/* 转换结果预览 */}
          {convertedSolarDate && (
            <div className="converted-date-preview">
              <span>对应阳历：{convertedSolarDate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

