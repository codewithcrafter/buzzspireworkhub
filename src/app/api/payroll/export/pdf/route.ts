import { NextResponse } from "next/server";
import { getAuthSession, hasRole, hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { generatePayrollSummaryPdf } from "@/lib/payroll-pdf";

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

    if (auth.role === "EMPLOYEE") {
      return new NextResponse("Employees cannot export organization payroll", { status: 403 });
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

    const pdfBuffer = await generatePayrollSummaryPdf(records, parseInt(month), parseInt(year));
    
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="payroll_summary_${month}_${year}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF export error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
