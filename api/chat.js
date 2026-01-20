import { SYSTEM_PROMPT } from '../shared/prompts.js'
import { readJson, requireMethod, sendJson } from './_http.js'
import { findRelevantResources } from './_resourcesRepo.js'

export const config = {
  maxDuration: 30,
}

const SAFETY_PATTERNS = [
  { pattern: /\b(suicid|kill myself|end my life|want to die)\b/i, type: 'crisis' },
  { pattern: /\b(domestic violence|abused|hitting me|beat me)\b/i, type: 'dv' },
  { pattern: /\b(traffick|sold me|forced to work)\b/i, type: 'trafficking' },
  { pattern: /\b(emergency|dying|bleeding|heart attack|stroke)\b/i, type: 'emergency' },
]

function checkSafetyEscalation(message) {
  for (const { pattern, type } of SAFETY_PATTERNS) {
    if (pattern.test(message)) return type
  }
  return null
}

const FALLBACK_RESPONSES = {
  shelter: 'Here are places that can help you find a place to stay. These shelters are in Acadiana and can help you today.',
  food: 'Here are places where you can get food. Many of these serve free meals or give out groceries.',
  health: 'Here are health clinics that can help you. Many offer low-cost or free care.',
  'mental-health': "Here are places that can help with mental health support. You don't have to go through this alone.",
  'domestic-violence': 'Here are safe places that can help. They keep your information private and can help you make a safety plan.',
  jobs: 'Here are places that can help you find a job. They can also help with training and resume writing.',
  transportation: 'Here is info about getting around in Acadiana. There are buses and other options that might help.',
  'id-documents': 'Here is where you can get ID and important papers. Having these documents can help you get other services.',
  default: 'I found some resources that might help you. Take a look at these options in Acadiana.',
}

function generateFallbackResponse(userMessage, resources) {
  const messageLower = String(userMessage || '').toLowerCase()

  let responseType = 'default'
  if (/hungry|food|eat|meal|groceries|pantry/.test(messageLower)) responseType = 'food'
  else if (/shelter|sleep|stay|homeless|housing|roof|place to stay/.test(messageLower)) responseType = 'shelter'
  else if (/doctor|medical|sick|clinic|health|prescription|insurance/.test(messageLower)) responseType = 'health'
  else if (/mental|therapy|counseling|depression|anxiety|stress|sad/.test(messageLower)) responseType = 'mental-health'
  else if (/abuse|violence|hurt|scared|partner|hitting/.test(messageLower)) responseType = 'domestic-violence'
  else if (/job|work|employment|hire|career|training/.test(messageLower)) responseType = 'jobs'
  else if (/ride|bus|transport|car|get there/.test(messageLower)) responseType = 'transportation'
  else if (/id|license|birth certificate|social security|document/.test(messageLower)) responseType = 'id-documents'

  const content = FALLBACK_RESPONSES[responseType]
  const citations = resources.slice(0, 3).map((r) => r.name)
  return {
    content,
    resources: resources.slice(0, 3),
    citations,
  }
}

async function generateResponse(userMessage, history, resources) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  if (!OPENAI_API_KEY) {
    return generateFallbackResponse(userMessage, resources)
  }

  const resourceContext = resources.length
    ? `\n\nRelevant local resources:\n${resources
        .map((r) => `- ${r.name}: ${r.description || ''} Phone: ${r.phone || 'N/A'}`)
        .join('\n')}`
    : ''

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + resourceContext },
    ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25_000)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const citations = resources.length ? resources.slice(0, 3).map((r) => r.name) : []

    return {
      content:
        data?.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again or call 211.",
      resources: resources.slice(0, 3),
      citations,
    }
  } catch (err) {
    console.error('LLM Error:', err?.message || err)
    return generateFallbackResponse(userMessage, resources)
  } finally {
    clearTimeout(timeout)
  }
}

