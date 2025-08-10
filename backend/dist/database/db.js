"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = testConnection;
exports.initializeDatabase = initializeDatabase;
exports.createReport = createReport;
exports.getAllReports = getAllReports;
exports.getReportById = getReportById;
exports.createAuditLog = createAuditLog;
exports.trackAIUsage = trackAIUsage;
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Create PostgreSQL connection pool
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// Test database connection
async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Database connected successfully:', result.rows[0].now);
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}
// Initialize database tables
async function initializeDatabase() {
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
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        return false;
    }
}
// Report operations
async function createReport(reportData) {
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
    }
    finally {
        client.release();
    }
}
async function getAllReports() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM reports ORDER BY created_at DESC');
        return result.rows;
    }
    finally {
        client.release();
    }
}
async function getReportById(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM reports WHERE id = $1', [id]);
        return result.rows[0];
    }
    finally {
        client.release();
    }
}
// Audit logging
async function createAuditLog(logData) {
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
    }
    finally {
        client.release();
    }
}
// AI usage tracking
async function trackAIUsage(usageData) {
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
    }
    finally {
        client.release();
    }
}
exports.default = pool;
//# sourceMappingURL=db.js.map