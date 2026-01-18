# Kathmandu Pharmacy Data Project

## 🎯 Vision & Purpose

**Main Goal:** Build a comprehensive database of ~5,000 pharmacies in Kathmandu with precise building-level coordinates and rich metadata, visualized through a premium React application.

**Why This Matters:**
- Provide accurate, validated pharmacy location data for Kathmandu residents
- Enable easy discovery of nearby pharmacies with real contact information
- Create a reliable, searchable database with working hours, ratings, and images
- Demonstrate data quality through beautiful, professional visualization

---

## 📊 Current Status

### ✅ Completed (Phase 1: Data Scraping Infrastructure)

**Date:** January 17, 2026

1. **Docker Scraper Setup**
   - Tool: `gosom/google-maps-scraper:latest-rod`
   - Successfully tested with 20 pharmacies from Thamel
   - Validated coordinates are precise and accurate

2. **Search Strategy**
   - 20 major Kathmandu areas identified
   - 3 search terms per area: "pharmacy", "medical store", "aushadhi pasal" (Nepali)
   - Total: 50 search queries in `input.txt`

3. **Data Processing Pipeline**
   - Built `process-pharmacies.js` script
   - Features:
     - CSV → JSON transformation
     - Field mapping to target schema
     - Deduplication by Google Place ID
     - Coordinate validation (Kathmandu bounds: lat 27.5-27.85, lng 85.15-85.55)
   - Successfully processed test data: 20 pharmacies

4. **Output Schema Defined**
   ```json
   {
     "name": "string",
     "contact": "string",
     "email": "string",
     "address": "string",
     "avatarUrl": "string",
     "coverImageUrl": "string",
     "buildingImageUrl": "string",
     "tagLine": "string | null",
     "website": "string | null",
     "description": "string | null",
     "isPickup": "boolean",
     "isDelivery": "boolean",
     "isAvailable": "boolean",
     "isVisible": "boolean",
     "isOfficial": "boolean",
     "buildingInformation": "string",
     "floorNo": "string | null",
     "panoramaImageUrl": "string | null",
     "gallery": "string[]",
     "webGallery": "string[]",
     "hasOwnershipClaim": "boolean",
     "status": "string",
     "workingDaysAndHours": "object",
     "avgRatings": "number",
     "location": {
       "lat": "number",
       "lng": "number"
     }
   }
   ```

---

## 🚀 Next Phase: React Visualization App

### Requirements

**UI/UX Goals:**
- Premium, professional design
- Responsive and modern
- "Wow factor" - impressive visual presentation
- Easy to navigate and search

**Features:**
- Display all pharmacy data with rich visuals
- Show images (avatar, cover, building, gallery)
- Display location on interactive map
- Show ratings, working hours, contact info
- Pagination for performance (handle 5,000+ records)
- Search and filter capabilities
- Responsive design (mobile + desktop)

**Technical Stack:**
- React (frontend)
- Docker containerization
- Backend API (if needed for data serving)
- Map integration (Google Maps or Leaflet)

---

## 📁 Project Structure

```
pharmacy-project/
├── journey/                    # Documentation & progress tracking
│   ├── 00-PROJECT-OVERVIEW.md  # This file
│   ├── 01-scraping-phase.md    # Detailed scraping documentation
│   └── 02-react-app-phase.md   # React app development (upcoming)
│
├── scraper/                    # Data collection (completed)
│   ├── input.txt
│   ├── areas.json
│   ├── raw-results.csv
│   ├── pharmacies.json
│   ├── run-scraper.bat
│   └── scripts/
│       └── process-pharmacies.js
│
├── frontend/                   # React visualization app (upcoming)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│
├── backend/                    # API server (if needed)
│   ├── Dockerfile
│   └── ...
│
└── docker-compose.yml          # Orchestrate all services
```

---

## 🎯 Success Metrics

- [ ] Scrape 5,000+ unique pharmacies
- [ ] 100% have valid coordinates within Kathmandu
- [ ] 90%+ have contact information
- [ ] 80%+ have images
- [ ] React app loads and displays all data smoothly
- [ ] Pagination works efficiently
- [ ] Map visualization is accurate
- [ ] UI is professional and impressive

---

## 🛠️ Technical Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scraping approach | Local Docker (free) | Cost-effective, full control |
| Scraper tool | gosom/google-maps-scraper | Reliable, well-maintained, proven |
| Search strategy | Multi-term, multi-area | Maximize coverage, reduce duplicates |
| Deduplication | Google Place ID | Most reliable unique identifier |
| Data format | JSON | Easy to consume in React |
| Validation | Coordinate bounds | Ensure data quality |
| Missing fields | `null` values | Honest, no fake data |

---

## 📝 Key Learnings

1. **Docker scraper works reliably** - Successfully scraped 20 test pharmacies with accurate data
2. **Coordinates are precise** - Building-level accuracy confirmed (e.g., 27.711634, 85.308931)
3. **Rich metadata available** - Images, hours, ratings, reviews all captured
4. **Deduplication is essential** - Same pharmacy appears in multiple area searches
5. **Validation prevents bad data** - Coordinate bounds filter out non-Kathmandu results

---

## 🔄 Current Workflow

```
1. Define search areas → 2. Generate queries → 3. Run Docker scraper
                                                         ↓
7. Use in React app ← 6. Validate & save ← 5. Deduplicate ← 4. Transform CSV → JSON
```

---

## 📅 Timeline

- **Phase 1 (Completed):** Scraping infrastructure - January 17, 2026
- **Phase 2 (Next):** Full data scrape - Pending execution (~1 hour)
- **Phase 3 (Upcoming):** React visualization app - Starting now
- **Phase 4 (Future):** Deployment & production

---

## 🎨 Vision for React App

A beautiful, modern web application that showcases Kathmandu's pharmacy data:

- **Hero section** with search bar and stats (total pharmacies, areas covered)
- **Card grid** with pharmacy cards showing images, ratings, location
- **Interactive map** with markers for all pharmacies
- **Detail view** with full information, gallery, working hours
- **Filters** by area, rating, services (pickup/delivery)
- **Smooth pagination** for performance
- **Responsive design** that works on all devices

---

*Last Updated: January 17, 2026*
