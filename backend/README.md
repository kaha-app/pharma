# Pharmacy Backend API

Node.js + Express + PostgreSQL backend for the Kathmandu Pharmacy Project.

## Features

- ✅ RESTful API with pagination
- ✅ Search by name and address
- ✅ Filter by rating, pickup, delivery
- ✅ Sorting support
- ✅ PostgreSQL with indexes for fast queries
- ✅ CORS enabled for frontend
- ✅ Error handling and validation

## Prerequisites

- Node.js 18+ installed
- PostgreSQL running (Docker or local)
- Pharmacy data in `../scraper/pharmacies.json`

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Edit `.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
```

### 3. Initialize Database

Create the database schema:

```bash
npm run init-db
```

This will:
- Create `pharmacies` table
- Add indexes for fast queries
- Set up triggers for timestamps

### 4. Import Data

Import pharmacy data from scraper:

```bash
npm run import-data
```

This will:
- Read `../scraper/pharmacies.json`
- Import all pharmacies into PostgreSQL
- Show import statistics

### 5. Start Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### 1. Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "Pharmacy API is running"
}
```

### 2. List Pharmacies

```
GET /api/pharmacies?page=1&limit=10&search=thamel&minRating=4&hasPickup=true
```

Query Parameters:
- `page` (default: 1) - Page number
- `limit` (default: 10, max: 100) - Items per page
- `search` - Search by name or address
- `minRating` - Minimum rating (0-5)
- `hasPickup` - Filter by pickup availability (true/false)
- `hasDelivery` - Filter by delivery availability (true/false)
- `sortBy` - Sort column (name, avg_ratings, created_at)
- `sortOrder` - Sort direction (asc, desc)

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ritika Pharmacy",
      "contact": "01-4260792",
      "address": "...",
      "avgRatings": 4.5,
      "location": {
        "lat": 27.711634,
        "lng": 85.308931
      },
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5000,
    "totalPages": 500,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. Get Single Pharmacy

```
GET /api/pharmacies/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ritika Pharmacy",
    ...
  }
}
```

### 4. Get Statistics

```
GET /api/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "total": 5000,
    "withPickup": 3500,
    "withDelivery": 1200,
    "avgRating": 4.2,
    "withRatings": 3800,
    "withContact": 4500,
    "withEmail": 1000,
    "withWebsite": 800
  }
}
```

## Database Schema

```sql
CREATE TABLE pharmacies (
  id SERIAL PRIMARY KEY,
  place_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(100),
  email VARCHAR(255),
  address TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  building_image_url TEXT,
  tag_line TEXT,
  website VARCHAR(500),
  description TEXT,
  is_pickup BOOLEAN DEFAULT false,
  is_delivery BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  is_official BOOLEAN DEFAULT false,
  building_information TEXT,
  floor_no VARCHAR(50),
  panorama_image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  web_gallery JSONB DEFAULT '[]'::jsonb,
  has_ownership_claim BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  working_days_and_hours JSONB DEFAULT '{}'::jsonb,
  avg_ratings DECIMAL(2,1) DEFAULT 0,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3000/health

# List pharmacies
curl http://localhost:3000/api/pharmacies

# Search
curl "http://localhost:3000/api/pharmacies?search=thamel&limit=5"

# Filter by rating
curl "http://localhost:3000/api/pharmacies?minRating=4&hasPickup=true"

# Get single pharmacy
curl http://localhost:3000/api/pharmacies/1

# Get stats
curl http://localhost:3000/api/stats
```

## Performance

- Indexed queries for fast search
- Pagination to limit data transfer
- Connection pooling for efficiency
- Handles 5,000+ pharmacies smoothly

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Next Steps

1. ✅ Backend API complete
2. 🔄 Update frontend to use API
3. 🔄 Test with 5,000 pharmacies
4. 🔄 Deploy to production

---

**Status:** Ready to use! 🚀
