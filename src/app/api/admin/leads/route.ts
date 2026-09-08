import { NextResponse } from "next/server";
import { getLeads, createLead } from "@/services/lead.service";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";

// GET /api/admin/leads
export async function GET(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.LEADS_VIEW,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const requestedAssignee = searchParams.get("assignedEmployeeId") || undefined;
    const search = searchParams.get("search") || undefined;

    // Strict Scope: If user is an employee (not admin), they can only access leads assigned to them
    const effectiveAssignedId = auth.user.role === "ADMIN" ? requestedAssignee : auth.user.id;

    const leads = await getLeads({
      status,
      assignedEmployeeId: effectiveAssignedId,
      search,
    });

    return NextResponse.json(
      {
        success: true,
        leads,
        count: leads.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin leads:", error);
    return ApiResponse.serverError("Error fetching leads list", error);
  }
}

// POST /api/admin/leads (Manual lead creation from admin)
export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: [PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_VIEW],
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const body = await req.json();
    const { name, email, company, budget, service, message, source, pageUrl, portfolio, phone, assignedEmployeeId } = body;

    // Fields are completely optional based on new requirements


    const finalAssignedEmployeeId = auth.user.role === "ADMIN" ? assignedEmployeeId : auth.user.id;

    const newLead = await createLead({
      name,
      email,
      company,
      budget,
      service,
      message,
      source: source || "Admin Manual Entry",
      pageUrl,
      portfolio,
      phone,
      assignedEmployeeId: finalAssignedEmployeeId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully",
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating manual lead:", error);
    return ApiResponse.serverError("Error creating lead", error);
  }
}
