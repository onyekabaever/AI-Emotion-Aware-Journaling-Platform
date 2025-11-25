
/// <reference types="vite/client" />

import axios from 'axios'
import { EmotionScores } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined

export async function analyzeTextEmotion(text: string): Promise<{ emotion: EmotionScores; sentiment: number }> {
  // Try remote API if configured
  if (API_BASE) {
    try {
      const { data } = await axios.post(`${API_BASE}/analyze/text`, { text })
      if (data?.emotion && typeof data?.sentiment === 'number') {
        return data
      }
    } catch (err) {
      console.warn('Text analysis API failed, falling back to local', err)
    }
  }

  // Fallback: deterministic pseudo-analysis
  const hash = Array.from(text).reduce((a, c) => a + c.charCodeAt(0), 0)
  const base = (n: number) => ((Math.sin(hash + n) + 1) / 2)
  const emotion: EmotionScores = {
    joy: base(1),
    sadness: base(2),
    anger: base(3) * 0.4,
    fear: base(4) * 0.4,
    surprise: base(5) * 0.6,
    neutral: 0.2 + base(6) * 0.2
  }
  const sentiment = Math.tanh((emotion.joy - (emotion.sadness + emotion.anger + emotion.fear)/3) * 2)
  return new Promise(res => setTimeout(() => res({ emotion, sentiment }), 300))
}

export async function analyzeAudioEmotion(blob: Blob): Promise<{ emotion: EmotionScores; sentiment: number }> {
  // Try remote API if configured
  if (API_BASE) {
    try {
      const fd = new FormData()
      fd.append('file', blob, 'audio.webm')
      const { data } = await axios.post(`${API_BASE}/analyze/audio`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (data?.emotion && typeof data?.sentiment === 'number') {
        return data
      }
    } catch (err) {
      console.warn('Audio analysis API failed, falling back to local', err)
    }
  }

  // Fallback: extract simple size-based pseudo-signal
  const size = blob.size
  const n = Math.max(1, Math.log10(size))
  const emotion: EmotionScores = {
    joy: Math.min(1, n / 6),
    sadness: Math.max(0, 1 - n / 8),
    anger: 0.2,
    fear: 0.2,
    surprise: 0.3,
    neutral: 0.5,
  }
  const sentiment = emotion.joy - emotion.sadness
  return new Promise(res => setTimeout(() => res({ emotion, sentiment }), 500))
}
