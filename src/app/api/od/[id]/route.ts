import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { OnDutyService } from "@/services/onduty.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/od/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    const request = await OnDutyService.getODRequestById(id, auth.employee.id, auth.role);

    return NextResponse.json({
      success: true,
      data: { request },
      request,
    });
  } catch (error: any) {
    if (error.message === "OD_REQUEST_NOT_FOUND") {
      return ApiResponse.notFound("On Duty request not found");
    }
    if (error.message === "FORBIDDEN") {
      return ApiResponse.forbidden("Access denied: You cannot view another employee's On Duty request");
    }
    return ApiResponse.serverError("Error retrieving On Duty request details", error);
  }
}

// PATCH /api/od/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    const body = await req.json();
    const action = (body.action || "").toString().trim().toUpperCase();

    if (!action) {
      return ApiResponse.badRequest("Action is required. Must be APPROVE, REJECT, or CANCEL.");
    }

    // APPROVE action
    if (action === "APPROVE") {
      const isPrivileged = hasRole(auth.role, ["ADMIN", "HR_MANAGER"]);
      if (!isPrivileged) {
        return ApiResponse.forbidden("Only Administrators and HR Managers can approve On Duty requests");
      }

      const result = await OnDutyService.approveODRequest(id, auth.employee.id);

      return NextResponse.json({
        success: true,
        message: `On Duty request (${result.request.odId}) approved and attendance regularized successfully.`,
        data: result,
      });
    }

    // REJECT action
    if (action === "REJECT") {
      const isPrivileged = hasRole(auth.role, ["ADMIN", "HR_MANAGER"]);
      if (!isPrivileged) {
        return ApiResponse.forbidden("Only Administrators and HR Managers can reject On Duty requests");
      }

      const rejectionReason = (body.rejectionReason || body.reason || "").toString().trim();
      if (!rejectionReason) {
        return ApiResponse.badRequest("Rejection reason is required");
      }

      const rejectedOD = await OnDutyService.rejectODRequest(id, auth.employee.id, rejectionReason);

      return NextResponse.json({
        success: true,
        message: `On Duty request (${rejectedOD.odId}) rejected.`,
        data: { request: rejectedOD },
      });
    }

    // CANCEL action
    if (action === "CANCEL") {
      const cancelledOD = await OnDutyService.cancelODRequest(id, auth.employee.id, auth.role);

      return NextResponse.json({
        success: true,
        message: `On Duty request (${cancelledOD.odId}) cancelled successfully.`,
        data: { request: cancelledOD },
      });
    }

    return ApiResponse.badRequest("Invalid action specified. Must be APPROVE, REJECT, or CANCEL.");
  } catch (error: any) {
    if (error.message === "OD_REQUEST_NOT_FOUND") {
      return ApiResponse.notFound("On Duty request not found");
    }
    if (error.message === "FORBIDDEN") {
      return ApiResponse.forbidden("Access denied: You do not have permission to modify this On Duty request");
    }
    if (error.message === "OD_ALREADY_APPROVED") {
      return ApiResponse.badRequest("This On Duty request has already been approved");
    }
    if (error.message === "INVALID_OD_STATE") {
      return ApiResponse.badRequest("Cannot perform action on an already processed or cancelled On Duty request");
    }
    if (error.message === "CANNOT_CANCEL_NON_PENDING") {
      return ApiResponse.badRequest("Only pending On Duty requests can be cancelled");
    }
    if (error.message === "REJECTION_REASON_REQUIRED") {
      return ApiResponse.badRequest("Rejection reason is required");
    }

    return ApiResponse.serverError("Error processing On Duty request action", error);
  }
}

// DELETE /api/od/[id] (Cancellation alias)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession(req);
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    const cancelledOD = await OnDutyService.cancelODRequest(id, auth.employee.id, auth.role);

    return NextResponse.json({
      success: true,
      message: `On Duty request (${cancelledOD.odId}) cancelled successfully.`,
      data: { request: cancelledOD },
    });
  } catch (error: any) {
    if (error.message === "OD_REQUEST_NOT_FOUND") {
      return ApiResponse.notFound("On Duty request not found");
    }
    if (error.message === "FORBIDDEN") {
      return ApiResponse.forbidden("Access denied: You cannot cancel this On Duty request");
    }
    if (error.message === "CANNOT_CANCEL_NON_PENDING") {
      return ApiResponse.badRequest("Only pending On Duty requests can be cancelled");
    }
    return ApiResponse.serverError("Error cancelling On Duty request", error);
  }
}
