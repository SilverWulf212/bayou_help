// Semantic caching service with intent-based keys and LRU eviction

const MAX_CACHE_SIZE = 500
const DEFAULT_TTL = 30 * 60 * 1000 // 30 minutes

// Tiered TTLs by query type
const TTL_BY_TYPE = {
  resource: 60 * 60 * 1000,    // 1 hour - resource queries are stable
  general: 30 * 60 * 1000,     // 30 minutes
  resume: 0                     // No caching - personalized
}

// Intent detection patterns
const INTENT_PATTERNS = {
  food: /hungry|food|eat|meal|groceries|pantry|starving|feed|dinner|lunch|breakfast/i,
  shelter: /shelter|place to stay|homeless|sleep|housing|roof|bed|overnight|stay tonight|nowhere to go/i,
  health: /doctor|medical|sick|clinic|health|insurance|prescription|medicine|dentist|dental|teeth|pain|injury|pregnant/i,
  mental: /mental|therapy|counseling|depression|anxiety|stress|sad|hopeless|overwhelmed|someone to talk/i,
  domestic: /abuse|violence|hurt|scared|partner|spouse|hitting|threatening|safe place|escape/i,
  jobs: /job|work|employment|hire|career|training|resume|interview|apply|application|unemployed|income|money/i,
  transport: /ride|bus|transport|car|get there|travel|commute/i,
  documents: /id|license|birth certificate|social security|document|identification|papers|lost id/i
}

// Stop words to filter out
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'you', 'your', 'he', 'she', 'it',
  'they', 'what', 'which', 'who', 'this', 'that', 'these', 'those', 'am', 'is',
  'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
  'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'as',
  'until', 'while', 'the', 'a', 'an', 'please', 'help', 'want', 'looking', 'find'
])

// LRU Cache implementation
class LRUCache {
  constructor(maxSize = MAX_CACHE_SIZE) {
    this.maxSize = maxSize
    this.cache = new Map()
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    }
  }

  get(key) {
    const item = this.cache.get(key)

    if (!item) {
      this.stats.misses++
      return null
    }

    // Check TTL
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      this.stats.misses++
      return null
    }

    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, item)
    this.stats.hits++

    return item.value
  }

  set(key, value, ttl = DEFAULT_TTL) {
    // Skip caching if TTL is 0
    if (ttl === 0) return

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
      this.stats.evictions++
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }

  clear() {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0, evictions: 0 }
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(1) + '%' : '0%'
    }
  }
}

// Detect intent from message
function detectIntent(message) {
  const lower = message.toLowerCase()

  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.test(lower)) {
      return intent
    }
  }

  return 'general'
}

// Generate semantic cache key
function getCacheKey(message) {
  const intent = detectIntent(message)

  // Normalize: lowercase, remove punctuation, filter stop words, sort
  const normalized = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .sort()
    .slice(0, 5) // Keep only top 5 meaningful words
    .join('_')

  return `${intent}:${normalized}`
}

// Get TTL based on query type
function getTTL(message, isResumeMode = false) {
  if (isResumeMode) {
    return TTL_BY_TYPE.resume
  }

  const intent = detectIntent(message)
  // Resource-related intents get longer TTL
  if (['food', 'shelter', 'health', 'jobs', 'transport', 'documents'].includes(intent)) {
    return TTL_BY_TYPE.resource
  }

  return TTL_BY_TYPE.general
}

// Singleton cache instance
const responseCache = new LRUCache()

export {
  responseCache,
  getCacheKey,
  getTTL,
  detectIntent,
  LRUCache
}
