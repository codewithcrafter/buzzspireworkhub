import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { LeaveService } from "@/services/leave.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/leaves/[id]/reject
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Insufficient permissions to reject leave requests");
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const rejectionReason = body.rejectionReason || body.reason;

    const rejected = await LeaveService.rejectLeave(id, auth.employee.id, rejectionReason);

    return NextResponse.json({
      success: true,
      message: "Leave request rejected successfully",
      data: { leave: rejected },
    });
  } catch (error: any) {
    if (error.message === "LEAVE_NOT_FOUND") {
      return ApiResponse.notFound("Leave request not found");
    }
    if (error.message === "REJECTION_REASON_REQUIRED") {
      return ApiResponse.badRequest("A rejection reason is mandatory when rejecting leave requests");
    }
    if (error.message === "CANNOT_REJECT_OWN_LEAVE") {
      return ApiResponse.badRequest("Employees cannot reject their own leave requests");
    }
    if (error.message === "INVALID_LEAVE_STATE") {
      return ApiResponse.badRequest("Only pending leave requests can be rejected");
    }
    return ApiResponse.serverError("Error rejecting leave request", error);
  }
}

