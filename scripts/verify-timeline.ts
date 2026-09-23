import 'dotenv/config';
import { TimelineService } from '../src/services/timeline.service';
import { prisma } from '../src/lib/prisma';

async function verifyTimeline() {
  const employeeId = '7a40585b-95e2-48d2-8b84-cc0185c7c255';
  const timeline = await TimelineService.getEmployeeTimeline(employeeId, new Date('2026-09-22T00:00:00.000Z'));
  
  console.log(`Found ${timeline.length} events in timeline.`);
  console.log("Recent 3 timeline events:");
  console.log(JSON.stringify(timeline.slice(-3), null, 2));
}

verifyTimeline().catch(console.error).finally(() => prisma.$disconnect());
