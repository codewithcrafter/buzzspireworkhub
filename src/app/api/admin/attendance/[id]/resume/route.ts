import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    // Only Admin can perform this operation
    if (auth.role !== "ADMIN") {
      return ApiResponse.forbidden("Only administrators can resume a shift.");
    }

    if (!id) {
      return ApiResponse.badRequest("Attendance ID is required.");
    }

    const body = await req.json().catch(() => ({}));
    const { reason } = body;

    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return ApiResponse.badRequest("A reason is required to resume a shift.");
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    // Call service to resume shift
    const result = await AttendanceService.resumeShift(
      id,
      auth.employee?.id || "admin", // Admin ID for auditing
      reason.trim(),
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: "Shift resumed successfully.",
      data: {
        attendance: result,
      },
    });
  } catch (error: any) {
    console.error("Resume Shift Error:", error);
    if (error.message === "ATTENDANCE_NOT_FOUND") {
      return ApiResponse.notFound("Attendance record not found.");
    }
    if (error.message === "SHIFT_ALREADY_ACTIVE") {
      return ApiResponse.badRequest("Shift is already active for this attendance record.");
    }
    if (error.message === "NO_PUNCH_IN_FOUND") {
      return ApiResponse.badRequest("No punch in sessions found for this record.");
    }
    return ApiResponse.serverError("Error resuming shift", error);
  }
}
