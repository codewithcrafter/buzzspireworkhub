"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Gift,
  Coffee,
  GraduationCap,
  Calendar,
  Compass,
  ArrowRight,
  CheckCircle2,
  X,
  FileText,
  User,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// Perks Mock
const perks = [
  { icon: Compass, title: "100% Remote Flexibility", text: "Work from anywhere in the world. We equip you with high-end Macbook Pros and office budgets." },
  { icon: DollarSign, title: "Performance Dividends", text: "Every team member shares directly in client scale-ups. Direct profit distribution twice a year." },
  { icon: GraduationCap, title: "$2,500 Learning Stipend", text: "We pay for books, marketing courses, and travel fees for digital strategy conferences." },
  { icon: Gift, title: "Unlimited Paid Time Off", text: "Take rest when needed. We enforce a minimum 20 days off annually to prevent burnout." }
];

// Open Positions Mock
const positions = [
  {
    id: "fe-architect",
    title: "Senior Front-End Engineer (Next.js)",
    dept: "Engineering",
    location: "Remote (US/EU Timezones)",
    salary: "$120,000 - $145,000 + equity",
    tags: ["Full-time", "Next.js", "Tailwind"],
    desc: "We are looking for a developer who builds websites comparable to Awwwards nominees. You will write code inside Next.js and Framer Motion, designing custom layouts for scaling brands."
  },
  {
    id: "media-buyer",
    title: "Performance Media Buyer (Meta & Google)",
    dept: "Marketing Campaigns",
    location: "Remote (Anywhere)",
    salary: "$90,000 - $115,000 + profit share",
    tags: ["Full-time", "Paid Search", "Meta API"],
    desc: "Scale media budgets safely from $20k to $250k monthly spend. You will perform bidding, audience mapping, direct-response copywriting, and CRM integration tracking."
  },
  {
    id: "copywriter",
    title: "Senior B2B Copywriter",
    dept: "Creative Branding",
    location: "Remote (US/EU Timezones)",
    salary: "$80,000 - $95,000",
    tags: ["Full-time", "Direct Response", "SEO Content"],
    desc: "Write direct-response copies for landing pages, ad hooks, and newsletter systems. You must have a portfolio containing published, commercial-intent articles."
  }
];

// Hiring Process Timeline
const steps = [
  { step: "01", title: "Apply & Review", desc: "Submit your Github, portfolio, or ad case studies. We review applications inside 3 business days." },
  { step: "02", title: "Culture Call", desc: "A 30-minute introductory call to discuss alignment, working styles, and agency models." },
  { step: "03", title: "Practical Case", desc: "A paid visual or buying exercise simulating an actual client marketing problem." },
  { step: "04", title: "Decision", desc: "Formal offer and team onboarding. Welcome to BuzzSpire Media!" }
];

// Career FAQs
const careerFaqs = [
  { q: "What timezone must I work in?", a: "We work asynchronously. However, team collaborations require overlapping with US Eastern or UK timezones for at least 3 hours daily." },
  { q: "Do you supply computer equipment?", a: "Yes, we send a brand-new Macbook Pro, external monitor, and a $500 home-office setup stipend during your first week." },
  { q: "How does the performance dividend share work?", a: "When clients beat traffic/sales metrics, the account team receives direct percentages of monthly billing margins. This payout occurs twice yearly." }
];

export default function CareerPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [applyModalPosition, setApplyModalPosition] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePortfolio, setCandidatePortfolio] = useState("");
  const [candidateCover, setCandidateCover] = useState("");

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setApplyModalPosition(null);
      setCandidateName("");
      setCandidateEmail("");
      setCandidatePortfolio("");
      setCandidateCover("");
    }, 3000);
  };

  const selectedPosition = positions.find(pos => pos.id === applyModalPosition);

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative">
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />

      {/* 1. HERO HEADER */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-6">
        <ScrollReveal>
          <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
            Join the Spire
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter leading-none text-foreground mt-6">
            Build high-performance assets <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              with absolute autonomy.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            We are looking for self-directed builders. We do not track hours worked, and we do not hold unnecessary meetings. We track impact, speed, and client conversion results.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. BENEFITS & PERKS */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Our Core Perks</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
                How we reward category-level impact
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((p, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-border shadow-premium h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors mb-6">
                      <p.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-3">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CURRENT OPENINGS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-xl text-foreground">
              Current Open Roles ({positions.length})
            </h3>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {positions.map((pos, idx) => (
            <ScrollReveal key={pos.id} delay={idx * 0.1}>
              <div className="p-8 rounded-3xl bg-white border border-border hover:border-primary/40 shadow-premium transition-all duration-300">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  
                  {/* Info details */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {pos.tags.map((t, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{t}</span>
                      ))}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">{pos.dept}</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-2xl text-foreground">{pos.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">{pos.desc}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground pt-1">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />{pos.location}</span>
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-600" />{pos.salary}</span>
                    </div>
                  </div>

                  {/* Apply trigger */}
                  <div className="shrink-0 w-full lg:w-auto">
                    <Magnetic>
                      <Button
                        onClick={() => setApplyModalPosition(pos.id)}
                        className="rounded-full bg-primary text-white font-semibold shadow-md w-full lg:w-auto"
                      >
                        Apply For This Role
                        <ArrowRight className="ml-1.5 w-4 h-4" />
                      </Button>
                    </Magnetic>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. HIRING PROCESS TIMELINE */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Our Framework</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
                How we recruit top digital minds
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <div className="p-8 rounded-3xl bg-white border border-border/50 shadow-premium h-full flex flex-col relative">
                  <div className="text-6xl font-heading font-black text-primary/10 mb-4">{s.step}</div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAREER FAQ ACCORDION */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Hiring Queries</h2>
            <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
              Candidate FAQs
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {careerFaqs.map((faq, idx) => {
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

      {/* 6. APPLICATION MODAL OVERLAY (Frontend state only) */}
      <AnimatePresence>
        {applyModalPosition && selectedPosition && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-border shadow-2xl p-6 md:p-8 max-w-xl w-full relative overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setApplyModalPosition(null)}
                className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4 mb-6">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">{selectedPosition.dept}</span>
                <h3 className="font-heading font-extrabold text-2xl text-foreground">{selectedPosition.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Submit your application details below. We typically review candidates within 3 business days.</p>
              </div>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-foreground">Application Received!</h4>
                  <p className="text-xs text-muted-foreground">Thank you for applying. Elena from our talent group will follow up shortly via email.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="c-name" className="text-xs font-bold text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="c-name"
                        required
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="John Doe"
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="c-email" className="text-xs font-bold text-foreground">Email Address</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="c-email"
                        type="email"
                        required
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="c-portfolio" className="text-xs font-bold text-foreground">Portfolio/GitHub/LinkedIn URL</Label>
                    <Input
                      id="c-portfolio"
                      required
                      value={candidatePortfolio}
                      onChange={(e) => setCandidatePortfolio(e.target.value)}
                      placeholder="https://github.com/myusername"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="c-cover" className="text-xs font-bold text-foreground">Why BuzzSpire? (Optional)</Label>
                    <Textarea
                      id="c-cover"
                      value={candidateCover}
                      onChange={(e) => setCandidateCover(e.target.value)}
                      placeholder="Tell us about a high-converting ad or clean script you shipped recently."
                      className="text-xs h-24"
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-full bg-primary text-white font-semibold py-5">
                    Submit Application
                  </Button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
