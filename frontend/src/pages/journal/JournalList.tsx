
import { Link } from 'react-router-dom'
import { useJournal } from '../../state/journal'
import EmotionBadge from '../../components/EmotionBadge'
import { PenSquare, AudioWaveform, Edit3, Eye, Trash2, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function JournalList() {
  const { entries, remove } = useJournal()
  const [q, setQ] = useState('')
  const [modeFilter, setModeFilter] = useState<'all' | 'text' | 'voice'>('all')
  const [previewId, setPreviewId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase()
    return entries.filter(e => {
      const matchQ = !k || e.title.toLowerCase().includes(k) || e.content.toLowerCase().includes(k) || e.tags.some(t => t.toLowerCase().includes(k))
      const mode = e.mode || (e.audioUrl ? 'voice' : 'text')
      const matchMode = modeFilter === 'all' || mode === modeFilter
      return matchQ && matchMode
    })
  }, [entries, q, modeFilter])

  const renderModeBadge = (mode?: 'text' | 'voice', audioUrl?: string) => {
    const m = mode || (audioUrl ? 'voice' : 'text')
    return (
      <span className={`badge ${m === 'voice' ? 'bg-indigo-600/20 text-indigo-700 dark:text-indigo-300' : 'bg-emerald-600/20 text-emerald-700 dark:text-emerald-300'}`}>
        {m === 'voice' ? <AudioWaveform className="size-3 mr-1" /> : <PenSquare className="size-3 mr-1" />}
        {m === 'voice' ? 'Voice' : 'Text'}
      </span>
    )
  }

  const confirmDelete = (id: string) => {
    const ok = window.confirm('Delete this entry? This cannot be undone.')
    if (ok) remove(id)
  }

  const selected = entries.find(e => e.id === previewId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your entries</h1>
        <Link to="/journal/new" className="btn btn-primary">New entry</Link>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <input
              className="input w-full pl-8"
              placeholder="Search by title, content, or tag…"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              aria-label="Search journal entries"
            />
            <Filter className="size-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" aria-hidden />
          </div>
          <div className="flex gap-2" role="group" aria-label="Filter by mode">
            <button className={`btn btn-ghost ${modeFilter==='all'?'ring-1 ring-[var(--band-accent)]/30':''}`} onClick={()=>setModeFilter('all')}>All</button>
            <button className={`btn btn-ghost ${modeFilter==='text'?'ring-1 ring-[var(--band-accent)]/30':''}`} onClick={()=>setModeFilter('text')}>Text</button>
            <button className={`btn btn-ghost ${modeFilter==='voice'?'ring-1 ring-[var(--band-accent)]/30':''}`} onClick={()=>setModeFilter('voice')}>Voice</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(e => (
          <div key={e.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderModeBadge(e.mode, e.audioUrl)}
                <div>
                  <h3 className="font-semibold">{e.title || 'Untitled'}</h3>
                  <p className="text-xs opacity-70">{new Date(e.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <EmotionBadge emotion={e.emotion} />
            </div>
            <p className="mt-3 line-clamp-3 opacity-90">{e.content}</p>
            {e.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {e.tags.map(t => (
                  <button key={t} className="badge hover:underline" onClick={()=>setQ(t)} aria-label={`Filter by tag ${t}`}>#{t}</button>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={()=>setPreviewId(e.id)} className="btn btn-ghost" aria-label="View entry"><Eye className="size-4 mr-2" /> View</button>
              <Link to={`/journal/${e.id}`} className="btn btn-ghost" aria-label="Edit entry"><Edit3 className="size-4 mr-2" /> Edit</Link>
              <button onClick={()=>confirmDelete(e.id)} className="btn btn-ghost" aria-label="Delete entry"><Trash2 className="size-4 mr-2" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="opacity-70">No entries match your filters.</p>}

      {/* Modal preview */}
      {selected && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={()=>setPreviewId(null)}>
          <div className="max-w-2xl w-full card bg-white dark:bg-neutral-900" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {renderModeBadge(selected.mode, selected.audioUrl)}
                <h3 className="font-semibold">{selected.title || 'Untitled'}</h3>
              </div>
              <div className="flex gap-2">
                <Link to={`/journal/${selected.id}`} className="btn btn-ghost" aria-label="Edit"><Edit3 className="size-4 mr-2" /> Edit</Link>
                <button onClick={()=>setPreviewId(null)} className="btn btn-ghost" aria-label="Close">Close</button>
              </div>
            </div>
            <p className="text-xs opacity-70">{new Date(selected.createdAt).toLocaleString()}</p>
            {selected.audioUrl && (
              <audio controls src={selected.audioUrl} className="mt-3 w-full" aria-label="Audio playback" />
            )}
            <p className="mt-3 whitespace-pre-wrap">{selected.content}</p>
            {selected.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.tags.map(t => (
                  <span key={t} className="badge">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
