import { Metadata } from "next";
export const dynamic = "force-dynamic";
import CareerClientView from "./CareerClientView";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let pageRecord = null;
  try {
    pageRecord = await prisma.page.findUnique({ where: { slug: "career" } });
  } catch (error) {
    console.error("Failed to fetch CMS metadata for career page:", error);
  }
  
  if (!pageRecord) return {};

  const content = pageRecord.publishedContent as any || {};
  const keywords = content.keywords ? content.keywords.split(',').map((k: string) => k.trim()) : undefined;

  return {
    title: pageRecord.seoTitle || "Careers & Open Roles | BuzzSpire Media",
    description: pageRecord.metaDescription || "Join BuzzSpire Media's team. Open positions for Senior Front-End Engineers, Performance Media Buyers, and B2B Copywriters with performance dividends.",
    keywords: keywords,
    alternates: {
      canonical: "https://buzzspiremedia.com/career",
    },
  };
}

export default async function CareerPage() {
  let pageRecord = null;
  try {
    pageRecord = await prisma.page.findUnique({
      where: { slug: "career" },
    });
  } catch (error) {
    console.error("Failed to fetch CMS data for career page:", error);
  }

  const content = pageRecord?.publishedContent as any || {};

  return <CareerClientView content={content} />;
}
