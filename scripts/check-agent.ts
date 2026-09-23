import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function check() {
  const device = await prisma.agentDevice.findUnique({
    where: { credential: "b57af79dcbec6e2d1113506b10776c85ea477945878d2c91a1fb94123f827fbd" },
    include: { employee: true }
  });
  console.log("Device by credential exists:", !!device);
  
  const deviceById = await prisma.agentDevice.findUnique({
    where: { deviceId: "a22e774e-f691-4665-8aa4-aad6d998ac11" },
    include: { employee: true }
  });
  console.log("Device by deviceId exists:", !!deviceById);

  if (deviceById) {
    console.log("Device details:");
    console.log("- Status:", deviceById.status);
    console.log("- DB Credential starts with:", deviceById.credential.substring(0, 5));
    console.log("- Employee status:", deviceById.employee?.status);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
