import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CmsPageTemplate from "@/components/cms/CmsPageTemplate";

// Admin-only preview route
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Notice we do NOT check for status = PUBLISHED. 
  // This allows viewing Drafts. 
  const cmsPage = await prisma.page.findUnique({
    where: { id }
  });

  if (!cmsPage) {
    notFound();
  }

  return (
    <main className="w-full bg-background min-h-screen">
      {/* We add a subtle preview banner */}
      <div className="bg-warning/20 border-b border-warning text-warning-foreground text-center py-2 text-sm font-bold tracking-wide">
        PREVIEW MODE: This is a preview of the draft content.
      </div>
      <CmsPageTemplate page={cmsPage} />
    </main>
  );
}
