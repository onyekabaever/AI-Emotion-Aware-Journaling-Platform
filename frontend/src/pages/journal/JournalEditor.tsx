
import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useJournal } from '../../state/journal'
import { analyzeTextEmotion, analyzeAudioEmotion } from '../../services/ai'
import { createJournalEntry, updateJournalEntry, deleteJournalEntry } from '../../services/journal'
import AudioRecorder from '../../components/AudioRecorder'
import EmotionChart from '../../components/EmotionChart'
import EmotionInsight from '../../components/EmotionInsight'
import { JournalEntry } from '../../types'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

export default function JournalEditor() {
  const { id, mode } = useParams()
  const navigate = useNavigate()
  const location = useLocation() as any
  const { byId, upsert, remove } = useJournal()
  const existing = useMemo(() => id ? byId(id) : undefined, [id, byId])

  const [title, setTitle] = useState(existing?.title || '')
  const [content, setContent] = useState(existing?.content || '')
  const [tags, setTags] = useState<string[]>(existing?.tags || [])
  const [audioUrl, setAudioUrl] = useState<string | undefined>(existing?.audioUrl)
  const [emotion, setEmotion] = useState(existing?.emotion)
  const [sentiment, setSentiment] = useState(existing?.sentiment)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [audioSource, setAudioSource] = useState<Blob | File | null>(null)

  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [dictating, setDictating] = useState(false)
  const [analyzingText, setAnalyzingText] = useState(false)
  const [analyzingAudio, setAnalyzingAudio] = useState(false)

  // Determine view mode (default to text)
  const viewMode: 'text' | 'voice' = mode === 'voice' ? 'voice' : (existing?.mode === 'voice' ? 'voice' : 'text')

  // When switching between /journal/new/text and /journal/new/voice, clear any
  // previously generated (unsaved) AI feedback so it doesn't carry over.
  useEffect(() => {
    if (!id && !existing) {
      setTitle('')
      setEmotion(undefined)
      setSentiment(undefined)
    }
  }, [viewMode, id, existing])

  useEffect(() => {
    if (id && existing) {
      setTitle(existing.title)
      setContent(existing.content)
      setTags(existing.tags)
      setAudioUrl(existing.audioUrl)
      setEmotion(existing.emotion)
      setSentiment(existing.sentiment)
    }
  }, [id, existing])

  // Prefill from prompt navigation
  useEffect(() => {
    if (!existing && location?.state?.prompt && !content) {
      setContent(location.state.prompt)
    }
  }, [existing, location, content])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.()
    }
  }, [])

  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    const chars = content.length
    const minutes = Math.max(1, Math.round(words / 200))
    return { words, chars, minutes }
  }, [content])

  const startDictation = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      toast.error('Speech recognition is not supported in this browser')
      return
    }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          setContent(prev => prev + (prev ? ' ' : '') + transcript.trim())
        }
      }
    }
    rec.onend = () => setDictating(false)
    recognitionRef.current = rec
    rec.start()
    setDictating(true)
    toast.info('Dictation started')
  }

  const stopDictation = () => {
    recognitionRef.current?.stop?.()
    setDictating(false)
    toast.success('Dictation stopped')
  }

  const analyzeText = async () => {
    if (!content.trim()) {
      toast.error('Write something to analyze')
      return
    }
    setAnalyzingText(true)
    try {
      const { emotion, sentiment } = await analyzeTextEmotion(content)
      setEmotion(emotion); setSentiment(sentiment)
      toast.success('Text analyzed')
    } catch (e) {
      toast.error('Failed to analyze text')
    } finally {
      setAnalyzingText(false)
    }
  }

  const onSave = async () => {
    const now = new Date().toISOString()
    const base: JournalEntry = {
      id: existing?.id || '',
      title,
      content,
      tags,
      audioUrl,
      emotion,
      sentiment,
      mode: viewMode,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    try {
      const saved = existing && existing.id
        ? await updateJournalEntry(base, audioSource || undefined)
        : await createJournalEntry(base, audioSource || undefined)

      upsert(saved)
      toast.success('Entry saved')
      navigate('/journal')
    } catch (e) {
      console.error('Failed to save journal entry', e)
      toast.error('Failed to save entry')
    }
  }

  const sentimentPct = typeof sentiment === 'number' ? Math.round(((sentiment + 1) / 2) * 100) : undefined

  const onDelete = () => {
    if (!id) return
    const ok = window.confirm('Delete this entry? This cannot be undone.')
    if (!ok) return
    remove(id)
    deleteJournalEntry(id).catch(err => {
      console.warn('Failed to delete entry on server', err)
    })
    toast.success('Entry deleted')
    navigate('/journal')
  }

  return (
    <div className="space-y-6">
      {/* Header band */}
      <section aria-labelledby="editor-title" className="rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <label htmlFor="title-input" className="sr-only">Title</label>
          <input
            id="editor-title"
            className="input flex-1 text-xl md:text-2xl font-semibold"
            placeholder="Title…"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />
          <div className="flex items-center gap-2">
            {existing && id && (
              <button
                type="button"
                onClick={onDelete}
                className="btn btn-ghost"
                aria-label="Delete entry"
              >
                <Trash2 className="size-4 mr-1" />
                Delete
              </button>
            )}
            <button onClick={onSave} className="btn btn-primary" aria-label="Save entry">Save</button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <p className="opacity-70">Mode: {viewMode === 'text' ? 'Text' : 'Voice'}</p>
          <div className="flex items-center gap-3">
            {viewMode === 'text' ? (
              <Link to="/journal/new/voice" className="underline">Switch to voice</Link>
            ) : (
              <Link to="/journal/new/text" className="underline">Switch to text</Link>
            )}
          </div>
        </div>
        {viewMode === 'text' && (
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="card" aria-label="Word count"><p className="opacity-70">Words</p><p className="text-lg font-bold">{stats.words}</p></div>
            <div className="card" aria-label="Reading time"><p className="opacity-70">Read time</p><p className="text-lg font-bold">{stats.minutes} min</p></div>
            <div className="card" aria-label="Characters"><p className="opacity-70">Characters</p><p className="text-lg font-bold">{stats.chars}</p></div>
          </div>
        )}
      </section>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {viewMode === 'text' ? (
          <section className="lg:col-span-2 card" aria-label="Text journal editor">
            <label htmlFor="content-input" className="sr-only">Content</label>
            <textarea
              id="content-input"
              className="input w-full mt-1 h-72 md:h-80"
              placeholder="Write your journal…"
              value={content}
              onChange={(e)=>setContent(e.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={analyzeText}
                className="btn btn-ghost"
                aria-label="Get emotional feedback from text"
                disabled={analyzingText}
                aria-busy={analyzingText}
              >
                {analyzingText ? 'Analyzing…' : 'Get emotional feedback'}
              </button>
              {!dictating ? (
                <button onClick={startDictation} className="btn btn-ghost" aria-label="Start dictation" aria-pressed="false">Start dictation</button>
              ) : (
                <button onClick={stopDictation} className="btn btn-ghost" aria-label="Stop dictation" aria-pressed="true">Stop dictation</button>
              )}
            </div>
          </section>
        ) : (
          <section className="lg:col-span-2 card" aria-label="Voice journaling">
            <h3 className="font-semibold mb-2">Voice journal</h3>
            <AudioRecorder onFinish={(blob, url) => {
              setAudioUrl(url)
              setUploadedFileName(null)
              setAudioSource(blob)
              toast.info('Recording ready. Click "Get emotional feedback" to analyze.')
            }} />
            <div className="mt-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900/40 p-3">
              <p className="text-xs font-medium opacity-80">Or upload an existing recording</p>
              <p className="text-[11px] opacity-70 mt-1">Supports common audio formats (mp3, wav, m4a, webm).</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose audio file
                </button>
                {uploadedFileName && (
                  <span className="text-[11px] opacity-80 truncate max-w-[200px]" aria-live="polite">
                    Selected: {uploadedFileName}
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploadedFileName(file.name)
                  const url = URL.createObjectURL(file)
                  setAudioUrl(url)
                  setAudioSource(file)
                }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={analyzingAudio}
                aria-busy={analyzingAudio}
                onClick={async () => {
                  if (!audioSource) {
                    toast.error('Record or upload audio first')
                    return
                  }
                  setAnalyzingAudio(true)
                  try {
                    const { emotion, sentiment } = await analyzeAudioEmotion(audioSource)
                    setEmotion(emotion); setSentiment(sentiment)
                    toast.success('Audio analyzed')
                  } catch (err) {
                    toast.error('Failed to analyze audio')
                  } finally {
                    setAnalyzingAudio(false)
                  }
                }}
              >
                {analyzingAudio ? 'Analyzing…' : 'Get emotional feedback'}
              </button>
            </div>
            {audioUrl && <audio controls src={audioUrl} className="mt-3 w-full" aria-label="Recorded audio playback" />}
            {analyzingAudio && <p className="mt-2 text-xs opacity-70" aria-live="polite">Analyzing audio…</p>}
          </section>
        )}

        <aside className="space-y-4">
          <div className="card" aria-label="AI emotional feedback">
            <h3 className="font-semibold mb-2">AI emotional feedback</h3>
            <EmotionInsight emotion={emotion} sentiment={sentiment} mode={viewMode} />
          </div>
        </aside>
      </div>
    </div>
  )
}
