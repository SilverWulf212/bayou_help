import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Plus, Pencil, Trash2 } from 'lucide-react'
import ResourceFormModal from '../components/admin/ResourceFormModal'
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal'
import PageHero from '../components/ui/PageHero'
import ScrollFadeIn from '../components/ui/ScrollFadeIn'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setAdminPassword(password)
        fetchResources()
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Login failed')
    }
  }

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/resources')
      const data = await response.json()
      setResources(data)
    } catch {
      setError('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setSelectedResource(null)
    setIsFormModalOpen(true)
  }

  const handleEditClick = (resource) => {
    setSelectedResource(resource)
    setIsFormModalOpen(true)
  }

  const handleDeleteClick = (resource) => {
    setSelectedResource(resource)
    setIsDeleteModalOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setIsSaving(true)
    setError('')

    try {
      const isEditing = !!selectedResource
      const url = isEditing
        ? `/api/admin/resources/${selectedResource.id}`
        : '/api/admin/resources'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save resource')
      }

      await fetchResources()
      setIsFormModalOpen(false)
      setSelectedResource(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedResource) return

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/resources/${selectedResource.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPassword}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete resource')
      }

      await fetchResources()
      setIsDeleteModalOpen(false)
      setSelectedResource(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen hero-backdrop flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 border border-border w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-bayou-green" />
            <h1 className="text-xl font-bold text-bayou-green">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-bayou-green text-white py-2 rounded-md hover:bg-bayou-green/90 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-bayou-blue">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bayou-cream">
      <PageHero
        title="Admin Panel"
        subtitle="Manage community resources"
        imageSrc="/2026-01-17 17-10-31.webp"
        imageAlt="FEMA relief operations"
        height="140px"
      />

      <div className="absolute top-3 right-4 z-20">
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-sm text-white/80 hover:text-white"
        >
          Logout
        </button>
      </div>

      <main className="container mx-auto px-4 py-6 hero-backdrop">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-bayou-green">
            Resources ({resources.length})
          </h2>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-bayou-green text-white px-4 py-2 rounded-md hover:bg-bayou-green/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Resource
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading && <p className="text-muted-foreground">Loading...</p>}

        {!loading && resources.length === 0 && (
          <p className="text-muted-foreground">No resources yet.</p>
        )}

        <div className="space-y-3">
          {resources.map((resource, index) => (
            <ScrollFadeIn key={resource.id} delay={index * 50}>
              <div className="bg-white rounded-lg p-4 border border-border flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-bayou-green">{resource.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {resource.parish} • {resource.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(resource)}
                    className="p-2 text-muted-foreground hover:text-bayou-blue"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(resource)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </main>

      <ResourceFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedResource(null)
        }}
        onSubmit={handleFormSubmit}
        resource={selectedResource}
        isLoading={isSaving}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedResource(null)
        }}
        onConfirm={handleDeleteConfirm}
        resourceName={selectedResource?.name}
        isLoading={isSaving}
      />
    </div>
  )
}

export default Admin
