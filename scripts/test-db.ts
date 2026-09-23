import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function checkDevice() {
  const device = await prisma.agentDevice.findUnique({
    where: { deviceId: 'a22e774e-f691-4665-8aa4-aad6d998ac11' },
    include: { employee: true }
  });
  
  if (!device) {
    console.log("Device not found");
    return;
  }
  
  console.log("device_exists: true");
  console.log("deviceId matches:", device.deviceId === 'a22e774e-f691-4665-8aa4-aad6d998ac11');
  console.log("employeeId:", device.employeeId);
  console.log("status:", device.status);
  console.log("revokedAt exists:", !!device.revokedAt);
  console.log("credential exists:", !!device.credential);
  console.log("stored_credential_length:", device.credential?.length);
  console.log("employee status:", device.employee.status);
  console.log("employee lifecycle status:", device.employee.lifecycleStatus);
  
  // also check if the credential matches exactly
  const matches = device.credential === "bd3b5a8eb253592c9be6b9a9543371a4799e371257a958b99a6c94884af7a159";
  console.log("credential matches exact stored value:", matches);
}

checkDevice().catch(console.error).finally(() => prisma.$disconnect());
