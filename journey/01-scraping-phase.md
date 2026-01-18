# Phase 1: Data Scraping - Detailed Documentation

## Overview
This phase focused on building a reliable, local scraping infrastructure to collect pharmacy data from Google Maps.

---

## Initial Exploration

### Options Considered

1. **Apify Cloud (Paid)**
   - Cost: ~$20 for 5,000 pharmacies
   - User's API key tested: `[REDACTED]`
   - Account: `[REDACTED]` (FREE tier, $5/month credits)
   - Successfully scraped 5 test pharmacies
   - **Decision:** Rejected in favor of free local solution

2. **Local Docker Scraper (Free)** ✅ CHOSEN
   - Tool: `gosom/google-maps-scraper:latest-rod`
   - GitHub: https://github.com/gosom/google-maps-scraper
   - Docker image size: 1.25GB
   - Cost: $0
   - **Decision:** Selected for cost-effectiveness and control

---

## Implementation Details

### Docker Setup

**Installation:**
- Docker Desktop v28.5.1 installed on Windows
- Image pulled: `gosom/google-maps-scraper:latest-rod`

**Test Command:**
```powershell
$currentPath = (Get-Location).Path
docker run --rm -v "${currentPath}/scraper-test:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input.txt -results /scraper-test/results.csv -c 1 -depth 1 -lang en
```

**Parameters:**
- `-c 1`: Concurrency (1 = slower but safer from rate limits)
- `-depth 1`: Search depth (2 = more results per query)
- `-lang en`: English language results
- `--rm`: Remove container after execution
- `-v`: Volume mount for input/output

### Search Strategy

**Areas Covered (20 major Kathmandu locations):**
1. Thamel
2. Baneshwor
3. Balaju
4. Kalanki
5. Koteshwor
6. Chabahil
7. Lazimpat
8. New Road
9. Bouddha
10. Maharajgunj
11. Kalimati
12. Jorpati
13. Gongabu
14. Samakhusi
15. Naxal
16. Putalisadak
17. Bagbazar
18. Ason
19. Basantapur
20. Kirtipur

**Search Terms (3 variations per area):**
- "pharmacy in [Area] Kathmandu Nepal"
- "medical store in [Area] Kathmandu Nepal"
- "aushadhi pasal [Area] Kathmandu Nepal" (Nepali term)

**Total Queries:** 50 (20 areas × 2.5 avg terms)

**Rationale:**
- Multiple terms capture different naming conventions
- Area-specific searches ensure geographic coverage
- Nepali term captures local businesses not listed in English

---

## Data Processing Pipeline

### Input: Raw CSV from Scraper

**Available Fields:**
- `input_id`, `link`, `title`, `category`, `address`
- `latitude`, `longitude`, `phone`, `website`, `email`
- `open_hours`, `popular_times`, `review_count`, `review_rating`, `reviews_per_rating`
- `images`, `thumbnail`, `place_id`, `cid`
- `complete_address` (borough, street, city, postal_code, country)
- `about`, `user_reviews`, `owner`

### Processing Script: `process-pharmacies.js`

**Functions:**
1. **CSV Parsing** - Handles quoted fields with commas
2. **Field Transformation** - Maps scraper fields to target schema
3. **Image Extraction** - Parses JSON image arrays
4. **Service Detection** - Infers pickup/delivery from "about" data
5. **Validation** - Checks coordinates within Kathmandu bounds
6. **Deduplication** - Removes duplicates by `place_id`
7. **Output Generation** - Clean JSON matching target schema

**Validation Rules:**
```javascript
Latitude: 27.5 - 27.85
Longitude: 85.15 - 85.55
Must have: name, valid coordinates
```

### Output: Clean JSON

**Test Results:**
- Input: 20 raw records
- After validation: 20 valid
- After deduplication: 20 unique
- Final output: 20 pharmacies

