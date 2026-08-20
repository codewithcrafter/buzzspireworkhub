import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.EMPLOYEES_MANAGE,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;
    const body = await req.json();
    const newPassword = body.password;

    if (!newPassword || typeof newPassword !== "string") {
      return ApiResponse.badRequest("New password is required");
    }

    if (newPassword.length < 6) {
      return ApiResponse.badRequest("Password must be at least 6 characters long");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return ApiResponse.notFound("Employee not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Password reset successfully for ${targetUser.name}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Employee password reset error:", error);
    return ApiResponse.serverError("Error resetting employee password", error);
  }
}
