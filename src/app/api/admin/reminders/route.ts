import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.LEADS_VIEW,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const status = searchParams.get("status");
    const isDue = searchParams.get("due") === "true";

    const where: any = {};
    if (leadId) where.leadId = leadId;
    if (status) where.status = status;
    if (isDue) {
      where.dueDate = { lte: new Date() };
      where.status = "PENDING";
      where.isNotified = false;
    }

    // Employees can only see their own reminders. Admins can see all, unless filtered.
    if (auth.user.role !== "ADMIN") {
      where.employeeId = auth.user.id;
    }

    const reminders = await prisma.leadReminder.findMany({
      where,
      orderBy: { dueDate: "asc" },
      include: {
        lead: { select: { id: true, name: true, company: true } },
      }
    });

    return NextResponse.json({ success: true, reminders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return ApiResponse.serverError("Error fetching reminders", error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: [PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_VIEW],
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const body = await req.json();
    const { title, note, dueDate, leadId, time } = body;

    if (!title || !dueDate || !leadId) {
      return ApiResponse.badRequest("Title, due date, and lead ID are required");
    }

    // Check if user has access to this lead
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return ApiResponse.notFound("Lead not found");

    if (auth.user.role !== "ADMIN" && lead.assignedEmployeeId !== auth.user.id) {
      return ApiResponse.forbidden("Access denied: You can only create reminders for your assigned leads");
    }

    // Safe detailed logging
    console.log("=========================================");
    console.log("CREATE REMINDER REQUEST");
    console.log("API Route: POST /api/admin/reminders");
    console.log("Authenticated Employee ID:", auth.user.id);
    console.log("Target Lead ID:", leadId);
    console.log("Received Fields:", { title, note: note ? "***" : undefined, dueDate, time });
    console.log("=========================================");

    // Parse date and time correctly and robustly
    let dateObj = new Date(dueDate);
    if (dueDate && typeof dueDate === 'string' && dueDate.includes('-')) {
      const parts = dueDate.split('-');
      if (parts[0].length === 2 && parts.length === 3) {
        // Handle DD-MM-YYYY or DD-MM-YY explicitly
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
        dateObj = new Date(year, month, day);
      }
    }

    if (time && typeof time === 'string') {
      const [hours, minutes] = time.split(":");
      dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }

    if (isNaN(dateObj.getTime())) {
      return ApiResponse.badRequest("Invalid date or time format provided");
    }

    console.log("Creating reminder for leadId:", leadId, "with dueDate:", dateObj);
    const reminder = await prisma.leadReminder.create({
      data: {
        title,
        note,
        dueDate: dateObj,
        leadId,
        employeeId: auth.user.id,
        status: "PENDING",
      }
    });

    console.log("Reminder created:", reminder.id);
    return NextResponse.json({ success: true, reminder }, { status: 201 });
  } catch (error: any) {
    console.error("=========================================");
    console.error("REMINDER CREATION FAILED");
    console.error("Prisma/Server Error:", error?.name || "Unknown");
    console.error("Error Message:", error?.message || String(error));
    if (error?.code) console.error("Error Code:", error.code);
    console.error("=========================================");
    return ApiResponse.serverError("An internal server error occurred", error);
  }
}
