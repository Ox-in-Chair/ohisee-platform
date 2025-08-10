# Database Setup Instructions for OhISee Platform

## Setting up PostgreSQL on Render (Free Tier)

### Step 1: Create PostgreSQL Database on Render

1. Go to your Render Dashboard: https://dashboard.render.com
2. Click "New +" button
3. Select "PostgreSQL"
4. Configure the database:
   - **Name**: `ohisee-database`
   - **Database**: Leave as default
   - **User**: Leave as default
   - **Region**: Same as your backend (Oregon)
   - **PostgreSQL Version**: 15
   - **Instance Type**: Free
5. Click "Create Database"
6. Wait for the database to be created (takes 1-2 minutes)

### Step 2: Get Database Connection String

1. Once created, click on your database name
2. Scroll down to "Connections"
3. Copy the "Internal Database URL" (starts with `postgres://`)
4. Save this URL - you'll need it for the backend

### Step 3: Add Database URL to Backend

1. Go to your backend service on Render (`ohisee-backend`)
2. Click on "Environment" tab
3. Add a new environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL from Step 2
4. Click "Save Changes"
5. The backend will automatically redeploy

### Step 4: Initialize Database Tables

1. Go to your database dashboard on Render
2. Click on "Connect" → "PSQL Command"
3. Copy the command (it will look like: `PGPASSWORD=xxx psql -h xxx -U xxx`)
4. Run this command in your terminal
5. Once connected, paste the contents of `backend/database/schema.sql`
6. The tables will be created automatically

### Alternative: Using Render's Query Editor

1. In your database dashboard, click "Connect" → "Query Editor"
2. Copy the contents of `backend/database/schema.sql`
3. Paste it into the query editor
4. Click "Run"

## Testing the Database Connection

Once set up, your backend will automatically:
- Connect to PostgreSQL if DATABASE_URL is configured
- Fall back to in-memory database if not configured
- Log the connection status in the console

You can verify it's working by:
1. Going to your backend logs on Render
2. Looking for: "Connected to PostgreSQL database"
3. Testing report submission on the frontend

## Database Features

### Automatic Features
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Audit logging for all actions
- ✅ Session management with expiry
- ✅ Secure password hashing
- ✅ Device tracking for compliance

### Tables Created
1. **users** - User authentication and profiles
2. **reports** - Confidential reports
3. **audit_logs** - Track all user actions
4. **ai_usage** - Track AI assistant usage
5. **sessions** - User session management
6. **quality_issues** - Quality management module
7. **suppliers** - Supplier management module
8. **documents** - Document control module
9. **training_records** - Training management module
10. **audits** - Audit management module

## Important Notes

### Free Tier Limitations
- Database expires after 90 days of inactivity
- Limited to 256MB storage
- Automatically backs up daily
- Can be upgraded to paid tier anytime

### Security
- All passwords are hashed (never stored in plain text)
- Sessions expire after 24 hours
- All actions are logged with timestamps
- Device information tracked for audit

### Backup
- Render automatically backs up daily
- You can also export data using pg_dump
- Keep regular exports for compliance

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correctly set
- Ensure database is active (not suspended)
- Check logs for specific error messages

### "Cannot find module 'pg'"
- The backend already includes pg in dependencies
- Redeploy the backend if needed

### "Permission denied for schema public"
- Use the Internal Database URL (not External)
- Make sure you're using the correct credentials

## Next Steps

After database setup:
1. Create an admin user account
2. Test report submission
3. Verify audit logs are being created
4. Set up regular backup schedule
5. Configure data retention policies