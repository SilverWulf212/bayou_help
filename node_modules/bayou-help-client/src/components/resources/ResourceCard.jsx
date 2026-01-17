import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function ResourceCard({ resource, compact = false }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-border',
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className={cn('font-semibold text-bayou-green', compact ? 'text-sm' : '')}>
            {resource.name}
          </h3>
          <span className="inline-block text-xs bg-bayou-cream text-bayou-green px-2 py-0.5 rounded mt-1">
            {resource.categoryLabel || resource.category}
          </span>
        </div>
      </div>

      {resource.description && !compact && (
        <p className="text-sm text-muted-foreground mt-2">
          {resource.description}
        </p>
      )}

      <div className={cn('space-y-2', compact ? 'mt-2' : 'mt-3')}>
        {resource.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-bayou-blue" />
            <a
              href={`tel:${resource.phone}`}
              className="text-bayou-blue hover:underline"
            >
              {resource.phone}
            </a>
          </div>
        )}

        {resource.address && !compact && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{resource.address}</span>
          </div>
        )}

        {resource.hours && !compact && (
          <div className="flex items-start gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{resource.hours}</span>
          </div>
        )}
      </div>

      {resource.eligibility && !compact && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs font-medium text-bayou-green mb-1">Who can get help:</p>
          <p className="text-xs text-muted-foreground">{resource.eligibility}</p>
        </div>
      )}

      {resource.nextStep && !compact && (
        <div className="mt-3 p-3 bg-bayou-green/5 rounded-md">
          <div className="flex items-center gap-2 text-sm font-medium text-bayou-green">
            <ArrowRight className="w-4 h-4" />
            What to do:
          </div>
          <p className="text-sm text-muted-foreground mt-1">{resource.nextStep}</p>
        </div>
      )}
    </div>
  )
}

export default ResourceCard
