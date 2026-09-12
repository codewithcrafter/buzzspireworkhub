"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, User, ArrowRight, Tag, BookOpen, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Magnetic from "@/components/ui/magnetic";

// Categories list
const categories = ["All", "SEO", "Paid Ads", "Strategy", "Design", "MarTech"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [featuredBlog, setFeaturedBlog] = useState<any | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch featured post on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/blogs?featured=true&limit=1");
        if (res.ok) {
          const data = await res.json();
          if (data.blogs && data.blogs.length > 0) {
            setFeaturedBlog(data.blogs[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load featured post:", err);
      }
    };
    fetchFeatured();
  }, []);

  // Fetch paginated blogs on category, search, or page transition
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const categoryQuery = selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : "";
        const searchQueryParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
        
        // Fetch posts. Exclude featured post in normal listing if search is empty
        const isFeaturedParam = selectedCategory === "All" && !searchQuery ? "&featured=false" : "";

        const res = await fetch(`/api/blogs?page=${page}&limit=6${categoryQuery}${searchQueryParam}${isFeaturedParam}`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.blogs || []);
          setMeta(data.meta || null);
        }
      } catch (err) {
        console.error("Failed to load blogs list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page, selectedCategory, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative">
      <div className="absolute top-12 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-slow" />

      {/* 1. HERO HEADER */}
      <section className="py-20 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto text-center space-y-6">
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
      <section className="py-8 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto border-y border-border/50 bg-white/50 backdrop-blur-sm sticky top-[72px] lg:top-[88px] z-30">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search growth tactics..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
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
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all focus:outline-none cursor-pointer ${
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
        <section className="py-16 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto">
          <ScrollReveal>
            <div className="group rounded-[2.5rem] bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-500 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 md:p-8 lg:p-12 items-center">
              
              <div className="lg:col-span-6 h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-muted relative">
                {featuredBlog.featuredImage && (
                  <img
                    src={featuredBlog.featuredImage}
                    alt={featuredBlog.title}
                    className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
                  />
                )}
                <span className="absolute top-4 left-4 text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">{featuredBlog.category}</span>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {featuredBlog.publishedAt ? new Date(featuredBlog.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : new Date(featuredBlog.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featuredBlog.readTime} min read</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {featuredBlog.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {featuredBlog.excerpt}
                </p>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">{featuredBlog.author[0]}</div>
                    <span className="text-xs font-bold text-foreground">By {featuredBlog.author}</span>
                  </div>
                  <Link href={`/blog/${featuredBlog.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-secondary transition-colors">
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
      <section className="py-16 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto">
        <ScrollReveal>
          <div className="mb-10 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-xl text-foreground">
              {searchQuery || selectedCategory !== "All" ? `Search Results (${blogs.length})` : "Latest Growth Articles"}
            </h3>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-semibold mt-3">Fetching articles catalog...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground text-lg font-semibold">No articles match your search query or filters.</p>
            <Button variant="link" onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} className="mt-2 text-primary font-bold">Reset Search Filters</Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, idx) => (
                <ScrollReveal key={blog.id} delay={idx * 0.08}>
                  <div className="group rounded-3xl overflow-hidden bg-white border border-border shadow-premium hover:shadow-xl transition-all duration-500 flex flex-col h-full justify-between">
                    <div>
                      <div className="h-52 relative overflow-hidden bg-muted">
                        {blog.featuredImage && (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500"
                          />
                        )}
                        <span className="absolute top-4 left-4 text-xs font-bold text-white bg-primary/95 px-2.5 py-1 rounded-full">{blog.category}</span>
                      </div>
                      <div className="p-8 space-y-4 font-sans">
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min read</span>
                        </div>
                        <h3 className="font-heading font-extrabold text-xl text-foreground group-hover:text-primary transition-colors leading-snug">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="px-8 pb-8 pt-4 border-t border-border/50 flex items-center justify-between font-sans">
                      <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                        <User className="w-3 h-3 text-muted-foreground" />
                        {blog.author}
                      </span>
                      <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                        Read Article
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-4 select-none font-semibold">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-full cursor-pointer h-10 px-4"
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-full cursor-pointer h-10 px-4"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. NEWSLETTER SIGNUP */}
      <section className="py-24 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto">
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
                  <Button className="rounded-full bg-white text-primary hover:bg-white/95 font-bold shadow-lg w-full py-6 cursor-pointer border-0">
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
