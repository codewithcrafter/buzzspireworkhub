"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { ServiceData } from "@/data/servicesData";

interface ServiceFAQProps {
  service: ServiceData;
}

export default function ServiceFAQ({ service }: ServiceFAQProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  if (!service.faqs || service.faqs.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto space-y-12">
      <ScrollReveal>
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            Questions & Answers
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        {service.faqs.map((faq, idx) => {
          const isOpen = activeFaq === idx;
          return (
            <ScrollReveal key={idx} delay={idx * 0.05}>
              <div className="rounded-2xl border border-border bg-white overflow-hidden transition-all duration-300 shadow-sm hover:border-primary/30">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-heading font-bold text-base md:text-lg text-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shrink-0">
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
                      <div className="p-6 pt-0 border-t border-border/30 text-xs md:text-sm text-muted-foreground leading-relaxed">
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
  );
}
