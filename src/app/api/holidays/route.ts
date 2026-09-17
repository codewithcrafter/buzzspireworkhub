import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { HolidayService } from "@/services/holiday.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/holidays
export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;
    const date = searchParams.get("date") || undefined;
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await HolidayService.getHolidays({ year, date, type, status, search, page, limit });

    return NextResponse.json({
      success: true,
      data: result,
      holidays: result.holidays,
      pagination: result.pagination,
    });
  } catch (error) {
    return ApiResponse.serverError("Error retrieving holidays", error);
  }
}

// POST /api/holidays
export async function POST(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    if (!hasRole(auth.role, ["ADMIN", "HR_MANAGER"])) {
      return ApiResponse.forbidden("Access denied: Only Administrators and HR Managers can create holiday entries");
    }

    const body = await req.json();
    const name = (body.name || "").toString().trim();
    const date = body.date;
    const type = (body.type || "NATIONAL").toString().trim();

    if (!name || !date) {
      return ApiResponse.badRequest("Holiday name and date are required");
    }

    const holiday = await HolidayService.createHoliday(
      {
        name,
        date,
        type,
        description: body.description,
        status: body.status || "ACTIVE",
      },
      auth.employee.id
    );

    return NextResponse.json(
      {
        success: true,
        message: "Holiday entry created successfully",
        data: { holiday },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "DUPLICATE_HOLIDAY") {
      return ApiResponse.badRequest("A holiday with this name and date already exists");
    }
    if (error.message === "INVALID_DATE") {
      return ApiResponse.badRequest("Invalid date provided");
    }
    return ApiResponse.serverError("Error creating holiday entry", error);
  }
}
