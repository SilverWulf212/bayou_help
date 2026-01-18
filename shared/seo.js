function envOr(defaultValue, key) {
  try {
    // eslint-disable-next-line no-undef
    return typeof process !== 'undefined' && process?.env?.[key]
      ? process.env[key]
      : defaultValue
  } catch {
    return defaultValue
  }
}

export const SITE_NAME = envOr('Bayou Help', 'SITE_NAME')

// Primary public phone number shown in SEO titles.
// For a real site, you might make this per-parish or per-service.
export const PRIMARY_PHONE = envOr('211', 'SITE_PHONE')

// This is the "primary trending service" slot in the title format.
// Keep this short and stable (SEO + SERP truncation).
export const PRIMARY_TRENDING_SERVICE = envOr('Shelter', 'SITE_TRENDING_SERVICE')

export const PUBLIC_ROUTES = [
  { path: '/', serviceOffered: 'Community Resources', priority: 1.0 },
  { path: '/chat', serviceOffered: 'Chat Support', priority: 0.9 },
  { path: '/resources', serviceOffered: 'Browse Resources', priority: 0.9 },
  { path: '/privacy', serviceOffered: 'Privacy & Safety', priority: 0.5 },
]

export function buildTitle({ serviceOffered }) {
  const safeService = serviceOffered || 'Help'
  return `${SITE_NAME} | ${PRIMARY_PHONE} | ${safeService} | ${PRIMARY_TRENDING_SERVICE}`
}

export function routeSeo(pathname) {
  const route = PUBLIC_ROUTES.find(r => r.path === pathname)

  const serviceOffered = route?.serviceOffered || 'Help'

  const descriptionByPath = {
    '/': 'Find shelter, food, healthcare, and other help in Acadiana. Phone numbers included. If you need urgent help, call 211.',
    '/chat': 'Chat to find local resources for shelter, food, healthcare, work, and safety in Acadiana. For immediate help, call 211.',
    '/resources': 'Browse local resources in Acadiana by parish and category. Phone numbers and next steps included.',
    '/privacy': 'Learn how Bayou Help protects your privacy and safety, including quick-exit and browsing tips.',
  }

  return {
    title: buildTitle({ serviceOffered }),
    description: descriptionByPath[pathname] || descriptionByPath['/'],
    robots: pathname === '/admin' ? 'noindex, nofollow' : 'index, follow',
  }
}

export function resourceSeo(resource) {
  const phone = resource?.phone || PRIMARY_PHONE
  const category = resource?.categoryLabel || resource?.category || 'Resource'
  const serviceOffered = resource?.name || 'Resource'

  return {
    title: `${SITE_NAME} | ${phone} | ${serviceOffered} | ${PRIMARY_TRENDING_SERVICE}`,
    description: resource?.description
      ? `${serviceOffered}: ${resource.description} Call ${phone}.`
      : `Local resource: ${serviceOffered}. Call ${phone}.`,
    robots: 'index, follow',
  }
}
