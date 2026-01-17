import express from 'express'
import cors from 'cors'
import chatRoutes from './routes/chat.js'
import resourcesRoutes from './routes/resources.js'
import adminRoutes from './routes/admin.js'
import { rateLimiter } from './middleware/rateLimit.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://bayouhelp.org'
    : 'http://localhost:5173'
}))
app.use(express.json())

app.use('/api/chat', rateLimiter, chatRoutes)
app.use('/api/resources', resourcesRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0'
  })
})

app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({
    error: 'Something went wrong. Please try again or call 211 for help.'
  })
})

app.listen(PORT, () => {
  console.log(`Bayou Help server running on port ${PORT}`)
})
