import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RESOURCES_PATH = join(__dirname, '../data/resources.json')

let resourcesCache = null

async function loadResources() {
  if (resourcesCache) return resourcesCache

  try {
    const data = await readFile(RESOURCES_PATH, 'utf-8')
    resourcesCache = JSON.parse(data)
    return resourcesCache
  } catch (error) {
    console.error('Failed to load resources:', error.message)
    return []
  }
}

async function saveResources(resources) {
  await writeFile(RESOURCES_PATH, JSON.stringify(resources, null, 2), 'utf-8')
  resourcesCache = resources
}

export async function getAllResources({ parish, category } = {}) {
  const resources = await loadResources()

  return resources.filter(r => {
    if (parish && r.parish !== parish) return false
    if (category && r.category !== category) return false
    return true
  })
}

export async function getResourceById(id) {
  const resources = await loadResources()
  return resources.find(r => r.id === id)
}

export async function findRelevantResources(query) {
  const resources = await loadResources()
  const queryLower = query.toLowerCase()

  const keywords = {
    shelter: ['shelter', 'place to stay', 'homeless', 'sleep', 'housing', 'roof'],
    food: ['food', 'hungry', 'eat', 'meal', 'pantry', 'groceries'],
    health: ['doctor', 'medical', 'sick', 'clinic', 'health', 'insurance', 'prescription'],
    'mental-health': ['mental', 'therapy', 'counseling', 'depression', 'anxiety', 'stress'],
    'domestic-violence': ['abuse', 'violence', 'hurt', 'scared', 'partner', 'spouse'],
    jobs: ['job', 'work', 'employment', 'hire', 'career', 'training'],
    transportation: ['ride', 'bus', 'transport', 'car', 'get there'],
    'id-documents': ['id', 'license', 'birth certificate', 'social security', 'document'],
  }

  const matchedCategories = new Set()

  for (const [category, terms] of Object.entries(keywords)) {
    if (terms.some(term => queryLower.includes(term))) {
      matchedCategories.add(category)
    }
  }

  if (matchedCategories.size === 0) {
    return resources.slice(0, 5)
  }

  return resources
    .filter(r => matchedCategories.has(r.category))
    .slice(0, 5)
}

export async function createResource(resourceData) {
  const resources = await loadResources()

  const newId = `resource-${Date.now()}`
  const newResource = {
    id: newId,
    ...resourceData,
    verified: new Date().toISOString().split('T')[0]
  }

  resources.push(newResource)
  await saveResources(resources)

  return newResource
}

export async function updateResource(id, updates) {
  const resources = await loadResources()
  const index = resources.findIndex(r => r.id === id)

  if (index === -1) {
    return null
  }

  resources[index] = {
    ...resources[index],
    ...updates,
    id,
    verified: new Date().toISOString().split('T')[0]
  }

  await saveResources(resources)
  return resources[index]
}

export async function deleteResource(id) {
  const resources = await loadResources()
  const index = resources.findIndex(r => r.id === id)

  if (index === -1) {
    return false
  }

  resources.splice(index, 1)
  await saveResources(resources)
  return true
}

export function clearCache() {
  resourcesCache = null
}
