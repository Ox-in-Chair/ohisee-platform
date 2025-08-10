# OhiSee! Cloud Deployment Guide

## Current Status

### ✅ Already Deployed
- **Backend API**: https://ohisee-backend.onrender.com
  - Status: LIVE and working
  - Includes: All API endpoints, AI assistant

### 🚀 In Progress
- **Frontend**: Deploying to Vercel
- **Database**: Setting up on Render

## Frontend Deployment (Vercel)

### Option 1: Command Line
```bash
cd ohisee-platform/frontend
npx vercel login
npx vercel
```

### Option 2: Web Dashboard
1. Go to https://vercel.com/new
2. Import Git repository
3. Select `ohisee-platform/frontend` folder
4. Environment variables:
   - `NEXT_PUBLIC_API_URL`: https://ohisee-backend.onrender.com
   - `NEXT_PUBLIC_COMPLIANCE_STANDARD`: GMP
5. Click Deploy

## Database Setup (Render)

### Step 1: Create PostgreSQL Database
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Settings:
   - Name: `ohisee-database`
   - Database: `ohisee_db`
   - User: `ohisee_user`
   - Region: Same as backend (Oregon)
   - Instance Type: Free
4. Click "Create Database"

### Step 2: Get Connection String
After creation, copy:
- Internal Database URL (for backend connection)
- External Database URL (for setup)

### Step 3: Run Schema
```bash
# Connect to database
psql [EXTERNAL_DATABASE_URL]

# Run schema
\i ohisee-platform/database/schema.sql
```

### Step 4: Update Backend Environment
1. Go to Render Dashboard
2. Select `ohisee-backend`
3. Environment → Add Variable:
   - `DATABASE_URL`: [Internal Database URL]
4. Save and redeploy

## Production URLs

### Once Deployed:
- **Frontend**: https://ohisee-platform.vercel.app
- **Backend**: https://ohisee-backend.onrender.com
- **Database**: Render PostgreSQL (internal)

## Testing Cloud Deployment

1. Visit https://ohisee-platform.vercel.app
2. Test confidential report submission
3. Check AI assistant works
4. Verify all modules load

## Environment Variables Summary

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://ohisee-backend.onrender.com
NEXT_PUBLIC_COMPLIANCE_STANDARD=GMP
NEXT_PUBLIC_APP_NAME=OhiSee!
```

### Backend (Render Dashboard)
```
OPENAI_API_KEY=[your-key]
DATABASE_URL=[postgresql-connection-string]
NODE_ENV=production
COMPLIANCE_STANDARD=GMP
```

## Troubleshooting

### Frontend Not Loading
- Check Vercel deployment logs
- Verify environment variables
- Check browser console for errors

### API Connection Failed
- Ensure backend is running on Render
- Check CORS settings
- Verify API_URL in frontend env

### Database Issues
- Check connection string format
- Verify database is running
- Check Render logs for errors

## Support
- Vercel Status: https://www.vercel-status.com
- Render Status: https://status.render.com
- OhiSee! Issues: Contact admin