require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false }, 
  family: 4 
});
const p = new PrismaClient({ adapter: new PrismaPg(pool) });

async function check() {
  const user = await p.user.findUnique({ 
    where: { email: "admin@buzzspiremedia.com" }, 
    select: { password: true, status: true, role: true } 
  });

  if (!user) { 
    console.log("USER NOT FOUND IN DB");
    return;
  }

  console.log("User status:", user.status);
  console.log("User role:", user.role);
  console.log("Password hash length:", user.password?.length);
  console.log("Hash prefix (first 10 chars):", user.password?.substring(0, 10));
  console.log("Is valid bcrypt format:", user.password ? (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) : false);

  // Diagnose: check if the bcrypt rounds indicate unusually high cost
  if (user.password) {
    const parts = user.password.split("$");
    console.log("Bcrypt cost factor:", parts[2] ? parseInt(parts[2]) : "unknown");
  }

  // Check login page behavior: normalize email the same way the API does
  const normalizedEmail = "admin@buzzspiremedia.com".trim().toLowerCase();
  const userByNormalized = await p.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } });
  console.log("Lookup by normalized email works:", !!userByNormalized);

  // ENV check (without exposing secrets)
  console.log("\n=== ENV DIAGNOSTICS ===");
  console.log("JWT_SECRET set:", !!process.env.JWT_SECRET, process.env.JWT_SECRET ? "(length: " + process.env.JWT_SECRET.length + ")" : "[MISSING]");
  console.log("NODE_ENV:", process.env.NODE_ENV || "not set");
  console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
  console.log("DATABASE_URL domain:", process.env.DATABASE_URL?.match(/@([^/]+)\//)?.[1] || "parse error");

  await p.$disconnect();
  await pool.end();
}

check().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
