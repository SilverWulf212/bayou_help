import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ChatInput from '../components/chat/ChatInput'
import ChatMessage from '../components/chat/ChatMessage'
import { useChat } from '../hooks/useChat'

const SUGGESTED_PROMPTS = [
  "I need help finding a place to stay tonight",
  "Where can I get free food in Lafayette?",
  "I need to see a doctor but don't have insurance"
]

function Chat() {
  const { messages, isLoading, sendMessage } = useChat()
  const [input, setInput] = useState('')

  const handleSubmit = (text) => {
    if (!text.trim() || isLoading) return
    sendMessage(text.trim())
    setInput('')
  }

  const handleSuggestion = (prompt) => {
    handleSubmit(prompt)
  }

  return (
    <div className="flex flex-col h-screen bg-bayou-cream">
      <header className="bg-bayou-green text-white py-3 px-4 flex items-center gap-4">
        <Link to="/" className="hover:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">Bayou Help Chat</h1>
          <p className="text-xs text-bayou-cream/80">Private • No data saved</p>
        </div>
      </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4 hero-backdrop">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-border">
              <p className="text-bayou-green font-medium mb-2">
                Hi! I can help you find resources in Acadiana.
              </p>
              <p className="text-sm text-muted-foreground">
                Tell me what you need - shelter, food, healthcare, jobs, or other help.
                I'll share local resources that might help.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground px-1">Try asking:</p>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestion(prompt)}
                  className="block w-full text-left px-4 py-3 bg-white rounded-lg border border-border hover:border-bayou-blue transition-colors text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {isLoading && (
          <div className="bg-white rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-bayou-blue rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-bayou-blue rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-bayou-blue rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </main>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => handleSubmit(input)}
        disabled={isLoading}
      />
    </div>
  )
}

export default Chat
