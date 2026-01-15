
import { useJournal } from '../state/journal'
import { toast } from 'sonner'

export default function ExportPage() {
  const { entries, clearAll } = useJournal()

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'journal-export.json'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported journal as JSON')
  }

  const onClearAll = () => {
    const ok = window.confirm('This will permanently delete all entries from this device (and they may still exist on the server). Continue?')
    if (!ok) return
    clearAll()
    toast.success('All entries cleared')
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-3">Export</h1>
      <p className="opacity-80">Download all your entries as JSON, or clear them locally.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={exportJson} className="btn btn-primary">Export JSON</button>
        <button onClick={onClearAll} className="btn btn-ghost">Clear all entries</button>
      </div>
      <p className="text-xs opacity-60 mt-2">Data is stored locally via your browser. Clearing will remove local data only.</p>
    </div>
  )
}
