import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/pharmacy/api/v1';

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint (without prefix for Docker healthcheck)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pharmacy API is running' });
});

// GET /pharmacy/api/pharmacies - List pharmacies with pagination, search, and filters
app.get(`${API_PREFIX}/pharmacies`, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      minRating = 0,
      hasPickup,
      hasDelivery,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clause
    const conditions = [];
    const params = [];
    let paramCount = 1;

    // Search filter
    if (search) {
      conditions.push(`(name ILIKE $${paramCount} OR address ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    // Rating filter
    if (minRating && parseFloat(minRating) > 0) {
      conditions.push(`avg_ratings >= $${paramCount}`);
      params.push(parseFloat(minRating));
      paramCount++;
    }

    // Pickup filter
    if (hasPickup === 'true') {
      conditions.push(`is_pickup = true`);
    }

    // Delivery filter
    if (hasDelivery === 'true') {
      conditions.push(`is_delivery = true`);
    }

    // Status filter (only active)
    conditions.push(`status = 'active'`);
    conditions.push(`is_visible = true`);

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    // Validate sort column
    const validSortColumns = ['name', 'avg_ratings', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM pharmacies ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT 
        id,
        place_id as "placeId",
        name,
        contact,
        email,
        address,
        avatar_url as "avatarUrl",
        cover_image_url as "coverImageUrl",
        building_image_url as "buildingImageUrl",
        thumbnail_url as "thumbnailUrl",
        tag_line as "tagLine",
        website,
        description,
        is_pickup as "isPickup",
        is_delivery as "isDelivery",
        is_available as "isAvailable",
        is_visible as "isVisible",
        is_official as "isOfficial",
        building_information as "buildingInformation",
        floor_no as "floorNo",
        panorama_image_url as "panoramaImageUrl",
        gallery,
        web_gallery as "webGallery",
        has_ownership_claim as "hasOwnershipClaim",
        status,
        working_days_and_hours as "workingDaysAndHours",
        avg_ratings as "avgRatings",
        review_count as "reviewCount",
        reviews_per_rating as "reviewsPerRating",
        popular_times as "popularTimes",
        user_reviews as "userReviews",
        price_range as "priceRange",
        plus_code as "plusCode",
        timezone,
        cid,
        latitude,
        longitude,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM pharmacies
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    params.push(limitNum, offset);
    const dataResult = await pool.query(dataQuery, params);

    // Format response
    const pharmacies = dataResult.rows.map(row => ({
      ...row,
      // Parse JSON fields if they're strings
      gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery,
      webGallery: typeof row.webGallery === 'string' ? JSON.parse(row.webGallery) : row.webGallery,
      workingDaysAndHours: typeof row.workingDaysAndHours === 'string' ? JSON.parse(row.workingDaysAndHours) : row.workingDaysAndHours,
      reviewsPerRating: typeof row.reviewsPerRating === 'string' ? JSON.parse(row.reviewsPerRating) : row.reviewsPerRating,
      popularTimes: typeof row.popularTimes === 'string' ? JSON.parse(row.popularTimes) : row.popularTimes,
      userReviews: typeof row.userReviews === 'string' ? JSON.parse(row.userReviews) : row.userReviews,
      location: {
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude)
      }
    }));

    // Remove latitude/longitude from root level
    pharmacies.forEach(p => {
      delete p.latitude;
      delete p.longitude;
    });

    res.json({
      success: true,
      data: pharmacies,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pharmacies',
      message: error.message
    });
  }
});

// GET /pharmacy/api/pharmacies/:id - Get single pharmacy by ID
app.get(`${API_PREFIX}/pharmacies/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        id,
        place_id as "placeId",
        name,
        contact,
        email,
        address,
        avatar_url as "avatarUrl",
        cover_image_url as "coverImageUrl",
        building_image_url as "buildingImageUrl",
        thumbnail_url as "thumbnailUrl",
        tag_line as "tagLine",
        website,
        description,
        is_pickup as "isPickup",
        is_delivery as "isDelivery",
        is_available as "isAvailable",
        is_visible as "isVisible",
        is_official as "isOfficial",
        building_information as "buildingInformation",
        floor_no as "floorNo",
        panorama_image_url as "panoramaImageUrl",
        gallery,
        web_gallery as "webGallery",
        has_ownership_claim as "hasOwnershipClaim",
        status,
        working_days_and_hours as "workingDaysAndHours",
        avg_ratings as "avgRatings",
        review_count as "reviewCount",
        reviews_per_rating as "reviewsPerRating",
        popular_times as "popularTimes",
        user_reviews as "userReviews",
        price_range as "priceRange",
        plus_code as "plusCode",
        timezone,
        cid,
        latitude,
        longitude,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM pharmacies
      WHERE id = $1 AND status = 'active' AND is_visible = true
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pharmacy not found'
      });
    }

    const pharmacy = {
      ...result.rows[0],
      // Parse JSON fields if they're strings
      gallery: typeof result.rows[0].gallery === 'string' ? JSON.parse(result.rows[0].gallery) : result.rows[0].gallery,
      webGallery: typeof result.rows[0].webGallery === 'string' ? JSON.parse(result.rows[0].webGallery) : result.rows[0].webGallery,
      workingDaysAndHours: typeof result.rows[0].workingDaysAndHours === 'string' ? JSON.parse(result.rows[0].workingDaysAndHours) : result.rows[0].workingDaysAndHours,
      reviewsPerRating: typeof result.rows[0].reviewsPerRating === 'string' ? JSON.parse(result.rows[0].reviewsPerRating) : result.rows[0].reviewsPerRating,
      popularTimes: typeof result.rows[0].popularTimes === 'string' ? JSON.parse(result.rows[0].popularTimes) : result.rows[0].popularTimes,
      userReviews: typeof result.rows[0].userReviews === 'string' ? JSON.parse(result.rows[0].userReviews) : result.rows[0].userReviews,
      location: {
        lat: parseFloat(result.rows[0].latitude),
        lng: parseFloat(result.rows[0].longitude)
      }
    };

    delete pharmacy.latitude;
    delete pharmacy.longitude;

    res.json({
      success: true,
      data: pharmacy
    });

  } catch (error) {
    console.error('Error fetching pharmacy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pharmacy',
      message: error.message
    });
  }
});

