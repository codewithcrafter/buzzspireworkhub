/**
 * BuzzSpire WorkHub — Admin Password Reset Script
 *
 * Resets or updates the administrator's password to a secure hashed value.
 *
 * Usage:
 *   npx tsx scripts/reset-admin-password.ts
 *   or:
 *   npx tsx scripts/reset-admin-password.ts "CustomPasswordHere"
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, RoleName } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. Connection setup with Neon SSL and IPv4 resolution
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ [Reset Admin] FATAL: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const isNeon = connectionString.includes("neon.tech");
const pool = new Pool({
  connectionString,
  ssl: isNeon || connectionString.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
  family: 4, // IPv4 resolution fix
} as any);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BCRYPT_SALT_ROUNDS = 10;
const TARGET_PASSWORD = process.argv[2] || process.env.ADMIN_NEW_PASSWORD || "Admin@123";

async function resetAdminPassword() {
  console.log("==========================================================");
  console.log("   BUZZSPIRE WORKHUB — ADMIN PASSWORD RESET UTILITY");
  console.log("==========================================================\n");

  try {
    // 1. Validate password strength / format
    if (!TARGET_PASSWORD || TARGET_PASSWORD.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    console.log("🔒 1. Generating bcrypt hash with salt rounds:", BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(TARGET_PASSWORD, BCRYPT_SALT_ROUNDS);

    // Verify hash integrity before database commit
    const isHashValid = await bcrypt.compare(TARGET_PASSWORD, passwordHash);
    if (!isHashValid) {
      throw new Error("Self-check failed: Generated bcrypt hash did not verify against target password.");
    }
    console.log("   ✓ Bcrypt hash generated and verified successfully.");

    // 2. Locate Admin Employee Account
    console.log("\n🔍 2. Locating administrative user account...");
    const adminEmployees = await prisma.employee.findMany({
      where: {
        OR: [
          { employeeCode: "ADM001" },
          { email: "admin@buzzspireworkhub.com" },
          { role: { name: RoleName.ADMIN } },
        ],
      },
      include: {
        role: true,
      },
    });

    if (adminEmployees.length === 0) {
      console.warn("⚠️ No admin employee found matching 'ADM001', 'admin@buzzspireworkhub.com', or Role 'ADMIN'.");
      console.log("   Checking if any user with ADMIN role exists...");

      const adminRole = await prisma.role.findFirst({
        where: { name: RoleName.ADMIN },
      });

      if (!adminRole) {
        throw new Error("Role 'ADMIN' does not exist in the database. Please run database seed first.");
      }

      throw new Error("No administrator account found to update. Please seed the database first.");
    }

    console.log(`   ✓ Found ${adminEmployees.length} matching administrative account(s):`);
    for (const emp of adminEmployees) {
      console.log(`     • [${emp.employeeCode}] ${emp.fullName} (${emp.email}) — Role: ${emp.role.name}`);
    }

    // 3. Perform update in a safe atomic transaction
    console.log("\n⚡ 3. Applying password update and resetting lockout flags in transaction...");
    const updatedEmployees = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const emp of adminEmployees) {
        const updated = await tx.employee.update({
          where: { id: emp.id },
          data: {
            passwordHash,
            failedLoginAttempts: 0,
            lockedUntil: null,
            passwordResetToken: null,
            passwordResetExpiry: null,
          },
          select: {
            id: true,
            employeeCode: true,
            email: true,
            fullName: true,
            updatedAt: true,
            role: {
              select: { name: true },
            },
          },
        });
        results.push(updated);
      }
      return results;
    });

    console.log("\n==========================================================");
    console.log("✅ SUCCESS: Admin password successfully updated!");
    console.log("==========================================================");
    for (const emp of updatedEmployees) {
      console.log(`   Account:    ${emp.fullName}`);
      console.log(`   Email:      ${emp.email}`);
      console.log(`   Code:       ${emp.employeeCode}`);
      console.log(`   Role:       ${emp.role.name}`);
      console.log(`   Updated At: ${emp.updatedAt.toISOString()}`);
      console.log("   Status:     Active (Failed login attempts reset to 0)");
      console.log("----------------------------------------------------------");
    }
    console.log("🔑 You may now sign in at http://localhost:3000/login\n");

  } catch (error: any) {
    console.error("\n❌ [Reset Admin Error]:", error?.message || error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

resetAdminPassword();
