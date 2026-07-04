"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, User, ArrowRight, Tag, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// Blogs Mock Data
const blogsData = [
  {
    id: 1,
    title: "Google Core Update 2026: The Tech SEO Checklist Every SaaS Needs",
    desc: "Google's latest algorithm updates focus heavily on structural rendering speeds and semantic text layouts. Learn how to verify your Next.js page configurations to prevent search drops.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    category: "SEO",
    date: "June 24, 2026",
    readTime: "8 min read",
    author: "Devon Carter",
    featured: true
  },
  {
    id: 2,
    title: "Meta Ads Scaling: Moving Beyond Lookalike Audiences in 2026",
    desc: "With browser tracking limitations tightening, we reveal how to deploy first-party server-side conversion tags to maintain low CPA costs during high ad spend scales.",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=600&q=80",
    category: "Paid Ads",
    date: "June 18, 2026",
    readTime: "6 min read",
    author: "Marcus Vane",
    featured: false
  },
  {
    id: 3,
    title: "The Death of Lorem Ipsum: Direct Response Copywriting Strategies",
    desc: "Generic design text ruins conversion ratios. Learn our step-by-step copywriting audit checklist to capture commercial intent directly from search entry points.",
    image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80",
    category: "Strategy",
    date: "June 10, 2026",
    readTime: "5 min read",
    author: "Elena Rostova",
    featured: false
  },
  {
    id: 4,
    title: "Why Awwwards-Level UI/UX Directly Correlates With Low Ad Costs",
    desc: "Landing page conversion ratios dictate Paid CPC margins. Here is how premium animations and intuitive layouts decrease marketing CPA by up to 40%.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
    category: "Design",
    date: "May 28, 2026",
    readTime: "7 min read",
    author: "Elena Rostova",
    featured: false
  },
  {
    id: 5,
    title: "HubSpot vs Salesforce: Choosing The Right Stack For Mid-Market Growth",
    desc: "We analyze tracking parameters, migration complexities, and annual licensing structures to map the optimal CRM suite for scaling marketing pipeline leads.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    category: "MarTech",
    date: "May 15, 2026",
    readTime: "9 min read",
    author: "Marcus Vane",
    featured: false
  },
  {
    id: 6,
    title: "Reducing Checkout Abandonment by 22% With automated Email Flow Tuning",
    desc: "A review of transactional notification schedules and custom SMS triggers that convert lost e-commerce carts back into finished sales without ad retargeting.",
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80",
    category: "MarTech",
    date: "May 04, 2026",
    readTime: "5 min read",
    author: "Devon Carter",
    featured: false
  }
];

// Categories
const categories = ["All", "SEO", "Paid Ads", "Strategy", "Design", "MarTech"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering blogs
  const filteredBlogs = blogsData.filter((blog) => {
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = blogsData.find((b) => b.featured);

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative">
      <div className="absolute top-12 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />

      {/* 1. HERO HEADER */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-6">
        <ScrollReveal>
          <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
            Insights & Strategy
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter leading-none text-foreground mt-6">
            The growth playbook, <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              unfiltered & open-sourced.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            We write actionable deep-dives outlining exact marketing setups, technical configurations, and creative tests we deploy across our client roster. No high-level fluff.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="py-8 px-6 max-w-7xl mx-auto border-y border-border/50 bg-white/50 backdrop-blur-sm sticky top-[72px] lg:top-[88px] z-30">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search growth tactics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 rounded-full border-border bg-background focus-visible:ring-primary focus-visible:border-primary/50 text-sm h-11"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none justify-start md:justify-end">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all focus:outline-none ${
                    isSelected
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED BLOG POST SPOTLIGHT (only shows when search/filter is neutral) */}
      {selectedCategory === "All" && !searchQuery && featuredBlog && (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="group rounded-[2.5rem] bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-500 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 md:p-8 lg:p-12 items-center">
              
              <div className="lg:col-span-6 h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-muted relative">
                <img
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">{featuredBlog.category}</span>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{featuredBlog.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featuredBlog.readTime}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {featuredBlog.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {featuredBlog.desc}
                </p>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">{featuredBlog.author[0]}</div>
                    <span className="text-xs font-bold text-foreground">By {featuredBlog.author}</span>
                  </div>
                  <Link href={`/blog/${featuredBlog.id}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </section>
      )}

      {/* 4. ARTICLES GRID */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-10 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-xl text-foreground">
              {searchQuery || selectedCategory !== "All" ? `Search Results (${filteredBlogs.length})` : "Latest Growth Articles"}
            </h3>
          </div>
        </ScrollReveal>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground text-lg">No articles match your search query or filters.</p>
            <Button variant="link" onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} className="mt-2 text-primary font-bold">Reset Search Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs
              .filter((b) => selectedCategory !== "All" || searchQuery || !b.featured) // exclude featured only in default index view
              .map((blog, idx) => (
                <ScrollReveal key={blog.id} delay={idx * 0.08}>
                  <div className="group rounded-3xl overflow-hidden bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-500 flex flex-col h-full justify-between">
                    <div>
                      <div className="h-52 relative overflow-hidden bg-muted">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500"
                        />
                        <span className="absolute top-4 left-4 text-xs font-bold text-white bg-primary/95 px-2.5 py-1 rounded-full">{blog.category}</span>
                      </div>
                      <div className="p-8 space-y-4">
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{blog.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                        </div>
                        <h3 className="font-heading font-extrabold text-xl text-foreground group-hover:text-primary transition-colors leading-snug">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {blog.desc}
                        </p>
                      </div>
                    </div>
                    <div className="px-8 pb-8 pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                        <User className="w-3 h-3 text-muted-foreground" />
                        {blog.author}
                      </span>
                      <Link href={`/blog/${blog.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                        Read Card
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
          </div>
        )}
      </section>

      {/* 5. NEWSLETTER SIGNUP */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[3rem] bg-gradient-to-tr from-primary via-secondary to-accent p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Sparkles className="w-10 h-10 text-white/40 mx-auto animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter">
                Get the agency strategy book
              </h2>
              <p className="text-base text-white/80 leading-relaxed">
                Join 18,400+ CMOs, growth leads, and founders receiving our free weekly teardowns of actual SaaS and e-commerce campaigns.
              </p>
              <div className="max-w-md mx-auto pt-4">
                <Link href="/contact">
                  <Button className="rounded-full bg-white text-primary hover:bg-white/95 font-bold shadow-lg w-full py-6">
                    Join the Strategy List
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
