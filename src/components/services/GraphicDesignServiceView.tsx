import Link from "next/link";
import {
  Palette,
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

const graphicFaqs = [
  {
    q: "What's included in your Graphic Design Services?",
    a: "Logo design, brand identity, social media creatives, marketing collateral, banners, brochures, website graphics and packaging design. Pick what you need, or take it all."
  },
  {
    q: "Do you offer packages for startups and small businesses?",
    a: "Yes. We've built affordable graphic design packages specifically for smaller budgets that still need real design quality."
  },
  {
    q: "How fast is your turnaround?",
    a: "Most social media and ad creatives are delivered within 24 to 48 hours. Branding projects take longer, usually 7 to 10 days depending on scope."
  },
  {
    q: "Do you work with e-commerce brands?",
    a: "Regularly. Product graphics, catalog banners, seasonal campaign creatives, we handle it all."
  },
  {
    q: "How do I get started?",
    a: "Call 9205386625 or message us on WhatsApp. We'll set up a free consultation and walk you through the next steps."
  },
  {
    q: "Do you serve clients across all of Delhi?",
    a: "Yes. From Connaught Place to Dwarka, Rohini to South Delhi, we work with brands across the city, both remotely and in person."
  },
  {
    q: "Is there a Graphic Design Agency near me in Delhi that handles small projects too?",
    a: "Yes, us. We take on single-logo projects as well as full retainer work, no minimum project size required."
  },
  {
    q: "Do you take on small one-off projects or only big retainers?",
    a: "Both. We take on single-logo projects, one-off social media packs, and full monthly retainers alike. No minimum project size. No \"you're too small\" attitude. If you need design that works, we'll figure out the scope together."
  },
  {
    q: "What file formats do you deliver?",
    a: "Whatever you need. PNG, JPG, PDF for print. SVG and EPS for logos that need to scale. PSD or AI files if your team wants to edit later. Web-optimized assets for your site. We don't hand you one file and disappear. You get the full stack, ready to use everywhere."
  },
  {
    q: "How many revisions do I get?",
    a: "One round of revisions is included in every project, at no extra cost. We get the brief right the first time by asking the right questions upfront, so most clients don't need more than two rounds. Additional revisions are quoted separately if the scope drifts significantly."
  },
  {
    q: "Can you match my existing brand style?",
    a: "Yes. If you already have brand guidelines, we work within them. If you don't, we can audit your current visuals and build a style guide that keeps everything consistent going forward. Either way, your designs look like they came from one team, not five different freelancers."
  },
  {
    q: "What's the difference between a logo and a full brand identity?",
    a: "A logo is one mark. A brand identity is the whole system - colors, fonts, tone, patterns, how your logo sits on different backgrounds, how it scales on a business card versus a billboard. We do both, but we always recommend the full system if you're building something that lasts."
  }
];

export default function GraphicDesignServiceView() {
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
                <Palette className="w-4 h-4" />
                Graphic Design Specialist
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-foreground">
                Graphic Design Services in Delhi That Actually Get Your Brand Noticed
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-lg md:text-xl">
                  Your brand&apos;s visuals talk before your sales team ever does.
                </p>
                <p className="font-semibold text-foreground">
                  That&apos;s the whole point of good design.
                </p>
                <p>
                  At Buzzspire Media, we run graphic design services in Delhi for brands who are tired of designs that look fine but do nothing. A logo that doesn&apos;t stick. A post nobody stops scrolling for. We fix that.
                </p>
                <p>
                  We&apos;re not another agency pushing templates. We&apos;re a Delhi-based creative team built around one thing - design that sells. Whether it&apos;s campaign creatives for your next launch or a full brand identity from scratch, our team handles it end to end.
                </p>
                <p className="font-medium text-foreground">
                  Based out of Delhi, working with brands across Connaught Place, Karol Bagh, South Delhi, Dwarka, Rohini and Saket.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Talk to our Design Team</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </div>
          
          <ServiceHeroVideo slug="graphic-design-services-in-delhi" />
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              Our Core Graphic Design Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here&apos;s what we build for our clients, week after week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-2 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Social Media Post Design</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Feeds move fast. Your posts need to stop the scroll in under two seconds. We design for that exact moment.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Brand Identity Design</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Colors, fonts, tone, the whole visual language of your brand. Built once, used everywhere.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Custom Logo Design</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                No stock icons. No templates. Your logo gets designed from a blank page, for your business only.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Marketing Collateral</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Brochures, one-pagers, sales decks. The stuff your team hands out and actually needs to look sharp.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Banner and Ad Creatives</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Web banners, display ads, social ad creatives. Built to convert, not just to look pretty.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Brochure and Flyer</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Print or digital, these still work. We design them to be read, not skimmed and binned.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-2 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Website Graphic Design</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Icons, banners, section graphics, hero images. The visual layer that makes your site feel alive.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-3 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Packaging and Label Design</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                For product brands, packaging is the first impression on a shelf. We design labels that get picked up.
              </p>
            </div>
          </div>
          <div className="text-center pt-2 max-w-3xl mx-auto">
            <p className="text-base text-muted-foreground leading-relaxed">
              Every single one of these is part of our core Graphic Design Services in Delhi. And we don&apos;t hand off your project to five different freelancers either. One team, one point of contact, start to finish.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* DIGITAL MARKETING ALIGNMENT */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Digital Marketing Graphic Design Solutions
            </h2>
            <div className="space-y-2 text-lg text-muted-foreground max-w-3xl mx-auto">
              <p>Design and marketing can&apos;t work in silos. Not anymore.</p>
              <p>Our Digital Marketing Graphic Design work plugs straight into your campaigns. Ad sets, landing pages, email banners, the visuals that carry your message from click to conversion.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Best Graphic Design Agency for Digital Marketing Campaigns</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We build creatives around your campaign goals, not around what looks trendy on Behance. We optimize for CTR first, aesthetics second - the ones that pull real numbers are the ones we scale.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">High Converting Social Media Ad Design Services</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We test formats. Carousel, static, story-first. Whatever pulls the numbers for your niche, that&apos;s what we scale.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* EVERY BUSINESS SIZE */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Graphic Design Services for Every Business Size
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              You don&apos;t need to be a big brand to get design that works hard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Professional Graphic Design Services for Small Businesses</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Small teams, tight budgets, big ambitions. We work with that reality every day.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Affordable Graphic Design Packages for Startups</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pick a package. Scale it up as you grow. No long contracts forced on you.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Custom Graphic Design Services for E-commerce Brands</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Product shots, catalog banners, seasonal creatives. Built to move inventory, not just fill space.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Book a free design consultation. Call 9205386625 or message us on WhatsApp today.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* GRAPHIC DESIGN COMPANY IN DELHI */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
            Graphic Design Company in Delhi, Serving All Localities
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <p className="font-semibold text-foreground">We don&apos;t restrict work to one part of the city.</p>
            <p>
              Clients reach us from South Delhi, North Delhi, East Delhi, West Delhi, and everywhere in between. Connaught Place. Nehru Place. Lajpat Nagar. Rohini. Dwarka. Janakpuri. Doesn&apos;t matter where you&apos;re based.
            </p>
            <p>
              If you&apos;re searching for a Graphic Designer near me in Delhi, or a Logo Design Agency in Delhi, we&apos;re already set up to work with you remotely or in person.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* RETAINER SOLUTIONS */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Brand Identity & Retainer Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Custom Brand Identity and Graphic Design Services</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This isn&apos;t a one-off logo drop. It&apos;s the full system, applied consistently across everything you put out.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Graphic Design Retainer Services for Agencies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Running an agency and drowning in client design requests? We plug in as your back-end design bench. Fast turnarounds, consistent quality, your branding on top.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* WHY BUZZSPIRE */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Why Choose Buzzspire Media
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <ul className="space-y-3 text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>We assign a dedicated account manager to every single client. No chasing five different people for one update.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>You get transparent weekly reporting on design turnaround and campaign performance, with real numbers, not vague updates.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>Our pricing is upfront. No hidden charges after you&apos;ve already signed on.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>And we back campaign-linked design work with a 30-day results tracking window, so you can actually see what&apos;s working before committing further budget.</span>
              </li>
            </ul>
            <p className="font-semibold text-foreground text-center pt-4">
              That&apos;s how a real Graphic Design Agency should operate. Honestly, most don&apos;t.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ABOUT */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
            About Our Graphic Design Company in Delhi
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <p>
              Buzzspire Media runs out of Delhi, working with small businesses, startups, e-commerce brands and marketing agencies alike, right across the city.
            </p>
            <p>
              We&apos;ve built our name as a Professional Graphic Designer team in Delhi that treats every brief like it&apos;s the only one on our desk that day.
            </p>
            <p>
              Every project goes through one designer and one reviewer, not a five-person committee. That&apos;s how briefs stay clear and turnarounds stay fast.
            </p>
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

          <ServiceFaqAccordion faqs={graphicFaqs} />
        </ScrollReveal>
      </section>

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="graphic-design-services-in-delhi"
        relatedSlugs={[
          "web-development-services-in-delhi",
          "smo-services-in-delhi",
          "product-photography-services-in-delhi"
        ]}
      />

      {/* FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border border-border shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            {/* Subtle accent corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-foreground max-w-3xl mx-auto relative z-10">
              Let&apos;s Design Something That Works
            </h2>
            <div className="space-y-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
              <p>You&apos;ve read enough.</p>
              <p className="font-semibold text-foreground">Talk to our Creative Design Agency team directly.</p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Magnetic>
                <a href="tel:9205386625">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>Call +91-9205386625 or WhatsApp</span>
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
