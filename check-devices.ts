import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const employeeId = '6e92a9fd-5fbc-4ed0-a136-eb613b677b35';
  
  // 1. Employee
  const emp = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  console.log("Employee:");
  console.log(emp);

  // 2. Devices for this employee
  const devices = await prisma.agentDevice.findMany({
    where: { employeeId },
  });
  
  console.log("\nAgentDevices:");
  for (const d of devices) {
    console.log(`ID: ${d.id}`);
    console.log(`DeviceId: ${d.deviceId}`);
    console.log(`Name: ${d.deviceName}`);
    console.log(`Status: ${d.status}`);
    console.log(`Enrolled: ${d.enrolledAt}`);
    console.log(`LastSeen: ${d.lastSeenAt}`);
    console.log(`Revoked: ${d.revokedAt}`);
    console.log(`Credential length: ${d.credential ? d.credential.length : 0}`);
    console.log("----");
  }

  await prisma.$disconnect();
}

check().catch(console.error);
