import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, MessageCircle, MapPin, Briefcase, Shield, Settings } from 'lucide-react'

function TopNav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  if (location.pathname === '/') return null

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/resources', icon: MapPin, label: 'Resources' },
    { to: '/resume', icon: Briefcase, label: 'Jobs' },
    { to: '/privacy', icon: Shield, label: 'Privacy' },
    { to: '/admin', icon: Settings, label: 'Admin' },
  ]

  return (
    <div ref={menuRef} className="fixed top-3 right-3 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-sm hover:bg-white transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-bayou-green" />
        ) : (
          <Menu className="w-5 h-5 text-bayou-green" />
        )}
      </button>

      {isOpen && (
        <nav
          className="absolute top-12 right-0 w-48 bg-white/95 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden"
          aria-label="Main navigation"
        >
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-bayou-green/10 text-bayou-green font-medium'
                    : 'text-muted-foreground hover:bg-bayou-blue/5 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}

export default TopNav
