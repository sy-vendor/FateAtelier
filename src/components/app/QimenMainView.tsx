import {
  QIMEN_BRAND,
  QIMEN_BRAND_EN,
  DIRECTION_OPTIONS,
  bamenMeanings,
  jiuxingMeanings,
  bashenMeanings,
  getBamenShortName,
  getJiuxingShortName,
  getBashenShortName,
} from '../../utils/qimenData'
import { useQimenGame } from '../../hooks/useQimenGame'
import { QimenLogoMark } from '../qimen/QimenLogoMark'
import { QimenRitualBar } from '../qimen/QimenRitualBar'
import { Panel, Button, Segmented } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './qimen-stage.css'

const DIRECTION_EN: Record<string, string> = {
  东: 'East',
  东南: 'Southeast',
  南: 'South',
  西南: 'Southwest',
  西: 'West',
  西北: 'Northwest',
  北: 'North',
  东北: 'Northeast',
  中: 'Center',
}

function QimenMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const {
    queryYear,
    queryMonth,
    queryDay,
    queryHour,
    setYear,
    setMonth,
    setDay,
    setHour,
    selectedDirection,
    ritualStep,
    result,
    selectedPalace,
    focusedPalaceIndex,
    compassAngle,
    insightRef,
    resetToNow,
    selectDirection,
    selectPalace,
    auspiciousDirections,
    inauspiciousDirections,
    dateValid,
  } = useQimenGame()

  const directionOptions = DIRECTION_OPTIONS.map((o) => ({
    ...o,
    label: tx(o.label, DIRECTION_EN[o.value] ?? o.label),
  }))

  const directionLabel = (dir: string) => tx(dir, DIRECTION_EN[dir] ?? dir)

  return (
    <div className="qimen-stage">
      <header className="qimen-hero">
        <div className="qimen-hero__mark">
          <QimenLogoMark size="lg" />
        </div>
        <div>
          <p className="qimen-hero__brand">{tx(QIMEN_BRAND, QIMEN_BRAND_EN)}</p>
          <p className="qimen-hero__brand-en">{isEnglish ? QIMEN_BRAND_EN.toUpperCase() : QIMEN_BRAND_EN}</p>
          <p className="qimen-hero__hint">{tx('择时定局，九宫演奇门，察方位吉凶以定行止', 'Choose the hour, set the board, and read direction fortune')}</p>
        </div>
      </header>

      <QimenRitualBar step={ritualStep} />

      <section className="qimen-time">
        <h2 className="qimen-time__title">{tx('起局时辰', 'Chart time')}</h2>
        <p className="qimen-time__sub">{tx('输入年月日时，或用当前时刻起盘', 'Enter date and hour, or use the current moment')}</p>
        <div className="qimen-time__fields">
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label={tx('年', 'Year')}
            placeholder="2026"
            value={queryYear}
            onChange={(e) => setYear(e.target.value)}
          />
          <span className="qimen-time__sep">{tx('年', 'Year')}</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label={tx('月', 'Month')}
            placeholder="7"
            value={queryMonth}
            onChange={(e) => setMonth(e.target.value)}
          />
          <span className="qimen-time__sep">{tx('月', 'Month')}</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label={tx('日', 'Day')}
            placeholder="9"
            value={queryDay}
            onChange={(e) => setDay(e.target.value)}
          />
          <span className="qimen-time__sep">{tx('日', 'Day')}</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label={tx('时', 'Hour')}
            placeholder="14"
            value={queryHour}
            onChange={(e) => setHour(e.target.value)}
          />
          <span className="qimen-time__sep">{tx('时', 'Hour')}</span>
          <Button variant="primary" onClick={resetToNow}>
            {tx('当前时刻', 'Now')}
          </Button>
        </div>
      </section>

      <section className="qimen-direction">
        <h2 className="qimen-direction__title">{tx('所问方位', 'Direction of inquiry')}</h2>
        <p className="qimen-direction__sub">{tx('选择欲行或所问之方，盘面会侧重该宫解读', 'Choose the direction you plan to move toward for a focused reading')}</p>
        <Segmented
          block
          value={selectedDirection}
          options={directionOptions}
          onChange={selectDirection}
        />
      </section>

      <section className="qimen-shrine" aria-label={tx('罗盘方位', 'Compass directions')}>
        <p className="qimen-shrine__hint">{tx('罗盘指向当前所选方位，九宫盘可点宫细察', 'The compass points to your chosen direction — tap palaces for details')}</p>

        <div className="qimen-compass" aria-hidden>
          <div className="qimen-compass__ring">
            <span className="qimen-compass__label qimen-compass__label--n">{tx('北', 'N')}</span>
            <span className="qimen-compass__label qimen-compass__label--s">{tx('南', 'S')}</span>
            <span className="qimen-compass__label qimen-compass__label--e">{tx('东', 'E')}</span>
            <span className="qimen-compass__label qimen-compass__label--w">{tx('西', 'W')}</span>
            <div
              className="qimen-compass__needle-wrap"
              style={{ transform: `rotate(${compassAngle}deg)` }}
            >
              <div className="qimen-compass__needle" />
            </div>
            <div className="qimen-compass__center" />
          </div>
        </div>
        <p className="qimen-compass__dir">{directionLabel(selectedDirection)}</p>

        {result && dateValid && (
          <div className="qimen-meta">
            <span className="qimen-meta__chip">{tx('时干支', 'Hour pillar')} {result.shiGanZhi}</span>
            <span className="qimen-meta__chip">{result.yongJu} {tx('局', 'formation')}</span>
          </div>
        )}
      </section>

      {result && dateValid && (
        <Panel title={tx('九宫奇门盘', 'Nine-palace Qi Men chart')}>
          <div className="qimen-chart">
            {result.palaces.map((palace, index) => (
              <button
                key={index}
                type="button"
                className={[
                  'qimen-chart__cell',
                  palace.auspicious ? 'qimen-chart__cell--good' : 'qimen-chart__cell--bad',
                  palace.direction === selectedDirection ? 'qimen-chart__cell--selected' : '',
                  focusedPalaceIndex === index ? 'qimen-chart__cell--focused' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => selectPalace(index, palace.direction)}
                aria-label={`${palace.name} ${directionLabel(palace.direction)}`}
              >
                <div className="qimen-chart__head">
                  <span className="qimen-chart__name">{palace.name}</span>
                  <span className="qimen-chart__dir">{directionLabel(palace.direction)}</span>
                </div>
                <div className="qimen-chart__body">
                  {palace.bamen && (
                    <div className="qimen-chart__row">
                      <span className="qimen-chart__label">{tx('门', 'Gate')}</span>
                      <span
                        className={
                          bamenMeanings[palace.bamen]?.auspicious ? 'tag tag--good' : 'tag tag--bad'
                        }
                      >
                        {getBamenShortName(palace.bamen)}
                      </span>
                    </div>
                  )}
                  <div className="qimen-chart__row">
                    <span className="qimen-chart__label">{tx('星', 'Star')}</span>
                    <span
                      className={
                        jiuxingMeanings[palace.jiuxing]?.auspicious ? 'tag tag--good' : 'tag tag--bad'
                      }
                    >
                      {getJiuxingShortName(palace.jiuxing)}
                    </span>
                  </div>
                  <div className="qimen-chart__row">
                    <span className="qimen-chart__label">{tx('神', 'Spirit')}</span>
                    <span
                      className={
                        bashenMeanings[palace.bashen]?.auspicious ? 'tag tag--good' : 'tag tag--bad'
                      }
                    >
                      {getBashenShortName(palace.bashen)}
                    </span>
                  </div>
                </div>
                <div className="qimen-chart__score">
                  <div className="qimen-chart__bar">
                    <div
                      className="qimen-chart__bar-fill"
                      style={{
                        width: `${palace.score}%`,
                        background: palace.auspicious
                          ? 'rgba(34, 197, 94, 0.85)'
                          : 'rgba(239, 68, 68, 0.85)',
                      }}
                    />
                  </div>
                  <span className="qimen-chart__score-val">{palace.score}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {result && dateValid && (
        <section ref={insightRef} className="qimen-insight" aria-label={tx('盘面解读', 'Chart reading')}>
          <div className="qimen-insight__banner">
            <div className="qimen-insight__icon" aria-hidden>
              ☷
            </div>
            <div>
              <h2 className="qimen-insight__title">
                {selectedPalace?.name ?? tx('中宫', 'Center')} · {directionLabel(selectedDirection)}
              </h2>
              <p className="qimen-insight__sub">
                {selectedPalace?.auspicious ? tx('此宫趋吉', 'This palace trends auspicious') : tx('此宫宜慎', 'Proceed with care in this palace')} · {tx('点击九宫可切换细察', 'Tap palaces to switch focus')}
              </p>
            </div>
            {selectedPalace && (
              <span
                className={`qimen-score-tag ${selectedPalace.auspicious ? 'qimen-score-tag--good' : 'qimen-score-tag--bad'}`}
              >
                {selectedPalace.auspicious ? tx('吉', 'Good') : tx('凶', 'Bad')} {selectedPalace.score}
              </span>
            )}
          </div>

          <Panel title={tx('整体趋势', 'Overall trend')}>
            <p className="prose">{result.overallAnalysis}</p>
          </Panel>

          <Panel title={tx('方位研判', 'Direction analysis')}>
            <p className="prose">{result.directionAnalysis}</p>
            {selectedPalace && (
              <div
                style={{
                  marginTop: 'var(--ds-space-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--ds-space-sm)',
                }}
              >
                {selectedPalace.bamen && bamenMeanings[selectedPalace.bamen] && (
                  <p className="prose">
                    <strong>{selectedPalace.bamen}：</strong>
                    {bamenMeanings[selectedPalace.bamen].description}
                  </p>
                )}
                {jiuxingMeanings[selectedPalace.jiuxing] && (
                  <p className="prose">
                    <strong>{selectedPalace.jiuxing}：</strong>
                    {jiuxingMeanings[selectedPalace.jiuxing].description}
                  </p>
                )}
                {bashenMeanings[selectedPalace.bashen] && (
                  <p className="prose">
                    <strong>{selectedPalace.bashen}：</strong>
                    {bashenMeanings[selectedPalace.bashen].description}
                  </p>
                )}
              </div>
            )}
          </Panel>

          <Panel title={tx('时辰局数', 'Hour formation')}>
            <p className="prose">{result.timeAnalysis}</p>
          </Panel>

          <Panel title={tx('八方建议', 'Eight-direction advice')}>
            <div className="qimen-advice-grid">
              <article className="qimen-advice-card">
                <h3>{tx('吉方', 'Auspicious')}</h3>
                {auspiciousDirections.length === 0 && (
                  <p className="prose" style={{ margin: 0, fontSize: '0.88rem' }}>
                    {tx('暂无显著吉方', 'No strong auspicious directions')}
                  </p>
                )}
                {auspiciousDirections.map((p) => (
                  <div key={p.direction} className="qimen-advice-row">
                    <span style={{ fontWeight: 600 }}>{directionLabel(p.direction)}</span>
                    <span className="tag tag--good">{tx('吉分', 'Good score')} {p.score}</span>
                  </div>
                ))}
              </article>
              <article className="qimen-advice-card">
                <h3>{tx('凶方', 'Inauspicious')}</h3>
                {inauspiciousDirections.length === 0 && (
                  <p className="prose" style={{ margin: 0, fontSize: '0.88rem' }}>
                    {tx('暂无显著凶方', 'No strong inauspicious directions')}
                  </p>
                )}
                {inauspiciousDirections.map((p) => (
                  <div key={p.direction} className="qimen-advice-row">
                    <span style={{ fontWeight: 600 }}>{directionLabel(p.direction)}</span>
                    <span className="tag tag--bad">{tx('凶分', 'Bad score')} {p.score}</span>
                  </div>
                ))}
              </article>
            </div>
          </Panel>
        </section>
      )}

      {!dateValid && (
        <Panel>
          <p className="prose">{tx('请输入有效的年月日时以起盘。', 'Enter a valid date and hour to generate the chart.')}</p>
        </Panel>
      )}

      {dateValid && ritualStep < 3 && (
        <Panel title={tx('起局要诀', 'Charting tips')}>
          <ul className="qimen-tips">
            <li>{tx('奇门以时辰为枢，宜先确认起局时刻是否准确', 'Qi Men pivots on the hour — confirm your timing first')}</li>
            <li>{tx('选定所问方位后，盘面会侧重该宫门星神组合', 'After choosing a direction, the chart focuses on that palace')}</li>
            <li>{tx('点击九宫各宫可细察门、星、神之吉凶', 'Tap each palace to inspect gate, star, and spirit fortune')}</li>
            <li>{tx('吉方宜进取，凶方宜回避，中宫观整体气势', 'Advance toward auspicious directions; avoid inauspicious ones')}</li>
            <li>{tx('盘面推演仅供参考，重大决策尚需结合实际', 'Chart readings are for reference — use judgment for major decisions')}</li>
          </ul>
        </Panel>
      )}
    </div>
  )
}

export default QimenMainView
