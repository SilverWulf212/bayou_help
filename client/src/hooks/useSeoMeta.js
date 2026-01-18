import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { routeSeo } from '../../../shared/seo.js'

function upsertMeta(name, content) {
  const selector = `meta[name="${name}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  const selector = `link[rel="${rel}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeoMeta() {
  const location = useLocation()

  useEffect(() => {
    const seo = routeSeo(location.pathname)
    document.title = seo.title
    upsertMeta('description', seo.description)
    upsertMeta('robots', seo.robots)
    upsertLink('canonical', window.location.href)
  }, [location.pathname])
}
