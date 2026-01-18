# Quick Deployment Checklist

## Before You Start
- [ ] Code is committed to GitHub
- [ ] Backend and frontend both work locally
- [ ] You have accounts on Render.com and Netlify.com

## Step-by-Step (30 minutes)

### 1. Deploy Database (5 min)
- [ ] Go to Render.com → New PostgreSQL
- [ ] Name: `pharmacy-db`, Plan: Free
- [ ] Copy the External Database URL

### 2. Initialize Database (5 min)
```bash
cd backend
# Update .env with production DATABASE_URL
npm run init-db
npm run import-data
npm run count  # Verify data loaded
```

### 3. Deploy Backend (10 min)
- [ ] Render.com → New Web Service
- [ ] Connect GitHub repo
- [ ] Root Directory: `backend`
- [ ] Build: `npm install`, Start: `npm start`
- [ ] Add env var: `DATABASE_URL` (from step 1)
- [ ] Deploy and copy the URL (e.g., `https://pharmacy-api.onrender.com`)

### 4. Deploy Frontend (10 min)
- [ ] Netlify.com → New site from Git
- [ ] Connect GitHub repo
- [ ] Base directory: `frontend`
- [ ] Build: `npm run build`, Publish: `frontend/dist`
- [ ] Add env var: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com/api`
- [ ] Deploy and copy the URL

### 5. Update CORS (2 min)
- [ ] Render.com → Backend service → Environment
- [ ] Add: `FRONTEND_URL` = `https://your-site.netlify.app`
- [ ] Save (triggers redeploy)

### 6. Test Everything (5 min)
- [ ] Visit your Netlify URL
- [ ] Homepage loads with stats
- [ ] Click "Browse All Pharmacies"
- [ ] Search works
- [ ] Filters work
- [ ] Click a pharmacy → detail page loads
- [ ] Images display
- [ ] No errors in browser console

## Done! 🎉

Your app is live at: `https://your-site.netlify.app`

## URLs to Save
- Frontend: `https://________.netlify.app`
- Backend: `https://________.onrender.com`
- Database: `postgres://________`

## Common Issues

**Backend takes 30 seconds to load first time?**
→ Normal! Free tier spins down after inactivity. First request wakes it up.

**CORS error?**
→ Make sure FRONTEND_URL in backend matches your Netlify URL exactly (no trailing slash)

**No data showing?**
→ Check backend /api/stats endpoint. If empty, re-run `npm run import-data`

**Images not loading?**
→ Check browser console. Might be CORS on image URLs (Google Maps images)
