import { Router } from 'express'
import { triageUser, generateResumeChat, generateResumeDOCX } from '../services/resume.js'

const router = Router()

router.post('/triage', async (req, res, next) => {
  try {
    const { message } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' })
    }

    const result = await triageUser(message)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/chat', async (req, res, next) => {
  try {
    const { message, history = [] } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' })
    }

    const result = await generateResumeChat(message, history)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/generate', async (req, res, next) => {
  try {
    const { userInfo } = req.body

    if (!userInfo || typeof userInfo !== 'object') {
      return res.status(400).json({ error: 'User info is required' })
    }

    const { buffer, text } = await generateResumeDOCX(userInfo)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', 'attachment; filename="resume.docx"')
    res.send(buffer)
  } catch (error) {
    console.error('Resume generation error:', error)
    next(error)
  }
})

router.post('/preview', async (req, res, next) => {
  try {
    const { userInfo } = req.body

    if (!userInfo || typeof userInfo !== 'object') {
      return res.status(400).json({ error: 'User info is required' })
    }

    const { text, parsed } = await generateResumeDOCX(userInfo)
    res.json({ text, parsed })
  } catch (error) {
    next(error)
  }
})

export default router
