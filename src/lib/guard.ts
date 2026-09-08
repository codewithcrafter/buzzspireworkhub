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
    const possibleTokens: string[] = [];

    let isEmployeeRoute = false;
    let isAdminOrClientRoute = false;

    if (req && req.url) {
      // In next.js server components/route handlers, req.url may be a relative or absolute URL
      const urlString = req.url.startsWith('/') ? `http://localhost${req.url}` : req.url;
      try {
        const url = new URL(urlString);
        if (url.pathname.startsWith('/employee') || url.pathname.startsWith('/api/employee')) {
          isEmployeeRoute = true;
        } else if (
          url.pathname.startsWith('/admin') || 
          url.pathname.startsWith('/api/admin') || 
          url.pathname.startsWith('/client') || 
          url.pathname.startsWith('/api/client')
        ) {
          isAdminOrClientRoute = true;
        }
      } catch (e) {
        console.error("Error parsing URL in guard:", e);
      }
    }

    // 1. Try Authorization header
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        possibleTokens.push(authHeader.substring(7).trim());
      }

      // 2. Try cookie from request headers
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const adminMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
        const empMatch = cookieHeader.match(/(?:^|;\s*)employee_token=([^;]+)/);
        
        const adminToken = adminMatch ? decodeURIComponent(adminMatch[1]) : null;
        const empToken = empMatch ? decodeURIComponent(empMatch[1]) : null;

        if (isEmployeeRoute) {
          if (empToken) possibleTokens.push(empToken);
        } else if (isAdminOrClientRoute) {
          if (adminToken) possibleTokens.push(adminToken);
        } else {
          if (adminToken) possibleTokens.push(adminToken);
          if (empToken) possibleTokens.push(empToken);
        }
      }
    }

    // 3. Fallback to Next.js cookie store
    if (possibleTokens.length === 0) {
      try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("token")?.value;
        const empToken = cookieStore.get("employee_token")?.value;
        
        if (isEmployeeRoute) {
          if (empToken) possibleTokens.push(empToken);
        } else if (isAdminOrClientRoute) {
          if (adminToken) possibleTokens.push(adminToken);
        } else {
          if (adminToken) possibleTokens.push(adminToken);
          if (empToken) possibleTokens.push(empToken);
        }
      } catch {
        // cookies() may throw in non-request contexts
      }
    }

    if (possibleTokens.length === 0) {
      return {
        authenticated: false,
        response: ApiResponse.unauthorized("Authentication required"),
      };
    }

    let lastErrorResponse = ApiResponse.unauthorized("Authentication required");

    // Loop through all provided tokens to see if one satisfies the requirements
    for (const token of possibleTokens) {
      const payload = await verifyJwt(token);
      if (!payload || !payload.id) {
        lastErrorResponse = ApiResponse.unauthorized("Invalid or expired session token");
        continue;
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
        lastErrorResponse = ApiResponse.unauthorized("User account no longer exists");
        continue;
      }

      if (dbUser.status === "INACTIVE" || dbUser.status === "SUSPENDED") {
        lastErrorResponse = ApiResponse.forbidden("Account is inactive or suspended");
        continue;
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
      let roleFailed = false;
      if (options.requiredRole) {
        const allowedRoles = Array.isArray(options.requiredRole)
          ? options.requiredRole
          : [options.requiredRole];

        if (!allowedRoles.includes(user.role)) {
          lastErrorResponse = ApiResponse.forbidden(`Access restricted to ${allowedRoles.join(" / ")}`);
          roleFailed = true;
        }
      }
      if (roleFailed) continue;

      // Single permission check
      let permFailed = false;
      if (options.requiredPermission) {
        if (!hasPermission(user, options.requiredPermission)) {
          lastErrorResponse = ApiResponse.forbidden(`Permission denied: '${options.requiredPermission}' required`);
          permFailed = true;
        }
      }
      if (permFailed) continue;

      // Any permission check
      if (options.requiredAnyPermission && options.requiredAnyPermission.length > 0) {
        const hasAny = options.requiredAnyPermission.some((perm) =>
          hasPermission(user, perm)
        );
        if (!hasAny && user.role !== "ADMIN") {
          lastErrorResponse = ApiResponse.forbidden(
            `Permission denied: requires at least one of [${options.requiredAnyPermission.join(", ")}]`
          );
          permFailed = true;
        }
      }
      if (permFailed) continue;

      // If we reach here, this user session meets all requirements!
      return { authenticated: true, user };
    }

    return {
      authenticated: false,
      response: lastErrorResponse,
    };
  } catch (error) {
    console.error("Auth guard error:", error);
    return {
      authenticated: false,
      response: ApiResponse.serverError("Authentication verification error", error),
    };
  }
}
