import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";
import DigitalWallPanels from "@/components/hero/DigitalWallPanels";

interface DigitalWallHeroProps {
  heroBadge?: string;
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export default function DigitalWallHero({
  heroBadge,
  heading,
  description,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
}: DigitalWallHeroProps) {
  return (
    <section className="relative min-h-[calc(100svh-120px)] lg:h-[100vh] lg:min-h-[100vh] w-full flex flex-col justify-start lg:justify-between pt-10 pb-5 md:pt-12 md:pb-7 lg:py-8 px-6 md:px-10 lg:px-12 max-w-[1720px] mx-auto overflow-hidden select-none">
      {/* Top Bar Tag */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold shadow-xs backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span>{heroBadge || "Digital Marketing Agency in Delhi / Delhi NCR"}</span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
            DIGITAL WALL ACTIVE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
        </div>
      </div>

      {/* Main Grid: Left Copy (Server Rendered) + Right Digital Wall (Client Component) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mt-6 sm:mt-8 lg:mt-0 lg:my-auto py-1">
        
        {/* Left Column (Server Rendered HTML - Instant Paint) */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.08] text-foreground">
            Grow Your Business <br />
            Online — <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Right Here in Delhi
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans leading-relaxed max-w-lg">
            {description || "We're a digital marketing agency in Delhi that helps local businesses show up on Google, win more customers, and grow with less guesswork. From SEO to social media to web development, we build a plan around your business - not a template. Whether you run a shop in Uttam Nagar or a growing brand across Delhi NCR, our team understands the local market and what it takes to compete in it."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Magnetic strength={0.2}>
              <Link href={primaryCtaUrl || "/contact"} className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-7 py-6 text-base group bg-primary text-white hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto shadow-md border-0">
                  {primaryCtaText || "Get Free Consultation"}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href={secondaryCtaUrl || "/digital-marketing-agency-in-delhi"} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="rounded-full px-7 py-6 text-base border-border hover:bg-muted/40 transition-all duration-300 w-full sm:w-auto">
                  {secondaryCtaText || "Explore Services"}
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Right Column: Interactive Digital Wall Panels */}
        <DigitalWallPanels />
      </div>

      {/* Bottom Status Line */}
      <div className="relative z-10 pt-3 border-t border-border/40 pb-1 flex items-center justify-between text-xs text-muted-foreground font-medium mt-auto lg:mt-0">
        <span>Click panels to navigate • 4.5s Auto-Rotation</span>
        <span className="text-primary font-bold">5 Active Digital Channels</span>
      </div>
    </section>
  );
}
