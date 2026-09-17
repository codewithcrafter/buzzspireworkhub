import { NextResponse } from "next/server";
import { getAuthSession, hasRole, hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { generateCsv } from "@/lib/export-utils";

export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const departmentId = searchParams.get("departmentId");

    // RBAC
    if (auth.role === "EMPLOYEE") {
      return new NextResponse("Employees cannot export organization payroll CSV", { status: 403 });
    }

    if (auth.role === "MANAGER") {
       return new NextResponse("Managers cannot export payroll", { status: 403 });
    }

    if (!month || !year) {
      return new NextResponse("Month and Year are required", { status: 400 });
    }

    let whereClause: any = {
      payrollRun: { month: parseInt(month), year: parseInt(year) }
    };

    // If manager, enforce their own department if scoped
    if (auth.role === "MANAGER") {
        whereClause.employee = { departmentId: auth.employee.departmentId };
    } else if (departmentId) {
        whereClause.employee = { departmentId };
    }

    const records = await prisma.payrollRecord.findMany({
      where: whereClause,
      include: {
        employee: { select: { fullName: true, employeeCode: true } }
      },
      orderBy: { employee: { fullName: "asc" } }
    });

    const data = records.map(r => {
      // Safely extract department snapshot
      const deptSnapshot = r.departmentSnapshot as { name?: string } | null;
      const deptName = deptSnapshot?.name || "No Department";

      return {
        "Employee": r.employee.fullName,
        "Employee ID": r.employee.employeeCode,
        "Department": deptName,
        "Period": `${month}/${year}`,
        "Salary Type": r.salaryType,
        "Base Pay": r.basePay,
        "Overtime": r.overtimePay,
        "Gross Pay": r.grossPay,
        "Total Deductions": r.totalDeductions,
        "Net Pay": r.netPay,
        "Working Days": r.workingDays,
        "Present": r.presentDays,
        "Absent": r.absentDays,
        "Paid Leave": r.paidLeaveDays,
        "Unpaid Leave": r.unpaidLeaveDays,
        "Half Day": r.halfDays,
        "Shortfall": r.shortfallMinutes,
        "Late": r.lateMinutes,
        "Early Logout": r.earlyLogoutMinutes
      };
    });

    const headers = [
      { key: "Employee" as keyof typeof data[0], label: "Employee" },
      { key: "Employee ID" as keyof typeof data[0], label: "Employee ID" },
      { key: "Department" as keyof typeof data[0], label: "Department" },
      { key: "Period" as keyof typeof data[0], label: "Period" },
      { key: "Salary Type" as keyof typeof data[0], label: "Salary Type" },
      { key: "Base Pay" as keyof typeof data[0], label: "Base Pay" },
      { key: "Overtime" as keyof typeof data[0], label: "Overtime" },
      { key: "Gross Pay" as keyof typeof data[0], label: "Gross Pay" },
      { key: "Total Deductions" as keyof typeof data[0], label: "Total Deductions" },
      { key: "Net Pay" as keyof typeof data[0], label: "Net Pay" },
      { key: "Working Days" as keyof typeof data[0], label: "Working Days" },
      { key: "Present" as keyof typeof data[0], label: "Present" },
      { key: "Absent" as keyof typeof data[0], label: "Absent" },
      { key: "Paid Leave" as keyof typeof data[0], label: "Paid Leave" },
      { key: "Unpaid Leave" as keyof typeof data[0], label: "Unpaid Leave" },
      { key: "Half Day" as keyof typeof data[0], label: "Half Day" },
      { key: "Shortfall" as keyof typeof data[0], label: "Shortfall" },
      { key: "Late" as keyof typeof data[0], label: "Late" },
      { key: "Early Logout" as keyof typeof data[0], label: "Early Logout" }
    ];

    const csvData = generateCsv(data, headers);
    
    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="payroll_${month}_${year}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("CSV export error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
