import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyJwt } from "./auth";
import { ApiResponse } from "./api-response";
import {
  hasPermission,
  Permission,
  AllowedRole,
} from "./auth/permissions";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: AllowedRole;
  employeeId: string;
  employeeCode: string;
  departmentId: string | null;
  status: string;
}

export interface AuthGuardOptions {
  /** Required role(s). ADMIN always bypasses. */
  requiredRole?: AllowedRole | AllowedRole[];
  /** Single WorkHub permission required. Accepts string for legacy compat. */
  requiredPermission?: Permission | string;
  /** At least one of these permissions required. Accepts strings for legacy compat. */
  requiredAnyPermission?: (Permission | string)[];
}

export type AuthResult =
  | { authenticated: true; user: AuthenticatedUser }
  | { authenticated: false; response: NextResponse };

// ─── Main Guard ───────────────────────────────────────────────────────────────

/**
 * Extracts and verifies the employee session JWT from cookies,
 * verifies it against the live Employee row in the database,
 * and enforces server-side role and permission authorization.
 *
 * Uses `prisma.employee` — NOT the legacy `prisma.user`.
 */
export async function authenticateRequest(
  req?: Request,
  options: AuthGuardOptions = {}
): Promise<AuthResult> {
  try {
    const possibleTokens: string[] = [];

    // 1. Try Authorization header (Bearer token)
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        possibleTokens.push(authHeader.substring(7).trim());
      }

      // 2. Try cookie from request headers
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const adminMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
        const empMatch = cookieHeader.match(
          /(?:^|;\s*)employee_token=([^;]+)/
        );
        const adminToken = adminMatch
          ? decodeURIComponent(adminMatch[1])
          : null;
        const empToken = empMatch ? decodeURIComponent(empMatch[1]) : null;

        if (adminToken) possibleTokens.push(adminToken);
        if (empToken) possibleTokens.push(empToken);
      }
    }

    // 3. Fallback — Next.js cookie store (Server Components context)
    if (possibleTokens.length === 0) {
      try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("token")?.value;
        const empToken = cookieStore.get("employee_token")?.value;
        if (adminToken) possibleTokens.push(adminToken);
        if (empToken) possibleTokens.push(empToken);
      } catch {
        // cookies() may throw outside request context
      }
    }

    if (possibleTokens.length === 0) {
      return {
        authenticated: false,
        response: ApiResponse.unauthorized("Authentication required"),
      };
    }

    let lastErrorResponse = ApiResponse.unauthorized("Authentication required");

    for (const token of possibleTokens) {
      const payload = await verifyJwt(token);

      // JWT payload sub = employee.id (set at login)
      const employeeDbId =
        (payload?.sub as string) || (payload?.id as string);

      if (!payload || !employeeDbId) {
        lastErrorResponse = ApiResponse.unauthorized(
          "Invalid or expired session token"
        );
        continue;
      }

      // Fetch live Employee record — never trust stale JWT claims for role/status
      const dbEmployee = await prisma.employee.findUnique({
        where: { id: employeeDbId },
        select: {
          id: true,
          employeeId: true,
          employeeCode: true,
          fullName: true,
          email: true,
          status: true,
          departmentId: true,
          role: { select: { name: true } },
        },
      });

      if (!dbEmployee) {
        lastErrorResponse = ApiResponse.unauthorized(
          "Employee account no longer exists"
        );
        continue;
      }

      if (dbEmployee.status !== "ACTIVE") {
        lastErrorResponse = ApiResponse.forbidden(
          "Account is inactive or suspended"
        );
        continue;
      }

      const user: AuthenticatedUser = {
        id: dbEmployee.id,
        name: dbEmployee.fullName,
        email: dbEmployee.email,
        role: dbEmployee.role.name as AllowedRole,
        employeeId: dbEmployee.employeeId,
        employeeCode: dbEmployee.employeeCode,
        departmentId: dbEmployee.departmentId,
        status: dbEmployee.status,
      };

      // ── Role check ──────────────────────────────────────────────────────
      if (options.requiredRole) {
        const allowedRoles = Array.isArray(options.requiredRole)
          ? options.requiredRole
          : [options.requiredRole];

        if (
          user.role !== "ADMIN" &&
          !allowedRoles.includes(user.role)
        ) {
          lastErrorResponse = ApiResponse.forbidden(
            `Access restricted to: ${allowedRoles.join(" / ")}`
          );
          continue;
        }
      }

      // ── Single permission check ──────────────────────────────────────────
      if (
        options.requiredPermission &&
        !hasPermission(user.role, options.requiredPermission as Permission)
      ) {
        lastErrorResponse = ApiResponse.forbidden(
          `Permission denied: '${options.requiredPermission}' required`
        );
        continue;
      }

      // ── Any-of permission check ──────────────────────────────────────────
      if (
        options.requiredAnyPermission &&
        options.requiredAnyPermission.length > 0
      ) {
        const hasAny = options.requiredAnyPermission.some((p) =>
          hasPermission(user.role, p as Permission)
        );
        if (!hasAny) {
          lastErrorResponse = ApiResponse.forbidden(
            `Permission denied: requires at least one of [${options.requiredAnyPermission.join(", ")}]`
          );
          continue;
        }
      }

      // All checks passed
      return { authenticated: true, user };
    }

    return { authenticated: false, response: lastErrorResponse };
  } catch (error) {
    console.error("Auth guard error:", error);
    return {
      authenticated: false,
      response: ApiResponse.serverError(
        "Authentication verification error",
        error
      ),
    };
  }
}
