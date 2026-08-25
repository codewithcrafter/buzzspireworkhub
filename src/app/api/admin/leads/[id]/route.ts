import { NextResponse } from "next/server";
import { getLeadById, updateLead, deleteLead } from "@/services/lead.service";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/leads/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.LEADS_VIEW,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;
    const lead = await getLeadById(id);

    if (!lead) {
      return ApiResponse.notFound("Lead not found");
    }

    // IDOR protection: Non-admin employees cannot access leads assigned to others
    if (auth.user.role !== "ADMIN" && lead.assignedEmployeeId !== auth.user.id) {
      return ApiResponse.forbidden("Access denied: You can only view leads assigned to you");
    }

    return NextResponse.json({ success: true, lead }, { status: 200 });
  } catch (error) {
    console.error("Fetch lead error:", error);
    return ApiResponse.serverError("Error fetching lead", error);
  }
}

// PATCH /api/admin/leads/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Check permissions depending on whether this is an assignment or general update
    const isAssigning = body.assignedEmployeeId !== undefined;
    const requiredPermission = isAssigning
      ? PERMISSIONS.LEADS_ASSIGN
      : PERMISSIONS.LEADS_EDIT;

    const auth = await authenticateRequest(req, {
      requiredPermission,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const lead = await getLeadById(id);
    if (!lead) {
      return ApiResponse.notFound("Lead not found");
    }

    if (isAssigning && auth.user.role !== "ADMIN") {
      return ApiResponse.forbidden("Access denied: Only admins can assign leads");
    }

    // IDOR protection: Non-admin employees cannot edit leads assigned to others
    if (auth.user.role !== "ADMIN" && lead.assignedEmployeeId !== auth.user.id) {
      return ApiResponse.forbidden("Access denied: You can only modify leads assigned to you");
    }

    const updated = await updateLead(id, {
      status: body.status,
      assignedEmployeeId: body.assignedEmployeeId,
      budget: body.budget,
      company: body.company,
      service: body.service,
      phone: body.phone,
      notes: body.notes,
      followUpAt: body.followUpAt ? new Date(body.followUpAt) : null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead updated successfully",
        lead: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update lead error:", error);
    return ApiResponse.serverError("Error updating lead", error);
  }
}

// DELETE /api/admin/leads/[id]
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.LEADS_DELETE,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;
    const lead = await getLeadById(id);

    if (!lead) {
      return ApiResponse.notFound("Lead not found");
    }

    // Only admins can delete leads
    if (auth.user.role !== "ADMIN") {
      return ApiResponse.forbidden("Access denied: Only admins can delete leads");
    }

    await deleteLead(id);

    return NextResponse.json(
      {
        success: true,
        message: "Lead deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete lead error:", error);
    return ApiResponse.serverError("Error deleting lead", error);
  }
}
