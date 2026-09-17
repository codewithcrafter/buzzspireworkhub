import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const isNeon = connectionString?.includes("neon.tech");
  
  if (isNeon) {
    const url = new URL(connectionString!);
    console.log("CONNECTED HOST:", url.hostname);
  }

  const pool = new Pool({
    connectionString,
    ssl: isNeon || connectionString?.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
    family: 4,
  } as any);

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const admin = await prisma.employee.findFirst({
      where: { email: "admin@buzzspireworkhub.com" },
      include: { role: true }
    });

    if (!admin) {
      console.log("Admin record exists: NO");
      return;
    }

    console.log("Admin record exists: YES");
    console.log(`Employee ID stored: YES (${admin.employeeId})`);
    console.log(`Employee Code stored: YES (${admin.employeeCode})`);
    console.log(`Email stored: YES (${admin.email})`);
    console.log(`Account active: YES (${admin.status === "ACTIVE"})`);
    console.log(`Role assigned: YES (${admin.role?.name})`);
    console.log(`Password hash exists: YES (${!!admin.passwordHash})`);
    
    // Check if findByIdentifier style query works for "ADM001"
    const byCode = await prisma.employee.findFirst({
      where: {
        OR: [
          { email: "adm001" },
          { employeeId: "ADM001" },
          { employeeCode: "ADM001" },
        ]
      }
    });

    if (byCode) {
      console.log("Query by ADM001: SUCCESS, found record.");
    } else {
      console.log("Query by ADM001: FAILED to find record.");
    }
    
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
