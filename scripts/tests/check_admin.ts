import { prisma } from "../../src/lib/prisma";
import bcrypt from "bcryptjs";

async function checkAdmin() {
  try {
    // Check all ADMIN users
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        password: true,
        createdAt: true,
      }
    });

    if (admins.length === 0) {
      console.log("❌ NO ADMIN USERS FOUND IN DATABASE");
    } else {
      console.log(`✅ Found ${admins.length} ADMIN user(s):`);
      for (const user of admins) {
        const hasHash = !!user.password;
        const hashPrefix = user.password ? user.password.substring(0, 7) : "NULL";
        const isBcrypt = user.password?.startsWith("$2a$") || user.password?.startsWith("$2b$");
        
        console.log({
          email: user.email,
          name: user.name,
          status: user.status,
          hasPassword: hasHash,
          passwordLength: user.password?.length ?? 0,
          hashPrefix,
          isBcryptHash: isBcrypt,
          createdAt: user.createdAt,
        });
      }
    }

    // Also check if there's a user with buzzspire email but wrong role
    const buzzspireUsers = await prisma.user.findMany({
      where: { email: { contains: "buzzspiremedia.com" } },
      select: { email: true, role: true, status: true, password: true }
    });

    console.log("\n📋 All @buzzspiremedia.com users:");
    if (buzzspireUsers.length === 0) {
      console.log("NONE FOUND");
    } else {
      buzzspireUsers.forEach(u => {
        console.log({ email: u.email, role: u.role, status: u.status, hasPassword: !!u.password, isBcrypt: u.password?.startsWith("$2") });
      });
    }

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
