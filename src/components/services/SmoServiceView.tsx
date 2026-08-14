import Link from "next/link";
import {
  Share2,
  CheckCircle2,
  MapPin,
  Sparkles,
  MessageSquare,
  Phone,
  ArrowUpRight,
  Zap,
  Building2,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Clock
} from "lucide-react";
import { Instagram, Facebook, Linkedin } from "@/components/ui/social-icons";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceHeroVideo from "@/components/services/ServiceHeroVideo";
import ServiceFaqAccordion from "@/components/services/ServiceFaqAccordion";

const smoFaqs = [
  {
    q: "What are the best SMO services for small businesses?",
    a: "Profile optimization, a consistent content calendar, and community engagement. That combination gets small businesses visible without burning through an ad budget.",
  },
  {
    q: "Do you offer affordable Social Media Optimization packages?",
    a: "Yes. We build packages around your budget and goals, not a fixed one-size-fits-all rate.",
  },
  {
    q: "Do you provide social media optimization services in Delhi?",
    a: "We do. Delhi is our base market, and we cover it end to end, South, West, East, North, the works.",
  },
  {
    q: "Which SMO agency in Delhi should I choose for local reach?",
    a: "Pick one that actually understands your neighborhood's audience, not just national trends. That's the gap Buzzspire's SMO Services in Delhi fills. We build content around what people in your part of the city actually respond to.",
  },
  {
    q: "How do you increase organic reach on social media?",
    a: "Through consistent posting, platform-specific content, real engagement, and profile optimization that keeps people on your page longer.",
  },
  {
    q: "What's the difference between SMO and SMM services?",
    a: "SMO focuses on organic growth through profile and content optimization. SMM typically includes paid promotion and broader campaign strategy.",
  },
  {
    q: "How long before I see results from SMO?",
    a: "Most clients start seeing engagement improvements within 30 days. But real organic growth - the kind that brings leads - usually takes 60 to 90 days of consistent work. We track everything weekly so you know where you stand.",
  },
  {
    q: "Do I need to sign a long-term contract?",
    a: "No. We work on monthly retainers. If you're not happy, you're not locked in. But honestly, most clients stick around because they see the numbers moving.",
  },
  {
    q: "Can you handle SMO for multiple locations?",
    a: "Absolutely. If you have branches or serve multiple areas across Delhi, we build location-specific content strategies for each. One brand, multiple local voices.",
  },
  {
    q: "What platforms do you optimize for?",
    a: "Instagram, Facebook, LinkedIn, Twitter/X, and Pinterest. We also handle YouTube channel optimization if video is part of your content strategy.",
  },
];

