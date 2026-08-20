"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CmsFaq({ content }: { content: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!content.faqs || !Array.isArray(content.faqs) || content.faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12 text-foreground">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {content.faqs.map((faq: any, index: number) => (
            <div 
              key={index}
              className="border border-border/60 rounded-2xl overflow-hidden bg-muted/10 transition-colors hover:bg-muted/30"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-lg text-foreground pr-8">{faq.q}</span>
                <ChevronDown 
                  className={`size-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
