import { notFound, permanentRedirect } from "next/navigation";
import { getServiceBySlug, OLD_TO_NEW_SLUG_MAP } from "@/data/servicesData";

interface LegacyServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LegacyServiceRedirect({ params }: LegacyServicePageProps) {
  const { slug } = await params;

  // Check if old short slug exists in mapping
  const mappedSlug = OLD_TO_NEW_SLUG_MAP[slug];
  if (mappedSlug) {
    permanentRedirect(`/${mappedSlug}`);
  }

  // Check if it's already a valid production slug
  const service = getServiceBySlug(slug);
  if (service) {
    permanentRedirect(`/${service.slug}`);
  }

  // Otherwise, return 404
  notFound();
}
