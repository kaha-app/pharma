/**
 * Pharmacy Data Processor - Tier 4
 * Processes raw-results-tier4.csv → pharmacies.json
 * MERGES with existing Tier 1 + Tier 2 + Tier 3 data
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  inputCsv: path.join(__dirname, '..', 'raw-results-tier4.csv'),
  existingJson: path.join(__dirname, '..', 'pharmacies.json'),
  outputJson: path.join(__dirname, '..', 'pharmacies.json'),
  areasFile: path.join(__dirname, '..', 'areas-tier4.json'),
};

// Load validation bounds
const areas = JSON.parse(fs.readFileSync(CONFIG.areasFile, 'utf-8'));
const BOUNDS = areas.validation;

/**
 * Parse CSV line handling quoted fields with commas
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Parse the raw CSV file
 */
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = parseCSVLine(lines[0]);
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record);
  }
  
  return records;
}

/**
 * Safely parse JSON string
 */
function safeJsonParse(str, fallback = null) {
  if (!str || str === 'null' || str === '') return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Extract images from scraped data
 */
function extractImages(imagesStr) {
  const images = safeJsonParse(imagesStr, []);
  if (!Array.isArray(images)) return { avatar: null, cover: null, building: null, gallery: [] };
  
  const imageUrls = images
    .map(img => img?.image || null)
    .filter(Boolean);
  
  return {
    avatar: imageUrls[0] || null,
    cover: imageUrls[0] || null,
    building: imageUrls[1] || null,
    gallery: imageUrls,
  };
}

/**
 * Extract service options (pickup/delivery) from about data
 */
function extractServices(aboutStr) {
  const about = safeJsonParse(aboutStr, []);
  let isPickup = false;
  let isDelivery = false;
  
  if (Array.isArray(about)) {
    about.forEach(section => {
      if (section?.options) {
        section.options.forEach(opt => {
          const name = (opt?.name || '').toLowerCase();
          if (name.includes('pickup')) isPickup = opt?.enabled || false;
          if (name.includes('delivery')) isDelivery = opt?.enabled || false;
        });
      }
    });
  }
  
  return { isPickup, isDelivery };
}


/**
 * Transform raw scraper record to target schema
 */
function transformRecord(raw) {
  const images = extractImages(raw.images);
  const services = extractServices(raw.about);
  const openHours = safeJsonParse(raw.open_hours, {});
  const completeAddress = safeJsonParse(raw.complete_address, {});
  const emails = raw.emails ? raw.emails.split(',').map(e => e.trim()).filter(Boolean) : [];
  const popularTimes = safeJsonParse(raw.popular_times, {});
  const reviewsPerRating = safeJsonParse(raw.reviews_per_rating, {});
  const userReviews = safeJsonParse(raw.user_reviews, []);
  const descriptions = safeJsonParse(raw.descriptions, []);
  
  return {
    // Basic info
    name: raw.title || null,
    contact: raw.phone || null,
    email: emails[0] || null,
    address: raw.address || null,
    
    // Images
    avatarUrl: images.avatar,
    coverImageUrl: images.cover,
    buildingImageUrl: images.building,
    thumbnailUrl: raw.thumbnail || null,
    
    // Details
    tagLine: null,
    website: raw.website || null,
    description: descriptions.length > 0 ? descriptions[0] : null,
    
    // Service flags
    isPickup: services.isPickup,
    isDelivery: services.isDelivery,
    isAvailable: true,
    isVisible: true,
    isOfficial: false,
    
    // Building info
    buildingInformation: completeAddress.street || null,
    floorNo: null,
    panoramaImageUrl: null,
    
    // Galleries
    gallery: images.gallery,
    webGallery: [],
    
    // Status
    hasOwnershipClaim: false,
    status: 'active',
    
    // Hours and ratings
    workingDaysAndHours: openHours,
    avgRatings: parseFloat(raw.review_rating) || 0,
    reviewCount: parseInt(raw.review_count) || 0,
    reviewsPerRating: reviewsPerRating,
    
    // Popular times (hourly traffic data)
    popularTimes: popularTimes,
    
    // Reviews
    userReviews: userReviews,
    
    // Additional data
    priceRange: raw.price_range || null,
    plusCode: raw.plus_code || null,
    timezone: raw.timezone || null,
    cid: raw.cid || null,
    
    // Location
    location: {
      lat: parseFloat(raw.latitude) || null,
      lng: parseFloat(raw.longitude) || null,
    },
    
    // Metadata (for deduplication and reference)
    _meta: {
      placeId: raw.place_id || null,
      googleMapsLink: raw.link || null,
      dataId: raw.data_id || null,
      category: raw.category || null,
      borough: completeAddress.borough || null,
      city: completeAddress.city || null,
      postalCode: completeAddress.postal_code || null,
    },
  };
}

/**
 * Validate pharmacy record
 */
function validateRecord(pharmacy) {
  const errors = [];
  
  // Must have name
  if (!pharmacy.name) {
    errors.push('Missing name');
  }
  
  // Must have valid coordinates
  const { lat, lng } = pharmacy.location || {};
  if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
    errors.push('Invalid coordinates');
  } else {
    // Check bounds (Kathmandu valley)
    if (lat < BOUNDS.lat.min || lat > BOUNDS.lat.max) {
      errors.push(`Latitude ${lat} outside Kathmandu bounds`);
    }
    if (lng < BOUNDS.lng.min || lng > BOUNDS.lng.max) {
      errors.push(`Longitude ${lng} outside Kathmandu bounds`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Deduplicate by place_id
 */
function deduplicate(pharmacies) {
  const seen = new Map();
  const duplicates = [];
  
  pharmacies.forEach(pharmacy => {
    const placeId = pharmacy._meta?.placeId;
    
    if (placeId && seen.has(placeId)) {
      duplicates.push(pharmacy.name);
    } else if (placeId) {
      seen.set(placeId, pharmacy);
    } else {
      // No place_id, use coordinates as fallback key
      const coordKey = `${pharmacy.location?.lat?.toFixed(6)},${pharmacy.location?.lng?.toFixed(6)}`;
      if (!seen.has(coordKey)) {
        seen.set(coordKey, pharmacy);
      } else {
        duplicates.push(pharmacy.name);
      }
    }
  });
  
  return {
    unique: Array.from(seen.values()),
    duplicateCount: duplicates.length,
  };
}

/**
 * Remove _meta field for final output
 */
function cleanForOutput(pharmacies) {
  return pharmacies.map(p => {
    const { _meta, ...clean } = p;
    return clean;
  });
}

/**
 * Main processing function
 */
function main() {
  console.log('🏥 Pharmacy Data Processor (Tier 4 - FINAL COMPREHENSIVE MERGE)\n');
  
  // Check if input file exists
  if (!fs.existsSync(CONFIG.inputCsv)) {
    console.error(`❌ Input file not found: ${CONFIG.inputCsv}`);
    console.log('\nRun the scraper first: ./run-tier4-scrape.ps1');
    process.exit(1);
  }
  
  // Load existing Tier 1 + Tier 2 + Tier 3 data
  let existingPharmacies = [];
  if (fs.existsSync(CONFIG.existingJson)) {
    console.log('📂 Loading existing Tier 1 + Tier 2 + Tier 3 data...');
    existingPharmacies = JSON.parse(fs.readFileSync(CONFIG.existingJson, 'utf-8'));
    console.log(`   Found ${existingPharmacies.length} existing pharmacies\n`);
  }
  
  // Read and parse CSV
  console.log('📖 Reading Tier 4 CSV...');
  const csvContent = fs.readFileSync(CONFIG.inputCsv, 'utf-8');
  const rawRecords = parseCSV(csvContent);
  console.log(`   Found ${rawRecords.length} raw records\n`);
  
  // Transform records
  console.log('🔄 Transforming records...');
  const transformed = rawRecords.map(transformRecord);
  
  // Validate records
  console.log('✅ Validating records...');
  const valid = [];
  const invalid = [];
  
  transformed.forEach(pharmacy => {
    const validation = validateRecord(pharmacy);
    if (validation.isValid) {
      valid.push(pharmacy);
    } else {
      invalid.push({ pharmacy, errors: validation.errors });
    }
  });
  
  console.log(`   Valid: ${valid.length}`);
  console.log(`   Invalid: ${invalid.length}\n`);
  
  // Merge with existing data
  console.log('🔗 Merging with Tier 1 + Tier 2 + Tier 3 data...');
  const combined = [...existingPharmacies, ...valid];
  console.log(`   Combined: ${combined.length} pharmacies\n`);
  
  // Deduplicate
  console.log('🔍 Removing duplicates...');
  const { unique, duplicateCount } = deduplicate(combined);
  console.log(`   Duplicates removed: ${duplicateCount}`);
  console.log(`   Unique pharmacies: ${unique.length}\n`);
  
  // Clean and save
  const finalOutput = cleanForOutput(unique);
  
  console.log('💾 Saving merged data to JSON...');
  fs.writeFileSync(CONFIG.outputJson, JSON.stringify(finalOutput, null, 2));
  console.log(`   Saved to: ${CONFIG.outputJson}\n`);
  
  // Summary
  console.log('📊 Summary:');
  console.log(`   Tier 1 + Tier 2 + Tier 3 pharmacies: ${existingPharmacies.length}`);
  console.log(`   Tier 4 raw records: ${rawRecords.length}`);
  console.log(`   Tier 4 after validation: ${valid.length}`);
  console.log(`   Combined total: ${combined.length}`);
  console.log(`   After deduplication: ${unique.length}`);
  console.log(`   New pharmacies added: ${unique.length - existingPharmacies.length}`);
  
  // Show invalid records if any
  if (invalid.length > 0 && invalid.length <= 10) {
    console.log('\n⚠️ Invalid records:');
    invalid.forEach(({ pharmacy, errors }) => {
      console.log(`   - ${pharmacy.name || 'Unknown'}: ${errors.join(', ')}`);
    });
  }
}

main();
