import { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicesData, getServiceBySlug } from "@/data/servicesData";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceOverview from "@/components/services/ServiceOverview";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceCTA from "@/components/services/ServiceCTA";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate Static Params for all 10 Services
export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

// Dynamic SEO Metadata for each service
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | BuzzSpire Media",
    };
  }

  return {
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    alternates: {
      canonical: `https://buzzspiremedia.com/services/${service.slug}`,
    },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      type: "website",
      url: `https://buzzspiremedia.com/services/${service.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: service.seo.title,
      description: service.seo.description,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.shortDesc,
    "provider": {
      "@type": "LocalBusiness",
      "name": "BuzzSpire Media",
      "url": "https://buzzspiremedia.com"
    },
    "areaServed": "Delhi NCR"
  };

  return (
    <main className="w-full bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* Service Header / Hero */}
      <ServiceHero service={service} />

      {/* Service Overview & Content */}
      <ServiceOverview service={service} />

      {/* Key Benefits */}
      <ServiceBenefits service={service} />

      {/* Structured Process */}
      <ServiceProcess />

      {/* FAQs */}
      <ServiceFAQ service={service} />

      {/* Related Services Navigation */}
      <RelatedServices currentSlug={service.slug} relatedSlugs={service.relatedSlugs} />

      {/* Call To Action */}
      <ServiceCTA service={service} />
    </main>
  );
}