export default function SmoServiceView() {
  return (
    <div className="w-full bg-background select-none bg-grid-pattern relative overflow-hidden">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Social Media Optimization
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-foreground">
                SMO Services in Delhi That Actually Grow Your Brand
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-lg md:text-xl">
                  Your Pages Get Likes. They Don&apos;t Get Leads. That&apos;s The Problem We Fix. That&apos;s where a real SMO (Social Media Optimization) service comes in.
                </p>
                <p>
                  At Buzzspire, we run SMO Services in Delhi for brands tired of posting into silence. We&apos;re a Social Media Optimization agency in Delhi built around one idea. Your profiles should work as hard as your sales team does. Not just look good. Actually convert.
                </p>
                <p>
                  We&apos;re not another SMO Agency in Delhi throwing hashtags at a wall. We track numbers. We report weekly. And we fix what isn&apos;t working, fast.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Get My Free Page Audit — 10 Minutes, No Pitch</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </div>
          
          <ServiceHeroVideo slug="smo-services-in-delhi" />
        </div>
      </section>

      {/* 2. WHAT IS SMO, REALLY? */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            What Is SMO, Really?
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>
              SMO stands for Social Media Optimization. It&apos;s the process of shaping your social profiles, content, and engagement so they attract the right audience organically.
            </p>
            <p className="font-bold text-foreground text-lg">
              Not paid ads. Organic pull.
            </p>
            <p>
              Think of it as SEO, but for Instagram, Facebook, and LinkedIn. Better bios. Better visuals. Better posting rhythm. Real conversations instead of one-way broadcasts.
            </p>
            <p>
              As a Social Media Optimization agency, that&apos;s our whole game. We don&apos;t just manage pages. We optimize them.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. WHY BUSINESSES CHOOSE OUR SMO AGENCY */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Why Businesses Choose Our SMO Agency
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground">
              Here&apos;s the deal. Most agencies post and pray.
            </p>
            <p className="font-bold text-primary">
              We don&apos;t.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-sm space-y-2">
                <h3 className="font-bold text-foreground text-base">Dedicated Account Manager</h3>
                <p className="text-sm">Every client gets a dedicated account manager. Someone who actually knows your brand, not a rotating cast of strangers.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-sm space-y-2">
                <h3 className="font-bold text-foreground text-base">30-Day Tracking Window</h3>
                <p className="text-sm">You also get a 30-day results tracking window. We watch the numbers from day one and adjust course early, not three months in.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-sm space-y-2">
                <h3 className="font-bold text-foreground text-base">Upfront Clear Pricing</h3>
                <p className="text-sm">And pricing? Upfront. Clear. No surprise line items buried in a PDF nobody reads.</p>
              </div>
            </div>
            <p className="font-bold text-foreground text-center pt-4 text-xl">
              That&apos;s why brands call us the Best SMO Services Agency in Delhi.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. OUR CORE SMO SERVICES */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              Our Core SMO Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We keep this simple. Here&apos;s exactly what falls under our SMO Marketing Services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-2">
              <h3 className="text-xl font-heading font-bold text-foreground">Organic Social Media Optimization</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                We build your organic reach the honest way. No bots. No fake followers. Just content that people actually want to engage with.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4">
              <h3 className="text-xl font-heading font-bold text-foreground">Social Media Profile Optimization</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Your bio, your highlights, your pinned posts, your link-in-bio setup. Small details. Big impact on conversions.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4">
              <h3 className="text-xl font-heading font-bold text-foreground">Social Media Management</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Daily posting. Community replies. Content calendars that don&apos;t fall apart by week two. We handle the grind so you don&apos;t have to.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-2 lg:mt-8">
              <h3 className="text-xl font-heading font-bold text-foreground">Social Media Audit Services</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Before we touch anything, we look at what&apos;s already there. What&apos;s working. What&apos;s dead weight. You get a clear picture, not guesswork.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Social Media Strategy Development</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                Every brand gets a plan built around its actual goals, not a copy-paste template we reuse for everyone.
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg">
                  Show Me What&apos;s Missing From My Pages
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. SMO SERVICES FOR EVERY KIND OF BUSINESS */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              SMO Services for Every Kind of Business
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Startups need something different than a ten-year-old retail brand. We get that.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                SMO Services for Business / Startups
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Fresh brand, tight budget, big ambitions. We build visibility from scratch, with content that earns trust fast.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Local SMO Services
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Running a shop, clinic, or restaurant in your city? Local SMO puts you in front of people nearby who are already searching for what you sell.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                E-commerce Social Media Optimization
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Product tags, shoppable posts, reviews woven into your feed. Every scroll becomes a chance to sell.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                B2B Social Media Optimization Strategy
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                LinkedIn-first thinking. Thought leadership content. The kind of posts that get you into decision-makers&apos; feeds, not just likes from your own team.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. PLATFORM-SPECIFIC OPTIMIZATION */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Platform-Specific Optimization
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every platform behaves differently. We treat them that way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                Instagram Profile Optimization
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reels strategy, story highlights, bio links that convert browsers into buyers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                Facebook Page Optimization
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Business info, reviews, messaging setup, page categories. The stuff people check before they trust you.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Linkedin className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                LinkedIn Business Page Optimization
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Agency page structure, employee advocacy, content that positions you as the go-to name in your industry.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. AREAS WE SERVE ACROSS DELHI */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-foreground">
              Areas We Serve Across Delhi
            </h2>
            <div className="space-y-1 text-lg text-muted-foreground max-w-2xl mx-auto">
              <p>We don&apos;t chase clients across five states.</p>
              <p className="font-semibold text-foreground">Delhi&apos;s home turf. We know it street by street.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                South Delhi
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vasant Kunj. Saket. Lajpat Nagar. Greater Kailash. These areas have a different pulse. The audience here expects polished content, premium positioning, and brand storytelling that doesn&apos;t feel salesy. We&apos;ve run campaigns for clinics in GK, fashion brands in Saket, and real estate pages in Vasant Kunj. Each one needed a different voice. We built it.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                West Delhi
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dwarka. Rajouri Garden. Punjabi Bagh. The crowd here scrolls fast. You have 2 seconds to stop the thumb. We create hook-first content for West Delhi brands. Reels that open with a bang. Carousels that don&apos;t waste the first slide. That&apos;s how we get attention here.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                East Delhi
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Preet Vihar. Laxmi Nagar. Mayur Vihar. This side of the city is hungry for value-driven content. How-to posts. Local offers. Community engagement that feels personal, not corporate. We&apos;ve helped local shops and coaching centers in East Delhi build followings that actually walk through their doors.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                North Delhi
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rohini. Pitampura. Model Town. Karol Bagh. North Delhi has its own rhythm. Mix of old-school trust and new-age finding. We balance both. Traditional business language for the older crowd. Trending formats for the younger one. One page, two audiences, handled right.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3 lg:col-span-2">
              <h3 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Central Delhi
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connaught Place. Nehru Place. Karol Bagh. The business hub. B2B content works differently here. LinkedIn-first strategies. Thought leadership posts. Employee advocacy that makes your company look like the place smart people work at. We&apos;ve built business pages for CP-based agencies and Nehru Place tech firms.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-muted/60 border border-border text-center space-y-2 max-w-3xl mx-auto">
            <p className="text-base text-muted-foreground">
              Here&apos;s the thing. A Saket audience doesn&apos;t behave like a Rohini audience. Content that works in one falls flat in the other.
            </p>
            <p className="font-bold text-foreground text-base">
              We factor that in. Every single time.
            </p>
          </div>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg">
                  Talk To Someone Who Knows My Delhi Area
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. WHY WE'RE THE BEST SMO SERVICES AGENCY IN DELHI */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Why We&apos;re the Best SMO Services Agency in Delhi
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground">
              Real talk. Anyone can promise engagement. Few actually deliver it with proof.
            </p>
            <p>
              We send transparent weekly reporting. Real numbers, not vanity screenshots. You&apos;ll know exactly what your SMO Services budget is doing every single week.
            </p>
            <p>
              We also handle Social Media Brand Reputation Management Services. That means monitoring mentions, responding to reviews, and catching PR fires before they spread.
            </p>
            <p>
              And our whole approach is built around one outcome. SMO Services to Generate Leads and Website Traffic, not just follower counts that don&apos;t pay your bills.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 9. HOW TO INCREASE ORGANIC REACH ON SOCIAL MEDIA */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            How to Increase Organic Reach on Social Media
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>
              A few things actually move the needle here. Consistent posting windows. Native video over reposted content. Real replies instead of generic ones. And profile optimization that turns a visit into a follow, then a follow into a lead.
            </p>
            <p className="font-semibold text-foreground">
              We build all of that into every SMO Marketing Services package we run.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 10. WHAT THIS ACTUALLY COSTS YOU */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            What This Actually Costs You
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>
              We keep our Affordable Social Media Optimization Packages flexible. Small business, growing startup, or established e-commerce brand, there&apos;s a plan sized for where you are.
            </p>
            <p>
              No inflated retainers. No hidden setup fees. Just ROI driven marketing plans built around your actual budget.
            </p>
            <p>
              Looking for Social Media Optimization Services in Delhi specifically? That&apos;s our home turf. We know the local market, the local audience behavior, and what actually works here, whether you&apos;re near CP or out past Dwarka.
            </p>
          </div>
          <div className="text-center pt-4">
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <MessageSquare className="w-5 h-5" />
                  <span>Get My Exact Pricing On WhatsApp</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* 11. SMO VS SMM. WHAT'S THE DIFFERENCE? */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            SMO vs SMM. What&apos;s the Difference?
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>
              People mix these up all the time. Fair enough, they sound alike.
            </p>
            <p>
              SMO is about optimizing your profiles and content for organic growth. Free reach, built over time.
            </p>
            <p>
              SMM, Social Media Marketing, usually refers to paid campaigns and broader promotional strategy, ads included.
            </p>
            <p>
              We run both when a brand needs it. But most clients start here, with a clean SMO (Social Media Optimization) service foundation, before adding paid layers on top.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 12. FAQS */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <ServiceFaqAccordion faqs={smoFaqs} />
        </ScrollReveal>
      </section>

      {/* 13. RELATED SERVICES */}
      <RelatedServices
        currentSlug="smo-services-in-delhi"
        relatedSlugs={[
          "social-media-marketing-services-in-delhi",
          "graphic-design-services-in-delhi",
          "video-editing-services-in-delhi"
        ]}
      />

      {/* 14. FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border-2 border-primary/20 shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-foreground max-w-3xl mx-auto relative z-10">
              Let&apos;s Get Your Social Pages Working
            </h2>
            <div className="space-y-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
              <p>
                You&apos;ve read this far. That means something isn&apos;t clicking with your current setup.
              </p>
              <p className="font-semibold text-foreground">
                Let&apos;s fix that.
              </p>
              <p>
                Call 9205386625 or message us on WhatsApp. Buzzspire&apos;s SMO Agency in Delhi team will map out where your pages stand today, and what an honest Best SMO Services Agency in Delhi engagement looks like for your brand.
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Magnetic>
                <a href="tel:9205386625">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>Let&apos;s Fix Your Pages — Free Audit Call</span>
                  </Button>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base border-border bg-white text-foreground hover:bg-muted font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>WhatsApp Strategy Chat</span>
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
