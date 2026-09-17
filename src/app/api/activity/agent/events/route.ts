import { NextResponse } from "next/server";
import { AgentService } from "@/services/agent.service";

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
    const { events } = body;

    if (!Array.isArray(events)) {
      return NextResponse.json({ success: false, error: "Events must be an array" }, { status: 400 });
    }

    const result = await AgentService.ingestEvents(device.employeeId, device.deviceId, events);

    // Also record a heartbeat implicitly
    await AgentService.recordHeartbeat(device.deviceId, "implicit");

    return NextResponse.json({ success: true, ingestedCount: result.count });
  } catch (error: any) {
    console.error("Agent Events Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to ingest events" },
      { status: 500 }
    );
  }
}
