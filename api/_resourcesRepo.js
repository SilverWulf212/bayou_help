import { sql } from '@vercel/postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { RESOURCES_FALLBACK } from './_resourcesFallbackData.mjs'
import { ensureResourcesDbReady } from './_dbInit.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const RESOURCES_JSON_PATH = path.join(repoRoot, 'server', 'src', 'data', 'resources.json')
const RESOURCES_MD_PATH = path.join(repoRoot, 'acadiana_resources.md')

let fileResourcesCache = null
let fileResourcesCacheSource = null

function normalizeText(value) {
  if (value === null || value === undefined) return ''
  return typeof value === 'string' ? value.trim() : String(value)
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function loadResourcesFromJsonFile() {
  const raw = await fs.readFile(RESOURCES_JSON_PATH, 'utf-8')
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('resources.json is not an array')
  return parsed
}

function parseResourcesFromMarkdown(markdown) {
  const lines = String(markdown || '').split(/\r?\n/)

  let currentParish = ''
  const resources = []

  function nextNonEmptyLineIndex(fromIndex) {
    for (let i = fromIndex; i < lines.length; i++) {
      if (lines[i].trim()) return i
    }
    return -1
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    const parishMatch = /^##\s+(.+?)\s+Parish\s*$/.exec(line)
    if (parishMatch) {
      currentParish = parishMatch[1].trim()
      continue
    }

    const headingMatch = /^###\s+(.+)$/.exec(line)
    if (!headingMatch) continue

    const heading = headingMatch[1].trim()
    const nextIdx = nextNonEmptyLineIndex(i + 1)
    if (nextIdx === -1) continue
    const nextLine = lines[nextIdx].trim()

    // A resource block is identified by the bullet list starting with "- Category:".
    if (!nextLine.startsWith('- Category:')) {
      continue
    }

    const fields = {
      name: heading,
      parish: currentParish,
    }

    // Consume bullet lines until we hit a new heading or parish header.
    for (let j = nextIdx; j < lines.length; j++) {
      const t = lines[j].trim()
      if (!t) continue
      if (t.startsWith('## ') || t.startsWith('### ')) {
        i = j - 1
        break
      }

      const bulletMatch = /^-\s+([^:]+):\s*(.*)$/.exec(t)
      if (!bulletMatch) continue
      const key = bulletMatch[1].trim().toLowerCase()
      const value = bulletMatch[2].trim()

      if (key === 'category') fields.categoryLabel = value
      else if (key === 'parish') fields.parish = value
      else if (key === 'phone') fields.phone = value
      else if (key === 'address') fields.address = value
      else if (key === 'hours') fields.hours = value
      else if (key === 'description') fields.description = value
      else if (key === 'eligibility') fields.eligibility = value
      else if (key === 'next step') fields.nextStep = value
      else if (key === 'verified in app') fields.verified = value
    }

    const categoryLabel = normalizeText(fields.categoryLabel)
    const category = categoryLabel
      ? slugify(categoryLabel)
      : ''

    const parish = normalizeText(fields.parish)
    const idBase = slugify(fields.name)
    const id = parish ? `${idBase}-${slugify(parish)}` : idBase

    resources.push({
      id,
      name: fields.name,
      category: category || 'other',
      categoryLabel: categoryLabel || 'Other',
      parish: slugify(parish) || parish.toLowerCase(),
      description: fields.description || '',
      phone: fields.phone || '',
      address: fields.address || '',
      hours: fields.hours || '',
      eligibility: fields.eligibility || '',
      nextStep: fields.nextStep || '',
      verified: fields.verified || null,
    })
  }

  return resources
}

async function loadResourcesFromMarkdownFile() {
  const raw = await fs.readFile(RESOURCES_MD_PATH, 'utf-8')
  const parsed = parseResourcesFromMarkdown(raw)
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('acadiana_resources.md yielded no resources')
  }
  return parsed
}

async function getFileBackedResources() {
  if (fileResourcesCache) return fileResourcesCache

  try {
    fileResourcesCache = await loadResourcesFromJsonFile()
    fileResourcesCacheSource = 'server/src/data/resources.json'
    return fileResourcesCache
  } catch (err) {
    console.warn('JSON resource fallback failed:', err?.message || err)
  }

  try {
    fileResourcesCache = await loadResourcesFromMarkdownFile()
    fileResourcesCacheSource = 'acadiana_resources.md'
    return fileResourcesCache
  } catch (err) {
    console.warn('Markdown resource fallback failed:', err?.message || err)
  }

  fileResourcesCache = await getGuaranteedFallbackResources()
  fileResourcesCacheSource = 'api/_resourcesFallbackData.mjs'
  return fileResourcesCache
}

async function getGuaranteedFallbackResources() {
  // Always available because it is bundled as a module dependency.
  if (Array.isArray(RESOURCES_FALLBACK) && RESOURCES_FALLBACK.length > 0) {
    return RESOURCES_FALLBACK
  }

  return []
}

function isPostgresConfigured() {
  return Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL
  )
}

async function tryPostgresQuery(queryFn) {
  if (!isPostgresConfigured()) return null
  try {
    await ensureResourcesDbReady({ seedResources: RESOURCES_FALLBACK })
    return await queryFn()
  } catch (err) {
    console.warn('Postgres query failed; falling back to file resources:', err?.message || err)
    return null
  }
}

function formatVerifiedDate(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  // Postgres date comes back as Date in node-postgres.
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

export function rowToResource(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label,
    parish: row.parish,
    description: row.description,
    phone: row.phone,
    address: row.address,
    hours: row.hours,
    eligibility: row.eligibility,
    nextStep: row.next_step,
    verified: formatVerifiedDate(row.verified),
  }
}

