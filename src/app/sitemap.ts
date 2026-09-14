import { MetadataRoute } from "next";
import { caseStudiesData } from "@/data/caseStudiesData";

const BASE_URL = "https://www.buzzspiremedia.com";

// All static, publicly indexable pages with preferred www canonical URLs
const staticPages: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/career`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/case-studies`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/digital-marketing-agency-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  // 10 Service pages
  {
    url: `${BASE_URL}/seo-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/ppc-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/social-media-marketing-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/smo-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/google-business-profile-management-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/ecommerce-management-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/graphic-design-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/product-photography-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/video-editing-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/web-development-services-in-delhi`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  // Legal pages
  {
    url: `${BASE_URL}/privacy-policy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms-of-service`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dynamically fetch all currently PUBLISHED blog posts
  let blogEntries: MetadataRoute.Sitemap = [];

  let caseStudyEntries: MetadataRoute.Sitemap = [];

  try {
    const { prisma } = await import("@/lib/prisma");
    const publishedBlogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    blogEntries = publishedBlogs.map((blog) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: blog.updatedAt ?? blog.publishedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const publishedCaseStudies = await prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    caseStudyEntries = publishedCaseStudies.map((cs) => ({
      url: `${BASE_URL}/case-studies/${cs.slug}`,
      lastModified: cs.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.warn("[sitemap.ts] Could not fetch published content from DB:", error);
    caseStudyEntries = caseStudiesData.map((cs) => ({
      url: `${BASE_URL}/case-studies/${cs.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  return [...staticPages, ...caseStudyEntries, ...blogEntries];
}
