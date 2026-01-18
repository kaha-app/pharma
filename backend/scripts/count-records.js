import pool from '../db.js';

async function countRecords() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM pharmacies');
    const total = parseInt(result.rows[0].count);
    
    console.log(`\n📊 Database Record Count: ${total} pharmacies\n`);
    
    // Get additional stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE is_visible = true) as visible,
        COUNT(*) FILTER (WHERE is_pickup = true) as with_pickup,
        COUNT(*) FILTER (WHERE is_delivery = true) as with_delivery,
        ROUND(AVG(avg_ratings), 2) as avg_rating
      FROM pharmacies
    `;
    
    const stats = await pool.query(statsQuery);
    const data = stats.rows[0];
    
    console.log('📈 Breakdown:');
    console.log(`   Total records: ${data.total}`);
    console.log(`   Active: ${data.active}`);
    console.log(`   Visible: ${data.visible}`);
    console.log(`   With pickup: ${data.with_pickup}`);
    console.log(`   With delivery: ${data.with_delivery}`);
    console.log(`   Average rating: ${data.avg_rating || 'N/A'}\n`);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

countRecords();
