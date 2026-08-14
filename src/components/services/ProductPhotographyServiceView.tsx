import Link from "next/link";
import {
  Camera,
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

const photographyFaqs = [
  {
    q: "How long does a product photoshoot take?",
    a: "Most small to mid-size catalogs are done within 3 to 5 working days from the day we receive your products."
  },
  {
    q: "Do you handle Amazon-compliant images?",
    a: "Yes. Every image we shoot for Amazon listings follows their current spec guidelines, main image, white background, and required dimensions."
  },
  {
    q: "Can you shoot both white background and lifestyle images in one session?",
    a: "Yes, most clients book both together. It's more cost-effective and keeps your product's look consistent across platforms."
  },
  {
    q: "Do you ship products back after the shoot?",
    a: "Yes, once the shoot is complete, we return your products or hold them for your next batch if you're a recurring client."
  },
  {
    q: "Is retouching included in the price?",
    a: "Yes, basic color correction and background cleanup is included in every package. Heavier retouching is quoted separately upfront."
  }
];

export default function ProductPhotographyServiceView() {
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
                <Camera className="w-4 h-4" />
                Product Photography Specialist
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-foreground">
                Product Photography Services in Delhi
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-lg md:text-xl">
                  Looking for product photography services that actually sell your product? You&apos;re in the right place.
                </p>
                <p>
                  Buzzspire Media is a Delhi based product photoshoot agency. We shoot for D2C founders, Amazon sellers, Shopify stores, and small boutique labels.
                </p>
                <p className="font-semibold text-foreground">
                  Got one product or a hundred? We shoot it all.
                </p>
                <p>
                  Real talk, most product photos online look flat. Boring lighting. Weird shadows. Colors that don&apos;t match the actual product. That&apos;s not what we do.
                </p>
                <p>
                  We do professional product photographer level work, every single time. Clean shots. Sharp focus. Colors that match what&apos;s in your hand.
                </p>
                <p className="font-medium text-foreground">
                  If you sell online, your photos are your salesperson. They better look the part.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Book Your Studio Session</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </div>
          
          <ServiceHeroVideo slug="product-photography-services-in-delhi" />
        </div>
      </section>

      {/* WHAT BUZZSPIRE ACTUALLY SHOOTS */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              What Buzzspire Actually Shoots
            </h2>
            <div className="space-y-2 text-lg text-muted-foreground max-w-3xl mx-auto">
              <p>Buzzspire isn&apos;t just another studio with a camera and a white sheet. We&apos;re a full setup for online store photography, built around what actually gets clicks and conversions.</p>
              <p>Here&apos;s the deal. Our team has shot thousands of products. Jewelry, apparel, electronics, skincare, packaged food, furniture. You name it.</p>
              <p className="font-semibold text-foreground">We know what Amazon wants. We know what Shopify stores need. We know what stops the scroll on Instagram.</p>
              <p>That&apos;s the whole point of a proper product photoshoot agency. One team. One studio. Every format you need.</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* E-COMMERCE & CATALOG PHOTOGRAPHY */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              E-Commerce & Catalog Photography
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This is where most of our clients start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Catalog Shoots</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                We run full e-commerce catalog shoots for brands with big inventories. Fifty SKUs, five hundred SKUs, doesn&apos;t matter. We&apos;ve got a system for it. Need clean white background product photos for your listings? That&apos;s our bread and butter. Pure white, evenly lit, zero shadows where they shouldn&apos;t be.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Amazon Product Photography</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Selling on Amazon? Our Amazon product photography follows their exact spec sheet. Main image, infographics, lifestyle shots, the works. No rejected listings because of a bad crop or wrong background.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Shopify Product Photographer</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Running a Shopify store? We work as your Shopify product photographer, shooting images sized and styled exactly for your theme and product pages.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CREATIVE & LIFESTYLE PHOTOGRAPHY */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Creative & Lifestyle Photography
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sometimes a plain white background isn&apos;t enough. You need mood. Context. A story.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Lifestyle Product Photography</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our lifestyle product photography puts your product in a real setting. Someone&apos;s hand holding it. A styled desk. A kitchen counter. Whatever fits your brand.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Creative Product Shoots</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We also do creative product shoots for brands that want something bolder. Colored backdrops, props, unusual angles. This is where we get to have fun.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Flat Lay Product Photography</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                And for flat-focused catalogs, we shoot clean flat lay product photography. Great for skincare, food, accessories, anything that photographs well from directly above.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SPECIALIZED PRODUCT SHOOTS */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Specialized Product Shoots
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Some products need a different approach entirely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Ghost Mannequin Photography</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For apparel brands, we offer ghost mannequin photography. Your clothing looks worn without an actual model in the shot. It&apos;s the industry standard for a reason, it just looks better.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Product Videography Services</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                And if static images aren&apos;t cutting it anymore, we&apos;ve got you. Our product videography services cover 360 spins, unboxing clips, and short-form video built for ads and product pages.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* WHY BRANDS CHOOSE BUZZSPIRE */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Why Brands Choose Buzzspire
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground text-center pb-4">There are plenty of studios in Delhi. Here&apos;s what actually makes us different.</p>
            <ul className="space-y-3 text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>We&apos;re not just a product photography service for e-commerce vendors. We&apos;re a partner your listings can rely on, shoot after shoot, month after month.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>We&apos;re an Amazon and Shopify compliant product photography agency. Your images pass spec checks the first time. No back and forth, no rejected uploads.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>If you&apos;re a D2C brand chasing sales, our high conversion product photography for DTC brands work is built around one thing only, getting people to click &quot;add to cart.&quot;</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>Running paid ads on Instagram? Our creative lifestyle product photography for Instagram ads is shot specifically for the scroll, the crop, and the thumb-stopping first frame.</span>
              </li>
            </ul>
            <div className="pt-6">
              <p className="font-semibold text-foreground text-center pb-4">A few things that come standard with every project.</p>
              <ul className="space-y-3 text-left">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span>A dedicated account manager on your project from day one</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span>Transparent, upfront pricing before we ever pick up a camera</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span>One round of revisions included on every shoot, at no extra cost.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span>Weekly delivery updates so you&apos;re never left guessing</span>
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* NICHE SHOOTS & POST-PRODUCTION */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Niche Shoots & Post-Production
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Got a category that needs something specific? We&apos;ve built dedicated processes for a few of these.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">360-Degree Product Photography in Delhi</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We shoot full 360 spins in-house - no outsourcing, no delays.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Jewelry and Apparel Product Photography</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Studio setup with macro lenses and specialized lighting rigs. Small details like stone clarity or fabric texture actually show up.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Post-Production Retouching</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                And once the shoot wraps, we don&apos;t just hand you raw files. Every image goes through e-commerce product photography with image retouching, color correction, blemish cleanup, background cleanup, all included.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PRICING */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
            Product Photography Pricing
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <p className="font-semibold text-foreground">Straight up, we don&apos;t believe in hidden costs.</p>
            <p>
              Our product photography pricing is quoted per product, per package, upfront. You&apos;ll know the exact number before you commit to anything.
            </p>
            <p>
              Small brand just starting out? We&apos;ve built affordable product photoshoot packages for small business owners who need quality shots without a studio-sized budget.
            </p>
            <p>
              Bigger catalog, bigger brand? We scale up the same way, same pricing transparency, just a bigger package.
            </p>
          </div>
          <div className="pt-6">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Ready for a quote? Call +91-9205386625 or drop us a WhatsApp message. We&apos;ll get back with pricing the same day.</span>
                </Button>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            How Your Photoshoot Actually Works
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground text-center pb-4">Getting started is simple. Here&apos;s the process.</p>
            <ul className="space-y-3 text-left">
              <li className="flex gap-2">
                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-sm mt-0.5 shrink-0 h-6">1</span>
                <span>You send us your products - either ship them to our Delhi studio or we pick up locally.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-sm mt-0.5 shrink-0 h-6">2</span>
                <span>We plan the shoot - background style, angles, lifestyle vs plain, whatever your listings need.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-sm mt-0.5 shrink-0 h-6">3</span>
                <span>We shoot and retouch - usually wrapped within a few days, not weeks.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-sm mt-0.5 shrink-0 h-6">4</span>
                <span>You get final files - sized and formatted for Amazon, Shopify, Instagram, wherever you sell.</span>
              </li>
            </ul>
            <p className="font-semibold text-foreground text-center pt-4">
              No long contracts. No confusing back and forth. Just clean images, delivered on time.
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

          <ServiceFaqAccordion faqs={photographyFaqs} />
        </ScrollReveal>
      </section>

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="product-photography-services-in-delhi"
        relatedSlugs={[
          "ecommerce-management-services-in-delhi",
          "graphic-design-services-in-delhi",
          "web-development-services-in-delhi"
        ]}
      />

      {/* FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border border-border shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            {/* Subtle accent corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-foreground max-w-3xl mx-auto relative z-10">
              Ready? Let&apos;s Shoot Your Catalog
            </h2>
            <div className="space-y-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
              <p>Your product deserves better than a phone photo under bad lighting.</p>
              <p className="font-semibold text-foreground">Buzzspire Media is ready when you are. Delhi studio, experienced team, fast delivery.</p>
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
