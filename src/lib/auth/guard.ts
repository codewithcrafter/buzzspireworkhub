import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken, AuthJwtPayload } from "./jwt";
import { validateSession } from "./session";
import { ApiResponse } from "@/lib/api-response";

export interface CurrentEmployeeProfile {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  roleId: string;
  departmentId: string | null;
  departmentName: string | null;
  designation: string | null;
  status: string;
  sessionId: string;
}

export type RequireAuthResult =
  | { success: true; employee: CurrentEmployeeProfile; payload: AuthJwtPayload }
  | { success: false; response: NextResponse };

/**
 * Extracts session token from Request headers, cookies, or Next.js cookieStore.
 */
export async function extractToken(req?: Request): Promise<string | null> {
  // 1. Bearer header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7).trim();
    }

    // 2. Raw Cookie header
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)(?:token|employee_token|workhub_token)=([^;]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
  }

  // 3. Next.js cookies()
  try {
    const cookieStore = await cookies();
    return (
      cookieStore.get("token")?.value ||
      cookieStore.get("employee_token")?.value ||
      cookieStore.get("workhub_token")?.value ||
      null
    );
  } catch {
    return null;
  }
}

/**
 * Validates authentication for API routes and Server Actions.
 * Enforces valid signature, active DB status, and valid login session.
 */
export async function requireAuth(req?: Request): Promise<RequireAuthResult> {
  const token = await extractToken(req);

  if (!token) {
    return {
      success: false,
      response: ApiResponse.unauthorized("Authentication required. Please sign in."),
    };
  }

  const payload = await verifyAuthToken(token);
  if (!payload || !payload.sub) {
    return {
      success: false,
      response: ApiResponse.unauthorized("Invalid or expired session token."),
    };
  }

  // Verify employee exists and is active in database
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: payload.sub },
      include: {
        role: true,
        department: true,
      },
    });

    if (!employee) {
      return {
        success: false,
        response: ApiResponse.unauthorized("Employee account not found."),
      };
    }

    if (employee.status !== "ACTIVE") {
      return {
        success: false,
        response: ApiResponse.forbidden("Account is inactive or suspended. Please contact administrator."),
      };
    }

    // Validate active login session if session ID is provided in payload
    if (payload.sessionId) {
      const session = await validateSession(payload.sessionId);
      if (!session) {
        return {
          success: false,
          response: ApiResponse.unauthorized("Session has been revoked or expired."),
        };
      }
    }

    const currentProfile: CurrentEmployeeProfile = {
      id: employee.id,
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role.name,
      roleId: employee.role.id,
      departmentId: employee.departmentId,
      departmentName: employee.department?.name || null,
      designation: employee.designation,
      status: employee.status,
      sessionId: payload.sessionId || "",
    };

    return {
      success: true,
      employee: currentProfile,
      payload,
    };
  } catch (error) {
    console.error("requireAuth database query error:", error);
    return {
      success: false,
      response: ApiResponse.serverError("Authentication verification error.", error),
    };
  }
}

/**
 * Enforces role-based authorization for an authenticated request.
 */
export async function requireRole(
  req: Request | undefined,
  allowedRoles: string[]
): Promise<RequireAuthResult> {
  const auth = await requireAuth(req);
  if (!auth.success) return auth;

  if (!allowedRoles.includes(auth.employee.role)) {
    return {
      success: false,
      response: ApiResponse.forbidden(
        `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}.`
      ),
    };
  }

  return auth;
}

/**
 * Convenience helper to get the currently authenticated employee without throwing.
 */
export async function getCurrentEmployee(req?: Request): Promise<CurrentEmployeeProfile | null> {
  const auth = await requireAuth(req);
  return auth.success ? auth.employee : null;
}

/**
 * Convenience helper to get the current validated session.
 */
export async function getCurrentSession(req?: Request) {
  const token = await extractToken(req);
  if (!token) return null;

  const payload = await verifyAuthToken(token);
  if (!payload?.sessionId) return null;

  return validateSession(payload.sessionId);
}
