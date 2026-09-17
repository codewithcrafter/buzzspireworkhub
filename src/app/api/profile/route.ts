import { NextResponse } from "next/server";
import { getAuthSession, hasRole } from "@/lib/auth/permissions";
import { EmployeeService } from "@/services/employee.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/profile
export async function GET() {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const profile = await EmployeeService.getEmployeeById(auth.employee.id);
    if (!profile) {
      return ApiResponse.notFound("Profile not found");
    }

    return NextResponse.json({
      success: true,
      data: { user: profile, profile },
      user: profile,
    });
  } catch (error) {
    return ApiResponse.serverError("Error fetching employee profile", error);
  }
}

// PATCH /api/profile
export async function PATCH(req: Request) {
  try {
    const auth = await getAuthSession();
    if (!auth) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const body = await req.json();

    // Security check: Normal employees cannot update restricted fields via profile API
    const isElevated = hasRole(auth.role, ["ADMIN", "HR_MANAGER"]);
    const updatePayload: any = {};

    if (body.phone !== undefined) updatePayload.phone = body.phone;
    if (body.avatar !== undefined) updatePayload.avatar = body.avatar;
    if (body.fullName !== undefined && isElevated) updatePayload.fullName = body.fullName;
    if (body.designation !== undefined && isElevated) updatePayload.designation = body.designation;

    const updated = await EmployeeService.updateEmployee(
      auth.employee.id,
      updatePayload,
      auth.employee.id
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updated, profile: updated },
      user: updated,
    });
  } catch (error) {
    return ApiResponse.serverError("Error updating employee profile", error);
  }
}
