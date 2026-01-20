import { requireAdmin } from '../../_auth.js'
import { readJson, requireMethod, sendJson } from '../../_http.js'
import { createResource } from '../../_resourcesRepo.js'

function normalizeInput(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const category = typeof body?.category === 'string' ? body.category : ''
  const categoryLabel = typeof body?.categoryLabel === 'string' && body.categoryLabel
    ? body.categoryLabel
    : category
  const parish = typeof body?.parish === 'string' ? body.parish : ''

  return {
    name,
    category,
    categoryLabel,
    parish,
    description: typeof body?.description === 'string' ? body.description : '',
    phone: typeof body?.phone === 'string' ? body.phone : '',
    address: typeof body?.address === 'string' ? body.address : '',
    hours: typeof body?.hours === 'string' ? body.hours : '',
    eligibility: typeof body?.eligibility === 'string' ? body.eligibility : '',
    nextStep: typeof body?.nextStep === 'string' ? body.nextStep : '',
  }
}

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return

  const admin = await requireAdmin(req, res)
  if (!admin) return

  try {
    const body = await readJson(req)
    const input = normalizeInput(body)

    if (!input.name || !input.category || !input.parish) {
      sendJson(res, 400, { error: 'Name, category, and parish are required' })
      return
    }

    const id = `resource-${crypto.randomUUID()}`
    const created = await createResource({ id, ...input })
    sendJson(res, 201, created)
  } catch (err) {
    console.error(err)
    const status = err?.statusCode || 500
    sendJson(res, status, { error: err?.message || 'Something went wrong' })
  }
}
