import { Router } from 'express'
import OpenAI from 'openai'
import { body, validationResult } from 'express-validator'
import { AppError } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

const router = Router()

let openai: OpenAI | null = null

const getOpenAIClient = (): OpenAI | null => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key') {
    return null
  }
  
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  
  return openai
}

router.post(
  '/improve-text',
  [
    body('text').isLength({ min: 1 }).trim(),
    body('prompt').optional().isString().trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { text, prompt } = req.body
      const client = getOpenAIClient()

      // Return mock improvement if OpenAI is not configured
      if (!client) {
        logger.info('OpenAI not configured, using mock text improvement')
        
        // Simple mock improvement - just clean up spacing and add structure
        const improvedText = text
          .trim()
          .replace(/\s+/g, ' ')
          .split('. ')
          .map((sentence: string) => sentence.trim())
          .filter((sentence: string) => sentence.length > 0)
          .map((sentence: string) => 
            sentence.charAt(0).toUpperCase() + sentence.slice(1) + 
            (sentence.endsWith('.') ? '' : '.')
          )
          .join(' ')

        return res.json({
          improvedText: `${improvedText}\n\n[Note: AI assistance is not configured. This is basic text formatting only.]`,
          original: text,
        })
      }

      const systemPrompt = `You are an AI assistant helping factory workers write clear, professional reports about workplace concerns. 
        Keep the language simple and direct. Maintain the original meaning while improving clarity and professionalism.
        Do not add information that wasn't in the original text.`

      const userPrompt = prompt 
        ? `${prompt}\n\nOriginal text: ${text}`
        : `Please improve the following text to make it clearer and more professional:\n\n${text}`

      const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const improvedText = response.choices[0].message.content

      logger.info('Text improvement completed')

      res.json({
        improvedText,
        original: text,
      })
    } catch (error) {
      logger.error('AI text improvement failed:', error)
      next(new AppError('Failed to improve text', 500))
    }
  }
)

router.post(
  '/generate-summary',
  [body('reportId').isUUID()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      res.json({
        summary: 'Report summary generation will be implemented',
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router