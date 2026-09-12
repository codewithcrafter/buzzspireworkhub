"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Search,
  Sparkles,
  Code,
  Share2,
  Globe,
  TrendingUp,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";

export default function EditorialHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const target = e.currentTarget.getBoundingClientRect();
    const x = (clientX - (target.left + target.width / 2)) / (target.width / 2);
    const y = (clientY - (target.top + target.height / 2)) / (target.height / 2);
    setMousePos({ x, y });
  }, [isMobile]);

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-center py-16 lg:py-20 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto overflow-visible select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        
        {/* Left Column: Editorial Content (48% approx) */}
        <div className="lg:col-span-6 space-y-7 text-left z-10">
          
          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs sm:text-sm font-semibold shadow-sm"
          >
            <MapPin className="w-4 h-4 text-secondary shrink-0" />
            <span>Digital Marketing Agency in Delhi / Delhi NCR</span>
          </motion.div>

          {/* Main Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight leading-[1.08] text-foreground"
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
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground font-sans max-w-xl leading-relaxed"
          >
            We're a digital marketing agency in Delhi that helps local businesses show up on Google, win more customers, and grow with less guesswork. From SEO to social media to web development, we build a plan around your business - not a template. Whether you run a shop in Uttam Nagar or a growing brand across Delhi NCR, our team understands the local market and what it takes to compete in it.
          </motion.p>

          {/* Primary & Secondary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Magnetic strength={0.2}>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-8 py-7 text-lg group bg-primary text-white hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto shadow-md border-0">
                  Get Free Consultation
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/digital-marketing-agency-in-delhi" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-border hover:bg-muted/40 transition-all duration-300 w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Right Column: Floating Service Stack Visual Composition (52% approx) */}
        <div className="lg:col-span-6 relative flex justify-center items-center h-[440px] sm:h-[480px] w-full">
          
          {/* Central Editorial Art Element (No 3D object, simple concentric rings) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePos.x * 4,
              y: mousePos.y * 4
            }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent flex flex-col items-center justify-center text-center shadow-inner relative z-0 backdrop-blur-xs group"
          >
            {/* Concentric subtle outline rings */}
            <div className="absolute -inset-4 rounded-full border border-border/40 pointer-events-none" />
            <div className="absolute -inset-8 rounded-full border border-border/20 pointer-events-none" />
            
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary/80 mb-1">
              BUZZSPIRE
            </span>
            <span className="text-sm font-heading font-extrabold text-foreground tracking-tight">
              Digital Growth
            </span>
            <div className="w-6 h-0.5 bg-secondary/60 my-2 rounded-full" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Agency Stack
            </span>
          </motion.div>

          {/* Card 1: SEO — Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: -30 }}
            animate={{
              opacity: 1,
              x: mousePos.x * 6,
              y: mousePos.y * 6
            }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-4 left-2 sm:left-6 w-48 sm:w-52 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-border/70 shadow-lg z-10 hover:shadow-xl hover:border-primary/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground">SEO</h4>
                <p className="text-[11px] text-muted-foreground font-medium">Search Visibility</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Google Business Profile — Top Right */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -30 }}
            animate={{
              opacity: 1,
              x: mousePos.x * 10,
              y: mousePos.y * 10
            }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="absolute top-12 right-2 sm:right-4 w-52 sm:w-56 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-border/70 shadow-lg z-10 hover:shadow-xl hover:border-emerald/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground">Google Business</h4>
                <p className="text-[11px] text-muted-foreground font-medium">Local Presence</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Social Media — Bottom Left */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 30 }}
            animate={{
              opacity: 1,
              x: mousePos.x * 8,
              y: mousePos.y * 8
            }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute bottom-10 left-0 sm:left-4 w-52 sm:w-56 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-border/70 shadow-lg z-10 hover:shadow-xl hover:border-purple/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground">Social Media</h4>
                <p className="text-[11px] text-muted-foreground font-medium">Brand Attention</p>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Web Development — Bottom Right */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 30 }}
            animate={{
              opacity: 1,
              x: mousePos.x * 12,
              y: mousePos.y * 12
            }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="absolute bottom-4 right-2 sm:right-6 w-52 sm:w-56 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-border/70 shadow-lg z-10 hover:shadow-xl hover:border-indigo/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground">Web Development</h4>
                <p className="text-[11px] text-muted-foreground font-medium">Digital Experience</p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
