import { useState, useCallback, useRef } from 'react'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesRef = useRef([])

  const sendMessage = useCallback(async (content) => {
    if (isLoading) return

    const userMessage = { role: 'user', content }
    const currentHistory = messagesRef.current
    const nextHistory = [...currentHistory, userMessage]
    messagesRef.current = nextHistory
    setMessages(messagesRef.current)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: nextHistory,
        }),
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => null)
        throw new Error(errBody?.error || 'Failed to get response')
      }

      const data = await response.json()

      const assistantMessage = {
        role: 'assistant',
        content: data.content,
        resources: data.resources || [],
        citations: data.citations || [],
      }

      messagesRef.current = [...messagesRef.current, assistantMessage]
      setMessages(messagesRef.current)
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        role: 'assistant',
        content:
          "I'm sorry, I couldn't process your request right now. " +
          "Please try again, or call 211 to speak with someone who can help.",
      }
      messagesRef.current = [...messagesRef.current, errorMessage]
      setMessages(messagesRef.current)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const clearMessages = useCallback(() => {
    messagesRef.current = []
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}
