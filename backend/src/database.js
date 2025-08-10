// Database connection module for OhISee Platform
// Supports both PostgreSQL (production) and in-memory (development/testing)

const DATABASE_URL = process.env.DATABASE_URL;

// In-memory database for when PostgreSQL is not available
class InMemoryDatabase {
  constructor() {
    this.users = [];
    this.reports = [];
    this.auditLogs = [];
    this.aiUsage = [];
    this.sessions = [];
    this.nextId = 1;
  }

  // User methods
  async createUser(userData) {
    const user = {
      id: this.nextId++,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  async findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  async findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  // Report methods
  async createReport(reportData) {
    const report = {
      id: this.nextId++,
      report_number: `RPT-${Date.now()}`,
      ...reportData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.reports.push(report);
    this.logAction('create_report', report.id, reportData.submitted_by);
    return report;
  }

  async getReports(filters = {}) {
    let results = [...this.reports];
    if (filters.status) {
      results = results.filter(r => r.status === filters.status);
    }
    if (filters.submitted_by) {
      results = results.filter(r => r.submitted_by === filters.submitted_by);
    }
    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async getReportById(id) {
    return this.reports.find(r => r.id === id);
  }

  async updateReport(id, updates) {
    const index = this.reports.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reports[index] = {
        ...this.reports[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      return this.reports[index];
    }
    return null;
  }

  // Audit log methods
  async logAction(action, entityId, userId, details = {}) {
    const log = {
      id: this.nextId++,
      user_id: userId,
      action,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString()
    };
    this.auditLogs.push(log);
    return log;
  }

  async getAuditLogs(filters = {}) {
    let results = [...this.auditLogs];
    if (filters.user_id) {
      results = results.filter(l => l.user_id === filters.user_id);
    }
    if (filters.action) {
      results = results.filter(l => l.action === filters.action);
    }
    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // AI usage tracking
  async logAIUsage(data) {
    const usage = {
      id: this.nextId++,
      ...data,
      created_at: new Date().toISOString()
    };
    this.aiUsage.push(usage);
    return usage;
  }

  // Session methods
  async createSession(userId, token, deviceInfo) {
    const session = {
      id: this.nextId++,
      user_id: userId,
      token,
      ...deviceInfo,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      created_at: new Date().toISOString()
    };
    this.sessions.push(session);
    return session;
  }

  async findSessionByToken(token) {
    const session = this.sessions.find(s => s.token === token);
    if (session && new Date(session.expires_at) > new Date()) {
      return session;
    }
    return null;
  }

  async deleteSession(token) {
    const index = this.sessions.findIndex(s => s.token === token);
    if (index !== -1) {
      this.sessions.splice(index, 1);
      return true;
    }
    return false;
  }
}

// PostgreSQL database class (when configured)
class PostgreSQLDatabase {
  constructor() {
    this.pg = null;
    this.pool = null;
  }

  async connect() {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not configured');
    }
    
    const { Pool } = require('pg');
    this.pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Test connection
    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      console.log('Connected to PostgreSQL database');
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  async query(text, params) {
    if (!this.pool) {
      await this.connect();
    }
    return this.pool.query(text, params);
  }

  // User methods
  async createUser(userData) {
    const { email, username, password_hash, full_name, role, department } = userData;
    const result = await this.query(
      `INSERT INTO users (email, username, password_hash, full_name, role, department) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [email, username, password_hash, full_name, role || 'user', department]
    );
    return result.rows[0];
  }

  async findUserByEmail(email) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async findUserById(id) {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Report methods
  async createReport(reportData) {
    const { title, description, category, priority, submitted_by, anonymous } = reportData;
    const report_number = `RPT-${Date.now()}`;
    
    const result = await this.query(
      `INSERT INTO reports (report_number, title, description, category, priority, submitted_by, anonymous) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [report_number, title, description, category, priority || 'medium', submitted_by, anonymous || false]
    );
    
    // Log the action
    await this.logAction('create_report', result.rows[0].id, submitted_by);
    
    return result.rows[0];
  }

  async getReports(filters = {}) {
    let query = 'SELECT * FROM reports WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    if (filters.status) {
      query += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }
    
    if (filters.submitted_by) {
      query += ` AND submitted_by = $${paramCount++}`;
      params.push(filters.submitted_by);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await this.query(query, params);
    return result.rows;
  }

  async getReportById(id) {
    const result = await this.query('SELECT * FROM reports WHERE id = $1', [id]);
    return result.rows[0];
  }

  async updateReport(id, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    values.push(id);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    const result = await this.query(
      `UPDATE reports SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    
    return result.rows[0];
  }

  // Audit logging
  async logAction(action, entity_id, user_id, details = {}) {
    const result = await this.query(
      `INSERT INTO audit_logs (user_id, action, entity_id, details) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [user_id, action, entity_id, JSON.stringify(details)]
    );
    return result.rows[0];
  }

  async getAuditLogs(filters = {}) {
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    if (filters.user_id) {
      query += ` AND user_id = $${paramCount++}`;
      params.push(filters.user_id);
    }
    
    if (filters.action) {
      query += ` AND action = $${paramCount++}`;
      params.push(filters.action);
    }
    
    query += ' ORDER BY created_at DESC LIMIT 100';
    
    const result = await this.query(query, params);
    return result.rows;
  }

  // AI usage tracking
  async logAIUsage(data) {
    const { user_id, report_id, task_type, original_text, improved_text, text_length } = data;
    const result = await this.query(
      `INSERT INTO ai_usage (user_id, report_id, task_type, original_text, improved_text, text_length) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [user_id, report_id, task_type, original_text, improved_text, text_length]
    );
    return result.rows[0];
  }

  // Session management
  async createSession(userId, token, deviceInfo) {
    const { device_id, ip_address, user_agent } = deviceInfo;
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const result = await this.query(
      `INSERT INTO sessions (user_id, token, device_id, ip_address, user_agent, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, token, device_id, ip_address, user_agent, expires_at]
    );
    
    return result.rows[0];
  }

  async findSessionByToken(token) {
    const result = await this.query(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    return result.rows[0];
  }

  async deleteSession(token) {
    const result = await this.query('DELETE FROM sessions WHERE token = $1', [token]);
    return result.rowCount > 0;
  }
}

// Database factory - returns appropriate database based on configuration
class Database {
  constructor() {
    this.db = null;
  }

  async initialize() {
    if (DATABASE_URL) {
      console.log('Initializing PostgreSQL database...');
      this.db = new PostgreSQLDatabase();
      try {
        await this.db.connect();
        console.log('Using PostgreSQL database');
      } catch (error) {
        console.error('Failed to connect to PostgreSQL, falling back to in-memory database');
        this.db = new InMemoryDatabase();
        console.log('Using in-memory database (data will not persist)');
      }
    } else {
      this.db = new InMemoryDatabase();
      console.log('Using in-memory database (no DATABASE_URL configured)');
    }
    return this.db;
  }

  getDB() {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }
}

// Export singleton instance
const database = new Database();

module.exports = {
  database,
  initializeDatabase: () => database.initialize(),
  getDB: () => database.getDB()
};