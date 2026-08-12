"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Mail, Send, Globe, CheckCircle2 } from "lucide-react";
import { Facebook, Linkedin, Instagram } from "@/components/ui/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubmitted(true);
    setEmail("");
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-muted pt-24 pb-12 border-t border-border/50">
      {/* Outer wrapper */}
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top footer section: grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Logo and Pitch */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="group flex items-center select-none">
              <Image
                src="/logo-full.png"
                alt="BuzzSpire Media"
                width={417}
                height={120}
                className="h-9 md:h-10 w-auto group-hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
              We are an award-winning digital growth agency crafting high-performance digital marketing, premium brand styling, and custom web experiences for global brands.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://www.facebook.com/buzzspiremedia/", name: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/buzzspiremedia/", name: "Instagram" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/buzzspire-media-pvt-ltd", name: "LinkedIn" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 shadow-premium"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-heading font-bold text-base text-foreground tracking-wide uppercase">Agency</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Our Services", href: "/services" },
                { name: "Latest Blog", href: "/blog" },
                { name: "Careers", href: "/career" },
                { name: "Contact Us", href: "/contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm font-medium hover-underline-animation"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Quick Links */}
          <div className="space-y-5">
            <h4 className="font-heading font-bold text-base text-foreground tracking-wide uppercase">Services</h4>
            <ul className="space-y-3">
              {[
                { name: "SEO Optimization", href: "/services#seo" },
                { name: "Google & Meta Ads", href: "/services#ads" },
                { name: "Content Strategy", href: "/services#content" },
                { name: "Branding & Strategy", href: "/services#branding" },
                { name: "UI/UX & Engineering", href: "/services#web" },
                { name: "Automation & Analytics", href: "/services#analytics" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm font-medium hover-underline-animation"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-5">
            <h4 className="font-heading font-bold text-base text-foreground tracking-wide uppercase">Newsletter</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Stay ahead of the curve. Get curated marketing insights and trends in your inbox weekly.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Your work email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-12 rounded-full border-border bg-background focus-visible:ring-primary focus-visible:border-primary/50 text-sm h-11"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 w-9 h-9 rounded-full bg-primary hover:bg-primary-foreground hover:text-primary transition-all duration-300"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
              
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 p-2 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Subscribed! Welcome to the loop.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Bottom footer: Copyright and links */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} BuzzSpire Media Inc. All rights reserved. Made for Awwwards inspection.
          </p>
          <div className="flex gap-6 justify-center">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-24 z-50 w-12 h-12 rounded-full shadow-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5 animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
