"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";

export default function ServicesFooterVisual() {
  return (
    <div className="hidden lg:block lg:col-span-5 h-full">
      <div className="bg-muted/30 border border-slate-200/50 rounded-2xl p-8 h-full flex flex-col justify-center space-y-6 relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Campaign Overview
          </h3>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">Active</span>
        </div>
        
        <div className="space-y-4">
          {/* Fake progress bars for aesthetic */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-900">
              <span>SEO Growth</span>
              <TrendingUp className="w-3 h-3 text-green-500" />
            </div>
            <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "85%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-900">
              <span>PPC Conversions</span>
              <TrendingUp className="w-3 h-3 text-green-500" />
            </div>
            <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "70%" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
                className="h-full bg-green-500 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-900">
              <span>Social Engagement</span>
              <TrendingUp className="w-3 h-3 text-green-500" />
            </div>
            <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Multiple Channels</span>
          <span>One Unified Team</span>
        </div>
      </div>
    </div>
  );
}
