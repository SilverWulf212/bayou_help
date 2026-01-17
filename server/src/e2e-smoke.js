const BASE_URL = process.env.BASE_URL || 'http://localhost:3001'

async function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function jsonRequest(path, init) {
  const response = await fetch(`${BASE_URL}${path}`, init)
  const contentType = response.headers.get('content-type') || ''
  let body
  if (contentType.includes('application/json')) {
    body = await response.json()
  } else {
    body = await response.text()
  }
  return { response, body }
}

async function run() {
  console.log(`E2E smoke against ${BASE_URL}`)

  {
    const { response, body } = await jsonRequest('/api/health')
    await assert(response.ok, `/api/health failed: ${response.status}`)
    await assert(body && body.status === 'ok', 'health payload missing status=ok')
  }

  {
    const { response, body } = await jsonRequest('/api/resources')
    await assert(response.ok, `/api/resources failed: ${response.status}`)
    await assert(Array.isArray(body), '/api/resources expected array')
    await assert(body.length > 0, '/api/resources returned empty array')
  }

  {
    const { response, body } = await jsonRequest('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'I need food', history: [] })
    })

    await assert(response.ok, `/api/chat failed: ${response.status}`)
    await assert(typeof body?.content === 'string' && body.content.length > 0, '/api/chat missing content')
    await assert(Array.isArray(body?.resources), '/api/chat missing resources array')
  }

  {
    const { response } = await jsonRequest('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong' })
    })

    await assert(response.status === 500 || response.status === 401, 'admin login should be 500 (not configured) or 401')
  }

  console.log('E2E smoke passed')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
