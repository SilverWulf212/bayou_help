import { sql } from '@vercel/postgres'

let initPromise = null

function isPostgresConfigured() {
  return Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL
  )
}

async function ensureResourcesSchema() {
  // Matches scripts/db/schema.sql
  await sql`
    create table if not exists resources (
      id text primary key,
      name text not null,
      category text not null,
      category_label text not null,
      parish text not null,
      description text not null default '',
      phone text not null default '',
      address text not null default '',
      hours text not null default '',
      eligibility text not null default '',
      next_step text not null default '',
      verified date,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `

  await sql`create index if not exists resources_parish_idx on resources (parish);`
  await sql`create index if not exists resources_category_idx on resources (category);`
}

async function seedResourcesIfEmpty(seedResources) {
  if (!Array.isArray(seedResources) || seedResources.length === 0) return

  const result = await sql`select count(*)::int as count from resources`
  const count = Number(result?.rows?.[0]?.count ?? 0)
  if (count > 0) return

  // Seed baseline dataset without overwriting admin edits.
  for (const r of seedResources) {
    if (!r?.id) continue
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
        ${r.name || ''},
        ${r.category || ''},
        ${r.categoryLabel || ''},
        ${r.parish || ''},
        ${r.description || ''},
        ${r.phone || ''},
        ${r.address || ''},
        ${r.hours || ''},
        ${r.eligibility || ''},
        ${r.nextStep || ''},
        ${r.verified || null}
      )
      on conflict (id) do nothing
    `
  }
}

export async function ensureResourcesDbReady({ seedResources } = {}) {
  if (!isPostgresConfigured()) return false

  if (!initPromise) {
    initPromise = (async () => {
      await ensureResourcesSchema()
      await seedResourcesIfEmpty(seedResources)
    })()
  }

  await initPromise
  return true
}
