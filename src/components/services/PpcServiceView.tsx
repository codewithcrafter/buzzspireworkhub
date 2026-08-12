"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  CheckCircle2,
  Phone,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Target,
  ShoppingBag,
  Building2,
  Users,
  BarChart3,
  CreditCard,
  Clock,
  MapPin,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import RelatedServices from "@/components/services/RelatedServices";

const ppcFaqs = [
  {
    q: "Is there a good SEM agency near me in Delhi?",
    a: "Buzzspire is based in Delhi and works with clients across Connaught Place, Nehru Place, Karol Bagh, South Delhi, and Rohini. In-person meetings are possible if your office is nearby.",
  },
  {
    q: "What's the best PPC agency for small business in Delhi if I'm on a tight budget?",
    a: "Buzzspire runs accounts for small businesses across Delhi with clear, low-minimum entry plans. We scale spend once we see what's converting, not before.",
  },
  {
    q: "Do you offer affordable Google Ads management services for startups?",
    a: "Yes. Startup plans come with lighter management fees, weekly reviews, and budget caps you control from day one.",
  },
  {
    q: "Can you handle SEM / Paid Ads services for an e-commerce brand on Shopify?",
    a: "We work as an e-commerce performance marketing agency for Shopify stores regularly-catalog setup, pixel tracking, dynamic retargeting, all covered.",
  },
  {
    q: "Do you offer Google Ads certified agency support for B2B lead generation?",
    a: "Yes. If you want to hire a Google Ads certified agency for B2B leads, our team handles LinkedIn and Search campaigns built around long sales cycles and CRM handoff.",
  },
  {
    q: "Is there a good SEM agency near me in Delhi?",
    a: "Buzzspire is based in Delhi and works with clients across Connaught Place, Nehru Place, Karol Bagh, South Delhi, and Rohini. In-person meetings are possible if your office is nearby.",
  },
  {
    q: "How fast will I actually see results?",
    a: "We track results in a 30-day window, not a full quarter. You'll know within the first month whether the account is moving in the right direction — not after you've already burned three months of budget.",
  },
  {
    q: "What's the best PPC agency for small business in Delhi if I'm on a tight budget?",
    a: "Buzzspire runs accounts for small businesses across Delhi with clear, low-minimum entry plans. We scale spend once we see what's converting, not before.",
  },
  {
    q: "Do you offer affordable Google Ads management services for startups?",
    a: "Yes. Startup plans come with lighter management fees, weekly reviews, and budget caps you control from day one.",
  },
  {
    q: "Can you handle SEM / Paid Ads services for an e-commerce brand on Shopify?",
    a: "We work as an e-commerce performance marketing agency for Shopify stores regularly — catalog setup, pixel tracking, dynamic retargeting, all covered.",
  },
  {
    q: "What happens if the campaign isn't working after 30 days?",
    a: "We tell you straight — no dragging it out for another billing cycle. If the data says it's not working, we either restructure the approach or tell you honestly that paid ads aren't the right move right now.",
  },
];

