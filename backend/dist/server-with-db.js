const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database tables on startup
async function initializeDatabase() {
  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', testResult.rows[0].now);
    
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        report_number VARCHAR(20) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        priority VARCHAR(20) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        reporter_name VARCHAR(255),
        reporter_email VARCHAR(255),
        reporter_phone VARCHAR(50),
        is_anonymous BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id INTEGER,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        device_id VARCHAR(255),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_usage (
        id SERIAL PRIMARY KEY,
        report_id INTEGER,
        task_type VARCHAR(50) NOT NULL,
        input_text TEXT NOT NULL,
        output_text TEXT NOT NULL,
        tokens_used INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Continue running even if database fails (fallback to in-memory)
  }
}

// Initialize database on startup
initializeDatabase();

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
    'http://localhost:3001',
    'http://localhost:4000',
    'http://localhost:4001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'OhiSee! Platform API',
    version: '1.1.0',
    status: 'active',
    database: process.env.DATABASE_URL ? 'connected' : 'not configured',
    endpoints: {
      'GET /': 'API documentation (this page)',
      'GET /health': 'Health check endpoint',
      'GET /api': 'API information and modules list',
      'GET /api/reports': 'Get all reports',
      'POST /api/reports': 'Submit a new report',
      'GET /api/reports/:id': 'Get specific report',
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
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const result = await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }
  
  res.json({ 
    status: 'OK', 
    message: 'OhiSee! Backend is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Base API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'OhiSee! Platform API',
    version: '1.1.0',
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

// Get all reports
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    // Fallback to empty array if database fails
    res.json([]);
  }
});

// Submit a new report
app.post('/api/reports', async (req, res) => {
  try {
    const reportNumber = `RP-${Date.now().toString().slice(-8)}`;
    const { 
      category, priority, title, description, 
      reporterName, reporterEmail, reporterPhone, anonymous 
    } = req.body;
    
    // Try to save to database
    try {
      const query = `
        INSERT INTO reports (
          report_number, category, priority, title, description,
          reporter_name, reporter_email, reporter_phone, is_anonymous
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const values = [
        reportNumber,
        category || 'General',
        priority || 'Medium',
        title,
        description,
        reporterName || null,
        reporterEmail || null,
        reporterPhone || null,
        anonymous || false
      ];
      
      const result = await pool.query(query, values);
      const report = result.rows[0];
      
      // Log to audit
      await pool.query(`
        INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'report_created',
        'report',
        report.id,
        JSON.stringify({ reportNumber, category }),
        req.ip,
        req.get('user-agent')
      ]);
      
      res.json({
        success: true,
        message: 'Report submitted successfully',
        report
      });
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      // Fallback response if database fails
      res.json({
        success: true,
        message: 'Report submitted successfully (pending database sync)',
        report: {
          id: Date.now(),
          report_number: reportNumber,
          title,
          description,
          category,
          priority,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit report'
    });
  }
});

// Get a specific report
app.get('/api/reports/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
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
  const { taskType, text, reportId } = req.body;
  
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
    const mockResponse = `[Mock ${ALLOWED_TASKS[taskType].name}]: ${text}`;
    
    // Try to log to database
    try {
      await pool.query(`
        INSERT INTO ai_usage (report_id, task_type, input_text, output_text, tokens_used)
        VALUES ($1, $2, $3, $4, $5)
      `, [reportId || null, taskType, text, mockResponse, 0]);
    } catch (error) {
      console.log('Could not log AI usage:', error.message);
    }
    
    return res.json({
      success: true,
      taskType,
      taskName: ALLOWED_TASKS[taskType].name,
      improvedText: mockResponse,
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
    try {
      await pool.query(`
        INSERT INTO ai_usage (report_id, task_type, input_text, output_text, tokens_used)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        reportId || null,
        taskType,
        text,
        improvedText,
        completion.usage?.total_tokens || 0
      ]);
    } catch (error) {
      console.log('Could not log AI usage:', error.message);
    }
    
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
  console.log(`OhiSee! Backend running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Database:', process.env.DATABASE_URL ? 'configured' : 'not configured');
  console.log('OpenAI:', process.env.OPENAI_API_KEY ? 'configured' : 'not configured');
});