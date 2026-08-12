"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  Phone,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";
import RelatedServices from "@/components/services/RelatedServices";

const videoFaqs = [
  {
    q: "How much does video editing cost in Delhi?",
    a: "Depends on your monthly output and what you're editing. A single Reel costs less than a full YouTube documentary. We quote upfront after looking at your volume, platforms, and turnaround needs. No hidden line items. No scope creep. Call +91-9205386625 and we'll break it down in five minutes."
  },
  {
    q: "How fast can you deliver edited videos?",
    a: "Standard turnaround is locked in during onboarding - not after you've already sent the footage. For retainer clients, we set weekly delivery slots so your content calendar never goes dry. Rush jobs? Possible. But we don't promise what we can't hit."
  },
  {
    q: "Can you match my brand's editing style?",
    a: "Yes. We build a brand style guide for every retainer client - color grading, text animations, transition style, music vibe. Your 50th video looks like your 5th. Consistent. Recognizable. Not a random freelancer guessing your taste every time."
  },
  {
    q: "Do you only work with agencies or direct brands too?",
    a: "Both. We run a B2B video editing service for agencies who need extra hands without hiring full-time. And we work directly with brands who want one team handling everything - from Reels to YouTube to ad creatives. One point of contact either way."
  },
  {
    q: "What formats and resolutions do you deliver?",
    a: "Whatever your platform needs. 9:16 for Reels and Shorts. 1:1 for feed posts. 16:9 for YouTube. We export per platform, not one master file resized five ways. 4K, 1080p, vertical, square - you name it, we deliver it."
  },
  {
    q: "Do you handle raw footage cleanup and color grading?",
    a: "Yes. We don't just cut - we fix. Bad lighting, shaky shots, audio hiss, off-color skin tones. Our post-production process includes color correction, sound leveling, and stabilization before a single transition goes in. You send us messy footage, we send back something that looks like it was shot in a studio."
  },
  {
    q: "Can you add subtitles and captions to my videos?",
    a: "Absolutely. And we don't mean auto-generated gibberish. We time captions to speech patterns, style them to match your brand fonts, and export SRT files if you need them for accessibility compliance. Captions increase watch time by 40% on average. We don't skip them."
  },
  {
    q: "What if I don't like the first edit?",
    a: "You get revision rounds built into every package. Not \"one and done.\" We send a first cut, you mark timestamps with feedback, and we turn around the revised version fast. Most clients nail it in two rounds. If your brief was clear, the first cut is usually 90% there."
  },
  {
    q: "Do you offer video editing for podcasts and interviews?",
    a: "Yes. Long-form interview editing is a different skill from a 15-second Reel. We clean up and pause, insert B-roll where the visual goes dead, add lower thirds for speaker names, and export in formats that work for YouTube, Spotify video, and LinkedIn. One recording, multiple outputs."
  },
  {
    q: "Can I see samples of your past work before signing up?",
    a: "Of course. We share a private portfolio link with platform-specific samples - Meta ads, YouTube explainers, e-commerce product videos, corporate reels. No generic showreel that hides the actual work. You see edits from your industry, your format, your platform. Then you decide."
  }
];

