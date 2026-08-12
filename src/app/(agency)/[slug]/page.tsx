import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { servicesData, getServiceBySlug, OLD_TO_NEW_SLUG_MAP } from "@/data/servicesData";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceOverview from "@/components/services/ServiceOverview";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceCTA from "@/components/services/ServiceCTA";
import SmoServiceView from "@/components/services/SmoServiceView";
import GmbServiceView from "@/components/services/GmbServiceView";
import PpcServiceView from "@/components/services/PpcServiceView";
import EcommerceServiceView from "@/components/services/EcommerceServiceView";
import GraphicDesignServiceView from "@/components/services/GraphicDesignServiceView";
import SeoServiceView from "@/components/services/SeoServiceView";
import SmmServiceView from "@/components/services/SmmServiceView";
import ProductPhotographyServiceView from "@/components/services/ProductPhotographyServiceView";
import VideoEditingServiceView from "@/components/services/VideoEditingServiceView";
import WebDevelopmentServiceView from "@/components/services/WebDevelopmentServiceView";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate Static Params for all 11 Production Service URLs
export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

// Dynamic SEO Metadata for each service
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // If old/short slug, resolve target service for metadata
  const resolvedSlug = OLD_TO_NEW_SLUG_MAP[slug] || slug;
  const service = getServiceBySlug(resolvedSlug);

  if (!service) {
    return {
      title: "Service Not Found | BuzzSpire Media",
    };
  }

  const canonicalUrl = `https://buzzspiremedia.com/${service.slug}`;

  return {
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      type: "website",
      url: canonicalUrl,
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

  // 301 Permanent Redirect old/short slugs to final production URLs
  if (OLD_TO_NEW_SLUG_MAP[slug]) {
    permanentRedirect(`/${OLD_TO_NEW_SLUG_MAP[slug]}`);
  }

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

  if (service.slug === "smo-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <SmoServiceView />
      </main>
    );
  }

  if (service.slug === "google-business-profile-management-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <GmbServiceView />
      </main>
    );
  }

  if (service.slug === "ppc-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <PpcServiceView />
      </main>
    );
  }

  if (service.slug === "ecommerce-management-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <EcommerceServiceView />
      </main>
    );
  }

  if (service.slug === "graphic-design-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <GraphicDesignServiceView />
      </main>
    );
  }

  if (service.slug === "seo-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <SeoServiceView />
      </main>
    );
  }

  if (service.slug === "social-media-marketing-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <SmmServiceView />
      </main>
    );
  }

  if (service.slug === "product-photography-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <ProductPhotographyServiceView />
      </main>
    );
  }

  if (service.slug === "video-editing-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <VideoEditingServiceView />
      </main>
    );
  }

  if (service.slug === "web-development-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <WebDevelopmentServiceView />
      </main>
    );
  }

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
