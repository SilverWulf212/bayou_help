import { getAllResources } from '../_resourcesRepo.js'
import { getQueryParam, requireMethod, sendJson } from '../_http.js'

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return

  try {
    const parish = getQueryParam(req, 'parish')
    const category = getQueryParam(req, 'category')
    const resources = await getAllResources({
      parish: parish || undefined,
      category: category || undefined,
    })
    sendJson(res, 200, resources)
  } catch (err) {
    console.error(err)
    sendJson(res, 500, { error: 'Something went wrong. Please try again.' })
  }
}
