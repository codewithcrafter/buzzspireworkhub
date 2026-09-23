import { NextResponse } from "next/server";
import { AgentService } from "@/services/agent.service";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const credential = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!credential) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const device = await AgentService.authenticateDevice(credential);
    if (!device) {
      return NextResponse.json({ success: false, error: "Invalid or revoked device credential" }, { status: 403 });
    }

    const body = await req.json();
    const { agentVersion, osIdleSeconds } = body;

    await AgentService.recordHeartbeat(device.deviceId, agentVersion || "unknown");

    if (typeof osIdleSeconds === "number") {
      const lastHeartbeat = await prisma.activityLog.findFirst({
        where: { employeeId: device.employeeId, action: "LATEST_HEARTBEAT", module: "AGENT" },
      });
      
      if (lastHeartbeat) {
        await prisma.activityLog.update({
          where: { id: lastHeartbeat.id },
          data: {
            metadata: { deviceId: device.deviceId, osIdleSeconds },
            createdAt: new Date()
          }
        });
      } else {
        await prisma.activityLog.create({
          data: {
            employeeId: device.employeeId,
            action: "LATEST_HEARTBEAT",
            module: "AGENT",
            description: "Latest Heartbeat State",
            metadata: { deviceId: device.deviceId, osIdleSeconds }
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Agent Heartbeat Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record heartbeat" },
      { status: 500 }
    );
  }
}
