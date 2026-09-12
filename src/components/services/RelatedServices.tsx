"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { servicesData } from "@/data/servicesData";
import { getServiceIcon } from "@/components/services/ServiceIcon";

interface RelatedServicesProps {
  currentSlug: string;
  relatedSlugs: string[];
}

export default function RelatedServices({ currentSlug, relatedSlugs }: RelatedServicesProps) {
  // Get related service items or fallback to other services
  const relatedList = servicesData.filter(
    (s) => relatedSlugs.includes(s.slug) && s.slug !== currentSlug
  );

  // If fewer than 3, add other services to make 3
  if (relatedList.length < 3) {
    const additional = servicesData.filter(
      (s) => s.slug !== currentSlug && !relatedList.some((r) => r.slug === s.slug)
    );
    relatedList.push(...additional.slice(0, 3 - relatedList.length));
  }

  return (
    <section className="py-20 bg-muted/40 relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-12 space-y-12">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Explore More</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
              Related Services
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Combine your strategy with complementary digital marketing channels.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedList.map((service, idx) => {
            const IconComponent = getServiceIcon(service.iconName);
            return (
              <ScrollReveal key={service.slug} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-slate-200/60 hover:border-primary/40 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {service.tag}
                    </span>
                    <h3 className="font-heading font-bold text-xl text-slate-900 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {service.shortDesc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-200/50">
                    <Link
                      href={`/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-secondary transition-colors"
                    >
                      <span>Explore Service</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
