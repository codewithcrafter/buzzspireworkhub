"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface ServiceFaqAccordionProps {
  faqs: FaqItem[];
}

export default function ServiceFaqAccordion({ faqs }: ServiceFaqAccordionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = activeFaq === idx;
        return (
          <div key={idx} className="border-b border-border/50 bg-transparent group">
            <button
              onClick={() => setActiveFaq(isOpen ? null : idx)}
              className="w-full py-6 text-left font-heading font-bold text-lg md:text-xl text-slate-900 hover:text-primary flex justify-between items-center focus:outline-none transition-colors"
            >
              <h3 className="pr-8">{faq.q}</h3>
              <div
                className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? "bg-primary border-primary text-white rotate-45"
                    : "group-hover:border-primary text-slate-600"
                }`}
              >
                <span className="text-lg leading-none">+</span>
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-base text-slate-600 leading-relaxed pr-12">{faq.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
