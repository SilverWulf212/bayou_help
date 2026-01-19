import { Link, useLocation } from 'react-router-dom'
import { Home, Shield, Settings } from 'lucide-react'

function FooterNav() {
  const location = useLocation()

  if (location.pathname === '/') return null

  return (
    <nav
      className="fixed bottom-0 left-0 z-40 flex items-center gap-1 p-2 bg-white/80 backdrop-blur-sm border-t border-r border-border rounded-tr-2xl"
      aria-label="Footer navigation"
    >
      <Link
        to="/"
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/60 rounded-xl transition-colors"
        aria-label="Go to home page"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      <Link
        to="/privacy"
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/60 rounded-xl transition-colors"
      >
        <Shield className="w-4 h-4" />
        <span className="hidden sm:inline">Privacy</span>
      </Link>

      <Link
        to="/admin"
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/60 rounded-xl transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Admin</span>
      </Link>
    </nav>
  )
}

export default FooterNav
