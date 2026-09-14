"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, CheckCircle2, Filter, Layers, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import { caseStudiesData, CATEGORIES } from "@/data/caseStudiesData";
import { CaseStudyCategory } from "@/types/caseStudy";

export interface CaseStudiesClientProps {
  initialCaseStudies?: any[];
}

export default function CaseStudiesClient({ initialCaseStudies }: CaseStudiesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<CaseStudyCategory>("All");

  const caseStudiesList = initialCaseStudies && initialCaseStudies.length > 0
    ? initialCaseStudies
    : caseStudiesData;

  const filteredCaseStudies = selectedCategory === "All"
    ? caseStudiesList
    : caseStudiesList.filter((cs: any) => cs.industry === selectedCategory);

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative min-h-screen">
      {/* Background Glow Accents */}
      <div className="absolute top-12 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-96 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-16 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto text-center space-y-6">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-semibold tracking-wide mb-3">
            <Sparkles className="w-4 h-4 shrink-0 text-primary animate-pulse" />
            <span>Measurable Growth & Strategic Digital Marketing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-foreground leading-[1.15] max-w-4xl mx-auto">
            Case Studies &{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Client Growth Stories
            </span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">
            Explore how BuzzSpire Media helps businesses achieve measurable growth through data-driven digital marketing, performance ads, local SEO, and conversion optimization.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Magnetic strength={0.25}>
              <Link href="/contact">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl px-8 py-6 text-base group border-0">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
            
            <Link href="#portfolio-grid">
              <Button size="lg" variant="outline" className="rounded-full border-border hover:bg-muted font-semibold px-7 py-6 text-base">
                Explore Work
              </Button>
            </Link>
          </div>

          {/* Demo Disclaimer Pill */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/80 border border-border text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Demonstration / Sample Portfolio Datasets</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. FILTERING CONTROLS */}
      <section id="portfolio-grid" className="py-8 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border/60">
          <div className="flex items-center gap-2 text-foreground font-heading font-bold text-lg">
            <Filter className="w-5 h-5 text-primary shrink-0" />
            <span>Filter by Industry:</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap border shrink-0 ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                      : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="pt-6 pb-2 text-xs md:text-sm text-muted-foreground flex items-center justify-between">
          <span>Showing <strong className="text-foreground font-semibold">{filteredCaseStudies.length}</strong> case studies</span>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* 3. CASE STUDY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          <AnimatePresence mode="popLayout">
            {filteredCaseStudies.map((cs, idx) => (
              <motion.article
                key={cs.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative bg-card rounded-3xl border border-border/70 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-60 w-full overflow-hidden bg-muted">
                  <Image
                    src={cs.featuredImage}
                    alt={cs.client}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  
                  {/* Category Badge & Demo Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-background/95 backdrop-blur-md text-foreground text-xs font-bold shadow-sm border border-border/50">
                      {cs.industry}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      DEMO
                    </span>
                  </div>

                  {/* Client Name on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl md:text-2xl font-heading font-extrabold text-foreground group-hover:text-primary transition-colors">
                      {cs.client}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex flex-col flex-grow space-y-5">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {cs.shortDescription}
                  </p>

                  {/* Key Result Metric Highlight Box */}
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {cs.heroMetric.label}
                      </p>
                      <p className="text-base font-heading font-extrabold text-primary">
                        {cs.heroMetric.value}
                      </p>
                    </div>
                  </div>

                  {/* Services Badges */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Services Provided:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cs.services.map((svc: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/50"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-2 mt-auto">
                    <Link href={`/case-studies/${cs.slug}`} className="w-full">
                      <Button
                        className="w-full rounded-2xl bg-muted/80 hover:bg-primary hover:text-white text-foreground font-semibold group/btn border border-border/80 transition-all duration-300 py-5"
                      >
                        <span>View Case Study</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. METHODOLOGY / WHY US SECTION */}
      <section className="py-20 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto">
        <div className="bg-gradient-to-br from-card via-muted/40 to-card rounded-3xl border border-border p-8 md:p-14 shadow-premium">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
              Our Growth Methodology
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground tracking-tight">
              Data-backed execution for every campaign.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              We don't rely on vanity metrics. Every campaign at BuzzSpire Media is architected around verified business objectives—whether that's revenue growth, cost reduction per acquisition, or qualified lead generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              {
                title: "1. Audit & Setup",
                desc: "Full technical, tracking, and campaign architecture analysis to identify revenue leaks.",
              },
              {
                title: "2. Strategic Execution",
                desc: "Multi-channel media distribution, creative content production, and high-converting landing pages.",
              },
              {
                title: "3. Continuous Scaling",
                desc: "Iterative dynamic split-testing, bid optimization, and audience expansion.",
              },
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-background border border-border/60 space-y-2">
                <h3 className="font-heading font-bold text-lg text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA SECTION */}
      <section className="py-16 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto text-center">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl border border-primary/20 p-10 md:p-16 space-y-6">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            Ready to achieve similar growth for your brand?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Schedule a free digital strategy consultation with BuzzSpire Media experts today. We'll audit your current setup and outline actionable growth opportunities.
          </p>
          <div className="pt-2">
            <Magnetic strength={0.25}>
              <Link href="/contact">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-xl hover:shadow-2xl px-9 py-6 text-base group border-0">
                  Book Free Strategy Session
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </main>
  );
}
