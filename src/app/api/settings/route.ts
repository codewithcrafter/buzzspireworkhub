import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { SettingsService } from "@/services/settings.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/settings — retrieve all system settings
export async function GET() {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    // Only ADMIN can read system settings
    if (!hasRole(auth.role, ["ADMIN"])) {
      return ApiResponse.forbidden(
        "Access denied: Only Administrators can view system settings"
      );
    }

    const settings = await SettingsService.getAll();

    return NextResponse.json({ success: true, data: { settings } });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving system settings", error);
  }
}

// PATCH /api/settings — bulk update multiple settings
export async function PATCH(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN"])) {
      return ApiResponse.forbidden(
        "Access denied: Only Administrators can update system settings"
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return ApiResponse.badRequest(
        "Request body must be a flat key-value object of settings to update"
      );
    }

    if (Object.keys(body).length === 0) {
      return ApiResponse.badRequest("No settings provided to update");
    }

    const { updated, rejected } = await SettingsService.bulkSet(
      body,
      auth.employee.id
    );

    return NextResponse.json({
      success: true,
      message: `${updated.length} setting(s) updated successfully`,
      data: { updated, rejected },
    });
  } catch (error) {
    return ApiResponse.serverError("Error updating system settings", error);
  }
}
