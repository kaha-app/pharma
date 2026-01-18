# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application files
COPY --from=builder /app/*.js ./
COPY --from=builder /app/scripts ./scripts

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
