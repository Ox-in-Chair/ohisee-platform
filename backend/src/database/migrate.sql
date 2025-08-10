-- Migration to fix reports table schema
-- This fixes the mismatch between controller expectations and database schema

-- First, check if we need to migrate (if report_number exists, we need to migrate)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='report_number') THEN
        -- Rename report_number to reference_number
        ALTER TABLE reports RENAME COLUMN report_number TO reference_number;
        
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='location') THEN
            ALTER TABLE reports ADD COLUMN location VARCHAR(255);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='date_occurred') THEN
            ALTER TABLE reports ADD COLUMN date_occurred DATE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='witnesses') THEN
            ALTER TABLE reports ADD COLUMN witnesses TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='previous_report') THEN
            ALTER TABLE reports ADD COLUMN previous_report BOOLEAN DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='bad_faith_score') THEN
            ALTER TABLE reports ADD COLUMN bad_faith_score DECIMAL(3,2) DEFAULT 0.0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='bad_faith_flags') THEN
            ALTER TABLE reports ADD COLUMN bad_faith_flags TEXT;
        END IF;
        
        -- Update status default value
        ALTER TABLE reports ALTER COLUMN status SET DEFAULT 'submitted';
        
        -- Update priority default value  
        ALTER TABLE reports ALTER COLUMN priority SET DEFAULT 'medium';
        
        RAISE NOTICE 'Reports table migrated successfully';
    ELSE
        RAISE NOTICE 'Reports table already up to date';
    END IF;
END $$;

-- Create report_attachments table if it doesn't exist
CREATE TABLE IF NOT EXISTS report_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    size INTEGER,
    storage_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create report_updates table if it doesn't exist
CREATE TABLE IF NOT EXISTS report_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reports_reference_number') THEN
        CREATE INDEX idx_reports_reference_number ON reports(reference_number);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_report_attachments_report_id') THEN
        CREATE INDEX idx_report_attachments_report_id ON report_attachments(report_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_report_updates_report_id') THEN
        CREATE INDEX idx_report_updates_report_id ON report_updates(report_id);
    END IF;
END $$;