const MAX_MESSAGE_LENGTH = 10_000
const MAX_HISTORY_ENTRIES = 50

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return

  try {
    const body = await readJson(req)
    const message = body?.message
    const history = body?.history || []

    if (!message || typeof message !== 'string') {
      sendJson(res, 400, { error: 'Message is required' })
      return
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      sendJson(res, 400, { error: 'Message too long' })
      return
    }

    if (!Array.isArray(history) || history.length > MAX_HISTORY_ENTRIES) {
      sendJson(res, 400, { error: 'Invalid history' })
      return
    }

    // Minimal validation: only accept { role, content } history objects.
    const sanitizedHistory = history
      .filter((m) => m && typeof m === 'object')
      .map((m) => ({
        role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
        content: typeof m.content === 'string' ? m.content : '',
      }))
      .filter((m) => m.content)

    const safetyType = checkSafetyEscalation(message)
    if (safetyType) {
      const escalationResponses = {
        crisis: {
          content:
            "I hear you, and I'm glad you reached out. Please call 988 right now - it's the Suicide & Crisis Lifeline. Someone is there 24/7 to talk with you. You don't have to face this alone.",
          resources: [
            {
              id: 'crisis-988',
              name: 'Suicide & Crisis Lifeline',
              phone: '988',
              category: 'crisis',
              categoryLabel: 'Crisis',
              parish: 'lafayette',
              description: 'Free, confidential support 24/7',
              address: '',
              hours: '24/7',
              eligibility: '',
              nextStep: 'Call 988 now.',
              verified: null,
            },
          ],
        },
        dv: {
          content:
            'Your safety matters. Faith House helps people in Acadiana who are experiencing domestic violence. They can talk with you confidentially about your options. Call them at 337-232-8954.',
          resources: [
            {
              id: 'faith-house',
              name: 'Faith House',
              phone: '337-232-8954',
              category: 'domestic-violence',
              categoryLabel: 'Domestic Violence',
              parish: 'lafayette',
              description: 'Emergency shelter and support for domestic violence survivors',
              address: 'Confidential',
              hours: '24/7',
              eligibility: '',
              nextStep: 'Call the crisis line.',
              verified: null,
            },
          ],
        },
        trafficking: {
          content:
            'Help is available. Call the National Human Trafficking Hotline at 1-888-373-7888. They can help you safely, 24/7, in many languages.',
          resources: [
            {
              id: 'trafficking-hotline',
              name: 'National Human Trafficking Hotline',
              phone: '1-888-373-7888',
              category: 'crisis',
              categoryLabel: 'Crisis',
              parish: 'lafayette',
              description: '24/7 confidential support',
              address: '',
              hours: '24/7',
              eligibility: '',
              nextStep: 'Call 1-888-373-7888 now.',
              verified: null,
            },
          ],
        },
        emergency: {
          content: 'If this is a medical emergency, please call 911 right away. They can send help to you immediately.',
          resources: [
            {
              id: 'emergency-911',
              name: 'Emergency Services',
              phone: '911',
              category: 'crisis',
              categoryLabel: 'Crisis',
              parish: 'lafayette',
              description: 'Police, fire, and medical emergencies',
              address: '',
              hours: '24/7',
              eligibility: '',
              nextStep: 'Call 911 now.',
              verified: null,
            },
          ],
        },
      }

      sendJson(res, 200, {
        ...escalationResponses[safetyType],
        citations: [],
      })
      return
    }

    const relevantResources = await findRelevantResources(message)
    const response = await generateResponse(message, sanitizedHistory, relevantResources)

    sendJson(res, 200, {
      content: response.content,
      resources: response.resources || relevantResources.slice(0, 3),
      citations: response.citations || [],
    })
  } catch (err) {
    const status = err?.statusCode || 500
    console.error(err)
    sendJson(res, status, {
      error: 'Something went wrong. Please try again or call 211 for help.',
    })
  }
}
