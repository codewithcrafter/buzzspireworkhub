import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { SYSTEM_ROUTES } from "@/config/cmsConfig";

// GET /api/admin/pages - List all pages
export async function GET(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.PAGES_VIEW,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || undefined;

    // Fetch all database pages
    const dbPages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
    });

    const dbPagesMap = new Map(dbPages.map(p => [p.slug, p]));
    
    let unifiedPages: any[] = [];

    // 1. Add all SYSTEM_ROUTES
    for (const sys of SYSTEM_ROUTES) {
      const dbRecord = dbPagesMap.get(sys.slug);
      unifiedPages.push({
        id: dbRecord?.id || `sys-${sys.slug}`,
        title: dbRecord?.title || sys.title,
        slug: sys.slug,
        type: "SYSTEM",
        status: dbRecord?.status || "PUBLISHED",
        updatedAt: dbRecord?.updatedAt || new Date().toISOString(),
        url: sys.url
      });
      // Remove from map so we don't process it again
      dbPagesMap.delete(sys.slug);
    }

    // 2. Add remaining DB pages as CUSTOM pages
    for (const [slug, dbRecord] of dbPagesMap.entries()) {
      unifiedPages.push({
        id: dbRecord.id,
        title: dbRecord.title,
        slug: dbRecord.slug,
        type: "CUSTOM",
        status: dbRecord.status,
        updatedAt: dbRecord.updatedAt,
        url: `/${dbRecord.slug}`
      });
    }

    // 3. Apply search filter if provided
    if (search) {
      unifiedPages = unifiedPages.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.slug.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(
      {
        success: true,
        pages: unifiedPages,
        count: unifiedPages.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pages:", error);
    return ApiResponse.serverError("Error fetching pages list", error);
  }
}

// POST /api/admin/pages - Create new page
export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.PAGES_EDIT,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const body = await req.json();
    const { title, slug, seoTitle, metaDescription } = body;

    if (!title || !slug) {
      return ApiResponse.badRequest("Title and slug are required");
    }

    // Check if slug conflicts with a SYSTEM route
    const isSystemRoute = SYSTEM_ROUTES.some(r => r.slug === slug);
    if (isSystemRoute) {
      return ApiResponse.badRequest("This slug is reserved by a system page.");
    }

    // Check if slug already exists in DB
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return ApiResponse.badRequest("A page with this slug already exists.");
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        seoTitle,
        metaDescription,
        status: "DRAFT",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Page created successfully",
        page: newPage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating page:", error);
    return ApiResponse.serverError("Error creating page", error);
  }
}
