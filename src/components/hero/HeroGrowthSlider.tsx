"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Globe,
  Share2,
  CheckCircle2,
  Video,
  ShoppingBag,
  Code,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";

export interface GrowthSlide {
  id: string;
  step: string;
  label: string;
  headline: string;
  description: string;
  theme: string;
}

export const GROWTH_SLIDES: GrowthSlide[] = [
  {
    id: "found",
    step: "01",
    label: "01 / GET FOUND",
    headline: "Be Where Your Customers Are Looking.",
    description: "Build stronger visibility across Google Search and Maps so local customers can discover your business when it matters.",
    theme: "SEO + Google Business Profile"
  },
  {
    id: "noticed",
    step: "02",
    label: "02 / GET NOTICED",
    headline: "Turn Attention Into Recognition.",
    description: "Build a social presence that earns attention, creates engagement and keeps your brand in front of the right audience.",
    theme: "Social Media + Content"
  },
  {
    id: "converted",
    step: "03",
    label: "03 / GET CONVERTED",
    headline: "Turn Digital Attention Into Real Customers.",
    description: "Bring paid campaigns, landing pages and digital experiences together to turn interest into action.",
    theme: "Paid Ads + Website + Conversion"
  },
  {
    id: "grow",
    step: "04",
    label: "04 / GROW",
    headline: "Build a Digital Presence That Moves With Your Business.",
    description: "From websites and ecommerce to search, social and paid campaigns, bring your digital growth into one connected strategy.",
    theme: "Full Digital Ecosystem"
  }
];

const SLIDE_DURATION = 6000; // 6 seconds

