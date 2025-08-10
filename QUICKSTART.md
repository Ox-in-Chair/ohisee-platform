# OhISee Platform - Quick Start Guide

## 🚀 Initial Testing & Deployment

### Current Status
✅ **Frontend**: Running successfully at http://localhost:3000
⚠️ **Backend**: Has module resolution issues with OneDrive sync

### Quick Setup (Without Database)

1. **Frontend Only Testing**:
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:3000 to see the application

2. **Features Available**:
- ✅ Landing page with document control header
- ✅ Report submission form (UI only)
- ✅ Responsive design with Kangopak branding
- ✅ AI writing assistant interface
- ✅ File upload with drag-and-drop
- ✅ Report tracking interface

### Known Issues & Solutions

#### OneDrive Sync Issues
The application is stored in OneDrive which causes npm module sync issues. 

**Solution**: Move the project to a local folder outside OneDrive:
```bash
# Copy to local drive
xcopy "C:\Users\mike\OneDrive\Confidential Reporting App" "C:\Projects\ohisee-platform" /E /I

# Navigate to new location
cd C:\Projects\ohisee-platform\ohisee-platform

# Clean install
rmdir node_modules /s /q
npm install
```

### Deployment Options

#### 1. **Vercel Deployment (Frontend Only)**
```bash
cd frontend
npm install -g vercel
vercel
```

#### 2. **Netlify Deployment (Frontend Only)**
```bash
cd frontend
npm run build
# Drag the 'out' folder to Netlify
```

#### 3. **Local Testing with Mock Data**
The backend includes a mock database for testing without PostgreSQL:
- Set `DATABASE_URL=mock` in `.env`
- Mock data includes sample reports and users
- AI features work without OpenAI API key (basic text formatting)

### Environment Configuration

Create `.env` file in root:
```env
# Database (use 'mock' for testing)
DATABASE_URL=mock

# Optional Services (not required for testing)
OPENAI_API_KEY=your-key-here
SENDGRID_API_KEY=your-key-here
```

### Testing Features

1. **Submit a Report**:
   - Go to http://localhost:3000
   - Click "Submit New Report"
   - Fill out the form
   - Reference number will be generated

2. **Track a Report**:
   - Use reference numbers: REF-2025-00001 or REF-2025-00002
   - These are pre-loaded in mock database

3. **Document Control Header**:
   - Displays on all pages
   - Shows Doc Ref: 1.1.3, Rev: 1, Date: 07 August 2025

### Next Steps for Production

1. **Database Setup**:
   - Install PostgreSQL
   - Update DATABASE_URL in .env
   - Run migrations: `npm run db:migrate`

2. **API Services**:
   - Get OpenAI API key for AI features
   - Get SendGrid API key for emails
   - Update .env with real keys

3. **Deployment**:
   - Use Docker containers (Dockerfile coming soon)
   - Deploy to cloud provider (AWS, Google Cloud, Azure)
   - Set up CI/CD pipeline

### Support

For issues or questions:
- Check the README.md for detailed documentation
- Review ARCHITECTURE.md for system design
- Contact the development team

---
**Note**: This is a development version. Do not use in production without proper security configuration and testing.