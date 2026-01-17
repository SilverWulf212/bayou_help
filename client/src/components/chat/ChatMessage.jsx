import { cn } from '@/lib/utils'
import ResourceCard from '../resources/ResourceCard'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-lg p-4',
          isUser
            ? 'bg-bayou-green text-white'
            : 'bg-white border border-border'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.resources && message.resources.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} compact />
            ))}
          </div>
        )}

        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Sources: {message.citations.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
