import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { LeaveService } from "@/services/leave.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/leaves/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    const leave = await LeaveService.getLeaveById(id, auth.employee.id, auth.role);

    return NextResponse.json({
      success: true,
      data: { leave },
      leave,
    });
  } catch (error: any) {
    if (error.message === "LEAVE_NOT_FOUND") {
      return ApiResponse.notFound("Leave request not found");
    }
    if (error.message === "FORBIDDEN") {
      return ApiResponse.forbidden("Access denied: You cannot view another employee's leave request");
    }
    return ApiResponse.serverError("Error retrieving leave details", error);
  }
}

// DELETE /api/leaves/[id] (Cancel Leave)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    const cancelled = await LeaveService.cancelLeave(id, auth.employee.id, auth.role === "ADMIN");

    return NextResponse.json({
      success: true,
      message: "Leave request cancelled successfully",
      data: { leave: cancelled },
    });
  } catch (error: any) {
    if (error.message === "LEAVE_NOT_FOUND") {
      return ApiResponse.notFound("Leave request not found");
    }
    if (error.message === "FORBIDDEN") {
      return ApiResponse.forbidden("Access denied: You can only cancel your own leave requests");
    }
    if (error.message === "CANNOT_CANCEL_FINALIZED_LEAVE") {
      return ApiResponse.badRequest("Only pending leave requests can be cancelled");
    }
    return ApiResponse.serverError("Error cancelling leave request", error);
  }
}
