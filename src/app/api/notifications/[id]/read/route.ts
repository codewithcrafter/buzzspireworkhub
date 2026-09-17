import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { NotificationService } from "@/services/notification.service";
import { ApiResponse } from "@/lib/api-response";

// POST /api/notifications/[id]/read
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    const { id } = await params;
    if (!id) {
      return ApiResponse.badRequest("Notification ID required", req);
    }

    const updated = await NotificationService.markAsRead(id, auth.employee.id);
    if (!updated) {
      return ApiResponse.notFound("Notification not found or access denied", req);
    }

    return NextResponse.json({ success: true, data: updated, message: "Notification marked as read" });
  } catch (error) {
    return ApiResponse.serverError("Error marking notification as read", error, req);
  }
}
