import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { sql } from '@vercel/postgres'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function normalizeResource(input) {
  return {
    id: String(input.id),
    name: String(input.name || ''),
    category: String(input.category || ''),
    categoryLabel: String(input.categoryLabel || input.category_label || input.category || ''),
    parish: String(input.parish || ''),
    description: String(input.description || ''),
    phone: String(input.phone || ''),
    address: String(input.address || ''),
    hours: String(input.hours || ''),
    eligibility: String(input.eligibility || ''),
    nextStep: String(input.nextStep || input.next_step || ''),
    verified: String(input.verified || todayIso()),
  }
}

async function run() {
  const resourcesPath = path.resolve('server/src/data/resources.json')
  const raw = await readFile(resourcesPath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('resources.json must be an array')
  }

  const resources = parsed.map(normalizeResource)

  console.log(`Seeding ${resources.length} resources...`)

  for (const r of resources) {
    if (!r.id || !r.name || !r.category || !r.parish) {
      throw new Error(`Invalid resource: ${JSON.stringify(r)}`)
    }

    await sql`
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
        ${r.id},
        ${r.name},
        ${r.category},
        ${r.categoryLabel},
        ${r.parish},
        ${r.description},
        ${r.phone},
        ${r.address},
        ${r.hours},
        ${r.eligibility},
        ${r.nextStep},
        ${r.verified}
      )
      on conflict (id) do update set
        name = excluded.name,
        category = excluded.category,
        category_label = excluded.category_label,
        parish = excluded.parish,
        description = excluded.description,
        phone = excluded.phone,
        address = excluded.address,
        hours = excluded.hours,
        eligibility = excluded.eligibility,
        next_step = excluded.next_step,
        verified = excluded.verified,
        updated_at = now()
    `
  }

  console.log('Seed complete')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
