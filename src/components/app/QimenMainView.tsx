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
import './qimen-stage.css'

function QimenMainView() {
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

  return (
    <div className="qimen-stage">
      <header className="qimen-hero">
        <div className="qimen-hero__mark">
          <QimenLogoMark size="lg" />
        </div>
        <div>
          <p className="qimen-hero__brand">{QIMEN_BRAND}</p>
          <p className="qimen-hero__brand-en">{QIMEN_BRAND_EN}</p>
          <p className="qimen-hero__hint">择时定局，九宫演奇门，察方位吉凶以定行止</p>
        </div>
      </header>

      <QimenRitualBar step={ritualStep} />

      <section className="qimen-time">
        <h2 className="qimen-time__title">起局时辰</h2>
        <p className="qimen-time__sub">输入年月日时，或用当前时刻起盘</p>
        <div className="qimen-time__fields">
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label="年"
            placeholder="2026"
            value={queryYear}
            onChange={(e) => setYear(e.target.value)}
          />
          <span className="qimen-time__sep">年</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label="月"
            placeholder="7"
            value={queryMonth}
            onChange={(e) => setMonth(e.target.value)}
          />
          <span className="qimen-time__sep">月</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label="日"
            placeholder="9"
            value={queryDay}
            onChange={(e) => setDay(e.target.value)}
          />
          <span className="qimen-time__sep">日</span>
          <input
            type="text"
            inputMode="numeric"
            className="field__input"
            aria-label="时"
            placeholder="14"
            value={queryHour}
            onChange={(e) => setHour(e.target.value)}
          />
          <span className="qimen-time__sep">时</span>
          <Button variant="primary" onClick={resetToNow}>
            当前时刻
          </Button>
        </div>
      </section>

      <section className="qimen-direction">
        <h2 className="qimen-direction__title">所问方位</h2>
        <p className="qimen-direction__sub">选择欲行或所问之方，盘面会侧重该宫解读</p>
        <Segmented
          block
          value={selectedDirection}
          options={[...DIRECTION_OPTIONS]}
          onChange={selectDirection}
        />
      </section>

      <section className="qimen-shrine" aria-label="罗盘方位">
        <p className="qimen-shrine__hint">罗盘指向当前所选方位，九宫盘可点宫细察</p>

        <div className="qimen-compass" aria-hidden>
          <div className="qimen-compass__ring">
            <span className="qimen-compass__label qimen-compass__label--n">北</span>
            <span className="qimen-compass__label qimen-compass__label--s">南</span>
            <span className="qimen-compass__label qimen-compass__label--e">东</span>
            <span className="qimen-compass__label qimen-compass__label--w">西</span>
            <div
              className="qimen-compass__needle-wrap"
              style={{ transform: `rotate(${compassAngle}deg)` }}
            >
              <div className="qimen-compass__needle" />
            </div>
            <div className="qimen-compass__center" />
          </div>
        </div>
        <p className="qimen-compass__dir">{selectedDirection}</p>

        {result && dateValid && (
          <div className="qimen-meta">
            <span className="qimen-meta__chip">时干支 {result.shiGanZhi}</span>
            <span className="qimen-meta__chip">{result.yongJu} 局</span>
          </div>
        )}
      </section>

      {result && dateValid && (
        <Panel title="九宫奇门盘">
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
                aria-label={`${palace.name} ${palace.direction}方`}
              >
                <div className="qimen-chart__head">
                  <span className="qimen-chart__name">{palace.name}</span>
                  <span className="qimen-chart__dir">{palace.direction}</span>
                </div>
                <div className="qimen-chart__body">
                  {palace.bamen && (
                    <div className="qimen-chart__row">
                      <span className="qimen-chart__label">门</span>
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
                    <span className="qimen-chart__label">星</span>
                    <span
                      className={
                        jiuxingMeanings[palace.jiuxing]?.auspicious ? 'tag tag--good' : 'tag tag--bad'
                      }
                    >
                      {getJiuxingShortName(palace.jiuxing)}
                    </span>
                  </div>
                  <div className="qimen-chart__row">
                    <span className="qimen-chart__label">神</span>
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
        <section ref={insightRef} className="qimen-insight" aria-label="盘面解读">
          <div className="qimen-insight__banner">
            <div className="qimen-insight__icon" aria-hidden>
              ☷
            </div>
            <div>
              <h2 className="qimen-insight__title">
                {selectedPalace?.name ?? '中宫'} · {selectedDirection}方
              </h2>
              <p className="qimen-insight__sub">
                {selectedPalace?.auspicious ? '此宫趋吉' : '此宫宜慎'} · 点击九宫可切换细察
              </p>
            </div>
            {selectedPalace && (
              <span
                className={`qimen-score-tag ${selectedPalace.auspicious ? 'qimen-score-tag--good' : 'qimen-score-tag--bad'}`}
              >
                {selectedPalace.auspicious ? '吉' : '凶'} {selectedPalace.score}
              </span>
            )}
          </div>

          <Panel title="整体趋势">
            <p className="prose">{result.overallAnalysis}</p>
          </Panel>

          <Panel title="方位研判">
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

          <Panel title="时辰局数">
            <p className="prose">{result.timeAnalysis}</p>
          </Panel>

          <Panel title="八方建议">
            <div className="qimen-advice-grid">
              <article className="qimen-advice-card">
                <h3>吉方</h3>
                {auspiciousDirections.length === 0 && (
                  <p className="prose" style={{ margin: 0, fontSize: '0.88rem' }}>
                    暂无显著吉方
                  </p>
                )}
                {auspiciousDirections.map((p) => (
                  <div key={p.direction} className="qimen-advice-row">
                    <span style={{ fontWeight: 600 }}>{p.direction}</span>
                    <span className="tag tag--good">吉分 {p.score}</span>
                  </div>
                ))}
              </article>
              <article className="qimen-advice-card">
                <h3>凶方</h3>
                {inauspiciousDirections.length === 0 && (
                  <p className="prose" style={{ margin: 0, fontSize: '0.88rem' }}>
                    暂无显著凶方
                  </p>
                )}
                {inauspiciousDirections.map((p) => (
                  <div key={p.direction} className="qimen-advice-row">
                    <span style={{ fontWeight: 600 }}>{p.direction}</span>
                    <span className="tag tag--bad">凶分 {p.score}</span>
                  </div>
                ))}
              </article>
            </div>
          </Panel>
        </section>
      )}

      {!dateValid && (
        <Panel>
          <p className="prose">请输入有效的年月日时以起盘。</p>
        </Panel>
      )}

      {dateValid && ritualStep < 3 && (
        <Panel title="起局要诀">
          <ul className="qimen-tips">
            <li>奇门以时辰为枢，宜先确认起局时刻是否准确</li>
            <li>选定所问方位后，盘面会侧重该宫门星神组合</li>
            <li>点击九宫各宫可细察门、星、神之吉凶</li>
            <li>吉方宜进取，凶方宜回避，中宫观整体气势</li>
            <li>盘面推演仅供参考，重大决策尚需结合实际</li>
          </ul>
        </Panel>
      )}
    </div>
  )
}

export default QimenMainView
