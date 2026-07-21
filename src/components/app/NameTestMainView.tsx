import { NAME_TEST_BRAND, NAME_TEST_BRAND_EN } from '../../utils/nameTestData'
import { getGridLevel } from '../../utils/nameTestEngine'
import { useNameTestGame } from '../../hooks/useNameTestGame'
import { NameTestLogoMark } from '../nametest/NameTestLogoMark'
import { NameTestRitualBar } from '../nametest/NameTestRitualBar'
import { Panel, Button, AspectGrid } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import { WUXING_EN } from '../../utils/baziData'
import './fortune-tools-stage.css'

function NameTestMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const {
    surname,
    givenName,
    onSurnameChange,
    onGivenNameChange,
    ritualStep,
    inputError,
    result,
    insightRef,
    testName,
  } = useNameTestGame()

  const gridTitles = {
    tianGe: tx('天格', 'Heaven'),
    renGe: tx('人格', 'Human'),
    diGe: tx('地格', 'Earth'),
    waiGe: tx('外格', 'Outer'),
    zongGe: tx('总格', 'Total'),
  }

  return (
    <div className="tools-stage tools-stage--nametest">
      <header className="tools-hero">
        <div className="tools-hero__mark"><NameTestLogoMark size="lg" /></div>
        <div>
          <p className="tools-hero__brand">{tx(NAME_TEST_BRAND, NAME_TEST_BRAND_EN)}</p>
          <p className="tools-hero__brand-en">{isEnglish ? NAME_TEST_BRAND_EN.toUpperCase() : NAME_TEST_BRAND_EN}</p>
          <p className="tools-hero__hint">{tx('五格数理合三才，鉴姓名吉凶与气运', 'Five-grid numerology and three talents reveal name fortune')}</p>
        </div>
      </header>

      <NameTestRitualBar step={ritualStep} />

      <section className="tools-form">
        <h2 className="tools-form__title">{tx('输入姓名', 'Enter your name')}</h2>
        <div className="field">
          <label className="field__label" htmlFor="nametest-surname">{tx('姓氏', 'Surname')}</label>
          <input
            id="nametest-surname"
            type="text"
            className="field__input"
            value={surname}
            onChange={(e) => onSurnameChange(e.target.value)}
            placeholder={tx('请输入姓氏', 'Enter surname')}
            maxLength={4}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="nametest-given">{tx('名字', 'Given name')}</label>
          <input
            id="nametest-given"
            type="text"
            className="field__input"
            value={givenName}
            onChange={(e) => onGivenNameChange(e.target.value)}
            placeholder={tx('请输入名字', 'Enter given name')}
            maxLength={4}
          />
        </div>
        {inputError && <p className="tools-input-error" role="alert">{inputError}</p>}
        <Button variant="primary" block onClick={testName} disabled={!surname.trim() || !givenName.trim()}>
          {tx('开始鉴名', 'Analyze name')}
        </Button>
      </section>

      {!result && (
        <section className="tools-shrine" aria-hidden>
          <span className="tools-shrine__glyph">{tx('名', 'Name')}</span>
          <p className="tools-shrine__hint">{tx('名载气运，笔画成格，待书而鉴', 'Names carry energy; strokes form grids awaiting your script')}</p>
        </section>
      )}

      {result && (
        <section ref={insightRef} className="tools-insight" aria-label={tx('姓名测评', 'Name analysis')}>
          <div className="tools-insight__banner">
            <div className="tools-insight__icon" aria-hidden>{tx('鉴', 'Read')}</div>
            <div>
              <h2 className="tools-insight__title">{surname}{givenName}</h2>
              <p className="tools-insight__sub">{tx('三才', 'Three talents')} {isEnglish ? [result.wuxing.tian, result.wuxing.ren, result.wuxing.di].map((element) => WUXING_EN[element]).join(' · ') : `${result.wuxing.tian}${result.wuxing.ren}${result.wuxing.di}`}</p>
            </div>
            <span className="tools-score-ring">{result.score}</span>
          </div>

          <Panel title={tx('五格数理', 'Five grids')}>
            <AspectGrid
              items={[
                { title: gridTitles.tianGe, score: result.grids.tianGe, text: `${isEnglish ? WUXING_EN[result.wuxing.tian] : result.wuxing.tian} · ${getGridLevel(result.grids.tianGe)}` },
                { title: gridTitles.renGe, score: result.grids.renGe, text: `${isEnglish ? WUXING_EN[result.wuxing.ren] : result.wuxing.ren} · ${getGridLevel(result.grids.renGe)}` },
                { title: gridTitles.diGe, score: result.grids.diGe, text: `${isEnglish ? WUXING_EN[result.wuxing.di] : result.wuxing.di} · ${getGridLevel(result.grids.diGe)}` },
                { title: gridTitles.waiGe, score: result.grids.waiGe, text: `${isEnglish ? WUXING_EN[result.wuxing.wai] : result.wuxing.wai} · ${getGridLevel(result.grids.waiGe)}` },
                { title: gridTitles.zongGe, score: result.grids.zongGe, text: `${isEnglish ? WUXING_EN[result.wuxing.zong] : result.wuxing.zong} · ${getGridLevel(result.grids.zongGe)}` },
              ]}
            />
          </Panel>

          <Panel title={tx('三才配置', 'Three-talent configuration')}>
            <p className="callout">{result.sancai}</p>
          </Panel>

          <Panel title={tx('详细分析', 'Detailed analysis')}>
            <pre className="prose" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result.analysis}</pre>
          </Panel>
        </section>
      )}
    </div>
  )
}

export default NameTestMainView
