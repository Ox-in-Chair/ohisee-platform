import OpenAI from 'openai'
import { logger } from '../utils/logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface BadFaithAnalysis {
  score: number
  flags: string[]
  suggestions?: string[]
}

interface ReportData {
  title: string
  description: string
  category: string
  previous_report: boolean
}

export const detectBadFaith = async (data: ReportData): Promise<BadFaithAnalysis> => {
  // Return mock response if OpenAI is not configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key') {
    logger.info('OpenAI not configured, using mock bad faith detection')
    return {
      score: Math.floor(Math.random() * 30), // Low score for testing
      flags: [],
      suggestions: ['Consider adding more specific details', 'Include dates and times if possible'],
    }
  }

  try {
    const prompt = `
      Analyze the following confidential report for potential bad faith indicators.
      Score from 0-100 where:
      - 0-20: Appears genuine
      - 21-40: Minor concerns
      - 41-60: Moderate concerns
      - 61-80: Significant concerns
      - 81-100: Likely bad faith

      Report Details:
      Title: ${data.title}
      Category: ${data.category}
      Description: ${data.description}
      Previously Reported: ${data.previous_report}

      Consider:
      1. Vague or exaggerated language
      2. Lack of specific details
      3. Personal vendettas vs legitimate concerns
      4. Consistency and plausibility
      5. Presence of actionable information

      Respond in JSON format:
      {
        "score": number,
        "flags": ["flag1", "flag2"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in analyzing workplace reports for authenticity and good faith.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500,
    })

    const analysis = JSON.parse(response.choices[0].message.content || '{}')
    
    logger.info(`Bad faith detection completed. Score: ${analysis.score}`)
    
    return {
      score: analysis.score || 0,
      flags: analysis.flags || [],
      suggestions: analysis.suggestions || [],
    }
  } catch (error) {
    logger.error('Bad faith detection failed:', error)
    return {
      score: 0,
      flags: ['detection_failed'],
      suggestions: [],
    }
  }
}