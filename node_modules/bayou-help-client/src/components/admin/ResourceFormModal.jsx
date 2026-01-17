import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const CATEGORIES = [
  { value: 'shelter', label: 'Shelter' },
  { value: 'food', label: 'Food' },
  { value: 'health', label: 'Healthcare' },
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'domestic-violence', label: 'Domestic Violence' },
  { value: 'jobs', label: 'Jobs & Training' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'id-documents', label: 'ID & Documents' },
  { value: 'crisis', label: 'Crisis Line' }
]

const PARISHES = [
  { value: 'lafayette', label: 'Lafayette Parish' },
  { value: 'st-landry', label: 'St. Landry Parish' },
  { value: 'vermilion', label: 'Vermilion Parish' },
  { value: 'iberia', label: 'Iberia Parish' },
  { value: 'acadia', label: 'Acadia Parish' }
]

const EMPTY_FORM = {
  name: '',
  category: '',
  parish: '',
  description: '',
  phone: '',
  address: '',
  hours: '',
  eligibility: '',
  nextStep: ''
}

function ResourceFormModal({ isOpen, onClose, onSubmit, resource, isLoading }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const isEditing = !!resource

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || '',
        category: resource.category || '',
        parish: resource.parish || '',
        description: resource.description || '',
        phone: resource.phone || '',
        address: resource.address || '',
        hours: resource.hours || '',
        eligibility: resource.eligibility || '',
        nextStep: resource.nextStep || ''
      })
    } else {
      setFormData(EMPTY_FORM)
    }
    setErrors({})
  }, [resource, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.parish) newErrors.parish = 'Parish is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const categoryLabel = CATEGORIES.find(c => c.value === formData.category)?.label || formData.category
    onSubmit({ ...formData, categoryLabel })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-bayou-green">
            {isEditing ? 'Edit Resource' : 'Add Resource'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="Resource name"
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Parish <span className="text-destructive">*</span>
              </label>
              <select
                name="parish"
                value={formData.parish}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="">Select parish</option>
                {PARISHES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {errors.parish && <p className="text-sm text-destructive mt-1">{errors.parish}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-input rounded-md resize-none"
              placeholder="Brief description of the resource"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="337-555-1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hours</label>
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Mon-Fri 9am-5pm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="123 Main St, Lafayette, LA 70501"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Eligibility</label>
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-input rounded-md resize-none"
              placeholder="Who can use this resource?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Next Step</label>
            <textarea
              name="nextStep"
              value={formData.nextStep}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-input rounded-md resize-none"
              placeholder="What should someone do first?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-input rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-bayou-green text-white rounded-md hover:bg-bayou-green/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Add Resource')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResourceFormModal
