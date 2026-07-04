"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Zap,
  Globe,
  MessageSquare,
  Search,
  Sparkles,
  BarChart3,
  MousePointerClick,
  Code,
  Laptop,
  Play,
  ArrowUpRight,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroScene from "@/components/3d/HeroScene";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// Rotating Words for Hero Section
const rotatingWords = ["SEO Dominance", "PPC Scaling", "Brand Authority", "Web Engineering"];

// Statistics
const stats = [
  { value: "350%", label: "Average Traffic Boost", desc: "For clients in first 6 months" },
  { value: "14.8M", label: "Qualified Leads Generated", desc: "Driven by database targeting" },
  { value: "12x", label: "Average Campaign ROI", desc: "Exceeding industry standard of 4x" },
  { value: "24", label: "Awwwards & Design Awards", desc: "Recognized for creative excellence" }
];

// Logos
const logos = [
  "Stripe", "Airbnb", "Spotify", "Netflix", "Tesla", "Slack", "Hubspot", "Shopify"
];

// Services
const featuredServices = [
  {
    icon: Search,
    title: "Search Engine Optimization",
    desc: "Dominate search results, drive organic traffic, and capture high-intent buyers with our data-first SEO framework.",
    tag: "SEO"
  },
  {
    icon: TrendingUp,
    title: "Performance PPC",
    desc: "Scale customer acquisition with hyper-targeted Google, Meta, and LinkedIn Ad campaigns optimized for raw pipeline value.",
    tag: "Paid Ads"
  },
  {
    icon: Sparkles,
    title: "Premium Branding",
    desc: "Position your brand as the undisputed category leader with high-end logo design, copywriting, and visual systems.",
    tag: "Creative"
  },
  {
    icon: Code,
    title: "Enterprise Web Development",
    desc: "Awwwards-level Next.js development offering ultra-fast page speeds, seamless animations, and perfect conversion pathways.",
    tag: "Engineering"
  },
  {
    icon: Zap,
    title: "Marketing Automation",
    desc: "Align your CRM, email funnels, and marketing stack to nurture leads automatically and compress sales cycles.",
    tag: "MarTech"
  },
  {
    icon: BarChart3,
    title: "Data Analytics & BI",
    desc: "Gain absolute transparency with real-time dashboards mapping marketing dollars spent directly to revenue generated.",
    tag: "Analytics"
  }
];

// Process Steps
const processSteps = [
  {
    step: "01",
    title: "Audit & Intelligence",
    desc: "We perform a thorough analysis of your industry, competitors, search positioning, and existing ad account inefficiencies."
  },
  {
    step: "02",
    title: "Growth Blueprint",
    desc: "We deliver a comprehensive marketing road map outlining high-priority campaign launches, design revamps, and conversion hooks."
  },
  {
    step: "03",
    title: "Engineering & Launch",
    desc: "Our developers and media buyers write copy, build high-speed landing pages, and launch highly optimized ad campaigns."
  },
  {
    step: "04",
    title: "Continuous Velocity",
    desc: "Through continuous A/B testing, copy refinement, and bid adjustments, we scale budgets while maintaining client efficiency."
  }
];

// Case Studies
const caseStudies = [
  {
    title: "SaaS Scale-Up",
    client: "FlowState Technologies",
    metric: "+240% Demo Bookings",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-600 to-indigo-600",
    tag: "Performance Ads"
  },
  {
    title: "D2C E-Commerce Empire",
    client: "LuxeVibe Cosmetics",
    metric: "$4.2M Brand Revenue",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80",
    gradient: "from-purple-600 to-pink-600",
    tag: "Growth & Branding"
  },
  {
    title: "FinTech SEO Dominance",
    client: "CapShield Finance",
    metric: "180k/mo Organic Visits",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    gradient: "from-cyan-600 to-blue-600",
    tag: "SEO Strategy"
  }
];

// Before / After SEO Metric Details
const beforeAfter = [
  { title: "Monthly Organic Traffic", before: "18,400 sessions", after: "192,500 sessions", change: "+946%" },
  { title: "Paid Lead Cost (CPA)", before: "$142.50 avg.", after: "$38.20 avg.", change: "-73%" },
  { title: "Landing Page Conversions", before: "1.4% rate", after: "5.8% rate", change: "+314%" }
];

