"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  CheckCircle2,
  Phone,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Layers,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Search,
  Zap,
  Globe,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import RelatedServices from "@/components/services/RelatedServices";

const ecommerceFaqs = [
  {
    q: "What do ecommerce management services actually include?",
    a: "Account setup, listing optimization, inventory sync, ad management, SEO, and customer query handling across your marketplaces.",
  },
  {
    q: "Do you handle Amazon, Flipkart, and Shopify together?",
    a: "Yes. Most of our clients run all three. We manage them under one dashboard so stock and pricing stay in sync.",
  },
  {
    q: "How much do ecommerce account management services cost?",
    a: "It depends on your catalog size and ad budget. We share the exact number before you commit, not after.",
  },
  {
    q: "Can you help a brand new store with zero sales?",
    a: "Yes. Our end to end ecommerce management services for small business cover setup from scratch, not just growth for existing sellers.",
  },
  {
    q: "How soon will I see results?",
    a: "Our 30-day results tracking guarantee means you'll see measurable movement within the first month, tracked and reported weekly.",
  },
  {
    q: "Do you only work with sellers based in Delhi?",
    a: "No. Most of our clients are in Delhi, Gurgaon, and Noida, but our ecommerce management services are delivered online - so we can work with sellers anywhere.",
  },
  {
    q: "What do ecommerce management services actually include?",
    a: "Account setup, listing optimization, inventory sync, ad management, SEO, and customer query handling across your marketplaces. Everything that keeps your store running and growing, not just the flashy stuff.",
  },
  {
    q: "Do you handle Amazon, Flipkart, and Shopify together?",
    a: "Yes. Most of our clients run all three. We manage them under one dashboard so stock and pricing stay in sync. One policy change on one platform doesn't sink your entire revenue.",
  },
  {
    q: "How much do ecommerce account management services cost?",
    a: "It depends on your catalog size and ad budget. A store with 50 SKUs and ₹50,000 monthly ad spend needs a different plan than one with 500 SKUs and ₹5,00,000. We share the exact number before you commit, not after.",
  },
  {
    q: "Can you help a brand new store with zero sales?",
    a: "Yes. Our end to end ecommerce management services cover setup from scratch - store creation, catalog upload, first ads, first reviews. Not just growth for existing sellers. We build the foundation first, then scale it.",
  },
  {
    q: "How soon will I see results?",
    a: "Our 30-day results tracking guarantee means you'll see measurable movement within the first month - in rankings, in ad performance, in order volume. Tracked and reported weekly. No vague \"it takes time\" excuses.",
  },
];

