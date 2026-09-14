import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Wrench, 
  Award, 
  Building2, 
  Quote, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Magnetic from "@/components/ui/magnetic";
import { getCaseStudyBySlug, getCaseStudies } from "@/services/caseStudy.service";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate Static Params for pre-rendering
export async function generateStaticParams() {
  try {
    const data = await getCaseStudies({ status: "PUBLISHED", limit: 100 });
    return data.caseStudies.map((cs) => ({
      slug: cs.slug,
    }));
  } catch (e) {
    return [];
  }
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);

  if (!cs || cs.status !== "PUBLISHED") {
    return {
      title: "Case Study Not Found | BuzzSpire Media",
    };
  }

  const title = cs.seoTitle || `${cs.clientName} Case Study | BuzzSpire Media`;
  const description = cs.metaDescription || cs.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: cs.canonicalUrl || `https://www.buzzspiremedia.com/case-studies/${cs.slug}`,
      siteName: "BuzzSpire Media",
      images: cs.featuredImage ? [{ url: cs.featuredImage }] : [],
      type: "article",
    },
    alternates: {
      canonical: cs.canonicalUrl || `https://www.buzzspiremedia.com/case-studies/${cs.slug}`,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dbCs = await getCaseStudyBySlug(slug);

  if (!dbCs || dbCs.status !== "PUBLISHED") {
    notFound();
  }

  // Map database fields safely
  const heroMetric = (dbCs.heroMetric as any) || { label: "Impact", value: "High" };
  const execution = (dbCs.execution as any[]) || [];
  const results = (dbCs.results as any[]) || [];
  const testimonial = (dbCs.testimonial as any) || null;

  // Fetch adjacent case studies for bottom navigation
  const allPublishedRes = await getCaseStudies({ status: "PUBLISHED", limit: 100 });
  const publishedList = allPublishedRes.caseStudies;
  const currentIndex = publishedList.findIndex((item) => item.slug === dbCs.slug);
  
  const prevStudy = publishedList[(currentIndex - 1 + publishedList.length) % publishedList.length];
  const nextStudy = publishedList[(currentIndex + 1) % publishedList.length];

  return (
    <main className="w-full bg-background select-none bg-grid-pattern relative min-h-screen">
      {/* Glow Background */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 1. BREADCRUMBS & TOP NAV */}
      <div className="pt-24 pb-6 px-6 md:px-10 lg:px-12 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/case-studies" className="hover:text-primary transition-colors">Case Studies</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold truncate">{dbCs.clientName}</span>
        </div>
      </div>

      {/* 2. HERO & TITLE SECTION */}
      <section className="py-8 px-6 md:px-10 lg:px-12 w-full max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            {dbCs.industry}
          </span>
          {dbCs.isDemo && (
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Demonstration Case Study
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-extrabold text-foreground tracking-tight leading-[1.15]">
          {dbCs.clientName}: {heroMetric.value}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-4xl leading-relaxed">
          {dbCs.shortDescription}
        </p>

        {/* Services Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">Services:</span>
          {dbCs.services.map((svc, i) => (
            <span key={i} className="px-3 py-1 rounded-lg bg-card border border-border text-xs font-semibold text-foreground shadow-sm">
              {svc}
            </span>
          ))}
        </div>
      </section>

      {/* 3. FEATURED IMAGE BANNER */}
      {dbCs.featuredImage && (
        <section className="py-6 px-6 md:px-10 lg:px-12 w-full max-w-[1400px] mx-auto">
          <div className="relative h-[300px] sm:h-[450px] md:h-[550px] w-full rounded-3xl overflow-hidden border border-border shadow-2xl">
            <Image
              src={dbCs.featuredImage}
              alt={dbCs.clientName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            
            {/* Featured Key Metric Highlight Bar */}
            <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 bg-background/90 backdrop-blur-xl rounded-2xl border border-border p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Key Achievement Highlight</p>
                <p className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">{heroMetric.value}</p>
              </div>
              <Magnetic strength={0.2}>
                <Link href="/contact">
                  <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-6 py-5 shrink-0 border-0">
                    Replicate These Results
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </section>
      )}

      {/* 4. RESULTS STAT CARDS GRID */}
      {results.length > 0 && (
        <section className="py-12 px-6 md:px-10 lg:px-12 w-full max-w-[1400px] mx-auto">
          <div className="space-y-4 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Performance Metrics
            </span>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-foreground">
              Campaign Results & Key Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((res: any, idx: number) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {res.label}
                  </p>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-primary">
                  {res.value}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {res.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. MAIN CONTENT SECTIONS */}
      <section className="py-10 px-6 md:px-10 lg:px-12 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          {dbCs.projectOverview && (
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary shrink-0" />
                Project Overview
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {dbCs.projectOverview}
              </p>
            </div>
          )}

          {/* Challenge */}
          {dbCs.challenge && (
            <div className="p-8 rounded-3xl bg-muted/60 border border-border space-y-4">
              <h2 className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-3">
                <Target className="w-6 h-6 text-destructive shrink-0" />
                The Business Challenge
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {dbCs.challenge}
              </p>
            </div>
          )}

          {/* Objectives */}
          {dbCs.objectives && dbCs.objectives.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                Campaign Objectives
              </h2>
              <ul className="space-y-3">
                {dbCs.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/60">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {i + 1}
                    </div>
                    <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
                      {obj}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategy */}
          {dbCs.strategy && (
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-secondary shrink-0" />
                Digital Marketing Strategy
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {dbCs.strategy}
              </p>
            </div>
          )}

          {/* Execution Steps */}
          {execution.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-3">
                <Wrench className="w-6 h-6 text-accent-foreground shrink-0" />
                Execution & Tactical Approach
              </h2>
              <div className="space-y-4">
                {execution.map((step: any, i: number) => (
                  <div key={i} className="p-6 rounded-2xl bg-card border border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-primary text-white text-xs font-bold">
                        Step 0{i + 1}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-1">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conclusion */}
          {dbCs.conclusion && (
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
              <h2 className="text-2xl font-heading font-extrabold text-primary flex items-center gap-3">
                <Award className="w-6 h-6 text-primary shrink-0" />
                Conclusion & Long-term Impact
              </h2>
              <p className="text-base text-foreground/90 leading-relaxed">
                {dbCs.conclusion}
              </p>
            </div>
          )}

          {/* Testimonial */}
          {testimonial && testimonial.quote && (
            <div className="relative p-8 rounded-3xl bg-card border border-border shadow-lg space-y-4">
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6 pointer-events-none" />
              <p className="text-lg italic text-foreground leading-relaxed font-serif">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-heading font-extrabold text-foreground text-base">
                  {testimonial.author}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role}, {testimonial.company || dbCs.clientName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6 sticky top-28">
            <h3 className="font-heading font-bold text-xl text-foreground pb-4 border-b border-border">
              Case Study Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</p>
                <p className="font-bold text-foreground text-base">{dbCs.clientName}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry</p>
                <p className="font-medium text-foreground">{dbCs.industry}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Core Result</p>
                <p className="font-heading font-bold text-primary text-lg">{heroMetric.value}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Services Implemented</p>
                <div className="flex flex-wrap gap-1.5">
                  {dbCs.services.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-xs text-muted-foreground leading-snug">
                Want to run a similar growth campaign for your organization?
              </p>
              <Link href="/contact" className="w-full block">
                <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold py-5 border-0">
                  Request Custom Plan
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEXT / PREVIOUS NAV */}
      {publishedList.length > 1 && (
        <section className="py-12 px-6 md:px-10 lg:px-12 w-full max-w-[1400px] mx-auto border-t border-border/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href={`/case-studies/${prevStudy.slug}`} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center gap-4">
              <ArrowLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Previous Case Study</p>
                <p className="font-heading font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
                  {prevStudy.clientName} ({prevStudy.industry})
                </p>
              </div>
            </Link>

            <Link href={`/case-studies/${nextStudy.slug}`} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center justify-between text-right">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Next Case Study</p>
                <p className="font-heading font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
                  {nextStudy.clientName} ({nextStudy.industry})
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 7. BOTTOM CTA BANNER */}
      <section className="py-16 px-6 md:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-center">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl border border-primary/20 p-10 md:p-14 space-y-6">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            Ready to scale your business?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Let BuzzSpire Media build a customized digital marketing roadmap tailored to your industry and growth goals.
          </p>
          <div>
            <Magnetic strength={0.25}>
              <Link href="/contact">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-xl hover:shadow-2xl px-9 py-6 text-base group border-0">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </main>
  );
}
