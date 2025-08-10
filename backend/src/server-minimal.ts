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
      // Make text clearer and more structured
      improvedText = improvedText
        .replace(/\s+/g, ' ') // Fix spacing
        .trim()
        .split(/[.!?]+/) // Split into sentences
        .filter(sentence => sentence.trim().length > 0)
        .map(sentence => {
          sentence = sentence.trim()
          return sentence.charAt(0).toUpperCase() + sentence.slice(1)
        })
        .join('. ')
      if (!improvedText.endsWith('.')) improvedText += '.'
      break
      
    case 'make_professional':
      // Convert to professional tone
      improvedText = improvedText
        .replace(/\s+/g, ' ')
        .trim()
      if (!improvedText.toLowerCase().startsWith('i would like to') && 
          !improvedText.toLowerCase().startsWith('i am writing to')) {
        improvedText = `I would like to report the following concern: ${improvedText.toLowerCase()}`
      }
      if (!improvedText.endsWith('.')) improvedText += '.'
      break
      
    case 'fix_grammar':
      // Basic grammar improvements
      improvedText = improvedText
        .replace(/\s+/g, ' ') // Fix spacing
        .replace(/\bi\b/g, 'I') // Fix 'i' to 'I'
        .replace(/\.\s*([a-z])/g, (match, letter) => '. ' + letter.toUpperCase()) // Capitalize after periods
        .trim()
      if (improvedText && !improvedText.endsWith('.') && !improvedText.endsWith('?') && !improvedText.endsWith('!')) {
        improvedText += '.'
      }
      break
      
    case 'create_summary':
      // Create a concise summary
      const sentences = improvedText.split(/[.!?]+/).filter(s => s.trim().length > 0)
      if (sentences.length > 1) {
        improvedText = sentences[0].trim() + '. ' + sentences[1].trim().slice(0, 30) + '...'
      } else {
        improvedText = improvedText.slice(0, 60) + (improvedText.length > 60 ? '...' : '')
      }
      break
      
    default:
      improvedText = text // Return original if unknown task type
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