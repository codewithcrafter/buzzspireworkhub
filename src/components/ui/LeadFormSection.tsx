"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Target 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ScrollReveal from "@/components/ui/scroll-reveal";

interface LeadFormSectionProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  defaultService?: string;
  source?: string;
}

const serviceOptions = [
  "SEO Services",
  "PPC & Paid Ads",
  "SMO / Social Media Optimization",
  "Social Media Marketing",
  "Google Business Profile Management",
  "Ecommerce Operation",
  "Graphic Design",
  "Product Photography",
  "Video Editing",
  "Web Development",
  "Other / Full Growth Suite",
];

const budgetOptions = [
  "₹50,000 - ₹1,00,000 / mo",
  "₹1,00,000 - ₹2,50,000 / mo",
  "₹2,50,000 - ₹5,00,000 / mo",
  "₹5,00,000+ / mo",
];

export default function LeadFormSection({
  eyebrow = "LET'S TALK",
  heading = "Let's Grow Your Business",
  description = "Tell us about your business and what you're looking to achieve. We'll get back to you with the right next steps.",
  defaultService,
  source = "Page Enquiry Form",
}: LeadFormSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState(defaultService || serviceOptions[0]);
  const [budget, setBudget] = useState(budgetOptions[0]);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateIndianPhone = (input: string) => {
    if (!input.trim()) return true; // Phone optional if empty
    const cleaned = input.trim().replace(/[\s\-()]/g, "");
    return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setPhoneError("");

    if (phone && !validateIndianPhone(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const pagePath = typeof window !== "undefined" ? window.location.pathname : "";
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          service: service.trim(),
          budget: budget,
          message: message.trim(),
          source: source,
          pageUrl: pagePath,
        }),
      });

      if (res.ok) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setName("");
          setEmail("");
          setPhone("");
          setCompany("");
          setMessage("");
        }, 5000);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.message || "Failed to submit brief. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto relative border-t border-border/40">
      <ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: CTA Pitch & Trust Highlights */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                {eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-[1.12]">
                {heading}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Trust Highlights */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-border/60 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground">Fast 3-Hour Response</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Our senior strategic team reviews your inquiry and responds within 3 business hours.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-border/60 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground">Tailored Growth Audit</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">We audit your current search ranks, paid ad setups, and website conversions before our call.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-border/60 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground">100% Confidential & No Pressure</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Honest recommendations without aggressive sales pitches or hidden commitments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reusable Enquiry Form */}
          <div className="lg:col-span-7 bg-white border border-border p-8 md:p-10 rounded-3xl shadow-premium relative">
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <h3 className="font-heading font-bold text-2xl text-foreground">Growth Brief</h3>
              </div>
              <p className="text-xs text-muted-foreground">Share your project goals below for an instant review.</p>
            </div>

            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="py-16 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="font-heading font-bold text-2xl text-foreground">Brief Submitted Successfully!</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you! Our growth desk has received your brief and will connect with you within 3 business hours to review your website strategy.
                  </p>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-name" className="text-xs font-bold text-foreground">
                        Your Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="lead-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rahul Sharma"
                        className="text-xs h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-email" className="text-xs font-bold text-foreground">
                        Work Email <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="lead-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@company.in"
                        className="text-xs h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-phone" className="text-xs font-bold text-foreground">
                        Phone Number
                      </Label>
                      <Input
                        id="lead-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneError) setPhoneError("");
                        }}
                        placeholder="+91-9876543210"
                        className={`text-xs h-11 ${phoneError ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}
                      />
                      {phoneError && (
                        <p className="text-[11px] text-red-500 font-semibold">{phoneError}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-company" className="text-xs font-bold text-foreground">
                        Company Name
                      </Label>
                      <Input
                        id="lead-company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Northstar Retail"
                        className="text-xs h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-service" className="text-xs font-bold text-foreground">
                        Service Focus
                      </Label>
                      <select
                        id="lead-service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2.5 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lead-budget" className="text-xs font-bold text-foreground">
                        Estimated Ad Spend / mo
                      </Label>
                      <select
                        id="lead-budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2.5 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {budgetOptions.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lead-message" className="text-xs font-bold text-foreground">
                      Target Goals & Message <span className="text-primary">*</span>
                    </Label>
                    <Textarea
                      id="lead-message"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your goals (e.g. improve Google search ranks, restructure Google Ads, build a high-converting website)..."
                      className="text-xs h-28"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-500 text-center font-bold">{errorMsg}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-primary text-white font-semibold py-6 text-sm hover:bg-primary/95 disabled:opacity-70 cursor-pointer shadow-md transition-all"
                  >
                    {isSubmitting ? "Submitting Brief..." : "Submit Growth Brief"}
                    {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}
