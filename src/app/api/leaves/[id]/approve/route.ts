import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { LeaveService } from "@/services/leave.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/leaves/[id]/approve
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER", "MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Insufficient permissions to approve leave requests");
    }

    const { id } = await params;
    const approved = await LeaveService.approveLeave(id, auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Leave request approved successfully",
      data: { leave: approved },
    });
  } catch (error: any) {
    if (error.message === "LEAVE_NOT_FOUND") {
      return ApiResponse.notFound("Leave request not found");
    }
    if (error.message === "CANNOT_APPROVE_OWN_LEAVE") {
      return ApiResponse.badRequest("Employees cannot approve their own leave requests");
    }
    if (error.message === "INVALID_LEAVE_STATE") {
      return ApiResponse.badRequest("Only pending leave requests can be approved");
    }
    return ApiResponse.serverError("Error approving leave request", error);
  }
}

