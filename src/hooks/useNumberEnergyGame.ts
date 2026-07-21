import { useMemo, useState } from 'react'
import {
  NUMBER_ENERGY_PHASE_STEP,
  NUMBER_TYPES,
  type NumberEnergyPhase,
  type NumberType,
} from '../utils/numberEnergyData'
import { analyzeNumberEnergy, validateNumberInput } from '../utils/numberEnergyEngine'
import { txStatic } from '../i18n/locale'

export function useNumberEnergyGame() {
  const [input, setInput] = useState('')
  const [selectedType, setSelectedType] = useState<NumberType>('phone')
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const inputError = useMemo(() => {
    if (!hasAnalyzed) return ''
    return validateNumberInput(input, selectedType)
  }, [input, selectedType, hasAnalyzed])

  const analysis = useMemo(() => {
    if (!hasAnalyzed || inputError) return null
    return analyzeNumberEnergy(input, selectedType)
  }, [input, selectedType, hasAnalyzed, inputError])

  const phase: NumberEnergyPhase = useMemo(() => {
    if (!input.trim()) return 'input'
    if (!hasAnalyzed) return 'analyze'
    if (analysis) return 'revealed'
    return 'input'
  }, [input, hasAnalyzed, analysis])

  const ritualStep = NUMBER_ENERGY_PHASE_STEP[phase]

  const selectedTypeInfo = NUMBER_TYPES.find((t) => t.id === selectedType)

  const onInputChange = (value: string) => {
    setInput(value)
    setHasAnalyzed(false)
    setActionError('')
  }

  const selectType = (type: NumberType) => {
    setSelectedType(type)
    setInput('')
    setHasAnalyzed(false)
    setActionError('')
  }

  const analyze = () => {
    const err = validateNumberInput(input, selectedType)
    if (err) {
      setHasAnalyzed(true)
      return
    }
    setHasAnalyzed(true)
  }

  const toggleDetail = (key: string) => {
    setShowDetails((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setActionError('')
      setTimeout(() => setCopiedText(null), 2000)
    } catch {
      setActionError(txStatic('复制失败，请手动复制', 'Copy failed — please copy manually'))
    }
  }

  const shareAnalysis = async () => {
    if (!analysis) return
    const shareText = txStatic(
      `🔢 数字能量分析\n\n数字：${analysis.numbers}\n类型：${selectedTypeInfo?.name}\n能量评分：${analysis.score}/100 (${analysis.levelText})\n最终数字：${analysis.finalDigit}\n\n来自：命运工坊 🔮`,
      `🔢 Number Energy Analysis\n\nDigits: ${analysis.numbers}\nType: ${selectedTypeInfo?.id === 'phone' ? 'Phone number' : selectedTypeInfo?.id === 'plate' ? 'License plate' : selectedTypeInfo?.id === 'id' ? 'ID number' : 'Other numbers'}\nEnergy score: ${analysis.score}/100 (${analysis.levelText})\nFinal digit: ${analysis.finalDigit}\n\nFrom: Fate Atelier 🔮`,
    )

    if (navigator.share) {
      try {
        await navigator.share({ title: txStatic('🔢 数字能量分析', '🔢 Number Energy Analysis'), text: shareText })
      } catch {
        await copyToClipboard(shareText)
      }
    } else {
      await copyToClipboard(shareText)
    }
  }

  return {
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
  }
}
