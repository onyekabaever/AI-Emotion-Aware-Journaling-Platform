
export type EmotionScores = Record<string, number>

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
