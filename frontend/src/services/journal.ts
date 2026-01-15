import axios from 'axios'
import { JournalEntry, EmotionScores } from '../types'
import { useAuth } from '../state/auth'

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined

function getAuthHeaders() {
  const token =
    localStorage.getItem('access_token') ||
    localStorage.getItem('auth_token') ||
    undefined
  return token ? { Authorization: `Bearer ${token}` } : {}
}

if (!API_BASE) {
  console.warn('VITE_API_BASE is not set – journal API will not be available')
}

const JOURNAL_BASE = API_BASE ? `${API_BASE}/journal` : ''

type ApiJournalEntry = {
  id: number
  user: number
  title: string
  text: string
  audio_file: string | null
  text_emotions: any | null
  speech_emotions: any | null
  combined_emotions: any | null
  created_at: string
}

const normaliseScores = (obj: any): EmotionScores | undefined => {
  if (!obj || typeof obj !== 'object') return undefined
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, Number(v) || 0]),
  ) as EmotionScores
}

function mapApiToJournalEntry(api: ApiJournalEntry): JournalEntry {
  const combined = (api.combined_emotions || {}) as {
    emotion?: EmotionScores
    sentiment?: number
  }

  // For voice entries, prefer the raw speech scores so all 8 labels render.
  const speechScores = api.audio_file
    ? normaliseScores(api.speech_emotions?.scores || api.speech_emotions)
    : undefined

  const emotion = speechScores || normaliseScores(combined.emotion)

  return {
    id: String(api.id),
    title: api.title || '',
    content: api.text || '',
    createdAt: api.created_at,
    updatedAt: api.created_at,
    tags: [], // tags are currently local-only
    audioUrl: api.audio_file || undefined,
    emotion,
    sentiment: combined.sentiment,
    mode: api.audio_file ? 'voice' : 'text',
  }
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  if (!JOURNAL_BASE) return []
  try {
    const { data } = await axios.get<ApiJournalEntry[]>(`${JOURNAL_BASE}/entries/`, {
      headers: { ...getAuthHeaders() },
    })
    return data.map(mapApiToJournalEntry)
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Try to refresh the token once, then retry
      try {
        const { refreshAccessToken } = useAuth.getState()
        await refreshAccessToken()
        const { data } = await axios.get<ApiJournalEntry[]>(`${JOURNAL_BASE}/entries/`, {
          headers: { ...getAuthHeaders() },
        })
        return data.map(mapApiToJournalEntry)
      } catch (refreshError) {
        // refreshAccessToken already logs out on failure
        throw refreshError
      }
    }
    throw error
  }
}

export async function createJournalEntry(
  entry: JournalEntry,
  audioBlob?: Blob | null,
): Promise<JournalEntry> {
  if (!JOURNAL_BASE) return entry

  if (audioBlob) {
    const fd = new FormData()
    fd.append('title', entry.title || '')
    fd.append('text', entry.content || '')
    fd.append('audio_file', audioBlob, 'journal-audio.webm')

    try {
      const { data } = await axios.post<ApiJournalEntry>(`${JOURNAL_BASE}/entries/`, fd, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      })
      return mapApiToJournalEntry(data)
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          const { refreshAccessToken } = useAuth.getState()
          await refreshAccessToken()
          const { data } = await axios.post<ApiJournalEntry>(`${JOURNAL_BASE}/entries/`, fd, {
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'multipart/form-data',
            },
          })
          return mapApiToJournalEntry(data)
        } catch (refreshError) {
          throw refreshError
        }
      }
      throw error
    }
  }

  const payload: Partial<ApiJournalEntry> = {
    title: entry.title || '',
    text: entry.content || '',
  }

  try {
    const { data } = await axios.post<ApiJournalEntry>(
      `${JOURNAL_BASE}/entries/`,
      payload,
      { headers: { ...getAuthHeaders() } },
    )
    return mapApiToJournalEntry(data)
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const { refreshAccessToken } = useAuth.getState()
        await refreshAccessToken()
        const { data } = await axios.post<ApiJournalEntry>(
          `${JOURNAL_BASE}/entries/`,
          payload,
          { headers: { ...getAuthHeaders() } },
        )
        return mapApiToJournalEntry(data)
      } catch (refreshError) {
        throw refreshError
      }
    }
    throw error
  }
}

export async function updateJournalEntry(
  entry: JournalEntry,
  audioBlob?: Blob | null,
): Promise<JournalEntry> {
  if (!JOURNAL_BASE) return entry

  const idNum = Number(entry.id)
  if (!idNum || Number.isNaN(idNum)) {
    // If we don't have a numeric backend id yet, fall back to create
    return createJournalEntry(entry, audioBlob)
  }
  if (audioBlob) {
    const fd = new FormData()
    fd.append('title', entry.title || '')
    fd.append('text', entry.content || '')
    fd.append('audio_file', audioBlob, 'journal-audio.webm')

    try {
      const { data } = await axios.put<ApiJournalEntry>(
        `${JOURNAL_BASE}/entries/${idNum}/`,
        fd,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return mapApiToJournalEntry(data)
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          const { refreshAccessToken } = useAuth.getState()
          await refreshAccessToken()
          const { data } = await axios.put<ApiJournalEntry>(
            `${JOURNAL_BASE}/entries/${idNum}/`,
            fd,
            {
              headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data',
              },
            },
          )
          return mapApiToJournalEntry(data)
        } catch (refreshError) {
          throw refreshError
        }
      }
      throw error
    }
  }

  const payload: Partial<ApiJournalEntry> = {
    title: entry.title || '',
    text: entry.content || '',
  }

  try {
    const { data } = await axios.put<ApiJournalEntry>(
      `${JOURNAL_BASE}/entries/${idNum}/`,
      payload,
      { headers: { ...getAuthHeaders() } },
    )
    return mapApiToJournalEntry(data)
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const { refreshAccessToken } = useAuth.getState()
        await refreshAccessToken()
        const { data } = await axios.put<ApiJournalEntry>(
          `${JOURNAL_BASE}/entries/${idNum}/`,
          payload,
          { headers: { ...getAuthHeaders() } },
        )
        return mapApiToJournalEntry(data)
      } catch (refreshError) {
        throw refreshError
      }
    }
    throw error
  }
}

export async function deleteJournalEntry(id: string): Promise<void> {
  if (!JOURNAL_BASE) return
  const idNum = Number(id)
  if (!idNum || Number.isNaN(idNum)) return
  try {
    await axios.delete(`${JOURNAL_BASE}/entries/${idNum}/`, {
      headers: { ...getAuthHeaders() },
    })
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const { refreshAccessToken } = useAuth.getState()
        await refreshAccessToken()
        await axios.delete(`${JOURNAL_BASE}/entries/${idNum}/`, {
          headers: { ...getAuthHeaders() },
        })
        return
      } catch (refreshError) {
        throw refreshError
      }
    }
    throw error
  }
}
