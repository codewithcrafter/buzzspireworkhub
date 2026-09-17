import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (auth.role === "ADMIN") {
      return ApiResponse.forbidden("Administrators do not require idle confirmation.");
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    // Log the interaction
    await prisma.activityLog.create({
      data: {
        employeeId: auth.employee.id,
        action: "IDLE_WORKING_CONFIRMED",
        module: "ATTENDANCE",
        description: `Employee confirmed they are still working after idle prompt.`,
        metadata: { ipAddress, userAgent },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Working status confirmed successfully",
    });
  } catch (error: any) {
    return ApiResponse.serverError("Error confirming working status", error);
  }
}
