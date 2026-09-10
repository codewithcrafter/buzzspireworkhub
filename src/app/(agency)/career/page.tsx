import { Metadata } from "next";
export const dynamic = "force-dynamic";
import CareerClientView from "./CareerClientView";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const pageRecord = await prisma.page.findUnique({ where: { slug: "career" } });

  if (!pageRecord) return {};

  const content = pageRecord.publishedContent as any || {};
  const keywords = content.keywords ? content.keywords.split(',').map((k: string) => k.trim()) : undefined;

  return {
    title: pageRecord.seoTitle || "Careers & Open Roles | BuzzSpire Media",
    description: pageRecord.metaDescription || "Join BuzzSpire Media's team. Open positions for Senior Front-End Engineers, Performance Media Buyers, and B2B Copywriters with performance dividends.",
    keywords: keywords,
    alternates: {
      canonical: "https://www.buzzspiremedia.com/career",
    },
  };
}

export default async function CareerPage() {
  const pageRecord = await prisma.page.findUnique({
    where: { slug: "career" },
  });

  const content = pageRecord?.publishedContent as any || {};

  return <CareerClientView content={content} />;
}
