"use client";

import React from "react";
import { ArrowRight, Plus, Minus } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface CmsPageTemplateProps {
  page: any;
}

export default function CmsPageTemplate({ page }: CmsPageTemplateProps) {
  const content = page?.publishedContent || {};
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const h1 = content.h1 || page.title;
  const intro = content.intro || "";
  const sections = content.sections || [];
  const faqs = content.faqs || [];

  return (
    <div className="w-full bg-background select-none bg-grid-pattern relative pb-24 min-h-screen">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

      {/* HERO SECTION */}
      <section className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center space-y-8">
        <ScrollReveal>
          <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
            {page.title}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-foreground mt-6 leading-[1.1]">
            {h1}
          </h1>
          {intro && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6 whitespace-pre-wrap">
              {intro}
            </p>
          )}
        </ScrollReveal>
      </section>

      {/* DYNAMIC SECTIONS */}
      {sections.length > 0 && (
        <section className="py-12 px-6 max-w-4xl mx-auto space-y-16">
          {sections.map((section: any, idx: number) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  {section.h2}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {section.body}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-24 px-6 max-w-4xl mx-auto relative mt-12 bg-muted/30 rounded-3xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Questions & Answers</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
                Frequently Asked Questions
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq: any, idx: number) => {
              const isOpen = activeFaq === idx;
              return (
                <ScrollReveal key={idx} delay={idx * 0.05}>
                  <div className="rounded-2xl border border-border bg-white overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-6 text-left flex items-center justify-between font-heading font-bold text-base md:text-lg text-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shrink-0 ml-4">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 border-t border-border/30 text-sm text-muted-foreground leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
