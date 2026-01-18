# Deployment Configuration Comparison

## Chat Service vs Pharmacy API

This document shows how the pharmacy project deployment was configured based on the chat-service reference project.

---

## 🔄 Key Adaptations

### 1. API Routing

| Aspect | Chat Service | Pharmacy API |
|--------|-------------|--------------|
| **Framework** | NestJS (TypeScript) | Express (Node.js) |
| **Global Prefix** | `/chatnew/api` | `/pharmacy/api` |
| **Port** | `4009` | `3001` |
| **Container Name** | `chatnew` | `pharmacy-api` |
| **Swagger Docs** | `/chatnew/api/v1/docs` | N/A (can be added) |

### 2. Database Configuration

| Aspect | Chat Service | Pharmacy API |
|--------|-------------|--------------|
| **Database Name** | `world_chat_db` | `pharmacy_db` |
| **User** | `kaha-dev` | `kaha-dev` |
| **Password** | `kaha-dev` | `kaha-dev` |
| **Host** | `localhost` | `localhost` |
| **Port** | `5432` | `5432` |
| **Additional** | Uses Redis (port 6379) | PostgreSQL only |

### 3. Docker Configuration

Both projects use the same Docker pattern:

```yaml
network_mode: host          # Connect to existing services on localhost
restart: unless-stopped     # Auto-restart on failure
```

---

## 📁 File Structure Comparison

### Chat Service
```
chat-service/
├── Dockerfile
├── docker-compose.yml              # Local PostgreSQL + Redis
├── docker-compose.local.yml        # Local app container
├── docker-compose.server.yml       # Dev server deployment ✅
├── docker-compose.prod.yml         # Production build ✅
├── src/
│   └── main.ts                     # NestJS entry point
└── DOCKER_SETUP.md
```

### Pharmacy API (Created)
```
pharmacy-project/backend/
├── Dockerfile                      # ✅ Created (adapted)
├── docker-compose.server.yml       # ✅ Created (adapted)
├── docker-compose.prod.yml         # ✅ Created (adapted)
├── server.js                       # Express entry point
├── .env.production                 # ✅ Created
└── DOCKER-DEPLOYMENT.md            # ✅ Created
```

---

## 🔧 Configuration Details

### Dockerfile Comparison

**Chat Service:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build                    # TypeScript build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist # Copy built files
CMD ["node", "dist/main"]            # Run compiled JS
```

**Pharmacy API:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# No build step (already JavaScript)

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/*.js ./     # Copy JS files
COPY --from=builder /app/scripts ./scripts
CMD ["node", "server.js"]            # Run directly
```

**Key Difference:** Pharmacy API doesn't need TypeScript compilation.

---

### docker-compose.server.yml Comparison

**Chat Service:**
```yaml
services:
  chat-api:
    image: node:20-alpine
    container_name: chatnew
    working_dir: /app
    network_mode: host
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_HOST=localhost
      - DATABASE_PORT=5432
      - DATABASE_USERNAME=kaha-dev
      - DATABASE_PASSWORD=kaha-dev
      - DATABASE_NAME=world_chat_db
      - REDIS_HOST=localhost
      - REDIS_PORT=6379
      - REDIS_DB=2
      - JWT_SECRET=secret
      - PORT=4009
      - KAHA_API_URL=https://dev.kaha.com.np/main/api/v3
      - KAHA_SERVICE_TOKEN=
      - KAHA_MOCK=false
    command: sh -c "npm install && npm run start:dev"
    restart: unless-stopped
```

**Pharmacy API:**
```yaml
services:
  pharmacy-api:
    image: node:20-alpine
    container_name: pharmacy-api
    working_dir: /app
    network_mode: host
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=production
      - DB_HOST=localhost
      - DB_PORT=5432
      - DB_USER=kaha-dev
      - DB_PASSWORD=kaha-dev
      - DB_NAME=pharmacy_db
      - PORT=3001
      - FRONTEND_URL=https://dev.kaha.com.np
    command: sh -c "npm install && npm start"
    restart: unless-stopped
```

