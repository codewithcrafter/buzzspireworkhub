import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Search,
  Sparkles,
  Target,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import { servicesData } from "@/data/servicesData";
import { getServiceIcon } from "@/components/services/ServiceIcon";
import DigitalWallHero from "@/components/hero/DigitalWallHero";
import FaqSection from "@/components/faq/FaqSection";
import ResultsPathway from "@/components/results/ResultsPathway";
// Configurable constants
const YEARS_EXPERIENCE = "5";

// Trust Section Categories
const trustCategories = [
  "Retail Shops in West Delhi",
  "E-Commerce Brands in Delhi NCR",
  "Healthcare Clinics in Dwarka",
  "Educational Institutes in Janakpuri",
  "Local Service Businesses in Uttam Nagar",
  "Real Estate Agencies in Delhi",
  "B2B Suppliers & Distributors",
  "Restaurants & Local Cafes"
];

// 7 Points for Why Choose BuzzSpire
const whyChoosePoints = [
  {
    num: "01",
    title: "We report results, not just activity",
    desc: "Most agencies send you a report full of tasks completed. We show you what actually changed - traffic, rankings, leads - so you always know where your money is going."
  },
  {
    num: "02",
    title: "One team, every channel",
    desc: "You don't need five different vendors for SEO, ads, and design. Our team handles it all together, so your marketing actually works as one strategy instead of scattered pieces."
  },
  {
    num: "03",
    title: "We know Delhi",
    desc: "From Janakpuri to Dwarka, we understand how local customers search and shop. That local knowledge shapes every strategy we build for you."
  },
  {
    num: "04",
    title: "Straightforward pricing",
    desc: "No hidden costs, no confusing packages. We explain what you're paying for and why, in plain language, before you sign anything."
  },
  {
    num: "05",
    title: "Real people, real communication",
    desc: "You'll talk to the person actually doing your work, not just an account manager reading from a script."
  },
  {
    num: "06",
    title: "Process you can see",
    desc: "Every project starts with an audit and a plan you approve - not guesswork we figure out as we go."
  },
  {
    num: "07",
    title: "Built for small and growing businesses",
    desc: "Our digital marketing packages in Delhi are designed for businesses that need results on a real budget, not enterprise pricing for a small shop."
  }
];

// 4 Process Steps
const processSteps = [
  {
    step: "01",
    title: "Audit",
    desc: "We start by reviewing your current website, listings, and marketing - so every recommendation is based on your actual situation, not guesswork."
  },
  {
    step: "02",
    title: "Strategy",
    desc: "We build a plan around your goals and budget, and walk you through it before any work begins, so you know exactly what to expect."
  },
  {
    step: "03",
    title: "Execution",
    desc: "Our team gets to work - SEO fixes, campaigns, content, or design - with regular check-ins so you're never left wondering what's happening."
  },
  {
    step: "04",
    title: "Reporting",
    desc: "You get clear, honest reports showing what changed and why, so you can see the real impact of the work, not just a list of tasks."
  }
];

// Case Studies
const caseStudies = [
  {
    title: "A Retail Business in West Delhi",
    category: "Retail SEO & Local Search",
    location: "West Delhi",
    desc: "A local retail brand in West Delhi was struggling to show up in Google search, even for its own product names. After an SEO audit and three months of on-page and local optimization, the business started appearing on the first page for its core products. Organic website visits grew steadily, and in-store footfall from 'near me' searches picked up within the same period.",
    gradient: "from-blue-600 to-indigo-600",
    metric: "First Page Google Rank"
  },
  {
    title: "An Ecommerce Seller on Amazon and Flipkart",
    category: "Product Photography & Listings",
    location: "Delhi NCR",
    desc: "An ecommerce seller was losing sales to listings with better photos and cleaner descriptions, despite offering a similar product. We handled a full product photography shoot and reworked their marketplace listings. Within weeks, the seller saw improved click-through on their listings and fewer returns tied to unclear product images.",
    gradient: "from-purple-600 to-pink-600",
    metric: "Higher Listing Click-Through"
  },
  {
    title: "A Healthcare Clinic in Dwarka",
    category: "GMB Optimization & Reviews",
    location: "Dwarka, Delhi",
    desc: "A healthcare clinic near Dwarka had a Google Business Profile that hadn't been updated in over a year, with outdated hours and no recent reviews. We rebuilt the profile, added regular posts and set up a simple review response system. The clinic saw a noticeable increase in calls and direction requests from Google Maps within the first two months.",
    gradient: "from-emerald-600 to-teal-600",
    metric: "More Maps Calls & Directions"
  }
];

