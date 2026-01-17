import { X } from 'lucide-react'

function QuickExit() {
  const handleExit = () => {
    window.location.replace('https://www.google.com')
  }

  return (
    <button
      onClick={handleExit}
      className="quick-exit-trigger bg-destructive hover:bg-destructive/90 text-white p-3 rounded-full shadow-lg transition-colors"
      aria-label="Quick exit: leave this site"
      title="Quick exit: open Google"
    >
      <X className="w-6 h-6" />
    </button>
  )
}

export default QuickExit
