"use client";

import { motion } from "framer-motion";
import { Search, LayoutTemplate, Share2, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function ServicesHeroVisual() {
  return (
    <div className="hidden lg:block relative w-full h-full min-h-[500px]">
      <ScrollReveal delay={0.3} className="h-full w-full relative">
        {/* Abstract blurred background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        {/* 1. Search Pillar (Background, offset right) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 right-0 w-[280px] bg-background border border-border/80 rounded-2xl shadow-xl p-4 z-10"
        >
          {/* Minimal Browser/Search UI */}
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="bg-muted/50 rounded-full flex items-center px-3 py-2 gap-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <div className="h-2 w-24 bg-muted-foreground/30 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="h-2 w-3/4 bg-blue-500/80 rounded-full" />
            <div className="h-1.5 w-full bg-muted-foreground/20 rounded-full" />
            <div className="h-1.5 w-5/6 bg-muted-foreground/20 rounded-full" />
          </div>
        </motion.div>

        {/* 2. Web Pillar (Midground, offset left/center) */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-32 left-0 w-[320px] bg-background border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-20"
        >
          {/* Minimal Website Hero UI */}
          <div className="bg-muted/30 p-5 border-b border-border/50 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-lg bg-primary/20 mb-4 flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4 text-primary" />
            </div>
            <div className="h-3 w-3/4 bg-foreground/80 rounded-full mb-3" />
            <div className="h-2 w-full bg-muted-foreground/40 rounded-full mb-2" />
            <div className="h-2 w-4/5 bg-muted-foreground/40 rounded-full mb-6" />
            <div className="h-8 w-24 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-[10px] font-bold">CTA Button</div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <div className="h-16 bg-muted/50 rounded-xl" />
            <div className="h-16 bg-muted/50 rounded-xl" />
          </div>
        </motion.div>

        {/* 3. Social Pillar (Foreground, bottom right) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-4 right-12 w-[240px] bg-background border border-border/80 rounded-2xl shadow-2xl p-4 z-30"
        >
          {/* Minimal Social Post UI */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-20 bg-foreground/80 rounded-full" />
              <div className="h-1.5 w-12 bg-muted-foreground/40 rounded-full" />
            </div>
          </div>
          <div className="w-full aspect-[4/3] bg-muted/30 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
             {/* Abstract creative image placeholder */}
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10" />
             <div className="w-12 h-12 rounded-full border-[3px] border-primary/20 flex items-center justify-center relative z-10 bg-background/50 backdrop-blur-sm">
               <div className="w-8 h-8 rounded-full border-[2px] border-primary/40 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
               </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-red-500/80" />
            <div className="w-4 h-4 rounded-full bg-muted" />
            <div className="w-4 h-4 rounded-full bg-muted" />
          </div>
        </motion.div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-16 h-16 border border-primary/20 rounded-full border-dashed z-0"
        />
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-primary/40 rounded-sm rotate-45 z-0"
        />
      </ScrollReveal>
    </div>
  );
}
