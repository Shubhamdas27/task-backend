# 🚀 RENDER DEPLOYMENT INSTRUCTIONS

## Quick Deploy Your Backend to Render

### Step 1: Go to Render
1. Visit: https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account

### Step 2: Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect GitHub" if not already connected
4. Find and select repository: `Shubhamdas27/task-backend`
5. Click "Connect"

### Step 3: Configure Your Service
Fill in these settings:

**Basic Settings:**
- Name: `taskflow-backend` (or any name you prefer)
- Region: `Oregon (US West)` (recommended)
- Branch: `main`
- Runtime: `Node`

**Build & Deploy:**
- Build Command: `npm install`
- Start Command: `npm start`

### Step 4: Add Environment Variables
Click "Advanced" → "Add Environment Variable" and add these one by one:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://shubham:272004@cluster0.viihvbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=taskflow-prod
JWT_SECRET=shubhamdas12345678
JWT_EXPIRE=30d
FRONTEND_URL=https://task-nine-rouge.vercel.app
LOCAL_FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (usually 2-5 minutes)
3. Your backend will be available at: `https://taskflow-backend-XXXX.onrender.com`

### Step 6: Update Your Frontend
Once deployed, you'll need to update your Vercel frontend to use the new API URL:

1. Go to your Vercel dashboard
2. Update the API base URL in your frontend code
3. Redeploy your frontend

### Step 7: Test Your Deployment
Test these endpoints:

1. **Health Check:**
   `https://your-render-url.onrender.com/api/health`

2. **Register Test:**
   ```bash
   curl -X POST https://your-render-url.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

## 🎯 Expected Result
- Your backend API will be live on Render
- All routes will work with your Vercel frontend
- Database connections will be maintained
- CORS will be properly configured

## 🔧 Troubleshooting
- If deployment fails, check the logs in Render dashboard
- Ensure all environment variables are correctly set
- MongoDB connection string should be valid
- Check if your GitHub repository is accessible

## 📞 Support
If you encounter any issues, the Render dashboard provides detailed logs and error messages to help debug deployment problems.

---
**Repository**: https://github.com/Shubhamdas27/task-backend.git
**Frontend**: https://task-nine-rouge.vercel.app/