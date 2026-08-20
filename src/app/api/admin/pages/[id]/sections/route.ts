import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/pages/[id]/sections - Batch update draft sections
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.PAGES_EDIT,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;
    const body = await req.json();
    const { sections } = body;

    if (typeof sections !== "object" || sections === null) {
      return ApiResponse.badRequest("Sections content must be a valid JSON object");
    }

    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      return ApiResponse.notFound("Page not found");
    }

    // Update the publishedContent directly with the new flat-field sections object
    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        publishedContent: sections as any
      },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sections updated successfully",
        page: updatedPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating sections:", error);
    return ApiResponse.serverError("Error updating sections", error);
  }
}
