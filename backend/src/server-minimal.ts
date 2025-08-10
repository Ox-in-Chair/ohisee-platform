import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

// Fix CORS for correct frontend URL
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ohisee-platform-frontend.vercel.app', // Correct frontend URL
    'https://ohisee-platform.vercel.app', // Keep old one for compatibility
  ],
  credentials: true,
}))

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.2.2-minimal',
    cors: 'fixed'
  })
})

// Minimal working AI assist endpoint
app.post('/api/ai/assist', (req, res) => {
  const { text, taskType } = req.body
  
  // Mock response that works
  let improvedText = text || 'Sample text'
  
  switch (taskType) {
    case 'improve_clarity':
      improvedText = improvedText.charAt(0).toUpperCase() + improvedText.slice(1)
      if (!improvedText.endsWith('.')) improvedText += '.'
      break
    case 'make_professional':
      improvedText = `I would like to report that ${improvedText.toLowerCase()}.`
      break
    case 'fix_grammar':
      improvedText = improvedText.replace(/\s+/g, ' ').trim()
      break
    case 'create_summary':
      improvedText = improvedText.slice(0, 50) + (improvedText.length > 50 ? '...' : '')
      break
  }

  res.json({
    success: true,
    taskType,
    originalLength: text?.length || 0,
    improvedLength: improvedText.length,
    improvedText,
  })
})

// Minimal working reports endpoint
app.post('/api/reports', (req, res) => {
  const referenceNumber = `REF-2025-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`
  
  res.status(201).json({
    success: true,
    reference_number: referenceNumber,
    message: 'Report submitted successfully',
  })
})

app.get('/api/reports', (req, res) => {
  res.json({
    reports: []
  })
})

app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`)
})