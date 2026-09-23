import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { AgentService } from "@/services/agent.service";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    if (!hasRole(auth.role, ["ADMIN"])) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { employeeId } = body;

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: "Missing employeeId" },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true, fullName: true, status: true }
    });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    if (employee.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Employee is not active" },
        { status: 400 }
      );
    }

    const token = await AgentService.generatePairingCode(employee.id, 10);

    return NextResponse.json({
      success: true,
      data: {
        code: token.token,
        expiresAt: token.expiresAt,
        employee: {
          id: employee.id,
          fullName: employee.fullName
        }
      },
    });
  } catch (error: any) {
    console.error("Agent Pair Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate pairing code" },
      { status: 400 }
    );
  }
}
