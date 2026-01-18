import pool from '../db.js';

const createTableSQL = `
-- Drop existing table if exists
DROP TABLE IF EXISTS pharmacies CASCADE;

-- Create pharmacies table
CREATE TABLE pharmacies (
  id SERIAL PRIMARY KEY,
  place_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(100),
  email VARCHAR(255),
  address TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  building_image_url TEXT,
  thumbnail_url TEXT,
  tag_line TEXT,
  website VARCHAR(500),
  description TEXT,
  is_pickup BOOLEAN DEFAULT false,
  is_delivery BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  is_official BOOLEAN DEFAULT false,
  building_information TEXT,
  floor_no VARCHAR(50),
  panorama_image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  web_gallery JSONB DEFAULT '[]'::jsonb,
  has_ownership_claim BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  working_days_and_hours JSONB DEFAULT '{}'::jsonb,
  avg_ratings DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  reviews_per_rating JSONB DEFAULT '{}'::jsonb,
  popular_times JSONB DEFAULT '{}'::jsonb,
  user_reviews JSONB DEFAULT '[]'::jsonb,
  price_range VARCHAR(50),
  plus_code VARCHAR(50),
  timezone VARCHAR(100),
  cid VARCHAR(100),
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX idx_pharmacies_name ON pharmacies(name);
CREATE INDEX idx_pharmacies_rating ON pharmacies(avg_ratings DESC);
CREATE INDEX idx_pharmacies_review_count ON pharmacies(review_count DESC);
CREATE INDEX idx_pharmacies_location ON pharmacies(latitude, longitude);
CREATE INDEX idx_pharmacies_pickup ON pharmacies(is_pickup) WHERE is_pickup = true;
CREATE INDEX idx_pharmacies_delivery ON pharmacies(is_delivery) WHERE is_delivery = true;
CREATE INDEX idx_pharmacies_status ON pharmacies(status);

-- Create full-text search index
CREATE INDEX idx_pharmacies_search ON pharmacies USING gin(to_tsvector('english', name || ' ' || COALESCE(address, '')));

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON pharmacies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Initializing database schema...');
    
    await client.query(createTableSQL);
    
    console.log('✅ Database schema created successfully!');
    console.log('📊 Tables created:');
    console.log('   - pharmacies (with indexes and triggers)');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run initialization
initDatabase()
  .then(() => {
    console.log('✅ Database initialization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  });
