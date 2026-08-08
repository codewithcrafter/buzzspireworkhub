"use client";

import { CheckCircle2, Zap } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { ServiceData } from "@/data/servicesData";

interface ServiceOverviewProps {
  service: ServiceData;
}

export default function ServiceOverview({ service }: ServiceOverviewProps) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto space-y-16">
      {/* Complete Source Content */}
      <ScrollReveal>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider">
            Overview
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground tracking-tight">
            How Our {service.title} Works For Your Business
          </h2>
          <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            {service.fullContent.map((paragraph, idx) => (
              <p key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-border/60 shadow-premium">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* What We Do / Features Grid */}
      <ScrollReveal>
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">What We Do</span>
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">
              Key Capabilities & Deliverables
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.features.map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-border/60 shadow-premium hover:border-primary/40 transition-all duration-300 h-full flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h4 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
