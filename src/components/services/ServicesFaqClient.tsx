"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  q: string;
  a: string;
}

interface ServicesFaqClientProps {
  faqs: FaqItem[];
}

export default function ServicesFaqClient({ faqs }: ServicesFaqClientProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = activeFaq === idx;
        return (
          <div key={idx} className="border border-slate-200/60 rounded-2xl bg-slate-50 font-sans shadow-md shadow-indigo-900/5 overflow-hidden transition-all duration-200">
            <button
              onClick={() => setActiveFaq(isOpen ? null : idx)}
              className="w-full p-6 md:p-8 text-left flex items-start justify-between font-heading font-bold text-lg text-slate-900 hover:text-primary transition-colors focus:outline-none"
            >
              <span className="pr-6">{faq.q}</span>
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'text-slate-600'}`}>
                <span className="text-xl leading-none -mt-0.5">
                  {isOpen ? '−' : '+'}
                </span>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 md:p-8 pt-0 text-base text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
