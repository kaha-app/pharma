# 🏥 Kathmandu Pharmacy Data Project

> Comprehensive pharmacy database for Kathmandu with precise coordinates and premium React visualization

---

## 📋 Project Overview

This project collects, processes, and visualizes data for ~5,000 pharmacies across Kathmandu, Nepal. It provides:

- **Accurate location data** with building-level GPS coordinates
- **Rich metadata** including working hours, ratings, contact info, images
- **Beautiful visualization** through a premium React web application
- **Validated data** ensuring quality and accuracy

---

## 🗂️ Project Structure

```
pharmacy-project/
├── journey/                    # 📚 Documentation & progress tracking
│   ├── 00-PROJECT-OVERVIEW.md  # Vision, goals, current status
│   └── 01-scraping-phase.md    # Detailed scraping documentation
│
├── scraper/                    # 🔍 Data collection system
│   ├── input.txt               # Search queries (50 queries)
│   ├── areas.json              # Area definitions
│   ├── pharmacies.json         # Final clean data
│   ├── run-scraper.bat         # One-click scraper
│   └── scripts/
│       └── process-pharmacies.js
│
├── backend/                    # 🔧 API server (Node.js + PostgreSQL)
│   ├── server.js               # Express API
│   ├── db.js                   # Database connection
│   ├── scripts/                # Setup & import scripts
│   └── start.bat               # Quick start
│
├── frontend/                   # 🎨 React visualization app
│   └── ...
│
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Phase 1: Data Collection (Completed)

**Test scrape (already done):**
```powershell
cd pharmacy-project/scraper
node scripts/process-pharmacies.js
```

**Full scrape (to get 5,000 pharmacies):**
```powershell
cd pharmacy-project/scraper
./run-scraper.bat
```

Or manually:
```powershell
$currentPath = (Get-Location).Path
docker run --rm -v "${currentPath}:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input.txt -results /scraper-test/raw-results.csv -c 1 -depth 2 -lang en

node scripts/process-pharmacies.js
```

### Phase 2: React App (Next)

Coming soon - Premium UI with:
- Interactive map visualization
- Pharmacy cards with images
- Search and filters
- Pagination
- Responsive design

---

## 📊 Current Status

✅ **Completed:**
- Docker scraper setup and tested
- 50 search queries across 20 Kathmandu areas
- Data processing pipeline (transform, dedupe, validate)
- Test data: 20 pharmacies successfully scraped
- React app with full UI components
- Backend API with PostgreSQL
- Database schema with optimized indexes
- Data import pipeline working

🔄 **In Progress:**
- Connecting frontend to backend API

⏳ **Pending:**
- Full scrape execution (~5,000 pharmacies)
- Frontend-backend integration
- Deployment

---

## 🎯 Data Schema

Each pharmacy includes:

```json
{
  "name": "Pharmacy Name",
  "contact": "01-1234567",
  "email": "email@example.com",
  "address": "Full address",
  "avatarUrl": "https://...",
  "coverImageUrl": "https://...",
  "buildingImageUrl": "https://...",
  "website": "https://...",
  "isPickup": true,
  "isDelivery": false,
  "workingDaysAndHours": {
    "Monday": ["8 AM–10 PM"],
    ...
  },
  "avgRatings": 4.5,
  "location": {
    "lat": 27.711634,
    "lng": 85.308931
  },
  "gallery": ["https://...", "https://..."],
  ...
}
```

---

## 🛠️ Tech Stack

**Data Collection:**
- Docker
- gosom/google-maps-scraper
- Node.js (data processing)

**Backend:**
- Node.js + Express
- PostgreSQL (with indexes)
- Docker containerization

**Frontend:**
- React + Vite
- Tailwind CSS
- React Router
- React Leaflet (maps)
- Lucide React (icons)

---

## 📖 Documentation

Detailed documentation available in `/journey/`:

- **[00-PROJECT-OVERVIEW.md](journey/00-PROJECT-OVERVIEW.md)** - Vision, goals, status
- **[01-scraping-phase.md](journey/01-scraping-phase.md)** - Scraping implementation details

---

## 🎨 React App Vision

A premium web application featuring:

- **Hero section** with search and stats
- **Interactive map** with pharmacy markers
- **Card grid** with images, ratings, location
- **Detail modal** with full information
- **Filters** by area, rating, services
- **Smooth pagination** for performance
- **Responsive design** for all devices

---

## 📝 Key Features

- ✅ Building-level GPS accuracy
- ✅ Validated coordinates (Kathmandu bounds)
- ✅ Deduplication by Google Place ID
- ✅ Rich metadata (hours, ratings, images)
- ✅ Multiple search terms (English + Nepali)
- ✅ 20 major Kathmandu areas covered

---

## 🤝 Contributing

This is a personal project. Documentation is maintained for learning and reference.

---

## 📄 License

Private project - All rights reserved

---

## 📞 Contact

For questions or collaboration: [Your contact info]

---

*Last Updated: January 17, 2026*
