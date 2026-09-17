import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth/jwt";
import { SessionService } from "@/services/session.service";
import { EmployeeService } from "@/services/employee.service";
import { ApiResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("employee_token")?.value;

    if (!token) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.sessionId) {
      return ApiResponse.unauthorized("Invalid or expired session token");
    }

    const session = await SessionService.validate(payload.sessionId);
    if (!session || !session.employee) {
      return ApiResponse.unauthorized("Session revoked or expired");
    }

    const safeUser = EmployeeService.sanitizeEmployee(session.employee);

    return NextResponse.json({
      success: true,
      data: {
        user: safeUser,
      },
      // Top-level fields for backwards compatibility with any existing components
      user: safeUser,
    });
  } catch (error) {
    return ApiResponse.serverError("Auth Me Error", error);
  }
}
