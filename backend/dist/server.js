const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
      'POST /api/ai/assist': 'AI writing assistant'
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

// AI Assistant endpoint (mock for now)
app.post('/api/ai/assist', (req, res) => {
  const { prompt } = req.body;
  res.json({
    success: true,
    response: `This is a mock response for: "${prompt}". Real AI integration pending OpenAI API key configuration.`
  });
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
});