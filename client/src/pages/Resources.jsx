import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Filter } from 'lucide-react'
import ResourceCard from '../components/resources/ResourceCard'

const PARISHES = [
  { value: '', label: 'All Parishes' },
  { value: 'lafayette', label: 'Lafayette' },
  { value: 'st-landry', label: 'St. Landry (Opelousas)' },
  { value: 'vermilion', label: 'Vermilion (Abbeville)' },
  { value: 'iberia', label: 'Iberia (New Iberia)' },
  { value: 'acadia', label: 'Acadia (Crowley)' },
]

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'shelter', label: 'Shelter' },
  { value: 'food', label: 'Food' },
  { value: 'health', label: 'Healthcare' },
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'domestic-violence', label: 'Domestic Violence' },
  { value: 'jobs', label: 'Jobs & Training' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'id-documents', label: 'ID & Documents' },
  { value: 'crisis', label: 'Crisis Lines' },
]

function Resources() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const parish = searchParams.get('parish') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (parish) params.append('parish', parish)
        if (category) params.append('category', category)

        const response = await fetch(`/api/resources?${params}`)
        if (!response.ok) throw new Error('Failed to fetch resources')

        const data = await response.json()
        setResources(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [parish, category])

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  return (
    <div className="min-h-screen bg-bayou-cream">
      <header className="bg-bayou-green text-white py-3 px-4 flex items-center gap-4">
        <Link to="/" className="hover:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">Resources</h1>
          <p className="text-xs text-bayou-cream/80">Find help near you</p>
        </div>
      </header>

      <div className="sticky top-0 bg-white border-b border-border p-4 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={parish}
              onChange={(e) => updateFilter('parish', e.target.value)}
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              {PARISHES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <select
            value={category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 hero-backdrop">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-border animate-pulse">
                <div className="h-5 bg-muted rounded w-1/3 mb-3" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-center">
            We couldn’t load resources right now. Please try again.
          </div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No matches for those filters. Try another parish or category.
            </p>
          </div>
        )}

        {!loading && !error && resources.length > 0 && (
          <div className="space-y-4">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Resources
