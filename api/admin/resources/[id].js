import { requireAdmin } from '../../_auth.js'
import { readJson, sendJson } from '../../_http.js'
import { deleteResource, getResourceById, updateResource } from '../../_resourcesRepo.js'

function getIdFromReq(req) {
  if (req.query?.id) return String(req.query.id)
  const url = new URL(req.url, 'http://localhost')
  const parts = url.pathname.split('/').filter(Boolean)
  return parts[parts.length - 1] || ''
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res)
  if (!admin) return

  const id = getIdFromReq(req)
  if (!id) {
    sendJson(res, 400, { error: 'Missing id' })
    return
  }

  try {
    if (req.method === 'PUT') {
      const existing = await getResourceById(id)
      if (!existing) {
        sendJson(res, 404, { error: 'Resource not found' })
        return
      }

      const body = await readJson(req)
      const updated = await updateResource(id, body || {})
      sendJson(res, 200, updated)
      return
    }

    if (req.method === 'DELETE') {
      const existing = await getResourceById(id)
      if (!existing) {
        sendJson(res, 404, { error: 'Resource not found' })
        return
      }

      const ok = await deleteResource(id)
      sendJson(res, 200, { success: ok })
      return
    }

    res.setHeader('Allow', 'PUT, DELETE')
    sendJson(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    const status = err?.statusCode || 500
    sendJson(res, status, { error: err?.message || 'Something went wrong' })
  }
}
