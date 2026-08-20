import Link from "next/link";
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
  Clock,
  MousePointerClick,
  LayoutTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import ServicesHeroVisual from "@/components/services/ServicesHeroVisual";
import ServicesFaqClient from "@/components/services/ServicesFaqClient";
import ServicesFooterVisual from "@/components/services/ServicesFooterVisual";

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

export default function ServicesClientView({ content = {} }: { content?: any }) {
  const h1 = content?.h1 || "Digital Marketing Services in Delhi — Everything Under One Roof";
  const h2s = content?.h2s || {};
  const finalFaqs = (content?.faqs && content.faqs.length > 0) ? content.faqs : clientFaqs;

  return (
    <main className="w-full bg-background select-none text-foreground font-sans">
      {/* 1. HERO SECTION (2-Column Balanced) */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 max-w-7xl mx-auto border-b border-border/40 min-h-[650px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left Side: Content */}
          <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/20">
                  Buzzspire Services
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight leading-[1.15] text-foreground">
                  {h1}
                </h1>
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-muted-foreground">
                  One Team, Every Service Your Business Actually Needs
                </h2>
              </div>

              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed mt-8">
                <p className="font-semibold text-foreground">
                  Ten agencies. Ten invoices. Ten people to chase for updates.
                </p>
                <p>
                  That's what most businesses deal with when they try to cover every part of their marketing. Buzzspire runs it differently. We're a full-service digital marketing agency in Delhi, and every digital marketing services list you'd normally split across three vendors sits under one roof here. SEO, ads, design, video, your website. One team. One point of contact.
                </p>
                <p>
                  If you've been Googling a one-stop digital marketing agency in Delhi because juggling freelancers got exhausting, this is the page you were looking for.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 mt-8">
                <a href="tel:+919205386625" className="w-full sm:w-auto">
                  <Button size="lg" className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl shadow-sm hover:shadow">
                    <Phone className="w-4 h-4" />
                    <span>Call +91-9205386625</span>
                  </Button>
                </a>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold border-border hover:bg-muted transition-colors w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>WhatsApp for Free Consultation</span>
                  </Button>
                </a>
              </div>
          </div>

          {/* Right Side: Editorial "Campaign Collage" Visual */}
          <ServicesHeroVisual />
        </div>
      </section>

      {/* 2. SERVICES SECTION (Clean 3-Column Grid) */}
      <section className="py-20 md:py-24 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
              <div className="space-y-4 max-w-2xl">
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  Agency Capabilities
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground tracking-tight">
                  {h2s?.['services-grid'] || "All Digital Marketing Services"}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  Here's everything we handle. Click into any service for the full breakdown.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service: any, idx: number) => {
              const Icon = service.icon || Target;
              return (
              <ScrollReveal key={idx} delay={idx * 0.05}>
                <Link
                  href={service.href || "#"}
                  className="block h-full group bg-background border border-border/60 rounded-2xl p-8 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col h-full space-y-5">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    
                    <div className="space-y-3 flex-grow">
                      <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      <span>Explore Service</span>
                      <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )})}
          </div>

          <ScrollReveal>
            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground">Not sure where to start?</h4>
                  <p className="text-sm text-muted-foreground">
                    Call <a href="tel:+919205386625" className="text-primary hover:underline font-semibold">+91-9205386625</a> and we&apos;ll point you to the right service.
                  </p>
                </div>
              </div>
              <a href="tel:+919205386625">
                <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5">
                  Contact Us
                </Button>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. WHAT SERVICES DOES A DIGITAL MARKETING AGENCY OFFER */}
      <section className="py-20 md:py-24 px-6 max-w-7xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-sm font-bold uppercase tracking-wider text-primary">The Standard</span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground leading-tight">
                What Services Does a Digital Marketing Agency Offer
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Fair question. And most agencies don't answer it clearly. Here is exactly what we cover for our partners.
              </p>
            </div>

            <div className="lg:col-span-7 relative h-full flex flex-col justify-center py-8">
              {/* Studio Space Background Artifacts */}
              
              {/* Soft Mesh Gradient Orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[600px] bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-background/50 to-transparent blur-3xl pointer-events-none -z-10" />
              
              {/* Subtle Design Canvas Grid in top right */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
              
              {/* Camera Viewfinder Corners in bottom left */}
              <div className="absolute bottom-4 left-4 w-24 h-24 pointer-events-none -z-10 opacity-40">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-foreground/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-foreground/30" />
              </div>

              {/* Organic Card Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {serviceOfferItems.map((item: any, idx: number) => {
                  const Icon = item.icon || Zap;
                  // Organic Staggering logic (Masonry feel)
                  let translateClass = "";
                  if (idx === 0) translateClass = "sm:-translate-y-4"; // Top left pushed up
                  if (idx === 1) translateClass = "sm:translate-y-8";  // Top right pushed down
                  if (idx === 2) translateClass = "sm:-translate-y-4"; // Bottom left pushed up
                  if (idx === 3) translateClass = "sm:translate-y-8";  // Bottom right pushed down

                  return (
                    <div key={idx} className={`bg-background/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-500 group ${translateClass}`}>
                      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-300 mb-6">
                        <Icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-heading font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. DIGITAL MARKETING AGENCY WITH SEO, PPC, AND DESIGN */}
      <section className="py-20 md:py-24 px-6 max-w-7xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">The Advantage</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground leading-tight">
              Digital Marketing Agency With SEO, PPC, and Design — All in One Place
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Look, anyone can run an ad. Running one that actually pays back is a different thing entirely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureHighlights.map((feat: any, idx: number) => {
              const Icon = feat.icon || CheckCircle2;
              return (
              <div key={idx} className="bg-background border border-border/60 rounded-2xl p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            )})}
          </div>

          <div className="mt-16 bg-muted/30 border border-border/60 rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Ready to Get Started?
              </h3>
              <p className="text-base md:text-lg text-muted-foreground">
                Talk to Our Team — reply within minutes on WhatsApp.
              </p>
            </div>
            <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
              <Button size="lg" className="px-8 py-6 text-base font-semibold w-full md:w-auto flex items-center justify-center gap-2 rounded-xl shadow-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Talk to Our Team on WhatsApp</span>
              </Button>
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. STILL DECIDING? HERE'S WHAT CLIENTS USUALLY ASK (FAQS) */}
      <section className="py-20 md:py-24 bg-muted/20 border-y border-border/40">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <div className="space-y-10">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
                  Still Deciding? Here&apos;s What Clients Usually Ask
                </h2>
              </div>

              <div className="space-y-4">
                <ServicesFaqClient faqs={finalFaqs} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. GET STARTED WITH BUZZSPIRE */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="bg-background border border-border/80 rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-sm overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
              
              {/* Left Side: Existing CTA Content */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground leading-tight">
                  {h2s?.['cta'] || "Get Started with Buzzspire — All Your Marketing, One Team"}
                </h2>
                <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  <p>
                    Looking for digital marketing services in Delhi that don't require managing five different vendors?
                  </p>
                  <p className="font-semibold text-foreground">
                    That's Buzzspire services in one sentence. A full-service digital marketing agency that handles the strategy, the creative, and the execution, without passing you between departments.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <a href="tel:+919205386625" className="w-full sm:w-auto">
                    <Button size="lg" className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl shadow-sm">
                      <Phone className="w-4 h-4" />
                      <span>Call +91-9205386625 now</span>
                    </Button>
                  </a>
                  <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold border-border hover:bg-muted text-foreground transition-colors w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span>WhatsApp us for a strategy call</span>
                    </Button>
                  </a>
                </div>

                <div className="pt-4">
                  <p className="text-sm md:text-base text-muted-foreground/80 font-medium italic">
                    Your marketing, handled by one team that actually talks to each other.
                  </p>
                </div>
              </div>

              {/* Right Side: Decorative Growth Panel */}
              <ServicesFooterVisual />

            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
