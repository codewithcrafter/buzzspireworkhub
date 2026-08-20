import { Metadata } from "next";
export const dynamic = "force-dynamic";
import AboutClientView from "./AboutClientView";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let pageRecord = null;
  try {
    pageRecord = await prisma.page.findUnique({ where: { slug: "about" } });
  } catch (error) {
    console.error("Failed to fetch CMS metadata for about page:", error);
  }
  
  if (!pageRecord) return {};

  const content = pageRecord.publishedContent as any || {};
  const keywords = content.keywords ? content.keywords.split(',').map((k: string) => k.trim()) : undefined;

  return {
    title: pageRecord.seoTitle || "About Us | BuzzSpire Media - Digital Growth Experts",
    description: pageRecord.metaDescription || "Learn about BuzzSpire Media's story, vision, and core principles. Empowering businesses through SEO, performance marketing, website development, and branding.",
    keywords: keywords,
    alternates: {
      canonical: "https://buzzspiremedia.com/about",
    },
  };
}

export default async function AboutPage() {
  let pageRecord = null;
  try {
    pageRecord = await prisma.page.findUnique({
      where: { slug: "about" },
    });
  } catch (error) {
    console.error("Failed to fetch CMS data for about page:", error);
  }

  const content = pageRecord?.publishedContent as any || {};

  return <AboutClientView content={content} />;
}
