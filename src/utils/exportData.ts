import { ReadingRecord } from '../components/ReadingHistory'
import { getFavorites } from './favorites'

export interface ExportData {
  version: string
  exportDate: string
  favorites: number[]
  readingHistory: ReadingRecord[]
}

export const exportAllData = (readingHistory: ReadingRecord[]): string => {
  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    favorites: getFavorites(),
    readingHistory: readingHistory
  }

  return JSON.stringify(data, null, 2)
}

export const downloadAllData = (readingHistory: ReadingRecord[]) => {
  const json = exportAllData(readingHistory)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `塔罗占卜数据_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importData = (jsonString: string): { favorites: number[], readingHistory: ReadingRecord[] } | null => {
  try {
    const data: ExportData = JSON.parse(jsonString)
    return {
      favorites: data.favorites || [],
      readingHistory: data.readingHistory || []
    }
  } catch (e) {
    console.error('Failed to import data', e)
    return null
  }
}

