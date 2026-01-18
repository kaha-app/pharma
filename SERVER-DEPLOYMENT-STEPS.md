# Server Deployment - Step by Step

## 🎯 Quick Deployment Guide

Follow these exact steps after SSHing into your VPS.

---

## Step 1: SSH into Server

```bash
ssh user@your-server-ip
```

---

## Step 2: Navigate to Deployment Directory

```bash
cd /path/to/your/deployment/directory
```

---

## Step 3: Pull Latest Code

```bash
git pull origin main
```

Or if you're uploading files manually, skip this step.

---

## Step 4: Go to Backend Directory

```bash
cd pharmacy-project/backend
```

---

## Step 5: Check Database Connection

Make sure PostgreSQL is running and accessible:

```bash
psql -U kaha-dev -h localhost -d pharmacy_db -c "SELECT 1;"
```

If database doesn't exist, create it:

```bash
psql -U kaha-dev -h localhost -c "CREATE DATABASE pharmacy_db;"
```

---

## Step 6: Initialize Database (First Time Only)

```bash
# Install dependencies
npm install

# Create tables
npm run init-db

# Import pharmacy data
npm run import-data
```

---

## Step 7: Start Docker Container

```bash
docker-compose -f docker-compose.server.yml up -d
```

That's it! The container will:
- Install npm dependencies automatically
- Start the API server on port 3001
- Connect to your existing PostgreSQL database

---

## Step 8: Verify Deployment

Check if container is running:

```bash
docker ps | grep pharmacy
```

View logs:

```bash
docker logs -f pharmacy-api
```

Test the API:

```bash
# Health check
curl http://localhost:3001/health

# List pharmacies
curl http://localhost:3001/pharmacy/api/pharmacies?limit=5

# Get stats
curl http://localhost:3001/pharmacy/api/stats
```

---

## 🔄 Common Commands

### View Logs
```bash
docker logs -f pharmacy-api
```

### Restart Container
```bash
docker-compose -f docker-compose.server.yml restart
```

### Stop Container
```bash
docker-compose -f docker-compose.server.yml down
```

### Update Code and Restart
```bash
git pull
docker-compose -f docker-compose.server.yml restart
```

### Rebuild Container (if needed)
```bash
docker-compose -f docker-compose.server.yml up -d --force-recreate
```

---

## 🌐 Configure Nginx (If Using Reverse Proxy)

If you want to access the API via domain (e.g., `https://dev.kaha.com.np/pharmacy/api/`):

1. Edit Nginx config:
```bash
sudo nano /etc/nginx/sites-available/your-site
```

2. Add this location block:
```nginx
location /pharmacy/api/ {
    proxy_pass http://localhost:3001/pharmacy/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

location /pharmacy/health {
    proxy_pass http://localhost:3001/health;
}
```

3. Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ⚙️ Environment Configuration

The default configuration in `docker-compose.server.yml`:

```yaml
DB_HOST=localhost
DB_PORT=5432
DB_USER=kaha-dev
DB_PASSWORD=kaha-dev
DB_NAME=pharmacy_db
PORT=3001
```

**If your database credentials are different**, edit the file:

```bash
nano docker-compose.server.yml
```

Change the environment variables, then restart:

```bash
docker-compose -f docker-compose.server.yml up -d
```

---

## 🚨 Troubleshooting

### Container won't start
```bash
# Check logs
docker logs pharmacy-api

# Check if port 3001 is already in use
netstat -tulpn | grep 3001

# Remove and recreate
docker-compose -f docker-compose.server.yml down
docker-compose -f docker-compose.server.yml up -d
```

### Database connection failed
```bash
# Test PostgreSQL connection
psql -U kaha-dev -h localhost -d pharmacy_db -c "SELECT 1;"

# Check if database exists
psql -U kaha-dev -h localhost -l | grep pharmacy_db

# Check database from inside container
docker exec -it pharmacy-api sh
nc -zv localhost 5432
```

### API returns 404
```bash
# Make sure you're using the correct prefix
curl http://localhost:3001/pharmacy/api/pharmacies

# Not this:
# curl http://localhost:3001/api/pharmacies  ❌
```

---

## ✅ Deployment Checklist

- [ ] SSH into server
- [ ] Pull latest code
- [ ] PostgreSQL is running
- [ ] Database `pharmacy_db` exists
- [ ] Database has pharmacy data
- [ ] Run `docker-compose -f docker-compose.server.yml up -d`
- [ ] Check logs: `docker logs -f pharmacy-api`
- [ ] Test health: `curl http://localhost:3001/health`
- [ ] Test API: `curl http://localhost:3001/pharmacy/api/pharmacies?limit=5`
- [ ] Configure Nginx (if needed)

---

## 📋 One-Line Deployment

If everything is already set up:

```bash
cd pharmacy-project/backend && docker-compose -f docker-compose.server.yml up -d && docker logs -f pharmacy-api
```

---

**That's it! Your API should now be running on the server.** 🚀
