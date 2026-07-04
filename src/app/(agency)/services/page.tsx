"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  FileText,
  Mail,
  Share2,
  Sparkles,
  Users2,
  Code2,
  LayoutTemplate,
  Workflow,
  BarChart4,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Zap,
  Tag
} from "lucide-react";
import { Instagram } from "@/components/ui/social-icons";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// Services list
const servicesData = [
  {
    id: "seo",
    icon: Search,
    title: "Search Engine Optimization",
    tagline: "Drive high-intent buyers organically",
    desc: "Our SEO services go beyond simple rankings. We align keyword clusters with search intent, optimizing your page architecture to capture organic traffic and convert queries into sales pipeline value.",
    features: ["Technical SEO & Core Web Vitals Audit", "Semantic Keyword Mapping", "Premium Editorial Outreach", "Competitor Share-of-Voice Audits"],
    benefits: ["Zero ongoing cost-per-click ad expenditures", "Compounding organic lead traffic over time", "Enhanced search credibility and brand authority"],
    pricing: {
      standard: "$2,800/mo",
      enterprise: "$5,500/mo",
      deliverable: "Minimum 12-month compound projection"
    },
    faqs: [
      { q: "How long does SEO take to produce results?", a: "SEO is a compound asset. Initial keyword lifts occur in 45-60 days. Major conversion velocity occurs around months 4 to 6." },
      { q: "Do you guarantee #1 rankings?", a: "No ethical agency guarantees #1 spots because Google's algorithm updates constantly. However, our technical frameworks historically Lift commercial keywords inside 90 days." }
    ]
  },
  {
    id: "google-ads",
    icon: TrendingUp,
    title: "Google Pay-Per-Click Ads",
    desc: "Capture active buyers at the precise moment they search for your solutions. We deploy hyper-optimized search campaigns, Shopping setups, and Performance Max scripts to drive maximum revenue returns.",
    features: ["Negative Keyword Filtering", "Dynamic Keyword Insertion", "Performance Max Optimization", "Call-to-Action Ad Writing"],
    benefits: ["Instant traffic and qualified sales leads", "A/B tested copywriting for lower click cost", "Clear conversion metrics for cost-per-acquisition"],
    pricing: {
      standard: "$1,800/mo + 10% spend",
      enterprise: "$4,000/mo + 8% spend",
      deliverable: "Includes real-time GA4 tracking setup"
    },
    faqs: [
      { q: "What monthly budget do you recommend?", a: "We recommend a minimum initial ad budget of $2,500/month to accumulate enough statistical data to optimize." },
      { q: "Do you edit our landing pages for ads?", a: "Yes, landing page conversion adjustments are included in our PPC packages to maximize conversion rate." }
    ]
  },
  {
    id: "meta-ads",
    icon: Instagram,
    title: "Meta Ads (Facebook & Instagram)",
    desc: "Scale user acquisition on social media. We write direct-response scripts, shoot/edit high-performing video creatives, and implement custom conversion APIs to beat iOS tracking limits.",
    features: ["Direct-Response Video Ad Creatives", "Conversion API Integration", "Lookalike Audience Target Maps", "Retargeting Loop Funnels"],
    benefits: ["Predictable new customer pipelines", "High-retention video asset catalog", "Protection against cookie/browser limitations"],
    pricing: {
      standard: "$2,200/mo + 10% spend",
      enterprise: "$4,500/mo + 8% spend",
      deliverable: "Includes complete custom asset creation"
    },
    faqs: [
      { q: "Do we need to supply video footage?", a: "We can shoot and edit original ad creative for you, or adapt your existing catalog using high-conversion scripts." }
    ]
  },
  {
    id: "content-marketing",
    icon: FileText,
    title: "Content Marketing & Editorial",
    desc: "Establish your brand as an industry thought leader. We write top-tier long-form articles, white papers, and guides that attract links and guide prospects through their buying journeys.",
    features: ["SaaS & B2B Editorial Research", "Ebooks & Conversion Assets", "Keyword-focused Copywriting", "Newsletter Creative Blocks"],
    benefits: ["Increased brand trust and search links", "Assets for email and sales support", "High organic rank consistency"],
    pricing: {
      standard: "$3,000/mo",
      enterprise: "$6,000/mo",
      deliverable: "Includes 4 high-authority posts per month"
    },
    faqs: [
      { q: "Who writes the content?", a: "We employ professional, in-house copywriters with domain expertise in tech, finance, and e-commerce." }
    ]
  },
  {
    id: "email-marketing",
    icon: Mail,
    title: "Email & Retention Marketing",
    desc: "Extract maximum lifetime value from your customer database. We build automated flows, write sales sequence copy, and clean lists to maximize deliverability and revenue-per-recipient.",
    features: ["Abandoned Cart Retention Flows", "Klaviyo & HubSpot Integrations", "A/B Split Subject Line Testing", "Customer Reactivation Sequences"],
    benefits: ["Bypasses rising ad costs entirely", "Boosts average customer lifetime value", "High-ROI direct conversions"],
    pricing: {
      standard: "$1,500/mo",
      enterprise: "$3,200/mo",
      deliverable: "Includes database health management"
    },
    faqs: [
      { q: "Can you help migrate our CRM system?", a: "Yes, our team manages migrations between platforms like Mailchimp, Klaviyo, ActiveCampaign, and HubSpot." }
    ]
  },
  {
    id: "social-media",
    icon: Share2,
    title: "Social Media Strategy",
    desc: "Build an active community around your brand name. We craft custom organic content calendars, post designs, and community interactions that drive engagement and trust.",
    features: ["Interactive Post Designs", "Trend Monitoring & Rapid Response", "Growth Audits & Competitor Maps", "Monthly Posting Calendars"],
    benefits: ["Stronger customer brand affinity", "Secondary organic traffic source", "Visual consistency across accounts"],
    pricing: {
      standard: "$1,600/mo",
      enterprise: "$3,000/mo",
      deliverable: "Minimum 3 weekly original designs"
    },
    faqs: [
      { q: "Do you handle negative comments?", a: "Yes, we establish clear community guidelines with you during onboarding to handle customer support questions online." }
    ]
  },
  {
    id: "brand-strategy",
    icon: Sparkles,
    title: "Brand Strategy & Identity",
    desc: "Refine your positioning to justify a premium price point. We run positioning workshops, build typography guidelines, design logos, and write custom messaging books.",
    features: ["Competitor Positioning Audits", "Core Values & Pitch Manifestos", "Custom Logo Design Books", "Visual Style Guidelines"],
    benefits: ["Command premium industry pricing", "Unified company-wide brand voice", "Protection against commodity positioning"],
    pricing: {
      standard: "$5,000 (One-time)",
      enterprise: "$12,000 (One-time)",
      deliverable: "Includes full typography & logo source files"
    },
    faqs: [
      { q: "How long does a branding project take?", a: "Branding sprints typically take 4 to 8 weeks, including visual style drafts and logo iterations." }
    ]
  },
  {
    id: "influencer-marketing",
    icon: Users2,
    title: "Influencer Marketing",
    desc: "Unlock secondary growth channels through trust. We source creators, negotiate content rates, handle contract compliance, and track conversions to verify creator returns.",
    features: ["Creator Outreach & Pitch Lists", "Contract & Compliance Audits", "Promo Code Tracking Dashboards", "Creative Script Guides"],
    benefits: ["Tap into pre-built niche trust structures", "High-quality lifestyle creator assets", "Lower user acquisition costs"],
    pricing: {
      standard: "$2,000/mo + creator fees",
      enterprise: "$4,500/mo + creator fees",
      deliverable: "Includes tracking setup and contracts"
    },
    faqs: [
      { q: "How do you track influencer ROI?", a: "We utilize custom discount codes, dedicated landing pages, and UTM conversion codes to map sales directly to influencers." }
    ]
  },
  {
    id: "web-dev",
    icon: Code2,
    title: "Web Engineering (Next.js)",
    desc: "Awwwards-level frontend development. We code high-speed website structures using Next.js and Tailwind CSS to ensure instant load times and perfect conversions.",
    features: ["Server-Side Rendering Speed", "Tailwind Custom Style Systems", "Framer Motion Interactive Effects", "Perfect Core Web Vitals Ratings"],
    benefits: ["Maximized landing page lead conversions", "Secure coding standards with zero bloat", "Excellent Google SEO crawling speeds"],
    pricing: {
      standard: "From $8,000 (One-time)",
      enterprise: "From $20,000 (One-time)",
      deliverable: "Includes 12-month hosting alignment support"
    },
    faqs: [
      { q: "Can we edit the website after it is built?", a: "Yes, we integrate headless content management systems (CMS) so you can update text and posts without writing code." }
    ]
  },
  {
    id: "ui-ux",
    icon: LayoutTemplate,
    title: "UI/UX Product Design",
    desc: "Design experiences that prevent user drop-offs. We perform heat map tests, draft wireframes, build interactive prototypes, and test user journeys to optimize checkout funnels.",
    features: ["Figma Wireframes & Prototypes", "Heat Map & Scroll Test Audits", "User Journey Flow Charts", "Conversion Audit Reports"],
    benefits: ["Lower web page exit rates", "Polished and professional brand image", "Frictionless customer purchase steps"],
    pricing: {
      standard: "$4,500 (One-time)",
      enterprise: "$10,000 (One-time)",
      deliverable: "Includes interactive Figma prototypes"
    },
    faqs: [
      { q: "Do you design for mobile screens?", a: "Yes, all design drafts follow a mobile-first philosophy to align with modern responsive behaviors." }
    ]
  },
  {
    id: "marketing-automation",
    icon: Workflow,
    title: "Marketing Stack Automation",
    desc: "Automate sales workflows and nurture leads without manual steps. We connect your lead capture forms, CRM pipelines, and notification bots to prevent lead leakage.",
    features: ["HubSpot & Salesforce Pipelines", "Zapier Integration Workflows", "Instant Slack Alert Setups", "Lead Scoring Logic Maps"],
    benefits: ["Saves hours of manual sales data entry", "Prevents slow lead follow-up times", "Clear sales pipeline reporting"],
    pricing: {
      standard: "$2,500/mo",
      enterprise: "$5,000/mo",
      deliverable: "Includes flow optimization audits"
    },
    faqs: [
      { q: "Can you sync Facebook leads directly to CRM?", a: "Yes, we configure automated hooks that push paid ad leads directly to your sales reps inside 60 seconds." }
    ]
  },
  {
    id: "analytics",
    icon: BarChart4,
    title: "Data Analytics & BI",
    desc: "Obtain absolute transparency over marketing return-on-investment. We set up Server-Side GTM tracking, custom Looker Studio dashboards, and CRM revenue maps.",
    features: ["Server-Side Google Tag Manager", "Looker Studio Custom Dashboards", "Conversion Value Audit Sheets", "UTM Tracking Standardization"],
    benefits: ["No dark marketing spends", "Precise return-on-ad-spend metrics", "Accurate data for scale budgets"],
    pricing: {
      standard: "$2,000/mo",
      enterprise: "$4,000/mo",
      deliverable: "Includes monthly performance analysis reports"
    },
    faqs: [
      { q: "Are tracking setups compliant with GDPR?", a: "Yes, we deploy consent banners and server-side compliance tags to align with privacy rules." }
    ]
  }
];