// Performance Insights (3 Cards)
const performanceInsights = [
  {
    title: "Search Visibility",
    desc: "Businesses we work with typically see their target keywords move onto the first page of Google within 3 to 6 months, depending on competition in their industry.",
    icon: Search,
    badge: "Organic SEO"
  },
  {
    title: "Local Discovery",
    desc: "An active, complete Google Business Profile with regular reviews and posts consistently performs better in local search and Google Maps results than a static, outdated one.",
    icon: MapPin,
    badge: "Google Maps"
  },
  {
    title: "Ad Efficiency",
    desc: "Well-targeted Google Ads campaigns, reviewed and adjusted regularly, tend to lower cost per click over time while improving the quality of leads coming in.",
    icon: TrendingUp,
    badge: "Paid Search"
  }
];

// Testimonials
const testimonials = [
  {
    quote: "We used to think our website just wasn't meant to rank. Once they explained what was actually wrong with it, in plain language, it made sense - and we started seeing customers find us on Google.",
    role: "Retail business owner, West Delhi",
    initials: "RW"
  },
  {
    quote: "I liked that they didn't just say 'trust the process.' Every month I got a report that actually told me what changed and why.",
    role: "Ecommerce seller, Delhi NCR",
    initials: "ED"
  },
  {
    quote: "Our Google listing was a mess before this. Now people actually call us after finding us on Maps, which almost never happened before.",
    role: "Clinic owner, Dwarka",
    initials: "CD"
  }
];

// 8 FAQs for Homepage
const faqs = [
  {
    q: "How can I improve my business's ranking on Google Maps?",
    a: "Improving your Google Maps ranking mainly comes down to a complete, active, and well-reviewed business profile. This means accurate business hours, photos, categories, and regular posts, along with genuine customer reviews and quick responses to them. Our google business profile management Delhi service handles this setup and upkeep, so your business shows up when nearby customers search."
  },
  {
    q: "How much does SEO cost in Delhi?",
    a: "SEO pricing in Delhi typically depends on your website size, industry competition, and how fast you want results. Most small to mid-sized businesses start with a monthly plan that covers audits, on-page fixes, content, and reporting. We offer a free digital audit first, so you know exactly what's needed before committing to a plan."
  },
  {
    q: "What's the best way to get more customers from Google Maps?",
    a: "The best way to get more customers from Google Maps is keeping your business profile accurate, active, and full of genuine reviews. Businesses that post updates, respond to reviews, and keep their hours and photos current consistently rank higher in local search results. This is the core of what our local seo service focuses on."
  },
  {
    q: "How do I manage social media for a small business without a big team?",
    a: "Managing social media for a small business comes down to a simple, consistent content calendar rather than posting randomly. Planning content in advance, focusing on a few platforms instead of all of them, and tracking what actually gets engagement makes it manageable. Our smo services Delhi are built specifically for small teams that don't have time to manage this daily."
  },
  {
    q: "How do I run Google Ads for a local business?",
    a: "Running Google Ads for a local business starts with targeting the specific searches your customers use, not broad keywords. Setting a realistic ad spend, writing clear ad copy, and reviewing performance weekly keeps costs under control. Our sem services Delhi handle this setup and ongoing management so your ad spend goes toward real leads."
  },
  {
    q: "Who manages Amazon and Flipkart seller accounts in Delhi?",
    a: "Amazon and Flipkart seller accounts are usually managed by a dedicated ecommerce management team handling listings, inventory, and order updates. This keeps your marketplace presence accurate and reduces errors that can hurt your seller rating. Our ecommerce management services cover amazon flipkart account management Delhi for sellers who don't have time to manage it themselves."
  },
  {
    q: "How much does a website cost in Delhi?",
    a: "Website costs in Delhi vary based on the number of pages, design complexity, and features like ecommerce or booking systems. A simple business website costs less than a full online store with product management. As a web development company Delhi businesses trust for clear pricing, we quote based on what you actually need, not a fixed package."
  },
  {
    q: "How do I design a logo for a new business?",
    a: "Designing a logo for a new business starts with understanding what the business stands for, not just picking colours and fonts. A good design process includes research into your industry and audience before any visuals are created. Our logo design services follow this approach, so your logo actually reflects your business rather than looking generic."
  }
];

