import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Tag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlog } from "@/services/blog.service";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate SEO Metadata dynamically from the blog post parameters
export async function generateMetadata(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const blog = await getBlog(slug, true);

  if (!blog || blog.status !== "PUBLISHED") {
    return {
      title: "Article Not Found | BuzzSpire Media",
      description: "The requested growth playbook post could not be located.",
    };
  }

  const seoTitle = blog.seoTitle || blog.title;
  const seoDesc = blog.metaDescription || blog.excerpt;

  return {
    title: `${seoTitle} | BuzzSpire Media`,
    description: seoDesc,
    alternates: {
      canonical: `https://buzzspire.media/blog/${blog.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://buzzspire.media/blog/${blog.slug}`,
      siteName: "BuzzSpire Media Insights",
      images: blog.featuredImage ? [{ url: blog.featuredImage, width: 1200, height: 630 }] : [],
      type: "article",
      publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date(blog.createdAt).toISOString(),
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const blog = await getBlog(slug, true);

  // Redirect to 404 if post does not exist or is not published yet
  if (!blog || blog.status !== "PUBLISHED") {
    notFound();
  }

  const publishDate = blog.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : new Date(blog.createdAt).toLocaleDateString();

  return (
    <main className="w-full min-h-screen bg-background bg-grid-pattern relative pb-24">
      {/* Background radial gradient glow */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-8 font-sans">
        
        {/* Back navigation button */}
        <div>
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="rounded-full cursor-pointer font-bold gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to playbook
            </Button>
          </Link>
        </div>

        {/* Article Metadata Header block */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {blog.category}
            </span>
            {blog.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold text-muted-foreground bg-muted border border-border px-2.5 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tighter leading-tight text-foreground">
            {blog.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic border-l-2 border-primary/50 pl-4">
            {blog.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-y border-border/40 py-4 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                {blog.author[0]}
              </div>
              <span className="text-foreground font-bold">By {blog.author}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground/80" />
              <span>Published on {publishDate}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground/80" />
              <span>{blog.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Image spotlight banner */}
        {blog.featuredImage && (
          <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden bg-muted border border-border shadow-premium relative">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Rich Text content blocks */}
        <article className="prose prose-slate max-w-none pt-6 text-foreground font-medium text-sm md:text-base leading-relaxed space-y-6">
          {blog.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.trim().startsWith("## ")) {
              return (
                <h2 key={index} className="text-xl md:text-2xl font-heading font-extrabold text-foreground pt-4 mb-2">
                  {paragraph.replace("## ", "").trim()}
                </h2>
              );
            }
            if (paragraph.trim().startsWith("### ")) {
              return (
                <h3 key={index} className="text-lg md:text-xl font-heading font-extrabold text-foreground pt-3 mb-2">
                  {paragraph.replace("### ", "").trim()}
                </h3>
              );
            }
            if (paragraph.trim().startsWith("- ") || paragraph.trim().startsWith("* ")) {
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 text-muted-foreground font-semibold">
                  {paragraph.split("\n").map((li, idx) => (
                    <li key={idx}>{li.replace(/^[-*]\s+/, "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-muted-foreground whitespace-pre-line leading-relaxed font-semibold font-sans">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* Footer structured playbook invite callout banner */}
        <div className="pt-12 border-t border-border/50">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1 text-primary">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">BuzzSpire Strategists</span>
              </div>
              <h4 className="text-base font-extrabold text-foreground">Want to apply these insights to your scaling pipeline?</h4>
              <p className="text-xs text-muted-foreground font-semibold">Speak directly with Devon, Marcus, and Elena about scaling conversions.</p>
            </div>
            <Link href="/contact" className="shrink-0">
              <Button variant="premium" size="sm" className="rounded-full font-bold shadow-md cursor-pointer">
                Consult With Us
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
