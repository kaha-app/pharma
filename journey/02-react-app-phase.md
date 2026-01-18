# Phase 2: React Visualization App - Planning

## Overview
Build a premium React application to visualize the pharmacy data with beautiful UI, interactive maps, and smooth user experience.

---

## Requirements

### Functional Requirements

1. **Display Pharmacy Data**
   - Show all pharmacy information in cards
   - Display images (avatar, cover, building, gallery)
   - Show ratings with stars
   - Display working hours
   - Show contact information

2. **Interactive Map**
   - Display all pharmacies as markers
   - Click marker to see pharmacy details
   - Cluster markers for performance
   - Center on Kathmandu

3. **Search & Filter**
   - Search by name, address, area
   - Filter by rating (1-5 stars)
   - Filter by services (pickup, delivery)
   - Filter by area/location

4. **Pagination**
   - Handle 5,000+ records efficiently
   - Show 20-50 pharmacies per page
   - Smooth page transitions
   - Page number display

5. **Detail View**
   - Modal or dedicated page
   - Full pharmacy information
   - Image gallery
   - Map with single marker
   - Contact buttons (call, email, website)

### Non-Functional Requirements

1. **Performance**
   - Fast initial load
   - Smooth scrolling
   - Efficient pagination
   - Optimized images

2. **Design**
   - Modern, clean UI
   - Professional appearance
   - Consistent branding
   - Responsive (mobile + desktop)

3. **User Experience**
   - Intuitive navigation
   - Clear information hierarchy
   - Accessible (WCAG compliant)
   - Fast interactions

---

## Tech Stack Options

### UI Framework
- **React** ✅ (confirmed)
- TypeScript (recommended for type safety)

### UI Library Options
1. **Material-UI (MUI)** - Comprehensive, professional
2. **Tailwind CSS** - Flexible, modern, fast
3. **Ant Design** - Enterprise-grade, rich components
4. **Chakra UI** - Accessible, themeable

**Recommendation:** Tailwind CSS + Headless UI (flexibility + modern design)

### Map Library Options
1. **Google Maps React** - Familiar, feature-rich (requires API key)
2. **Leaflet + React-Leaflet** - Free, open-source, lightweight
3. **Mapbox** - Beautiful, modern (requires API key)

**Recommendation:** React-Leaflet (free, no API key needed)

### State Management
- **React Context** - Simple, built-in
- **Zustand** - Lightweight, modern
- **Redux Toolkit** - If complex state needed

**Recommendation:** React Context (sufficient for this project)

### Additional Libraries
- **React Router** - Navigation
- **Axios** - API calls (if backend needed)
- **React Query** - Data fetching/caching
- **Framer Motion** - Animations
- **React Icons** - Icon library

---

## Architecture

### Component Structure

```
frontend/
├── public/
│   └── data/
│       └── pharmacies.json     # Static data (or fetch from API)
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── pharmacy/
│   │   │   ├── PharmacyCard.jsx
│   │   │   ├── PharmacyGrid.jsx
│   │   │   ├── PharmacyDetail.jsx
│   │   │   └── PharmacyModal.jsx
│   │   │
│   │   ├── map/
│   │   │   ├── MapView.jsx
│   │   │   ├── MapMarker.jsx
│   │   │   └── MapCluster.jsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   └── SortOptions.jsx
│   │   │
│   │   └── common/
│   │       ├── Pagination.jsx
│   │       ├── Loading.jsx
│   │       ├── ErrorBoundary.jsx
│   │       └── StarRating.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── PharmacyList.jsx
│   │   └── PharmacyDetails.jsx
│   │
│   ├── context/
│   │   └── PharmacyContext.jsx
│   │
│   ├── hooks/
│   │   ├── usePharmacies.js
│   │   ├── useSearch.js
│   │   └── usePagination.js
│   │
│   ├── utils/
│   │   ├── filters.js
│   │   ├── sorting.js
│   │   └── validation.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── Dockerfile
├── package.json
└── vite.config.js
```

---

## UI Design Mockup

### Home Page Layout

