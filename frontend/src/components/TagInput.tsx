
import { useState } from 'react'

export default function TagInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    const t = input.trim()
    if (t && !value.includes(t)) onChange([...value, t])
    setInput('')
  }
  const remove = (t: string) => onChange(value.filter(x => x !== t))

  return (
    <div>
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Add tag..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') add() }} />
        <button className="btn btn-ghost" onClick={add}>Add</button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {value.map(t => (
          <span key={t} className="badge">{t} <button className="ml-1 opacity-60" onClick={()=>remove(t)} aria-label={`Remove ${t}`}>×</button></span>
        ))}
      </div>
    </div>
  )
}
