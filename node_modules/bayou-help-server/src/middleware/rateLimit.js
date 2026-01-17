import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too many requests. Please wait an hour before trying again, or call 211 for immediate help.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
