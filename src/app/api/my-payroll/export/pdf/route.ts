import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { generateEmployeePayslipPdf } from "@/lib/payroll-pdf";

export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Payslip ID is required", { status: 400 });
    }

    const record = await prisma.payrollRecord.findUnique({
      where: { id },
      include: {
        employee: { select: { fullName: true, employeeCode: true } },
        payrollRun: true,
        deductions: true
      }
    });

    if (!record) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // RBAC: An employee can ONLY export their own payslip
    // And it MUST be finalized.
    if (auth.role === "EMPLOYEE") {
      if (record.employeeId !== auth.employee.id) {
        return new NextResponse("Forbidden", { status: 403 });
      }
      if (record.status === "DRAFT" || record.status === "CALCULATED") {
        return new NextResponse("Payslip not yet finalized", { status: 403 });
      }
    } else {
        // If it's a manager/admin downloading it, allow it.
        // Actually, this is my-payroll, so typically only used by the employee. But if an admin hits this endpoint it's fine.
    }

    const pdfBuffer = await generateEmployeePayslipPdf(record);
    
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="payslip_${record.payrollRun.month}_${record.payrollRun.year}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF export error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
