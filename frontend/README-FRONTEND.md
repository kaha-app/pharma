# Kathmandu Pharmacies - Frontend

Premium React application for visualizing pharmacy data across Kathmandu.

## Features

- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🔍 **Search & Filter** - Find pharmacies by name, address, rating, services
- 📄 **Pagination** - Smooth navigation through thousands of pharmacies
- 🗺️ **Location Data** - Precise GPS coordinates for every pharmacy
- ⭐ **Ratings & Reviews** - Real ratings from Google Maps
- 📱 **Responsive** - Works perfectly on mobile and desktop
- 🚀 **Fast** - Optimized performance with Vite

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **React Leaflet** - Maps (ready to integrate)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

App will be available at http://localhost:5173/

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # Top navigation
│   │   └── Footer.jsx          # Footer
│   ├── pharmacy/
│   │   ├── PharmacyCard.jsx    # Individual pharmacy card
│   │   ├── PharmacyGrid.jsx    # Grid of pharmacy cards
│   │   └── PharmacyModal.jsx   # Detailed pharmacy view
│   ├── search/
│   │   ├── SearchBar.jsx       # Search input
│   │   └── FilterPanel.jsx     # Filter controls
│   └── common/
│       └── Pagination.jsx      # Page navigation
├── pages/
│   ├── Home.jsx                # Landing page
│   └── PharmacyList.jsx        # Main pharmacy listing
├── context/
│   └── PharmacyContext.jsx     # Global state management
├── App.jsx                     # Main app component
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## Data Source

Pharmacy data is loaded from `/public/data/pharmacies.json`

To update the data:
1. Run the scraper: `cd ../scraper && ./run-scraper.bat`
2. Copy new data: `cp ../scraper/pharmacies.json public/data/`
3. Restart dev server

## Features in Detail

### Search
- Real-time search by pharmacy name or address
- Case-insensitive matching
- Instant results

### Filters
- Minimum rating (1-5 stars)
- Pickup availability
- Delivery availability
- Clear all filters option

### Pagination
- 20 pharmacies per page
- Smart page number display
- Smooth scroll to top on page change

### Pharmacy Card
- Cover image
- Name and rating
- Address
- Contact number
- Service badges (pickup/delivery)
- Click to view details

### Pharmacy Modal
- Full pharmacy information
- Image gallery
- Working hours
- Contact details
- Google Maps link
- Service availability

## Customization

### Colors
Edit `tailwind.config.js` to change the primary color:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Items Per Page
Edit `PharmacyList.jsx`:

```js
const itemsPerPage = 20; // Change this number
```

## Performance

- Lazy loading images
- Pagination for large datasets
- Optimized re-renders with React Context
- Fast build with Vite

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Interactive map view with markers
- [ ] Advanced filters (by area, open now)
- [ ] Sort options (by rating, distance)
- [ ] Favorite pharmacies
- [ ] Share pharmacy details
- [ ] Print-friendly view
- [ ] Dark mode

## License

Private project - All rights reserved
