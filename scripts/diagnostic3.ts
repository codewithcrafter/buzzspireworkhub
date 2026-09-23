import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function diagnose() {
  console.log("=== GULSHAN DIAGNOSTIC ===");
  
  // 1. Find the employee Gulshan
  const gulshan = await prisma.employee.findFirst({
    where: { fullName: { contains: "Gulshan" } },
    include: { role: true }
  });
  
  if (!gulshan) {
    console.log("Could not find Gulshan in DB.");
    return;
  }
  
  console.log(`Employee: ${gulshan.fullName} (ID: ${gulshan.id})`);
  console.log(`Role: ${gulshan.role.name}`);

  // 2. Attendance Status
  const activeAttendance = await prisma.attendance.findFirst({
    where: { employeeId: gulshan.id, checkOut: null },
    orderBy: { checkIn: 'desc' }
  });
  
  console.log(`Attendance Status: ${activeAttendance ? "WORKING/PUNCHED IN" : "NOT PUNCHED IN"}`);

  // 3. Agent Device
  const activeDevice = await prisma.agentDevice.findFirst({
    where: {
      employeeId: gulshan.id,
      status: "ACTIVE"
    }
  });

  if (!activeDevice) {
    console.log(`Active Agent Device: NONE FOUND for this employee!`);
    
    const anyDevice = await prisma.agentDevice.findFirst({
      where: { employeeId: gulshan.id }
    });
    console.log(`Any device for Gulshan? ${anyDevice ? anyDevice.deviceId + ' (' + anyDevice.status + ')' : 'NO'}`);
  } else {
    console.log(`Active Agent Device ID: ${activeDevice.deviceId}`);
    
    // 4. Heartbeat
    const latestHeartbeat = await prisma.activityLog.findFirst({
      where: {
        employeeId: gulshan.id,
        action: "LATEST_HEARTBEAT",
        module: "AGENT"
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (latestHeartbeat) {
      console.log(`Latest Heartbeat: ${latestHeartbeat.createdAt}`);
      console.log(`Heartbeat Meta: ${JSON.stringify(latestHeartbeat.metadata)}`);
      
      let metadataObj = latestHeartbeat.metadata as any;
      if (typeof metadataObj === 'string') {
        try { metadataObj = JSON.parse(metadataObj); } catch(e) {}
      }
      const osIdleSeconds = Number(metadataObj?.osIdleSeconds) || 0;
      
      const secondsSinceHeartbeat = (Date.now() - latestHeartbeat.createdAt.getTime()) / 1000;
      const currentEstimatedIdleSeconds = osIdleSeconds + secondsSinceHeartbeat;
      
      console.log(`Parsed osIdleSeconds: ${osIdleSeconds}`);
      console.log(`Total Est Idle Seconds: ${currentEstimatedIdleSeconds.toFixed(1)}`);
      console.log(`Would trigger popup? ${currentEstimatedIdleSeconds >= 60}`);
    } else {
      console.log(`No LATEST_HEARTBEAT found!`);
    }
  }
}

diagnose().catch(console.error).finally(() => prisma.$disconnect());
