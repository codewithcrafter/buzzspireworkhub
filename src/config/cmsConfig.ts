export const CMS_CONFIG: Record<string, { h1?: string, h2s?: Record<string, string>, hasFaq?: boolean, defaultFaqs?: any[] }> = {
  home: {
    h1: "Grow Your Business Online — Right Here in Delhi",
    h2s: {
      "results": "Real Numbers. Real Progress.",
      "why-choose-us": "Why Businesses Across Delhi Partner With BuzzSpire Media",
      "services": "Our 10 Digital Marketing Services in Delhi",
      "process": "Our 4-Step Marketing Process",
      "case-studies": "Local Case Histories Across Delhi",
      "insights": "What You Can Expect From Our Marketing Strategy",
      "testimonials": "What Local Business Owners Say",
      "cta": "Ready to Grow?"
    },
    hasFaq: true,
    defaultFaqs: [
      {
        q: "How can I improve my business's ranking on Google Maps?",
        a: "Improving your Google Maps ranking mainly comes down to a complete, active, and well-reviewed business profile. This means accurate business hours, photos, categories, and regular posts, along with genuine customer reviews and quick responses to them. Our google business profile management Delhi service handles this setup and upkeep, so your business shows up when nearby customers search."
      },
      {
        q: "How much does SEO cost in Delhi?",
        a: "SEO pricing in Delhi typically depends on your website size, industry competition, and how fast you want results. Most small to mid-sized businesses start with a monthly plan that covers audits, on-page fixes, content, and reporting. We offer a free digital audit first, so you know exactly what's needed before committing to a plan."
      },
      {
        q: "What's the best way to get more customers from Google Maps?",
        a: "The best way to get more customers from Google Maps is keeping your business profile accurate, active, and full of genuine reviews. Businesses that post updates, respond to reviews, and keep their hours and photos current consistently rank higher in local search results. This is the core of what our local seo service focuses on."
      },
      {
        q: "How do I manage social media for a small business without a big team?",
        a: "Managing social media for a small business comes down to a simple, consistent content calendar rather than posting randomly. Planning content in advance, focusing on a few platforms instead of all of them, and tracking what actually gets engagement makes it manageable. Our smo services Delhi are built specifically for small teams that don't have time to manage this daily."
      },
      {
        q: "How do I run Google Ads for a local business?",
        a: "Running Google Ads for a local business starts with targeting the specific searches your customers use, not broad keywords. Setting a realistic ad spend, writing clear ad copy, and reviewing performance weekly keeps costs under control. Our sem services Delhi handle this setup and ongoing management so your ad spend goes toward real leads."
      },
      {
        q: "Who manages Amazon and Flipkart seller accounts in Delhi?",
        a: "Amazon and Flipkart seller accounts are usually managed by a dedicated ecommerce management team handling listings, inventory, and order updates. This keeps your marketplace presence accurate and reduces errors that can hurt your seller rating. Our ecommerce management services cover amazon flipkart account management Delhi for sellers who don't have time to manage it themselves."
      },
      {
        q: "How much does a website cost in Delhi?",
        a: "Website costs in Delhi vary based on the number of pages, design complexity, and features like ecommerce or booking systems. A simple business website costs less than a full online store with product management. As a web development company Delhi businesses trust for clear pricing, we quote based on what you actually need, not a fixed package."
      },
      {
        q: "How do I design a logo for a new business?",
        a: "Designing a logo for a new business starts with understanding what the business stands for, not just picking colours and fonts. A good design process includes research into your industry and audience before any visuals are created. Our logo design services follow this approach, so your logo actually reflects your business rather than looking generic."
      }
    ]
  },
  about: {
    h1: "Empowering Businesses",
    h2s: {
      "core-principles": "The foundation of every successful digital campaign.",
      "journey": "Empowering Businesses Through Digital Excellence.",
      "team": "Meet the Experts Driving Your Digital Growth",
      "tech-stack": "Powered by Industry-Leading Technology",
      "cta": "Partner with Digital Growth Experts."
    },
    hasFaq: false
  },
  services: {
    h1: "Our Digital Marketing Services",
    h2s: {
      "services-grid": "Transforming Your Digital Presence",
      "cta": "Ready to Grow Your Business?"
    },
    hasFaq: true
  },
  contact: {
    h1: "Let's Talk Growth",
    h2s: {
      "faq": "Frequently Asked Questions"
    },
    hasFaq: true
  },
  career: {
    h1: "Join Our Team",
    h2s: {
      "culture": "Life at BuzzSpire Media",
      "roles": "Open Positions",
      "faq": "Hiring FAQs"
    },
    hasFaq: true
  }
};

// Fallback configuration for unknown slugs (like individual services)
export const DEFAULT_CMS_CONFIG = {
  h1: "Page Title",
  h2s: {
    "section-1": "Primary Section",
    "section-2": "Secondary Section"
  },
  hasFaq: true,
  isCustom: true
};

export function getCmsConfig(slug: string): { h1?: string, h2s?: Record<string, string>, hasFaq?: boolean, defaultFaqs?: any[], isCustom: boolean } {
  const config = CMS_CONFIG[slug];
  if (config) {
    return { ...config, isCustom: false };
  }
  return DEFAULT_CMS_CONFIG;
}

import { servicesData } from "@/data/servicesData";

export const SYSTEM_ROUTES = [
  { slug: "home", url: "/", title: "Homepage" },
  { slug: "about", url: "/about", title: "About Us" },
  { slug: "services", url: "/services", title: "Services" },
  { slug: "contact", url: "/contact", title: "Contact" },
  { slug: "career", url: "/career", title: "Careers" },
  { slug: "blog", url: "/blog", title: "Blog" },
  { slug: "privacy-policy", url: "/privacy-policy", title: "Privacy Policy" },
  { slug: "terms-of-service", url: "/terms-of-service", title: "Terms of Service" },
  ...servicesData.map(s => ({
    slug: s.slug,
    url: `/${s.slug}`,
    title: s.title
  }))
];
