import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    
    // RBAC
    const isAdmin = hasRole(auth.role, ["ADMIN", "HR_MANAGER"]);
    
    let whereClause: any = {};
    if (month && year) {
      whereClause.payrollRun = { month: parseInt(month), year: parseInt(year) };
    }

    if (!isAdmin) {
      // Employee can only see their own records, and only if APPROVED or PAID
      whereClause.employeeId = auth.employee.id;
      whereClause.status = { in: ["APPROVED", "PAID"] };
    }

    const records = await prisma.payrollRecord.findMany({
      where: whereClause,
      include: {
        employee: { select: { fullName: true, employeeCode: true, department: { select: { name: true } } } },
        deductions: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
