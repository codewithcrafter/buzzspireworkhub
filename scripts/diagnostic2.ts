import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function diagnose() {
  const activeDevice = await prisma.agentDevice.findFirst({
    where: { status: 'ACTIVE' },
    include: { employee: { include: { role: true } } }
  });
  
  if (activeDevice) {
    console.log("Employee Role:", activeDevice.employee.role.name);
  }
}

diagnose().catch(console.error).finally(() => prisma.$disconnect());
