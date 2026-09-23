import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function diagnose() {
  console.log("=== DEVICE OWNER DIAGNOSTIC ===");
  
  const dev = await prisma.agentDevice.findUnique({
    where: { deviceId: "a22e774e-f691-4668-5aa4-aad6d998ac11" },
    include: { employee: true }
  });
  
  if (dev) {
    console.log(`Device found!`);
    console.log(`Owner: ${dev.employee.fullName} (${dev.employeeId})`);
    console.log(`Status: ${dev.status}`);
  } else {
    console.log(`Device NOT FOUND in DB!`);
  }
}

diagnose().catch(console.error).finally(() => prisma.$disconnect());
