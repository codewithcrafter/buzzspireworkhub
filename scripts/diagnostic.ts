import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function diagnose() {
  console.log("=== IDLE POLLING DIAGNOSTIC 2 ===");
  const activeDevice = await prisma.agentDevice.findFirst({
    where: { status: 'ACTIVE' },
  });
  if (!activeDevice) return console.log("No device");

  for (let i = 0; i < 20; i++) {
    const latestHeartbeat = await prisma.activityLog.findFirst({
      where: { employeeId: activeDevice.employeeId, action: "LATEST_HEARTBEAT", module: "AGENT" },
      orderBy: { createdAt: 'desc' }
    });
    
    if (latestHeartbeat) {
      let metadataObj = latestHeartbeat.metadata as any;
      if (typeof metadataObj === 'string') {
        try { metadataObj = JSON.parse(metadataObj); } catch(e) {}
      }
      const osIdleSeconds = Number(metadataObj?.osIdleSeconds) || 0;
      const secondsSinceHeartbeat = (Date.now() - latestHeartbeat.createdAt.getTime()) / 1000;
      const currentEstimatedIdleSeconds = osIdleSeconds + secondsSinceHeartbeat;
      
      console.log(`[Check ${i+1}] DB osIdleSeconds=${osIdleSeconds}, Total Est=${currentEstimatedIdleSeconds.toFixed(1)}, threshold=60, isIdle=${currentEstimatedIdleSeconds >= 60}`);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

diagnose().catch(console.error).finally(() => prisma.$disconnect());
