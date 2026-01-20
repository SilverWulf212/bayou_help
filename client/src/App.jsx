import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Resources from './pages/Resources'
import ResourceDetail from './pages/ResourceDetail'
import Privacy from './pages/Privacy'
import Admin from './pages/Admin'
import ResumeBuilder from './pages/ResumeBuilder'
import TopNav from './components/common/TopNav'
import ErrorBoundary from './components/ErrorBoundary'
import { useSeoMeta } from './hooks/useSeoMeta'

function App() {
  useSeoMeta()

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/resume" element={<ResumeBuilder />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <TopNav />
    </ErrorBoundary>
  )
}

export default App
