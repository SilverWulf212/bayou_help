import { SYSTEM_PROMPT } from '../../../shared/prompts.js'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b'

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

async function checkOllamaAvailable() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)

    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: controller.signal
    })
    clearTimeout(timeout)
    return response.ok
  } catch {
    return false
  }
}

export async function generateResponse(userMessage, history, resources) {
  const ollamaAvailable = await checkOllamaAvailable()

  if (!ollamaAvailable) {
    console.log('Ollama not available, using fallback responses')
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

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 256
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data = await response.json()

    const citations = resources.length > 0
      ? resources.slice(0, 3).map(r => r.name)
      : []

    return {
      content: data.message?.content || "I couldn't generate a response. Please try again or call 211.",
      resources: resources.slice(0, 3),
      citations
    }
  } catch (error) {
    console.error('LLM Error:', error.message)
    return generateFallbackResponse(userMessage, resources)
  }
}
