const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const isNeon = connectionString?.includes("neon.tech");
const pool = new Pool({
  connectionString,
  ssl: isNeon || connectionString?.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  max: 10,
  allowExitOnIdle: true,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Checking DB connection...");
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'home' }
    });
    console.log("Success! Home page record exists:", !!page);
  } catch (error) {
    console.error("Failed to connect:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
