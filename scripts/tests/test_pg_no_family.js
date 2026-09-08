const { Pool } = require("pg");
const connectionString = "postgresql://neondb_owner:npg_fd9SbmRjr8Hx@ep-square-moon-ao36wwjz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?uselibpqcompat=true&sslmode=require";

async function test() {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    // NO family constraint
  });

  try {
    console.log("Connecting without family constraint...");
    await pool.query("SELECT NOW()");
    console.log("Success");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await pool.end();
  }
}
test();
