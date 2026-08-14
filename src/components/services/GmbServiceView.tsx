import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Zap,
  Building2,
  Search,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceHeroVideo from "@/components/services/ServiceHeroVideo";
import ServiceFaqAccordion from "@/components/services/ServiceFaqAccordion";

const gmbFaqs = [
  {
    q: "Best Google Business Profile management agency for small business",
    a: "Look for proof, not promises. Buzzspire assigns a dedicated manager and shares real weekly numbers, which is what small Delhi business owners actually need to trust the process.",
  },
  {
    q: "How to hire an agency to manage Google Business Profile",
    a: "Start with a free audit call. We look at your listing, point out the gaps, then walk you through a Delhi-specific plan before you commit to anything.",
  },
  {
    q: "Affordable Google My Business management packages and pricing",
    a: "Pricing depends on how many locations you run and the current state of your listing. Call us for a quote built around your actual Delhi business.",
  },
  {
    q: "Google Business Profile optimization service for local businesses",
    a: "Our Google Business Profile optimization service for local businesses covers categories, photos, posts, reviews, and citations. Everything Google checks before ranking you in Delhi search results.",
  },
  {
    q: "How to rank business in Google 3-Pack local search",
    a: "It comes down to relevance, distance, and prominence. Accurate categories, consistent citations, active reviews, and regular posting all feed into it. We handle every piece for Delhi listings.",
  },
  {
    q: "Remove fake reviews from Google Business Profile service",
    a: "Yes. Our team flags reviews that break Google's policies and files removal requests with Google directly.",
  },
  {
    q: "Fix suspended Google My Business profile service",
    a: "We first find out why the suspension happened. Then we prepare and submit a reinstatement request that follows Google's guidelines properly.",
  },
  {
    q: "GMB management agency for multi-location businesses",
    a: "We manage bulk profiles under one dashboard while keeping each Delhi branch's photos, reviews, and details specific to that location.",
  },
  {
    q: "How long before I see a difference in my Google Maps ranking?",
    a: "Most Delhi listings start showing movement within 3-4 weeks — calls and direction requests both pick up first. Full ranking stabilizes over 60-90 days, depending on your area and competition.",
  },
  {
    q: "My listing already ranks decently — do I still need this?",
    a: "Yes. Even well-ranked listings slip if reviews, posts, and citations aren't maintained. We handle both growth and maintenance — this isn't a fix-it-once-and-walk-away service.",
  },
  {
    q: "Is this a one-time setup or ongoing management?",
    a: "Both. Setup happens once, but staying ranked on Google Maps is ongoing work — reviews, posts, citations all need regular attention. We handle that on a weekly basis.",
  },
  {
    q: "Why does the strategy change area to area within Delhi?",
    a: "South Delhi's competition looks nothing like Rohini or the Noida border — different search volume, different local players. That's why we build an area-specific strategy instead of running one template across the whole city.",
  },
  {
    q: "Is there a lock-in contract?",
    a: "No. It starts with a free audit call, and you decide whether to move forward after that. No long-term commitment forced on you.",
  },
];

