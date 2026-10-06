import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { OnDutyService } from "@/services/onduty.service";
import { ApiResponse } from "@/lib/api-response";
import { ODSessionType } from "@prisma/client";

// GET /api/od
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const search = searchParams.get("search") || undefined;
    const employeeId = searchParams.get("employeeId") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const isPrivileged = hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER", "COMPLIANCE_AUDITOR" as any]);

    // Regular employees see only their personal OD submissions
    if (!isPrivileged || (auth.role === "EMPLOYEE" && !employeeId)) {
      const result = await OnDutyService.getEmployeeODHistory(auth.employee.id, {
        status,
        startDate,
        endDate,
        page,
        limit,
      });

      return NextResponse.json({
        success: true,
        data: result,
        requests: result.requests,
        pagination: result.pagination,
      });
    }

    // Privileged users: if specific employeeId requested, fetch employee history
    if (employeeId) {
      const result = await OnDutyService.getEmployeeODHistory(employeeId, {
        status,
        startDate,
        endDate,
        page,
        limit,
      });

      return NextResponse.json({
        success: true,
        data: result,
        requests: result.requests,
        pagination: result.pagination,
      });
    }

    // Privileged users (Admin / HR): company-wide overview with filters
    const targetDepartmentId =
      auth.role === "MANAGER" && auth.employee.departmentId
        ? auth.employee.departmentId
        : departmentId;

    const result = await OnDutyService.getAdminODOverview({
      status,
      departmentId: targetDepartmentId,
      startDate,
      endDate,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
      requests: result.requests,
      pagination: result.pagination,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving On Duty requests", error);
  }
}

// POST /api/od
export async function POST(req: Request) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const body = await req.json();
    const date = body.date;
    const sessionTypeRaw = (body.sessionType || "FULL_DAY").toString().toUpperCase();
    const reason = (body.reason || "").toString().trim();
    const location = (body.location || "").toString().trim() || null;

    if (!date) {
      return ApiResponse.badRequest("Date is required for On Duty request");
    }

    if (!reason) {
      return ApiResponse.badRequest("Reason is required for On Duty request");
    }

    const validSessionTypes: ODSessionType[] = ["FULL_DAY", "FIRST_HALF", "SECOND_HALF"];
    if (!validSessionTypes.includes(sessionTypeRaw as ODSessionType)) {
      return ApiResponse.badRequest("Invalid sessionType. Must be FULL_DAY, FIRST_HALF, or SECOND_HALF.");
    }
    const sessionType = sessionTypeRaw as ODSessionType;

    const isPrivileged = hasRole(auth.role, ["ADMIN", "HR_MANAGER"]);
    const targetEmployeeId =
      isPrivileged && body.employeeId ? (body.employeeId as string).trim() : auth.employee.id;

    const request = await OnDutyService.createODRequest({
      employeeId: targetEmployeeId,
      date,
      sessionType,
      reason,
      location,
      actorId: auth.employee.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: `On Duty request (${request.odId}) submitted successfully`,
        data: { request },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "INVALID_DATE") {
      return ApiResponse.badRequest("Invalid date format provided");
    }
    if (error.message === "REASON_REQUIRED") {
      return ApiResponse.badRequest("Reason is required for On Duty request");
    }
    if (error.message === "EMPLOYEE_NOT_FOUND") {
      return ApiResponse.notFound("Target employee not found");
    }
    if (error.message === "EMPLOYEE_NOT_ACTIVE") {
      return ApiResponse.badRequest("Employee is not currently eligible for On Duty requests");
    }
    if (error.message === "BEYOND_LAST_WORKING_DATE") {
      return ApiResponse.badRequest("Cannot submit On Duty request beyond employee's last working date");
    }
    if (error.message === "FUTURE_DATE_LIMIT_EXCEEDED") {
      return ApiResponse.badRequest("On Duty requests cannot be submitted more than 30 days in advance");
    }
    if (error.message === "OD_REQUEST_OVERLAP") {
      return ApiResponse.badRequest("An On Duty request already exists for this date and session");
    }

    return ApiResponse.serverError("Error submitting On Duty request", error);
  }
}
