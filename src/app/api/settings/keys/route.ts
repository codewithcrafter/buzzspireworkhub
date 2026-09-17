import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { ALLOWED_SETTING_KEYS } from "@/services/settings.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/settings/keys — returns the list of recognised setting keys
export async function GET() {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN"])) {
      return ApiResponse.forbidden("Access denied");
    }

    return NextResponse.json({
      success: true,
      data: { keys: [...ALLOWED_SETTING_KEYS] },
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving setting keys", error);
  }
}
