import { NextResponse } from "next/server";
import { AgentService } from "@/services/agent.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, deviceId, deviceName } = body;

    if (!token || !deviceId) {
      return NextResponse.json(
        { success: false, error: "Missing token or deviceId" },
        { status: 400 }
      );
    }

    const device = await AgentService.enrollDevice(token, deviceId, deviceName || "Unknown Device");

    return NextResponse.json({
      success: true,
      data: {
        credential: device.credential,
        employeeId: device.employeeId,
        employeeName: (device as any).employee?.fullName || "Unknown",
        deviceName: device.deviceName,
      },
    });
  } catch (error: any) {
    console.error("Agent Enroll Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to enroll device" },
      { status: 400 }
    );
  }
}