// FAQ list
const faqs = [
  {
    q: "How quickly will we see results from our campaigns?",
    a: "PPC, social media ads, and landing page conversion optimizations generally generate qualified leads within 14 to 30 days. Search Engine Optimization (SEO) and complex branding systems are long-term assets that typically yield compound exponential returns in 3 to 6 months."
  },
  {
    q: "Do you lock clients into long-term annual contracts?",
    a: "No, we believe in earning your partnership every single month. We offer flexible, value-based monthly retainers after an initial 90-day onboarding period. This keeps our team hyper-focused on maintaining performance and revenue velocity."
  },
  {
    q: "What makes BuzzSpire different from standard marketing agencies?",
    a: "Unlike traditional agencies that focus on 'vanity metrics' like impressions, likes, or search ranks, we track absolute revenue. We build custom Next.js landing pages, implement deep CRM integrations, and write direct-response copy specifically to drive bottom-line profits."
  },
  {
    q: "Do we get access to our marketing accounts and dashboards?",
    a: "Absolutely. You own 100% of all ad accounts, creatives, and code assets we build. We provide you with a live client portal and real-time custom dashboard mapping your marketing spends directly to CRM deals closed."
  }
];

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Rotating words interval
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="w-full relative bg-background overflow-hidden select-none bg-grid-pattern">
      {/* Background glowing decorations */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-[20%] right-10 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none -z-10 animate-float-medium" />
      <div className="absolute bottom-[20%] left-10 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none -z-10 animate-float-slow" />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] lg:min-h-[100vh] flex flex-col justify-center py-20 px-6 max-w-7xl mx-auto">
        <HeroScene />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            {/* Sparkle badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs md:text-sm font-semibold shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-secondary animate-spin-slow" />
              <span>Ranked #1 Growth Agency on Awwwards Review</span>
            </motion.div>

            {/* Title with Word Rotation */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tighter leading-[1.05] text-foreground">
              We engineer <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                unrivaled
              </span>
              <br />
              <div className="h-[1.2em] relative overflow-hidden inline-block w-full">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 bottom-0 inline-block italic font-light font-heading text-foreground"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-xl leading-relaxed">
              We combine enterprise performance marketing, high-end creative branding, and Awwwards-winning code to scale your revenue exponentially. No vanity metrics. Just pure business growth.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Magnetic strength={0.2}>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full px-8 py-7 text-lg group bg-primary text-white hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto shadow-md">
                    Claim Free Audit
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link href="/services" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-border hover:bg-muted/30 transition-all duration-300 w-full sm:w-auto">
                    Explore Services
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* Hero Floating Cards Box */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[400px]">
            {/* Visual Glass Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute w-[280px] p-6 rounded-3xl bg-white/75 backdrop-blur-md border border-white/60 shadow-xl z-20 hover:scale-105 transition-transform"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+186%</span>
              </div>
              <h4 className="font-heading font-bold text-lg mb-1">Ad Revenue Lift</h4>
              <p className="text-xs text-muted-foreground mb-4">Client media budgets scaled safely from $10k to $150k monthly spend.</p>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "86%" }} transition={{ duration: 1.5, delay: 0.8 }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: 6 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute w-[260px] p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/60 shadow-2xl z-10 top-12 -left-4 hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm">Leader in SEO</h4>
                  <p className="text-[10px] text-muted-foreground">Google Core updates proof</p>
                </div>
              </div>
              <p className="text-3xl font-heading font-black text-primary">#1 Rank</p>
              <p className="text-xs text-muted-foreground mt-1">For competitive commercial terms.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY COMPANIES (LOGOS SLIDER) */}
      <section className="py-16 bg-muted/30 border-y border-border/30 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by fast-growing brands worldwide
          </p>
        </div>
        
        {/* Infinite Logo Marquee */}
        <div className="flex w-[200%] md:w-[150%] lg:w-[100%] overflow-hidden relative">
          <div className="flex gap-16 py-4 px-4 animate-marquee whitespace-nowrap">
            {logos.concat(logos).map((logo, index) => (
              <span
                key={index}
                className="text-2xl md:text-3xl font-heading font-extrabold text-muted-foreground/30 hover:text-primary/75 transition-colors select-none cursor-default"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STATISTICS DASHBOARD */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">The Proof In Numbers</h2>
            <p className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              We build campaigns that directly fuel commercial pipeline value
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="p-8 rounded-3xl bg-white border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-premium group hover:shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <h3 className="text-5xl lg:text-6xl font-heading font-black text-gradient mb-2">{stat.value}</h3>
                <h4 className="text-lg font-bold text-foreground mb-1">{stat.label}</h4>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. ABOUT PREVIEW & WHY CHOOSE US */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal direction="left">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Why Partner With Us</h2>
              <p className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground mt-3">
                Built to crush targets, not just deliver reports.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                Most agencies give you traffic metrics and report impressions. We think like co-founders. Our proprietary client model aligns our success directly with your net income and customer acquisition efficiency.
              </p>
            </ScrollReveal>

            <div className="space-y-4 mt-8">
              {[
                { title: "No Outsourcing", desc: "Our strategists and senior developers work directly in-house in the USA and Europe." },
                { title: "Revenue Guarantee Alignments", desc: "Flexible retainer models designed to keep our incentives tied directly to your sales growth." },
                { title: "Transparent Real-time Dashboards", desc: "No complex spreadsheets. Direct CRM integration showing exact leads and revenue values." }
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.1} direction="left">
                  <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-base text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse" />
            
            {[
              { icon: Zap, title: "Velocity", text: "Campaign setups and landing page creations inside 14 business days.", color: "bg-amber-50 text-amber-600 border-amber-100" },
              { icon: Globe, title: "Localization", text: "Global multi-lingual PPC strategy running in 12+ language zones.", color: "bg-blue-50 text-blue-600 border-blue-100" },
              { icon: BarChart3, title: "Predictability", text: "Advanced statistical modeling to forecast client CPA trends.", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
              { icon: Users, title: "Dedicated Team", text: "Every account is allocated a strategist and dedicated project owner.", color: "bg-purple-50 text-purple-600 border-purple-100" }
            ].map((card, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1} direction="up" className="h-full">
                <div className={`p-6 rounded-3xl bg-white border border-border shadow-premium shadow-premium-hover h-full flex flex-col justify-between`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color.split(" ")[0]} ${card.color.split(" ")[1]} border ${card.color.split(" ")[2]} mb-6`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg mb-1">{card.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 5. OUR SERVICES CARDS */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Our Core Expertise</h2>
            <p className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              Services tailored to command search, traffic, and sales
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="p-8 rounded-3xl bg-white border border-border/50 hover:border-primary/40 shadow-premium hover:shadow-xl transition-all duration-500 h-full flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{service.tag}</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
                </div>
                <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                  Learn More
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 6. MARKETING PROCESS TIMELINE */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Our Workflow</h2>
              <p className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                A simple 4-step framework built for scaling velocity
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {processSteps.map((step, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <div className="p-8 rounded-3xl bg-white border border-border/50 shadow-premium h-full flex flex-col relative">
                  <div className="text-6xl font-heading font-black text-primary/10 mb-4">{step.step}</div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PORTFOLIO & CASE STUDIES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <ScrollReveal direction="left">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Case Studies</h2>
            <p className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground max-w-xl">
              Proven case histories from scaling category leaders
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <Magnetic>
              <Link href="/contact">
                <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300">
                  Read All Case Studies
                </Button>
              </Link>
            </Magnetic>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="group rounded-3xl overflow-hidden bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-500 flex flex-col">
                <div className="h-60 relative overflow-hidden bg-muted">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 left-4 text-xs font-semibold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">{study.tag}</span>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">{study.client}</p>
                  <h3 className="font-heading font-extrabold text-2xl text-foreground group-hover:text-primary transition-colors">{study.title}</h3>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-lg font-heading font-extrabold text-emerald-600">{study.metric}</span>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 8. SEO RESULTS BEFORE/AFTER & METRICS */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="left">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Performance Metrics</h2>
              <p className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground mt-3">
                Interactive Campaign Uplifts
              </p>
              <p className="text-muted-foreground text-base leading-relaxed mt-4">
                Verify our standard client account performance results. Click on each parameter to view the typical before-and-after campaign shifts within 90 days.
              </p>
            </ScrollReveal>
            
            <div className="space-y-3">
              {beforeAfter.map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.1} direction="left">
                  <button
                    onClick={() => setActiveTab(idx)}
                    className={`w-full p-4 text-left rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                      activeTab === idx
                        ? "bg-white border-primary shadow-premium font-semibold"
                        : "bg-white/40 border-transparent hover:bg-white/70"
                    }`}
                  >
                    <span className="font-heading text-sm text-foreground">{item.title}</span>
                    <span className="text-xs font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-full">{item.change}</span>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal direction="right">
              <div className="p-8 rounded-3xl bg-white border border-border shadow-premium space-y-8 relative overflow-hidden">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <h4 className="font-heading font-bold text-lg text-foreground">{beforeAfter[activeTab].title}</h4>
                  <span className="text-xs text-muted-foreground">Typical 90-Day Velocity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-4">
                  {/* Before */}
                  <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100 text-center">
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">Before Partnering</p>
                    <p className="text-3xl font-heading font-black text-rose-600">{beforeAfter[activeTab].before}</p>
                  </div>
                  {/* After */}
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">After BuzzSpire</p>
                    <p className="text-3xl font-heading font-black text-emerald-600">{beforeAfter[activeTab].after}</p>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 animate-pulse" />
                  <p className="text-xs text-primary font-medium">
                    This represents an average organic performance shift across our portfolio. Inquire for audits of your specific accounts.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* 9. VIDEO PREVIEW SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-gradient-to-tr from-primary via-secondary to-accent p-1 overflow-hidden shadow-2xl relative">
            <div className="rounded-[2.4rem] bg-white overflow-hidden py-16 px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Interactive Video Insight</h3>
                <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground">
                  See how we scaled CapShield Finance from seed to acquisition
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Join our Lead Strategist, Marcus Vane, for a 7-minute deep-dive walkthrough outlining the exact keyword clusters and ad scripts we deployed to drive $12.4M in pipeline value inside 180 days.
                </p>
                <div className="pt-2">
                  <Link href="/contact">
                    <Button className="rounded-full bg-primary text-white font-semibold">Book Audit & Watch Full Demo</Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center relative">
                {/* Mock Video Player */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden border border-border shadow-2xl bg-muted relative group">
                  <img
                    src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80"
                    alt="Video Thumbnail"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-750"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl group-hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-none">
                      <Play className="w-6 h-6 fill-primary ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-white bg-black/60 px-2.5 py-1 rounded-full">07:22</span>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 10. TESTIMONIALS SLIDER */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Client Success Stories</h2>
              <p className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                What marketing officers and founders say about our agency
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "BuzzSpire revamped our entire ad funnel. Our CPA dropped from $120 to $38 in under two months, allowing us to double our monthly budgets safely. They are truly world-class.",
                author: "Sarah Jenkins",
                role: "VP of Marketing, FlowState SaaS",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
              },
              {
                quote: "Unlike our previous agencies, BuzzSpire integrated directly into our HubSpot CRM. Every single lead is tracked back to search keyword clusters. The level of transparency is stunning.",
                author: "Arthur Pendelton",
                role: "Founder, CapShield Finance",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
              },
              {
                quote: "The Next.js landing pages they coded load instantly. Coupled with their conversion audits, our checkout drop-offs fell by 40%. They don't just write ads; they write software.",
                author: "Mila Jovovich",
                role: "Director of Product, LuxeVibe",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              }
            ].map((t, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4 mt-8 pt-4 border-t border-border">
                    <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-foreground">{t.author}</h4>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Common Inquiries</h2>
            <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
              Frequently Asked Questions
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
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

      {/* 12. CONTACT CTA BANNER */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[3rem] bg-gradient-to-tr from-primary via-secondary to-accent p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Shapes */}
            <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-[80px] pointer-events-none -translate-x-12 -translate-y-12 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-[100px] pointer-events-none translate-x-20 translate-y-20 animate-pulse" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none">
                Ready to dominate your category?
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
                Book a confidential growth consultation with our partners today. We will audit your PPC account or SEO rankings free of charge.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Magnetic strength={0.2}>
                  <Link href="/contact">
                    <Button size="lg" className="rounded-full px-8 py-7 text-lg bg-white text-primary hover:bg-white/95 font-bold shadow-lg transition-transform w-full sm:w-auto">
                      Get My Free Audit
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-white/40 text-white hover:bg-white/10 font-bold transition-all w-full sm:w-auto">
                      View Service Packages
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
