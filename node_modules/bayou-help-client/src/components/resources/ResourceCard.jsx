import { useId, useState } from 'react'
import { Phone, MapPin, Clock, ArrowRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const ADDRESS_BLACKLIST = new Set(['confidential', 'n/a', 'na'])

function canEmbedMap(address) {
  if (!address) return false
  const trimmed = String(address).trim()
  if (!trimmed) return false

  const normalized = trimmed.toLowerCase()
  if (ADDRESS_BLACKLIST.has(normalized)) return false
  if (normalized.startsWith('n/a')) return false
  if (normalized.includes('confidential')) return false

  return true
}

function googleMapsEmbedSrc(address) {
  const q = encodeURIComponent(address)
  return `https://www.google.com/maps?q=${q}&output=embed`
}

function ResourceCard({ resource, compact = false }) {
  const address = resource?.address
  const showMap = canEmbedMap(address)

  const mapRegionId = useId()
  const [isMapOpen, setIsMapOpen] = useState(false)

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

        {address && (
          <div className={cn('flex items-start gap-2 text-sm', compact ? 'mt-2' : '')}>
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{address}</span>
          </div>
        )}

        {showMap && !compact && (
          <div className={cn('rounded-xl overflow-hidden border border-border/80', 'mt-3')}>
            <iframe
              title={`Map for ${resource.name}`}
              src={googleMapsEmbedSrc(address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-56"
              allowFullScreen
            />
          </div>
        )}

        {showMap && compact && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsMapOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white border border-border text-sm text-bayou-green hover:border-bayou-blue transition-colors"
              aria-expanded={isMapOpen}
              aria-controls={mapRegionId}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-bayou-blue" />
                View map
              </span>
              <ChevronDown
                className={cn('w-4 h-4 text-muted-foreground transition-transform', isMapOpen && 'rotate-180')}
              />
            </button>

            {isMapOpen && (
              <div
                id={mapRegionId}
                className="mt-2 rounded-xl overflow-hidden border border-border/80"
              >
                <iframe
                  title={`Map for ${resource.name}`}
                  src={googleMapsEmbedSrc(address)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-44"
                  allowFullScreen
                />
              </div>
            )}
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
