import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { servicesData, getServiceBySlug, OLD_TO_NEW_SLUG_MAP, ServiceData } from "@/data/servicesData";
import ServiceSchema from "@/components/seo/ServiceSchema";
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

function getServiceType(slug: string, title: string): string {
  switch (slug) {
    case "smo-services-in-delhi": return "Social Media Optimization";
    case "google-business-profile-management-in-delhi": return "Google Business Profile Management";
    case "ppc-services-in-delhi": return "Pay Per Click Advertising";
    case "ecommerce-management-services-in-delhi": return "Ecommerce Management";
    case "graphic-design-services-in-delhi": return "Graphic Design";
    case "seo-services-in-delhi": return "Search Engine Optimization";
    case "social-media-marketing-services-in-delhi": return "Social Media Marketing";
    case "product-photography-services-in-delhi": return "Product Photography";
    case "video-editing-services-in-delhi": return "Video Editing";
    case "web-development-services-in-delhi": return "Web Development";
    default: return title;
  }
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

  const schemaFaqs = service.faqs.map((f) => ({
    question: f.q,
    answer: f.a,
  }));

  const schemaProps = {
    slug: service.slug,
    serviceName: service.title,
    serviceType: getServiceType(service.slug, service.title),
    description: service.seo.description,
    title: service.seo.title,
    faqs: schemaFaqs,
  };

  if (service.slug === "smo-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <SmoServiceView />
      </main>
    );
  }

  if (service.slug === "google-business-profile-management-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <GmbServiceView />
      </main>
    );
  }

  if (service.slug === "ppc-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <PpcServiceView />
      </main>
    );
  }

  if (service.slug === "ecommerce-management-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <EcommerceServiceView />
      </main>
    );
  }

  if (service.slug === "graphic-design-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <GraphicDesignServiceView />
      </main>
    );
  }

  if (service.slug === "seo-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <SeoServiceView />
      </main>
    );
  }

  if (service.slug === "social-media-marketing-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <SmmServiceView />
      </main>
    );
  }

  if (service.slug === "product-photography-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <ProductPhotographyServiceView />
      </main>
    );
  }

  if (service.slug === "video-editing-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <VideoEditingServiceView />
      </main>
    );
  }

  if (service.slug === "web-development-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ServiceSchema {...schemaProps} />
        <WebDevelopmentServiceView />
      </main>
    );
  }

  return (
    <main className="w-full bg-background min-h-screen">
      <ServiceSchema {...schemaProps} />
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

