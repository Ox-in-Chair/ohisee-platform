import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Read and execute schema.sql
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await client.query(schema);
    client.release();
    
    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Report operations
export async function createReport(reportData: any) {
  const client = await pool.connect();
  try {
    const reportNumber = `RP-${Date.now().toString().slice(-8)}`;
    
    const query = `
      INSERT INTO reports (
        report_number, category, priority, title, description,
        reporter_name, reporter_email, reporter_phone, is_anonymous
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      reportNumber,
      reportData.category,
      reportData.priority,
      reportData.title,
      reportData.description,
      reportData.reporterName || null,
      reportData.reporterEmail || null,
      reportData.reporterPhone || null,
      reportData.anonymous || false
    ];
    
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getAllReports() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM reports ORDER BY created_at DESC'
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getReportById(id: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM reports WHERE id = $1',
      [id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Audit logging
export async function createAuditLog(logData: any) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO audit_logs (
        user_id, action, entity_type, entity_id, 
        details, ip_address, user_agent, device_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      logData.userId || null,
      logData.action,
      logData.entityType,
      logData.entityId || null,
      JSON.stringify(logData.details || {}),
      logData.ipAddress || null,
      logData.userAgent || null,
      logData.deviceId || null
    ];
    
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// AI usage tracking
export async function trackAIUsage(usageData: any) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO ai_usage (
        report_id, task_type, input_text, output_text, tokens_used, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      usageData.reportId || null,
      usageData.taskType,
      usageData.inputText,
      usageData.outputText,
      usageData.tokensUsed || 0,
      usageData.userId || null
    ];
    
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export default pool;