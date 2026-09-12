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
  Video,
  ShoppingBag,
  Code,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";

export interface CarouselSlide {
  id: string;
  num: string;
  label: string;
  title: string;
  phrase: string;
}

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "seo",
    num: "01",
    label: "SEO",
    title: "Get Found.",
    phrase: "High-intent search rankings & organic Google traffic."
  },
  {
    id: "gmb",
    num: "02",
    label: "GOOGLE BUSINESS PROFILE",
    title: "Own Your Local Presence.",
    phrase: "Dominating local search packs across Delhi NCR."
  },
  {
    id: "smo",
    num: "03",
    label: "SOCIAL MEDIA",
    title: "Get People Talking.",
    phrase: "High-hook Reels and brand-building content."
  },
  {
    id: "ads",
    num: "04",
    label: "PAID ADS",
    title: "Turn Attention Into Action.",
    phrase: "Targeted PPC campaigns & high-converting funnels."
  },
  {
    id: "web",
    num: "05",
    label: "WEB & ECOMMERCE",
    title: "Build Something That Works.",
    phrase: "Fast, responsive web apps designed for sales."
  }
];

const AUTOPLAY_INTERVAL = 4800; // 4.8 seconds

export default function HeroCarousel() {
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
    setActiveIdx((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    setProgressKey((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
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
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Index calculations for 3D Carousel Depth (Previous, Active, Next)
  const prevIdx = (activeIdx - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
  const nextIdx = (activeIdx + 1) % CAROUSEL_SLIDES.length;

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[100svh] min-h-[100svh] lg:h-[100vh] lg:min-h-[100vh] w-full flex flex-col justify-between py-6 md:py-8 lg:py-10 px-4 md:px-8 lg:px-12 max-w-[1720px] mx-auto overflow-hidden select-none"
    >
      {/* Top Header Tag */}
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

        {/* Counter Tag */}
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-primary uppercase">
          <span>{CAROUSEL_SLIDES[activeIdx].num}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">05</span>
        </span>
      </div>

      {/* Main Grid Content (Strictly fitted to 100vh viewport) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-2">
        
        {/* Left Column — Core Agency Copy */}
        <div className="lg:col-span-6 space-y-4 md:space-y-6 text-left">
          
          {/* Editorial Headline */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight leading-[1.08] text-foreground"
          >
            Grow Your Business <br />
            Online — <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Right Here in Delhi
            </span>
          </motion.h1>

          {/* Supporting Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm sm:text-base text-muted-foreground font-sans max-w-xl leading-relaxed"
          >
            We're a digital marketing agency in Delhi that helps local businesses show up on Google, win more customers, and grow with less guesswork. From SEO to social media to web development, we build a plan around your business - not a template. Whether you run a shop in Uttam Nagar or a growing brand across Delhi NCR, our team understands the local market and what it takes to compete in it.
          </motion.p>

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
              <Link href="/digital-marketing-agency-in-delhi" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="rounded-full px-7 py-6 text-base border-border hover:bg-muted/40 transition-all duration-300 w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Right Column — Horizontal 3D Depth Carousel Viewport */}
        <div className="lg:col-span-6 relative flex items-center justify-center h-[280px] sm:h-[340px] md:h-[380px] w-full overflow-hidden">
          
          <div className="relative w-full max-w-md h-full flex items-center justify-center">
            
            {/* PREVIOUS SLIDE PREVIEW (Partially visible on Left Edge) */}
            <motion.div
              key={`prev-${prevIdx}`}
              onClick={prevSlide}
              initial={{ scale: 0.8, opacity: 0.3, x: "-85%" }}
              animate={{ scale: 0.82, opacity: 0.45, x: "-70%" }}
              transition={{ duration: 0.5 }}
              className="absolute w-[240px] sm:w-[280px] p-4 rounded-3xl bg-white/60 backdrop-blur-sm border border-border/50 shadow-md cursor-pointer pointer-events-auto z-0 filter blur-[0.5px]"
            >
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                {CAROUSEL_SLIDES[prevIdx].label}
              </span>
              <h3 className="font-heading font-extrabold text-sm text-foreground mt-2 truncate">
                {CAROUSEL_SLIDES[prevIdx].title}
              </h3>
            </motion.div>

            {/* ACTIVE SLIDE (Center Prominent, Draggable & Interactive) */}
            <motion.div
              key={`active-${activeIdx}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.x < -40) nextSlide();
                if (info.offset.x > 40) prevSlide();
              }}
              initial={{ scale: 0.9, opacity: 0.5, y: 10 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                x: mousePos.x * 5
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-[320px] sm:max-w-[360px] p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-border/80 shadow-2xl z-20 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {CAROUSEL_SLIDES[activeIdx].label}
                </span>
                <span className="text-xs font-mono font-extrabold text-muted-foreground">
                  {CAROUSEL_SLIDES[activeIdx].num} / 05
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground tracking-tight mb-1">
                {CAROUSEL_SLIDES[activeIdx].title}
              </h2>
              <p className="text-xs text-muted-foreground font-sans mb-4">
                {CAROUSEL_SLIDES[activeIdx].phrase}
              </p>

              {/* Dynamic Visual Mockup per Active Slide */}
              <div className="rounded-2xl bg-muted/40 p-3.5 border border-border/50">
                {activeIdx === 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-border/60 shadow-xs text-xs">
                      <Search className="w-3.5 h-3.5 text-primary" />
                      <span className="font-semibold text-foreground truncate">SEO & Google Local Rankings</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                      <span>Google Maps Local Pack #1</span>
                      <span className="text-emerald-600">Active</span>
                    </div>
                  </div>
                )}

                {activeIdx === 1 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-border/60 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>Google Business Profile</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">GMB Delhi</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Direct customer calls, location reviews & business footfall.</p>
                  </div>
                )}

                {activeIdx === 2 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 text-white text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <Video className="w-3.5 h-3.5 text-pink-400" />
                        <span>Reels & Brand Content</span>
                      </div>
                      <span className="text-[10px] text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded-full">SMO</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">High-hook short-form videos designed for community reach.</p>
                  </div>
                )}

                {activeIdx === 3 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <Target className="w-3.5 h-3.5 text-amber-600" />
                        <span>PPC Conversion Funnel</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground font-semibold">
                      <span>AD</span> → <span>LANDING</span> → <span>ENQUIRY</span>
                    </div>
                  </div>
                )}

                {activeIdx === 4 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-border/60 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Next.js Web & Ecommerce</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Fast, conversion-focused custom web applications.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* NEXT SLIDE PREVIEW (Partially visible on Right Edge) */}
            <motion.div
              key={`next-${nextIdx}`}
              onClick={nextSlide}
              initial={{ scale: 0.8, opacity: 0.3, x: "85%" }}
              animate={{ scale: 0.82, opacity: 0.45, x: "70%" }}
              transition={{ duration: 0.5 }}
              className="absolute w-[240px] sm:w-[280px] p-4 rounded-3xl bg-white/60 backdrop-blur-sm border border-border/50 shadow-md cursor-pointer pointer-events-auto z-0 filter blur-[0.5px]"
            >
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                {CAROUSEL_SLIDES[nextIdx].label}
              </span>
              <h3 className="font-heading font-extrabold text-sm text-foreground mt-2 truncate">
                {CAROUSEL_SLIDES[nextIdx].title}
              </h3>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom Bar: Progress Indicator & Navigation Controls */}
      <div className="relative z-10 pt-4 border-t border-border/40 pb-2 space-y-3">
        
        {/* Active Progress Bar (4.8s Autoplay Timer) */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            key={progressKey}
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? undefined : "100%" }}
            transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          />
        </div>

        {/* Carousel Pagination & Arrows */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {CAROUSEL_SLIDES.map((slide, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "bg-white/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {slide.num}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white hover:bg-muted border border-border/60 text-foreground hover:text-primary transition-colors shadow-xs"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white hover:bg-muted border border-border/60 text-foreground hover:text-primary transition-colors shadow-xs"
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
