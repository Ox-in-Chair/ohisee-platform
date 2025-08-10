const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Simple AI assistant implementation (restricted to specific tasks)
const ALLOWED_TASKS = {
  improve_clarity: {
    name: 'Improve Clarity',
    instruction: 'Rewrite this text to be clearer and easier to understand'
  },
  make_professional: {
    name: 'Make Professional',
    instruction: 'Rewrite this text in a more professional tone'
  },
  fix_grammar: {
    name: 'Fix Grammar',
    instruction: 'Fix grammar and spelling errors in this text'
  },
  create_summary: {
    name: 'Create Summary',
    instruction: 'Create a brief 2-3 sentence summary of this text'
  }
};

// Middleware
const corsOptions = {
  origin: [
    'https://ohisee-platform-frontend.vercel.app',
    'https://ohisee-platform.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'OhISee Platform API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      'GET /': 'API documentation (this page)',
      'GET /health': 'Health check endpoint',
      'GET /api': 'API information and modules list',
      'GET /api/reports': 'Get all reports',
      'POST /api/reports': 'Submit a new report',
      'POST /api/ai/assist': 'AI writing assistant (restricted tasks only)',
      'GET /api/ai/tasks': 'Get available AI task types'
    },
    modules: [
      'confidential-reporting',
      'quality-management',
      'supplier-management',
      'document-control',
      'training-management',
      'audit-management'
    ],
    frontend: 'https://ohisee-platform-frontend.vercel.app'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'OhISee Backend is running' });
});

// Base API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'OhISee Platform API',
    version: '1.0.0',
    modules: [
      'confidential-reporting',
      'quality-management',
      'supplier-management',
      'document-control',
      'training-management',
      'audit-management'
    ]
  });
});

// Confidential Reporting endpoints
app.get('/api/reports', (req, res) => {
  res.json({ 
    reports: [],
    message: 'Database connection pending'
  });
});

app.post('/api/reports', (req, res) => {
  const { title, description, category, priority } = req.body;
  res.json({
    success: true,
    message: 'Report submitted successfully',
    report: {
      id: Date.now(),
      title,
      description,
      category,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

// Get available AI tasks
app.get('/api/ai/tasks', (req, res) => {
  res.json({
    success: true,
    tasks: Object.entries(ALLOWED_TASKS).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.instruction
    }))
  });
});

// AI Assistant endpoint - RESTRICTED to specific tasks only
app.post('/api/ai/assist', async (req, res) => {
  const { taskType, text } = req.body;
  
  // Validate task type
  if (!taskType || !ALLOWED_TASKS[taskType]) {
    return res.status(400).json({
      success: false,
      error: 'Invalid task type. Allowed types: improve_clarity, make_professional, fix_grammar, create_summary'
    });
  }
  
  // Validate text input
  if (!text || text.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Text must be at least 10 characters long'
    });
  }
  
  if (text.length > 5000) {
    return res.status(400).json({
      success: false,
      error: 'Text must be less than 5000 characters'
    });
  }
  
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    // Return mock response for testing
    return res.json({
      success: true,
      taskType,
      taskName: ALLOWED_TASKS[taskType].name,
      improvedText: `[Mock ${ALLOWED_TASKS[taskType].name}]: ${text}`,
      message: 'Note: This is a mock response. Add OPENAI_API_KEY to enable real AI processing.'
    });
  }
  
  // If we have an API key, use OpenAI
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Create system prompt based on task
    let systemPrompt = '';
    switch(taskType) {
      case 'improve_clarity':
        systemPrompt = 'You are a professional editor. Rewrite the following confidential report text to be clearer and easier to understand. Keep the same facts but improve clarity. Respond ONLY with the improved text.';
        break;
      case 'make_professional':
        systemPrompt = 'You are a professional editor. Rewrite the following confidential report text in a more professional and formal tone. Keep all facts the same. Respond ONLY with the improved text.';
        break;
      case 'fix_grammar':
        systemPrompt = 'You are a grammar checker. Fix ONLY grammar, spelling, and punctuation errors in the following text. Do not change the meaning. Respond ONLY with the corrected text.';
        break;
      case 'create_summary':
        systemPrompt = 'Create a brief 2-3 sentence factual summary of the following confidential report. Include only key facts. Respond ONLY with the summary.';
        break;
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });
    
    const improvedText = completion.choices[0].message.content;
    
    // Log usage for audit
    console.log(`AI Task: ${taskType} | Time: ${new Date().toISOString()} | Text length: ${text.length}`);
    
    res.json({
      success: true,
      taskType,
      taskName: ALLOWED_TASKS[taskType].name,
      originalLength: text.length,
      improvedLength: improvedText.length,
      improvedText
    });
    
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process text. Please try again.',
      message: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`OhISee Backend running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('OpenAI configured:', !!process.env.OPENAI_API_KEY);
});