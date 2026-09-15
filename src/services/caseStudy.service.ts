import { prisma } from "@/lib/prisma";
import { CaseStudyStatus } from "@prisma/client";
import { caseStudiesData as INITIAL_DEMO_DATA } from "@/data/caseStudiesData";

export interface GetCaseStudiesParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  status?: CaseStudyStatus;
  isDemo?: boolean;
}

export interface CreateCaseStudyInput {
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  shortDescription: string;
  featuredImage?: string;
  services: string[];
  projectOverview: string;
  challenge: string;
  objectives: string[];
  strategy: string;
  execution: Array<{ title: string; description: string }>;
  results: Array<{ label: string; value: string; description: string; change?: string }>;
  heroMetric: { label: string; value: string };
  conclusion: string;
  testimonial?: { quote: string; author: string; role: string; company: string } | null;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status?: CaseStudyStatus;
  isDemo?: boolean;
}

export interface UpdateCaseStudyInput extends Partial<CreateCaseStudyInput> {}

/**
 * Idempotent seeder: Ensures existing 6 demo case studies are in the DB.
 */
export async function seedDemoCaseStudies() {
  try {
    for (const demo of INITIAL_DEMO_DATA) {
      const existing = await prisma.caseStudy.findUnique({
        where: { slug: demo.slug },
      });

      if (!existing) {
        await prisma.caseStudy.create({
          data: {
            title: `${demo.client} Case Study`,
            slug: demo.slug,
            clientName: demo.client,
            industry: demo.industry,
            shortDescription: demo.shortDescription,
            featuredImage: demo.featuredImage,
            services: demo.services,
            projectOverview: demo.overview,
            challenge: demo.challenge,
            objectives: demo.objectives,
            strategy: demo.strategy,
            execution: demo.execution as any,
            results: demo.results as any,
            heroMetric: demo.heroMetric as any,
            conclusion: demo.conclusion,
            testimonial: (demo.testimonial as any) || undefined,
            seoTitle: `${demo.client} Case Study | BuzzSpire Media`,
            metaDescription: demo.shortDescription,
            canonicalUrl: `https://www.buzzspiremedia.com/case-studies/${demo.slug}`,
            status: "PUBLISHED",
            isDemo: true,
          },
        });
      } else {
        await prisma.caseStudy.update({
          where: { id: existing.id },
          data: { status: "PUBLISHED", isDemo: true },
        });
      }
    }
  } catch (err) {
    console.error("Failed to seed demo case studies:", err);
  }
}

/**
 * Query paginated case studies with optional filtering
 */
export async function getCaseStudies(params: GetCaseStudiesParams = {}) {
  // Ensure demo case studies are seeded on first read
  await seedDemoCaseStudies();

  const { page = 1, limit = 10, category, search, status, isDemo } = params;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (category && category !== "All") {
    where.industry = category;
  }

  if (status) {
    where.status = status;
  }

  if (isDemo !== undefined) {
    where.isDemo = isDemo;
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { clientName: { contains: q, mode: "insensitive" } },
      { industry: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.caseStudy.count({ where }),
  ]);

  return {
    caseStudies: items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Fetch a single case study by ID
 */
export async function getCaseStudyById(id: string) {
  return prisma.caseStudy.findUnique({
    where: { id },
  });
}

/**
 * Fetch a single case study by slug
 */
export async function getCaseStudyBySlug(slug: string) {
  await seedDemoCaseStudies();
  const cs = await prisma.caseStudy.findUnique({
    where: { slug },
  });

  if (cs) return cs;

  return prisma.caseStudy.findFirst({
    where: {
      slug: { equals: slug, mode: "insensitive" },
    },
  });
}

/**
 * Create a new Case Study
 */
export async function createCaseStudy(input: CreateCaseStudyInput) {
  const existingSlug = await prisma.caseStudy.findUnique({
    where: { slug: input.slug },
  });

  if (existingSlug) {
    throw new Error(`Slug '${input.slug}' is already in use.`);
  }

  return prisma.caseStudy.create({
    data: {
      title: input.title,
      slug: input.slug,
      clientName: input.clientName,
      industry: input.industry,
      shortDescription: input.shortDescription,
      featuredImage: input.featuredImage || null,
      services: input.services || [],
      projectOverview: input.projectOverview,
      challenge: input.challenge,
      objectives: input.objectives || [],
      strategy: input.strategy,
      execution: (input.execution as any) || [],
      results: (input.results as any) || [],
      heroMetric: (input.heroMetric as any) || { label: "Impact", value: "High" },
      conclusion: input.conclusion,
      testimonial: (input.testimonial as any) || undefined,
      seoTitle: input.seoTitle || `${input.title} | BuzzSpire Media`,
      metaDescription: input.metaDescription || input.shortDescription,
      canonicalUrl: input.canonicalUrl || `https://www.buzzspiremedia.com/case-studies/${input.slug}`,
      status: input.status || "DRAFT",
      isDemo: input.isDemo ?? false,
    },
  });
}

/**
 * Update an existing Case Study
 */
export async function updateCaseStudy(id: string, input: UpdateCaseStudyInput) {
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Case study not found");
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugCheck = await prisma.caseStudy.findUnique({
      where: { slug: input.slug },
    });
    if (slugCheck) {
      throw new Error(`Slug '${input.slug}' is already in use.`);
    }
  }

  const updateData: any = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.clientName !== undefined) updateData.clientName = input.clientName;
  if (input.industry !== undefined) updateData.industry = input.industry;
  if (input.shortDescription !== undefined) updateData.shortDescription = input.shortDescription;
  if (input.featuredImage !== undefined) updateData.featuredImage = input.featuredImage;
  if (input.services !== undefined) updateData.services = input.services;
  if (input.projectOverview !== undefined) updateData.projectOverview = input.projectOverview;
  if (input.challenge !== undefined) updateData.challenge = input.challenge;
  if (input.objectives !== undefined) updateData.objectives = input.objectives;
  if (input.strategy !== undefined) updateData.strategy = input.strategy;
  if (input.execution !== undefined) updateData.execution = input.execution as any;
  if (input.results !== undefined) updateData.results = input.results as any;
  if (input.heroMetric !== undefined) updateData.heroMetric = input.heroMetric as any;
  if (input.conclusion !== undefined) updateData.conclusion = input.conclusion;
  if (input.testimonial !== undefined) updateData.testimonial = (input.testimonial as any) || undefined;
  if (input.seoTitle !== undefined) updateData.seoTitle = input.seoTitle;
  if (input.metaDescription !== undefined) updateData.metaDescription = input.metaDescription;
  if (input.canonicalUrl !== undefined) updateData.canonicalUrl = input.canonicalUrl;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.isDemo !== undefined) updateData.isDemo = input.isDemo;

  return prisma.caseStudy.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Delete a Case Study by ID
 */
export async function deleteCaseStudy(id: string) {
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Case study not found");
  }

  return prisma.caseStudy.delete({
    where: { id },
  });
}
