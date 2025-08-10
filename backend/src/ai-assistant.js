const OpenAI = require('openai');

// Initialize OpenAI client (will use OPENAI_API_KEY from environment)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Allowed task types for the AI assistant
const ALLOWED_TASKS = {
  improve_clarity: {
    name: 'Improve Clarity',
    systemPrompt: 'You are a professional editor helping with confidential workplace reports. Your ONLY job is to rewrite the given text to be clearer and easier to understand. Keep the same meaning but improve clarity. Do not add new information or change facts. Respond ONLY with the improved text, no explanations.'
  },
  make_professional: {
    name: 'Make Professional',
    systemPrompt: 'You are a professional editor helping with confidential workplace reports. Your ONLY job is to rewrite the given text in a more professional and formal tone suitable for workplace reporting. Keep all facts the same. Do not add new information. Respond ONLY with the improved text, no explanations.'
  },
  fix_grammar: {
    name: 'Fix Grammar',
    systemPrompt: 'You are a grammar checker for confidential workplace reports. Your ONLY job is to fix grammar, spelling, and punctuation errors in the given text. Do not change the meaning or add information. Respond ONLY with the corrected text, no explanations.'
  },
  create_summary: {
    name: 'Create Summary',
    systemPrompt: 'You are helping summarize confidential workplace reports. Your ONLY job is to create a brief, factual summary of the given text in 2-3 sentences. Include only the key facts. Do not add opinions or new information. Respond ONLY with the summary, no explanations.'
  }
};

async function processAIRequest(taskType, text, reportContext = {}) {
  // Validate task type
  if (!ALLOWED_TASKS[taskType]) {
    throw new Error(`Invalid task type. Allowed types: ${Object.keys(ALLOWED_TASKS).join(', ')}`);
  }

  // Check if OpenAI is configured
  if (!openai) {
    // Return a helpful mock response if no API key
    return {
      success: false,
      message: 'AI assistant not configured. Please add OPENAI_API_KEY to environment variables.',
      mockResponse: `[Mock ${ALLOWED_TASKS[taskType].name}]: ${text.substring(0, 100)}...`
    };
  }

  // Validate input text
  if (!text || text.trim().length < 10) {
    throw new Error('Text must be at least 10 characters long');
  }

  if (text.length > 5000) {
    throw new Error('Text must be less than 5000 characters');
  }

  try {
    // Create the AI request with strict system prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: ALLOWED_TASKS[taskType].systemPrompt
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent, professional output
      max_tokens: 1000,
      presence_penalty: 0,
      frequency_penalty: 0
    });

    const improvedText = completion.choices[0].message.content;

    // Log the usage for audit
    console.log(`AI Assistant used: ${taskType} - ${new Date().toISOString()}`);

    return {
      success: true,
      taskType,
      taskName: ALLOWED_TASKS[taskType].name,
      originalLength: text.length,
      improvedLength: improvedText.length,
      improvedText
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process text. Please try again.');
  }
}

// Rate limiting tracker (simple in-memory for now)
const rateLimiter = new Map();

function checkRateLimit(identifier) {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  
  if (!rateLimiter.has(identifier)) {
    rateLimiter.set(identifier, []);
  }
  
  // Clean old entries
  const requests = rateLimiter.get(identifier).filter(time => time > hourAgo);
  rateLimiter.set(identifier, requests);
  
  // Check limit (10 requests per hour)
  if (requests.length >= 10) {
    return false;
  }
  
  // Add current request
  requests.push(now);
  return true;
}

module.exports = {
  processAIRequest,
  checkRateLimit,
  ALLOWED_TASKS
};