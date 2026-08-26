import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "./lib/auth";

// Define protected routes that require authentication
const adminRoutes = ["/admin"];
const clientRoutes = ["/dashboard/client"];
const employeeRoutes = ["/employee", "/dashboard/employee"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Unprotected routes
  // Do NOT protect login routes
  if (pathname === "/login" || pathname === "/employee/login") {
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  }

  // 2. Check if route is protected
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isClientRoute = clientRoutes.some((route) => pathname.startsWith(route));
  const isEmployeeRoute = employeeRoutes.some((route) => pathname.startsWith(route));
  
  const isProtected = isAdminRoute || isClientRoute || isEmployeeRoute;

  if (isProtected) {
    const adminToken = request.cookies.get("token")?.value;
    const employeeToken = request.cookies.get("employee_token")?.value;

    let activeToken: string | undefined;

    // Determine which token to use
    if (isEmployeeRoute) {
      activeToken = employeeToken || adminToken; // Admin can also access employee routes
    } else {
      activeToken = adminToken;
    }

    if (!activeToken) {
      const loginUrl = isEmployeeRoute ? "/employee/login" : "/login";
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }

    const payload = await verifyJwt(activeToken);

    if (!payload) {
      // Invalid or expired token
      const loginUrl = isEmployeeRoute ? "/employee/login" : "/login";
      const redirectResponse = NextResponse.redirect(new URL(loginUrl, request.url));
      
      // Delete the invalid token
      if (isEmployeeRoute && employeeToken) {
        redirectResponse.cookies.delete("employee_token");
      } else {
        redirectResponse.cookies.delete("token");
      }
      return redirectResponse;
    }

    // Role-based access control for admin routes
    if (isAdminRoute && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Role-based access control for client routes
    if (isClientRoute && payload.role !== "CLIENT") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Role-based access control for employee routes
    if (isEmployeeRoute && !["EMPLOYEE", "ADMIN"].includes(payload.role as string)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
