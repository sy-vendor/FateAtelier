import {
  NUMBER_ENERGY_BRAND,
  NUMBER_ENERGY_BRAND_EN,
  NUMBER_MEANINGS,
  NUMBER_TYPES,
  energyTagClass,
  levelTagClass,
} from '../../utils/numberEnergyData'
import { useNumberEnergyGame } from '../../hooks/useNumberEnergyGame'
import { NumberEnergyLogoMark } from '../number-energy/NumberEnergyLogoMark'
import { NumberEnergyRitualBar } from '../number-energy/NumberEnergyRitualBar'
import { Panel, Button, Metric, MetaList, AspectGrid, Collapsible } from '../ui'
import './picker-tools-stage.css'

function NumberEnergyMainView() {
  const {
    input,
    onInputChange,
    selectedType,
    selectType,
    showDetails,
    toggleDetail,
    copiedText,
    actionError,
    inputError,
    analysis,
    ritualStep,
    selectedTypeInfo,
    analyze,
    hasAnalyzed,
    copyToClipboard,
    shareAnalysis,
  } = useNumberEnergyGame()

  return (
    <div className="picker-stage picker-stage--numberenergy">
      <header className="picker-hero">
        <div className="picker-hero__mark">
          <NumberEnergyLogoMark size="lg" />
        </div>
        <div>
          <p className="picker-hero__brand">{NUMBER_ENERGY_BRAND}</p>
          <p className="picker-hero__brand-en">{NUMBER_ENERGY_BRAND_EN}</p>
          <p className="picker-hero__hint">析数脉之律动，解号码背后五行气运与吉凶</p>
        </div>
      </header>

      <NumberEnergyRitualBar step={ritualStep} />

      <section className="picker-section">
        <h2 className="picker-section__title">选择数字类型</h2>
        <div className="picker-type-grid">
          {NUMBER_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className={[
                'picker-type-card',
                selectedType === type.id ? 'picker-type-card--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => selectType(type.id)}
            >
              <div className="picker-type-card__icon">{type.icon}</div>
              <h3>{type.name}</h3>
              <p>{type.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="picker-section">
        <h2 className="picker-section__title">输入数字</h2>
        <div className="field">
          <div className="picker-input-wrap">
            <input
              type="text"
              className="field__input"
              placeholder={selectedTypeInfo?.placeholder}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              maxLength={selectedType === 'phone' ? 11 : selectedType === 'id' ? 18 : 50}
            />
            {input && (
              <Button
                small
                className="picker-input-clear"
                onClick={() => onInputChange('')}
              >
                ✕
              </Button>
            )}
          </div>
          {inputError && <p className="picker-input-error" role="alert">{inputError}</p>}
          {actionError && <p className="picker-input-error" role="alert">{actionError}</p>}
        </div>
        <Button variant="primary" block onClick={analyze} disabled={!input.trim()}>
          开始析数
        </Button>
      </section>

      {!analysis && !hasAnalyzed && (
        <section className="picker-shrine" aria-hidden>
          <span className="picker-shrine__glyph">数</span>
          <p className="picker-shrine__hint">号码载气，数字成脉，待入而析</p>
        </section>
      )}

      {analysis && (
        <>
          <Panel title="能量分析">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--ds-space-md)',
              }}
            >
              <span className="field__label">能量评分</span>
              <span className={levelTagClass(analysis.level)}>{analysis.levelText}</span>
            </div>
            <div className="hero-row">
              <Metric value={analysis.score} label="/ 100" />
              <MetaList
                rows={[
                  { key: '提取的数字', value: analysis.numbers },
                  { key: '数字总和', value: String(analysis.sum) },
                  { key: '最终数字', value: String(analysis.finalDigit) },
                ]}
              />
            </div>
            <div className="picker-energy-bar">
              <div
                className="picker-energy-bar__fill"
                style={{ width: `${analysis.score}%`, backgroundColor: analysis.levelColor }}
              />
            </div>
          </Panel>

          <Panel title="数字统计">
            <AspectGrid
              items={Object.entries(analysis.digitCount)
                .sort((a, b) => b[1] - a[1])
                .map(([digit, count]) => {
                  const meaning = NUMBER_MEANINGS[digit]
                  return {
                    title: `数字 ${digit}`,
                    score: count,
                    text: meaning
                      ? `${meaning.meaning}（出现 ${count} 次）`
                      : `出现 ${count} 次`,
                  }
                })}
            />
          </Panel>

          {analysis.combinations.length > 0 && (
            <Panel title="特殊组合">
              {analysis.combinations.map(({ combo, info }, index) => (
                <div key={index} className="callout" style={{ marginBottom: 'var(--ds-space-md)' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--ds-space-md)',
                      flexWrap: 'wrap',
                      marginBottom: 'var(--ds-space-sm)',
                    }}
                  >
                    <span
                      className="metric__value"
                      style={{ fontSize: '1.5rem', WebkitTextFillColor: 'unset', color: 'var(--ds-accent-gold)' }}
                    >
                      {combo}
                    </span>
                    <span className={energyTagClass(info.energy)}>{info.meaning}</span>
                  </div>
                  <Collapsible
                    open={!!showDetails[`combo-${index}`]}
                    onToggle={() => toggleDetail(`combo-${index}`)}
                    label="查看详情"
                    labelOpen="收起"
                  >
                    {info.detail && <p className="prose">{info.detail}</p>}
                    {info.suggestion && <p className="callout">💡 {info.suggestion}</p>}
                  </Collapsible>
                </div>
              ))}
            </Panel>
          )}

          {analysis.finalDigitInfo && (
            <Panel title={`最终数字 ${analysis.finalDigit} 详细解读`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--ds-space-lg)',
                  flexWrap: 'wrap',
                  marginBottom: 'var(--ds-space-md)',
                }}
              >
                <div className="score-ring" style={{ width: 88, height: 88, margin: 0 }}>
                  <div className="score-ring__value" style={{ fontSize: '2rem' }}>
                    {analysis.finalDigit}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p
                    className="prose"
                    style={{ fontWeight: 600, color: 'var(--ds-text-primary)', marginBottom: 'var(--ds-space-sm)' }}
                  >
                    {analysis.finalDigitInfo.meaning}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {analysis.finalDigitInfo.wuxing && (
                      <span className="tag tag--muted">五行：{analysis.finalDigitInfo.wuxing}</span>
                    )}
                    {analysis.finalDigitInfo.direction && (
                      <span className="tag tag--muted">方位：{analysis.finalDigitInfo.direction}</span>
                    )}
                    {analysis.finalDigitInfo.color && (
                      <span className="tag tag--muted">颜色：{analysis.finalDigitInfo.color}</span>
                    )}
                  </div>
                </div>
              </div>
              <Collapsible
                open={!!showDetails['final-digit']}
                onToggle={() => toggleDetail('final-digit')}
                label="查看详情"
                labelOpen="收起详情"
              >
                {analysis.finalDigitInfo.detail && (
                  <p className="prose">{analysis.finalDigitInfo.detail}</p>
                )}
                <MetaList
                  rows={[
                    analysis.finalDigitInfo.personality
                      ? { key: '性格', value: analysis.finalDigitInfo.personality }
                      : null,
                    analysis.finalDigitInfo.career
                      ? { key: '职业', value: analysis.finalDigitInfo.career }
                      : null,
                    analysis.finalDigitInfo.health
                      ? { key: '健康', value: analysis.finalDigitInfo.health }
                      : null,
                    analysis.finalDigitInfo.relationship
                      ? { key: '人际', value: analysis.finalDigitInfo.relationship }
                      : null,
                    analysis.finalDigitInfo.wealth
                      ? { key: '财运', value: analysis.finalDigitInfo.wealth }
                      : null,
                  ].filter((row): row is { key: string; value: string } => row !== null)}
                />
              </Collapsible>
            </Panel>
          )}

          <Panel title="数字含义">
            <div className="picker-type-grid">
              {Array.from(new Set(analysis.numbers.split(''))).map((digit) => {
                const meaning = NUMBER_MEANINGS[digit]
                if (!meaning) return null
                return (
                  <button
                    key={digit}
                    type="button"
                    className={[
                      'picker-type-card',
                      showDetails[`digit-${digit}`] ? 'picker-type-card--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => toggleDetail(`digit-${digit}`)}
                  >
                    <div
                      className="metric__value"
                      style={{ fontSize: '2rem', WebkitTextFillColor: 'unset', color: 'var(--ds-accent-gold)' }}
                    >
                      {digit}
                    </div>
                    <p className="prose">{meaning.meaning}</p>
                    {showDetails[`digit-${digit}`] && (
                      <div style={{ marginTop: 'var(--ds-space-md)', textAlign: 'left' }}>
                        {meaning.detail && <p className="prose">{meaning.detail}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          {meaning.wuxing && <span className="tag tag--muted">五行：{meaning.wuxing}</span>}
                          {meaning.direction && <span className="tag tag--muted">方位：{meaning.direction}</span>}
                          {meaning.color && <span className="tag tag--muted">颜色：{meaning.color}</span>}
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </Panel>

          <Panel title="建议">
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="callout" style={{ marginBottom: 'var(--ds-space-sm)' }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </Panel>

          <div className="picker-actions">
            <Button variant="primary" onClick={shareAnalysis}>
              分享分析结果
            </Button>
            <Button onClick={() => copyToClipboard(analysis.numbers)}>
              {copiedText === analysis.numbers ? '✓ 已复制' : '复制数字'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default NumberEnergyMainView
