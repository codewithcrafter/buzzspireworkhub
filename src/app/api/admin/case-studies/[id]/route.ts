import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import {
  getCaseStudyById,
  updateCaseStudy,
  deleteCaseStudy,
} from "@/services/caseStudy.service";
import { hasPermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

// GET: Single Case Study details by ID
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: [
        "CASE_STUDY_CREATE",
        "CASE_STUDY_EDIT",
        "CASE_STUDY_DELETE",
        "CASE_STUDY_PUBLISH",
      ],
    });
    if (!auth.authenticated) return auth.response;

    const { id } = await params;
    const caseStudy = await getCaseStudyById(id);

    if (!caseStudy) {
      return NextResponse.json({ error: "Case Study not found" }, { status: 404 });
    }

    return NextResponse.json({ caseStudy }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Case Study GET ID Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch case study" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing Case Study
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: ["CASE_STUDY_EDIT", "CASE_STUDY_PUBLISH"],
    });
    if (!auth.authenticated) return auth.response;

    const { id } = await params;
    const body = await req.json();

    // Check permissions strictly if status change is attempted
    if (body.status !== undefined) {
      if (!hasPermission(auth.user, "CASE_STUDY_PUBLISH") && auth.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Permission denied: 'CASE_STUDY_PUBLISH' required to change publish status" },
          { status: 403 }
        );
      }
    }

    const updated = await updateCaseStudy(id, {
      ...body,
      slug: body.slug ? body.slug.trim().toLowerCase() : undefined,
    });

    revalidatePath("/case-studies");
    revalidatePath(`/case-studies/${updated.slug}`);

    return NextResponse.json(
      { message: "Case study updated successfully", caseStudy: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin Case Study PUT Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update case study" },
      { status: 400 }
    );
  }
}

// DELETE: Remove a Case Study by ID
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: "CASE_STUDY_DELETE",
    });
    if (!auth.authenticated) return auth.response;

    const { id } = await params;
    const deleted = await deleteCaseStudy(id);

    revalidatePath("/case-studies");
    revalidatePath(`/case-studies/${deleted.slug}`);

    return NextResponse.json(
      { message: "Case study deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin Case Study DELETE Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete case study" },
      { status: 400 }
    );
  }
}
