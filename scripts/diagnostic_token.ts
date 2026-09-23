import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function diagnose() {
  console.log("=== ENROLLMENT TOKEN DIAGNOSTIC ===");
  
  const token = await prisma.agentEnrollmentToken.findUnique({
    where: { token: "e8adfe9a88a5f5a6e77f58dc0a6acae6" }
  });
  
  if (token) {
    console.log(`Token found!`);
    console.log(`Employee ID: ${token.employeeId}`);
    console.log(`Expires At: ${token.expiresAt.toISOString()}`);
    console.log(`Is Used: ${token.isUsed}`);
    console.log(`Current Time: ${new Date().toISOString()}`);
  } else {
    console.log(`Token NOT FOUND in DB!`);
    
    // Look at all recent tokens just in case it's trimmed or hashed
    const allRecent = await prisma.agentEnrollmentToken.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log("\nRecent tokens:");
    for (const t of allRecent) {
      console.log(`- ${t.token} (Employee: ${t.employeeId}, Used: ${t.isUsed})`);
    }
  }
}

diagnose().catch(console.error).finally(() => prisma.$disconnect());
