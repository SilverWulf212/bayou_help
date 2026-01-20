import { SYSTEM_PROMPT } from '../../../shared/prompts.js'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const FALLBACK_RESPONSES = {
  shelter: "Here are places that can help you find a place to stay. These shelters are in Acadiana and can help you today.",
  food: "Here are places where you can get food. Many of these serve free meals or give out groceries.",
  health: "Here are health clinics that can help you. Many offer low-cost or free care.",
  'mental-health': "Here are places that can help with mental health support. You don't have to go through this alone.",
  'domestic-violence': "Here are safe places that can help. They keep your information private and can help you make a safety plan.",
  jobs: "Here are places that can help you find a job. They can also help with training and resume writing.",
  transportation: "Here is info about getting around in Acadiana. There are buses and other options that might help.",
  'id-documents': "Here is where you can get ID and important papers. Having these documents can help you get other services.",
  default: "I found some resources that might help you. Take a look at these options in Acadiana."
}

function generateFallbackResponse(userMessage, resources) {
  const messageLower = userMessage.toLowerCase()

  let responseType = 'default'

  if (/hungry|food|eat|meal|groceries|pantry/.test(messageLower)) {
    responseType = 'food'
  } else if (/shelter|sleep|stay|homeless|housing|roof|place to stay/.test(messageLower)) {
    responseType = 'shelter'
  } else if (/doctor|medical|sick|clinic|health|prescription|insurance/.test(messageLower)) {
    responseType = 'health'
  } else if (/mental|therapy|counseling|depression|anxiety|stress|sad/.test(messageLower)) {
    responseType = 'mental-health'
  } else if (/abuse|violence|hurt|scared|partner|hitting/.test(messageLower)) {
    responseType = 'domestic-violence'
  } else if (/job|work|employment|hire|career|training/.test(messageLower)) {
    responseType = 'jobs'
  } else if (/ride|bus|transport|car|get there/.test(messageLower)) {
    responseType = 'transportation'
  } else if (/id|license|birth certificate|social security|document/.test(messageLower)) {
    responseType = 'id-documents'
  }

  const content = FALLBACK_RESPONSES[responseType]
  const citations = resources.slice(0, 3).map(r => r.name)

  return {
    content,
    resources: resources.slice(0, 3),
    citations
  }
}

export async function generateResponse(userMessage, history, resources) {
  if (!OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY not set, using fallback responses')
    return generateFallbackResponse(userMessage, resources)
  }

  const resourceContext = resources.length > 0
    ? `\n\nRelevant local resources:\n${resources.map(r =>
        `- ${r.name}: ${r.description || ''} Phone: ${r.phone || 'N/A'}`
      ).join('\n')}`
    : ''

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + resourceContext },
    ...history.slice(-6).map(m => ({
      role: m.role,
      content: m.content
    })),
    { role: 'user', content: userMessage }
  ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.7
      }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()

    const citations = resources.length > 0
      ? resources.slice(0, 3).map(r => r.name)
      : []

    return {
      content: data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again or call 211.",
      resources: resources.slice(0, 3),
      citations
    }
  } catch (error) {
    clearTimeout(timeout)
    console.error('LLM Error:', error.message)
    return generateFallbackResponse(userMessage, resources)
  }
}
