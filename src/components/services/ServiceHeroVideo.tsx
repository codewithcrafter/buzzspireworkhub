"use client";

import { useState, useEffect, useRef } from "react";
import { Code, Zap, Check, Smartphone } from "lucide-react";

export interface ServiceHeroVideoProps {
  slug: string;
  fallbackVideoUrl?: string;
  badgeTitle?: string;
}

export const SERVICE_VIDEO_MAP: Record<string, { videoUrl: string; label: string; urlPath: string }> = {
  "seo-services-in-delhi": {
    videoUrl: "/uploads/SEO%20SPECIALIST.mp4",
    label: "SEO Specialist",
    urlPath: "buzzspiremedia.com/seo"
  },
  "ppc-services-in-delhi": {
    videoUrl: "/uploads/PPC%20%26%20PAID%20ADS%20SPECIALIST.mp4",
    label: "PPC & Paid Ads",
    urlPath: "buzzspiremedia.com/ppc-ads"
  },
  "smo-services-in-delhi": {
    videoUrl: "/uploads/SMO-SOCIAL%20MEDIA%20OPTIMIZION.mp4",
    label: "SMO Specialist",
    urlPath: "buzzspiremedia.com/smo"
  },
  "social-media-marketing-services-in-delhi": {
    videoUrl: "/uploads/SOCIAL%20MEDIA%20MARKETING.mp4",
    label: "Social Media Marketing",
    urlPath: "buzzspiremedia.com/smm"
  },
  "google-business-profile-management-in-delhi": {
    videoUrl: "/uploads/GOOGLE%20BUSINESS%20PROFILE%20MANAGEMENT.mp4",
    label: "GBP Specialist",
    urlPath: "buzzspiremedia.com/gmb-management"
  },
  "ecommerce-management-services-in-delhi": {
    videoUrl: "/uploads/ECOMMERCE%20OPERATION%20SPECIALIST.mp4",
    label: "Ecommerce Operations",
    urlPath: "buzzspiremedia.com/ecommerce"
  },
  "graphic-design-services-in-delhi": {
    videoUrl: "/uploads/GRAPHIC%20DESING%20SPECIALIST.mp4",
    label: "Graphic Design",
    urlPath: "buzzspiremedia.com/graphic-design"
  },
  "product-photography-services-in-delhi": {
    videoUrl: "/uploads/PRODUCT%20PHOTOGAPHY%20SPECIALIST.mp4",
    label: "Product Photography",
    urlPath: "buzzspiremedia.com/product-photography"
  },
  "video-editing-services-in-delhi": {
    videoUrl: "/uploads/VIDEO%20EDITING%20SPECIALIST.mp4",
    label: "Video Editing",
    urlPath: "buzzspiremedia.com/video-editing"
  },
  "web-development-services-in-delhi": {
    videoUrl: "/uploads/WEB%20DEVELOPMENT%20SPECIALIST.mp4",
    label: "Web Development",
    urlPath: "buzzspiremedia.com/web-development"
  }
};

export default function ServiceHeroVideo({ slug, fallbackVideoUrl, badgeTitle }: ServiceHeroVideoProps) {
  const config = SERVICE_VIDEO_MAP[slug] || {
    videoUrl: fallbackVideoUrl || "/uploads/WEB%20DEVELOPMENT%20SPECIALIST.mp4",
    label: badgeTitle || "Specialist",
    urlPath: "buzzspiremedia.com/services"
  };

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const enableVideo = () => {
      setShouldLoadVideo(true);
    };

    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // Mobile: wait for idle or first interaction to prevent choking 4G bandwidth during LCP
        const handleInteraction = () => {
          enableVideo();
          window.removeEventListener("scroll", handleInteraction);
          window.removeEventListener("touchstart", handleInteraction);
        };

        window.addEventListener("scroll", handleInteraction, { passive: true, once: true });
        window.addEventListener("touchstart", handleInteraction, { passive: true, once: true });

        const timer = setTimeout(enableVideo, 1800);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("scroll", handleInteraction);
          window.removeEventListener("touchstart", handleInteraction);
        };
      } else {
        // Desktop: load in next idle callback
        if ("requestIdleCallback" in window) {
          const idleId = (window as any).requestIdleCallback(enableVideo, { timeout: 800 });
          return () => (window as any).cancelIdleCallback(idleId);
        } else {
          const timer = setTimeout(enableVideo, 300);
          return () => clearTimeout(timer);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [shouldLoadVideo]);

  return (
    <div className="w-full flex justify-center lg:justify-end items-center self-center">
      <div className="relative w-full max-w-[580px] mx-auto lg:ml-auto lg:mr-0 py-4 sm:py-6">
        {/* Subtle background tech grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 rounded-3xl pointer-events-none -z-10" />

        {/* Top-Left Badge: PERFORMANCE 99 */}
        <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 bg-white/95 backdrop-blur-md border border-emerald-500/30 shadow-lg px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-2.5 z-20">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-extrabold text-xs shrink-0 border border-emerald-500/20">
            99
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600">Performance</span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" /> Optimized
            </span>
          </div>
        </div>

        {/* Top-Right Badge: SEO READY ✓ */}
        <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-white/95 backdrop-blur-md border border-primary/20 shadow-lg px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-2 z-20">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600">Verified</span>
            <span className="text-xs font-bold text-slate-900">Active ✓</span>
          </div>
        </div>

        {/* Browser Window Mockup Frame */}
        <div className="relative w-full rounded-[20px] bg-white border border-slate-200/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden transition-transform duration-500 -rotate-1 hover:rotate-0 z-10">
          {/* Browser Header / Controls */}
          <div className="bg-slate-50/90 border-b border-slate-200/60 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            </div>
            {/* Address Bar */}
            <div className="bg-white border border-slate-200/70 rounded-md px-3 py-0.5 text-[11px] text-slate-600 font-mono flex items-center gap-1.5 max-w-[200px] sm:max-w-[260px] truncate shadow-2xs">
              <span className="text-emerald-600 font-bold">https://</span>{config.urlPath}
            </div>
            <div className="w-4 h-4 rounded-full border border-slate-200/60 flex items-center justify-center text-[10px] text-slate-600">
              ⚙
            </div>
          </div>

          {/* Video Container inside Browser Screen */}
          <div className="relative w-full aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* High-fidelity lightweight placeholder prior to video hydration */}
            <div className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-700 z-10 pointer-events-none ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 shadow-inner">
                <Code className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase">
                {config.label}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">
                BuzzSpire Digital Engine
              </span>
            </div>

            {shouldLoadVideo && (
              <video
                ref={videoRef}
                src={config.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                onLoadedData={() => setIsVideoReady(true)}
                className={`w-full h-full object-cover block relative z-10 transition-opacity duration-700 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </div>
        </div>

        {/* Bottom-Left Badge: </ > CLEAN CODE */}
        <div className="absolute -bottom-3 left-2 sm:-bottom-4 sm:left-4 bg-slate-900 text-white border border-slate-800 shadow-md px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold flex items-center gap-1.5 z-20">
          <Code className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">&lt;/&gt;</span> {config.label.toUpperCase()}
        </div>

        {/* Bottom-Right Badge: RESPONSIVE */}
        <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:right-4 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2.5 z-20">
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
            <Smartphone className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600">Responsive</span>
            <span className="text-xs font-semibold text-slate-900">Desktop • Tablet • Mobile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
