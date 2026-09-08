import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: [PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_VIEW],
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;

    const reminder = await prisma.leadReminder.findUnique({
      where: { id },
      include: { lead: true }
    });

    if (!reminder) {
      return ApiResponse.notFound("Reminder not found");
    }

    // Security check
    if (auth.user.role !== "ADMIN" && reminder.employeeId !== auth.user.id) {
      return ApiResponse.forbidden("Access denied");
    }

    const updated = await prisma.leadReminder.update({
      where: { id },
      data: { isNotified: true },
    });

    return NextResponse.json({ success: true, reminder: updated });
  } catch (error) {
    console.error("Error marking reminder as notified:", error);
    return ApiResponse.serverError("Error updating reminder", error);
  }
}
