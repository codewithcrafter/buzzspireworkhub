import { NextResponse } from "next/server";
import { AgentService } from "@/services/agent.service";

export async function GET() {
  try {
    const devices = await AgentService.getAllDevices();
    return NextResponse.json({ success: true, data: devices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch devices" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { deviceId } = body;
    if (!deviceId) {
      return NextResponse.json({ success: false, error: "Missing deviceId" }, { status: 400 });
    }
    await AgentService.revokeDevice(deviceId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to revoke device" }, { status: 500 });
  }
}
