import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function checkWebsiteActivity() {
  const events = await prisma.activityLog.findMany({
    where: { 
      action: 'WEBSITE_ACTIVITY',
      // Check for recent events only (within last 3 hours)
      createdAt: { gte: new Date(Date.now() - 3 * 60 * 60 * 1000) }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log("Recent WEBSITE_ACTIVITY events:", JSON.stringify(events, null, 2));
}

checkWebsiteActivity().catch(console.error).finally(() => prisma.$disconnect());
