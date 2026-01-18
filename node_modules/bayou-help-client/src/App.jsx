import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Resources from './pages/Resources'
import ResourceDetail from './pages/ResourceDetail'
import Privacy from './pages/Privacy'
import Admin from './pages/Admin'
import QuickExit from './components/common/QuickExit'
import { useSeoMeta } from './hooks/useSeoMeta'

function App() {
  useSeoMeta()

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <QuickExit />
    </>
  )
}

export default App
