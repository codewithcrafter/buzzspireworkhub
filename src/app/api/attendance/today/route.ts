import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/permissions";
import { AttendanceService } from "@/services/attendance.service";
import { SettingsService } from "@/services/settings.service";
import { ApiResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const todayState = await AttendanceService.getTodayAttendance(auth.employee.id);

    // Fetch idle configurations globally
    const idleEnabledStr = await SettingsService.get("idle_monitoring_enabled");
    const idleThresholdStr = await SettingsService.get("idle_detection_threshold_minutes");
    
    const idleSettings = {
      enabled: idleEnabledStr !== "false", // defaults to true
      thresholdMinutes: parseInt(idleThresholdStr || "2", 10)
    };

    return NextResponse.json({
      success: true,
      data: {
        attendance: todayState,
        idleSettings
      },
    });
  } catch (error) {
    return ApiResponse.serverError("Error fetching today's attendance", error);
  }
}
