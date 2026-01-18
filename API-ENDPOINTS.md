# 📡 API Endpoints Reference

Quick reference for all available API endpoints.

---

## Base URL
```
http://localhost:3000
```

---

## Endpoints

### 1️⃣ Health Check

**Endpoint:** `GET /health`

**Description:** Check if API is running

**Response:**
```json
{
  "status": "ok",
  "message": "Pharmacy API is running"
}
```

**Example:**
```
http://localhost:3000/health
```

---

### 2️⃣ List Pharmacies

**Endpoint:** `GET /api/pharmacies`

**Description:** Get paginated list of pharmacies with search and filters

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max: 100) |
| `search` | string | - | Search by name or address |
| `minRating` | number | 0 | Minimum rating (0-5) |
| `hasPickup` | boolean | - | Filter by pickup availability |
| `hasDelivery` | boolean | - | Filter by delivery availability |
| `sortBy` | string | name | Sort column (name, avg_ratings, created_at) |
| `sortOrder` | string | asc | Sort direction (asc, desc) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "placeId": "...",
      "name": "Ritika Pharmacy",
      "contact": "01-4260792",
      "email": null,
      "address": "P865+MH3 Ritika Pharmacy, JP Rd, Kathmandu 44600",
      "avatarUrl": "https://...",
      "coverImageUrl": "https://...",
      "buildingImageUrl": "https://...",
      "isPickup": false,
      "isDelivery": false,
      "avgRatings": "4.5",
      "workingDaysAndHours": {
        "Monday": ["8 AM–10 PM"],
        "Tuesday": ["8 AM–10 PM"]
      },
      "gallery": ["https://...", "https://..."],
      "location": {
        "lat": 27.711634,
        "lng": 85.308931
      },
      "createdAt": "2026-01-18T03:30:17.277Z",
      "updatedAt": "2026-01-18T03:30:17.277Z"
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

**Examples:**

```bash
# Get first page (10 items)
http://localhost:3000/api/pharmacies

# Get page 2 with 20 items
http://localhost:3000/api/pharmacies?page=2&limit=20

# Search for "thamel"
http://localhost:3000/api/pharmacies?search=thamel

# Filter by rating (4+ stars)
http://localhost:3000/api/pharmacies?minRating=4

# Filter by delivery
http://localhost:3000/api/pharmacies?hasDelivery=true

# Combine filters
http://localhost:3000/api/pharmacies?search=thamel&minRating=4&hasDelivery=true&limit=5

# Sort by rating (highest first)
http://localhost:3000/api/pharmacies?sortBy=avg_ratings&sortOrder=desc
```

---

### 3️⃣ Get Single Pharmacy

**Endpoint:** `GET /api/pharmacies/:id`

**Description:** Get detailed information about a specific pharmacy

**Parameters:**
- `id` (path parameter) - Pharmacy ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "placeId": "...",
    "name": "Ritika Pharmacy",
    "contact": "01-4260792",
    "email": null,
    "address": "P865+MH3 Ritika Pharmacy, JP Rd, Kathmandu 44600",
    "avatarUrl": "https://...",
    "coverImageUrl": "https://...",
    "buildingImageUrl": "https://...",
    "tagLine": null,
    "website": null,
    "description": null,
    "isPickup": false,
    "isDelivery": false,
    "isAvailable": true,
    "isVisible": true,
    "isOfficial": false,
    "buildingInformation": "P865+MH3, JP Rd",
    "floorNo": null,
    "panoramaImageUrl": null,
    "gallery": ["https://...", "https://..."],
    "webGallery": [],
    "hasOwnershipClaim": false,
    "status": "active",
    "workingDaysAndHours": {
      "Monday": ["8 AM–10 PM"],
      "Tuesday": ["8 AM–10 PM"]
    },
    "avgRatings": "4.5",
    "location": {
      "lat": 27.711634,
      "lng": 85.308931
    },
    "createdAt": "2026-01-18T03:30:17.277Z",
    "updatedAt": "2026-01-18T03:30:17.277Z"
  }
}
```

**Example:**
```
http://localhost:3000/api/pharmacies/1
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Pharmacy not found"
}
```

---

### 4️⃣ Get Statistics

**Endpoint:** `GET /api/stats`

**Description:** Get overall statistics about pharmacies in the database

**Response:**
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

**Example:**
```
http://localhost:3000/api/stats
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `404` - Not found
- `500` - Server error

---

## Testing with PowerShell

```powershell
# Health check
(Invoke-WebRequest -Uri http://localhost:3000/health -UseBasicParsing).Content

# List pharmacies
(Invoke-WebRequest -Uri "http://localhost:3000/api/pharmacies?limit=5" -UseBasicParsing).Content

# Search
(Invoke-WebRequest -Uri "http://localhost:3000/api/pharmacies?search=thamel" -UseBasicParsing).Content

# Get single pharmacy
(Invoke-WebRequest -Uri http://localhost:3000/api/pharmacies/1 -UseBasicParsing).Content

# Get stats
(Invoke-WebRequest -Uri http://localhost:3000/api/stats -UseBasicParsing).Content
```

---

## Testing with Browser

Just open these URLs:
- http://localhost:3000/health
- http://localhost:3000/api/pharmacies
- http://localhost:3000/api/pharmacies?search=thamel
- http://localhost:3000/api/pharmacies/1
- http://localhost:3000/api/stats

---

## Response Times

With PostgreSQL and proper indexes:
- Health check: < 5ms
- List pharmacies: < 50ms
- Search: < 50ms
- Get single: < 10ms
- Stats: < 30ms

---

*API is ready to handle 5,000+ pharmacies! 🚀*
