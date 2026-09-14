import { Metadata } from "next";
import CaseStudiesClient from "./CaseStudiesClient";
import { getCaseStudies } from "@/services/caseStudy.service";

export const revalidate = 60; // Revalidate dynamic content every 60 seconds

export const metadata: Metadata = {
  title: "Case Studies | BuzzSpire Media",
  description:
    "Explore BuzzSpire Media case studies, digital marketing strategies, campaigns, and sample business growth results.",
  openGraph: {
    title: "Case Studies | BuzzSpire Media",
    description:
      "Explore BuzzSpire Media case studies, digital marketing strategies, campaigns, and sample business growth results.",
    url: "https://www.buzzspiremedia.com/case-studies",
    siteName: "BuzzSpire Media",
    type: "website",
  },
  alternates: {
    canonical: "https://www.buzzspiremedia.com/case-studies",
  },
};

export default async function CaseStudiesPage() {
  let caseStudies: any[] = [];
  try {
    const res = await getCaseStudies({ status: "PUBLISHED", limit: 100 });
    caseStudies = res.caseStudies.map((cs) => ({
      id: cs.id,
      slug: cs.slug,
      client: cs.clientName,
      industry: cs.industry,
      featuredImage: cs.featuredImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
      shortDescription: cs.shortDescription,
      services: cs.services,
      heroMetric: (cs.heroMetric as any) || { label: "Impact", value: "High" },
      isDemo: cs.isDemo,
    }));
  } catch (err) {
    console.error("Failed to load case studies from DB:", err);
  }

  return <CaseStudiesClient initialCaseStudies={caseStudies} />;
}
