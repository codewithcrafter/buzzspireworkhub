import 'dotenv/config';
import { AgentService } from '../src/services/agent.service';
import { prisma } from '../src/lib/prisma';

async function testAuth() {
  const cred = "bd3b5a8eb253592c9be6b9a9543371a4799e371257a958b99a6c94884af7a159";
  
  // 1. Check raw prisma
  const raw = await prisma.agentDevice.findUnique({
    where: { credential: cred }
  });
  console.log("Raw prisma findUnique result:", !!raw);
  
  // 2. Check authenticateDevice
  const device = await AgentService.authenticateDevice(cred);
  console.log("AgentService result:", !!device);
}

testAuth().catch(console.error).finally(() => prisma.$disconnect());
