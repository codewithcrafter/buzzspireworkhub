import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { ApiResponse } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    // Apply Rate Limiting (5 attempts per minute per IP)
    const rateCheck = checkRateLimit(`login-${ipAddress}`, { limit: 5, windowMs: 60 * 1000 });
    if (!rateCheck.success) {
      return rateLimitResponse(rateCheck.reset);
    }

    const body = await req.json();
    const identifier = (body.employeeId || body.identifier || body.email || "").toString().trim();
    const password = (body.password || "").toString();

    if (!identifier || !password) {
      return ApiResponse.badRequest("Employee ID and password are required.", req);
    }

    const result = await AuthService.login({
      identifier,
      password,
      ipAddress,
      userAgent,
      portalType: "EMPLOYEE",
    });

    if (!result.success || !result.user) {
      return ApiResponse.error(result.message || "Authentication failed", result.status || 401, result.code || "UNAUTHORIZED", req);
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: result.user,
        data: {
          user: result.user,
          redirectUrl: "/dashboard",
        },
      },
      { status: 200 }
    );

    // Set secure HttpOnly cookies
    response.cookies.set("employee_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("workhub_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    return ApiResponse.serverError("Employee Login Error", error, req);
  }
}
