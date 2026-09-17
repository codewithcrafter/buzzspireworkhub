import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { HolidayService } from "@/services/holiday.service";
import { ApiResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/holidays/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { id } = await params;
    const holiday = await HolidayService.getHolidayById(id);

    return NextResponse.json({
      success: true,
      data: { holiday },
      holiday,
    });
  } catch (error: any) {
    if (error.message === "HOLIDAY_NOT_FOUND") {
      return ApiResponse.notFound("Holiday entry not found");
    }
    return ApiResponse.serverError("Error retrieving holiday details", error);
  }
}

// PATCH /api/holidays/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can update holiday entries");
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await HolidayService.updateHoliday(id, body, auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Holiday entry updated successfully",
      data: { holiday: updated },
    });
  } catch (error: any) {
    if (error.message === "HOLIDAY_NOT_FOUND") {
      return ApiResponse.notFound("Holiday entry not found");
    }
    return ApiResponse.serverError("Error updating holiday entry", error);
  }
}

// DELETE /api/holidays/[id] (Soft Deactivate or Hard Delete if ?permanent=true)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can delete holidays");
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const isPermanent = searchParams.get("permanent") === "true";

    if (isPermanent) {
      const deleted = await HolidayService.deleteHoliday(id, auth.employee.id);
      return NextResponse.json({
        success: true,
        message: "Holiday entry permanently deleted",
        data: { holiday: deleted },
      });
    }

    const deactivated = await HolidayService.deactivateHoliday(id, auth.employee.id);

    return NextResponse.json({
      success: true,
      message: "Holiday entry deactivated successfully",
      data: { holiday: deactivated },
    });
  } catch (error: any) {
    if (error.message === "HOLIDAY_NOT_FOUND") {
      return ApiResponse.notFound("Holiday entry not found");
    }
    return ApiResponse.serverError("Error deactivating holiday entry", error);
  }
}

