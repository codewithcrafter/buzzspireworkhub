const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const isNeon = connectionString?.includes("neon.tech");
const pool = new Pool({
  connectionString,
  ssl: isNeon || connectionString?.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  max: 10,
  allowExitOnIdle: true,
});

async function testConnection() {
  console.log("Attempting to connect via pg.Pool...");
  try {
    const client = await pool.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    client.release();
  } catch (error) {
    console.error("Connection failed:", error.message);
    if (error.code) console.error("Error code:", error.code);
  } finally {
    await pool.end();
  }
}

testConnection();
