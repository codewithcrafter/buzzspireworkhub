const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4
});

async function main() {
  try {
    const res = await pool.query("SELECT * FROM \"Page\" WHERE slug = 'career'");
    console.log("Record count:", res.rows.length);
    if (res.rows.length > 0) {
      console.log("Record:", res.rows[0]);
    }
    
    const allPages = await pool.query("SELECT slug, title FROM \"Page\"");
    console.log("All pages:", allPages.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}

main();
