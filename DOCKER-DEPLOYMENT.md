# Pharmacy API - Docker Deployment Guide

## 📋 Overview

This guide explains how to deploy the Pharmacy API to your VPS dev server using Docker, following the same pattern as your chat-service project.

## 🏗️ Architecture

- **Network Mode**: `host` (connects to existing PostgreSQL on localhost)
- **Database**: Existing PostgreSQL on `localhost:5432`
- **Port**: `3001` (configurable)
- **API Prefix**: `/pharmacy/api`
- **Container Name**: `pharmacy-api`

## 📁 Files Overview

| File | Purpose | Usage |
|------|---------|-------|
| `Dockerfile` | Production image build | Build optimized production image |
| `docker-compose.server.yml` | Dev server deployment | Deploy on VPS with volume mounts |
| `docker-compose.prod.yml` | Production deployment | Deploy with built Docker image |

---

## 🚀 Deployment Steps

### Step 1: Prepare Your VPS

SSH into your VPS:
```bash
ssh user@your-vps-ip
```

Navigate to your deployment directory:
```bash
cd /path/to/deployment/pharmacy-project
```

### Step 2: Configure Environment

The `docker-compose.server.yml` is pre-configured with:
- Database: `pharmacy_db` on `localhost:5432`
- User: `kaha-dev`
- Password: `kaha-dev`
- Port: `3001`

**If your database credentials are different**, edit `docker-compose.server.yml`:
```yaml
environment:
  - DB_HOST=localhost
  - DB_PORT=5432
  - DB_USER=your-db-user        # Change this
  - DB_PASSWORD=your-db-pass    # Change this
  - DB_NAME=pharmacy_db         # Change this if needed
  - PORT=3001
```

### Step 3: Initialize Database

Before starting the API, create the database and import data:

```bash
# Create database (if not exists)
psql -U kaha-dev -h localhost -c "CREATE DATABASE pharmacy_db;"

# Initialize schema
cd backend
npm install
npm run init-db

# Import pharmacy data
npm run import-data
```

### Step 4: Deploy with Docker

```bash
cd backend

# Start the service
docker-compose -f docker-compose.server.yml up -d

# View logs
docker logs -f pharmacy-api

# Check status
docker ps | grep pharmacy
```

### Step 5: Verify Deployment

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

## 🔧 Configuration

### API Routes

All API routes use the prefix `/pharmacy/api`:

- `GET /health` - Health check (no prefix)
- `GET /pharmacy/api/pharmacies` - List pharmacies
- `GET /pharmacy/api/pharmacies/:id` - Get single pharmacy
- `GET /pharmacy/api/stats` - Get statistics

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `kaha-dev` | Database user |
| `DB_PASSWORD` | `kaha-dev` | Database password |
| `DB_NAME` | `pharmacy_db` | Database name |
| `PORT` | `3001` | API server port |
| `API_PREFIX` | `/pharmacy/api` | API route prefix |
| `FRONTEND_URL` | `https://dev.kaha.com.np` | CORS origin |

---

## 🔄 Common Operations

### View Logs
```bash
# Follow logs
docker logs -f pharmacy-api

# Last 100 lines
docker logs --tail 100 pharmacy-api
```

### Restart Service
```bash
docker-compose -f docker-compose.server.yml restart
```

### Stop Service
```bash
docker-compose -f docker-compose.server.yml down
```

### Update Code
```bash
# Pull latest code
git pull

# Restart container (it will reinstall dependencies)
docker-compose -f docker-compose.server.yml restart

# Or recreate container
docker-compose -f docker-compose.server.yml up -d --force-recreate
```

### Execute Commands in Container
```bash
# Access container shell
docker exec -it pharmacy-api sh

# Run database scripts
docker exec -it pharmacy-api npm run init-db
docker exec -it pharmacy-api npm run import-data
```

---

## 🏭 Production Deployment (Built Image)

For production with a built Docker image:

### Build Image
```bash
cd backend
docker-compose -f docker-compose.prod.yml build
```

### Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### View Logs
```bash
docker logs -f pharmacy-api-prod
```

---

## 🌐 Nginx Configuration

If you're using Nginx as a reverse proxy, add this configuration:

```nginx
# Pharmacy API
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

# Health check
location /pharmacy/health {
    proxy_pass http://localhost:3001/health;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

Then reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔍 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs pharmacy-api

# Check if port is in use
netstat -tulpn | grep 3001

# Remove and recreate
docker-compose -f docker-compose.server.yml down
docker-compose -f docker-compose.server.yml up -d
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U kaha-dev -h localhost -d pharmacy_db -c "SELECT 1;"

# Check if database exists
psql -U kaha-dev -h localhost -l | grep pharmacy_db

# Test from container
docker exec -it pharmacy-api sh
nc -zv localhost 5432
```

### API Not Accessible

```bash
# Check if container is running
docker ps | grep pharmacy

# Check if app is listening
curl http://localhost:3001/health

# Check network mode
docker inspect pharmacy-api | grep NetworkMode
```

### Import Data Issues

```bash
# Check if pharmacies.json exists
ls -lh ../scraper/pharmacies.json

# Run import manually
docker exec -it pharmacy-api npm run import-data

# Check database records
psql -U kaha-dev -h localhost -d pharmacy_db -c "SELECT COUNT(*) FROM pharmacies;"
```

---

## 📊 Monitoring

### Check Container Status
```bash
docker ps -a | grep pharmacy
```

### Check Resource Usage
```bash
docker stats pharmacy-api
```

### Check Health
```bash
# Docker healthcheck status
docker inspect pharmacy-api | grep -A 10 Health

# Manual health check
curl http://localhost:3001/health
```

---

## 🔐 Security Notes

1. **Change default credentials** in production
2. **Use environment files** for sensitive data
3. **Enable firewall** rules for port 3001
4. **Use HTTPS** with Nginx reverse proxy
5. **Restrict database access** to localhost only

---

## ✅ Deployment Checklist

- [ ] PostgreSQL is running on VPS
- [ ] Database `pharmacy_db` is created
- [ ] Database credentials are configured
- [ ] Pharmacy data is imported
- [ ] Docker container is running
- [ ] Health check returns OK
- [ ] API endpoints are accessible
- [ ] Nginx reverse proxy is configured (if using)
- [ ] CORS is configured for frontend domain
- [ ] Logs are being monitored

---

## 📞 Quick Reference

### Start Service
```bash
cd backend
docker-compose -f docker-compose.server.yml up -d
```

### View Logs
```bash
docker logs -f pharmacy-api
```

### Restart Service
```bash
docker-compose -f docker-compose.server.yml restart
```

### Stop Service
```bash
docker-compose -f docker-compose.server.yml down
```

### Test API
```bash
curl http://localhost:3001/health
curl http://localhost:3001/pharmacy/api/pharmacies?limit=5
```

---

**Status:** Ready to deploy! 🚀
