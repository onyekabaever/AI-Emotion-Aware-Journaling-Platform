
import { useTheme } from '../state/theme'
import { useAuth } from '../state/auth'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div>
        <p className="font-semibold">Theme</p>
        <button className="btn btn-ghost mt-2" onClick={toggleTheme}>Current: {theme}</button>
      </div>
      <div>
        <p className="font-semibold">Profile</p>
        <p className="text-sm opacity-80">Signed in as {user?.username} ({user?.email})</p>
      </div>
      <div>
        <p className="font-semibold">Privacy</p>
        <p className="text-sm opacity-80">This prototype stores your entries in your browser (localStorage). You can export or clear them anytime.</p>
      </div>
    </div>
  )
}