export async function getAllResources({ parish, category } = {}) {
  const pg = await tryPostgresQuery(async () => {
    const where = []
    const values = []

    if (parish) {
      values.push(parish)
      where.push(`parish = $${values.length}`)
    }

    if (category) {
      values.push(category)
      where.push(`category = $${values.length}`)
    }

    const whereSql = where.length ? `where ${where.join(' and ')}` : ''
    const query = `select * from resources ${whereSql} order by name asc`
    const result = await sql.query(query, values)
    return result.rows.map(rowToResource)
  })

  if (pg) return pg

  const resources = await getFileBackedResources()
  const parishNorm = parish ? normalizeText(parish).toLowerCase() : ''
  const categoryNorm = category ? normalizeText(category).toLowerCase() : ''

  return resources
    .filter((r) => {
      if (parishNorm && normalizeText(r.parish).toLowerCase() !== parishNorm) return false
      if (categoryNorm && normalizeText(r.category).toLowerCase() !== categoryNorm) return false
      return true
    })
    .sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)))
}

export async function getResourceById(id) {
  const pg = await tryPostgresQuery(async () => {
    const result = await sql`select * from resources where id = ${id} limit 1`
    const row = result.rows[0]
    return row ? rowToResource(row) : null
  })

  if (pg !== null) return pg

  const resources = await getFileBackedResources()
  return resources.find((r) => r.id === id) || null
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export async function createResource(resource) {
  if (!isPostgresConfigured()) {
    const err = new Error('Resource database not configured')
    err.statusCode = 503
    err.details = { fallbackSource: fileResourcesCacheSource }
    throw err
  }

  await ensureResourcesDbReady({ seedResources: RESOURCES_FALLBACK })

  const verified = todayIso()
  const id = resource.id

  const result = await sql`
    insert into resources (
      id,
      name,
      category,
      category_label,
      parish,
      description,
      phone,
      address,
      hours,
      eligibility,
      next_step,
      verified
    ) values (
      ${id},
      ${resource.name},
      ${resource.category},
      ${resource.categoryLabel},
      ${resource.parish},
      ${resource.description || ''},
      ${resource.phone || ''},
      ${resource.address || ''},
      ${resource.hours || ''},
      ${resource.eligibility || ''},
      ${resource.nextStep || ''},
      ${verified}
    )
    returning *
  `

  return rowToResource(result.rows[0])
}

export async function updateResource(id, updates) {
  if (!isPostgresConfigured()) {
    const err = new Error('Resource database not configured')
    err.statusCode = 503
    err.details = { fallbackSource: fileResourcesCacheSource }
    throw err
  }

  await ensureResourcesDbReady({ seedResources: RESOURCES_FALLBACK })

  const allowed = {
    name: 'name',
    category: 'category',
    categoryLabel: 'category_label',
    parish: 'parish',
    description: 'description',
    phone: 'phone',
    address: 'address',
    hours: 'hours',
    eligibility: 'eligibility',
    nextStep: 'next_step',
  }

  const set = []
  const values = []

  for (const [key, column] of Object.entries(allowed)) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      values.push(updates[key] ?? '')
      set.push(`${column} = $${values.length}`)
    }
  }

  values.push(todayIso())
  set.push(`verified = $${values.length}`)

  set.push('updated_at = now()')

  if (set.length === 0) {
    return getResourceById(id)
  }

  values.push(id)
  const query = `update resources set ${set.join(', ')} where id = $${values.length} returning *`
  const result = await sql.query(query, values)
  const row = result.rows[0]
  return row ? rowToResource(row) : null
}

export async function deleteResource(id) {
  if (!isPostgresConfigured()) {
    const err = new Error('Resource database not configured')
    err.statusCode = 503
    err.details = { fallbackSource: fileResourcesCacheSource }
    throw err
  }

  await ensureResourcesDbReady({ seedResources: RESOURCES_FALLBACK })

  const result = await sql`delete from resources where id = ${id}`
  return result.rowCount > 0
}

export async function findRelevantResources(queryText) {
  const queryLower = String(queryText || '').toLowerCase()

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

  const matched = []
  for (const [category, terms] of Object.entries(keywords)) {
    if (terms.some((t) => queryLower.includes(t))) {
      matched.push(category)
    }
  }

  const pg = await tryPostgresQuery(async () => {
    if (matched.length === 0) {
      const result = await sql`select * from resources order by verified desc nulls last, name asc limit 5`
      return result.rows.map(rowToResource)
    }

    const placeholders = matched.map((_, i) => `$${i + 1}`).join(', ')
    const query = `select * from resources where category in (${placeholders}) order by name asc limit 5`
    const result = await sql.query(query, matched)
    return result.rows.map(rowToResource)
  })

  if (pg) return pg

  const resources = await getFileBackedResources()
  if (matched.length === 0) {
    return [...resources]
      .sort((a, b) => {
        const av = normalizeText(b.verified)
        const bv = normalizeText(a.verified)
        if (av && bv) return av.localeCompare(bv)
        if (av) return -1
        if (bv) return 1
        return normalizeText(a.name).localeCompare(normalizeText(b.name))
      })
      .slice(0, 5)
  }

  const matchedSet = new Set(matched.map((c) => c.toLowerCase()))
  return resources
    .filter((r) => matchedSet.has(normalizeText(r.category).toLowerCase()))
    .sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)))
    .slice(0, 5)
}
