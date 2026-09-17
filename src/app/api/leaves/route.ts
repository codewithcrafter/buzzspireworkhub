import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { LeaveService } from "@/services/leave.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/leaves
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId") || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;
    const status = searchParams.get("status") || undefined;
    const leaveType = searchParams.get("leaveType") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await LeaveService.getLeaves(
      { employeeId, departmentId, status, leaveType, startDate, endDate, page, limit },
      auth.employee.id,
      auth.role,
      auth.employee.departmentId
    );

    return NextResponse.json({
      success: true,
      data: result,
      leaves: result.leaves,
      pagination: result.pagination,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving leave records", error);
  }
}

// POST /api/leaves
export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const body = await req.json();
    const leaveType = (body.leaveType || "").toString().trim();
    const startDate = body.startDate;
    const endDate = body.endDate;
    const reason = (body.reason || "").toString().trim();

    if (!leaveType || !startDate || !endDate || !reason) {
      return ApiResponse.badRequest("Leave type, start date, end date, and reason are required");
    }

    const leave = await LeaveService.createLeave(
      { leaveType, startDate, endDate, reason },
      auth.employee.id
    );

    return NextResponse.json(
      {
        success: true,
        message: "Leave request submitted successfully",
        data: { leave },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "INVALID_DATE_RANGE") {
      return ApiResponse.badRequest("Invalid date range specified. End date must be on or after start date.");
    }
    return ApiResponse.serverError("Error submitting leave request", error);
  }
}