export default function ServicesPage() {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const activeService = servicesData[activeServiceIdx];

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />

      {/* 1. HERO HEADER */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-6">
        <ScrollReveal>
          <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
            Our Specialties
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter leading-none text-foreground mt-6">
            Elite marketing tools <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              built for commercial velocity.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            Explore our comprehensive suite of 12 core digital marketing and engineering specialties. Use the interactive switcher below to inspect key features, business benefits, and transparent pricing.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. INTERACTIVE SERVICE DASHBOARD */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Sidebar Selector */}
          <div className="lg:col-span-4 bg-white border border-border p-4 rounded-3xl shadow-premium space-y-1 lg:sticky lg:top-28">
            <h3 className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-widest px-4 pb-3 border-b border-border mb-3">
              12 Marketing Specialties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
              {servicesData.map((service, idx) => {
                const isSelected = activeServiceIdx === idx;
                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      setActiveServiceIdx(idx);
                      setActiveFaq(null);
                    }}
                    className={`w-full px-4 py-3 rounded-2xl text-left font-semibold text-sm transition-all flex items-center gap-3 focus:outline-none ${
                      isSelected
                        ? "bg-primary text-white shadow-md"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <service.icon className={`w-5 h-5 shrink-0 ${isSelected ? "text-white" : "text-primary"}`} />
                    <span className="truncate">{service.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Display Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Header overview */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold">
                    <Tag className="w-3 h-3" />
                    <span>Specialty Category</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
                    {activeService.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {activeService.desc}
                  </p>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border">
                  
                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-heading font-bold text-base text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      What We Deliver
                    </h4>
                    <ul className="space-y-3">
                      {activeService.features.map((feat, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground items-start">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4">
                    <h4 className="font-heading font-bold text-base text-foreground uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      Business Benefits
                    </h4>
                    <ul className="space-y-3">
                      {activeService.benefits.map((bene, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground items-start">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{bene}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Pricing Box */}
                <div className="p-8 rounded-3xl bg-muted/50 border border-border grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h4 className="font-heading font-bold text-lg text-foreground mb-1">Pricing Guide</h4>
                    <p className="text-xs text-muted-foreground mb-4">Select the operational scale that matches your company requirements.</p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Standard Retainer: <span className="text-primary font-bold text-base">{activeService.pricing.standard}</span></p>
                      <p className="text-sm font-semibold text-foreground">Enterprise Retainer: <span className="text-secondary font-bold text-base">{activeService.pricing.enterprise}</span></p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">{activeService.pricing.deliverable}</p>
                    <Magnetic>
                      <Link href="/contact">
                        <Button className="rounded-full bg-primary text-white font-semibold">
                          Consult On This Service
                          <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Button>
                      </Link>
                    </Magnetic>
                  </div>
                </div>

                {/* FAQ specific to selected service */}
                {activeService.faqs && activeService.faqs.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-heading font-bold text-base text-foreground uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-border">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      Specialty FAQ
                    </h4>
                    <div className="space-y-3">
                      {activeService.faqs.map((faq, idx) => {
                        const isOpen = activeFaq === idx;
                        return (
                          <div key={idx} className="border border-border rounded-2xl bg-white overflow-hidden">
                            <button
                              onClick={() => setActiveFaq(isOpen ? null : idx)}
                              className="w-full p-5 text-left font-heading font-bold text-sm md:text-base text-foreground hover:text-primary flex justify-between items-center focus:outline-none"
                            >
                              <span>{faq.q}</span>
                              <span className="text-xs text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-full select-none">{isOpen ? "Hide" : "Show"}</span>
                            </button>
                            {isOpen && (
                              <div className="p-5 pt-0 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-border/20">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 3. FOOTER CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[3rem] bg-gradient-to-tr from-primary via-secondary to-accent p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter">
                Scale your marketing channels today
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                Connect with our lead strategists to map out your conversion goals and get custom service configurations.
              </p>
              <div>
                <Magnetic>
                  <Link href="/contact">
                    <Button size="lg" className="rounded-full px-8 py-7 text-lg bg-white text-primary hover:bg-white/95 font-bold shadow-lg transition-transform">
                      Configure Custom Package
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
