"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Career", href: "/career" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>
                💥 Boost Your Brand: Book a <strong>Free Strategy Session</strong> today and save 15% on any marketing bundle!
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

        {/* Navbar */}
        <nav
          className={`w-full transition-all duration-500 border-b ${isScrolled
              ? "py-4 bg-background/80 backdrop-blur-md border-border/50 shadow-premium"
              : "py-6 bg-transparent border-transparent"
            }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="font-heading font-extrabold text-2xl md:text-3xl tracking-tighter text-foreground group flex items-center gap-1 select-none">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">BuzzSpire</span>
              <span className="text-accent animate-pulse font-black text-3xl">.</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`relative font-sans text-sm font-semibold tracking-wide hover-underline-animation py-2 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Magnetic Button */}
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

        {/* Mobile Full Screen Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden fixed inset-0 top-[inherit] bg-background/95 backdrop-blur-lg z-40 flex flex-col justify-center px-8"
              style={{ height: "100vh" }}
            >
              <div className="flex flex-col gap-6 text-center">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link
                        href={link.href}
                        className={`font-heading text-3xl font-bold tracking-tight block py-2 ${isActive ? "text-gradient" : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: navLinks.length * 0.08 }}
                  className="mt-8 flex justify-center"
                >
                  <Link href="/contact" className="w-full max-w-xs">
                    <Button size="lg" className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-6">
                      Book Free Consultation
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
