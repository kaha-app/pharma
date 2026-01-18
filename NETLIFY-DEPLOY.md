# Deploy Frontend to Netlify

## Setup Instructions

Since you have a monorepo (both frontend and backend in one repo), Netlify needs to know which folder to deploy.

### Option 1: Deploy via Netlify UI (Recommended)

1. **Go to Netlify** → https://app.netlify.com/
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to GitHub** and select your `pharma` repository
4. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
   - **Environment variables:** (Add these)
     - `VITE_API_BASE_URL` = `https://dev.kaha.com.np/pharmacy/api/v1`

5. **Click "Deploy site"**

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Go to frontend folder
cd frontend

# Deploy
netlify deploy --prod
```

---

## Important: Monorepo Configuration

The `netlify.toml` file is already configured with:

```toml
[build]
  base = "frontend"              # Tells Netlify to work from frontend folder
  command = "npm run build"      # Build command
  publish = "frontend/dist"      # Where the built files are
```

This tells Netlify:
- Start in the `frontend` folder
- Run `npm install` and `npm run build` there
- Publish the `dist` folder

---

## After Deployment

1. Netlify will give you a URL like: `https://your-app-name.netlify.app`
2. Test the site - it should connect to `https://dev.kaha.com.np/pharmacy/api/v1`
3. You can add a custom domain later in Netlify settings

---

## Troubleshooting

### Build fails with "command not found"
- Make sure `package.json` exists in the `frontend` folder
- Check that `npm run build` works locally

### API calls fail (CORS errors)
- Make sure the backend Nginx is configured to allow your Netlify domain
- Add your Netlify URL to the backend's CORS settings

### Environment variables not working
- Go to Netlify dashboard → Site settings → Environment variables
- Add `VITE_API_BASE_URL` = `https://dev.kaha.com.np/pharmacy/api/v1`
- Redeploy the site

---

## Current Configuration

✅ Frontend `.env` updated to use dev server API
✅ Frontend `.env.production` updated to use dev server API  
✅ `netlify.toml` configured for monorepo deployment
✅ Backend API running at `https://dev.kaha.com.np/pharmacy/api/v1`

**Ready to deploy!** 🚀