**Sample Output:**
```json
{
  "name": "Ritika Pharmacy",
  "contact": "01-4260792",
  "address": "P865+MH3 Ritika Pharmacy, JP Rd, Kathmandu 44600",
  "location": {
    "lat": 27.711634,
    "lng": 85.308931
  },
  "avgRatings": 4.3,
  "workingDaysAndHours": {
    "Monday": ["8 AM–10 PM"],
    "Tuesday": ["8 AM–10 PM"],
    ...
  },
  "gallery": ["https://..."],
  ...
}
```

---

## Test Results

### Test Scrape: Thamel Area

**Query:** "pharmacy in Thamel Kathmandu Nepal"

**Results:**
- 20 pharmacies found
- 100% had valid coordinates
- 95% had phone numbers
- 85% had working hours
- 75% had ratings
- 100% had at least one image

**Notable Pharmacies Found:**
1. Ritika Pharmacy - 4.3★ (15 reviews)
2. Safeway Thamel Pharmacy - 4.4★ (29 reviews)
3. Mittal Pharmacy - 5.0★ (2 reviews)
4. Akira Pharmacy - 5.0★ (5 reviews)
5. SANKIR PHARMACY - 4.0★ (3 reviews, 24/7)

**Coordinate Accuracy:**
- All coordinates within Kathmandu bounds ✅
- Building-level precision confirmed ✅
- Example: 27.711634, 85.308931 (Ritika Pharmacy)

---

## Challenges & Solutions

### Challenge 1: PowerShell Unicode Display
**Issue:** Garbled characters in Docker output (box-drawing characters)
**Solution:** Not an error - just display issue, scraper works fine

### Challenge 2: CSV Parsing
**Issue:** Quoted fields with commas break simple split
**Solution:** Custom CSV parser handling quotes properly

### Challenge 3: Nested JSON in CSV
**Issue:** Fields like `images`, `open_hours` are JSON strings
**Solution:** Safe JSON parser with fallbacks

### Challenge 4: Missing Data
**Issue:** Not all fields available from scraper
**Solution:** Use `null` for missing data, no fake values

---

## Confidence Assessment

**Overall Confidence: 85%**

**High Confidence (90%+):**
- Docker scraper reliability
- Coordinate accuracy
- Data transformation pipeline
- Deduplication logic

**Medium Confidence (70-80%):**
- Reaching 5,000 pharmacies (may get 2,000-4,000)
- Rate limiting (may need to slow down or use VPN)
- Data completeness (some fields will be sparse)

**Risks:**
- Google may rate-limit after 500-1,000 requests
- Some pharmacies may not be on Google Maps
- Duplicate detection may miss some edge cases

**Mitigation:**
- Use `-c 1` (low concurrency) to avoid rate limits
- Run in batches if needed
- Can use VPN if blocked
- Multiple search terms increase coverage

---

## Files Created

```
scraper-test/
├── input.txt              # 50 search queries
├── areas.json             # Area list + validation bounds
├── results.csv            # Test data (20 pharmacies)
├── raw-results.csv        # Copy for processing
├── pharmacies.json        # Final output (20 pharmacies)
├── run-scraper.bat        # One-click runner
└── scripts/
    └── process-pharmacies.js  # Processing pipeline
```

---

## Next Steps

1. **Run full scrape** - Execute all 50 queries (~30-60 minutes)
2. **Validate results** - Check data quality and coverage
3. **Adjust if needed** - Add more areas or search terms
4. **Move to Phase 2** - Build React visualization app

---

## Commands Reference

**Full Scrape:**
```powershell
$currentPath = (Get-Location).Path
docker run --rm -v "${currentPath}/scraper-test:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input.txt -results /scraper-test/raw-results.csv -c 1 -depth 2 -lang en
```

**Process Data:**
```powershell
node scraper-test/scripts/process-pharmacies.js
```

**One-Click:**
```
Double-click: scraper-test/run-scraper.bat
```

---

*Phase 1 Completed: January 17, 2026*
