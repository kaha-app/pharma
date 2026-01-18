import pool from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importPharmacies() {
  const client = await pool.connect();
  
  try {
    // Read pharmacy data from scraper output
    const dataPath = path.join(__dirname, '../../scraper/pharmacies.json');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found: ${dataPath}`);
    }
    
    console.log('📂 Reading pharmacy data...');
    const pharmaciesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`📊 Found ${pharmaciesData.length} pharmacies to import`);
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await client.query('DELETE FROM pharmacies');
    
    // Insert pharmacies
    console.log('💾 Importing pharmacies...');
    
    const insertSQL = `
      INSERT INTO pharmacies (
        place_id, name, contact, email, address,
        avatar_url, cover_image_url, building_image_url, thumbnail_url,
        tag_line, website, description,
        is_pickup, is_delivery, is_available, is_visible, is_official,
        building_information, floor_no, panorama_image_url,
        gallery, web_gallery, has_ownership_claim, status,
        working_days_and_hours, avg_ratings, review_count,
        reviews_per_rating, popular_times, user_reviews,
        price_range, plus_code, timezone, cid,
        latitude, longitude
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36
      )
      ON CONFLICT (place_id) DO UPDATE SET
        name = EXCLUDED.name,
        contact = EXCLUDED.contact,
        email = EXCLUDED.email,
        address = EXCLUDED.address,
        avatar_url = EXCLUDED.avatar_url,
        cover_image_url = EXCLUDED.cover_image_url,
        building_image_url = EXCLUDED.building_image_url,
        thumbnail_url = EXCLUDED.thumbnail_url,
        tag_line = EXCLUDED.tag_line,
        website = EXCLUDED.website,
        description = EXCLUDED.description,
        is_pickup = EXCLUDED.is_pickup,
        is_delivery = EXCLUDED.is_delivery,
        is_available = EXCLUDED.is_available,
        is_visible = EXCLUDED.is_visible,
        is_official = EXCLUDED.is_official,
        building_information = EXCLUDED.building_information,
        floor_no = EXCLUDED.floor_no,
        panorama_image_url = EXCLUDED.panorama_image_url,
        gallery = EXCLUDED.gallery,
        web_gallery = EXCLUDED.web_gallery,
        has_ownership_claim = EXCLUDED.has_ownership_claim,
        status = EXCLUDED.status,
        working_days_and_hours = EXCLUDED.working_days_and_hours,
        avg_ratings = EXCLUDED.avg_ratings,
        review_count = EXCLUDED.review_count,
        reviews_per_rating = EXCLUDED.reviews_per_rating,
        popular_times = EXCLUDED.popular_times,
        user_reviews = EXCLUDED.user_reviews,
        price_range = EXCLUDED.price_range,
        plus_code = EXCLUDED.plus_code,
        timezone = EXCLUDED.timezone,
        cid = EXCLUDED.cid,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        updated_at = NOW()
    `;
    
    let imported = 0;
    let skipped = 0;
    
    for (const pharmacy of pharmaciesData) {
      try {
        // Generate a place_id if not exists (use name + location as fallback)
        const placeId = pharmacy.placeId || 
                       `${pharmacy.name}_${pharmacy.location.lat}_${pharmacy.location.lng}`.replace(/\s+/g, '_');
        
        await client.query(insertSQL, [
          placeId,
          pharmacy.name,
          pharmacy.contact,
          pharmacy.email,
          pharmacy.address,
          pharmacy.avatarUrl,
          pharmacy.coverImageUrl,
          pharmacy.buildingImageUrl,
          pharmacy.thumbnailUrl,
          pharmacy.tagLine,
          pharmacy.website,
          pharmacy.description,
          pharmacy.isPickup || false,
          pharmacy.isDelivery || false,
          pharmacy.isAvailable !== false,
          pharmacy.isVisible !== false,
          pharmacy.isOfficial || false,
          pharmacy.buildingInformation,
          pharmacy.floorNo,
          pharmacy.panoramaImageUrl,
          JSON.stringify(pharmacy.gallery || []),
          JSON.stringify(pharmacy.webGallery || []),
          pharmacy.hasOwnershipClaim || false,
          pharmacy.status || 'active',
          JSON.stringify(pharmacy.workingDaysAndHours || {}),
          pharmacy.avgRatings || 0,
          pharmacy.reviewCount || 0,
          JSON.stringify(pharmacy.reviewsPerRating || {}),
          JSON.stringify(pharmacy.popularTimes || {}),
          JSON.stringify(pharmacy.userReviews || []),
          pharmacy.priceRange,
          pharmacy.plusCode,
          pharmacy.timezone,
          pharmacy.cid,
          pharmacy.location.lat,
          pharmacy.location.lng
        ]);
        
        imported++;
        
        if (imported % 100 === 0) {
          console.log(`   ✓ Imported ${imported} pharmacies...`);
        }
      } catch (error) {
        console.error(`   ✗ Error importing ${pharmacy.name}:`, error.message);
        skipped++;
      }
    }
    
    console.log('\n✅ Import complete!');
    console.log(`   📊 Total: ${pharmaciesData.length}`);
    console.log(`   ✓ Imported: ${imported}`);
    console.log(`   ✗ Skipped: ${skipped}`);
    
    // Show stats
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_pickup = true) as with_pickup,
        COUNT(*) FILTER (WHERE is_delivery = true) as with_delivery,
        ROUND(AVG(avg_ratings), 2) as avg_rating,
        COUNT(*) FILTER (WHERE avg_ratings > 0) as with_ratings
      FROM pharmacies
    `);
    
    console.log('\n📊 Database Statistics:');
    console.log(`   Total pharmacies: ${stats.rows[0].total}`);
    console.log(`   With pickup: ${stats.rows[0].with_pickup}`);
    console.log(`   With delivery: ${stats.rows[0].with_delivery}`);
    console.log(`   Average rating: ${stats.rows[0].avg_rating}`);
    console.log(`   With ratings: ${stats.rows[0].with_ratings}`);
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run import
importPharmacies()
  .then(() => {
    console.log('✅ Data import complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Data import failed:', error);
    process.exit(1);
  });
