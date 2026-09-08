const { Pool } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_fd9SbmRjr8Hx@ep-square-moon-ao36wwjz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?uselibpqcompat=true&sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  family: 4
});

async function main() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("Success:", res.rows);
  } catch (err) {
    console.error("Error connecting:");
    console.error(err);
  } finally {
    pool.end();
  }
}

main();
