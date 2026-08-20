import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyJwt } from "./auth";
import { ApiResponse } from "./api-response";
import { hasPermission, PermissionValue, PermissionKey } from "./permissions";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId?: string | null;
  status: string;
  permissions: string[];
}

export interface AuthGuardOptions {
  requiredRole?: string | string[];
  requiredPermission?: PermissionValue | PermissionKey;
  requiredAnyPermission?: (PermissionValue | PermissionKey)[];
}

export type AuthResult =
  | { authenticated: true; user: AuthenticatedUser }
  | { authenticated: false; response: NextResponse };

/**
 * Extracts and verifies the user session, checks DB active status,
 * and enforces server-side role and permission authorization.
 */
export async function authenticateRequest(
  req?: Request,
  options: AuthGuardOptions = {}
): Promise<AuthResult> {
  try {
    let token: string | null | undefined = null;

    // 1. Try Authorization header
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }

      // 2. Try cookie from request headers
      if (!token) {
        const cookieHeader = req.headers.get("cookie");
        if (cookieHeader) {
          const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
          if (match) {
            token = decodeURIComponent(match[1]);
          }
        }
      }
    }

    // 3. Fallback to Next.js cookie store
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get("token")?.value;
      } catch {
        // cookies() may throw in non-request contexts
      }
    }

    if (!token) {
      return {
        authenticated: false,
        response: ApiResponse.unauthorized("Authentication required"),
      };
    }

    const payload = await verifyJwt(token);
    if (!payload || !payload.id) {
      return {
        authenticated: false,
        response: ApiResponse.unauthorized("Invalid or expired session token"),
      };
    }

    // Fetch active user from database to ensure up-to-date role, permissions and status
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        employeeId: true,
        status: true,
        permissions: true,
      },
    });

    if (!dbUser) {
      return {
        authenticated: false,
        response: ApiResponse.unauthorized("User account no longer exists"),
      };
    }

    if (dbUser.status === "INACTIVE" || dbUser.status === "SUSPENDED") {
      return {
        authenticated: false,
        response: ApiResponse.forbidden("Account is inactive or suspended"),
      };
    }

    const user: AuthenticatedUser = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      employeeId: dbUser.employeeId,
      status: dbUser.status,
      permissions: Array.isArray(dbUser.permissions) ? dbUser.permissions : [],
    };

    // Role check
    if (options.requiredRole) {
      const allowedRoles = Array.isArray(options.requiredRole)
        ? options.requiredRole
        : [options.requiredRole];

      if (!allowedRoles.includes(user.role)) {
        return {
          authenticated: false,
          response: ApiResponse.forbidden(
            `Access restricted to ${allowedRoles.join(" / ")}`
          ),
        };
      }
    }

    // Single permission check
    if (options.requiredPermission) {
      if (!hasPermission(user, options.requiredPermission)) {
        return {
          authenticated: false,
          response: ApiResponse.forbidden(
            `Permission denied: '${options.requiredPermission}' required`
          ),
        };
      }
    }

    // Any permission check
    if (options.requiredAnyPermission && options.requiredAnyPermission.length > 0) {
      const hasAny = options.requiredAnyPermission.some((perm) =>
        hasPermission(user, perm)
      );
      if (!hasAny && user.role !== "ADMIN") {
        return {
          authenticated: false,
          response: ApiResponse.forbidden(
            `Permission denied: requires at least one of [${options.requiredAnyPermission.join(
              ", "
            )}]`
          ),
        };
      }
    }

    return { authenticated: true, user };
  } catch (error) {
    console.error("Auth guard error:", error);
    return {
      authenticated: false,
      response: ApiResponse.serverError("Authentication verification error", error),
    };
  }
}
