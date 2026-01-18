import { useState } from 'react'
import ChatInput from '../components/chat/ChatInput'
import ChatMessage from '../components/chat/ChatMessage'
import PageHero from '../components/ui/PageHero'
import ScrollFadeIn from '../components/ui/ScrollFadeIn'
import { useChat } from '../hooks/useChat'

const SUGGESTED_PROMPTS = [
  "I need a safe place to sleep tonight",
  "Where can I get free food today in Lafayette?",
  "I need medical care and I don't have insurance",
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
      <PageHero
        title="Chat"
        subtitle="Private • not stored"
        imageSrc="/2026-01-17 17-03-08.webp"
        imageAlt="Shelter entrance with All Welcome sign"
        height="140px"
      />

      <main className="flex-1 overflow-y-auto p-4 space-y-4 hero-backdrop">
        {messages.length === 0 && (
          <div className="space-y-4">
            <ScrollFadeIn delay={0}>
              <div className="bg-white rounded-lg p-4 border border-border">
                <p className="text-bayou-green font-medium mb-2">
                  Hi — I'm here with you.
                </p>
                <p className="text-sm text-muted-foreground">
                  Tell me what you need (shelter, food, health care, work, safety). I'll share local options and phone numbers.
                </p>
              </div>
            </ScrollFadeIn>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground px-1">Try one of these:</p>
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <ScrollFadeIn key={prompt} delay={(index + 1) * 100}>
                  <button
                    onClick={() => handleSuggestion(prompt)}
                    className="block w-full text-left px-4 py-3 bg-white rounded-lg border border-border hover:border-bayou-blue transition-colors text-sm card-lift"
                  >
                    {prompt}
                  </button>
                </ScrollFadeIn>
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

      <p className="px-4 pb-3 text-center text-[11px] leading-snug text-muted-foreground">
        Avoid sharing names or account numbers. Resource details can change—call to confirm.
      </p>
    </div>
  )
}

export default Chat
