"use client";

import { ServiceData } from "@/data/servicesData";
import LeadFormSection from "@/components/ui/LeadFormSection";

interface ServiceCTAProps {
  service: ServiceData;
}

export default function ServiceCTA({ service }: ServiceCTAProps) {
  return (
    <LeadFormSection
      eyebrow="LET'S TALK"
      heading={`Ready to Accelerate Your ${service.navTitle}?`}
      description={`Tell us about your business and goals for ${service.navTitle}. We will analyze your current performance and build a custom action plan for your business.`}
      defaultService={service.navTitle}
      source={`${service.navTitle} Page`}
    />
  );
}

