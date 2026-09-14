"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles, ChevronDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";
import { servicesData } from "@/data/servicesData";
import { getServiceIcon } from "@/components/services/ServiceIcon";

const standardNavLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Blog", href: "/blog" },
  { name: "Career", href: "/career" },
  { name: "Contact", href: "/contact" },
  { name: "Client Portal", href: "/login" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesHovered(false);
    setIsMobileServicesOpen(false);
  }, [pathname]);

  const isServicesActive = pathname.startsWith("/digital-marketing-agency-in-delhi");

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Announcement Bar */}
        <AnimatePresence>
          {showAnnouncement && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gradient-to-r from-primary via-secondary to-accent text-white px-4 py-2 text-center text-xs md:text-sm font-medium flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
              <span className="truncate">
                💥 Boost Your Brand in Delhi: Book a <strong>Free Strategy Session</strong> today!
              </span>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white transition-colors"
                aria-label="Close Announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navbar */}
        <nav
          className={`w-full transition-all duration-500 border-b ${
            isScrolled
              ? "py-4 bg-background/90 backdrop-blur-md border-border/50 shadow-premium"
              : "py-6 bg-transparent border-transparent"
          }`}
        >
          <div className="w-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-12 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center select-none">
              <Image
                src="/logo-full.png"
                alt="BuzzSpire Media"
                width={417}
                height={120}
                priority
                className="h-9 md:h-10 w-auto group-hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6 relative">
                <Link
                  href="/"
                  className={`font-sans text-sm font-semibold tracking-wide hover-underline-animation py-2 transition-colors ${
                    pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Home
                </Link>

                <Link
                  href="/about"
                  className={`font-sans text-sm font-semibold tracking-wide hover-underline-animation py-2 transition-colors ${
                    pathname === "/about" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  About
                </Link>

                {/* SERVICES MEGA-MENU ITEM */}
                <div
                  className="relative py-2"
                  onMouseEnter={() => setIsServicesHovered(true)}
                  onMouseLeave={() => setIsServicesHovered(false)}
                >
                  <Link
                    href="/digital-marketing-agency-in-delhi"
                    className={`inline-flex items-center gap-1 font-sans text-sm font-semibold tracking-wide hover-underline-animation py-1 transition-colors ${
                      isServicesActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isServicesHovered ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </Link>

                  {/* Desktop Mega-Menu Dropdown */}
                  <AnimatePresence>
                    {isServicesHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute top-full -left-20 w-[680px] bg-white rounded-3xl border border-border/70 shadow-2xl p-6 z-50 overflow-hidden"
                      >
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/50">
                          <div>
                            <h4 className="font-heading font-extrabold text-sm text-foreground">
                              Digital Marketing Services
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Targeted growth solutions for businesses in Delhi NCR
                            </p>
                          </div>
                          <Link
                            href="/digital-marketing-agency-in-delhi"
                            className="text-xs font-bold text-primary hover:text-secondary inline-flex items-center gap-1 transition-colors"
                            onClick={() => setIsServicesHovered(false)}
                          >
                            <span>Overview</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* 2-Column Balanced Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {servicesData.map((service) => {
                            const IconComponent = getServiceIcon(service.iconName);
                            return (
                              <Link
                                key={service.slug}
                                href={`/services/${service.slug}`}
                                onClick={() => setIsServicesHovered(false)}
                                className="group p-3 rounded-2xl hover:bg-primary/5 transition-all duration-200 flex items-start gap-3 border border-transparent hover:border-primary/10"
                              >
                                <div className="w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary shrink-0 transition-colors">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <div className="flex items-center gap-1">
                                    <h5 className="font-heading font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                                      {service.navTitle}
                                    </h5>
                                    <ArrowUpRight className="w-3 h-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all shrink-0" />
                                  </div>
                                  <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
                                    {service.navShort}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Mega-menu Footer Banner */}
                        <div className="mt-4 pt-3 border-t border-border/50 bg-muted/40 -mx-6 -mb-6 p-4 px-6 flex items-center justify-between">
                          <p className="text-xs font-semibold text-foreground">
                            Not sure what you need?
                          </p>
                          <Link
                            href="/contact"
                            onClick={() => setIsServicesHovered(false)}
                            className="text-xs font-bold text-primary hover:text-secondary inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Get a Free Consultation</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/case-studies"
                  className={`font-sans text-sm font-semibold tracking-wide hover-underline-animation py-2 transition-colors ${
                    pathname.startsWith("/case-studies") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Case Studies
                </Link>

                <Link
                  href="/blog"
                  className={`font-sans text-sm font-semibold tracking-wide hover-underline-animation py-2 transition-colors ${
                    pathname === "/blog" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Blog
                </Link>

                <Link
                  href="/career"
                  className={`font-sans text-sm font-semibold tracking-wide hover-underline-animation py-2 transition-colors ${
                    pathname === "/career" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Career
                </Link>

                <Link
                  href="/contact"
                  className={`font-sans text-sm font-semibold tracking-wide hover-underline-animation py-2 transition-colors ${
                    pathname === "/contact" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Contact
                </Link>

                <Link
                  href="/login"
                  className={`font-sans text-sm font-semibold tracking-wide hover-underline-animation py-2 transition-colors ${
                    pathname === "/login" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Client Portal
                </Link>
              </div>

              {/* Magnetic Consultation Button */}
              <Magnetic strength={0.25}>
                <Link href="/contact">
                  <Button className="rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-lg px-6 py-5 group border-0">
                    Consultation
                    <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Magnetic>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-3">
              <Link href="/contact">
                <Button size="sm" className="rounded-full text-xs font-semibold px-4 py-2 bg-primary text-white border-0">
                  Consult
                </Button>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground hover:text-primary transition-colors focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 bg-background/98 backdrop-blur-xl z-40 flex flex-col overflow-y-auto px-6 py-8"
            >
              <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
                <Link
                  href="/"
                  className="font-heading text-2xl font-bold py-2 border-b border-border/40 text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                <Link
                  href="/about"
                  className="font-heading text-2xl font-bold py-2 border-b border-border/40 text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>

                {/* Mobile Services Accordion */}
                <div className="border-b border-border/40 py-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/digital-marketing-agency-in-delhi"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-heading text-2xl font-bold text-primary"
                    >
                      Services
                    </Link>
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className="p-2 text-foreground hover:text-primary"
                      aria-label="Toggle Services List"
                    >
                      <ChevronDown
                        className={`w-6 h-6 transition-transform duration-300 ${
                          isMobileServicesOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isMobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-2 pt-3 pl-2"
                      >
                        {servicesData.map((service) => {
                          const IconComponent = getServiceIcon(service.iconName);
                          return (
                            <Link
                              key={service.slug}
                              href={`/services/${service.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted text-sm font-semibold text-foreground"
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <span className="truncate">{service.navTitle}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/case-studies"
                  className={`font-heading text-2xl font-bold py-2 border-b border-border/40 ${
                    pathname.startsWith("/case-studies") ? "text-primary" : "text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Case Studies
                </Link>

                <Link
                  href="/blog"
                  className="font-heading text-2xl font-bold py-2 border-b border-border/40 text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>

                <Link
                  href="/career"
                  className="font-heading text-2xl font-bold py-2 border-b border-border/40 text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Career
                </Link>

                <Link
                  href="/contact"
                  className="font-heading text-2xl font-bold py-2 border-b border-border/40 text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                <Link
                  href="/login"
                  className="font-heading text-2xl font-bold py-2 border-b border-border/40 text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Client Portal
                </Link>

                <div className="pt-6">
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button size="lg" className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-6">
                      Get Free Consultation
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
