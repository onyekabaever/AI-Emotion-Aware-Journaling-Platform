
import { useNavigate } from 'react-router-dom'

const defaultPrompts = [
  'What energized you today?',
  'Describe a moment you felt proud this week.',
  'What is something you’re worried about right now?',
  'Write a letter to your future self.',
  'What did you learn from a recent setback?'
]

export default function Prompts() {
  const nav = useNavigate()
  const usePrompt = (p: string) => nav('/journal/new', { state: { prompt: p } })

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-4">Prompt library</h1>
      <ul className="grid md:grid-cols-2 gap-3">
        {defaultPrompts.map(p => (
          <li key={p} className="card">
            <p>{p}</p>
            <div className="mt-2">
              <button className="btn btn-ghost" onClick={()=>usePrompt(p)} aria-label={`Use prompt: ${p}`}>Use prompt</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
