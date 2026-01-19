import { Router } from 'express'
import { generateResponse } from '../services/llm.js'
import { findRelevantResources } from '../services/resources.js'

const router = Router()

const SAFETY_PATTERNS = [
  { pattern: /\b(suicid|kill myself|end my life|want to die)\b/i, type: 'crisis', response: '988' },
  { pattern: /\b(domestic violence|abused|hitting me|beat me)\b/i, type: 'dv', response: 'Faith House' },
  { pattern: /\b(traffick|sold me|forced to work)\b/i, type: 'trafficking', response: 'National Human Trafficking Hotline' },
  { pattern: /\b(emergency|dying|bleeding|heart attack|stroke)\b/i, type: 'emergency', response: '911' },
]

function checkSafetyEscalation(message) {
  for (const { pattern, type, response } of SAFETY_PATTERNS) {
    if (pattern.test(message)) {
      return { type, response }
    }
  }
  return null
}

const MAX_MESSAGE_LENGTH = 10000
const MAX_HISTORY_ENTRIES = 50

router.post('/', async (req, res, next) => {
  try {
    const { message, history = [] } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' })
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: 'Message too long' })
    }

    if (!Array.isArray(history) || history.length > MAX_HISTORY_ENTRIES) {
      return res.status(400).json({ error: 'Invalid history' })
    }

    const safetyCheck = checkSafetyEscalation(message)
    if (safetyCheck) {
      const escalationResponses = {
        crisis: {
          content: "I hear you, and I'm glad you reached out. Please call 988 right now - it's the Suicide & Crisis Lifeline. Someone is there 24/7 to talk with you. You don't have to face this alone.",
          resources: [{ id: 'crisis-988', name: 'Suicide & Crisis Lifeline', phone: '988', category: 'crisis', description: 'Free, confidential support 24/7' }]
        },
        dv: {
          content: "Your safety matters. Faith House helps people in Acadiana who are experiencing domestic violence. They can talk with you confidentially about your options. Call them at 337-232-8954.",
          resources: [{ id: 'faith-house', name: 'Faith House', phone: '337-232-8954', category: 'domestic-violence', description: 'Emergency shelter and support for domestic violence survivors' }]
        },
        trafficking: {
          content: "Help is available. Call the National Human Trafficking Hotline at 1-888-373-7888. They can help you safely, 24/7, in many languages.",
          resources: [{ id: 'trafficking-hotline', name: 'National Human Trafficking Hotline', phone: '1-888-373-7888', category: 'crisis', description: '24/7 confidential support' }]
        },
        emergency: {
          content: "If this is a medical emergency, please call 911 right away. They can send help to you immediately.",
          resources: [{ id: 'emergency-911', name: 'Emergency Services', phone: '911', category: 'crisis', description: 'Police, fire, and medical emergencies' }]
        }
      }

      return res.json(escalationResponses[safetyCheck.type])
    }

    const relevantResources = await findRelevantResources(message)
    const response = await generateResponse(message, history, relevantResources)

    res.json({
      content: response.content,
      resources: response.resources || relevantResources.slice(0, 3),
      citations: response.citations || []
    })
  } catch (error) {
    next(error)
  }
})

export default router
