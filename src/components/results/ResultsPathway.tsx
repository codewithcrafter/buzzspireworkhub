"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, Target, Sparkles, CheckCircle2 } from "lucide-react";

export default function ResultsPathway() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="p-8 rounded-[2.5rem] bg-slate-950 text-white border border-slate-800/90 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Ambient glow decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Growth Pathway</h3>
          <p className="text-xs text-slate-400">5-Stage Strategy Progression</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Structured Trajectory
        </span>
      </div>

      {/* 5 Stages Pathway */}
      <div className="relative z-10 space-y-3.5 pt-1">
        {[
          { step: "01", label: "Search Visibility", tag: "Phase 1: Search Reach", icon: Search, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { step: "02", label: "Organic Traffic", tag: "Phase 2: Intent Clicks", icon: TrendingUp, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
          { step: "03", label: "Engagement", tag: "Phase 3: Audience Interaction", icon: Target, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { step: "04", label: "Qualified Leads", tag: "Phase 4: Direct Inquiries", icon: Sparkles, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
          { step: "05", label: "Customer Growth", tag: "Phase 5: Business Revenue", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
        ].map((stage, idx) => {
          const StageIcon = stage.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stage.color} shrink-0`}>
                  <StageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white group-hover:text-primary transition-colors">
                    {stage.label}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">{stage.tag}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                {stage.step}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer status */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Transparent Milestones</span>
        <span className="text-slate-300 font-medium">3 to 6 Month Compound Horizon</span>
      </div>
    </motion.div>
  );
}
