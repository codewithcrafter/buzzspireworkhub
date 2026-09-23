import { prisma } from "../src/lib/prisma";

async function check() {
  const logs = await prisma.activityLog.findMany({
    where: { module: "AGENT" },
    orderBy: { createdAt: "desc" },
    take: 10
  });
  console.log("Recent Agent Activity Logs:", logs);

  const device = await prisma.agentDevice.findFirst({
     orderBy: { lastSeenAt: "desc" }
  });
  console.log("Latest AgentDevice:", device);
}

check().catch(console.error).finally(() => prisma.$disconnect());
