"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Globe, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Tabs } from "@/components/ui/tabs";
import Link from "next/link";
import { getCmsConfig } from "@/config/cmsConfig";

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  seoTitle: string;
  metaDescription: string;
  publishedContent: any;
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("seo");
  
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [config, setConfig] = useState(getCmsConfig("home"));

  useEffect(() => {
    fetchPage();
  }, [resolvedParams.id]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/admin/pages/${resolvedParams.id}`);
      const data = await res.json();
      if (data.success) {
        const pd = data.page;
        // Ensure publishedContent is an object
        if (!pd.publishedContent || Array.isArray(pd.publishedContent)) {
          pd.publishedContent = { h1: "", h2s: {}, faqs: [], keywords: "" };
        }
        setPageData(pd);
        setConfig(getCmsConfig(pd.slug));
      } else {
        toast({ title: "Error", description: "Failed to load page details.", type: "error" });
        router.push("/admin/pages");
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Network error loading page.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (pageData) setPageData({ ...pageData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (field: string, value: any) => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      publishedContent: {
        ...pageData.publishedContent,
        [field]: value
      }
    });
  };

  const handleH2Change = (key: string, value: string) => {
    if (!pageData) return;
    const currentH2s = pageData.publishedContent.h2s || {};
    handleContentChange('h2s', { ...currentH2s, [key]: value });
  };

  const handleSaveDraft = async () => {
    if (!pageData) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/pages/${pageData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pageData.title,
          slug: pageData.slug,
          seoTitle: pageData.seoTitle,
          metaDescription: pageData.metaDescription
        })
      });

      // Save content
      const res = await fetch(`/api/admin/pages/${pageData.id}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: pageData.publishedContent })
      });

      const data = await res.json();
      if (data.success) {
        setPageData(data.page);
        toast({ title: "Draft Saved", description: "All changes have been saved to draft.", type: "success" });
      } else {
        toast({ title: "Error", description: data.error || "Failed to save content.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Network error saving draft.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!pageData) return;
    
    await handleSaveDraft();
    
    setPublishing(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageData.id}/publish`, {
        method: "POST"
      });

      const data = await res.json();
      if (data.success) {
        setPageData(data.page);
        toast({ title: "Published", description: "Page is now live on the website.", type: "success" });
      } else {
        toast({ title: "Error", description: data.error || "Failed to publish page.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Network error publishing page.", type: "error" });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading editor...</div>;
  if (!pageData) return <div className="p-8 text-center text-destructive">Page not found.</div>;

  const content = pageData.publishedContent;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-heading">{pageData.title}</h1>
              {pageData.status === "PUBLISHED" ? (
                <Badge variant="success">Published</Badge>
              ) : (
                <Badge variant="warning">Draft</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-mono">/{pageData.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pageData.status === "PUBLISHED" ? (
            <Link href={`/${pageData.slug}`} target="_blank">
              <Button variant="outline" icon={<Globe className="size-4" />}>
                View Live
              </Button>
            </Link>
          ) : (
            <Link href={`/preview/${pageData.id}`} target="_blank">
              <Button variant="outline" icon={<Globe className="size-4" />}>
                Preview
              </Button>
            </Link>
          )}
          <Button variant="secondary" onClick={handleSaveDraft} disabled={saving || publishing} icon={<Save className="size-4" />}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button variant="premium" onClick={handlePublish} disabled={saving || publishing} icon={<Globe className="size-4" />}>
            {publishing ? "Publishing..." : "Publish Page"}
          </Button>
        </div>
      </div>

      <Tabs
        id="page-editor-tabs"
        tabs={[
          { id: "seo", label: "SEO & Metadata" },
          { id: "content", label: "Page Content (H1, H2, FAQ)" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "seo" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Page Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">SEO Title</label>
                <input
                  type="text"
                  name="seoTitle"
                  value={pageData.seoTitle || ""}
                  onChange={handleMetadataChange}
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={pageData.metaDescription || ""}
                  onChange={handleMetadataChange}
                  rows={3}
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">SEO Keywords / Tags</label>
                <input
                  type="text"
                  value={content.keywords || ""}
                  onChange={(e) => handleContentChange("keywords", e.target.value)}
                  placeholder="seo, digital marketing, delhi"
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "content" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Page Headings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {config.h1 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary">Main H1 Title</label>
                  <input
                    type="text"
                    value={content.h1 !== undefined ? content.h1 : config.h1}
                    onChange={(e) => handleContentChange("h1", e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors"
                  />
                  <p className="text-xs text-muted-foreground">The main headline at the top of the page.</p>
                </div>
              )}

              {config.isCustom && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary">Intro Text (Optional)</label>
                  <textarea
                    rows={3}
                    value={content.intro || ""}
                    onChange={(e) => handleContentChange("intro", e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors resize-y"
                  />
                  <p className="text-xs text-muted-foreground">Introductory text displayed below the H1.</p>
                </div>
              )}

              {config.h2s && Object.keys(config.h2s).length > 0 && !config.isCustom && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-bold text-foreground">Existing H2 Headings</h3>
                  {Object.entries(config.h2s).map(([key, defaultValue]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{key.replace(/-/g, ' ')}</label>
                      <input
                        type="text"
                        value={content.h2s?.[key] !== undefined ? content.h2s[key] : defaultValue}
                        onChange={(e) => handleH2Change(key, e.target.value)}
                        className="w-full bg-muted/30 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground text-sm transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}

              {config.isCustom && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">Content Sections</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const sections = [...(content.sections || []), { h2: "", body: "" }];
                        handleContentChange('sections', sections);
                      }}
                    >
                      <Plus className="size-4 mr-1" /> Add Section
                    </Button>
                  </div>
                  
                  {(!content.sections || content.sections.length === 0) ? (
                    <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg">
                      No sections added. Add sections to build your page content.
                    </p>
                  ) : (
                    content.sections.map((section: any, idx: number) => (
                      <div key={idx} className="p-4 bg-muted/20 border border-border rounded-xl space-y-4 relative">
                        <button 
                          className="absolute top-3 right-3 text-destructive hover:bg-destructive/10 p-1.5 rounded"
                          onClick={() => {
                            const sections = [...content.sections];
                            sections.splice(idx, 1);
                            handleContentChange('sections', sections);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </button>
                        
                        <div className="space-y-1 pr-8">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Section Heading (H2)</label>
                          <input 
                            type="text" 
                            value={section.h2} 
                            onChange={(e) => {
                              const sections = [...content.sections];
                              sections[idx].h2 = e.target.value;
                              handleContentChange('sections', sections);
                            }} 
                            className="w-full bg-background border border-border rounded-lg p-2.5 text-sm" 
                            placeholder="Enter section heading..."
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Section Body Text</label>
                          <textarea 
                            value={section.body} 
                            onChange={(e) => {
                              const sections = [...content.sections];
                              sections[idx].body = e.target.value;
                              handleContentChange('sections', sections);
                            }} 
                            className="w-full bg-background border border-border rounded-lg p-2.5 text-sm resize-y" 
                            rows={5} 
                            placeholder="Enter section body content..."
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {config.hasFaq && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Frequently Asked Questions (FAQ)</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const faqs = [...(content.faqs || []), { q: "", a: "" }];
                    handleContentChange('faqs', faqs);
                  }}
                >
                  <Plus className="size-4 mr-1" /> Add FAQ
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {(!content.faqs || content.faqs.length === 0) ? (
                  <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg">
                    No custom FAQs added. The page will use its default FAQs if any exist.
                  </p>
                ) : (
                  content.faqs.map((faq: any, idx: number) => (
                    <div key={idx} className="p-4 bg-muted/20 border border-border rounded-xl space-y-4 relative">
                      <button 
                        className="absolute top-3 right-3 text-destructive hover:bg-destructive/10 p-1.5 rounded"
                        onClick={() => {
                          const faqs = [...content.faqs];
                          faqs.splice(idx, 1);
                          handleContentChange('faqs', faqs);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </button>
                      
                      <div className="space-y-1 pr-8">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Question {idx + 1}</label>
                        <input 
                          type="text" 
                          value={faq.q} 
                          onChange={(e) => {
                            const faqs = [...content.faqs];
                            faqs[idx].q = e.target.value;
                            handleContentChange('faqs', faqs);
                          }} 
                          className="w-full bg-background border border-border rounded-lg p-2.5 text-sm" 
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Answer</label>
                        <textarea 
                          value={faq.a} 
                          onChange={(e) => {
                            const faqs = [...content.faqs];
                            faqs[idx].a = e.target.value;
                            handleContentChange('faqs', faqs);
                          }} 
                          className="w-full bg-background border border-border rounded-lg p-2.5 text-sm resize-y" 
                          rows={3} 
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
