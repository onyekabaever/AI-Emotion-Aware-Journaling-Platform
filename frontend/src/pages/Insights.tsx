
import { useMemo } from 'react'
import { useJournal } from '../state/journal'
import EmotionChart from '../components/EmotionChart'

export default function Insights() {
  const { entries, tagCloud } = useJournal()

  const overall = useMemo(() => {
    const acc: any = { joy:0, sadness:0, anger:0, fear:0, surprise:0, neutral:0 }
    let n = 0
    entries.forEach(e => {
      if (!e.emotion) return
      n++
      Object.keys(acc).forEach(k => acc[k] += (e.emotion as any)[k] || 0)
    })
    if (n>0) Object.keys(acc).forEach(k => acc[k] = acc[k]/n)
    return acc
  }, [entries])

  const tags = tagCloud()
  const total = entries.length

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="card lg:col-span-2">
        <h2 className="text-xl font-bold mb-3">Average emotion mix</h2>
        <EmotionChart emotion={overall} />
      </section>
      <section className="card">
        <h2 className="text-xl font-bold mb-3">Stats</h2>
        <ul className="space-y-2 text-sm">
          <li>Total entries: <b>{total}</b></li>
          <li>Unique tags: <b>{Object.keys(tags).length}</b></li>
        </ul>
      </section>
      <section className="card lg:col-span-3">
        <h2 className="text-xl font-bold mb-3">Tag cloud</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(tags).map(([t, c]) => <span key={t} className="badge">{t} ({c})</span>)}
          {Object.keys(tags).length === 0 && <p className="opacity-70">No tags yet.</p>}
        </div>
      </section>
    </div>
  )
}
