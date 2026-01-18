#!/bin/bash

# Pharmacy API Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e

MODE=${1:-dev}

echo "🚀 Deploying Pharmacy API in $MODE mode..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if PostgreSQL is accessible
if ! nc -zv localhost 5432 2>&1 | grep -q succeeded; then
    echo "⚠️  Warning: PostgreSQL might not be running on localhost:5432"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if [ "$MODE" = "prod" ]; then
    echo "📦 Building production image..."
    docker-compose -f docker-compose.prod.yml build
    
    echo "🚀 Starting production container..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "⏳ Waiting for container to start..."
    sleep 5
    
    echo "📋 Container logs:"
    docker logs --tail 20 pharmacy-api-prod
    
    echo ""
    echo "✅ Production deployment complete!"
    echo "📍 API: http://localhost:3001/pharmacy/api/pharmacies"
    echo "📍 Health: http://localhost:3001/health"
    echo "📋 Logs: docker logs -f pharmacy-api-prod"
    
else
    echo "🚀 Starting dev server container..."
    docker-compose -f docker-compose.server.yml up -d
    
    echo "⏳ Waiting for container to start..."
    sleep 5
    
    echo "📋 Container logs:"
    docker logs --tail 20 pharmacy-api
    
    echo ""
    echo "✅ Dev server deployment complete!"
    echo "📍 API: http://localhost:3001/pharmacy/api/pharmacies"
    echo "📍 Health: http://localhost:3001/health"
    echo "📋 Logs: docker logs -f pharmacy-api"
fi

echo ""
echo "🧪 Testing health endpoint..."
sleep 2
if curl -s http://localhost:3001/health | grep -q "ok"; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check failed. Check logs for details."
fi
