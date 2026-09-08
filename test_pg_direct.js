const { Pool } = require("pg");
const connectionString = "postgresql://neondb_owner:npg_fd9SbmRjr8Hx@ep-square-moon-ao36wwjz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function test() {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting to ep-square-moon-ao36wwjz.ap-southeast-1.aws.neon.tech ...");
    const res = await pool.query("SELECT NOW()");
    console.log("Success:", res.rows[0]);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await pool.end();
  }
}
test();
