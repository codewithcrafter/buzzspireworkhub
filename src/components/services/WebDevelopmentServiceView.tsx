import Link from "next/link";
import {
  Code,
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

const webFaqs = [
  {
    q: "How long does a custom website build take?",
    a: "Most projects go live in 3-6 weeks, depending on scope. E-commerce builds with payment gateway integration usually run a bit longer."
  },
  {
    q: "Do you work with small businesses or only big brands?",
    a: "Both. Our custom web development services for small businesses are priced and scoped differently from our B2B or enterprise builds."
  },
  {
    q: "Can you redesign my existing WordPress site without losing my rankings?",
    a: "Yes. Our mobile responsive website redesign company process includes an SEO audit before we touch a single page, so your existing traffic doesn't take a hit."
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes. Every client gets 30-day results tracking and weekly reporting after launch, plus a dedicated account manager for anything that comes up after."
  },
  {
    q: "How much does a custom website cost in Delhi?",
    a: "Depends on what you're building. A basic business site starts lean. E-commerce with payment gateways needs more firepower. We quote upfront before writing a single line of code. No scope creep. No surprise invoices. Call +91-9205386625 and we'll walk you through it."
  },
  {
    q: "Will my website rank on Google after launch?",
    a: "Not automatically. But we build every site SEO-ready from day one - clean code, fast load times, proper heading structure, and mobile-first design. Rankings need content and backlinks after launch too. That's why we offer a web development and digital marketing package if you want the full pipeline."
  },
  {
    q: "Do you build websites for startups and small businesses only in Delhi?",
    a: "We work with anyone who needs a site that actually converts - startups, small businesses, B2B firms, even enterprise teams. Our custom web development services for small businesses are scoped differently from our B2B builds, but the quality doesn't drop. Delhi is our base, but we work with clients across India."
  },
  {
    q: "What happens if my website breaks after launch?",
    a: "You don't get left hanging. Every project gets 30-day results tracking after go-live, plus a dedicated account manager who picks up the phone. For ongoing maintenance, we have support plans that cover updates, security patches, and anything that breaks - because something always breaks eventually."
  },
  {
    q: "Can you build a website that loads in under 3 seconds?",
    a: "That's the baseline, not the goal. Website speed optimization is baked into every build - image compression, lazy loading, clean code, fast hosting setup. A slow site kills conversions before your copy gets read. We don't let that happen."
  },
  {
    q: "Do I own the website and code after it's built?",
    a: "100%. Everything we build is yours - the code, the design files, the admin access. No lock-ins. No \"platform fees\" six months later. We hand over the keys and teach your team how to use them. If you want us to keep managing it, that's your call. Not ours."
  }
];

export default function WebDevelopmentServiceView() {
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
                <Code className="w-4 h-4" />
                Web Development Specialist
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-foreground">
                Professional Website Development Services in Delhi
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-lg md:text-xl">
                  Looking for web development services that actually move the needle? Good. You&apos;ve landed in the right spot.
                </p>
                <p>
                  We&apos;re Buzzspire. A web development agency working out of Delhi.
                </p>
                <p>
                  We don&apos;t just build websites. We build platforms that load fast, rank well, and turn visitors into customers.
                </p>
                <p>
                  Professional website development isn&apos;t about a pretty template anymore. It&apos;s about clean code, smart design, and a team that picks up the phone.
                </p>
                <p className="font-medium text-foreground">
                  That&apos;s the web design and development services model we run on. Simple. Direct. No fluff.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Talk to our Dev Team</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </div>
          
          <ServiceHeroVideo slug="web-development-services-in-delhi" />
        </div>
      </section>

      {/* WEB DEVELOPMENT AGENCY YOU CAN TRUST */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Web Development Agency You Can Trust
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground text-center">Trust isn&apos;t claimed. It&apos;s earned.</p>
            <ul className="space-y-3 text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>Every project gets a dedicated account manager. One person. One number. No bouncing between five different &quot;specialists.&quot;</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>We track results for the first 30 days after your site goes live. No extra charge. No fine print.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>You&apos;ll get weekly reporting too. Real numbers. Real traffic. Real load times. Not a PDF full of jargon nobody reads.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>Pricing is upfront from day one. You&apos;ll know the cost before we write a single line of code.</span>
              </li>
            </ul>
            <div className="pt-6">
              <Magnetic>
                <a href="tel:+919205386625">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                    <Phone className="w-5 h-5" />
                    <span>Ready to talk numbers? Call +91-9205386625 or drop us a WhatsApp message right now.</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CUSTOM WEB DEVELOPMENT */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
            Custom Web Development Company Built for Your Business
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <p>
              Off-the-shelf builds break. They slow down. They can&apos;t handle real traffic.
            </p>
            <p>
              As a custom web development company, we start from your actual business needs. Not a template someone else already used a thousand times.
            </p>
            <p>
              Your industry. Your customers. Your goals. That&apos;s what shapes the build.
            </p>
            <p className="font-semibold text-foreground">
              The result? A site that fits your business the way a made-to-order suit fits better than something off the rack.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* OUR WEB DEVELOPMENT SERVICES */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              Our Web Development Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here&apos;s what falls under our roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-2 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Responsive Web Design Agency</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Your site needs to look right on a phone, a tablet, and a 27-inch monitor. All at once. As a responsive web design agency, that&apos;s the baseline. Not an upgrade. Not an add-on.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">E-commerce Website Development</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Selling online needs more than a shopping cart icon. Our e-commerce website development covers product pages that convert, checkout flows that don&apos;t lose customers halfway, and back-end systems that don&apos;t crash on sale day.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">WordPress Web Development</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                WordPress still runs a huge chunk of the internet. And there&apos;s a reason for that. Our WordPress web development work covers custom themes, plugin builds, and migrations that don&apos;t break your SEO in the process.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Full-Stack Web Development</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Front-end. Back-end. Database. Server logic. Full-stack web development means one team handles the whole stack, so nothing gets lost between hand-offs.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Custom CMS Development</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Generic CMS platforms box you in. Custom CMS development means you get an admin panel built around how your team actually works. Not the other way around.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">UI/UX Web Design Services</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Good design isn&apos;t just about looking nice. It&apos;s about getting out of the user&apos;s way. Our UI/UX web design services start with how people actually move through a page. Where they click. Where they drop off. Where they get stuck.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-2 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Website Speed Optimization</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                A slow site kills conversions before your copy even gets read. Website speed optimization is baked into every build. Not bolted on after launch.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 lg:col-span-3 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">SEO-Friendly Website Design</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                A beautiful site that Google can&apos;t crawl properly is a wasted site. SEO-friendly website design means clean code, proper heading structure, and fast load times from the ground up. Rankings start with the build, not just the content.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SOLUTIONS FOR EVERY BUSINESS */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Custom Web Development Services for Small Businesses</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Small budgets don&apos;t mean small results. Our custom web development services for small businesses are built to scale. Start lean, add features as revenue grows. No need to rebuild from scratch a year later.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">High Converting B2B Website Development Company</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                B2B buyers research longer and expect more proof before they reach out. As a high converting B2B website development company, we build sites around trust signals, case studies, and lead capture that actually gets used by your sales team.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Web Development and Digital Marketing Package for Startups</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A website alone doesn&apos;t fill your pipeline. Our web development and digital marketing package for startups pairs the build with the traffic strategy behind it. SEO, ads, content - all pointed at the same goal. Building from zero? Talk to us before you write a single spec.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Affordable Custom WordPress Development Services</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Custom doesn&apos;t have to mean expensive. Our affordable custom WordPress development services give you a tailored build without enterprise-level pricing. Upfront quotes. No surprise invoices later.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Mobile Responsive Website Redesign Company</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Old site dragging you down? Loading slow on mobile? Losing visitors before they even scroll? As a mobile responsive website redesign company, we rebuild what&apos;s broken and keep what&apos;s already working. No need to throw out your existing SEO rankings in the process.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">E-commerce Web Development with Payment Gateway Integration</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Checkout is where sales get won or lost. Our e-commerce web development with payment gateway integration covers Razorpay, Stripe, PayPal, and other gateways your customers already trust. Secure. Fast. Tested before launch, not after.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FULL SERVICE DIGITAL MARKETING */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Full Service Digital Marketing and Website Design Agency
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p>Some agencies build the site and stop there.</p>
            <p>
              We&apos;re a full service digital marketing and website design agency. Your site launches, and then we keep working - SEO, ads, content, the whole pipeline.
            </p>
            <p className="font-semibold text-foreground">
              One team. One point of contact. One dedicated account manager who already knows your business inside out.
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

          <ServiceFaqAccordion faqs={webFaqs} />
        </ScrollReveal>
      </section>

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="web-development-services-in-delhi"
        relatedSlugs={[
          "seo-services-in-delhi",
          "ecommerce-management-services-in-delhi",
          "social-media-marketing-services-in-delhi"
        ]}
      />
      {/* FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border border-border shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            {/* Subtle accent corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-foreground max-w-3xl mx-auto relative z-10">
              Get Started With Our Web Development Team
            </h2>
            <div className="space-y-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
              <p>You&apos;ve read this far. That tells us something.</p>
              <p>Tell us what you&apos;re building, and we&apos;ll walk you through pricing, timelines, and next steps - no pressure, no jargon.</p>
              <p className="font-semibold text-foreground pt-2">Buzzspire. Delhi. Web development services that actually deliver.</p>
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
