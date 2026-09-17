import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth/jwt";
import { SessionService } from "@/services/session.service";
import { AuditService } from "@/services/audit.service";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("employee_token")?.value;

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    if (token) {
      const payload = await verifyAuthToken(token);
      if (payload?.sessionId) {
        await SessionService.revoke(payload.sessionId);
      }
      if (payload?.sub) {
        await AuditService.log({
          employeeId: payload.sub,
          action: "LOGOUT_SUCCESS",
          module: "AUTHENTICATION",
          description: "User logged out successfully",
          ipAddress,
          userAgent,
        });
      }
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear all authentication cookies set at login
    response.cookies.delete("token");
    response.cookies.delete("workhub_token");
    response.cookies.delete("employee_token");

    return response;
  } catch (error) {
    return ApiResponse.serverError("Auth Logout Error", error);
  }
}
