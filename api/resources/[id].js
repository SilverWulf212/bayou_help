import { getResourceById } from '../_resourcesRepo.js'
import { requireMethod, sendJson } from '../_http.js'

function getIdFromReq(req) {
  if (req.query?.id) return String(req.query.id)
  const url = new URL(req.url, 'http://localhost')
  const parts = url.pathname.split('/').filter(Boolean)
  return parts[parts.length - 1] || ''
}

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return

  try {
    const id = getIdFromReq(req)
    if (!id) {
      sendJson(res, 400, { error: 'Missing id' })
      return
    }

    const resource = await getResourceById(id)
    if (!resource) {
      sendJson(res, 404, { error: 'Resource not found' })
      return
    }

    sendJson(res, 200, resource)
  } catch (err) {
    console.error(err)
    sendJson(res, 500, { error: 'Something went wrong. Please try again.' })
  }
}