**Key Differences:**
- Removed Redis configuration (not needed)
- Removed JWT and external API configs (not needed)
- Simplified environment variables
- Changed database name and port

---

### docker-compose.prod.yml Comparison

**Chat Service:**
```yaml
services:
  chat-api:
    build:
      context: .
      dockerfile: Dockerfile
    image: kaha-chat-api:latest
    container_name: chatnew-prod
    network_mode: host
    environment:
      # ... environment variables
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", 
             "http://localhost:4009/chat/api/v1/docs"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**Pharmacy API:**
```yaml
services:
  pharmacy-api:
    build:
      context: .
      dockerfile: Dockerfile
    image: kaha-pharmacy-api:latest
    container_name: pharmacy-api-prod
    network_mode: host
    environment:
      # ... environment variables
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", 
             "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**Key Difference:** Healthcheck endpoint changed from `/chat/api/v1/docs` to `/health`.

---

## 🚀 Deployment Commands

### Chat Service
```bash
# Dev server
docker-compose -f docker-compose.server.yml up -d
docker logs -f chatnew

# Production
docker-compose -f docker-compose.prod.yml up -d --build
docker logs -f chatnew-prod
```

### Pharmacy API
```bash
# Dev server
docker-compose -f docker-compose.server.yml up -d
docker logs -f pharmacy-api

# Production
docker-compose -f docker-compose.prod.yml up -d --build
docker logs -f pharmacy-api-prod
```

---

## 🌐 Nginx Routing

Both services follow the same Nginx pattern:

### Chat Service
```nginx
location /chatnew/api/ {
    proxy_pass http://localhost:4009/chatnew/api/;
    # ... proxy headers
}
```

### Pharmacy API
```nginx
location /pharmacy/api/ {
    proxy_pass http://localhost:3001/pharmacy/api/;
    # ... proxy headers
}
```

---

## 📊 What Was Kept the Same

✅ **Network Mode:** `host` (connects to existing PostgreSQL)  
✅ **Database Host:** `localhost`  
✅ **Database User:** `kaha-dev`  
✅ **Restart Policy:** `unless-stopped`  
✅ **Node Version:** `20-alpine`  
✅ **Volume Mounts:** Same pattern for dev server  
✅ **Healthcheck:** Same pattern, different endpoint  

---

## 🔄 What Was Changed

🔄 **Container Name:** `chatnew` → `pharmacy-api`  
🔄 **Port:** `4009` → `3001`  
🔄 **API Prefix:** `/chatnew/api` → `/pharmacy/api`  
🔄 **Database Name:** `world_chat_db` → `pharmacy_db`  
🔄 **Removed:** Redis, JWT, external API configs  
🔄 **Healthcheck:** `/chat/api/v1/docs` → `/health`  

---

## ✅ Deployment Checklist

Based on chat-service deployment:

- [x] Dockerfile created
- [x] docker-compose.server.yml created
- [x] docker-compose.prod.yml created
- [x] API prefix configured in code
- [x] Environment variables configured
- [x] Health check endpoint available
- [x] Database connection configured
- [x] Documentation created

**Next Steps:**
1. Upload to VPS
2. Configure database credentials
3. Initialize database schema
4. Import pharmacy data
5. Start Docker container
6. Configure Nginx (if needed)
7. Test API endpoints

---

## 📝 Notes

1. **Network Mode:** Using `host` mode means the container shares the host's network, allowing direct access to PostgreSQL on localhost without Docker networking complexity.

2. **Volume Mounts:** In dev server mode, code is mounted as a volume so changes are reflected without rebuilding.

3. **Production Build:** In production mode, code is baked into the Docker image for better performance and security.

4. **Port Selection:** Port `3001` was chosen to avoid conflicts with other services. Can be changed via environment variable.

5. **Database:** Assumes PostgreSQL is already running on the VPS. No need to start it in Docker.

---

**Status:** Configuration complete and ready for deployment! 🚀
