export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export async function readJson(req, { maxBytes = 100_000 } = {}) {
  const contentType = String(req.headers['content-type'] || '')
  if (!contentType.toLowerCase().includes('application/json')) {
    const err = new Error('Expected application/json')
    err.statusCode = 415
    throw err
  }

  let total = 0
  const chunks = []
  for await (const chunk of req) {
    total += chunk.length
    if (total > maxBytes) {
      const err = new Error('Payload too large')
      err.statusCode = 413
      throw err
    }
    chunks.push(chunk)
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    const err = new Error('Invalid JSON')
    err.statusCode = 400
    throw err
  }
}

export function requireMethod(req, res, method) {
  if (req.method !== method) {
    res.setHeader('Allow', method)
    sendJson(res, 405, { error: 'Method not allowed' })
    return false
  }
  return true
}

export function getQueryParam(req, key) {
  const url = new URL(req.url, 'http://localhost')
  const value = url.searchParams.get(key)
  return value ?? ''
}
