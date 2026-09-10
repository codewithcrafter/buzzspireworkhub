import { Metadata } from "next";
export const dynamic = "force-dynamic";
import ServicesClientView from "./ServicesClientView";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let pageRecord = null;
  try {
    pageRecord = await prisma.page.findUnique({ where: { slug: "services" } });
  } catch (error) {
    console.error("Failed to fetch CMS metadata for services page:", error);
  }
  
  if (!pageRecord) return {};

  const content = pageRecord.publishedContent as any || {};
  const keywords = content.keywords ? content.keywords.split(',').map((k: string) => k.trim()) : undefined;

  return {
    title: pageRecord.seoTitle || "Digital Marketing Services in Delhi | Buzzspire",
    description: pageRecord.metaDescription || "Explore all digital marketing services in Delhi under one roof — SEO, PPC, SMM, design, and more. One agency, every service you need. Call now!",
    keywords: keywords,
    alternates: {
      canonical: "https://www.buzzspiremedia.com/services",
    },
  };
}

export default async function ServicesPage() {
  let pageRecord = null;
  try {
    pageRecord = await prisma.page.findUnique({
      where: { slug: "services" },
    });
  } catch (error) {
    console.error("Failed to fetch CMS data for services page:", error);
  }

  const content = pageRecord?.publishedContent as any || {};

  return <ServicesClientView content={content} />;
}
