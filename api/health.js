import { sendJson, requireMethod } from './_http.js'

export default function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return
  sendJson(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  })
}
