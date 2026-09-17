import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { NotificationService } from "@/services/notification.service";
import { ApiResponse } from "@/lib/api-response";

// PATCH /api/notifications/[id] — mark a single notification as read
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    if (!id) {
      return ApiResponse.badRequest("Notification ID is required");
    }

    const notification = await NotificationService.markAsRead(
      id,
      auth.employee.id
    );

    if (!notification) {
      return ApiResponse.notFound("Notification not found or access denied");
    }

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    return ApiResponse.serverError("Error marking notification as read", error);
  }
}

// DELETE /api/notifications/[id] — delete a single notification (ownership enforced)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    if (!id) {
      return ApiResponse.badRequest("Notification ID is required");
    }

    const result = await NotificationService.deleteNotification(
      id,
      auth.employee.id
    );

    if (!result) {
      return ApiResponse.notFound("Notification not found or access denied");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return ApiResponse.serverError("Error deleting notification", error);
  }
}
