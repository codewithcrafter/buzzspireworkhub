"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Target,
  Share2,
  MapPin,
  ShoppingBag,
  Palette,
  Camera,
  Video,
  Code,
  Phone,
  MessageSquare,
  ArrowUpRight,
  HelpCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  BarChart3,
  CreditCard,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// 10 Core Services mapped to production URLs
const allServices = [
  {
    title: "SEO Services",
    desc: "Rankings that hold past the next algorithm update. Built on real keyword research and search intent.",
    href: "/seo-services-in-delhi",
    icon: Search,
  },
  {
    title: "PPC / SEM Services",
    desc: "Paid campaigns that get tracked back to actual leads, not just clicks.",
    href: "/ppc-services-in-delhi",
    icon: TrendingUp,
  },
  {
    title: "Social Media Marketing (SMM)",
    desc: "Content and ads that build a following people actually engage with.",
    href: "/social-media-marketing-services-in-delhi",
    icon: Target,
  },
  {
    title: "Social Media Optimization (SMO)",
    desc: "Profiles built to convert visitors into followers, and followers into customers.",
    href: "/smo-services-in-delhi",
    icon: Share2,
  },
  {
    title: "Google Business Profile Management",
    desc: "Show up first on Google Maps when someone nearby searches for what you sell.",
    href: "/google-business-profile-management-in-delhi",
    icon: MapPin,
  },
  {
    title: "Ecommerce Management",
    desc: "Listings, ads, and order flow handled so your store runs without you babysitting it daily.",
    href: "/ecommerce-management-services-in-delhi",
    icon: ShoppingBag,
  },
  {
    title: "Graphic Design",
    desc: "Logos, social posts, and brand kits that actually look like they belong to the same business.",
    href: "/graphic-design-services-in-delhi",
    icon: Palette,
  },
  {
    title: "Product Photography",
    desc: "Clean, high-converting shots that make your listings stand out from the competition.",
    href: "/product-photography-services-in-delhi",
    icon: Camera,
  },
  {
    title: "Video Editing",
    desc: "Raw footage turned into scroll-stopping content, fast turnaround included.",
    href: "/video-editing-services-in-delhi",
    icon: Video,
  },
  {
    title: "Website Development Services",
    desc: "Fast, mobile-friendly sites built to convert, not just to look good.",
    href: "/web-development-services-in-delhi",
    icon: Code,
  },
];

// What Services Offer items
const serviceOfferItems = [
  {
    title: "Digital Marketing Company Services",
    desc: "At the core, a digital marketing company handles everything that gets you found online and turns that visibility into calls. SEO, paid ads, social, and content, working as one system instead of separate silos.",
    icon: Zap,
  },
  {
    title: "Online Marketing Services in Delhi",
    desc: "Delhi's market moves fast. Online marketing services here need local search behavior baked in, not a generic national template copy-pasted for your city.",
    icon: MapPin,
  },
  {
    title: "Creative & Marketing Services Agency",
    desc: "Strategy without creative falls flat. Creative without strategy just looks pretty. We run as a creative & marketing services agency because you genuinely need both, working together, not in separate departments that don't talk.",
    icon: Palette,
  },
  {
    title: "Digital Marketing Agency With In-House Design and Video Team",
    desc: "Here's a detail worth knowing. Most agencies outsource design and video to freelancers. We don't. We're a digital marketing agency with an in-house design and video team, so your brand's visuals stay consistent across every channel, every time.",
    icon: Video,
  },
];

// Unique Selling Proposition features
const featureHighlights = [
  {
    title: "Dedicated Account Manager",
    desc: "Every client gets one person to call. Not a rotating support inbox. Not a different rep every month.",
    icon: Users,
  },
  {
    title: "Transparent Weekly Reporting",
    desc: "Real campaign numbers, every week. Not a PDF that shows up once a month with vague summaries.",
    icon: BarChart3,
  },
  {
    title: "Upfront Clear Pricing",
    desc: "You'll know the cost before you commit. No hidden management fees buried in the fine print.",
    icon: CreditCard,
  },
  {
    title: "30-Day Results Tracking Guarantee",
    desc: "You shouldn't wait a full quarter to know if something's working. Our 30-day results tracking guarantee means you see direction fast.",
    icon: Clock,
  },
];

// FAQs provided by user
const clientFaqs = [
  {
    q: "Do I need to hire multiple agencies for different services?",
    a: "No. That's honestly the whole point of working with us. One team handles SEO, ads, design, and your website, so nothing falls through the cracks between vendors.",
  },
  {
    q: "Can I start with just one service and add more later?",
    a: "Yes. Most clients start with one or two services, see results, then expand. There's no requirement to buy everything upfront.",
  },
  {
    q: "How does one team handle SEO, design, and ads together?",
    a: "Because they're not separate teams pretending to collaborate. Your SEO strategist, ad manager, and designer sit on the same account, working off the same data.",
  },
];