export default async function HomePage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BuzzSpire Media",
    "url": "https://buzzspiremedia.com",
    "description": "BuzzSpire Media is a digital marketing agency in Delhi NCR helping local businesses show up on Google, grow social presence, and win more customers.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Delhi",
      "addressRegion": "Delhi NCR",
      "addressCountry": "IN"
    },
    "areaServed": ["Delhi", "West Delhi", "Dwarka", "Janakpuri", "Uttam Nagar", "Delhi NCR"]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <main className="w-full relative bg-background overflow-x-clip select-none bg-grid-pattern">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Background glowing decorations */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-[20%] right-10 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none -z-10 animate-float-medium" />
      <div className="absolute bottom-[20%] left-10 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none -z-10 animate-float-slow" />

      {/* 1. HERO SECTION (INTERACTIVE DIGITAL WALL) */}
      {/* 1. HERO SECTION (INTERACTIVE DIGITAL WALL) */}
      <DigitalWallHero />

      {/* 2. TRUST SECTION */}
      <section className="py-16 bg-muted/30 border-y border-border/30 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-sm font-semibold text-foreground max-w-2xl mx-auto leading-relaxed">
            Trusted by retail, ecommerce, healthcare, education, and local service businesses across Delhi NCR.
          </p>
        </div>

        {/* Infinite Marquee */}
        <div className="flex w-[200%] md:w-[150%] lg:w-[100%] overflow-hidden relative">
          <div className="flex gap-8 md:gap-12 py-3 px-4 animate-marquee whitespace-nowrap">
            {trustCategories.concat(trustCategories).map((cat, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-border/60 text-xs md:text-sm font-heading font-bold text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors shadow-sm cursor-default select-none"
              >
                <Building2 className="w-4 h-4 text-primary/70 shrink-0" />
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. REDESIGNED PREMIUM RESULTS SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                RESULTS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-[1.12]">
                Real Numbers. Real Progress.
              </h2>
              <div className="text-sm md:text-base text-muted-foreground leading-relaxed space-y-4 pt-2">
                <p>
                  We measure our work the same way you measure yours - by real numbers, not promises.
                </p>
                    <p>
                      Over 5+ years, we've helped businesses across Delhi improve their Google visibility, grow their social following, and turn more website visitors into paying customers.
                    </p>
                    <p>
                      We're honest about timelines because that's how digital marketing actually works - no shortcuts, no guarantees, just consistent effort that adds up.
                    </p>
              </div>
            </div>

            {/* Right Growth Pathway Visualization */}
            <div className="lg:col-span-6">
              <ResultsPathway />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. WHY CHOOSE BUZZSPIRE (7 POINTS) */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Why Choose Us</span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Why Businesses Across Delhi Partner With BuzzSpire Media
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Clear communication, local Delhi insights, and straightforward marketing built for real business growth.
              </p>
            </div>
          </ScrollReveal>

          {/* 7 Responsive Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoosePoints.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.08} className="h-full">
                <div className="p-8 rounded-3xl bg-white border border-border/60 hover:border-primary/40 shadow-premium hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-heading font-black text-primary/30 group-hover:text-primary transition-colors">
                        {item.num}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION (ALL 10 SERVICES LINKING TO DEDICATED PAGES) */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Full-Spectrum Digital Services
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              Our 10 Digital Marketing Services in Delhi
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Every service is structured around your real business objectives. Click any service card to view its dedicated page.
            </p>
          </div>
        </ScrollReveal>

        {/* 10 Services Grid linking to /services/[slug] */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, idx) => {
            const IconComponent = getServiceIcon(service.iconName);
            return (
              <ScrollReveal key={service.slug} delay={idx * 0.05}>
                <div className="p-8 rounded-3xl bg-white border border-border/60 hover:border-primary/40 shadow-premium hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {service.tag}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6">
                      {service.shortDesc}
                    </p>
                  </div>

                  <Link
                    href={`/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-secondary transition-colors text-left"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 6. PROCESS SECTION (4 STEPS) */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">How We Work</span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Our 4-Step Marketing Process
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                A simple, clear workflow with zero guesswork from day one.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {processSteps.map((step, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.12}>
                <div className="p-8 rounded-3xl bg-white border border-border/60 shadow-premium h-full flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
                  <div>
                    <div className="text-5xl font-heading font-black text-primary/20 group-hover:text-primary/40 transition-colors mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">{step.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CASE STUDIES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <ScrollReveal direction="left">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Real Results
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground max-w-xl mt-3">
              Local Case Histories Across Delhi
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <Magnetic>
              <Link href="/contact">
                <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300">
                  Discuss Your Project
                </Button>
              </Link>
            </Magnetic>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="group rounded-3xl overflow-hidden bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-500 flex flex-col h-full justify-between">
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full">
                      {study.location}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">{study.category}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {study.desc}
                  </p>
                </div>
                <div className="p-8 pt-0 border-t border-border/40 mt-4 flex items-center justify-between">
                  <span className="text-sm font-heading font-extrabold text-emerald-600">{study.metric}</span>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 8. PERFORMANCE INSIGHTS (3 CARDS) */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Performance Insights</span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                What You Can Expect From Our Marketing Strategy
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Realistic growth expectations based on consistent, data-driven execution.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {performanceInsights.map((insight, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <insight.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">
                        {insight.badge}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                      {insight.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {insight.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>



      {/* 10. TESTIMONIALS */}
      <section className="py-24 bg-muted/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Client Feedback</span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                What Local Business Owners Say
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Real feedback from businesses working with us across West Delhi and Delhi NCR.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-8 pt-4 border-t border-border">
                    <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-heading font-bold flex items-center justify-center shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-foreground">{t.role}</h4>
                      <p className="text-xs text-muted-foreground">Delhi NCR Client</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <FaqSection faqs={faqs} />

      {/* 12. READY TO GROW EDITORIAL CTA SECTION */}
      <section className="py-28 px-6 border-t border-border/40 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left Column: Heading with thin purple accent line */}
              <div className="lg:col-span-5 border-l-4 border-secondary pl-6 md:pl-8 py-1">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.08]">
                  Ready to Grow?
                </h2>
              </div>

              {/* Right Column: Description + Button aligned naturally */}
              <div className="lg:col-span-7 space-y-8">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans max-w-xl">
                  You don't need ten different vendors and a confusing dashboard to grow your business online. You need a team that understands Delhi, explains things clearly, and shows you real results not just activity. Whether you're just getting started or ready to scale, our digital marketing packages in Delhi are built to fit your business and your budget.
                </p>

                <div>
                  <Magnetic strength={0.2}>
                    <Link href="/contact" className="inline-block">
                      <Button size="lg" className="rounded-full px-8 py-6 text-base font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-all border-0">
                        Get Started Today
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
