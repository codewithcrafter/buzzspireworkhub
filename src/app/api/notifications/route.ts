import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { NotificationService } from "@/services/notification.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/notifications
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required", req);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const result = await NotificationService.getNotifications({
      employeeId: auth.employee.id,
      page,
      limit,
      unreadOnly,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return ApiResponse.serverError("Error fetching notifications", error, req);
  }
}
