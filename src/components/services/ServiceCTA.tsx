"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { ServiceData } from "@/data/servicesData";

interface ServiceCTAProps {
  service: ServiceData;
}

export default function ServiceCTA({ service }: ServiceCTAProps) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="rounded-[3rem] bg-gradient-to-tr from-primary via-secondary to-accent p-10 md:p-16 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Background blurred glowing circles */}
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-[80px] pointer-events-none -translate-x-12 -translate-y-12 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-[100px] pointer-events-none translate-x-20 translate-y-20 animate-pulse" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              Tailored Strategy Session
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-tight">
              Ready to Accelerate Your {service.navTitle} in Delhi?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Book a confidential consultation with our team. We will analyze your current performance, audit competitors, and build a custom action plan for your business.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Magnetic strength={0.2}>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full px-9 py-7 text-lg bg-white text-primary hover:bg-white/95 font-bold shadow-lg transition-transform w-full sm:w-auto">
                    Get Free Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link href="/services" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="rounded-full px-9 py-7 text-lg border-white/40 text-white hover:bg-white/10 font-bold transition-all w-full sm:w-auto">
                    Explore All Services
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
