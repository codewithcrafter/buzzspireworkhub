import Link from "next/link";
import {
  Target,
  Phone,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceHeroVideo from "@/components/services/ServiceHeroVideo";
import ServiceFaqAccordion from "@/components/services/ServiceFaqAccordion";

const smmFaqs = [
  {
    q: "What's the best SMM agency for small businesses in India?",
    a: "Look for one that shows real client numbers, not just follower screenshots. Buzzspire Media works with small businesses across Delhi and beyond, with plans built for smaller budgets too."
  },
  {
    q: "Do you have affordable social media marketing packages for startups?",
    a: "Yes. We scale packages based on your stage and budget. A startup doesn't need the same spend as an established brand, and we build the plan around that."
  },
  {
    q: "How do I get leads through Facebook and Instagram ads?",
    a: "It starts with a tight offer, a clear landing page, and constant creative testing. We build all three together as part of our social media lead generation process."
  },
  {
    q: "What's the monthly social media management cost for a small business?",
    a: "It depends on the platforms, ad spend, and content volume you need. Call +91-9205386625 for a straight answer, no vague ranges."
  },
  {
    q: "How long before I see results from social media ads?",
    a: "Not overnight. That's the honest answer. Most campaigns need 2-3 weeks of testing before the data tells us what's actually working. We test audiences, creatives, and offers. Once we find the winner, we scale it. If an agency promises instant results, they're selling you something that doesn't exist."
  },
  {
    q: "Do I need to create content myself or do you handle everything?",
    a: "We handle everything if you want us to. Content calendars, graphic design, reel editing, caption writing - it's all part of our social media content creation service. If you already have a content team, we plug into your workflow and run the ads and strategy side. Flexible either way."
  },
  {
    q: "What's the difference between organic growth and paid ads?",
    a: "Organic growth is slow, free, and compounds over time. Paid ads are fast, cost money, and work immediately. The smart play? Both. We build your organic presence so you don't depend entirely on ad spend, while running paid campaigns that bring leads today. Neither one replaces the other."
  },
  {
    q: "Can you work with my existing ad account or do I need a new one?",
    a: "Your existing account works fine. We audit what's already running, fix what's broken, and build from there. No need to start from scratch unless your account has policy violations or a bad history. We work with what you've got and make it better."
  },
  {
    q: "What platforms should my business be on?",
    a: "Depends on where your customers actually spend time. B2B? LinkedIn. Visual products? Instagram. Local services? Facebook. Video content? YouTube. We don't put you on every platform just to bill more hours. We pick the ones that actually move your business and ignore the rest."
  }
];

export default function SmmServiceView() {
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
                <Target className="w-4 h-4" />
                Social Media Marketing
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-foreground">
                Social Media Marketing Services in Delhi
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-lg md:text-xl">
                  Running a business is hard enough. You don&apos;t need another agency throwing jargon at you.
                </p>
                <p className="font-semibold text-foreground">
                  Buzzspire Media offers SMM services built around one thing. Results.
                </p>
                <p>
                  We&apos;re a social media marketing agency based in Delhi. And we run campaigns for brands who are tired of &quot;likes&quot; that don&apos;t turn into sales.
                </p>
                <p>
                  If you&apos;re searching for a social media management services partner, here&apos;s the deal. We manage your pages. We run your ads. We report the numbers every single week. No hiding behind vague metrics.
                </p>
                <p className="font-medium text-foreground">
                  Simple as that.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Get a Free Strategy Call</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>
          
          <ServiceHeroVideo slug="social-media-marketing-services-in-delhi" />
        </div>
      </section>

      {/* WHAT BUZZSPIRE ACTUALLY RUNS */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              What Buzzspire Actually Runs
            </h2>
            <div className="space-y-2 text-lg text-muted-foreground max-w-3xl mx-auto">
              <p>We&apos;re not a one-size-fits-all social media marketing company. Every brand gets a plan built around its own goals.</p>
              <p>Our social media advertising services cover everything from ad creative to targeting to daily budget checks. Nothing runs on autopilot without eyes on it.</p>
              <p className="font-semibold text-foreground">Pick a plan. Or tell us your budget. We&apos;ll build around it.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Facebook Ad Management</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Facebook still converts. When it&apos;s done right. We handle audience research, ad copy, creative testing, and daily optimization. Cold traffic, warm retargeting, lookalikes. We test it all so your budget goes toward what&apos;s actually working.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Instagram Marketing Agency</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Reels. Stories. Carousels. Instagram rewards brands that show up consistently. As an Instagram marketing agency, we plan content calendars around your audience&apos;s actual behavior, not just posting for the sake of posting.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">LinkedIn B2B Marketing Services</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                B2B is a different game. Longer sales cycles. Smarter buyers. Our LinkedIn B2B marketing services focus on thought-leadership content, decision-maker targeting, and lead forms that don&apos;t feel spammy.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">YouTube Promotion Agency</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Video builds trust faster than most formats - we use it accordingly. As a YouTube promotion agency, we handle everything from channel optimization to paid video campaigns that push watch time and subscribers.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CONTENT & ORGANIC GROWTH */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Content & Organic Growth
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paid ads work best when your organic presence backs it up. That&apos;s where this piece fits in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Social Media Content Creation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our social media content creation team builds posts, reels, and graphics that match your brand voice. Not generic templates pulled off the internet.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Organic Social Media Growth</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Organic social media growth takes patience. We won&apos;t promise overnight virality. What we will do is build a consistent posting rhythm that compounds over months, not days.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Influencer Marketing Services</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sometimes the fastest trust-builder is someone else&apos;s voice. Our influencer marketing services connect you with creators whose audience actually overlaps with yours. Not just big follower counts.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PAID ADVERTISING & LEAD GENERATION */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Paid Advertising & Lead Generation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here&apos;s where most agencies fall short. They run ads. They don&apos;t chase leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Paid Social Media Ads</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our paid social media ads are built on constant testing. New creatives. New copy. New audiences. Every two weeks, minimum.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">ROI-Driven Social Media Campaigns</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every campaign we run is ROI-driven. Meaning we track cost per lead, not just reach. If a campaign isn&apos;t pulling numbers, we kill it. Fast.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Social Media Lead Generation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Social media lead generation only works when your funnel is tight. We build the ad, the landing page, and the follow-up sequence together. Not in silos.
              </p>
            </div>
          </div>
          <div className="text-center pt-8">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Want a free audit of your current ad account? Call +91-9205386625</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Who We Work With
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <ul className="space-y-3 text-left pb-4">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>We&apos;ve run social media management services for ecommerce brands moving thousands of orders a month.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>We&apos;ve built a B2B social media marketing agency approach for tech companies selling six-figure contracts on LinkedIn.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>And we&apos;ve delivered ROI-focused Instagram marketing agency campaigns for local businesses working with tight monthly budgets.</span>
              </li>
            </ul>
            <p className="font-semibold text-foreground text-center text-xl">
              Different industries. Same standard. Numbers that hold up.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* WHY TEAMS PICK BUZZSPIRE */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Why Teams Pick Buzzspire Media
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <ul className="space-y-3 text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>You get a dedicated account manager. One person who knows your account, not a rotating cast of strangers.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>You get weekly reporting. Real campaign data, not a polished PDF once a month.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>You get a 30-day results tracking window built into every plan, so you can see what&apos;s moving and what isn&apos;t.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>And you get upfront pricing. No hidden setup fees buried in a contract.</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </section>

      {/* FAQS */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <ServiceFaqAccordion faqs={smmFaqs} />
        </ScrollReveal>
      </section>

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="social-media-marketing-services-in-delhi"
        relatedSlugs={[
          "smo-services-in-delhi",
          "video-editing-services-in-delhi",
          "graphic-design-services-in-delhi"
        ]}
      />

      {/* FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border border-border shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            {/* Subtle accent corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-foreground max-w-3xl mx-auto relative z-10">
              Work With a Delhi Team That Gets Results
            </h2>
            <div className="space-y-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
              <p>If you&apos;re in Delhi, and looking for a team that treats your ad budget like it&apos;s their own, this is it.</p>
              <p>Buzzspire Media runs SMM services with weekly transparency and a dedicated account manager on every account.</p>
              <p className="font-semibold text-foreground pt-2">Let&apos;s look at your current numbers first, no pressure.</p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Magnetic>
                <a href="tel:9205386625">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>Call 9205386625 or WhatsApp</span>
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
