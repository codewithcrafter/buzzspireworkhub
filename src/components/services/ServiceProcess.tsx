"use client";

import ScrollReveal from "@/components/ui/scroll-reveal";

const processSteps = [
  {
    step: "01",
    title: "Audit",
    desc: "We start by reviewing your current website, listings, and marketing - so every recommendation is based on your actual situation, not guesswork."
  },
  {
    step: "02",
    title: "Strategy",
    desc: "We build a plan around your goals and budget, and walk you through it before any work begins, so you know exactly what to expect."
  },
  {
    step: "03",
    title: "Execution",
    desc: "Our team gets to work - SEO fixes, campaigns, content, or design - with regular check-ins so you're never left wondering what's happening."
  },
  {
    step: "04",
    title: "Reporting",
    desc: "You get clear, honest reports showing what changed and why, so you can see the real impact of the work, not just a list of tasks."
  }
];

export default function ServiceProcess() {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto space-y-12">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">How We Work</span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
            Our 4-Step Execution Process
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Transparent execution with clear check-ins every step of the way.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {processSteps.map((step, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.12}>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 h-full flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
              <div>
                <div className="text-5xl font-heading font-black text-primary/20 group-hover:text-primary transition-colors mb-4">
                  {step.step}
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">{step.title}</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
