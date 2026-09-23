import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function verifyEvents() {
  const events = await prisma.activityLog.findMany({
    where: { action: 'WEBSITE_ACTIVITY' },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log("Website Activity:", JSON.stringify(events, null, 2));
}

verifyEvents().catch(console.error).finally(() => prisma.$disconnect());
