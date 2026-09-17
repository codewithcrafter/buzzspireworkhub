import { NextResponse } from "next/server";
import { AgentService } from "@/services/agent.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId } = body;

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: "Missing employeeId" },
        { status: 400 }
      );
    }

    const token = await AgentService.generateEnrollmentToken(employeeId, 24);

    return NextResponse.json({
      success: true,
      data: {
        token: token.token,
        expiresAt: token.expiresAt,
      },
    });
  } catch (error: any) {
    console.error("Agent Token Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate token" },
      { status: 400 }
    );
  }
}
