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
    // Attempt to find a published CMS Page
    const prisma = (await import("@/lib/prisma")).prisma;
    const cmsPage = await prisma.page.findFirst({
      where: { slug: resolvedSlug, status: "PUBLISHED" },
    });

    if (cmsPage) {
      const canonicalUrl = `https://buzzspiremedia.com/${cmsPage.slug}`;
      const publishedContent = cmsPage.publishedContent as any || {};
      
      return {
        title: cmsPage.seoTitle || cmsPage.title,
        description: cmsPage.metaDescription || undefined,
        keywords: publishedContent.keywords || undefined,
        alternates: {
          canonical: canonicalUrl,
        },
        openGraph: {
          title: cmsPage.seoTitle || cmsPage.title,
          description: cmsPage.metaDescription || undefined,
          type: "website",
          url: canonicalUrl,
        },
      };
    }

    return {
      title: "Page Not Found | BuzzSpire Media",
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
    // Look up CMS page
    const prisma = (await import("@/lib/prisma")).prisma;
    const cmsPage = await prisma.page.findFirst({
      where: { slug: slug, status: "PUBLISHED" },
    });

    if (cmsPage && cmsPage.publishedContent) {
      const { default: CmsPageTemplate } = await import("@/components/cms/CmsPageTemplate");
      
      return (
        <main className="w-full bg-background min-h-screen">
          <CmsPageTemplate page={cmsPage} />
        </main>
      );
    }

    notFound();
  }

  if (service.slug === "smo-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <SmoServiceView />
      </main>
    );
  }

  if (service.slug === "google-business-profile-management-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <GmbServiceView />
      </main>
    );
  }

  if (service.slug === "ppc-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <PpcServiceView />
      </main>
    );
  }

  if (service.slug === "ecommerce-management-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <EcommerceServiceView />
      </main>
    );
  }

  if (service.slug === "graphic-design-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <GraphicDesignServiceView />
      </main>
    );
  }

  if (service.slug === "seo-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <SeoServiceView />
      </main>
    );
  }

  if (service.slug === "social-media-marketing-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <SmmServiceView />
      </main>
    );
  }

  if (service.slug === "product-photography-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <ProductPhotographyServiceView />
      </main>
    );
  }

  if (service.slug === "video-editing-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <VideoEditingServiceView />
      </main>
    );
  }

  if (service.slug === "web-development-services-in-delhi") {
    return (
      <main className="w-full bg-background min-h-screen">
        <WebDevelopmentServiceView />
      </main>
    );
  }

  return (
    <main className="w-full bg-background min-h-screen">
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

