"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Target,
  Eye,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// Values list
const values = [
  {
    icon: Heart,
    title: "Business-First Mindset",
    text: "Every strategy begins with your goals. We create digital marketing solutions that maximize ROI, generate qualified leads, and support long-term business growth."
  },
  {
    icon: Target,
    title: "Excellence in Execution",
    text: "From SEO and performance marketing to website development and branding, we deliver every project with precision, quality, and measurable results."
  },
  {
    icon: Eye,
    title: "Full Transparency",
    text: "We believe in honest communication, transparent reporting, and real-time insights, giving you complete confidence in every marketing decision."
  }
];

// Timeline milestones
const timeline = [
  { year: "2021", title: "Our Vision", desc: "Delivering innovative digital marketing solutions that help businesses build a stronger online presence and achieve measurable growth." },
  { year: "2023", title: "Digital Solutions", desc: "Providing SEO, performance marketing, website development, branding, and creative services under one trusted partner." },
  { year: "2025", title: "Client Commitment", desc: "Creating customized strategies focused on transparency, quality, measurable results, and long-term business success." },
  { year: "2026", title: "What's Next", desc: "Continuing to innovate, adapt, and empower businesses with cutting-edge digital solutions and growth-focused strategies." }
];

// Team Members
const team = [
  {
    name: "Marcus Vane",
    role: "Digital Marketing Strategist",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "SEO, performance marketing, and business growth specialist dedicated to creating data-driven strategies that generate qualified leads and measurable results."
  },
  {
    name: "Elena Rostova",
    role: "Creative Design Specialist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Expert in branding, UI/UX design, and visual storytelling, creating impactful digital experiences that strengthen brand identity and engagement."
  },
  {
    name: "Devon Carter",
    role: "Web Development Expert",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "Skilled in website development, performance optimization, and user experience, building fast, responsive, and conversion-focused digital solutions."
  }
];

// Technology Stack
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

export default function AboutClientView() {
  const heroBadge = "Our Story & Vision";
  const heroHeading = "Empowering Businesses";
  const heroDesc = "Established in 2026, BuzzSpire Media was built to transform ambitious ideas into measurable success. By combining SEO, performance marketing, branding, website development, and creative strategy, we help businesses strengthen their digital presence and achieve sustainable growth.";

  const storyHeading = "Core Principles";
  const storyDesc = "At BuzzSpire Media, every decision is driven by purpose, performance, and innovation. From SEO and performance marketing to website development and branding, we create data-driven digital solutions that deliver measurable results, build lasting relationships, and help businesses grow with confidence.";

  const ctaHeading = "Partner with Digital Growth Experts.";
  const ctaDesc = "Book a free consultation with BuzzSpire Media to explore customized SEO, performance marketing, branding, and website development solutions designed to grow your business and deliver measurable results.";
  const ctaText = "Schedule a Free Consultation";
  const ctaUrl = "/contact";

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

      {/* 1. HERO BANNER */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-8">
        <ScrollReveal>
          <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
            {heroBadge}
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter leading-none text-foreground mt-6">
            {heroHeading}<br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Through Digital Excellence.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            {heroDesc}
          </p>
        </ScrollReveal>
      </section>

      {/* 2. STATS & ACHIEVEMENTS */}
      <section className="py-16 bg-muted/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "2026", label: "FOUNDED" },
            { value: "360°", label: "DIGITAL MARKETING SERVICES" },
            { value: "100%", label: "TRANSPARENT APPROACH" },
            { value: "RESULTS", label: "DRIVEN GROWTH" }
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
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">{storyHeading}</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground mt-3">
                The foundation of every successful digital campaign.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {storyDesc}
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
                Empowering Businesses Through Digital Excellence.
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
                <Image
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
                  alt="Marcus Vane"
                  width={320}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Message from our Founder</span>
              <p className="font-heading font-extrabold text-2xl md:text-3xl text-foreground leading-snug">
                "Every successful business deserves a digital strategy that inspires growth, builds trust, and delivers measurable results."
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                BuzzSpire Media was founded with a clear vision—to help businesses grow through innovative digital marketing, creative branding, website development, and data-driven strategies. We believe in building long-term partnerships, delivering transparent solutions, and creating meaningful results that support sustainable business growth.
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
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Our Expert Teams</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground">
                Meet the professionals driving your digital success
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="group rounded-3xl overflow-hidden bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  <div className="h-72 relative overflow-hidden bg-muted">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={400}
                      height={288}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
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
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">OUR TECHNOLOGY STACK</h2>
              <p className="text-4xl font-heading font-extrabold tracking-tight text-foreground mt-3">
                Powered by industry-leading tools for digital growth
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We leverage trusted marketing, analytics, design, SEO, and web development platforms to create data-driven strategies, optimize campaign performance, improve user experiences, and deliver measurable business results.
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
                {ctaHeading}
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                {ctaDesc}
              </p>
              <div>
                <Magnetic>
                  <Link href={ctaUrl}>
                    <Button size="lg" className="rounded-full px-8 py-7 text-lg bg-white text-primary hover:bg-white/95 font-bold shadow-lg transition-transform">
                      {ctaText}
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
