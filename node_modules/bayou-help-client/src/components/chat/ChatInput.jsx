import { Send } from 'lucide-react'

function ChatInput({ value, onChange, onSubmit, disabled }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="border-t border-border bg-white p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you need help with today?"
          disabled={disabled}
          className="flex-1 px-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="px-4 py-3 bg-bayou-green text-white rounded-lg hover:bg-bayou-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Private: messages aren’t saved
      </p>
    </div>
  )
}

export default ChatInput
