-- OhISee Platform Database Schema
-- For PostgreSQL on Render

-- Create database (if not exists)
-- Note: Run this on Render PostgreSQL

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- admin, user, viewer
    department VARCHAR(100),
    device_id VARCHAR(255),
    last_device VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Confidential Reports table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    report_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(50) DEFAULT 'pending', -- pending, investigating, resolved, closed
    submitted_by INTEGER REFERENCES users(id),
    anonymous BOOLEAN DEFAULT false,
    assigned_to INTEGER REFERENCES users(id),
    resolution TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs for all actions
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- report, user, document, etc
    entity_id INTEGER,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Assistant usage tracking
CREATE TABLE IF NOT EXISTS ai_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    report_id INTEGER REFERENCES reports(id),
    task_type VARCHAR(50) NOT NULL, -- improve_clarity, make_professional, etc
    original_text TEXT,
    improved_text TEXT,
    text_length INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quality Management module
CREATE TABLE IF NOT EXISTS quality_issues (
    id SERIAL PRIMARY KEY,
    issue_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    product VARCHAR(255),
    batch_number VARCHAR(100),
    severity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'open',
    reported_by INTEGER REFERENCES users(id),
    assigned_to INTEGER REFERENCES users(id),
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supplier Management module
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    supplier_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    rating VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    certification_expiry DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Control module
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    type VARCHAR(100), -- SOP, Policy, Form, etc
    version VARCHAR(20),
    department VARCHAR(100),
    file_path TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, approved, obsolete
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training Management module
CREATE TABLE IF NOT EXISTS training_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_name VARCHAR(255) NOT NULL,
    course_type VARCHAR(100), -- mandatory, optional
    completion_date DATE,
    expiry_date DATE,
    score DECIMAL(5,2),
    certificate_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Management module
CREATE TABLE IF NOT EXISTS audits (
    id SERIAL PRIMARY KEY,
    audit_number VARCHAR(100) UNIQUE NOT NULL,
    audit_type VARCHAR(100), -- internal, external, supplier
    audit_date DATE,
    auditor VARCHAR(255),
    department VARCHAR(100),
    findings_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed
    report_path TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for user sessions
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(500) UNIQUE NOT NULL,
    device_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_submitted_by ON reports(submitted_by);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_issues_updated_at BEFORE UPDATE ON quality_issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_records_updated_at BEFORE UPDATE ON training_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON audits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();