export default function EcommerceServiceView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="w-full bg-background select-none bg-grid-pattern relative overflow-hidden">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
        <ScrollReveal>
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            Ecommerce Operations Specialist
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tighter leading-tight text-foreground mt-6">
            Ecommerce Management Services in Delhi
          </h1>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            <p className="font-semibold text-foreground text-lg md:text-xl">
              Running an online store is hard. Real hard.
            </p>
            <p>
              You launch a product. Sales come in slow. Then a competitor undercuts your price. Or your Amazon listing gets suppressed overnight for no reason. Sound familiar?
            </p>
            <p className="font-semibold text-foreground">
              That&apos;s exactly why Buzzspire Media exists.
            </p>
            <p>
              We&apos;re an ecommerce management services team based right here in Delhi. Sellers across Delhi, Gurgaon, and Noida already trust us to run their stores. We handle the accounts, the listings, the ads, the SEO. You handle the business.
            </p>
            <p className="font-medium text-foreground">
              No fluff. No jargon-filled reports you can&apos;t read. Just results you can check every week.
            </p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Call 9205386625 or ping us on WhatsApp for a free ecommerce audit.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 1: FULL-SERVICE ECOMMERCE AGENCY */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Full-Service Ecommerce Agency for Growing Brands
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground text-center">We&apos;re not a one-trick agency.</p>
            <p>
              Some agencies only do ads. Others only fix listings. We&apos;re a full-service ecommerce agency. That means everything sits under one team, one dashboard, one point of contact.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 2: ECOMMERCE DIGITAL MARKETING AGENCY */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center">
            Ecommerce Digital Marketing Agency
          </h3>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground">
              Your store needs traffic. Real traffic. Not just clicks that bounce in three seconds.
            </p>
            <p>
              As an ecommerce digital marketing agency, we build the funnel from scratch. Ads, retargeting, email flows, influencer pushes when it makes sense. Every channel talks to the other.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 3: ECOMMERCE MANAGEMENT AGENCY YOU CAN TRUST */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Ecommerce Management Agency You Can Trust
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground text-center">Trust isn&apos;t a tagline for us.</p>
            <p>
              Every client working with our ecommerce management agency gets a dedicated account manager. One person who knows your catalog, your margins, your goals. Not a rotating cast of strangers replying to tickets.
            </p>
            <p>
              And every Friday, you get a report. Real numbers. Real campaign data. No spin.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 4: ECOMMERCE MANAGEMENT AGENCY IN DELHI */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Ecommerce Management Agency in Delhi
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>
              We&apos;re not remote strangers managing your account from some other city.
            </p>
            <p>
              Buzzspire Media sits in Delhi. That means we understand the sellers here, the buyer behavior across Delhi, the peak seasons that matter to this market. our team is a call away, not a support ticket away.
            </p>
            <p>
              As the best ecommerce management company in Delhi for growing sellers, we&apos;ve worked across categories that sell heavily in this region, fashion, electronics, home and kitchen, FMCG.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 5 & 6 & 7: END TO END STORE MANAGEMENT & MARKETING */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              End to End Ecommerce Management Services for Small Business
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Small businesses get ignored by big agencies. We built our model around them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Full Service Ecommerce Store Management and Marketing
              </h3>
              <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  From the day you sign up, we cover the store setup, the catalog, the ads, and the after-sales queue. Full service ecommerce store management and marketing, start to finish.
                </p>
                <p className="font-semibold text-foreground">
                  You don&apos;t need five vendors. You need one.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Ecommerce Store Management Services
              </h3>
              <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  Day to day, this looks like inventory checks, price monitoring, order tracking, return handling. Small tasks. But they decide whether your store bleeds money or grows.
                </p>
                <p>
                  Our ecommerce store management services cover all of it, quietly, in the background. This is where most of our ecommerce management services work actually happens, not in flashy dashboards, but in daily follow-through.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Want your daily store operations off your plate? Call 9205386625 today.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 8: ECOMMERCE ACCOUNT MANAGEMENT SERVICES */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Ecommerce Account Management Services
            </h2>
            <div className="space-y-1 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              <p>Every marketplace has its own rules. Its own algorithm. Its own way of punishing sellers who don&apos;t play by the book.</p>
              <p className="font-semibold text-foreground">Our ecommerce account management services in Delhi are built platform by platform.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Amazon Account Management Services
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Amazon moves fast. Buy box, A+ content, PPC bids, account health score, it&apos;s a lot to track alone. We manage your Amazon account management services in Delhi end to end. Listings, ads, reviews, disputes with Amazon support. All of it.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Amazon Seller Account Management Services Cost
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Pricing depends on your catalog size and ad spend. But here&apos;s the thing, we keep it upfront. No hidden slabs. You&apos;ll know your Amazon seller account management services cost before we start, not after.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Flipkart Account Management Services
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Flipkart&apos;s buyers behave differently than Amazon&apos;s. Different peak hours. Different promotion calendars. Our Flipkart account management services are handled by people who track those patterns daily, not once a quarter.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Shopify Management Agency
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Shopify gives you freedom. But freedom without structure just means a messy store. As a Shopify management agency in Delhi, we set up your theme, apps, checkout flow, and abandoned cart recovery the right way.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3 md:col-span-2 max-w-2xl mx-auto w-full">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Shopify Store Setup and Management Services
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Starting fresh? Our Shopify store setup and management services take you from a blank theme to a live, converting store in days, not months.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 9 & 10: MARKETPLACE MANAGEMENT & MULTI-CHANNEL INVENTORY */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Ecommerce Marketplace Management
            </h2>
            <div className="space-y-2 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              <p>Selling on one platform is risky. One policy change and your revenue drops overnight.</p>
              <p>
                That&apos;s why ecommerce marketplace management, across two, three, even five channels, matters more now than it did five years ago. Good ecommerce management services mean you&apos;re ready for that shift before it happens, not scrambling after.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium max-w-3xl mx-auto space-y-4">
            <h3 className="text-xl font-heading font-bold text-foreground">
              Multi Channel Ecommerce Inventory and Store Management Agency
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Stock mismatches across platforms cause cancelled orders. Cancelled orders hurt your seller rating.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              As a multi channel ecommerce inventory and store management agency, we sync your stock in real time. One sale on Amazon updates your Flipkart and Shopify count instantly.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 11 & 12 & 13: LISTING, PPC & SEO SERVICES */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Ecommerce Listing and Cataloging Services
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A bad listing loses the sale before the buyer even reads your price. Our ecommerce listing and cataloging services cover titles, bullet points, backend keywords, image specs, and category mapping. Every field, checked.
              </p>
              <p className="text-sm font-semibold text-foreground">
                A bad listing quietly costs you sales every single day - we fix that first.We fix it first.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Ecommerce PPC Management Agency
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ad spend without strategy is just money burning. As an ecommerce PPC management agency in Delhi, we run Sponsored Products, Sponsored Brands, and Sponsored Display campaigns with weekly bid adjustments, not set-and-forget automation. Every rupee spent gets tracked back to a sale. If a campaign isn&apos;t pulling its weight, we cut it. Fast.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Ecommerce SEO Services
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Marketplace SEO isn&apos;t the same as Google SEO. Different signals. Different ranking factors. Our ecommerce SEO services in Delhi focus on backend search terms, conversion rate, click-through rate, and review velocity, the actual levers that move your organic rank on Amazon and Flipkart. It&apos;s a core part of any ecommerce management services package we run.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Ask us for a free ad account audit. Call 9205386625.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 14 & 15: BEST AGENCY & D2C GROWTH */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">
                Best Ecommerce Account Management Agency in Delhi
              </h2>
              <div className="space-y-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>We didn&apos;t build this by accident.</p>
                <p>
                  Years of managing seller accounts across categories, electronics, fashion, home goods, FMCG, taught us what actually moves the needle. Clients call us the best ecommerce account management agency in Delhi for a reason. We show the math behind every claim.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">
                Ecommerce Growth Management Agency for D2C Brands
              </h2>
              <div className="space-y-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  D2C brands face a different fight. You&apos;re not just competing on marketplaces. You&apos;re building a brand people search for by name.
                </p>
                <p>
                  As an ecommerce growth management agency for D2C brands in Delhi, we build that layer too, website, email list, retention flows, alongside your marketplace presence.
                </p>
                <p className="font-semibold text-foreground">
                  Growth here means repeat buyers, not just first-time clicks.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <MessageSquare className="w-5 h-5" />
                  <span>Building a D2C brand? Let&apos;s talk. WhatsApp us at +91-9205386625.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 16: WHY BUZZSPIRE MEDIA */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Why Buzzspire Media
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground">Here&apos;s the deal.</p>
            <p>
              We back our ecommerce management services with a 30-day results tracking guarantee. Within the first month, you&apos;ll see the movement, in rankings, in ad performance, in order volume.
            </p>
            <p className="font-medium text-foreground">You get a dedicated account manager from day one.</p>
            <p className="font-medium text-foreground">You get weekly reports with actual campaign data, not vanity screenshots.</p>
            <p className="font-medium text-foreground">And you get pricing that&apos;s clear before you sign anything.</p>
            <p className="font-bold text-foreground pt-2">
              Ready to hand over your ecommerce management services to a team that shows the numbers? Call 9205386625 or message us on WhatsApp now.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 17: FAQS */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {ecommerceFaqs.map((faq, idx) => {
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

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="ecommerce-management-services-in-delhi"
        relatedSlugs={[
          "ppc-services-in-delhi",
          "seo-services-in-delhi",
          "web-development-services-in-delhi"
        ]}
      />

      {/* SECTION 18: FINAL CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-border/60">
        <ScrollReveal>
          <div className="rounded-[3rem] bg-gradient-to-tr from-primary via-secondary to-accent p-10 md:p-16 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl space-y-8 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter leading-tight">
              Let&apos;s Fix Your Ecommerce Store, Starting Today
            </h2>
            <div className="space-y-4 text-base md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              <p>
                Look, you&apos;ve read this far. That means something&apos;s not working with your store right now.
              </p>
              <p className="font-semibold text-white">
                Stop losing sales to bad listings, stockouts, or ad spend that&apos;s going nowhere.
              </p>
              <p>
                Talk to our team today. No long pitch, just a straight look at where your store stands.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Magnetic>
                <a href="tel:9205386625">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-white text-primary hover:bg-white/95 font-bold shadow-lg flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>Call 9205386625 or WhatsApp us now for a free ecommerce management consultation in Delhi.</span>
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
