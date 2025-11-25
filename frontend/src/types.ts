
export type EmotionScores = {
  joy: number
  sadness: number
  anger: number
  fear: number
  surprise: number
  neutral: number
}

export type JournalEntry = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  audioUrl?: string
  emotion?: EmotionScores
  sentiment?: number // -1..1
  mode?: 'text' | 'voice'
}
