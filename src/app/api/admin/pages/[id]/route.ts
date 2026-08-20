import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getCmsConfig } from "@/config/cmsConfig";

// GET /api/admin/pages/[id] - Get page details
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.PAGES_VIEW,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!page) {
      return ApiResponse.notFound("Page not found");
    }

    // Merge default FAQs if they exist in config (only once)
    const conf = getCmsConfig(page.slug);
    if (conf.defaultFaqs) {
      const content = page.publishedContent as any || {};
      
      if (!content._faqsSeeded) {
        const existingFaqs = Array.isArray(content.faqs) ? content.faqs : [];
        const existingQs = new Set(existingFaqs.map((f: any) => f.q));
        
        const combinedFaqs = [
          ...conf.defaultFaqs.filter(df => !existingQs.has(df.q)),
          ...existingFaqs
        ];
        
        content.faqs = combinedFaqs;
        content._faqsSeeded = true;
        page.publishedContent = content;
      }
    }

    return NextResponse.json(
      {
        success: true,
        page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    return ApiResponse.serverError("Error fetching page details", error);
  }
}

// PUT /api/admin/pages/[id] - Update page metadata
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
    const { title, slug, seoTitle, metaDescription } = body;

    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      return ApiResponse.notFound("Page not found");
    }

    if (slug && slug !== page.slug) {
      const existingPage = await prisma.page.findUnique({
        where: { slug },
      });
      if (existingPage) {
        return ApiResponse.badRequest("A page with this slug already exists.");
      }
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        seoTitle,
        metaDescription,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Page updated successfully",
        page: updatedPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating page:", error);
    return ApiResponse.serverError("Error updating page", error);
  }
}

import { SYSTEM_ROUTES } from "@/config/cmsConfig";

// DELETE /api/admin/pages/[id] - Delete page
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.PAGES_EDIT, // or PAGES_DELETE if we want to add it
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;

    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      return ApiResponse.notFound("Page not found");
    }

    // Protection for SYSTEM routes
    const isSystemRoute = SYSTEM_ROUTES.some(r => r.slug === page.slug);
    if (isSystemRoute) {
      return NextResponse.json(
        { success: false, error: "System pages cannot be deleted." },
        { status: 403 }
      );
    }

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Page deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting page:", error);
    return ApiResponse.serverError("Error deleting page", error);
  }
}