export default function HeroGrowthSlider() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const target = e.currentTarget.getBoundingClientRect();
    const x = (clientX - (target.left + target.width / 2)) / (target.width / 2);
    const y = (clientY - (target.top + target.height / 2)) / (target.height / 2);
    setMousePos({ x, y });
  }, [isMobile, shouldReduceMotion]);

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % GROWTH_SLIDES.length);
    setProgressKey((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + GROWTH_SLIDES.length) % GROWTH_SLIDES.length);
    setProgressKey((prev) => prev + 1);
  }, []);

  const goToSlide = (idx: number) => {
    setActiveIdx(idx);
    setProgressKey((prev) => prev + 1);
  };

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const activeSlide = GROWTH_SLIDES[activeIdx];

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[100svh] min-h-[100svh] lg:h-[100vh] lg:min-h-[100vh] w-full flex flex-col justify-between py-6 md:py-8 lg:py-10 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Top Bar: Location Badge & Consistent Header Tag */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold shadow-sm backdrop-blur-md"
        >
          <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span>Digital Marketing Agency in Delhi / Delhi NCR</span>
        </motion.div>

        <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          BUZZSPIRE / DIGITAL GROWTH
        </span>
      </div>

      {/* Main Grid Content (Strictly fitted to 100vh) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto py-2">
        
        {/* Left Column — Editorial Slide Story */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6 text-left">
          
          {/* Small Slide Label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-muted border border-border text-foreground text-xs font-mono font-bold uppercase tracking-wider rounded-md"
            >
              <span>{activeSlide.label}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="text-muted-foreground">{activeSlide.theme}</span>
            </motion.div>
          </AnimatePresence>

          {/* Dynamic Headline */}
          <div className="min-h-[100px] sm:min-h-[120px] md:min-h-[140px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeSlide.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.08] text-foreground"
              >
                {activeSlide.headline}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Dynamic Supporting Paragraph */}
          <div className="min-h-[50px] sm:min-h-[60px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeSlide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm sm:text-base text-muted-foreground font-sans max-w-xl leading-relaxed"
              >
                {activeSlide.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Primary & Secondary CTAs */}
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

        {/* Right Column — Evolving Visual Ecosystem */}
        <div className="lg:col-span-5 relative flex justify-center items-center h-[260px] sm:h-[320px] md:h-[360px] w-full">
          <AnimatePresence mode="wait">
            
            {/* SLIDE 01: GET FOUND (SEO & Google Maps) */}
            {activeSlide.id === "found" && (
              <motion.div
                key="found"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: mousePos.x * 6,
                  y: mousePos.y * 6
                }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-border/80 shadow-2xl space-y-4 relative z-10"
              >
                {/* Search Input Bar Mockup */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/60 border border-border/60 shadow-inner">
                  <Search className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-foreground truncate">
                    digital marketing agency in delhi
                  </span>
                  <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    Search
                  </span>
                </div>

                {/* Google Maps Local Pack Card */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold text-foreground">Google Maps Local Pack</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Rank #1 Local
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    BuzzSpire Media • West Delhi & NCR
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                    ★ ★ ★ ★ ★ <span className="text-muted-foreground font-normal ml-1">Direct Call & Footfall Active</span>
                  </div>
                </div>

                {/* Organic Search Result Card */}
                <div className="p-3 rounded-xl bg-white border border-border/70 shadow-sm space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">
                    https://buzzspire.media/seo-services-in-delhi
                  </span>
                  <h4 className="text-xs font-bold text-primary truncate">
                    SEO Services in Delhi | Organic Search Rankings
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    Build local authority, rank on high-intent keywords, and drive long-term organic traffic.
                  </p>
                </div>
              </motion.div>
            )}

            {/* SLIDE 02: GET NOTICED (Social & Content) */}
            {activeSlide.id === "noticed" && (
              <motion.div
                key="noticed"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: mousePos.x * 8,
                  y: mousePos.y * 8
                }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-border/80 shadow-2xl space-y-4 relative z-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Creative Campaign Board</h4>
                      <p className="text-[10px] text-muted-foreground">Social & Reel Production</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    Active Media
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 text-white space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-pink-400 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> High-Hook Short Video
                    </span>
                    <span className="text-[10px] text-slate-400">High Engagement</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">
                    "Content structured to hold viewer attention and elevate brand recognition across Delhi."
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                    <span>Targeted Audience</span>
                    <span className="text-emerald-400 font-bold">Community Growth</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-border/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span className="font-bold text-foreground">Content Publishing Calendar</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Consistent Output
                  </span>
                </div>
              </motion.div>
            )}

            {/* SLIDE 03: GET CONVERTED (Paid Ads & Conversion Funnel) */}
            {activeSlide.id === "converted" && (
              <motion.div
                key="converted"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: mousePos.x * 10,
                  y: mousePos.y * 10
                }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-border/80 shadow-2xl space-y-4 relative z-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Conversion Journey</h4>
                      <p className="text-[10px] text-muted-foreground">High-Intent Traffic Funnel</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Lead Engine
                  </span>
                </div>

                {/* 4 Stage Step Diagram */}
                <div className="space-y-2">
                  {[
                    { step: "AD", label: "Target Search Ad", color: "bg-blue-50 border-blue-200 text-blue-700" },
                    { step: "VISIT", label: "High-Speed Landing Page", color: "bg-purple-50 border-purple-200 text-purple-700" },
                    { step: "ENQUIRY", label: "Direct Customer Contact", color: "bg-amber-50 border-amber-200 text-amber-700" },
                    { step: "CUSTOMER", label: "Acquired Paying Business", color: "bg-emerald-50 border-emerald-200 text-emerald-700" }
                  ].map((s, i) => (
                    <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${s.color}`}>
                      <span className="font-mono font-bold tracking-wider">{s.step}</span>
                      <span className="font-semibold">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SLIDE 04: GROW (Connected Growth Ecosystem) */}
            {activeSlide.id === "grow" && (
              <motion.div
                key="grow"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: mousePos.x * 12,
                  y: mousePos.y * 12
                }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-border/80 shadow-2xl space-y-4 relative z-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Digital Stack</h4>
                      <p className="text-[10px] text-muted-foreground">Connected Growth System</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Unified
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {["SEO", "GMB", "SOCIAL", "ADS", "WEB", "ECOMMERCE"].map((node, i) => (
                    <div key={i} className="p-2 rounded-xl bg-muted/60 border border-border/60 font-mono font-bold text-foreground">
                      {node}
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-center font-heading font-extrabold text-sm shadow-md">
                  BUZZSPIRE GROWTH ENGINE
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Control Bar & Animated Progress Line */}
      <div className="relative z-10 pt-4 border-t border-border/40 pb-2 space-y-3">
        
        {/* Active Progress Bar (6s Duration) */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            key={progressKey}
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? undefined : "100%" }}
            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          />
        </div>

        {/* Tab Controls & Arrow Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="grid grid-cols-4 gap-2 w-full sm:w-auto">
            {GROWTH_SLIDES.map((slide, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "bg-white/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  <span>{slide.step}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white hover:bg-muted border border-border/60 text-foreground hover:text-primary transition-colors shadow-xs"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white hover:bg-muted border border-border/60 text-foreground hover:text-primary transition-colors shadow-xs"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
