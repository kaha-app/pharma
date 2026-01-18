# 🎯 Scraping Strategy - Kathmandu Pharmacy Data

## Current Status: ✅ Tier 1 Complete | 📊 898 Pharmacies

**Last Updated:** January 18, 2026

### Progress:
- ✅ **Tier 1 Complete** - 898 pharmacies (30 areas, 120 queries)
- ⏳ **Tier 2 Next** - 20 areas, 80 queries
- ⏸️ **Tier 3 Pending** - 10 areas, 40 queries

**Target:** 3,000-4,000 pharmacies | **Current:** 898 (22-30% of target)

---

## Next Steps

### **Phase 2: Tier 2 Areas (NEXT)**
**Target:** 20 areas (North + West + Lalitpur suburbs)
**Expected:** +1,500-2,000 pharmacies
**Time:** ~40 minutes

### **Phase 3: Tier 3 Areas (If Needed)**
**Target:** 10 areas (Bhaktapur + Far suburbs)
**Expected:** +500-1,000 pharmacies
**Time:** ~20 minutes

---

## ✅ Tier 1 Areas (30 Areas) - COMPLETED

### Central Kathmandu (10 areas)
1. Thamel
2. New Road
3. Asan
4. Basantapur
5. Bagbazar
6. Putalisadak
7. Naxal
8. Durbarmarg
9. Sundhara
10. Ratnapark

### East Kathmandu (10 areas)
11. Baneshwor
12. Koteshwor
13. Chabahil
14. Bouddha
15. Jorpati
16. Battisputali
17. Gaushala
18. Sinamangal
19. Jadibuti
20. Lokanthali

### West Kathmandu (3 areas)
21. Kalanki
22. Kalimati
23. Balaju

### Lalitpur/Patan (7 areas)
24. Jawalakhel
25. Pulchowk
26. Kupondole
27. Sanepa
28. Lagankhel
29. Satdobato
30. Ekantakuna

**Status:** ✅ Scraped on Jan 18, 2026 | Results: 898 pharmacies

---

## Search Terms (4 per area)

1. **pharmacy** - English term
2. **medical store** - Common alternative
3. **aushadhi pasal** - Nepali (Romanized)
4. **chemist** - British English term

**Total Queries:** 30 areas × 4 terms = **120 queries**

---

## Scraper Configuration

```bash
docker run --rm -v "${PWD}:/scraper-test" \
  gosom/google-maps-scraper:latest-rod \
  -input /scraper-test/input.txt \
  -results /scraper-test/raw-results.csv \
  -c 1 \
  -depth 3 \
  -lang en
```

**Parameters:**
- `-c 1` - Concurrency (1 = safe, no rate limiting)
- `-depth 3` - Pagination depth (~40 results per query)
- `-lang en` - English results

---

## Expected Results

### Raw Data
- 120 queries × ~40 results = **~4,800 raw results**

### After Processing
- Deduplication by Google Place ID
- Coordinate validation (Kathmandu bounds)
- **Expected: 3,000-4,000 unique pharmacies**

---

## Data Processing Pipeline

```
1. Scraper → raw-results.csv
2. Processor → pharmacies.json (deduplicated, validated)
3. Import → PostgreSQL database
4. API → Serve to frontend
```

---

## Quality Checks

After scraping, verify:
- ✅ Unique pharmacies count
- ✅ All have valid coordinates
- ✅ Contact info coverage (>80%)
- ✅ Ratings coverage (>60%)
- ✅ Images coverage (>70%)
- ✅ No duplicates

---

## Timeline

| Step | Time | Action |
|------|------|--------|
| 1. Update files | 5 min | Update areas.json, input.txt |
| 2. Run scraper | 45-60 min | Docker scraper execution |
| 3. Process data | 2 min | Transform, dedupe, validate |
| 4. Import to DB | 1 min | Load into PostgreSQL |
| 5. Review results | 10 min | Check quality, stats |
| **Total** | **~1 hour** | |

---

## Success Criteria

**Minimum Acceptable:**
- 2,500+ unique pharmacies
- 90%+ have valid coordinates
- 70%+ have contact info

**Target:**
- 3,000-4,000 unique pharmacies
- 100% have valid coordinates
- 80%+ have contact info
- 60%+ have ratings

**Excellent:**
- 4,000+ unique pharmacies
- All quality metrics above target

---

## ⏳ Tier 2 Areas (20 Areas) - READY TO SCRAPE

### North Kathmandu (8 areas)
31. Maharajgunj
32. Lazimpat
33. Budhanilkantha
34. Tokha
35. Kapan
36. Bansbari
37. Hattigauda
38. Naya Bazar

### West Suburbs (4 areas)
39. Gongabu
40. Samakhusi
41. Swayambhu
42. Sorhakhutte

### Lalitpur Suburbs (8 areas)
43. Mangal Bazar
44. Patan Dhoka
45. Thecho
46. Imadol
47. Godavari
48. Lubhu
49. Gwarko
50. Jhamsikhel

**Tier 2 Expected:** +1,500-2,000 pharmacies | 80 queries | ~40 minutes

---

## ⏸️ Tier 3 Areas (10 Areas) - OPTIONAL

### Bhaktapur (5 areas)
51. Bhaktapur Durbar Square
52. Suryabinayak
53. Thimi
54. Madhyapur
55. Changunarayan

### Far Suburbs (5 areas)
56. Kirtipur
57. Thankot
58. Sitapaila
59. Dhalko
60. Narayanthan

**Tier 3 Expected:** +500-1,000 pharmacies | 40 queries | ~20 minutes

---

## Decision Tree

```
Start with Tier 1 (30 areas)
    ↓
Run scraper (~1 hour)
    ↓
Check results
    ↓
    ├─ Got 3,500+ pharmacies? → DONE ✅
    ├─ Got 2,500-3,500? → Add Tier 2 (20 areas)
    └─ Got < 2,500? → Add Tier 2 + Tier 3 (30 areas)
```

---

## Commands

### 1. Update Configuration
```bash
# Files to update:
# - scraper/areas.json (30 Tier 1 areas)
# - scraper/input.txt (120 queries)
```

### 2. Run Scraper
```bash
cd scraper
./run-scraper.bat
```

### 3. Check Results
```bash
# View processed data
cat scraper/pharmacies.json

# Import to database
cd backend
npm run import-data

# Check stats
curl http://localhost:3000/api/stats
```

---

## Why This Approach?

✅ **Phased** - Test before committing full time
✅ **Focused** - Target high-density areas first
✅ **Efficient** - 1 hour for 80% of pharmacies
✅ **Flexible** - Can expand if needed
✅ **Quality** - Validate before scaling
✅ **Reliable** - Conservative depth, safe concurrency

---

**Status:** Ready to execute Phase 1 (Tier 1)

**Next Step:** Update `areas.json` and `input.txt` with Tier 1 areas

---

*Created: January 18, 2026*
