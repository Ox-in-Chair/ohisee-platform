import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'
import routes from './routes'
import { initializeDatabase } from './db/connection'
import { logger } from './utils/logger'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.set('trust proxy', true) // Enable trust proxy for Render load balancer
app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ohisee-platform-frontend.vercel.app', // Correct frontend URL
    'https://ohisee-platform.vercel.app', // Keep old one for compatibility
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true,
}))
app.use(compression())
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api', rateLimiter)
app.use('/api', routes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Direct API test endpoint
app.get('/api/test', (_req, res) => {
  res.json({ message: 'API routing works!', timestamp: new Date().toISOString() })
})

// Direct reports test endpoint  
app.get('/api/reports-test', (_req, res) => {
  res.json({ reports: [], message: 'Direct reports endpoint works!' })
})

app.use(errorHandler)

async function startServer() {
  try {
    await initializeDatabase()
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()