// GET /pharmacy/api/stats - Get database statistics
app.get(`${API_PREFIX}/stats`, async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_pickup = true) as "withPickup",
        COUNT(*) FILTER (WHERE is_delivery = true) as "withDelivery",
        ROUND(AVG(avg_ratings), 2) as "avgRating",
        COUNT(*) FILTER (WHERE avg_ratings > 0) as "withRatings",
        COUNT(*) FILTER (WHERE contact IS NOT NULL AND contact != '') as "withContact",
        COUNT(*) FILTER (WHERE email IS NOT NULL AND email != '') as "withEmail",
        COUNT(*) FILTER (WHERE website IS NOT NULL AND website != '') as "withWebsite"
      FROM pharmacies
      WHERE status = 'active' AND is_visible = true
    `;

    const result = await pool.query(query);
    const stats = result.rows[0];

    res.json({
      success: true,
      data: {
        total: parseInt(stats.total),
        withPickup: parseInt(stats.withPickup),
        withDelivery: parseInt(stats.withDelivery),
        avgRating: parseFloat(stats.avgRating) || 0,
        withRatings: parseInt(stats.withRatings),
        withContact: parseInt(stats.withContact),
        withEmail: parseInt(stats.withEmail),
        withWebsite: parseInt(stats.withWebsite)
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Pharmacy API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoints:`);
  console.log(`   GET  ${API_PREFIX}/pharmacies - List pharmacies`);
  console.log(`   GET  ${API_PREFIX}/pharmacies/:id - Get single pharmacy`);
  console.log(`   GET  ${API_PREFIX}/stats - Get statistics`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n✅ Server ready to accept requests\n`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, closing server...');
  await pool.end();
  process.exit(0);
});
