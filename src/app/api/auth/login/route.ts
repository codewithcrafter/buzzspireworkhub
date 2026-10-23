import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { ApiResponse } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    
    // Apply Rate Limiting (5 attempts per minute per IP)
    const rateCheck = checkRateLimit(`login-${ipAddress}`, { limit: 5, windowMs: 60 * 1000 });
    if (!rateCheck.success) {
      return rateLimitResponse(rateCheck.reset);
    }

    const body = await req.json();
    const identifier = (body.identifier || body.email || body.employeeId || "").toString().trim();
    const password = (body.password || "").toString();

    const userAgent = req.headers.get("user-agent") || undefined;

    if (!identifier || !password) {
      return ApiResponse.badRequest("Email or Employee ID and password are required.");
    }

    const result = await AuthService.login({
      identifier,
      password,
      ipAddress,
      userAgent,
      portalType: "MANAGEMENT",
    });

    if (!result.success || !result.user) {
      return ApiResponse.error(result.message || "Authentication failed", result.status || 401, result.code || "UNAUTHORIZED");
    }

    // Redirect routing based on role
    const redirectUrl = result.user.role === "EMPLOYEE" ? "/staff-dashboard" : "/dashboard";

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          redirectUrl,
        },
      },
      { status: 200 }
    );

    // Set secure HTTP-only auth cookies
    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    response.cookies.set("workhub_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("employee_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error: any) {
    const isConnRefused =
      error?.code === "ECONNREFUSED" ||
      error?.message?.includes("ECONNREFUSED") ||
      error?.cause?.code === "ECONNREFUSED";

    const isSchemaError =
      error?.code === "P2021" ||
      error?.code === "P2022" ||
      error?.cause?.kind === "ColumnNotFound" ||
      error?.cause?.kind === "TableNotFound" ||
      error?.message?.includes("does not exist in the current database");

    if (isConnRefused) {
      console.error("🚨 [POST /api/auth/login - Database Connection Refused]:", {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      return ApiResponse.error(
        "Database connection refused. Verify that the PostgreSQL database is reachable and DATABASE_URL in .env is correct.",
        503,
        "DATABASE_CONNECTION_REFUSED"
      );
    }

    if (isSchemaError) {
      console.error("🚨 [POST /api/auth/login - Database Schema Out of Sync]:", {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      return ApiResponse.error(
        "Database schema is not synchronized (missing table or column). Run prisma db push or migrations.",
        500,
        "DATABASE_SCHEMA_ERROR"
      );
    }

    console.error("🚨 [POST /api/auth/login - Internal Error]:", error);
    return ApiResponse.serverError("Auth Login Route Error", error);
  }
}
