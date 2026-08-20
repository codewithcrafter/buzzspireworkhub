import { Metadata } from "next";
export const dynamic = "force-dynamic";
import ContactClientView from "./ContactClientView";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let pageRecord = null;
  try {
    pageRecord = await prisma.page.findUnique({ where: { slug: "contact" } });
  } catch (error) {
    console.error("Failed to fetch CMS metadata for contact page:", error);
  }
  
  if (!pageRecord) return {};

  const content = pageRecord.publishedContent as any || {};
  const keywords = content.keywords ? content.keywords.split(',').map((k: string) => k.trim()) : undefined;

  return {
    title: pageRecord.seoTitle || "Contact Us | Buzzspire Media",
    description: pageRecord.metaDescription || "Get in touch with Buzzspire Media to accelerate your digital growth.",
    keywords: keywords,
  };
}

export default async function ContactPage() {
  let pageRecord = null;
  try {
    pageRecord = await prisma.page.findUnique({
      where: { slug: "contact" },
    });
  } catch (error) {
    console.error("Failed to fetch CMS data for contact page:", error);
  }

  const content = pageRecord?.publishedContent as any || {};

  return <ContactClientView content={content} />;
}
