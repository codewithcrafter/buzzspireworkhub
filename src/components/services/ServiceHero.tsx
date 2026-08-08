"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";
import { ServiceData } from "@/data/servicesData";
import { getServiceIcon } from "@/components/services/ServiceIcon";

interface ServiceHeroProps {
  service: ServiceData;
}

export default function ServiceHero({ service }: ServiceHeroProps) {
  const IconComponent = getServiceIcon(service.iconName);

  return (
    <section className={`relative pt-12 pb-20 px-6 max-w-7xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-b ${service.gradient} border border-border/40 my-4`}>
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors font-medium">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/services" className="hover:text-primary transition-colors font-medium">
          Services
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-semibold truncate">{service.navTitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8 space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-primary/20 rounded-full text-primary text-xs md:text-sm font-semibold shadow-sm"
          >
            <IconComponent className="w-4 h-4 text-secondary shrink-0" />
            <span>{service.heroBadge}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.1] text-foreground"
          >
            {service.title}
          </motion.h1>

          {/* Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl"
          >
            {service.shortDesc}
          </motion.p>

          {/* Delhi / NCR Relevance banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center gap-2 text-xs md:text-sm font-medium text-foreground bg-white/60 backdrop-blur-sm p-3.5 rounded-2xl border border-border/50 max-w-xl"
          >
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{service.delhiRelevance}</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Magnetic strength={0.2}>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-8 py-7 text-lg group bg-primary text-white hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto shadow-md">
                  Get Free Consultation
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-border hover:bg-white/80 transition-all duration-300 w-full sm:w-auto">
                  Talk to Our Team
                </Button>
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Visual Graphic Card */}
        <div className="lg:col-span-4 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-sm p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl space-y-6 relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg">
              <IconComponent className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {service.tag}
              </span>
              <h3 className="font-heading font-extrabold text-xl text-foreground">
                Built For Delhi NCR Businesses
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No generic templates. Every strategy is tailored to your target customers and competition.
              </p>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-emerald-600 bg-emerald-50/80 p-3 rounded-2xl">
              <span>Transparent Reporting</span>
              <span>100% Honest Timelines</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
