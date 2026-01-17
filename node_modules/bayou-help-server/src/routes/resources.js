import { Router } from 'express'
import { getAllResources, getResourceById } from '../services/resources.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { parish, category } = req.query
    const resources = await getAllResources({ parish, category })
    res.json(resources)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const resource = await getResourceById(req.params.id)
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' })
    }
    res.json(resource)
  } catch (error) {
    next(error)
  }
})

export default router
