"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Search,
  Sparkles,
  Target,
  Globe,
  Share2,
  Video,
  ShoppingBag,
  Code,
  Layers,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";

interface DigitalWallHeroProps {
  heroBadge?: string;
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

function isSafeHref(value?: string) {
  if (!value) {
    return false;
  }

  try {
    if (value.startsWith("/")) {
      return true;
    }
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export interface WallService {
  id: string;
  code: string;
  name: string;
  tagline: string;
  color: string;
  borderColor: string;
}

export const WALL_SERVICES: WallService[] = [
  {
    id: "seo",
    code: "SEO",
    name: "Search Engine Optimization",
    tagline: "Be found when your customers search.",
    color: "from-blue-500/10 to-indigo-500/5",
    borderColor: "border-blue-500/30"
  },
  {
    id: "gmb",
    code: "GMB",
    name: "Google Business Profile",
    tagline: "Dominate local maps and business packs.",
    color: "from-emerald-500/10 to-teal-500/5",
    borderColor: "border-emerald-500/30"
  },
  {
    id: "smo",
    code: "SMO",
    name: "Social Media & Content",
    tagline: "Turn brand attention into recognition.",
    color: "from-pink-500/10 to-purple-500/5",
    borderColor: "border-purple-500/30"
  },
  {
    id: "ads",
    code: "ADS",
    name: "Paid Performance Ads",
    tagline: "Convert high-intent audience clicks.",
    color: "from-amber-500/10 to-orange-500/5",
    borderColor: "border-amber-500/30"
  },
  {
    id: "web",
    code: "WEB",
    name: "Web & Ecommerce",
    tagline: "Fast custom web applications that scale.",
    color: "from-indigo-500/10 to-blue-500/5",
    borderColor: "border-indigo-500/30"
  }
];

const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds

export default function DigitalWallHero({
  heroBadge,
  heading,
  description,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
}: DigitalWallHeroProps) {
  const [activeId, setActiveId] = useState<string>("seo");
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const target = e.currentTarget.getBoundingClientRect();
    const x = (clientX - (target.left + target.width / 2)) / (target.width / 2);
    const y = (clientY - (target.top + target.height / 2)) / (target.height / 2);

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({ x, y });
      rafRef.current = null;
    });
  }, [isMobile, shouldReduceMotion]);

  const activeIdx = WALL_SERVICES.findIndex((s) => s.id === activeId);

  const nextService = useCallback(() => {
    setActiveId((prevId) => {
      const currentIdx = WALL_SERVICES.findIndex((s) => s.id === prevId);
      const nextIdx = (currentIdx + 1) % WALL_SERVICES.length;
      return WALL_SERVICES[nextIdx].id;
    });
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextService();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, nextService]);

  const selectService = (id: string) => {
    setActiveId(id);
  };

  const activeService = WALL_SERVICES[activeIdx];

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[100svh] min-h-[100svh] lg:h-[100vh] lg:min-h-[100vh] w-full flex flex-col justify-between py-5 md:py-7 lg:py-8 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Top Bar Tag */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold shadow-xs backdrop-blur-md"
        >
          <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span>{heroBadge || "Digital Marketing Agency in Delhi / Delhi NCR"}</span>
        </motion.div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
            {activeService.code} ACTIVE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
        </div>
      </div>

      {/* Main Grid: Left Copy + Right Digital Wall (Fitted to 100vh) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-1">
        
        {/* Left Column (42% approx) */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.08] text-foreground"
          >
            Grow Your Business <br />
            Online — <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Right Here in Delhi
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans leading-relaxed max-w-lg"
          >
            We're a digital marketing agency in Delhi that helps local businesses show up on Google, win more customers, and grow with less guesswork. From SEO to social media to web development, we build a plan around your business - not a template. Whether you run a shop in Uttam Nagar or a growing brand across Delhi NCR, our team understands the local market and what it takes to compete in it.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Magnetic strength={0.2}>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-7 py-6 text-base group bg-primary text-white hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto shadow-md border-0">
                  Get Free Consultation
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="rounded-full px-7 py-6 text-base border-border hover:bg-muted/40 transition-all duration-300 w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Right Column: Architectural Digital Wall (58% approx) */}
        <div className="lg:col-span-7 h-[300px] sm:h-[360px] md:h-[400px] w-full relative">
          
          {/* DESKTOP DIGITAL WALL LAYOUT */}
          <div className="hidden lg:grid grid-cols-12 grid-rows-6 gap-3 h-full w-full">
            {WALL_SERVICES.map((s) => {
              const isActive = s.id === activeId;
              
              // Dynamic Grid Span positions based on active panel
              let colSpan = "col-span-3";
              let rowSpan = "row-span-3";

              if (isActive) {
                colSpan = "col-span-8";
                rowSpan = "row-span-6";
              } else {
                colSpan = "col-span-4";
                rowSpan = "row-span-3";
              }

              return (
                <motion.div
                  key={s.id}
                  layout={!shouldReduceMotion}
                  onClick={() => selectService(s.id)}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`${colSpan} ${rowSpan} rounded-3xl p-5 border shadow-md relative overflow-hidden cursor-pointer transition-colors ${
                    isActive
                      ? `bg-white/95 border-primary/40 shadow-xl z-20`
                      : `bg-white/70 hover:bg-white border-border/60 hover:border-primary/30 z-10`
                  }`}
                >
                  {/* Subtle Background Accent Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} pointer-events-none`} />

                  {/* Panel Content: Active vs Inactive */}
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="relative z-10 h-full flex flex-col justify-between"
                    >
                      {/* Active Header */}
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                            {s.code}
                          </span>
                          <h3 className="font-heading font-extrabold text-sm text-foreground">
                            {s.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Active Panel
                        </span>
                      </div>

                      <p className="text-xs font-medium text-muted-foreground pt-1">
                        {s.tagline}
                      </p>

                      {/* Active Panel Signature Mockup Visual */}
                      <motion.div
                        animate={{
                          x: mousePos.x * 4,
                          y: mousePos.y * 4
                        }}
                        transition={{ duration: 0.3 }}
                        className="my-auto p-3.5 rounded-2xl bg-white border border-border/70 shadow-sm space-y-2.5"
                      >
                        {s.id === "seo" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/60 border border-border/60 text-xs font-semibold">
                              <Search className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="truncate">digital marketing agency in delhi</span>
                              <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Search</span>
                            </div>
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold flex justify-between items-center">
                              <span>Google Local Pack #1</span>
                              <span className="text-emerald-600">Active Ranking</span>
                            </div>
                          </div>
                        )}

                        {s.id === "gmb" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-border/60 text-xs font-bold">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                <span>Google Maps Business Pack</span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Delhi NCR</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Direct customer phone calls & verified footfall.</p>
                          </div>
                        )}

                        {s.id === "smo" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 text-white text-xs font-bold">
                              <div className="flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5 text-pink-400" />
                                <span>Short-Form Reels</span>
                              </div>
                              <span className="text-[10px] text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded-full">SMO</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">High-hook creative videos designed for engagement.</p>
                          </div>
                        )}

                        {s.id === "ads" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                              <div className="flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-amber-600" />
                                <span>Paid Performance Funnel</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground font-semibold">
                              <span>SEARCH AD</span> → <span>LANDING</span> → <span>ENQUIRY</span>
                            </div>
                          </div>
                        )}

                        {s.id === "web" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-border/60 text-xs font-bold">
                              <div className="flex items-center gap-1.5">
                                <Code className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Next.js Web Applications</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Ultra-fast conversion-focused web architecture.</p>
                          </div>
                        )}
                      </motion.div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40 font-medium">
                        <span>Click any panel to activate</span>
                        <span className="text-primary font-bold">BuzzSpire Wall</span>
                      </div>
                    </motion.div>
                  ) : (
                    /* Inactive Compact Panel */
                    <div className="relative z-10 h-full flex flex-col justify-between items-start text-left">
                      <span className="text-xs font-mono font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {s.code}
                      </span>
                      <h4 className="font-heading font-bold text-xs text-foreground line-clamp-1">
                        {s.name}
                      </h4>
                      <div className="w-full flex items-center justify-between pt-1 border-t border-border/30 text-[10px] text-muted-foreground font-semibold">
                        <span>Activate</span>
                        <ChevronRight className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* MOBILE RESPONSIVE STACK LAYOUT */}
          <div className="flex lg:hidden flex-col h-full justify-between gap-3">
            {/* Active Panel View */}
            <div className="flex-1 rounded-2xl bg-white p-4 border border-primary/30 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {activeService.code}
                </span>
                <h3 className="font-heading font-extrabold text-xs text-foreground">
                  {activeService.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-medium my-2">
                {activeService.tagline}
              </p>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs font-semibold text-foreground">
                {activeService.code} Digital Growth Component Active
              </div>
            </div>

            {/* 5 Service Selector Tabs */}
            <div className="grid grid-cols-5 gap-1.5">
              {WALL_SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectService(s.id)}
                  className={`py-2 px-1 rounded-lg text-center text-[10px] font-mono font-bold transition-colors ${
                    s.id === activeId
                      ? "bg-primary text-white shadow-xs"
                      : "bg-white text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {s.code}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Status Line (No dots, no arrows) */}
      <div className="relative z-10 pt-3 border-t border-border/40 pb-1 flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span>Click panels to navigate • 4.5s Auto-Rotation</span>
        <span className="text-primary font-bold">5 Active Digital Channels</span>
      </div>
    </section>
  );
}
