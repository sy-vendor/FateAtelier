import {
  NUMBER_ENERGY_BRAND,
  NUMBER_ENERGY_BRAND_EN,
  NUMBER_MEANINGS,
  NUMBER_TYPES,
  energyTagClass,
  levelTagClass,
  type NumberType,
} from '../../utils/numberEnergyData'
import { useNumberEnergyGame } from '../../hooks/useNumberEnergyGame'
import { NumberEnergyLogoMark } from '../number-energy/NumberEnergyLogoMark'
import { NumberEnergyRitualBar } from '../number-energy/NumberEnergyRitualBar'
import { Panel, Button, Metric, MetaList, AspectGrid, Collapsible } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './picker-tools-stage.css'

const TYPE_NAME_EN: Record<NumberType, string> = {
  phone: 'Phone number',
  plate: 'License plate',
  id: 'ID number',
  other: 'Other numbers',
}

const TYPE_DESC_EN: Record<NumberType, string> = {
  phone: 'Analyze the energy of a mobile number',
  plate: 'Analyze the energy of a license plate',
  id: 'Analyze the energy of an ID number',
  other: 'Analyze the energy of any number sequence',
}

const TYPE_PLACEHOLDER_EN: Record<NumberType, string> = {
  phone: 'Enter an 11-digit phone number',
  plate: 'Enter a license plate (e.g. 京A12345)',
  id: 'Enter an 18-digit ID number',
  other: 'Enter numbers',
}

function NumberEnergyMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const display = (zh: string, en?: string) => (isEnglish ? (en ?? zh) : zh)
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
          <p className="picker-hero__brand">{tx(NUMBER_ENERGY_BRAND, NUMBER_ENERGY_BRAND_EN)}</p>
          <p className="picker-hero__brand-en">{isEnglish ? NUMBER_ENERGY_BRAND_EN.toUpperCase() : NUMBER_ENERGY_BRAND_EN}</p>
          <p className="picker-hero__hint">{tx('析数脉之律动，解号码背后五行气运与吉凶', 'Read number rhythms and the elemental fortune behind them')}</p>
        </div>
      </header>

      <NumberEnergyRitualBar step={ritualStep} />

      <section className="picker-section">
        <h2 className="picker-section__title">{tx('选择数字类型', 'Choose number type')}</h2>
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
              <h3>{tx(type.name, TYPE_NAME_EN[type.id])}</h3>
              <p>{tx(type.description, TYPE_DESC_EN[type.id])}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="picker-section">
        <h2 className="picker-section__title">{tx('输入数字', 'Enter numbers')}</h2>
        <div className="field">
          <div className="picker-input-wrap">
            <input
              type="text"
              className="field__input"
              placeholder={selectedTypeInfo
                ? tx(selectedTypeInfo.placeholder, TYPE_PLACEHOLDER_EN[selectedTypeInfo.id])
                : undefined}
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
          {tx('开始析数', 'Analyze')}
        </Button>
      </section>

      {!analysis && !hasAnalyzed && (
        <section className="picker-shrine" aria-hidden>
          <span className="picker-shrine__glyph">{tx('数', 'No.')}</span>
          <p className="picker-shrine__hint">{tx('号码载气，数字成脉，待入而析', 'Numbers carry energy; enter them to read their pulse')}</p>
        </section>
      )}

      {analysis && (
        <>
          <Panel title={tx('能量分析', 'Energy analysis')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--ds-space-md)',
              }}
            >
              <span className="field__label">{tx('能量评分', 'Energy score')}</span>
              <span className={levelTagClass(analysis.level)}>{analysis.levelText}</span>
            </div>
            <div className="hero-row">
              <Metric value={analysis.score} label="/ 100" />
              <MetaList
                rows={[
                  { key: tx('提取的数字', 'Extracted digits'), value: analysis.numbers },
                  { key: tx('数字总和', 'Digit sum'), value: String(analysis.sum) },
                  { key: tx('最终数字', 'Final digit'), value: String(analysis.finalDigit) },
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

          <Panel title={tx('数字统计', 'Digit statistics')}>
            <AspectGrid
              items={Object.entries(analysis.digitCount)
                .sort((a, b) => b[1] - a[1])
                .map(([digit, count]) => {
                  const meaning = NUMBER_MEANINGS[digit]
                  return {
                    title: tx(`数字 ${digit}`, `Digit ${digit}`),
                    score: count,
                    text: meaning
                      ? `${display(meaning.meaning, meaning.meaningEn)} (${tx(`出现 ${count} 次`, `appears ${count} times`)})`
                      : tx(`出现 ${count} 次`, `Appears ${count} times`),
                  }
                })}
            />
          </Panel>

          {analysis.combinations.length > 0 && (
            <Panel title={tx('特殊组合', 'Special combinations')}>
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
                    <span className={energyTagClass(info.energy)}>{display(info.meaning, info.meaningEn)}</span>
                  </div>
                  <Collapsible
                    open={!!showDetails[`combo-${index}`]}
                    onToggle={() => toggleDetail(`combo-${index}`)}
                    label={tx('查看详情', 'View details')}
                    labelOpen={tx('收起', 'Collapse')}
                  >
                    {info.detail && <p className="prose">{display(info.detail, info.detailEn)}</p>}
                    {info.suggestion && <p className="callout">💡 {display(info.suggestion, info.suggestionEn)}</p>}
                  </Collapsible>
                </div>
              ))}
            </Panel>
          )}

          {analysis.finalDigitInfo && (
            <Panel title={tx(`最终数字 ${analysis.finalDigit} 详细解读`, `Final digit ${analysis.finalDigit} details`)}>
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
                    {display(analysis.finalDigitInfo.meaning, analysis.finalDigitInfo.meaningEn)}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {analysis.finalDigitInfo.wuxing && (
                      <span className="tag tag--muted">{tx('五行', 'Element')}：{display(analysis.finalDigitInfo.wuxing, analysis.finalDigitInfo.wuxingEn)}</span>
                    )}
                    {analysis.finalDigitInfo.direction && (
                      <span className="tag tag--muted">{tx('方位', 'Direction')}：{display(analysis.finalDigitInfo.direction, analysis.finalDigitInfo.directionEn)}</span>
                    )}
                    {analysis.finalDigitInfo.color && (
                      <span className="tag tag--muted">{tx('颜色', 'Color')}：{display(analysis.finalDigitInfo.color, analysis.finalDigitInfo.colorEn)}</span>
                    )}
                  </div>
                </div>
              </div>
              <Collapsible
                open={!!showDetails['final-digit']}
                onToggle={() => toggleDetail('final-digit')}
                label={tx('查看详情', 'View details')}
                labelOpen={tx('收起详情', 'Collapse details')}
              >
                {analysis.finalDigitInfo.detail && (
                  <p className="prose">{display(analysis.finalDigitInfo.detail, analysis.finalDigitInfo.detailEn)}</p>
                )}
                <MetaList
                  rows={[
                    analysis.finalDigitInfo.personality
                      ? { key: tx('性格', 'Personality'), value: display(analysis.finalDigitInfo.personality, analysis.finalDigitInfo.personalityEn) }
                      : null,
                    analysis.finalDigitInfo.career
                      ? { key: tx('职业', 'Career'), value: display(analysis.finalDigitInfo.career, analysis.finalDigitInfo.careerEn) }
                      : null,
                    analysis.finalDigitInfo.health
                      ? { key: tx('健康', 'Health'), value: display(analysis.finalDigitInfo.health, analysis.finalDigitInfo.healthEn) }
                      : null,
                    analysis.finalDigitInfo.relationship
                      ? { key: tx('人际', 'Relationships'), value: display(analysis.finalDigitInfo.relationship, analysis.finalDigitInfo.relationshipEn) }
                      : null,
                    analysis.finalDigitInfo.wealth
                      ? { key: tx('财运', 'Wealth'), value: display(analysis.finalDigitInfo.wealth, analysis.finalDigitInfo.wealthEn) }
                      : null,
                  ].filter((row): row is { key: string; value: string } => row !== null)}
                />
              </Collapsible>
            </Panel>
          )}

          <Panel title={tx('数字含义', 'Digit meanings')}>
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
                    <p className="prose">{display(meaning.meaning, meaning.meaningEn)}</p>
                    {showDetails[`digit-${digit}`] && (
                      <div style={{ marginTop: 'var(--ds-space-md)', textAlign: 'left' }}>
                        {meaning.detail && <p className="prose">{display(meaning.detail, meaning.detailEn)}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          {meaning.wuxing && <span className="tag tag--muted">{tx('五行', 'Element')}：{display(meaning.wuxing, meaning.wuxingEn)}</span>}
                          {meaning.direction && <span className="tag tag--muted">{tx('方位', 'Direction')}：{display(meaning.direction, meaning.directionEn)}</span>}
                          {meaning.color && <span className="tag tag--muted">{tx('颜色', 'Color')}：{display(meaning.color, meaning.colorEn)}</span>}
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </Panel>

          <Panel title={tx('建议', 'Suggestions')}>
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
              {tx('分享分析结果', 'Share analysis')}
            </Button>
            <Button onClick={() => copyToClipboard(analysis.numbers)}>
              {copiedText === analysis.numbers ? tx('✓ 已复制', '✓ Copied') : tx('复制数字', 'Copy digits')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default NumberEnergyMainView
