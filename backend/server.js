import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/pharmacy/api/v1';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pharmacy API',
      version: '1.0.0',
      description: 'API for Kathmandu Pharmacy Directory',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://dev.kaha.com.np/pharmacy/api/v1'
          : `http://localhost:${PORT}${API_PREFIX}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    tags: [
      {
        name: 'Pharmacies',
        description: 'Pharmacy management endpoints',
      },
      {
        name: 'Statistics',
        description: 'Statistics and analytics endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Swagger UI
app.use(`${API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pharmacy API Docs',
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Pharmacy API is running
 */
// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pharmacy API is running' });
});

app.get('/pharmacy/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pharmacy API is running' });
});

/**
 * @swagger
 * /pharmacies:
 *   get:
 *     summary: List pharmacies with pagination, search, and filters
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or address
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum rating filter
 *       - in: query
 *         name: hasPickup
 *         schema:
 *           type: boolean
 *         description: Filter by pickup availability
 *       - in: query
 *         name: hasDelivery
 *         schema:
 *           type: boolean
 *         description: Filter by delivery availability
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, avg_ratings, created_at]
 *           default: name
 *         description: Sort column
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of pharmacies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       500:
 *         description: Server error
 */
// GET /pharmacy/api/v1/pharmacies - List pharmacies with pagination, search, and filters
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

/**
 * @swagger
 * /pharmacies/{id}:
 *   get:
 *     summary: Get single pharmacy by ID
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pharmacy ID
 *     responses:
 *       200:
 *         description: Pharmacy details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Pharmacy not found
 *       500:
 *         description: Server error
 */
// GET /pharmacy/api/v1/pharmacies/:id - Get single pharmacy by ID
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

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get database statistics
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Database statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     withPickup:
 *                       type: integer
 *                     withDelivery:
 *                       type: integer
 *                     avgRating:
 *                       type: number
 *                     withRatings:
 *                       type: integer
 *                     withContact:
 *                       type: integer
 *                     withEmail:
 *                       type: integer
 *                     withWebsite:
 *                       type: integer
 *       500:
 *         description: Server error
 */
// GET /pharmacy/api/v1/stats - Get database statistics
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
  console.log(`� API Docs: http://localhost:${PORT}${API_PREFIX}/docs`);
  console.log(`�📍 API endpoints:`);
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
