import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { getCaseStudies, createCaseStudy } from "@/services/caseStudy.service";
import { CaseStudyStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// GET: List all case studies for Admin / Employee CMS
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const status = (searchParams.get("status") as CaseStudyStatus) || undefined;
    const isDemoParam = searchParams.get("isDemo");

    let isDemo: boolean | undefined = undefined;
    if (isDemoParam === "true") isDemo = true;
    else if (isDemoParam === "false") isDemo = false;

    const data = await getCaseStudies({
      page,
      limit,
      category,
      search,
      status,
      isDemo,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Admin Case Studies GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch case studies" },
      { status: 500 }
    );
  }
}

// POST: Create a new Case Study
export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: "CASE_STUDY_CREATE",
    });
    if (!auth.authenticated) return auth.response;

    const body = await req.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Case study title is required" }, { status: 400 });
    }
    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    if (!body.clientName || !body.clientName.trim()) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }
    if (!body.industry || !body.industry.trim()) {
      return NextResponse.json({ error: "Industry is required" }, { status: 400 });
    }
    if (!body.shortDescription || !body.shortDescription.trim()) {
      return NextResponse.json({ error: "Short description is required" }, { status: 400 });
    }

    const createdData = await createCaseStudy({
      title: body.title.trim(),
      slug: body.slug.trim().toLowerCase(),
      clientName: body.clientName.trim(),
      industry: body.industry.trim(),
      shortDescription: body.shortDescription.trim(),
      featuredImage: body.featuredImage || undefined,
      services: Array.isArray(body.services) ? body.services : [],
      projectOverview: body.projectOverview || "",
      challenge: body.challenge || "",
      objectives: Array.isArray(body.objectives) ? body.objectives : [],
      strategy: body.strategy || "",
      execution: Array.isArray(body.execution) ? body.execution : [],
      results: Array.isArray(body.results) ? body.results : [],
      heroMetric: body.heroMetric || { label: "Impact", value: "High" },
      conclusion: body.conclusion || "",
      testimonial: body.testimonial || null,
      seoTitle: body.seoTitle || undefined,
      metaDescription: body.metaDescription || undefined,
      canonicalUrl: body.canonicalUrl || undefined,
      status: (body.status as CaseStudyStatus) || "DRAFT",
      isDemo: Boolean(body.isDemo),
    });

    revalidatePath("/case-studies");
    revalidatePath(`/case-studies/${createdData.slug}`);

    return NextResponse.json(
      { message: "Case Study created successfully", caseStudy: createdData },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin Case Studies POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create case study" },
      { status: 400 }
    );
  }
}
