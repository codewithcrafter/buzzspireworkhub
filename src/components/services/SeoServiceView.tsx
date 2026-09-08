import Link from "next/link";
import {
  Search,
  Phone,
  MessageSquare,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceHeroVideo from "@/components/services/ServiceHeroVideo";
import ServiceFaqAccordion from "@/components/services/ServiceFaqAccordion";

const seoFaqs = [
  {
    q: "What should I look for when hiring an SEO agency in Delhi?",
    a: "Look past the promises. Ask for actual client results. Ask how reporting works. Ask who'll be managing your account day to day. If an agency can't answer clearly, that's your answer right there."
  },
  {
    q: "How much do monthly SEO services cost in Delhi?",
    a: "It depends on your industry, competition, and goals. A small local business in Delhi needs a different plan than an e-commerce store in Gurgaon with thousands of product pages. We give you a clear number after a short audit, not a guess."
  },
  {
    q: "How long does SEO take to show results for new websites?",
    a: "Honestly, don't expect miracles in week two. Most new websites start seeing real movement around month three to six. SEO compounds. Slow start, then it builds."
  },
  {
    q: "What's the difference between PPC and organic SEO services?",
    a: "PPC gets you traffic while you're paying. Turn the budget off, traffic stops. Organic SEO services build something that keeps working even when you're not actively spending. Most Delhi businesses need both, just at different stages."
  },
  {
    q: "Do you serve businesses outside Delhi, like Gurgaon or Noida?",
    a: "Yes. While we're headquartered in Delhi, we actively manage SEO for clients across Gurgaon, Noida, Faridabad, and Ghaziabad."
  },
  {
    q: "What should I look for when hiring an SEO agency in Delhi?",
    a: "Look past the promises. Ask for actual client results - rankings, traffic numbers, not just screenshots. Ask how reporting works. Ask who'll be managing your account day to day. If an agency can't answer clearly, that's your answer right there. A good agency shows you the work, not just the pitch."
  },
  {
    q: "Can you guarantee first-page rankings on Google?",
    a: "No. And any agency that does is lying. What we guarantee is this - we chase the keywords that actually bring buyers, not vanity terms. We build authority the right way. And we show you exactly what's working and what isn't, every single week. Rankings follow. But guarantees? Those are for sales decks, not real SEO."
  },
  {
    q: "Do you handle the content writing or do I need to provide it?",
    a: "We handle it. Our team writes content built around the searches your customers actually run - not generic blog posts nobody reads. If you already have a content team, we work with them. We provide the keyword strategy, the structure, and the optimization. They write, we refine. Or we write everything. Your call."
  },
  {
    q: "What's included in your monthly SEO retainer?",
    a: "Everything that moves the needle. On-page fixes, content creation, link building, technical audits, weekly reporting, and a dedicated account manager who actually picks up the phone. No hidden costs. No \"premium add-ons\" six months in. You get the full stack, or we don't take you on."
  },
  {
    q: "How do I know if my current SEO agency is doing a bad job?",
    a: "Three red flags. One - they can't explain what they're doing in plain English. Two - your traffic is flat or dropping after six months. Three - they never talk about conversions, only rankings. If all three sound familiar, it's time for a second opinion. Call us. We'll audit what they've done and tell you straight."
  }
];

export default function SeoServiceView() {
  return (
    <div className="w-full bg-slate-50 font-sans select-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] relative overflow-hidden">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
                <Search className="w-4 h-4" />
                SEO Specialist
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-slate-900">
                Professional SEO Services in Delhi That Actually Move The Needle
              </h1>
              <div className="space-y-4 text-base md:text-lg text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-900 text-lg md:text-xl">
                  Looking for an SEO agency in Delhi that doesn&apos;t just sound good in a sales pitch? You&apos;re in the right place.
                </p>
                <p>
                  Buzzspire Media is a Delhi based SEO company serving businesses. We don&apos;t make vague promises. We do rankings, traffic, and calls that turn into paying customers.
                </p>
                <p>
                  Here&apos;s the thing about most SEO companies in Delhi. They talk a big game about algorithms and then hand you a PDF nobody reads. We&apos;re not that agency.
                </p>
                <p className="font-medium text-slate-900">
                  Our SEO services are built around one question. Is this actually growing your business? If the answer&apos;s no, we don&apos;t do it.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/contact" className="inline-block w-full sm:w-auto">
                  <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all w-full font-bold bg-primary hover:bg-indigo-700 text-white">
                    Get a Free SEO Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <ServiceHeroVideo slug="seo-services-in-delhi" />
        </div>
      </section>

      {/* WHY PICK BUZZSPIRE */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200/50">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-full min-h-[400px] rounded-[2rem] bg-muted/30 border border-slate-200/50 overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
               <div className="w-24 h-24 rounded-full bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center border border-slate-200/50 relative z-10">
                 <CheckCircle2 className="w-10 h-10 text-primary" />
                 <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
               </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 leading-tight">
                Why Pick Buzzspire Over Other Delhi SEO Agencies
              </h2>
              <div className="space-y-5 text-base md:text-lg text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-900 text-xl">We&apos;re not the biggest SEO company in Delhi. We don&apos;t want to be.</p>
                <p>
                  What we want is a small, sharp team that actually picks up the phone. Every client gets a dedicated account manager who understands the Delhi market - not a rotating cast of junior execs who forget your business name.
                </p>
                <div className="pl-6 border-l-2 border-primary/30 py-2">
                  <p className="text-slate-900 font-medium">
                    You&apos;ll get weekly reporting. Real numbers. Rankings, traffic, calls, leads. No fluff slides.
                  </p>
                </div>
                <p>
                  And here&apos;s our line in the sand. We track your results for the first 30 days and show you exactly what&apos;s moving and what isn&apos;t. No hiding behind jargon.
                </p>
                <p className="font-medium text-slate-900 bg-primary/5 inline-block px-4 py-2 rounded-lg">
                  Pricing&apos;s upfront too. You&apos;ll know the plan and the expected return before you sign anything.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CORE SEO SERVICES */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-200/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900">
              Our SEO Services in Delhi
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We cover the full spread. Here&apos;s what&apos;s under the hood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-4">
              <h3 className="text-xl font-heading font-bold text-slate-900">On-Page SEO Services</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Titles, headers, internal links, content structure. The stuff Google actually reads on your pages. We fix what&apos;s broken and build what&apos;s missing.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-4">
              <h3 className="text-xl font-heading font-bold text-slate-900">Off-Page SEO Services</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your site&apos;s reputation off your own domain. Backlinks, brand mentions, digital PR relevant to Indian and Delhi-based audiences. This is where authority gets built.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-4">
              <h3 className="text-xl font-heading font-bold text-slate-900">Technical SEO Audit Services</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Site speed, crawl errors, broken redirects, mobile issues. We run a full technical SEO audit before touching anything else, because you can&apos;t fix what you can&apos;t see.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-4">
              <h3 className="text-xl font-heading font-bold text-slate-900">Local SEO Services in Delhi</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Want to show up when someone nearby searches for what you sell - whether they&apos;re in Connaught Place, Dwarka, Rohini, Karol Bagh, or Gurgaon&apos;s Cyber Hub? Our local SEO services get your Google Business Profile, citations, and Maps presence in shape for hyperlocal search.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-4">
              <h3 className="text-xl font-heading font-bold text-slate-900">E-commerce SEO Services</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Product pages, category structure, site search, duplicate content headaches. Our e-commerce SEO services are built for stores that live and die by organic traffic.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-4">
              <h3 className="text-xl font-heading font-bold text-slate-900">Enterprise SEO Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Big sites, big teams, big stakes. Our enterprise SEO management handles multi-location structure, content governance, and cross-team coordination without the chaos.
              </p>
            </div>
          </div>
          <div className="text-center pt-8">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Not Sure What Your Site Needs? Get a Free 15-Minute SEO Audit - Call +91-9205386625</span>
                </Button>
              </a>
            </Magnetic>
            <p className="text-sm text-slate-600 mt-4">
              Not sure which one your business needs? Call +91-9205386625. We&apos;ll figure it out together, five minutes, no pressure.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-slate-200/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 text-center">
            What You Actually Get From Working With Us
          </h2>
          <div className="space-y-4 text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-slate-900 text-center pb-2">This isn&apos;t about vanity rankings. It&apos;s about outcomes.</p>
            <ul className="space-y-3 text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>Organic traffic growth that shows up in your analytics, not just a report</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>Improved Google search rankings in Delhi for the terms that actually bring buyers</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>SEO management services that run in the background so you don&apos;t have to think about it</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>Custom SEO strategies built around your business and local market, not a template</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>Link building services that focus on quality over quantity</span>
              </li>
            </ul>
            <p className="font-semibold text-slate-900 text-center pt-4">
              We&apos;ve had clients ask us why we don&apos;t just chase every keyword. Simple. Rankings without buyers aren&apos;t worth much. We chase the searches that turn into customers.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* INDUSTRIES WE RANK */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-200/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900">
              Industries We Rank
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Small business. Growing business. Local shop. National brand. Doesn&apos;t matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-3">
              <h3 className="text-xl font-heading font-bold text-slate-900">SEO agency for small businesses in Delhi.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you&apos;re a small business, budget matters. We build plans that fit, not plans that break you.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-3">
              <h3 className="text-xl font-heading font-bold text-slate-900">E-commerce SEO services for Shopify stores.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Running a Shopify store based in Delhi or Noida? We&apos;ve handled product-page SEO, collection structure, and speed fixes for stores just like yours.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-3">
              <h3 className="text-xl font-heading font-bold text-slate-900">Local SEO services for Google Business Profile optimization.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Walk-ins and calls matter to you. We get your Google Business Profile working like it should.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-3">
              <h3 className="text-xl font-heading font-bold text-slate-900">Affordable SEO packages for startups in Delhi and Gurgaon.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Early stage and tight on cash? We&apos;ve got startup-friendly plans that still deliver.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-3">
              <h3 className="text-xl font-heading font-bold text-slate-900">B2B SEO agency for lead generation.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Selling to other businesses out of Gurgaon or Noida&apos;s corporate hubs? We build content and structure around the searches your buyers actually run.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 space-y-3">
              <h3 className="text-xl font-heading font-bold text-slate-900">Real estate SEO & Healthcare SEO in Delhi.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real estate SEO services in Delhi and healthcare SEO services in Delhi are also part of what we do. Different industries, different search behavior. We adjust accordingly.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* HIGHER RANKINGS */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-slate-200/60">
        <ScrollReveal className="space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900">
            SEO Services Agency in Delhi for Higher Google Rankings
          </h2>
          <div className="space-y-4 text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            <p>
              We&apos;re based in Delhi, and most of our clients are here too. That local experience matters. We understand the market, the competition, and what it takes to get found by customers across Delhi — from New Delhi and South Delhi to North Delhi, Dwarka, Rohini, and Karol Bagh.
            </p>
            <p>
              Search for &quot;SEO agency near me in Delhi&quot; and you&apos;ll find plenty of options. What you won&apos;t find everywhere is a team that actually meets you, understands your local market, and builds around it instead of copying a generic playbook.
            </p>
          </div>
          <div className="pt-6">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>We Only Take 10 SEO Clients Per Quarter. 3 Spots Left. Call +91-9205386625</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* FAQS */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-slate-200/50">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <ServiceFaqAccordion faqs={seoFaqs} />
        </ScrollReveal>
      </section>

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="seo-services-in-delhi"
        relatedSlugs={[
          "google-business-profile-management-in-delhi",
          "ppc-services-in-delhi",
          "web-development-services-in-delhi"
        ]}
      />

      {/* FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-slate-200/50">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border border-slate-200 shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-slate-900 max-w-3xl mx-auto relative z-10">
              Your Competitor&apos;s SEO Agency Is Probably Ignoring Them Right Now. Let&apos;s Fix Yours.
            </h2>
            <div className="space-y-4 text-base md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed relative z-10">
              <p>Get in touch today. No long forms, no pushy sales calls. Just a straight conversation about your SEO.</p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Magnetic>
                <a href="tel:9205386625">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>Call +91-9205386625</span>
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
