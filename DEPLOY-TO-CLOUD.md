# 🚀 Deploy to Cloud - Free Hosting

This guide will help you deploy your Confidential Reporting App to free cloud services in minutes!

## 📋 Prerequisites
- GitHub account (free at github.com)
- Vercel account (free at vercel.com) 
- Render account (free at render.com)

## Step 1: Push Code to GitHub

1. **Create a new GitHub repository**
   - Go to https://github.com/new
   - Name it: `ohisee-platform`
   - Make it public (for free hosting)
   - Don't initialize with README

2. **Push your code** (in Git Bash or terminal):
```bash
cd "C:\Users\mike\OneDrive\Confidential Reporting App\ohisee-platform"
git init
git add .
git commit -m "Initial commit - OhISee Confidential Reporting Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ohisee-platform.git
git push -u origin main
```

## Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Add New" → "Project"

2. **Import from GitHub**
   - Connect your GitHub account
   - Select `ohisee-platform` repository

3. **Configure Build Settings**
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL = https://ohisee-backend.onrender.com/api
   NEXT_PUBLIC_APP_NAME = OhISee Platform
   NEXT_PUBLIC_TENANT_ID = kangopak
   ```

5. **Click Deploy!**
   - Your frontend will be live at: `https://your-project.vercel.app`

## Step 3: Deploy Backend to Render

1. **Go to Render**
   - Visit https://render.com
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Connect your GitHub account
   - Select `ohisee-platform` repository

3. **Configure Service**:
   - Name: `ohisee-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Add Environment Variables**:
   ```
   NODE_ENV = production
   DATABASE_URL = mock
   JWT_SECRET = [auto-generate]
   CORS_ORIGIN = https://your-project.vercel.app
   ```

5. **Click Create Web Service**
   - Your backend will be live at: `https://ohisee-backend.onrender.com`

## Step 4: Update Frontend API URL

After backend is deployed:

1. Go back to Vercel Dashboard
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` with your Render backend URL
4. Redeploy frontend

## 🎉 That's It! Your App is Live!

### Your URLs:
- **Frontend**: `https://[your-project].vercel.app`
- **Backend API**: `https://ohisee-backend.onrender.com`
- **Health Check**: `https://ohisee-backend.onrender.com/health`

### Test Your Deployment:
1. Visit your frontend URL
2. Submit a test report
3. Note the reference number
4. Track the report using the reference

## 🆓 Free Tier Limits:
- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Render**: Web services spin down after 15 mins of inactivity (auto-restart on request)

## Optional: Custom Domain

Both Vercel and Render support custom domains for free:
- Vercel: Settings → Domains → Add your domain
- Render: Settings → Custom Domains → Add domain

## Troubleshooting

### Frontend not loading?
- Check Vercel build logs
- Verify environment variables are set
- Ensure `frontend` is selected as root directory

### Backend not responding?
- Check Render logs
- Backend may be sleeping (free tier) - wait 30s for cold start
- Verify CORS_ORIGIN matches your Vercel URL

### CORS errors?
Update backend's CORS_ORIGIN environment variable to match your Vercel frontend URL

## Next Steps

Once deployed, you can:
1. Add a PostgreSQL database (free tier at ElephantSQL or Supabase)
2. Set up SendGrid for emails (free tier: 100 emails/day)
3. Add OpenAI API for enhanced AI features
4. Configure custom domain

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Check the logs in both dashboards for errors