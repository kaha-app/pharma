# Deployment Guide

## Overview

This guide covers deploying the Pharmacy Finder application:
- **Frontend**: Netlify (React app)
- **Backend**: Render.com (Node.js API)
- **Database**: Render PostgreSQL or Supabase

---

## Part 1: Deploy Database

### Option A: Render PostgreSQL (Recommended - Free Tier)

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `pharmacy-db`
   - **Database**: `pharmacy`
   - **User**: `pharmacy_user`
   - **Region**: Oregon (or closest to you)
   - **Plan**: Free
4. Click "Create Database"
5. Wait for provisioning (2-3 minutes)
6. Copy the **External Database URL** (starts with `postgres://`)

### Option B: Supabase (Alternative)

1. Go to [Supabase.com](https://supabase.com) and sign up
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (URI format)

---

## Part 2: Initialize Database

### Local Setup First

1. Update your local `.env` with the production database URL:
```bash
cd backend
# Edit .env file with production database credentials
```

2. Initialize the database schema:
```bash
npm run init-db
```

3. Import your pharmacy data:
```bash
npm run import-data
```

4. Verify data:
```bash
npm run count
```

---

## Part 3: Deploy Backend API

### Using Render.com (Recommended)

1. Push your code to GitHub (if not already)

2. Go to [Render.com](https://render.com)

3. Click "New +" → "Web Service"

4. Connect your GitHub repository

5. Configure:
   - **Name**: `pharmacy-api`
   - **Region**: Oregon (same as database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<paste your database URL from Part 1>
   ```

7. Click "Create Web Service"

8. Wait for deployment (3-5 minutes)

9. Copy your backend URL (e.g., `https://pharmacy-api.onrender.com`)

### Using Railway (Alternative)

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add PostgreSQL service
5. Configure environment variables
6. Deploy

---

## Part 4: Deploy Frontend to Netlify

### Method 1: Netlify UI (Easiest)

1. Go to [Netlify.com](https://netlify.com) and sign up

2. Click "Add new site" → "Import an existing project"

3. Connect to GitHub and select your repository

4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

5. Add Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   (Use the URL from Part 3, step 9)

6. Click "Deploy site"

7. Wait for deployment (2-3 minutes)

8. Your site will be live at `https://random-name.netlify.app`

9. (Optional) Configure custom domain in Site settings

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to frontend
cd frontend

# Build the app
npm run build

# Deploy
netlify deploy --prod

# Follow prompts:
# - Create new site or link existing
# - Publish directory: dist
```

---

## Part 5: Update Backend CORS

After deploying frontend, update backend environment variable:

1. Go to Render.com → Your backend service
2. Environment → Add variable:
   ```
   FRONTEND_URL=https://your-site.netlify.app
   ```
3. Save (will trigger redeploy)

---

## Part 6: Verify Deployment

### Test Backend API

```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Get pharmacies
curl https://your-backend-url.onrender.com/api/pharmacies?limit=5

# Get stats
curl https://your-backend-url.onrender.com/api/stats
```

### Test Frontend

1. Visit your Netlify URL
2. Check homepage loads
3. Navigate to `/pharmacies`
4. Try search and filters
5. Click a pharmacy to view details
6. Check browser console for errors

---

## Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to database"
- Check DATABASE_URL is correct in Render environment variables
- Verify database is running on Render
- Check database allows external connections

**Problem**: "CORS error"
- Add FRONTEND_URL environment variable to backend
- Verify URL matches your Netlify domain exactly

**Problem**: "No data returned"
- Run import script again: `npm run import-data`
- Check database has records: `npm run count`

### Frontend Issues

**Problem**: "Failed to fetch pharmacies"
- Check VITE_API_BASE_URL is correct
- Verify backend is running (visit /health endpoint)
- Check browser console for CORS errors

**Problem**: "404 on page refresh"
- Verify `netlify.toml` is in frontend directory
- Check redirects are configured

**Problem**: "Environment variable not working"
- Rebuild site after adding env vars
- Verify variable name starts with `VITE_`

---

## Free Tier Limits

### Render.com
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ PostgreSQL: 1GB storage, 97 connection limit
- ⚠️ Services spin down after 15 min inactivity (cold starts)

### Netlify
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites

### Tips for Free Tier
- Backend may have cold starts (15-30 sec first request)
- Consider upgrading if you get significant traffic
- Monitor usage in dashboards

---

## Production Checklist

- [ ] Database deployed and initialized
- [ ] Backend API deployed and accessible
- [ ] Frontend deployed to Netlify
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] All pages load correctly
- [ ] Search and filters work
- [ ] Detail pages accessible
- [ ] Images load properly
- [ ] No console errors
- [ ] Custom domain configured (optional)

---

## Updating After Deployment

### Update Backend
1. Push changes to GitHub
2. Render auto-deploys from main branch
3. Or manually trigger deploy in Render dashboard

### Update Frontend
1. Push changes to GitHub
2. Netlify auto-deploys from main branch
3. Or manually trigger deploy in Netlify dashboard

### Update Database Schema
1. Connect to production database
2. Run migration scripts carefully
3. Test thoroughly before deploying

---

## Cost Estimates

### Free Tier (Current Setup)
- **Total**: $0/month
- Render: Free tier
- Netlify: Free tier
- Database: Free tier

### If You Outgrow Free Tier
- **Render Starter**: $7/month (backend)
- **Render PostgreSQL**: $7/month (database)
- **Netlify Pro**: $19/month (optional, for better features)
- **Total**: ~$14-33/month

---

## Support

- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- PostgreSQL Docs: https://www.postgresql.org/docs/

## Next Steps

After successful deployment:
1. Set up monitoring (Render has built-in metrics)
2. Configure custom domain
3. Set up SSL (automatic on both platforms)
4. Add analytics (Google Analytics, Plausible, etc.)
5. Set up error tracking (Sentry)
