"use client";

import { ShieldCheck, CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { ServiceData } from "@/data/servicesData";

interface ServiceBenefitsProps {
  service: ServiceData;
}

export default function ServiceBenefits({ service }: ServiceBenefitsProps) {
  return (
    <section className="py-20 bg-muted/40 relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-12 space-y-12">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Business Outcomes</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
              Real Benefits For Your Business
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Clear outcomes focused on visibility, inquiries, and customer acquisition.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {service.benefits.map((benefit, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
