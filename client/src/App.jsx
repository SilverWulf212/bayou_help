import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Resources from './pages/Resources'
import Privacy from './pages/Privacy'
import Admin from './pages/Admin'
import QuickExit from './components/common/QuickExit'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <QuickExit />
    </>
  )
}

export default App
