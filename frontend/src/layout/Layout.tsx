
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Layout() {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <Navbar />
      <main className="mx-auto max-w-7xl w-full px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
