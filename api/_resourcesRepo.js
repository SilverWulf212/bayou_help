import { sql } from '@vercel/postgres'

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
}

export async function getResourceById(id) {
  const result = await sql`select * from resources where id = ${id} limit 1`
  const row = result.rows[0]
  return row ? rowToResource(row) : null
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export async function createResource(resource) {
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

  if (matched.length === 0) {
    const result = await sql`select * from resources order by verified desc nulls last, name asc limit 5`
    return result.rows.map(rowToResource)
  }

  const placeholders = matched.map((_, i) => `$${i + 1}`).join(', ')
  const query = `select * from resources where category in (${placeholders}) order by name asc limit 5`
  const result = await sql.query(query, matched)
  return result.rows.map(rowToResource)
}