```
┌─────────────────────────────────────────────────────┐
│  🏥 Kathmandu Pharmacies        [Search...] [Filter]│
├─────────────────────────────────────────────────────┤
│                                                      │
│  📊 Stats: 5,000 Pharmacies | 20 Areas | 4.2★ Avg  │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Map View]  [List View]  [Grid View]               │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Image   │  │  Image   │  │  Image   │          │
│  │          │  │          │  │          │          │
│  │ Pharmacy │  │ Pharmacy │  │ Pharmacy │          │
│  │ Name     │  │ Name     │  │ Name     │          │
│  │ ⭐⭐⭐⭐⭐ │  │ ⭐⭐⭐⭐   │  │ ⭐⭐⭐⭐⭐ │          │
│  │ Address  │  │ Address  │  │ Address  │          │
│  │ [View]   │  │ [View]   │  │ [View]   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  ...     │  │  ...     │  │  ...     │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
├─────────────────────────────────────────────────────┤
│  [< Prev]  [1] [2] [3] ... [100]  [Next >]         │
└─────────────────────────────────────────────────────┘
```

### Pharmacy Detail Modal

```
┌─────────────────────────────────────────────────────┐
│  Ritika Pharmacy                            [X]     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────┐  ⭐⭐⭐⭐⭐ 4.3 (15 reviews)     │
│  │                │                                  │
│  │  Cover Image   │  📍 P865+MH3, JP Rd, Kathmandu │
│  │                │  📞 01-4260792                  │
│  │                │  🌐 [Website]                   │
│  └────────────────┘                                  │
│                                                      │
│  🕐 Working Hours:                                   │
│     Monday-Sunday: 8 AM – 10 PM                     │
│                                                      │
│  🚚 Services:                                        │
│     ✅ Pickup  ❌ Delivery                          │
│                                                      │
│  📸 Gallery:                                         │
│  [img] [img] [img] [img]                            │
│                                                      │
│  🗺️ Map:                                            │
│  [Interactive map with marker]                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow

```
pharmacies.json → PharmacyContext → Components
                       ↓
                  usePharmacies hook
                       ↓
              ┌────────┴────────┐
              ↓                 ↓
         Search/Filter      Pagination
              ↓                 ↓
         Filtered Data    Current Page
              ↓                 ↓
              └────────┬────────┘
                       ↓
                  Display (Cards/Map)
```

---

## Implementation Plan

### Step 1: Project Setup
- [ ] Create React app with Vite
- [ ] Install dependencies (Tailwind, React Router, etc.)
- [ ] Setup folder structure
- [ ] Configure Tailwind CSS

### Step 2: Core Components
- [ ] Layout (Header, Footer)
- [ ] PharmacyCard component
- [ ] PharmacyGrid component
- [ ] Pagination component

### Step 3: Data Integration
- [ ] Load pharmacies.json
- [ ] Create PharmacyContext
- [ ] Implement usePharmacies hook
- [ ] Test data display

### Step 4: Search & Filter
- [ ] SearchBar component
- [ ] FilterPanel component
- [ ] Implement filter logic
- [ ] Connect to context

### Step 5: Map Integration
- [ ] Install React-Leaflet
- [ ] MapView component
- [ ] Add markers for pharmacies
- [ ] Implement marker clustering

### Step 6: Detail View
- [ ] PharmacyDetail page/modal
- [ ] Image gallery
- [ ] Contact buttons
- [ ] Single pharmacy map

### Step 7: Polish
- [ ] Animations (Framer Motion)
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design
- [ ] Performance optimization

### Step 8: Docker
- [ ] Create Dockerfile
- [ ] Test container
- [ ] Add to docker-compose.yml

---

## Performance Considerations

1. **Image Optimization**
   - Lazy loading
   - Responsive images
   - Thumbnail generation

2. **Pagination**
   - Virtual scrolling (if needed)
   - Efficient page calculation
   - Prefetch next page

3. **Map Performance**
   - Marker clustering
   - Viewport-based rendering
   - Debounced updates

4. **Bundle Size**
   - Code splitting
   - Tree shaking
   - Lazy component loading

---

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast (WCAG AA)
- Focus indicators

---

## Next Steps

1. Choose UI library (Tailwind recommended)
2. Choose map library (React-Leaflet recommended)
3. Create React app with Vite
4. Start with basic layout and pharmacy cards
5. Iterate and add features

---

*Phase 2 Planning: January 17, 2026*
*Implementation: Starting now*
