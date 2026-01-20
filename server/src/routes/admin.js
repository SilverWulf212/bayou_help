import { Router } from 'express'
import { verifyAdmin } from '../middleware/auth.js'
import { loginRateLimiter } from '../middleware/rateLimit.js'
import {
  createResource,
  updateResource,
  deleteResource,
  getResourceById
} from '../services/resources.js'

const router = Router()

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

router.post('/login', loginRateLimiter, (req, res) => {
  const { password } = req.body

  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Admin not configured' })
  }

  if (password === ADMIN_PASSWORD) {
    res.json({ success: true })
  } else {
    res.status(401).json({ error: 'Invalid password' })
  }
})

router.post('/resources', verifyAdmin, async (req, res, next) => {
  try {
    const { name, category, categoryLabel, parish, description, phone, address, hours, eligibility, nextStep } = req.body

    if (!name || !category || !parish) {
      return res.status(400).json({ error: 'Name, category, and parish are required' })
    }

    const newResource = await createResource({
      name,
      category,
      categoryLabel: categoryLabel || category,
      parish,
      description: description || '',
      phone: phone || '',
      address: address || '',
      hours: hours || '',
      eligibility: eligibility || '',
      nextStep: nextStep || ''
    })

    res.status(201).json(newResource)
  } catch (error) {
    next(error)
  }
})

router.put('/resources/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params
    const updates = req.body

    const existing = await getResourceById(id)
    if (!existing) {
      return res.status(404).json({ error: 'Resource not found' })
    }

    const updated = await updateResource(id, updates)
    res.json(updated)
  } catch (error) {
    next(error)
  }
})

router.delete('/resources/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params

    const existing = await getResourceById(id)
    if (!existing) {
      return res.status(404).json({ error: 'Resource not found' })
    }

    await deleteResource(id)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

export default router
