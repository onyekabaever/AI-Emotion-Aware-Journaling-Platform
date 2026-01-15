import { Link, useParams, useNavigate } from 'react-router-dom'
import { useJournal } from '../../state/journal'
import EmotionBadge from '../../components/EmotionBadge'
import EmotionInsight from '../../components/EmotionInsight'

const sentimentLabel = (score?: number | null) => {
  if (score == null) return 'No AI feedback yet'
  if (score > 0.2) return 'Mostly positive'
  if (score < -0.2) return 'Mostly negative'
  return 'Mixed / neutral'
}

const renderModeBadge = (mode?: 'text' | 'voice', audioUrl?: string) => {
  const m = mode || (audioUrl ? 'voice' : 'text')
  return (
    <span className={`badge ${m === 'voice' ? 'bg-indigo-600/20 text-indigo-700 dark:text-indigo-300' : 'bg-emerald-600/20 text-emerald-700 dark:text-emerald-300'}`}>
      {m === 'voice' ? 'Voice entry' : 'Text entry'}
    </span>
  )
}

export default function JournalView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { byId } = useJournal()

  const entry = id ? byId(id) : undefined

  if (!entry) {
    return (
      <div className="card">
        <h1 className="text-xl font-bold mb-2">Entry not found</h1>
        <p className="text-sm opacity-70 mb-4">This journal entry could not be located.</p>
        <Link to="/journal" className="btn btn-primary">Back to journal list</Link>
      </div>
    )
  }

  const mode = entry.mode || (entry.audioUrl ? 'voice' : 'text')

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold break-words">{entry.title || 'Untitled entry'}</h1>
            <p className="text-xs opacity-70">{new Date(entry.createdAt).toLocaleString()}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {renderModeBadge(entry.mode, entry.audioUrl)}
              <EmotionBadge emotion={entry.emotion} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>Back</button>
            <Link to={`/journal/${entry.id}/edit`} className="btn btn-primary">Edit entry</Link>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card space-y-4" aria-label="Journal content">
          {entry.audioUrl && (
            <audio
              controls
              src={entry.audioUrl}
              className="w-full"
              aria-label="Journal audio playback"
            />
          )}
          <p className="whitespace-pre-wrap leading-relaxed">{entry.content}</p>
          {entry.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {entry.tags.map(t => (
                <span key={t} className="badge">#{t}</span>
              ))}
            </div>
          )}
        </section>

        <aside className="card space-y-3" aria-label="Emotional feedback">
          <h2 className="text-lg font-semibold">Emotional feedback</h2>
          <EmotionInsight emotion={entry.emotion} sentiment={entry.sentiment} mode={mode} />
        </aside>
      </div>
    </div>
  )
}
