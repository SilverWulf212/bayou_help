import express from 'express'
import cors from 'cors'
import { readFile } from 'fs/promises'
import path from 'path'
import chatRoutes from './routes/chat.js'
import resourcesRoutes from './routes/resources.js'
import adminRoutes from './routes/admin.js'
import { rateLimiter } from './middleware/rateLimit.js'
import { PUBLIC_ROUTES, resourceSeo, routeSeo } from '../../shared/seo.js'
import { getAllResources, getResourceById } from './services/resources.js'

const app = express()
const PORT = process.env.PORT || 3000

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const PROD_ORIGIN = process.env.PUBLIC_ORIGIN || 'https://bayouhelp.org'

// Used for sitemap/canonical generation.
// In dev, when serving HTML from the API server, this should be the server origin.
const PUBLIC_BASE_URL = process.env.PUBLIC_ORIGIN || (
  process.env.NODE_ENV === 'production'
    ? PROD_ORIGIN
    : `http://localhost:${PORT}`
)

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? PROD_ORIGIN
    : CLIENT_ORIGIN
}))
app.use(express.json())

app.use('/api/chat', rateLimiter, chatRoutes)
app.use('/api/resources', resourcesRoutes)
app.use('/api/admin', adminRoutes)

// --- SEO endpoints ---
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${PUBLIC_BASE_URL}/sitemap.xml\n`)
})

app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const staticUrls = PUBLIC_ROUTES
      .filter(r => !r.path.startsWith('/admin'))
      .map((r) => {
        const loc = `${PUBLIC_BASE_URL}${r.path}`
        const priority = typeof r.priority === 'number'
          ? r.priority.toFixed(1)
          : '0.5'

        return [
          '  <url>',
          `    <loc>${escapeXml(loc)}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          `    <priority>${priority}</priority>`,
          '  </url>',
        ].join('\n')
      })

    const resources = await getAllResources({})
    const resourceUrls = resources.map((r) => {
      const loc = `${PUBLIC_BASE_URL}/resources/${r.id}`
      const lastmod = r?.verified || today
      const priority = '0.7'

      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    })

    const urls = [...staticUrls, ...resourceUrls].join('\n')

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      '</urlset>',
      '',
    ].join('\n')

    res.type('application/xml').send(xml)
  } catch (err) {
    next(err)
  }
})

// --- Static + HTML shell ("SSR-like" meta injection) ---
const CLIENT_DIST = path.resolve(process.cwd(), 'client/dist')
let cachedIndexHtml = null

async function getIndexHtml() {
  if (cachedIndexHtml) return cachedIndexHtml
  const p = path.join(CLIENT_DIST, 'index.html')
  cachedIndexHtml = await readFile(p, 'utf-8')
  return cachedIndexHtml
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function injectHead(html, headTags) {
  return html.replace('</head>', `${headTags}\n  </head>`) 
}

function injectRootContent(html, rootHtml) {
  return html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`)
}

function renderCriticalContent(pathname, resource) {
  // Keep this intentionally small: enough for crawlers + prevents CLS via stable first paint.
  const titles = {
    '/': 'Bayou Help',
    '/chat': 'Chat',
    '/resources': 'Resources',
    '/privacy': 'Privacy',
  }

  const h1 = resource?.name || titles[pathname] || 'Bayou Help'

  const details = resource
    ? [
        resource?.phone ? `Call: ${resource.phone}` : null,
        resource?.categoryLabel || resource?.category ? `Service: ${resource.categoryLabel || resource.category}` : null,
        resource?.parish ? `Parish: ${resource.parish}` : null,
      ].filter(Boolean).join(' | ')
    : null

  return [
    '<main style="padding:16px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">',
    `  <h1 style="margin:0 0 8px 0;font-size:22px;line-height:1.2;">${escapeXml(h1)}</h1>`,
    details
      ? `  <p style="margin:0;color:#3f3f46;max-width:72ch;">${escapeXml(details)}</p>`
      : '  <p style="margin:0;color:#3f3f46;max-width:60ch;">Loading…</p>',
    '</main>'
  ].join('')
}

app.use(express.static(CLIENT_DIST, {
  index: false,
  immutable: true,
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) return
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  },
}))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0'
  })
})

// Serve HTML for public SPA routes with per-route SEO tags.
app.get(['/', '/chat', '/resources', '/privacy', '/admin'], async (req, res, next) => {
  try {
    const pathname = req.path
    const seo = routeSeo(pathname)

    // Keep TTFB low: read + cache base HTML once.
    let html = await getIndexHtml()

    const canonical = `${PUBLIC_BASE_URL}${pathname}`
    const headTags = [
      `<title>${escapeXml(seo.title)}</title>`,
      `<meta name="description" content="${escapeXml(seo.description)}">`,
      `<meta name="robots" content="${escapeXml(seo.robots)}">`,
      `<link rel="canonical" href="${escapeXml(canonical)}">`,
    ].join('\n    ')

    html = injectHead(html, `  ${headTags}`)

    // Minimal critical content to make pages crawlable even without JS.
    // React will hydrate/replace once loaded.
    html = injectRootContent(html, renderCriticalContent(pathname, null))

    res.type('text/html').send(html)
  } catch (err) {
    next(err)
  }
})

app.get('/resources/:id', async (req, res, next) => {
  try {
    const resource = await getResourceById(req.params.id)

    let html = await getIndexHtml()

    const seo = resourceSeo(resource)
    const canonical = `${PUBLIC_BASE_URL}${req.originalUrl}`

    const headTags = [
      `<title>${escapeXml(seo.title)}</title>`,
      `<meta name="description" content="${escapeXml(seo.description)}">`,
      `<meta name="robots" content="${escapeXml(seo.robots)}">`,
      `<link rel="canonical" href="${escapeXml(canonical)}">`,
    ].join('\n    ')

    html = injectHead(html, `  ${headTags}`)
    html = injectRootContent(html, renderCriticalContent('/resources', resource))

    res.type('text/html').send(html)
  } catch (err) {
    next(err)
  }
})

// SPA fallback: if a new public route is added client-side, still return index with generic tags.
app.get('*', async (req, res, next) => {
  try {
    let html = await getIndexHtml()
    const seo = routeSeo('/')
    html = injectHead(html, `  <title>${escapeXml(seo.title)}</title>`)
    html = injectRootContent(html, renderCriticalContent('/'))
    res.type('text/html').send(html)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, _next) => {
  console.error('Error:', err.message)
  res.status(500).json({
    error: 'Something went wrong. Please try again or call 211 for help.'
  })
})

app.listen(PORT, () => {
  console.log(`Bayou Help server running on port ${PORT}`)
})
