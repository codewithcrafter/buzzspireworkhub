import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    await limiter.check(10, ip); // Max 10 attempts per min per IP

    const body = await req.json();
    const identifier = (body.employeeId || body.identifier || body.email || "").trim();
    const password = body.password;

    if (!identifier || !password) {
      return ApiResponse.badRequest("Employee ID and password are required");
    }

    // Lookup user by employeeId (case-insensitive) or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { employeeId: { equals: identifier, mode: "insensitive" } },
          { email: identifier.toLowerCase() },
        ],
      },
      include: {
        employeeProfile: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user || !user.password) {
      return ApiResponse.unauthorized("Invalid Employee ID or password");
    }

    // Role check: must be EMPLOYEE or ADMIN
    if (user.role !== "EMPLOYEE" && user.role !== "ADMIN") {
      return ApiResponse.forbidden("Access denied: Not an employee account");
    }

    // Status check
    if (user.status !== "ACTIVE") {
      return ApiResponse.forbidden(
        `Account is ${user.status.toLowerCase()}. Please contact the administrator.`
      );
    }

    // Verify bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ApiResponse.unauthorized("Invalid Employee ID or password");
    }

    // Create session JWT
    const token = await signJwt({
      id: user.id,
      email: user.email,
      employeeId: user.employeeId,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
    });

    // Sanitized user response
    const sanitizedUser = {
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: user.permissions,
      department: user.employeeProfile?.department?.name || null,
      designation: user.employeeProfile?.designation || null,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: sanitizedUser,
      },
      { status: 200 }
    );

    // Set secure HttpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Employee login error:", error);
    return ApiResponse.serverError("Employee login error", error);
  }
}
