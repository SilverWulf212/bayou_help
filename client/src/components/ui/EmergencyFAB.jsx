import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, AlertTriangle, HeartPulse, HelpCircle } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/utils'

const EMERGENCY_LINES = [
  {
    id: '911',
    phone: '911',
    label: '911',
    description: 'Police, fire, medical emergency',
    icon: AlertTriangle,
    color: 'bg-red-500 text-white',
  },
  {
    id: '988',
    phone: '988',
    label: '988',
    description: 'Suicide & crisis support',
    icon: HeartPulse,
    color: 'bg-purple-600 text-white',
  },
  {
    id: '211',
    phone: '211',
    label: '211',
    description: 'Find local resources',
    icon: HelpCircle,
    color: 'bg-bayou-blue text-white',
  },
]

export function EmergencyFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="fixed bottom-6 right-4 z-50 sm:bottom-8 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-64 mb-2 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
            role="menu"
            aria-label="Emergency phone numbers"
          >
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Emergency Lines
              </p>

              {EMERGENCY_LINES.map((line, index) => {
                const Icon = line.icon
                return (
                  <motion.a
                    key={line.id}
                    href={`tel:${line.phone}`}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bayou-blue"
                    role="menuitem"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      line.color
                    )}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block font-semibold text-foreground">
                        {line.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {line.description}
                      </span>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            <div className="px-4 py-3 bg-muted/50 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                All calls are free & confidential
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bayou-cream",
          isOpen
            ? "bg-muted text-muted-foreground focus-visible:ring-muted-foreground"
            : "bg-red-500 text-white focus-visible:ring-red-500"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Close emergency menu" : "Open emergency phone numbers"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Phone className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20 pointer-events-none" />
      )}
    </div>
  )
}

export default EmergencyFAB
