
import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useJournal } from '../../state/journal'
import { analyzeTextEmotion, analyzeAudioEmotion } from '../../services/ai'
import AudioRecorder from '../../components/AudioRecorder'
import TagInput from '../../components/TagInput'
import EmotionChart from '../../components/EmotionChart'
import { JournalEntry } from '../../types'
import { toast } from 'sonner'

export default function JournalEditor() {
  const { id, mode } = useParams()
  const navigate = useNavigate()
  const location = useLocation() as any
  const { byId, upsert } = useJournal()
  const existing = useMemo(() => id ? byId(id) : undefined, [id, byId])

  const [title, setTitle] = useState(existing?.title || '')
  const [content, setContent] = useState(existing?.content || '')
  const [tags, setTags] = useState<string[]>(existing?.tags || [])
  const [audioUrl, setAudioUrl] = useState<string | undefined>(existing?.audioUrl)
  const [emotion, setEmotion] = useState(existing?.emotion)
  const [sentiment, setSentiment] = useState(existing?.sentiment)

  const recognitionRef = useRef<any>(null)
  const [dictating, setDictating] = useState(false)
  const [analyzingText, setAnalyzingText] = useState(false)
  const [analyzingAudio, setAnalyzingAudio] = useState(false)

  // Determine view mode (default to text)
  const viewMode: 'text' | 'voice' = mode === 'voice' ? 'voice' : (existing?.mode === 'voice' ? 'voice' : 'text')

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

  const onSave = () => {
    const now = new Date().toISOString()
    const entry: JournalEntry = {
      id: id || crypto.randomUUID(),
      title,
      content,
      tags,
      audioUrl,
      emotion,
      sentiment,
      mode: viewMode,
      createdAt: existing?.createdAt || now,
      updatedAt: now
    }
    upsert(entry)
    toast.success('Entry saved')
    navigate('/journal')
  }

  const sentimentPct = typeof sentiment === 'number' ? Math.round(((sentiment + 1) / 2) * 100) : undefined

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
          <button onClick={onSave} className="btn btn-primary" aria-label="Save entry">Save</button>
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
            <div className="mt-3">
              <TagInput value={tags} onChange={setTags} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={analyzeText}
                className="btn btn-ghost"
                aria-label="Analyze text emotion"
                disabled={analyzingText}
                aria-busy={analyzingText}
              >
                {analyzingText ? 'Analyzing…' : 'Analyze text emotion'}
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
            <AudioRecorder onFinish={async (blob, url) => {
              setAudioUrl(url)
              setAnalyzingAudio(true)
              try {
                const { emotion, sentiment } = await analyzeAudioEmotion(blob)
                setEmotion(emotion); setSentiment(sentiment)
                toast.success('Audio analyzed')
              } catch (e) {
                toast.error('Failed to analyze audio')
              } finally {
                setAnalyzingAudio(false)
              }
            }} />
            {audioUrl && <audio controls src={audioUrl} className="mt-3 w-full" aria-label="Recorded audio playback" />}
            {analyzingAudio && <p className="mt-2 text-xs opacity-70" aria-live="polite">Analyzing audio…</p>}
            <div className="mt-3">
              <TagInput value={tags} onChange={setTags} />
            </div>
          </section>
        )}

        <aside className="space-y-4">
          {viewMode === 'text' && (
            <div className="card" aria-label="Voice journal recorder (optional)">
              <h3 className="font-semibold mb-2">Voice journal</h3>
              <AudioRecorder onFinish={async (blob, url) => {
                setAudioUrl(url)
                setAnalyzingAudio(true)
                try {
                  const { emotion, sentiment } = await analyzeAudioEmotion(blob)
                  setEmotion(emotion); setSentiment(sentiment)
                  toast.success('Audio analyzed')
                } catch (e) {
                  toast.error('Failed to analyze audio')
                } finally {
                  setAnalyzingAudio(false)
                }
              }} />
              {audioUrl && <audio controls src={audioUrl} className="mt-3 w-full" aria-label="Recorded audio playback" />}
              {analyzingAudio && <p className="mt-2 text-xs opacity-70" aria-live="polite">Analyzing audio…</p>}
            </div>
          )}
          <div className="card" aria-label="Emotion visualization">
            <h3 className="font-semibold mb-2">Emotion</h3>
            <EmotionChart emotion={emotion} />
            {typeof sentiment === 'number' && (
              <div className="mt-3">
                <p className="text-sm opacity-80">Sentiment index: {sentiment.toFixed(2)}</p>
                {typeof sentimentPct === 'number' && (
                  <div className="mt-1">
                    <div className="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-800" aria-hidden="true">
                      <div
                        className="h-2 rounded bg-gradient-to-r from-rose-500 via-yellow-500 to-green-600"
                        style={{ width: `${sentimentPct}%` }}
                      />
                    </div>
                    <p className="text-xs opacity-70 mt-1" aria-hidden="true">{sentimentPct}% positive</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
