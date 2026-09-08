import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: [PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_VIEW],
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;
    const body = await req.json();
    const { title, note, dueDate, time, status } = body;

    const reminder = await prisma.leadReminder.findUnique({
      where: { id },
      include: { lead: true }
    });

    if (!reminder) {
      return ApiResponse.notFound("Reminder not found");
    }

    // IDOR protection
    if (auth.user.role !== "ADMIN" && reminder.employeeId !== auth.user.id) {
      return ApiResponse.forbidden("Access denied: You can only edit your own reminders");
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (note !== undefined) updateData.note = note;
    if (status !== undefined) updateData.status = status;
    
    if (dueDate) {
      const dateObj = new Date(dueDate);
      if (time) {
        const [hours, minutes] = time.split(":");
        dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      } else {
        // preserve existing time if time is not passed but date is
        dateObj.setHours(reminder.dueDate.getHours(), reminder.dueDate.getMinutes(), 0, 0);
      }
      updateData.dueDate = dateObj;
    }

    const updated = await prisma.leadReminder.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, reminder: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return ApiResponse.serverError("Error updating reminder", error);
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: [PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_VIEW],
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;

    const reminder = await prisma.leadReminder.findUnique({
      where: { id }
    });

    if (!reminder) {
      return ApiResponse.notFound("Reminder not found");
    }

    // IDOR protection
    if (auth.user.role !== "ADMIN" && reminder.employeeId !== auth.user.id) {
      return ApiResponse.forbidden("Access denied: You can only delete your own reminders");
    }

    await prisma.leadReminder.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Reminder deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return ApiResponse.serverError("Error deleting reminder", error);
  }
}
