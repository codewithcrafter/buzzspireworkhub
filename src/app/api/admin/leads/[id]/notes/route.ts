import { NextResponse } from "next/server";
import { addLeadNote, getLeadById, logLeadActivity } from "@/services/lead.service";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.LEADS_EDIT,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;
    const body = await req.json();

    if (!body.content || typeof body.content !== "string") {
      return ApiResponse.badRequest("Note content is required");
    }

    const lead = await getLeadById(id);
    if (!lead) {
      return ApiResponse.notFound("Lead not found");
    }

    // IDOR protection
    if (auth.user.role !== "ADMIN" && lead.assignedEmployeeId !== auth.user.id) {
      return ApiResponse.forbidden("Access denied: You can only add notes to leads assigned to you");
    }

    const newNote = await addLeadNote({
      leadId: id,
      content: body.content,
      employeeId: auth.user.id,
    });

    await logLeadActivity({
      leadId: id,
      action: "Note added",
      employeeId: auth.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Note added successfully",
        note: newNote,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add note error:", error);
    return ApiResponse.serverError("Error adding note", error);
  }
}
