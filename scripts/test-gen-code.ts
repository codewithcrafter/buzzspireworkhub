import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { AgentService } from '../src/services/agent.service';

async function testGenerate() {
  const employeeId = '7a40585b-95e2-48d2-8b84-cc0185c7c255';
  console.log('Generating code for Gulshan Kumar...');
  
  const token = await AgentService.generatePairingCode(employeeId, 10);
  console.log(`Code generated: ${token.token}`);
}

testGenerate().catch(console.error).finally(() => prisma.$disconnect());
