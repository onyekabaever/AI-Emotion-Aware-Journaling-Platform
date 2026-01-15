
/// <reference types="vite/client" />

import axios from 'axios'
import { EmotionScores } from '../types'
import { useAuth } from '../state/auth'

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined

function authHeaders() {
  const token =
    localStorage.getItem('access_token') ||
    localStorage.getItem('auth_token') ||
    undefined
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function analyzeTextEmotion(text: string): Promise<{ emotion: EmotionScores; sentiment: number }> {
  // Try remote API if configured
  if (API_BASE) {
    try {
      const { data } = await axios.post(
        `${API_BASE}/machine_learning/analyze/text/`,
        { text },
        { headers: { ...authHeaders() } }
      )
      if (data?.emotion && typeof data?.sentiment === 'number') {
        return data
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        try {
          const { refreshAccessToken } = useAuth.getState()
          await refreshAccessToken()
          const { data } = await axios.post(
            `${API_BASE}/machine_learning/analyze/text/`,
            { text },
            { headers: { ...authHeaders() } }
          )
          if (data?.emotion && typeof data?.sentiment === 'number') {
            return data
          }
        } catch (refreshError) {
          console.warn('Token refresh failed during text analysis', refreshError)
        }
      }
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
  // For Voice Journal display, prefer the raw speech-label scores when available.
  // We obtain these from the combined endpoint response: data.speech.raw.scores.
  if (API_BASE) {
    const fd = new FormData()
    fd.append('audio', blob, 'audio.webm')

    const toScores = (obj: any): EmotionScores | null => {
      if (!obj || typeof obj !== 'object') return null
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, Number(v) || 0]),
      ) as EmotionScores
    }

    const attempt = async () => {
      // Prefer combined endpoint (returns raw speech scores), fallback to speech endpoint.
      try {
        const { data } = await axios.post(
          `${API_BASE}/machine_learning/analyze/combined/`,
          fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              ...authHeaders(),
            },
          }
        )

        const rawScores = toScores(data?.speech?.raw?.scores)
        const canonicalScores = toScores(data?.speech?.emotion)
        const sentiment = typeof data?.speech?.sentiment === 'number' ? data.speech.sentiment : 0

        if (rawScores) return { emotion: rawScores, sentiment }
        if (canonicalScores) return { emotion: canonicalScores, sentiment }
      } catch (e) {
        // ignore and try speech endpoint
      }

      const { data } = await axios.post(
        `${API_BASE}/machine_learning/analyze/speech/`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...authHeaders(),
          },
        }
      )
      if (data?.emotion && typeof data?.sentiment === 'number') {
        const scores = toScores(data.emotion)
        if (scores) return { emotion: scores, sentiment: data.sentiment }
      }

      throw new Error('Unexpected audio analysis response')
    }

    try {
      return await attempt()
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        try {
          const { refreshAccessToken } = useAuth.getState()
          await refreshAccessToken()
          return await attempt()
        } catch (refreshError) {
          console.warn('Token refresh failed during audio analysis', refreshError)
        }
      }
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
