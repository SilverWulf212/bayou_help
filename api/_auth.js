import { jwtVerify, SignJWT } from 'jose'
import { sendJson } from './_http.js'

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) {
    const err = new Error('Admin auth not configured')
    err.statusCode = 503
    throw err
  }
  return new TextEncoder().encode(secret)
}

export async function issueAdminToken() {
  const secret = getSecret()
  return new SignJWT({ scope: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function requireAdmin(req, res) {
  try {
    const auth = String(req.headers.authorization || '')
    if (!auth.startsWith('Bearer ')) {
      sendJson(res, 401, { error: 'Unauthorized' })
      return null
    }

    const token = auth.slice('Bearer '.length)
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)

    if (payload?.scope !== 'admin') {
      sendJson(res, 401, { error: 'Unauthorized' })
      return null
    }

    return payload
  } catch {
    sendJson(res, 401, { error: 'Unauthorized' })
    return null
  }
}
