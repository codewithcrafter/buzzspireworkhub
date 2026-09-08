// Verify leads via same Prisma setup as the app
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 2,
  family: 4,
} as any);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
  // Test the exact same query the API uses
  const leads = await prisma.lead.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    include: {
      assignedEmployee: {
        select: { id: true, name: true, employeeId: true, email: true, role: true },
      },
    },
  });

  console.log(`API-equivalent query returned ${leads.length} leads:`);
  leads.forEach((l) => {
    console.log(`  ${l.name} | ${l.status} | priority=${l.priority} | archived=${l.isArchived} | assigned=${l.assignedEmployee?.name || 'unassigned'}`);
  });

  await prisma.$disconnect();
  await pool.end();
}

verify().catch((e) => { console.error(e); process.exit(1); });
