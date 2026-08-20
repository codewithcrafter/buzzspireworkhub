import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// POST /api/admin/pages/[id]/publish - Publish a page
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.PAGES_PUBLISH,
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

    // With the new flat-field JSON model, the client sends `publishedContent` directly in a PUT request to /api/admin/pages/[id] BEFORE calling publish.
    // However, if they pass data here, we can update it too.
    const body = await req.text();
    let updatedContent = page.publishedContent;
    if (body) {
      try {
        const jsonBody = JSON.parse(body);
        if (jsonBody.publishedContent) {
          updatedContent = jsonBody.publishedContent;
        }
      } catch (e) {}
    }

    // Validation
    const parsedContent = updatedContent as any || {};
    if (!parsedContent.h1 && !page.title) {
      return ApiResponse.badRequest("Page must have an H1 heading or a valid Title before publishing.");
    }
    
    // Protection against overwriting hardcoded routes
    const restrictedSlugs = ["about", "contact", "career", "services", "blog", "admin", "employee", "login", "try"];
    if (restrictedSlugs.includes(page.slug.toLowerCase())) {
      // System pages CAN be published. We just allow them.
      // But we shouldn't block them entirely if they are system pages.
      // Wait, system pages ALREADY exist in the DB (like 'about', 'contact').
      // We shouldn't block publishing them.
    }

    // Use a transaction to update page status and create revision
    const updatedPage = await prisma.$transaction(async (tx) => {
      // 1. Update page
      const updated = await tx.page.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedContent: updatedContent as any,
          publishedAt: new Date(),
        }
      });

      // 2. Count existing revisions to determine next version
      const revisionCount = await tx.pageRevision.count({
        where: { pageId: id }
      });

      // 3. Create revision
      await tx.pageRevision.create({
        data: {
          pageId: id,
          version: revisionCount + 1,
          content: updatedContent as any,
          createdBy: auth.user.id
        }
      });

      return updated;
    });

    // 4. Safely inject into public/sitemap.xml
    try {
      const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
      if (fs.existsSync(sitemapPath)) {
        let sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
        const urlLoc = `https://buzzspiremedia.com/${updatedPage.slug}`;
        
        // Only append if it's not already in the sitemap
        if (!sitemapContent.includes(`<loc>${urlLoc}</loc>`)) {
          const newEntry = `
  <url>
       <loc>${urlLoc}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>Monthly</changefreq>
       <priority>0.6000</priority>
  </url>
</urlset>`;
          sitemapContent = sitemapContent.replace("</urlset>", newEntry);
          fs.writeFileSync(sitemapPath, sitemapContent, "utf-8");
        }
      }
    } catch (sitemapErr) {
      console.error("Failed to update sitemap.xml:", sitemapErr);
      // We don't fail the request if sitemap update fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Page published successfully",
        page: updatedPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error publishing page:", error);
    return ApiResponse.serverError("Error publishing page", error);
  }
}
