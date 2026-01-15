
import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './layout/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import JournalList from './pages/journal/JournalList'
import JournalEditor from './pages/journal/JournalEditor'
import JournalView from './pages/journal/JournalView'
import JournalNew from './pages/journal/JournalNew'
import Insights from './pages/Insights'
import Prompts from './pages/Prompts'
import Search from './pages/Search'
import Settings from './pages/Settings'
import ExportPage from './pages/Export'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import MagicLink from './pages/auth/MagicLink'
import ProviderCallback from './pages/auth/ProviderCallback'
import CheckEmail from './pages/auth/CheckEmail'
import { useAuth } from './state/auth'

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot" element={<ForgotPassword />} />
            <Route path="reset/:token" element={<ResetPassword />} />
            <Route path="verify/:token" element={<VerifyEmail />} />
            <Route path="magic/:token" element={<MagicLink />} />
            <Route path="auth/callback/:provider" element={<ProviderCallback />} />
            <Route path="check-email" element={<CheckEmail />} />

        <Route path="app" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="journal" element={isAuthenticated ? <JournalList /> : <Navigate to="/signin" />} />
        <Route path="journal/new" element={isAuthenticated ? <JournalNew /> : <Navigate to="/signin" />} />
        <Route path="journal/new/:mode" element={isAuthenticated ? <JournalEditor /> : <Navigate to="/signin" />} />
        <Route path="journal/:id" element={isAuthenticated ? <JournalView /> : <Navigate to="/signin" />} />
        <Route path="journal/:id/edit" element={isAuthenticated ? <JournalEditor /> : <Navigate to="/signin" />} />
        <Route path="insights" element={isAuthenticated ? <Insights /> : <Navigate to="/signin" />} />
        <Route path="prompts" element={isAuthenticated ? <Prompts /> : <Navigate to="/signin" />} />
        <Route path="search" element={isAuthenticated ? <Search /> : <Navigate to="/signin" />} />
        <Route path="settings" element={isAuthenticated ? <Settings /> : <Navigate to="/signin" />} />
        <Route path="export" element={isAuthenticated ? <ExportPage /> : <Navigate to="/signin" />} />
      </Route>
    </Routes>
  )
}
