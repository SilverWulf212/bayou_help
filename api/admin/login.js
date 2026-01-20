import { readJson, requireMethod, sendJson } from '../_http.js'
import { issueAdminToken } from '../_auth.js'

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return

  try {
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      sendJson(res, 503, { error: 'Admin not configured' })
      return
    }

    const body = await readJson(req)
    const password = body?.password
    if (typeof password !== 'string' || !password) {
      sendJson(res, 400, { error: 'Password is required' })
      return
    }

    if (password !== adminPassword) {
      sendJson(res, 401, { error: 'Invalid password' })
      return
    }

    const token = await issueAdminToken()
    sendJson(res, 200, { token })
  } catch (err) {
    const status = err?.statusCode || 500
    sendJson(res, status, { error: err?.message || 'Something went wrong' })
  }
}