export default function VideoEditingServiceView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="w-full bg-background select-none bg-grid-pattern relative overflow-hidden">
      <div className="absolute top-12 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <ScrollReveal className="space-y-8">
            <div className="space-y-6">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video Editing Specialist
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1] text-foreground">
                Video Editing Services in Delhi
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-lg md:text-xl">
                  Your ads are only as good as the video behind them. That&apos;s it. That&apos;s the whole game.
                </p>
                <p>
                  Buzzspire Media is a digital marketing agency video editing team based in Delhi. We don&apos;t just cut clips. We build a video content creation agency engine that fuels your entire funnel, from a scroll-stopping reel to a full-length YouTube explainer.
                </p>
                <p>
                  We work as a B2B video editing service for agencies who need an extra pair of hands. And we work directly with brands who want a social media video editing agency they can call, not just email.
                </p>
                <p className="font-medium text-foreground">
                  One team. Every format. Real deadlines.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <a href="https://wa.me/919205386625" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 font-bold shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Get a Free 60-Second Sample Edit</span>
                  </Button>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} className="relative h-[500px] hidden lg:block w-full">
            {/* Custom Video Editing "Timeline UI" Visual Composition */}
            <div className="absolute inset-0 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl flex flex-col p-6 font-mono text-xs text-zinc-400">
               
               {/* Video Preview Panel */}
               <div className="h-1/2 w-full rounded-xl bg-black border border-zinc-800/50 mb-4 relative overflow-hidden flex items-center justify-center group">
                 {/* Cinematic gradient background to simulate video */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/40 to-blue-900/40"></div>
                 {/* Play Button overlay */}
                 <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                   <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                 </div>
                 {/* Timecode overlay */}
                 <div className="absolute bottom-3 left-4 text-white/70 tracking-wider">
                   00:01:24:12
                 </div>
                 <div className="absolute bottom-3 right-4 flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                   <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                   <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                 </div>
               </div>

               {/* Timeline Tracks */}
               <div className="flex-1 flex flex-col gap-2 relative">
                 {/* Playhead line */}
                 <div className="absolute top-0 bottom-0 w-px bg-red-500 left-1/3 z-20">
                   <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-sm"></div>
                 </div>
                 
                 {/* Track Headers */}
                 <div className="flex w-full h-8 bg-zinc-900/50 rounded-md border border-zinc-800/50 items-center px-2 gap-2 relative overflow-hidden">
                    <div className="w-8 shrink-0 flex items-center justify-center text-[10px]">V2</div>
                    <div className="flex-1 h-5 relative">
                      <div className="absolute left-[10%] w-[30%] h-full bg-blue-500/80 rounded-sm border border-blue-400/50 flex items-center px-1 overflow-hidden">
                        <span className="text-[8px] text-white/90 truncate">TEXT_OVERLAY.mov</span>
                      </div>
                      <div className="absolute left-[45%] w-[40%] h-full bg-blue-500/80 rounded-sm border border-blue-400/50 flex items-center px-1 overflow-hidden">
                        <span className="text-[8px] text-white/90 truncate">LOGO_ANIM.mov</span>
                      </div>
                    </div>
                 </div>

                 <div className="flex w-full h-8 bg-zinc-900/50 rounded-md border border-zinc-800/50 items-center px-2 gap-2 relative overflow-hidden">
                    <div className="w-8 shrink-0 flex items-center justify-center text-[10px]">V1</div>
                    <div className="flex-1 h-5 relative">
                      <div className="absolute left-0 w-[42%] h-full bg-indigo-500/80 rounded-sm border border-indigo-400/50 flex items-center px-1 overflow-hidden">
                        <span className="text-[8px] text-white/90 truncate">A_ROLL_MAIN.mp4</span>
                      </div>
                      <div className="absolute left-[43%] w-[55%] h-full bg-purple-500/80 rounded-sm border border-purple-400/50 flex items-center px-1 overflow-hidden">
                        <span className="text-[8px] text-white/90 truncate">B_ROLL_01.mp4</span>
                      </div>
                    </div>
                 </div>

                 <div className="flex w-full h-8 bg-zinc-900/50 rounded-md border border-zinc-800/50 items-center px-2 gap-2 relative overflow-hidden mt-1">
                    <div className="w-8 shrink-0 flex items-center justify-center text-[10px]">A1</div>
                    <div className="flex-1 h-5 relative">
                      <div className="absolute left-0 w-[98%] h-full bg-emerald-600/80 rounded-sm border border-emerald-500/50 flex items-center px-1 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center gap-[1px] opacity-50">
                          {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="w-[1px] bg-white h-full" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="flex w-full h-8 bg-zinc-900/50 rounded-md border border-zinc-800/50 items-center px-2 gap-2 relative overflow-hidden">
                    <div className="w-8 shrink-0 flex items-center justify-center text-[10px]">A2</div>
                    <div className="flex-1 h-5 relative">
                      <div className="absolute left-[20%] w-[70%] h-full bg-teal-600/80 rounded-sm border border-teal-500/50 flex items-center px-1 overflow-hidden">
                        <span className="text-[8px] text-white/90 truncate ml-1 z-10">SFX_WHOOSH.wav</span>
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center gap-[1px] opacity-30">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="w-[1px] bg-white h-full" style={{ height: `${Math.max(10, Math.random() * 80)}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                 </div>

               </div>
               
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DIGITAL MARKETING VIDEO EDITING */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Digital Marketing Video Editing That Drives Results
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground text-center">Here&apos;s the deal. Most video editors know how to trim a clip. Not many understand a marketing funnel.</p>
            <p className="font-semibold text-foreground text-center pb-2">We do both.</p>
            <p>
              Every edit we deliver is built around what happens after someone watches it. A click. A DM. A call. Our digital marketing agency video editing process starts with your campaign goal, not the raw footage.
            </p>
            <p>
              You get a dedicated account manager on every project. Not a rotating cast of freelancers. One person who knows your brand voice, your past campaigns, and your deadlines.
            </p>
            <p>
              And yes, we track results. Every client gets a 30-day results tracking window, so you&apos;re not guessing whether the edits are actually working.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SOCIAL MEDIA VIDEO EDITING */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border/40">
        <ScrollReveal className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              Social Media Video Editing Services
            </h2>
            <div className="space-y-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              <p>Reels. Shorts. Stories. Feed posts. Each one needs a different pace, different pacing on text, different hook in the first two seconds.</p>
              <p>Our social media video editing service covers all of it under one roof.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Short-Form Video Editing for Reels & Shorts</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Attention spans are brutal now. You&apos;ve got maybe 1.5 seconds before someone&apos;s thumb moves on. As a short form video editing agency, we build hooks first, then structure the rest of the video around holding attention till the end card.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">YouTube Shorts & Instagram Reels Editing</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Shorts and Reels aren&apos;t the same animal, even though they look similar. Aspect ratio matters. Caption timing matters. Even the export settings matter. Our team handles YouTube Shorts and Instagram Reels editing services for brands with platform-specific formatting baked into every delivery, not just a resized version of one master file.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground">Affordable Reels & Shorts Editing for Small Teams</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Small teams don&apos;t always have big budgets. Fair enough. We built pricing tiers specifically so smaller brands get an affordable video editing agency for reels and shorts without cutting corners on quality.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PERFORMANCE & E-COMMERCE */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Performance Marketing Video Ad Editing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ads live or die in the first three seconds. Our video ad editing for performance marketing work is built for one thing. Conversions. Not likes, not views for the sake of views.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Meta Ads Video Editing That Converts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We&apos;ve edited hundreds of ad variations for testing. Different hooks, different CTAs, different pacing. Our high converting video ad editing for Meta ads process includes multiple hook variants per video, so your media buyer has real options to test instead of one single cut.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">E-Commerce Product Video Editing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Product videos need to sell without saying &quot;buy now&quot; every five seconds. Our e-commerce video editing service focuses on showing the product doing its job. Texture. Use case. Before and after. That&apos;s what actually moves a cart to checkout. We edit for Amazon listings, Shopify product pages, and paid ad creatives alike.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">YouTube Video Editing for Brands & Creators</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Long-form content is a different beast entirely. Our YouTube video editing services for brands cover full editing, from raw footage assembly to pacing, B-roll insertion, sound design, and thumbnail-ready frame selection. We don&apos;t just cut out the silences. We shape the story so people actually stay till the end.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PACKAGES */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              Flexible Video Editing Packages
            </h2>
            <div className="space-y-2 text-lg text-muted-foreground max-w-3xl mx-auto">
              <p>No two brands need the same thing. So we don&apos;t force one package on everyone.</p>
              <p>Our custom video editing packages are built around your monthly output, not a rigid template.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Monthly Retainer for Agencies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you&apos;re an agency managing multiple client accounts, one-off projects don&apos;t scale. Our monthly retainer video editing services for agencies give you a fixed monthly capacity, weekly reporting, and one point of contact for every deliverable.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">White Label Video Editing for Agencies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your client never needs to know we exist. As a white label video editing service for marketing agencies, we work entirely under your brand name, on your timelines, with your client-facing formats.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-border/80 shadow-premium space-y-3">
              <h3 className="text-xl font-heading font-bold text-foreground">Corporate & Training Video Editing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Internal training videos. Investor decks. Company culture reels. Different tone entirely from social content. As a corporate video editing agency, we keep the pacing professional, the branding consistent, and the sound design clean, without the flashy cuts that work on Instagram but feel out of place in a boardroom.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground text-center">
            Why Work With Buzzspire Media
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-foreground text-center pb-4">Look, there&apos;s no shortage of freelance editors out there. So why work with us.</p>
            <ul className="space-y-3 text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span><strong className="text-foreground">Professional video editing services for small businesses.</strong> You get agency-level output without hiring a full in-house team.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span><strong className="text-foreground">Video editing agency with quick turnaround time.</strong> Standard delivery windows, clearly communicated upfront. No chasing us for updates.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span><strong className="text-foreground">Transparent, upfront pricing.</strong> No hidden charges after the first draft.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span><strong className="text-foreground">Weekly reporting</strong> so you always know what&apos;s in progress and what&apos;s shipped.</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </section>

      {/* PRICING */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-border/60">
        <ScrollReveal className="space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
            Pricing
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <p>
              Every plan starts with a call. We look at your monthly video volume, your platforms, and your turnaround needs before quoting anything.
            </p>
            <p className="font-semibold text-foreground">
              Upfront pricing. No surprise line items later.
            </p>
          </div>
          <div className="pt-6">
            <Magnetic>
              <a href="tel:+919205386625">
                <Button size="lg" className="rounded-full px-8 py-6 text-base bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg flex items-center gap-2 mx-auto">
                  <Phone className="w-5 h-5" />
                  <span>Call Now: +91-9205386625</span>
                </Button>
              </a>
            </Magnetic>
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

          <div className="space-y-3">
            {videoFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-border/50 bg-transparent group">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-6 text-left font-heading font-bold text-lg md:text-xl text-foreground hover:text-primary flex justify-between items-center focus:outline-none transition-colors"
                  >
                    <h3 className="pr-8">{faq.q}</h3>
                    <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary border-primary text-white rotate-45' : 'group-hover:border-primary text-muted-foreground'}`}>
                      <span className="text-lg leading-none">+</span>
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-base text-muted-foreground leading-relaxed pr-12">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* RELATED SERVICES */}
      <RelatedServices
        currentSlug="video-editing-services-in-delhi"
        relatedSlugs={[
          "social-media-marketing-services-in-delhi",
          "product-photography-services-in-delhi",
          "graphic-design-services-in-delhi"
        ]}
      />

      {/* FINAL CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-border/40">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-white border border-border shadow-xl p-10 md:p-16 text-center relative overflow-hidden space-y-8">
            {/* Subtle accent corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-foreground max-w-3xl mx-auto relative z-10">
              Ready to Get Videos That Actually Convert?
            </h2>
            <div className="space-y-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
              <p>Stop sending footage to editors who don&apos;t understand marketing.</p>
              <p className="font-semibold text-foreground">Talk to a team that does.</p>
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
