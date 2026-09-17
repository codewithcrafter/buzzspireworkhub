import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "default_buzzspire_workhub_jwt_secret_key_2026_dev";
  return new TextEncoder().encode(secret);
};

// Protected routes for BUZZSPIRE WORKHUB
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/employees",
  "/departments",
  "/attendance",
  "/leaves",
  "/holidays",
  "/reports",
  "/audit",
  "/settings",
  "/profile",
  "/my-history",
  "/staff-dashboard",
];

const ADMIN_ONLY_PREFIXES = [
  "/dashboard",
  "/admin",
  "/employees",
  "/departments",
  "/reports",
  "/audit",
  "/settings",
];

const AUTH_PATHS = ["/login", "/employee/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isAuthPath = AUTH_PATHS.some((path) => pathname === path);
  const isRoot = pathname === "/";

  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("employee_token")?.value ||
    request.cookies.get("workhub_token")?.value;

  let payload: any = null;

  if (token) {
    try {
      const { payload: verified } = await jwtVerify(token, getJwtSecretKey());
      payload = verified;
    } catch {
      payload = null;
    }
  }

  // Helper to get correct dashboard based on role
  const getDashboardUrl = () => {
    if (payload?.role === "EMPLOYEE") return new URL("/staff-dashboard", request.url);
    return new URL("/dashboard", request.url);
  };

  // 1. Root route: Unauthenticated -> /login, Authenticated -> Role Dashboard
  if (isRoot) {
    if (payload) {
      return NextResponse.redirect(getDashboardUrl());
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. Unauthenticated user trying to access protected route
  if (isProtected && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Employee trying to access Admin/Management routes
  if (payload && payload.role === "EMPLOYEE") {
    const isAdminRoute = ADMIN_ONLY_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    if (isAdminRoute || pathname.startsWith("/attendance")) {
       // Employees shouldn't access the global /attendance view either
       return NextResponse.redirect(getDashboardUrl());
    }
  }

  // 3b. Admin trying to access Employee self-service routes
  if (payload && payload.role === "ADMIN") {
    const isEmployeeRoute = ["/my-history", "/staff-dashboard"].some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
    if (isEmployeeRoute) {
      return NextResponse.redirect(getDashboardUrl());
    }
  }

  // 4. Non-admin trying to access /admin (strict admin only)
  if (pathname.startsWith("/admin") && payload && payload.role !== "ADMIN") {
    return NextResponse.redirect(getDashboardUrl());
  }

  // 5. Already logged in user visiting login page
  if (isAuthPath && payload) {
    return NextResponse.redirect(getDashboardUrl());
  }

  // Security response headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
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
