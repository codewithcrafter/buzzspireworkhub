"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  Wrench, 
  Target, 
  Globe, 
  ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { CATEGORIES } from "@/data/caseStudiesData";

function CreateCaseStudyContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [saving, setSaving] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  // Form states
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [clientName, setClientName] = React.useState("");
  const [industry, setIndustry] = React.useState(CATEGORIES[1] || "Health & Fitness");
  const [shortDescription, setShortDescription] = React.useState("");
  const [featuredImage, setFeaturedImage] = React.useState("");
  const [servicesInput, setServicesInput] = React.useState("");

  const [projectOverview, setProjectOverview] = React.useState("");
  const [challenge, setChallenge] = React.useState("");
  const [objectives, setObjectives] = React.useState<string[]>([""]);
  const [strategy, setStrategy] = React.useState("");
  const [conclusion, setConclusion] = React.useState("");

  // Dynamic Execution Steps
  const [executionSteps, setExecutionSteps] = React.useState<Array<{ title: string; description: string }>>([
    { title: "", description: "" },
  ]);

  // Dynamic Metrics
  const [metrics, setMetrics] = React.useState<Array<{ label: string; value: string; description: string; change?: string }>>([
    { label: "Organic Traffic", value: "+180%", description: "Surge in organic visitors" },
  ]);

  // Testimonial
  const [testimonialQuote, setTestimonialQuote] = React.useState("");
  const [testimonialAuthor, setTestimonialAuthor] = React.useState("");
  const [testimonialRole, setTestimonialRole] = React.useState("");
  const [testimonialCompany, setTestimonialCompany] = React.useState("");

  // SEO & Status
  const [seoTitle, setSeoTitle] = React.useState("");
  const [metaDescription, setMetaDescription] = React.useState("");
  const [canonicalUrl, setCanonicalUrl] = React.useState("");
  const [status, setStatus] = React.useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [isDemo, setIsDemo] = React.useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFeaturedImage(data.filePath);
        toast({
          title: "Image Uploaded",
          description: "Featured image successfully uploaded.",
          type: "success",
        });
      } else {
        const err = await res.json();
        toast({
          title: "Upload Failed",
          description: err.error || "Failed to upload image",
          type: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Error",
        description: err.message || "Failed to upload image",
        type: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !clientName.trim() || !shortDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required basic information fields.",
        type: "error",
      });
      return;
    }

    setSaving(true);

    try {
      const parsedServices = servicesInput
        ? servicesInput.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const parsedObjectives = objectives.map((o) => o.trim()).filter(Boolean);
      const parsedExecution = executionSteps.filter((s) => s.title.trim() && s.description.trim());
      const parsedResults = metrics.filter((m) => m.label.trim() && m.value.trim());

      const heroMetric = parsedResults.length > 0
        ? { label: parsedResults[0].label, value: parsedResults[0].value }
        : { label: "Impact", value: "High" };

      const testimonialObj = testimonialQuote.trim()
        ? {
            quote: testimonialQuote.trim(),
            author: testimonialAuthor.trim(),
            role: testimonialRole.trim(),
            company: testimonialCompany.trim() || clientName.trim(),
          }
        : null;

      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        clientName: clientName.trim(),
        industry,
        shortDescription: shortDescription.trim(),
        featuredImage: featuredImage.trim() || undefined,
        services: parsedServices,
        projectOverview: projectOverview.trim(),
        challenge: challenge.trim(),
        objectives: parsedObjectives,
        strategy: strategy.trim(),
        execution: parsedExecution,
        results: parsedResults,
        heroMetric,
        conclusion: conclusion.trim(),
        testimonial: testimonialObj,
        seoTitle: seoTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        canonicalUrl: canonicalUrl.trim() || undefined,
        status,
        isDemo,
      };

      const res = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({
          title: "Case Study Created",
          description: `Successfully saved '${title}' as ${status}`,
          type: "success",
        });
        router.push("/admin/case-studies");
      } else {
        const err = await res.json();
        toast({
          title: "Creation Failed",
          description: err.error || "Failed to create case study",
          type: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit form",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin" },
              { label: "Case Studies", href: "/admin/case-studies" },
              { label: "New Case Study" },
            ]}
          />
          <PageHeader
            title="Create New Case Study"
            description="Add a new client project growth story to the BuzzSpire Media portfolio."
          />
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/case-studies">
            <Button variant="outline" type="button" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md px-6"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Case Study"}
          </Button>
        </div>
      </div>

      {/* 1. BASIC INFORMATION */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-6">
        <h2 className="text-xl font-heading font-extrabold text-slate-900 border-b pb-3">
          1. Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Case Study Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NovaFit Wellness Search Acquisition Drive"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Client Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Client / Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NovaFit Wellness"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Industry Category *
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as any)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-slate-800"
            >
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              URL Slug *
            </label>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500">
              <span>/case-studies/</span>
              <input
                type="text"
                required
                placeholder="novafit-wellness"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                className="w-full bg-transparent text-slate-800 font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Short Summary / Description *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Brief summary displayed on case study cards..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Services Provided */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Services Provided (Comma-separated)
          </label>
          <input
            type="text"
            placeholder="SEO, Google Ads, Social Media Marketing, Lead Generation"
            value={servicesInput}
            onChange={(e) => setServicesInput(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Featured Image */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Featured Header Image URL
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="https://images.unsplash.com/... or /uploads/..."
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-xs text-slate-700 shrink-0 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-primary" />
              {uploadingImage ? "Uploading..." : "Upload Local Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
          {featuredImage && (
            <div className="mt-2 h-36 w-full max-w-sm relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </Card>

      {/* 2. CASE STUDY CONTENT */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-6">
        <h2 className="text-xl font-heading font-extrabold text-slate-900 border-b pb-3">
          2. Campaign Content & Details
        </h2>

        {/* Overview */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Project Overview
          </label>
          <textarea
            rows={4}
            placeholder="Detailed background context about the client and project..."
            value={projectOverview}
            onChange={(e) => setProjectOverview(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Business Challenge */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            The Business Challenge
          </label>
          <textarea
            rows={4}
            placeholder="Explain the client's initial pain points, market challenges, and obstacles..."
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Campaign Objectives */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Campaign Objectives
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setObjectives([...objectives, ""])}
              className="text-xs font-bold text-primary"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Objective
            </Button>
          </div>
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Objective ${i + 1}`}
                value={obj}
                onChange={(e) => {
                  const updated = [...objectives];
                  updated[i] = e.target.value;
                  setObjectives(updated);
                }}
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
              {objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => setObjectives(objectives.filter((_, idx) => idx !== i))}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Strategy */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Digital Marketing Strategy
          </label>
          <textarea
            rows={4}
            placeholder="Explain the strategic approach, audience targeting, media channels, and funnels deployed..."
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Conclusion */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Conclusion & Summary Impact
          </label>
          <textarea
            rows={3}
            placeholder="Concluding summary of long-term business impact..."
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </Card>

      {/* 3. DYNAMIC EXECUTION STEPS */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            3. Execution & Tactical Steps
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExecutionSteps([...executionSteps, { title: "", description: "" }])}
            className="rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Execution Step
          </Button>
        </div>

        <div className="space-y-4">
          {executionSteps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Step 0{idx + 1}
                </span>
                {executionSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setExecutionSteps(executionSteps.filter((_, i) => i !== idx))}
                    className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Step Title (e.g. Technical SEO & Speed Audit)"
                value={step.title}
                onChange={(e) => {
                  const updated = [...executionSteps];
                  updated[idx].title = e.target.value;
                  setExecutionSteps(updated);
                }}
                className="w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg font-semibold"
              />
              <textarea
                rows={2}
                placeholder="Step description outlining exact implementation..."
                value={step.description}
                onChange={(e) => {
                  const updated = [...executionSteps];
                  updated[idx].description = e.target.value;
                  setExecutionSteps(updated);
                }}
                className="w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 4. DYNAMIC RESULTS & METRICS */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            4. Performance Metrics & Results
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMetrics([...metrics, { label: "", value: "", description: "" }])}
            className="rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Metric Card
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Metric #{idx + 1}
                </span>
                {metrics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setMetrics(metrics.filter((_, i) => i !== idx))}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Organic Traffic)"
                  value={m.label}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[idx].label = e.target.value;
                    setMetrics(updated);
                  }}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. +187%)"
                  value={m.value}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[idx].value = e.target.value;
                    setMetrics(updated);
                  }}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-extrabold text-primary"
                />
              </div>
              <input
                type="text"
                placeholder="Short Description (e.g. YoY organic visitor surge)"
                value={m.description}
                onChange={(e) => {
                  const updated = [...metrics];
                  updated[idx].description = e.target.value;
                  setMetrics(updated);
                }}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 5. TESTIMONIAL & SEO & OPTIONS */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-6">
        <h2 className="text-xl font-heading font-extrabold text-slate-900 border-b pb-3">
          5. Testimonial, SEO & Publishing Status
        </h2>

        {/* Client Testimonial */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Client Testimonial Quote (Optional)</h3>
          <textarea
            rows={2}
            placeholder="Quote text..."
            value={testimonialQuote}
            onChange={(e) => setTestimonialQuote(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Author Name (e.g. Dr. Rohan Verma)"
              value={testimonialAuthor}
              onChange={(e) => setTestimonialAuthor(e.target.value)}
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
            <input
              type="text"
              placeholder="Author Role (e.g. Founder)"
              value={testimonialRole}
              onChange={(e) => setTestimonialRole(e.target.value)}
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={testimonialCompany}
              onChange={(e) => setTestimonialCompany(e.target.value)}
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* SEO Meta */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-bold text-slate-800">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">SEO Meta Title</label>
              <input
                type="text"
                placeholder="Title tag for search engines..."
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Canonical URL</label>
              <input
                type="text"
                placeholder="https://www.buzzspiremedia.com/case-studies/..."
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Meta Description</label>
            <textarea
              rows={2}
              placeholder="Meta description summary..."
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* Publishing & Demo Controls */}
        <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Publish Status:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3.5 py-2 text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl text-slate-800"
            >
              <option value="DRAFT">Save as Draft</option>
              <option value="PUBLISHED">Publish Live</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-amber-800 text-xs font-bold">
            <input
              type="checkbox"
              checked={isDemo}
              onChange={(e) => setIsDemo(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Mark as Demo / Sample Portfolio Item</span>
          </label>
        </div>
      </Card>

      {/* Submit Button Bar */}
      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/case-studies">
          <Button variant="outline" type="button" className="rounded-xl px-6">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg px-8 py-6 text-base"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? "Saving..." : "Save Case Study"}
        </Button>
      </div>
    </form>
  );
}

export default function CreateCaseStudyPage() {
  return (
    <ToastProvider>
      <CreateCaseStudyContent />
    </ToastProvider>
  );
}
