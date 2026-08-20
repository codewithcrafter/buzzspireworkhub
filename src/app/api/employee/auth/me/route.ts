import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredRole: ["EMPLOYEE", "ADMIN"],
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const employee = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
        employeeProfile: {
          select: {
            designation: true,
            role: true,
            salary: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      return ApiResponse.notFound("Employee record not found");
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: employee.id,
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          role: employee.role,
          status: employee.status,
          permissions: employee.permissions,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
          department: employee.employeeProfile?.department?.name || null,
          designation: employee.employeeProfile?.designation || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Employee Auth Me error:", error);
    return ApiResponse.serverError("Employee profile lookup error", error);
  }
}