export default function GmbServiceView() {
  return (
    <div className="w-full bg-background select-none bg-grid-pattern relative overflow-hidden">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Google Business Profile Management
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-foreground">
                Google Business Profile Management Service in Delhi
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-lg md:text-xl">
                  Your Next Customer Just Searched For You On Google — Did They Find You? Thousands of Delhi searches happen every day. Right now, your listing is either showing up first, or it&apos;s invisible.Right here, in your own city.
                </p>
                <p>
                  But if your listing isn&apos;t set up right, they never see you. They see the shop two streets down instead. That&apos;s the whole problem our Google Business Profile Management Service in Delhi was built to fix.
                </p>
                <p>
                  Buzzspire runs GMB Management Services for business owners across Connaught Place, Karol Bagh, Dwarka, Rohini, Lajpat Nagar, Nehru Place, and pretty much every corner of Delhi. Setup, verification, review handling, ranking, all under one roof.
                </p>
                <p>
                  As a Local SEO Management Agency working specifically in the Delhi market, we know how different competition looks in South Delhi versus somewhere like Rohini or Noida border areas. Our Google My Business Optimization Service is built around that difference. Not a one-size template.
                </p>
                <p className="font-medium text-foreground">
                  Whether you&apos;re a single clinic in Rajouri Garden or a chain with outlets across Delhi, our GMB Profile Optimization Services get your listing where Delhi customers can actually find it. Call now. Or drop a WhatsApp message. We&apos;ll check your listing for free.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Audit My GMB Listing — 10 Minutes, No Cost</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </div>
          
          <ServiceHeroVideo slug="google-business-profile-management-in-delhi" />
        </div>
      </section>

      {/* SECTION 1: WHY CHOOSE OUR LOCAL SEO MANAGEMENT AGENCY IN DELHI */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Why Choose Our Local SEO Management Agency in Delhi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Certified GMB Management Services Experts
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Our team has handled listings across every major Delhi micro-market. East Delhi, West Delhi, South Delhi, belt. Each one behaves differently on Google Maps, and we&apos;ve seen it firsthand.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Proven Google My Business Optimization Service Results in Delhi
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                We don&apos;t copy generic playbooks. Every move is based on what&apos;s already working for ranking businesses in your specific Delhi neighborhood. That&apos;s the core of our Google My Business Optimization Service.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Trusted GMB Profile Optimization Services Provider
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Clients stick with us because we show real numbers. Weekly. No vague talk about &quot;growth&quot; with nothing behind it.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium max-w-3xl mx-auto space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm md:text-base text-foreground items-start font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>A dedicated account manager who knows your Delhi listing inside out</span>
              </li>
              <li className="flex gap-3 text-sm md:text-base text-foreground items-start font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Transparent weekly reporting with actual local search data</span>
              </li>
              <li className="flex gap-3 text-sm md:text-base text-foreground items-start font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Clear upfront pricing, nothing added later</span>
              </li>
              <li className="flex gap-3 text-sm md:text-base text-foreground items-start font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>A 30-day results tracking window so you see the movement yourself</span>
              </li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Book a free Delhi GMB consultation. Call +91-9205386625.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 2: WHAT'S INCLUDED */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              Our Google Business Profile Management Service in Delhi - What&apos;s Included
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 border border-border/80 rounded-[2rem] p-6 sm:p-8 shadow-sm items-center sm:items-start group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center sm:text-left">Google Maps Ranking Service for Delhi Businesses</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center sm:text-left">Ranking on Google Maps in a city as dense as Delhi comes down to proximity, relevance, and prominence. Our Google Maps Ranking Service is built to strengthen all three for your exact location.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 border border-border/80 rounded-[2rem] p-6 sm:p-8 shadow-sm items-center sm:items-start group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center sm:text-left">GMB Listing Setup and Verification</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center sm:text-left">New business or shifting locations within Delhi? We handle GMB Listing Setup and Verification properly the first time. Right category, right service area, no rejected applications.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 border border-border/80 rounded-[2rem] p-6 sm:p-8 shadow-sm items-center sm:items-start group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center sm:text-left">Local Map Pack SEO for Delhi</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center sm:text-left">Getting into the top three Delhi results takes structure and consistency, not luck. Our Local Map Pack SEO work targets exactly what pushes a listing into that spot.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 border border-border/80 rounded-[2rem] p-6 sm:p-8 shadow-sm items-center sm:items-start group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center sm:text-left">Google Business Review Management</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center sm:text-left">In Delhi, one bad review can sit at the top of your profile for months if it&apos;s not managed. Our Google Business Review Management service handles responses and pushes for more genuine reviews.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 border border-border/80 rounded-[2rem] p-6 sm:p-8 shadow-sm items-center sm:items-start group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center sm:text-left">GMB Suspension Recovery Service</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center sm:text-left">Delhi listings get flagged more than people realize, especially multi-location ones. Our GMB Suspension Recovery Service finds the actual cause and files a proper reinstatement request fast.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 border border-border/80 rounded-[2rem] p-6 sm:p-8 shadow-sm items-center sm:items-start group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center sm:text-left">Local Citation Building Services</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center sm:text-left">Your business details need to match everywhere, Delhi directories included. Our Local Citation Building Services clean up mismatches that quietly drag your ranking down.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 border border-border/80 rounded-[2rem] p-6 sm:p-8 shadow-sm items-center sm:items-start group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center sm:text-left">Google Business Profile Post Management</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center sm:text-left">An inactive profile reads as abandoned, both to Google and to Delhi customers scrolling fast. Google Business Profile Post Management keeps yours active and current.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 border border-border/80 rounded-[2rem] p-6 sm:p-8 shadow-sm items-center sm:items-start group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center sm:text-left">Hyper-Local SEO Strategy for Delhi Neighborhoods</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center sm:text-left">A shop in Saket faces different competition than one in Pitampura. Our Hyper-Local SEO Strategy is built block by block, not city-wide.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 3: HOW YOUR LISTING GOES FROM INVISIBLE TO TOP 3 */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              How Your Listing Goes From Invisible To Top 3
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 01</span>
              <h3 className="text-xl font-heading font-bold text-foreground">
                Audit &amp; Analysis
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We check your current Delhi listing against nearby competitors and flag exactly where you&apos;re losing ground.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 02</span>
              <h3 className="text-xl font-heading font-bold text-foreground">
                Strategy Setup
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is where the Hyper-Local SEO Strategy takes shape, based on your specific Delhi area and category.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 03</span>
              <h3 className="text-xl font-heading font-bold text-foreground">
                Optimization &amp; Post Management
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We fix the profile itself, then keep it active with regular Delhi-relevant posts and updates.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 04</span>
              <h3 className="text-xl font-heading font-bold text-foreground">
                Reporting &amp; Growth Tracking
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Weekly numbers. Calls, direction requests, profile views. Straight data, no filler.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 4: ONE SHOP OR FIFTY */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              One Shop Or Fifty — We&apos;ve Ranked Both
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Small Businesses in Delhi
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Searching for the best Google Business Profile management agency for small business in Delhi? We keep pricing honest and results visible from the first month.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Multi-Location Brands Across Delhi
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Five outlets or fifty across Delhi? As a GMB management agency for multi-location businesses, we manage bulk listings while keeping each branch&apos;s local details accurate.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 5: WHAT THIS ACTUALLY COSTS */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              What This Actually Costs
            </h2>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 max-w-3xl mx-auto">
            <h3 className="text-xl font-heading font-bold text-foreground">
              Affordable Google My Business Management Packages and Pricing
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Our Google Business Profile Management Service in Delhi is priced by scope, not guesswork. Single-location plans start simple. Multi-location and suspension recovery work gets a custom quote after a quick audit call.
            </p>
          </div>
          <div className="text-center pt-4">
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <MessageSquare className="w-5 h-5" />
                  <span>Ask for Delhi pricing on WhatsApp or call +91-9205386625.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 6: FAQS */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <ServiceFaqAccordion faqs={gmbFaqs} />
        </ScrollReveal>
      </section>

      {/* SECTION 7: TESTIMONIALS */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Client Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 relative">
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
              <p className="text-base text-foreground italic leading-relaxed">
                &quot;We&apos;re based in Rohini and our calls barely came from Google before. That changed within six weeks of working with Buzzspire.&quot;
              </p>
              <div className="pt-2 border-t border-border/40">
                <p className="text-sm font-bold text-primary">Local business owner, Delhi</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 relative">
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
              <p className="text-base text-foreground italic leading-relaxed">
                &quot;Our profile got suspended right before a big season. They got it reinstated in under two weeks.&quot;
              </p>
              <div className="pt-2 border-t border-border/40">
                <p className="text-sm font-bold text-primary">Multi-location client, Delhi</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="google-business-profile-management-in-delhi"
        relatedSlugs={[
          "seo-services-in-delhi",
          "ppc-services-in-delhi",
          "web-development-services-in-delhi"
        ]}
      />

      {/* FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border border-border shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            {/* Subtle accent corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-foreground max-w-3xl mx-auto relative z-10">
              Get Started - Free GMB Audit for Delhi Businesses
            </h2>
            <div className="space-y-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
              <p>
                Somewhere in Delhi right now, a customer is searching for exactly what you sell. The question is whether your listing shows up first, or not at all.
              </p>
              <p className="font-semibold text-foreground">
                Buzzspire&apos;s Google Business Profile Management Service in Delhi starts with one free audit call. No commitment attached.
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Claim My Free Delhi GMB Audit</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
