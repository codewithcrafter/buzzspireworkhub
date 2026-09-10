import { Metadata } from "next";
import ServicesClientView from "./ServicesClientView";
import ServiceSchema from "@/components/seo/ServiceSchema";

export const metadata: Metadata = {
  title: "Digital Marketing Services in Delhi | Buzzspire",
  description:
    "Explore all digital marketing services in Delhi under one roof — SEO, PPC, SMM, design, and more. One agency, every service you need. Call now!",
  alternates: {
    canonical: "https://www.buzzspiremedia.com/digital-marketing-agency-in-delhi",
  },
};

const digitalMarketingFaqs = [
  {
    question: "Do I need to hire multiple agencies for different services?",
    answer:
      "No. That's honestly the whole point of working with us. One team handles SEO, ads, design, and your website, so nothing falls through the cracks between vendors.",
  },
  {
    question: "Can I start with just one service and add more later?",
    answer:
      "Yes. Most clients start with one or two services, see results, then expand. There's no requirement to buy everything upfront.",
  },
  {
    question: "How does one team handle SEO, design, and ads together?",
    answer:
      "Because they're not separate teams pretending to collaborate. Your SEO strategist, ad manager, and designer sit on the same account, working off the same data.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <ServiceSchema
        slug="digital-marketing-agency-in-delhi"
        serviceName="Digital Marketing Services in Delhi"
        serviceType="Digital Marketing"
        title="Digital Marketing Services in Delhi | Buzzspire"
        description="Explore all digital marketing services in Delhi under one roof — SEO, PPC, SMM, design, and more. One agency, every service you need. Call now!"
        faqs={digitalMarketingFaqs}
      />
      <ServicesClientView />
    </>
  );
}
