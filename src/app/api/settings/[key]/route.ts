import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { SettingsService, ALLOWED_SETTING_KEYS } from "@/services/settings.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/settings/[key]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN"])) {
      return ApiResponse.forbidden(
        "Access denied: Only Administrators can view system settings"
      );
    }

    const { key } = await params;

    if (!ALLOWED_SETTING_KEYS.includes(key as any)) {
      return ApiResponse.notFound("Setting key not recognised");
    }

    const value = await SettingsService.get(key);

    return NextResponse.json({
      success: true,
      data: { key, value },
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving setting", error);
  }
}

// PUT /api/settings/[key]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
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

    const { key } = await params;

    const body = await req.json();
    const value = body?.value;
    const description = body?.description;

    if (value === undefined || value === null) {
      return ApiResponse.badRequest("'value' is required");
    }

    const setting = await SettingsService.set(
      key,
      String(value),
      description,
      auth.employee.id
    );

    return NextResponse.json({
      success: true,
      message: `Setting '${key}' updated successfully`,
      data: { setting },
    });
  } catch (error: any) {
    if (error.message === "INVALID_SETTING_KEY") {
      return ApiResponse.badRequest(`Setting key '${(await params).key}' is not a recognised system setting`);
    }
    return ApiResponse.serverError("Error updating setting", error);
  }
}