export default function PpcServiceView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="w-full bg-background select-none bg-grid-pattern relative overflow-hidden">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <ScrollReveal className="space-y-8">
            <div className="space-y-6">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                PPC &amp; Paid Ads Specialist
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-foreground">
                Best PPC &amp; SEM (Paid Ads) Services in Delhi
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-lg md:text-xl">
                  Delhi Businesses Get More Calls From The Same Ad Budget.
                </p>
                <p className="font-bold text-primary">
                  No guesswork. No vanity metrics. Just leads that show up.
                </p>
                <p>
                  That&apos;s why Buzzspire runs SEM / Paid Ads services built around one thing-calls and leads that actually show up. We&apos;re a SEM service agency in Delhi, working with businesses across Connaught Place, Nehru Place, Karol Bagh, South Delhi, and Rohini. We manage Google Ads and full-funnel paid campaigns for brands that are wasting budget on guesswork. If you&apos;re searching for a PPC agency in Delhi that treats your spend like it&apos;s our own money, you&apos;ve landed in the right place.
                </p>
                <p className="font-medium text-foreground">
                  Real accounts. Real numbers. No fluff reports full of vanity metrics.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Get My Free Audit — Takes 10 Minutes</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} className="relative h-[500px] hidden lg:block w-full">
            {/* Custom PPC "Campaign Creative" Visual Composition */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5 rounded-[2.5rem] border border-border/50 overflow-hidden shadow-2xl flex items-center justify-center p-8">
               <div className="w-full max-w-[360px] relative z-10">
                 
                 {/* Floating Conversion Card */}
                 <div className="absolute -top-8 -right-4 bg-white dark:bg-zinc-900 border border-border rounded-xl p-3 shadow-lg flex flex-col gap-1 animate-float-medium z-20">
                   <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">ROAS</div>
                   <div className="text-xl font-black text-green-500 flex items-center gap-1">
                     420% <ArrowUpRight className="w-4 h-4" />
                   </div>
                 </div>

                 {/* Mock Search Ad UI */}
                 <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-md p-5 w-full mb-6 relative z-10 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-[11px] font-bold text-foreground">Ad</span>
                     <span className="text-[11px] text-muted-foreground">•</span>
                     <span className="text-[11px] text-muted-foreground">buzzspiremedia.com</span>
                   </div>
                   <div className="text-blue-600 dark:text-blue-400 font-medium text-lg leading-tight mb-2 hover:underline cursor-pointer">
                     Top PPC Agency in Delhi | ROI Driven Google Ads
                   </div>
                   <div className="text-sm text-muted-foreground leading-relaxed">
                     Stop wasting budget on clicks that don&apos;t convert. We run high-performance SEM campaigns for businesses in Delhi NCR. Get a free account audit today.
                   </div>
                   <div className="mt-3 flex flex-wrap gap-2">
                     <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">E-commerce PPC</span>
                     <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">B2B Lead Gen</span>
                   </div>
                 </div>
                 
                 {/* Mock Analytics Bar Chart */}
                 <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm p-5 w-full transform translate-x-4 rotate-2 hover:rotate-0 transition-transform duration-500 flex items-end gap-3 h-40">
                   <div className="w-full bg-blue-500/10 rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-blue-500/30 h-[20%]" /></div>
                   <div className="w-full bg-blue-500/10 rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-blue-500/40 h-[35%]" /></div>
                   <div className="w-full bg-blue-500/10 rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-blue-500/60 h-[50%]" /></div>
                   <div className="w-full bg-blue-500/10 rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-blue-500/80 h-[75%]" /></div>
                   <div className="w-full bg-green-500/20 rounded-t flex flex-col justify-end overflow-hidden relative group">
                     <div className="w-full bg-green-500 h-[95%]" />
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Conversions Peak</div>
                   </div>
                 </div>

               </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 1: WHY DELHI BUSINESSES TRUST BUZZSPIRE */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground leading-tight">
                Why Delhi Businesses Trust Buzzspire With Their Ad Spend
              </h2>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground">Most agencies set up a campaign and disappear.</p>
                <p className="font-bold text-primary">We don&apos;t work that way.</p>
                <p>
                  As a paid search marketing agency, every account gets built around your actual sales cycle, not a generic template. We dig into your industry, your competitors, your average order value. Then we build.
                </p>
                <p className="text-base md:text-lg text-foreground italic border-l-2 border-primary/30 pl-4 mt-6">
                  Honestly, that last point matters most. You shouldn&apos;t have to wait three months to know if your money&apos;s working.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-zinc-900 border border-border/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                  <p className="text-sm md:text-base text-foreground font-medium">A dedicated account manager who actually picks up your call</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-border/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                  <p className="text-sm md:text-base text-foreground font-medium">Transparent weekly reporting with real campaign data, not screenshots</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-border/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                  <p className="text-sm md:text-base text-foreground font-medium">Upfront clear pricing, no hidden management fees</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                  <p className="text-sm md:text-base text-foreground font-medium">A 30-day results tracking window so you see direction fast</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 2: BUILT FOR YOUR INDUSTRY */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Built For Your Industry, Not A Template
            </h3>
          </div>

          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>
              PPC campaign management isn&apos;t just bidding higher and hoping.
            </p>
            <p>
              It&apos;s structure. Keyword mapping. Negative keyword lists that keep tightening. Ad copy tested against ad copy, week over week.
            </p>
            <div className="p-6 rounded-2xl bg-muted/60 border border-border space-y-2">
              <p className="font-bold text-foreground">We run:</p>
              <ul className="space-y-2 pl-4 list-disc text-sm md:text-base">
                <li>Search campaigns built on buyer-intent keywords</li>
                <li>Display and YouTube for top-of-funnel reach</li>
                <li>Shopping campaigns for product-based businesses</li>
                <li>Performance Max where the data supports it</li>
              </ul>
            </div>
            <p className="font-semibold text-foreground">
              Every rupee gets tracked back to a conversion. If it&apos;s not working, we cut it. Simple as that.
            </p>
          </div>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg">
                  Get My Free Audit — Takes 10 Minutes
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 3: INDUSTRY-SPECIFIC PAID ADS */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Industry-Specific Paid Ads, Not One-Size-Fits-All
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Different businesses, different sales cycles. We treat them that way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                E-Commerce Paid Ads Agency Support
              </h3>
              <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  Running an online store means every rupee has to fight for itself. As an e-commerce paid ads agency, we track ROAS down to the SKU level, not just the campaign level.
                </p>
                <p>
                  Got a Shopify store? We work as an e-commerce performance marketing agency for Shopify stores specifically-clean pixel setup, catalog feeds that don&apos;t break, and campaigns built around your actual margins, not just top-line revenue.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                B2B Lead Generation Paid Ads
              </h3>
              <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  B2B is a different game. Longer cycles. Fewer, bigger deals.
                </p>
                <p>
                  Our B2B lead generation paid ads focus on quality over quantity-LinkedIn targeting, Google Search intent keywords, and forms that filter out tire-kickers before they hit your CRM. If you want to hire a Google Ads certified agency for B2B leads that actually understands sales handoff, this is that.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg">
                  See If This Fits My Business
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 4: WHO WE WORK WITH */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Who We Work With
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Best PPC Agency for Small Business in Delhi
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Small teams need results without the enterprise price tag. We run lean, focused accounts for local and regional businesses that need calls and footfall, not just impressions. If you&apos;ve been searching for the best PPC agency for small business in Delhi, start with a free audit call.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Affordable Google Ads Management Services for Startups
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Startups burn cash fast if the ad account isn&apos;t watched daily. Our affordable Google Ads management services for startups come with tighter budget caps, weekly check-ins, and pricing that scales as you grow-not before.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 5: NUMBERS YOU CAN CHECK YOURSELF */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Numbers You Can Check Yourself, Not Numbers We Tell You
            </h2>
          </div>

          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>
              A lot of agencies call themselves a performance marketing agency and then send you a PDF once a month.
            </p>
            <p className="font-semibold text-foreground">
              We don&apos;t.
            </p>
            <p>
              Every client gets a live reporting view. Spend, cost per lead, conversion rate-updated, not recycled from last week. That&apos;s how a real Google Ads management agency should operate.
            </p>
          </div>

          <div className="text-center pt-4">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Ready to see what your account could look like? Call 9205386625 or drop us a WhatsApp message today.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 6: WHY NOT JUST ANY AGENCY IN DELHI */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Why Not Just Any Agency in Delhi
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>
              Delhi has no shortage of agencies pitching paid ads. Fair enough.
            </p>
            <p>
              But most of them run junior teams on senior client budgets. We don&apos;t.
            </p>
            <p className="font-semibold text-foreground">
              Every SEM / Paid Ads services account here is handled by someone who&apos;s actually run six and seven-figure ad spends before, not someone learning on your dime. That&apos;s the difference between an agency that reports numbers and one that moves them.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 7: LOCATION SERVING IN DELHI */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              SEM &amp; PPC Agency Serving Businesses Across Delhi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We don&apos;t run a call centre out of one city and call it &quot;pan-India.&quot; Our team actually knows Delhi&apos;s local search behaviour, area by area.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium max-w-3xl mx-auto space-y-3">
            <ul className="space-y-3 text-sm md:text-base text-foreground font-medium">
              <li className="flex gap-3 items-center">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>PPC agency in Connaught Place - high footfall retail and hospitality brands</span>
              </li>
              <li className="flex gap-3 items-center">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>SEM services in Nehru Place - B2B, IT, and electronics sellers</span>
              </li>
              <li className="flex gap-3 items-center">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Paid ads agency in Karol Bagh - wholesale, jewellery, and D2C brands</span>
              </li>
              <li className="flex gap-3 items-center">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Google Ads management in South Delhi - premium and lifestyle businesses</span>
              </li>
              <li className="flex gap-3 items-center">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>PPC agency in Rohini &amp; Dwarka - local service providers and clinics</span>
              </li>
            </ul>
          </div>

          <p className="text-base md:text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Wherever your business sits in Delhi, the SEM / Paid Ads services setup stays the same-clean tracking, honest reporting, and a dedicated account manager who&apos;s reachable.
          </p>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Looking for a PPC agency near me in Delhi? Call 9205386625 or WhatsApp us right now.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 8: FAQS (EXACT MATCH INCLUDING REPEATED QUESTIONS) */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {ppcFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-border/50 bg-transparent group">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-6 text-left font-heading font-bold text-lg md:text-xl text-foreground hover:text-primary flex justify-between items-center focus:outline-none transition-colors"
                  >
                    <h3 className="pr-8">{faq.q}</h3>
                    <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary border-primary text-white rotate-45' : 'group-hover:border-primary text-muted-foreground'}`}>
                      <span className="text-lg leading-none">+</span>
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-base text-muted-foreground leading-relaxed pr-12">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="ppc-services-in-delhi"
        relatedSlugs={[
          "seo-services-in-delhi",
          "google-business-profile-management-in-delhi",
          "web-development-services-in-delhi"
        ]}
      />

      {/* SECTION 9: FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border border-border shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-foreground max-w-3xl mx-auto relative z-10">
              Get Started with Buzzspire
            </h2>
            <div className="space-y-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
              <p className="font-semibold text-foreground">
                You&apos;ve read enough. Numbers convince faster than words.
              </p>
              <p>
                Call 9205386625 or WhatsApp us for a free account audit. We&apos;ll tell you honestly if paid ads make sense for your business right now-no forced sales pitch.
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Talk To Buzzspire — No Pitch, Just Numbers</span>
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
