import { useState } from 'react'
import './ShengxiaoPairing.css'

interface ShengxiaoPairingProps {
  onBack?: () => void
}

// 生肖列表
const shengxiaoList = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 生肖到地支的映射（反向）
const shengxiaoToDizhi: { [key: string]: string } = {
  '鼠': '子', '牛': '丑', '虎': '寅', '兔': '卯',
  '龙': '辰', '蛇': '巳', '马': '午', '羊': '未',
  '猴': '申', '鸡': '酉', '狗': '戌', '猪': '亥'
}

// 六合关系（子丑合、寅亥合、卯戌合、辰酉合、巳申合、午未合）
const liuheMap: { [key: string]: string } = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午'
}

// 六冲关系（子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲）
const liuchongMap: { [key: string]: string } = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳'
}

// 六害关系（子未害、丑午害、寅巳害、卯辰害、申亥害、酉戌害）
const liuhaiMap: { [key: string]: string } = {
  '子': '未', '未': '子',
  '丑': '午', '午': '丑',
  '寅': '巳', '巳': '寅',
  '卯': '辰', '辰': '卯',
  '申': '亥', '亥': '申',
  '酉': '戌', '戌': '酉'
}

// 三合关系（申子辰、亥卯未、寅午戌、巳酉丑）
const sanheGroups = [
  ['申', '子', '辰'],
  ['亥', '卯', '未'],
  ['寅', '午', '戌'],
  ['巳', '酉', '丑']
]

// 三刑关系
// 子卯刑、寅巳申刑、丑未戌刑、辰午酉亥自刑
const sanxingGroups = [
  ['子', '卯'],
  ['寅', '巳', '申'],
  ['丑', '未', '戌'],
  ['辰', '午', '酉', '亥']
]

// 分析两个生肖的配对关系
function analyzePairing(shengxiao1: string, shengxiao2: string) {
  const dizhi1 = shengxiaoToDizhi[shengxiao1]
  const dizhi2 = shengxiaoToDizhi[shengxiao2]

  if (!dizhi1 || !dizhi2) {
    return null
  }

  const relationships: string[] = []
  let score = 50 // 基础分数
  let compatibility = '中等'

  // 检查六合
  if (liuheMap[dizhi1] === dizhi2) {
    relationships.push('六合')
    score += 30
    compatibility = '极佳'
  }

  // 检查六冲
  if (liuchongMap[dizhi1] === dizhi2) {
    relationships.push('六冲')
    score -= 30
    compatibility = '较差'
  }

  // 检查六害
  if (liuhaiMap[dizhi1] === dizhi2) {
    relationships.push('六害')
    score -= 20
    if (compatibility === '较差') {
      compatibility = '较差'
    } else {
      compatibility = '一般'
    }
  }

  // 检查三合
  for (const group of sanheGroups) {
    if (group.includes(dizhi1) && group.includes(dizhi2) && dizhi1 !== dizhi2) {
      relationships.push('三合')
      score += 25
      if (compatibility !== '较差') {
        compatibility = '良好'
      }
      break
    }
  }

  // 检查三刑
  for (const group of sanxingGroups) {
    if (group.includes(dizhi1) && group.includes(dizhi2) && dizhi1 !== dizhi2) {
      relationships.push('三刑')
      score -= 15
      if (compatibility === '极佳' || compatibility === '良好') {
        compatibility = '一般'
      } else if (compatibility === '中等') {
        compatibility = '较差'
      }
      break
    }
  }

  // 如果没有特殊关系，检查是否相同
  if (relationships.length === 0) {
    if (shengxiao1 === shengxiao2) {
      relationships.push('相同')
      score += 5
      compatibility = '中等'
    } else {
      relationships.push('普通')
      compatibility = '中等'
    }
  }

  // 限制分数范围
  score = Math.max(0, Math.min(100, score))

  // 生成详细分析
  let analysis = ''
  if (relationships.includes('六合')) {
    analysis = '六合是最佳的配对关系，代表和谐、互补，双方性格相投，容易产生默契，是传统命理学中最为理想的配对。'
  } else if (relationships.includes('三合')) {
    analysis = '三合是良好的配对关系，代表三合局，双方能够互相支持，共同成长，关系稳定和谐。'
  } else if (relationships.includes('六冲')) {
    analysis = '六冲代表对立冲突，双方性格差异较大，容易产生矛盾和争执，需要更多的理解和包容。'
  } else if (relationships.includes('六害')) {
    analysis = '六害代表相互伤害，双方在相处中可能会遇到一些阻碍和困难，需要更多的沟通和磨合。'
  } else if (relationships.includes('三刑')) {
    analysis = '三刑代表相互制约，双方在相处中可能会有一些摩擦和冲突，需要更多的耐心和理解。'
  } else if (relationships.includes('相同')) {
    analysis = '相同生肖的配对，双方性格相似，容易理解彼此，但也可能因为过于相似而缺乏互补性。'
  } else {
    analysis = '普通配对关系，双方没有明显的相合或相冲，关系发展主要取决于个人的性格和相处方式。'
  }

  return {
    relationships,
    score,
    compatibility,
    analysis
  }
}

