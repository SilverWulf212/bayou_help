import { motion } from 'framer-motion'
import { WifiOff, ServerCrash, Search, AlertCircle, Phone, RefreshCw } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/utils'

const ERROR_CONFIG = {
  offline: {
    icon: WifiOff,
    title: "You’re offline",
    message: "No internet connection. You can still view saved resources. For live help, call 211.",
    iconColor: 'text-yellow-600',
  },
  server: {
    icon: ServerCrash,
    title: "We can’t load that right now",
    message: "This isn’t your fault. Please try again. If you need help now, call 211 (free).",
    iconColor: 'text-red-500',
  },
  notFound: {
    icon: Search,
    title: "No matches",
    message: "Try different words. If you’d rather talk to someone, call 211.",
    iconColor: 'text-gray-500',
  },
  generic: {
    icon: AlertCircle,
    title: "Something went wrong",
    message: "Please try again. If it keeps happening, call 211 for help.",
    iconColor: 'text-gray-500',
  },
}

export function ErrorState({
  type = 'generic',
  title,
  message,
  onRetry,
  className
}) {
  const prefersReducedMotion = useReducedMotion()
  const config = ERROR_CONFIG[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("text-center py-12 px-6", className)}
      role="alert"
      aria-live="polite"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
        <Icon className={cn("w-10 h-10", config.iconColor)} aria-hidden="true" />
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-3">
        {title || config.title}
      </h2>

      <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
        {message || config.message}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-border font-medium hover:border-bayou-blue transition-colors"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try again
          </button>
        )}

        <a
          href="tel:211"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bayou-green text-white font-medium hover:bg-bayou-green/90 transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          Call 211
        </a>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        211 is free and available 24/7
      </p>
    </motion.div>
  )
}

export default ErrorState