export default function ServicesClientView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative overflow-hidden">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* 1. HERO HEADER */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
        <ScrollReveal>
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
            Buzzspire Services
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tighter leading-tight text-foreground mt-6">
            Digital Marketing Services in Delhi — Everything Under One Roof
          </h1>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary max-w-3xl mx-auto mt-4">
            One Team, Every Service Your Business Actually Needs
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            <p className="font-semibold text-foreground">
              Ten agencies. Ten invoices. Ten people to chase for updates.
            </p>
            <p>
              That&apos;s what most businesses deal with when they try to cover every part of their marketing.
            </p>
            <p>
              Buzzspire runs it differently. We&apos;re a full-service digital marketing agency in Delhi, and every digital marketing services list you&apos;d normally split across three vendors sits under one roof here. SEO, ads, design, video, your website. One team. One point of contact.
            </p>
            <p>
              If you&apos;ve been Googling a one-stop digital marketing agency in Delhi because juggling freelancers got exhausting, this is the page you were looking for.
            </p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>Call +91-9205386625</span>
                </Button>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>WhatsApp for Free Consultation</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. WHAT SERVICES DOES A DIGITAL MARKETING AGENCY OFFER */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              What Services Does a Digital Marketing Agency Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fair question. And most agencies don&apos;t answer it clearly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceOfferItems.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-border/80 hover:border-primary/40 shadow-premium transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 3. ALL DIGITAL MARKETING SERVICES (GRID) */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-foreground">
              All Digital Marketing Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here&apos;s everything we handle. Click into any service for the full breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-border/70 hover:border-primary/40 shadow-premium hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-border/40">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-secondary transition-colors"
                  >
                    <span>View Service Details</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-lg font-semibold text-foreground">
              Not sure where to start? Call <a href="tel:+919205386625" className="text-primary underline font-bold">+91-9205386625</a> and we&apos;ll point you to the right service.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. DIGITAL MARKETING AGENCY WITH SEO, PPC, AND DESIGN — ALL IN ONE PLACE */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground max-w-4xl mx-auto leading-tight">
              Digital Marketing Agency With SEO, PPC, and Design — All in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Look, anyone can run an ad. Running one that actually pays back is a different thing entirely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {featureHighlights.map((feat, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground">
                  {feat.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-primary text-white text-center space-y-6 shadow-xl max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold">
              Ready to Get Started?
            </h3>
            <p className="text-base md:text-lg text-white/90">
              Talk to Our Team — reply within minutes on WhatsApp.
            </p>
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-white text-emerald-700 hover:bg-white/95 font-bold shadow-lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>Talk to Our Team on WhatsApp</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. STILL DECIDING? HERE'S WHAT CLIENTS USUALLY ASK (FAQS) */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Still Deciding? Here&apos;s What Clients Usually Ask
            </h2>
          </div>

          <div className="space-y-4">
            {clientFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-border/80 rounded-2xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left font-heading font-bold text-base md:text-lg text-foreground hover:text-primary flex justify-between items-center focus:outline-none transition-colors"
                  >
                    <h3 className="pr-4">{faq.q}</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
                      {isOpen ? "Close" : "Read Answer"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-6 pt-0 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-border/30">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* 6. GET STARTED WITH BUZZSPIRE — ALL YOUR MARKETING, ONE TEAM */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-border/60">
        <ScrollReveal>
          <div className="rounded-[3rem] bg-gradient-to-tr from-primary via-secondary to-accent p-10 md:p-16 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl space-y-8 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter leading-tight">
              Get Started with Buzzspire — All Your Marketing, One Team
            </h2>
            <div className="space-y-4 text-base md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              <p>
                Looking for digital marketing services in Delhi that don&apos;t require managing five different vendors?
              </p>
              <p className="font-semibold text-white">
                That&apos;s Buzzspire services in one sentence. A full-service digital marketing agency that handles the strategy, the creative, and the execution, without passing you between departments.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Magnetic>
                <a href="tel:+919205386625">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-white text-primary hover:bg-white/95 font-bold shadow-lg flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>Call +91-9205386625 now</span>
                  </Button>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base border-white text-white hover:bg-white/10 font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Or WhatsApp us for a free strategy call</span>
                  </Button>
                </a>
              </Magnetic>
            </div>

            <p className="text-sm md:text-base text-white/80 font-medium italic pt-4">
              Your marketing, handled by one team that actually talks to each other.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
