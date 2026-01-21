import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import ScrollFadeIn from '../components/ui/ScrollFadeIn'
import ResourceCard from '../components/resources/ResourceCard'

function ResourceDetail() {
  const { id } = useParams()

  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const heroSubtitle = useMemo(() => {
    if (!resource) return 'Local help and phone numbers'
    const pieces = []
    if (resource.parish) pieces.push(resource.parish.replaceAll('-', ' '))
    if (resource.categoryLabel || resource.category) pieces.push(resource.categoryLabel || resource.category)
    return pieces.join(' • ') || 'Local help and phone numbers'
  }, [resource])

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const url = `/api/resources/${encodeURIComponent(id)}`
        const maxAttempts = 3
        let lastError = null

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            const response = await fetch(url)
            if (!response.ok) {
              throw new Error('Resource not found')
            }
            const data = await response.json()
            if (!cancelled) {
              setResource(data)
            }
            lastError = null
            break
          } catch (err) {
            lastError = err
            if (attempt < maxAttempts) {
              await new Promise((r) => setTimeout(r, 500 * attempt))
            }
          }
        }

        if (lastError) throw lastError
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setResource(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) {
      run()
    }

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-bayou-cream">
        <PageHero
          title="Resource"
          subtitle="Loading"
          imageSrc="/2026-01-17 17-09-08.webp"
          imageAlt="Community resource board"
          height="160px"
        />
        <main className="container mx-auto px-4 py-6 hero-backdrop">
          <div className="bg-white rounded-lg p-4 border border-border animate-pulse">
            <div className="h-5 bg-muted rounded w-1/2 mb-3" />
            <div className="h-4 bg-muted rounded w-2/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bayou-cream">
        <PageHero
          title="Resource"
          subtitle="Not found"
          imageSrc="/2026-01-17 17-09-08.webp"
          imageAlt="Community resource board"
          height="160px"
        />
        <main className="container mx-auto px-4 py-6 hero-backdrop">
          <div className="bg-white rounded-lg p-6 border border-border">
            <p className="text-bayou-green font-semibold">We couldn't find that resource.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Go back to the list and try another option.
            </p>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-bayou-green text-white hover:bg-bayou-green/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse resources
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bayou-cream">
      <PageHero
        title={resource?.name || 'Resource'}
        subtitle={heroSubtitle}
        imageSrc="/2026-01-17 17-09-08.webp"
        imageAlt="Community resource board"
        height="160px"
      />

      <main className="container mx-auto px-4 py-6 max-w-3xl hero-backdrop">
        <ScrollFadeIn delay={0}>
          <div className="mb-4">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-sm text-bayou-blue hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to resources
            </Link>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <ResourceCard resource={resource} />
        </ScrollFadeIn>

        <ScrollFadeIn delay={200}>
          <div className="mt-6 text-xs text-muted-foreground">
            {resource?.verified ? `Last verified: ${resource.verified}` : null}
          </div>
        </ScrollFadeIn>
      </main>
    </div>
  )
}

export default ResourceDetail
