const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const isNeon = connectionString?.includes("neon.tech");
const pool = new Pool({
  connectionString,
  ssl: isNeon || connectionString?.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testPrisma() {
  console.log("Testing Prisma...");
  try {
    const page = await prisma.page.findFirst();
    console.log("Prisma query succeeded:", page?.slug);
  } catch (error) {
    console.error("Prisma query failed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testPrisma();
