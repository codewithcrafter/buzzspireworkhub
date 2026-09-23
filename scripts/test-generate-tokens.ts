import 'dotenv/config';
import { AgentService } from '../src/services/agent.service';
import { prisma } from '../src/lib/prisma';

async function setup() {
  // Get an active employee
  const emp = await prisma.employee.findFirst({ where: { status: 'ACTIVE' } });
  if (!emp) {
    console.log("No active employee");
    return;
  }
  
  console.log("Testing with Employee:", emp.fullName, emp.id);

  // Generate 6-digit pair code
  const pairCodeRec = await AgentService.generatePairingCode(emp.id);
  console.log("Generated Pair Code:", pairCodeRec.token);
  
  // Generate old long token
  const longTokenRec = await AgentService.generateEnrollmentToken(emp.id);
  console.log("Generated Long Token:", longTokenRec.token);
}

setup().catch(console.error).finally(() => prisma.$disconnect());
