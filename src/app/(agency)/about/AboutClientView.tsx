"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  BarChart3, 
  Layers, 
  FileText, 
  Briefcase, 
  Code2, 
  Calendar,
  CheckCircle2,
  MapPin,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// Core Principles Data
const principles = [
  {
    icon: BarChart3,
    title: "Business-First Mindset",
    description: "We don't sell SEO or ads for their own sake. Every strategy is built around what actually moves your business - more qualified leads, lower cost per acquisition, or stronger local visibility, depending on what you need most."
  },
  {
    icon: Layers,
    title: "Execution Across the Full Stack",
    description: "SEO, Google Ads, Meta Ads, website development, and branding - handled by one team that talks to each other, instead of separate vendors working in silos and blaming each other when something doesn't work."
  },
  {
    icon: FileText,
    title: "Transparent Reporting",
    description: "You get real numbers - rankings, traffic, ad spend, leads generated - not vanity metrics dressed up to look good. If something isn't working, we tell you and change the approach."
  }
];

// Timeline Data
const journeyMilestones = [
  {
    year: "2025",
    title: "2025 - Founded",
    description: "BuzzSpire Media launched in Uttam Nagar, Delhi, offering SEO, performance marketing, website development, and branding under one team, built around transparent reporting from day one."
  },
  {
    year: "2026",
    title: "2026 - Building Out",
    description: "Expanding service depth in ecommerce management and structuring content for AI-powered search (AI Overviews, ChatGPT, Perplexity) as more buyers start their research there instead of classic Google search."
  }
];

// Leadership Data
const directors = [
  {
    name: "Ritwik Sachdeva",
    role: "Director",
    image: "/team/ritwik-sachdeva.jpg",
    bio: "Leads BuzzSpire Media's overall growth strategy, client partnerships, and business development."
  },
  {
    name: "Shipra Chauhan",
    role: "Director",
    image: "/team/shipra-chauhan.jpg",
    bio: "Leads operations and campaign execution, overseeing team delivery and client outcomes across all service lines."
  },
  {
    name: "Sanjeev Kumar Malik",
    role: "Director",
    image: "/team/sanjeev-kumar-malik.jpg",
    bio: "Leads performance marketing and technical delivery - SEO, PPC, and website development strategy."
  }
];

// Technology Stack Data
const technologies = [
  { name: "Google Analytics", category: "Analytics" },
  { name: "Google Ads", category: "Advertising" },
  { name: "Meta Ads Manager", category: "Social Advertising" },
  { name: "Google Search Console", category: "SEO" },
  { name: "WordPress", category: "Website Development" },
  { name: "HubSpot CRM", category: "Automation" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Next.js", category: "Web Framework" }
];

export default function AboutClientView({ content = {} }: { content?: any }) {
  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative overflow-x-clip">
      {/* Background Ambient Lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-[35%] left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-16 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto text-center space-y-8">
        <ScrollReveal>
          <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-block">
            Our Story & Vision
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tighter leading-tight text-foreground mt-6 max-w-5xl mx-auto">
            Delhi's Digital Marketing Agency for SEO, Ads, and Web Development
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mt-6">
            BuzzSpire Media was founded in 2025 in Uttam Nagar, Delhi, to give local businesses one team for SEO, paid ads, branding, and website development - instead of juggling separate vendors for each. We're a new agency, and we're upfront about that; what we bring is focused execution and direct communication, not a decade of case studies.
          </p>
        </ScrollReveal>
      </section>

      {/* STATS BAR */}
      <section className="py-12 bg-muted/40 border-y border-border/40 my-6">
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "2025", label: "Founded" },
            { value: "5", label: "Core service lines (SEO, PPC, SMO, Web Dev, Design)" },
            { value: "100%", label: "In-house execution, no outsourced work" },
            { value: "Delhi NCR", label: "Where we operate" }
          ].map((stat, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <div className="space-y-2">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-primary">{stat.value}</h3>
                <p className="text-xs md:text-sm font-semibold text-muted-foreground max-w-[220px] mx-auto leading-snug">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 2. CORE PRINCIPLES */}
      <section className="py-24 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-block">
              Core Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground">
              How we run client work
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              At BuzzSpire Media, every campaign starts with your business goal, not a generic checklist. Three things guide how we work:
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-border/60 shadow-premium hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col h-full group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-foreground mb-3">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 3. OUR JOURNEY */}
      <section className="py-24 bg-muted/30 border-y border-border/40">
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-12">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-block">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground">
                How we got here
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {journeyMilestones.map((m, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.12}>
                <div className="p-8 md:p-10 rounded-3xl bg-white border border-border shadow-premium relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      {m.year}
                    </div>
                    <h3 className="font-heading font-extrabold text-2xl text-foreground">{m.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary mt-6 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LEADERSHIP */}
      <section className="py-24 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-block">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground">
              Meet the Directors of BuzzSpire Media
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {directors.map((director, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.12}>
              <div className="group relative rounded-[2rem] overflow-hidden bg-white border border-border shadow-premium hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                {/* Photo */}
                <div className="relative overflow-hidden bg-muted" style={{ height: '380px' }}>
                  <Image
                    src={director.image}
                    alt={director.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading font-extrabold text-2xl text-white leading-tight">{director.name}</h3>
                    <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold uppercase tracking-wider text-white/90 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Briefcase className="w-3.5 h-3.5" />
                      {director.role}
                    </span>
                  </div>
                </div>
                {/* Bio */}
                <div className="p-6 flex-1 bg-white">
                  <p className="text-sm text-muted-foreground leading-relaxed">{director.bio}</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. TECHNOLOGY STACK */}
      <section className="py-24 bg-muted/30 border-y border-border/40">
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <ScrollReveal direction="left">
                <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-block">
                  Our Technology Stack
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground mt-3">
                  Tools we use day to day
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-4">
                  We run client campaigns on Google Analytics, Google Ads, Meta Ads Manager, and Google Search Console for tracking and paid media, and build/manage websites on WordPress and Next.js with Tailwind CSS. HubSpot CRM handles lead tracking and follow-up automation.
                </p>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {technologies.map((tech, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.05} direction="right">
                  <div className="p-5 rounded-2xl bg-white border border-border/60 shadow-premium text-center hover:border-primary/40 hover:shadow-md transition-all">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-foreground">{tech.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">{tech.category}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLOSING CTA */}
      <section className="py-24 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto">
        <ScrollReveal>
          <div className="rounded-[3rem] bg-gradient-to-tr from-primary via-secondary to-accent p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter">
                Get a Free Strategy Session for Your Business
              </h2>
              <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Talk to us about your current marketing setup, what's working, and what isn't. We'll tell you honestly where the opportunity is - no generic pitch, no pressure.
              </p>
              <div>
                <Magnetic>
                  <Link href="/contact">
                    <Button size="lg" className="rounded-full px-8 py-7 text-base md:text-lg bg-white text-primary hover:bg-white/95 font-bold shadow-lg transition-transform cursor-pointer">
                      Schedule a Free Consultation
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
