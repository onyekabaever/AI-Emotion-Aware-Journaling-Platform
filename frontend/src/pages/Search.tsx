
import { useState } from 'react'
import { useJournal } from '../state/journal'
import EmotionBadge from '../components/EmotionBadge'
import { Link } from 'react-router-dom'

export default function Search() {
  const { search, tagCloud, entries } = useJournal()
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [matchAll, setMatchAll] = useState(false)

  const tags = Object.keys(tagCloud())

  const toggleTag = (t: string) => {
    setSelected(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])
  }

  const base = q ? search(q) : entries
  const results = base.filter(e => {
    if (selected.length === 0) return true
    return matchAll ? selected.every(t => e.tags.includes(t)) : selected.some(t => e.tags.includes(t))
  })

  return (
    <div className="space-y-4">
      <div className="card">
        <label htmlFor="search-input" className="sr-only">Search entries</label>
        <input id="search-input" value={q} onChange={(e)=>setQ(e.target.value)} className="input w-full" placeholder="Search by text or tag..." />
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Filter by tags">
          {tags.map(t => (
            <button key={t} className={`badge ${selected.includes(t) ? 'ring-2 ring-indigo-500' : ''}`} onClick={()=>toggleTag(t)} aria-pressed={selected.includes(t)} aria-label={`Filter by ${t}`}>{t}</button>
          ))}
          {tags.length === 0 && <p className="opacity-70 text-sm">No tags yet.</p>}
        </div>
        {tags.length > 0 && (
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={matchAll} onChange={e=>setMatchAll(e.target.checked)} />
            Match all selected tags
          </label>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {results.map(e => (
          <Link to={`/journal/${e.id}`} key={e.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-sm opacity-70">{new Date(e.createdAt).toLocaleString()}</p>
              </div>
              <EmotionBadge emotion={e.emotion} />
            </div>
            <p className="mt-3 line-clamp-3 opacity-90">{e.content}</p>
            {e.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {e.tags.map(t => <span key={t} className="badge">{t}</span>)}
              </div>
            )}
          </Link>
        ))}
        {results.length === 0 && <p className="opacity-70">No results.</p>}
      </div>
    </div>
  )
}
