import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi, Phone } from 'lucide-react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/utils'

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus()
  const prefersReducedMotion = useReducedMotion()

  const showBanner = !isOnline || wasOffline

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
          role="status"
          aria-live="polite"
        >
          <div className={cn(
            "px-4 py-3",
            isOnline
              ? "bg-green-50 border-b border-green-200"
              : "bg-yellow-50 border-b border-yellow-200"
          )}>
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-600" aria-hidden="true" />
                    <span className="text-sm font-medium text-green-700">
                      You're back online
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-yellow-600" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">
                      You're offline
                    </span>
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      · Saved resources still available
                    </span>
                  </>
                )}
              </div>

              {!isOnline && (
                <a
                  href="tel:211"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bayou-green text-white text-sm font-medium hover:bg-bayou-green/90 transition-colors"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Call 211</span>
                  <span className="sm:hidden">211</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineBanner
