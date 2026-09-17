import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { NotificationService } from "@/services/notification.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/notifications/unread-count
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    const unreadCount = await NotificationService.getUnreadCount(auth.employee.id);

    return NextResponse.json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    return ApiResponse.serverError("Error fetching unread notification count", error, req);
  }
}
