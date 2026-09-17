import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { NotificationService } from "@/services/notification.service";
import { ApiResponse } from "@/lib/api-response";

// POST /api/notifications/read-all
export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    const result = await NotificationService.markAllAsRead(auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      data: { count: result.count },
    });
  } catch (error) {
    return ApiResponse.serverError("Error marking all notifications as read", error, req);
  }
}
