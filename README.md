# OhiSee! - Operations Intelligence Centre

## 🎯 Overview
OhiSee! (Operations Intelligence Centre) is a comprehensive compliance management system designed for Kangopak, featuring confidential reporting (whistleblower) capabilities and 6 integrated compliance modules. The platform ensures GMP (Good Manufacturing Practice) compliance with full audit trails and secure anonymous reporting.

## 🌟 Key Features
- **Confidential Reporting**: Secure, anonymous whistleblower system
- **AI-Powered Assistant**: Restricted AI for report improvement (4 specific functions only)
- **Multi-Module System**: 6 integrated compliance modules
- **Audit Trail**: Complete logging of all actions with timestamps
- **Device Tracking**: Compliance with regulatory requirements
- **GMP Compliant**: Configurable compliance standards (GMP, BRCGS, ISO, etc.)

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (https://ohisee-platform-frontend.vercel.app)
- **UI Components**: Custom React components with Lucide icons

### Backend
- **Framework**: Express.js with TypeScript
- **API**: RESTful API with JSON responses
- **Deployment**: Render (https://ohisee-backend.onrender.com)
- **Database**: PostgreSQL (ready for deployment)
- **AI Integration**: OpenAI GPT-3.5 (restricted tasks only)

## 📦 Modules

### 1. Confidential Reporting Module ✅
- Anonymous report submission
- AI writing assistant (restricted to 4 functions)
- Report tracking system
- Priority levels and categorization

### 2. Quality Management Module 🚧
- Quality issue tracking
- Batch number management
- Severity classification
- Resolution workflow

### 3. Supplier Management Module 🚧
- Supplier database
- Rating system
- Certification tracking
- Expiry notifications

### 4. Document Control Module 🚧
- Document versioning
- Approval workflows
- Compliance documentation
- Search functionality

### 5. Training Management Module 🚧
- Training records
- Course assignments
- Certificate generation
- Expiry tracking

### 6. Audit Management Module 🚧
- Audit scheduling
- Finding management
- Report generation
- Action item tracking

## 🚀 Quick Start

### Using the Standalone Version (Immediate)
1. Open `ohisee-platform-standalone.html` in any browser
2. The system connects directly to the live backend
3. All features are immediately available

### Local Development

#### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Environment Variables
Create `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=https://ohisee-backend.onrender.com
NEXT_PUBLIC_APP_NAME=Kangopak Confidential Reporting
NEXT_PUBLIC_COMPLIANCE_STANDARD=GMP
```

Create `.env` in backend:
```
PORT=5000
OPENAI_API_KEY=your-key-here
DATABASE_URL=postgresql-connection-string
```

## 🔒 Security Features

### AI Assistant Restrictions
The AI assistant is strictly limited to 4 functions:
1. **Improve Clarity**: Make text clearer and easier to understand
2. **Make Professional**: Convert to formal business tone
3. **Fix Grammar**: Correct spelling and grammar errors
4. **Create Summary**: Generate 2-3 sentence summaries

**No general chat or unrelated queries are allowed.**

### Data Protection
- JWT-based authentication (coming soon)
- Encrypted data transmission
- Audit logging of all actions
- Anonymous reporting option
- GDPR compliance features (planned)

## 📊 Database Schema

The system uses PostgreSQL with the following main tables:
- `users` - User authentication and profiles
- `reports` - Confidential reports
- `audit_logs` - Complete audit trail
- `ai_usage` - AI assistant usage tracking
- `sessions` - User session management
- Plus tables for each module's specific data

## 🌐 Deployment

### Current Production URLs
- **Frontend**: https://ohisee-platform-frontend.vercel.app ✅ LIVE
- **Backend API**: https://ohisee-backend.onrender.com ✅ LIVE
- **API Documentation**: https://ohisee-backend.onrender.com/api ✅ LIVE
- **Database**: PostgreSQL on Render (Pending setup)

### Deployment Services
- **Frontend**: Vercel (Free tier) ✅ Deployed
- **Backend**: Render (Free tier) ✅ Deployed
- **Database**: PostgreSQL on Render (Free tier) 🚧 Pending

## 📝 API Endpoints

### Public Endpoints
- `GET /` - API documentation
- `GET /health` - Health check
- `GET /api` - API information

### Report Endpoints
- `POST /api/reports` - Submit new report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get specific report

### AI Assistant Endpoints
- `POST /api/ai/assist` - Process text with AI
- `GET /api/ai/tasks` - Get available AI tasks

## 🛠️ Troubleshooting

### Common Issues

#### CORS Errors
- Use the standalone HTML file instead of opening local files
- Deploy to GitHub Pages or use a local server
- Ensure backend CORS configuration includes your domain

#### AI Assistant Not Working
- Verify OpenAI API key is configured in Render
- Check backend logs for API errors
- Ensure text is at least 10 characters

#### Report Submission Failing
- Check backend is running (https://ohisee-backend.onrender.com/health)
- Verify all required fields are filled
- Check browser console for errors

## 📚 Documentation

### For Developers
- See `todo.md` for development roadmap
- Check `DATABASE_SETUP.md` for database configuration
- Review `CLAUDE.md` for development workflow

### For Users
- User guide coming soon
- Training materials in development
- Video tutorials planned

## 🤝 Contributing

This is a private project for Kangopak. For internal contributions:
1. Follow the workflow in `CLAUDE.md`
2. Make simple, incremental changes
3. Test thoroughly before committing
4. Update documentation as needed

## 📄 License

Proprietary - Kangopak Internal Use Only

## 🏢 About Kangopak

Kangopak is committed to maintaining the highest standards of food safety and quality. OhiSee! supports our compliance efforts by providing secure, transparent, and efficient management of all compliance-related activities.

## 💬 Support

For support or questions:
- Internal IT Support: [Contact Details]
- System Administrator: [Contact Details]
- Compliance Team: safety@kangopak.com

## 🔄 Version History

### v1.1.0 (August 10, 2025)
- ✅ Full cloud deployment on Vercel and Render
- ✅ All 6 modules with proper navigation
- ✅ Updated button text for specificity ("Submit Confidential Report")
- ✅ Headers prioritize form purpose over branding
- ✅ Fixed all icon import issues (Handshake → Users)
- ✅ OhiSee! branding with Operations Intelligence Centre tagline
- ✅ Typography.md implementation with Poppins font
- ✅ Proper color scheme (#373658 primary, #C44940 secondary)

### v1.0.0
- Initial release with Confidential Reporting module
- AI Assistant with restricted functions
- Basic authentication structure
- Database schema for all modules

### Planned Updates
- v1.2.0: PostgreSQL database connection and user authentication
- v1.3.0: Email notifications and audit logging
- v1.4.0: Full module implementation (Quality, Supplier, Document, Training, Audit)
- v2.0.0: Mobile app and offline support

---

**Last Updated**: August 10, 2025
**Document Version**: 1.1.0
**Deployment Status**: Frontend ✅ | Backend ✅ | Database 🚧
**Compliance Standard**: GMP