function ShengxiaoPairing({ onBack }: ShengxiaoPairingProps) {
  const [shengxiao1, setShengxiao1] = useState<string>('')
  const [shengxiao2, setShengxiao2] = useState<string>('')
  const [result, setResult] = useState<{
    relationships: string[]
    score: number
    compatibility: string
    analysis: string
  } | null>(null)

  const handlePairing = () => {
    if (!shengxiao1 || !shengxiao2) {
      alert('请选择两个生肖')
      return
    }

    const pairingResult = analyzePairing(shengxiao1, shengxiao2)
    if (pairingResult) {
      setResult(pairingResult)
    }
  }

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case '极佳':
        return '#4CAF50'
      case '良好':
        return '#8BC34A'
      case '中等':
        return '#FFC107'
      case '一般':
        return '#FF9800'
      case '较差':
        return '#F44336'
      default:
        return '#757575'
    }
  }

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case '六合':
      case '三合':
        return '#4CAF50'
      case '六冲':
      case '六害':
      case '三刑':
        return '#F44336'
      case '相同':
        return '#2196F3'
      default:
        return '#757575'
    }
  }

  return (
    <div className="shengxiao-pairing">
      <div className="pairing-header">
        <button className="back-btn" onClick={onBack}>
          ← 返回
        </button>
        <h1>🐲 生肖配对</h1>
        <p className="subtitle">选择两个生肖，分析配对指数</p>
      </div>

      <div className="pairing-content">
        <div className="shengxiao-selector-section">
          <div className="selector-group">
            <label>第一个生肖</label>
            <div className="shengxiao-grid">
              {shengxiaoList.map(sx => (
                <button
                  key={sx}
                  className={`shengxiao-btn ${shengxiao1 === sx ? 'active' : ''}`}
                  onClick={() => setShengxiao1(sx)}
                >
                  {sx}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <label>第二个生肖</label>
            <div className="shengxiao-grid">
              {shengxiaoList.map(sx => (
                <button
                  key={sx}
                  className={`shengxiao-btn ${shengxiao2 === sx ? 'active' : ''}`}
                  onClick={() => setShengxiao2(sx)}
                >
                  {sx}
                </button>
              ))}
            </div>
          </div>

          <button className="pairing-btn" onClick={handlePairing}>
            开始配对分析
          </button>
        </div>

        {result && (
          <div className="pairing-result">
            <div className="result-header">
              <h2>配对结果</h2>
              <div className="compatibility-badge" style={{ backgroundColor: getCompatibilityColor(result.compatibility) }}>
                {result.compatibility}
              </div>
            </div>

            <div className="score-section">
              <div className="score-circle">
                <div className="score-value">{result.score}</div>
                <div className="score-label">配对指数</div>
              </div>
            </div>

            <div className="relationships-section">
              <h3>配对关系</h3>
              <div className="relationships-tags">
                {result.relationships.map((rel, index) => (
                  <span
                    key={index}
                    className="relationship-tag"
                    style={{ backgroundColor: getRelationshipColor(rel) }}
                  >
                    {rel}
                  </span>
                ))}
              </div>
            </div>

            <div className="analysis-section">
              <h3>详细分析</h3>
              <p>{result.analysis}</p>
            </div>

            <div className="relationship-info">
              <h3>关系说明</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">六合：</span>
                  <span className="info-desc">最佳配对，和谐互补</span>
                </div>
                <div className="info-item">
                  <span className="info-label">三合：</span>
                  <span className="info-desc">良好配对，互相支持</span>
                </div>
                <div className="info-item">
                  <span className="info-label">六冲：</span>
                  <span className="info-desc">对立冲突，需要包容</span>
                </div>
                <div className="info-item">
                  <span className="info-label">六害：</span>
                  <span className="info-desc">相互伤害，需要磨合</span>
                </div>
                <div className="info-item">
                  <span className="info-label">三刑：</span>
                  <span className="info-desc">相互制约，需要理解</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShengxiaoPairing

