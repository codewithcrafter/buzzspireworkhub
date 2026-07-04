"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Heart, 
  Target, 
  Eye, 
  Award, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  Users, 
  BookOpen, 
  CheckCircle2,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// Values list
const values = [
  { icon: Heart, title: "Obsessive Client Empathy", text: "We treat your marketing capital as our own. Every dollar spent must map back to commercial outcome." },
  { icon: Target, title: "Ruthless Execution", text: "No excuses. We optimize campaigns daily, write clean code, and ship projects with maximum velocity." },
  { icon: Eye, title: "Radical Transparency", text: "Absolute clarity. You get live dashboard access to every metric, keyword cost, and creative file." }
];

// Timeline milestones
const timeline = [
  { year: "2021", title: "The Inception", desc: "BuzzSpire was founded by three developers and media buyers aiming to replace traditional slow agencies with code-first growth workflows." },
  { year: "2023", title: "Enterprise Scaling", desc: "We scaled our first SaaS and FinTech partners past $10M in annual revenue, expanding our team to 24 local strategists." },
  { year: "2025", title: "Awwwards Recognition", desc: "Awarded 'Best Corporate Agency' and recognized for high-performance engineering achievements in Next.js development." },
  { year: "2026", title: "Global Expansion", desc: "Opened secondary office hubs in London and Singapore to service international enterprise brand networks." }
];

// Team Members
const team = [
  {
    name: "Marcus Vane",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Ex-Meta Ads engineer and growth consultant. Marcus guides the marketing architecture for BuzzSpire's enterprise client list."
  },
  {
    name: "Elena Rostova",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Awwwards jury member and brand strategist. Elena designs the visual systems and conversion layouts that define our premium feel."
  },
  {
    name: "Devon Carter",
    role: "Head of Engineering",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "Next.js core contributor and technical architect. Devon ensures our clients' landing pages achieve perfect 100/100 Core Web Vitals."
  }
];

// Technology Stack
const technologies = [
  { name: "Next.js", category: "Framework" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "HubSpot CRM", category: "Automation" },
  { name: "Google Analytics 4", category: "Measurement" },
  { name: "Meta Conversion API", category: "Tracking" },
  { name: "Salesforce Marketing Cloud", category: "Enterprise" },
  { name: "Figma", category: "Design UI/UX" }
];

export default function AboutPage() {
  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

      {/* 1. HERO BANNER */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-8">
        <ScrollReveal>
          <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
            Our Story & Vision
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter leading-none text-foreground mt-6">
            We are built to <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              outperform the status quo.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            Founded in 2021, BuzzSpire Media was created to eliminate the typical digital agency bloat. We replace bloated account managers and vague quarterly reports with direct-response media buyers, elite UI designers, and high-performance engineers.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. STATS & ACHIEVEMENTS */}
      <section className="py-16 bg-muted/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "45+", label: "Elite Growth Experts" },
            { value: "$62M+", label: "Client Revenue Generated" },
            { value: "94%", label: "Client Retainer Retention" },
            { value: "3", label: "Global Hub Locations" }
          ].map((stat, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <h3 className="text-4xl lg:text-5xl font-heading font-black text-primary mb-1">{stat.value}</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. MISSION, VISION, VALUES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="left">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Core Principles</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground mt-3">
                Values that drive campaign performance.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe marketing is a science, not a guess. We do not design websites based on personal opinion, and we do not run ads without precise statistical tracking. These core values govern every single page, line of code, and ad copy we create.
              </p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {values.map((v, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1} direction="right">
                <div className="p-6 rounded-3xl bg-white border border-border shadow-premium hover:shadow-md transition-all duration-300 flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. JOURNEY TIMELINE */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Our Journey</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
                Timeline of milestone achievements
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timeline.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-border/50 shadow-premium h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-3xl flex items-center justify-center text-primary font-heading font-extrabold text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {item.year}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mt-6 mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOUNDER MESSAGE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[3rem] bg-white border border-border shadow-premium p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[320px] aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted border border-border shadow-xl relative">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
                  alt="Marcus Vane"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Message from our Founder</span>
              <p className="font-heading font-extrabold text-2xl md:text-3xl text-foreground leading-snug">
                "Marketing isn't a cost center. It is an engineering asset. We build campaign architectures that convert attention into cash."
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our philosophy is simple: we build systems that generate customer revenue. If a marketing project doesn't drive measurable conversions, it is a decoration. We started BuzzSpire to prove that design, performance marketing, and software engineering can merge to form the ultimate business growth engine.
              </p>
              <div>
                <h4 className="font-heading font-bold text-base text-foreground">Marcus Vane</h4>
                <p className="text-xs text-muted-foreground">Founder & Managing Partner, BuzzSpire Media</p>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 6. MEET THE TEAM */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Our Strategists</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
                Meet the minds behind the growth
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="group rounded-3xl overflow-hidden bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  <div className="h-72 relative overflow-hidden bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-xl text-foreground mb-1">{member.name}</h3>
                      <p className="text-xs font-bold text-primary uppercase tracking-wide mb-4">{member.role}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TECHNOLOGY WE USE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="left">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Our Tech Stack</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground mt-3">
                Modern tools for elite media buying
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe standard templates are conversion bottlenecks. That is why we write customized software scripts and Next.js assets, integrating directly into enterprise automation ecosystems for maximum tracking fidelity.
              </p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {technologies.map((tech, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05} direction="right">
                <div className="p-5 rounded-2xl bg-white border border-border/50 shadow-premium text-center hover:border-primary/30 transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-3">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-foreground">{tech.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{tech.category}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[3rem] bg-gradient-to-tr from-primary via-secondary to-accent p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter">
                Partner with real growth specialists.
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                Schedule a confidential audit on your performance setup. Learn where your account bids are wasting budgets.
              </p>
              <div>
                <Magnetic>
                  <Link href="/contact">
                    <Button size="lg" className="rounded-full px-8 py-7 text-lg bg-white text-primary hover:bg-white/95 font-bold shadow-lg transition-transform">
                      Schedule Discovery Consultation
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
