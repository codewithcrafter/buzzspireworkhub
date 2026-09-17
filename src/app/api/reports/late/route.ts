import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { ApiResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/reports/late
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { searchParams } = new URL(req.url);

    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const rawStart = searchParams.get("startDate");
    const rawEnd = searchParams.get("endDate");
    const startDate = rawStart ? new Date(rawStart) : defaultStart;
    const endDate = rawEnd ? new Date(rawEnd) : defaultEnd;

    let employeeId = searchParams.get("employeeId") || undefined;
    let departmentId = searchParams.get("departmentId") || undefined;

    if (auth.role === "EMPLOYEE") {
      employeeId = auth.employee.id;
      departmentId = undefined;
    } else if (auth.role === "MANAGER") {
      if (auth.employee.departmentId) {
        departmentId = auth.employee.departmentId;
      }
    }

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);
    const skip = (Math.max(1, page) - 1) * limit;

    const where: any = {
      date: { gte: startDate, lte: endDate },
      OR: [{ isLate: true }, { status: "LATE" }],
    };

    if (employeeId) where.employeeId = employeeId;
    if (departmentId) where.employee = { departmentId };

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          employee: {
            select: {
              employeeCode: true,
              fullName: true,
              department: { select: { name: true } },
            },
          },
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    const rows = records.map((r) => ({
      id: r.id,
      employeeCode: r.employee.employeeCode,
      fullName: r.employee.fullName,
      department: r.employee.department?.name || "Unassigned",
      date: r.date,
      checkIn: r.checkIn,
      lateMinutes: r.lateMinutes,
      status: r.status,
    }));

    return NextResponse.json({
      success: true,
      data: {
        rows,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error generating late report", error);
  }
}
