import pool from '../db.js';

async function checkGallery() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT name, gallery, avatar_url, cover_image_url
      FROM pharmacies
      WHERE name ILIKE '%A.K. MEDICAL%'
      LIMIT 1
    `);
    
    if (result.rows.length > 0) {
      const pharmacy = result.rows[0];
      console.log('Pharmacy:', pharmacy.name);
      console.log('Gallery type:', typeof pharmacy.gallery);
      console.log('Gallery:', JSON.stringify(pharmacy.gallery, null, 2));
      console.log('Avatar URL:', pharmacy.avatar_url);
      console.log('Cover Image URL:', pharmacy.cover_image_url);
    } else {
      console.log('Pharmacy not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkGallery();
