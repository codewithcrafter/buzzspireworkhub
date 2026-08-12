"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Plus,
  Minus
} from "lucide-react";
import { Twitter, Linkedin, Instagram } from "@/components/ui/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ScrollReveal from "@/components/ui/scroll-reveal";

// Office Locations
const offices = [
  { city: "San Francisco", address: "100 Pine St Suite 1250, San Francisco, CA 94111", phone: "+1 (415) 555-0192" },
  { city: "London", address: "30 St Mary Axe, London EC3A 8BF, United Kingdom", phone: "+44 20 7946 0958" },
  { city: "Singapore", address: "8 Marina View, Asia Square Tower 1, Singapore 018960", phone: "+65 6789 0122" }
];

// Default Contact FAQs
const defaultContactFaqs = [
  { q: "How soon do we schedule our initial strategy call?", a: "Once you submit our contact form or book directly, our partners will follow up via email inside 3 business hours to schedule a Zoom review session." },
  { q: "Do you sign Non-Disclosure Agreements (NDAs)?", a: "Yes, we sign standard NDAs before auditing proprietary ad accounts, SEO metrics, or customer CRM lists." },
  { q: "What should we prepare for the audit call?", a: "Simply ensure your marketing leads have dashboard access to Google Analytics 4, Search Console, or paid ad portals so we can review performance values together." }
];

export default function ContactClientView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState("$5,000 - $10,000 / mo");
  const [message, setMessage] = useState("");

  const heroBadge = "Get In Touch";
  const heroHeading = "Let's build your";
  const heroDesc = "Fill out our performance brief below. Our managing partners will review your search ranks and ad setups and present a free audit during our initial call.";

  const formHeading = "Growth Brief";
  const formSubheading = "Share your target marketing parameters and ad spends.";

  const faqSectionLabel = "Onboarding Info";
  const faqHeading = "Contact & Scoping FAQs";
  const faqsList = defaultContactFaqs;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, budget, message })
      });

      if (res.ok) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setName("");
          setEmail("");
          setCompany("");
          setBudget("$5,000 - $10,000 / mo");
          setMessage("");
        }, 4000);
      } else {
        alert("There was an error submitting your brief. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />

      {/* 1. HERO HEADER */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-6">
        <ScrollReveal>
          <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
            {heroBadge}
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter leading-none text-foreground mt-6">
            {heroHeading} <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              revenue growth engine.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            {heroDesc}
          </p>
        </ScrollReveal>
      </section>

      {/* 2. CONTACT DETAILS & FORM */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">

            {/* Quick Cards */}
            <div className="bg-white border border-border p-8 rounded-3xl shadow-premium space-y-6">
              <h3 className="font-heading font-bold text-xl text-foreground">Direct Connect</h3>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Work Email</p>
                    <a href="mailto:growth@buzzspire.media" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">growth@buzzspire.media</a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Strategy Desk</p>
                    <a href="tel:+14155550192" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">+1 (415) 555-0192</a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Office Hours</p>
                    <p className="text-sm font-semibold text-foreground">Mon - Fri, 9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-border/50 space-y-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Social Networks</p>
                <div className="flex gap-3">
                  {[
                    { icon: Twitter, href: "https://twitter.com" },
                    { icon: Linkedin, href: "https://linkedin.com" },
                    { icon: Instagram, href: "https://instagram.com" }
                  ].map((soc, i) => (
                    <a
                      key={i}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <soc.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Office Coordinates List */}
            <div className="bg-white border border-border p-8 rounded-3xl shadow-premium space-y-6">
              <h3 className="font-heading font-bold text-xl text-foreground">Global Offices</h3>
              <div className="space-y-4">
                {offices.map((off, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      {off.city}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-5">{off.address}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed pl-5 font-semibold">{off.phone}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-border p-8 md:p-12 rounded-3xl shadow-premium">
            <h3 className="font-heading font-bold text-2xl text-foreground mb-1">{formHeading}</h3>
            <p className="text-xs text-muted-foreground mb-8">{formSubheading}</p>

            <AnimatePresence>
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="py-16 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-bold text-xl text-foreground">Brief Submitted Successfully!</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Thank you. Marcus Vane from our strategic partnerships desk will reach out within 3 business hours to review your website audits.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="u-name" className="text-xs font-bold text-foreground">Your Name</Label>
                      <Input
                        id="u-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="u-email" className="text-xs font-bold text-foreground">Work Email</Label>
                      <Input
                        id="u-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="u-company" className="text-xs font-bold text-foreground">Company Name</Label>
                      <Input
                        id="u-company"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="FlowState Technologies"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="u-budget" className="text-xs font-bold text-foreground">Estimated Ad Spend / mo</Label>
                      <select
                        id="u-budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="$1,000 - $5,000 / mo">$1,000 - $5,000 / mo</option>
                        <option value="$5,000 - $10,000 / mo">$5,000 - $10,000 / mo</option>
                        <option value="$10,000 - $50,000 / mo">$10,000 - $50,000 / mo</option>
                        <option value="$50,000+ / mo">$50,000+ / mo</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="u-msg" className="text-xs font-bold text-foreground">Target Channel Focus & Goals</Label>
                    <Textarea
                      id="u-msg"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g., We need to double organic traffic and restructure our Google Performance Max ad campaigns."
                      className="text-xs h-32"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-primary text-white font-semibold py-6 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? "Submitting..." : "Submit Growth Brief"}
                    {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
                  </Button>
                </form>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* 3. MAP PLACEHOLDER */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[3rem] overflow-hidden border border-border bg-muted shadow-premium aspect-[21/9] flex items-center justify-center relative bg-slate-100">
            <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
            <div className="z-10 text-center space-y-4 p-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-foreground">Map Coordinates Loaded</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Headquarters: Pine Street, San Francisco, CA. Zoom linkages and exact street coordinates will render upon confidential discovery briefing approval.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. CONTACT FAQ */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">{faqSectionLabel}</h2>
            <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
              {faqHeading}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqsList.map((faq, idx) => {
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
    </main>
  );
}
