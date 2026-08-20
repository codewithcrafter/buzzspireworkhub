"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

export default function NewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    seoTitle: "",
    metaDescription: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast({ title: "Error", description: "Title and slug are required.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Page created successfully.", type: "success" });
        router.push(`/admin/pages/${data.page.id}`);
      } else {
        toast({ title: "Error", description: data.error || "Failed to create page.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <PageHeader title="Create New Page" description="Start by adding page metadata." />
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Page Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. About Our Agency"
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">URL Slug *</label>
                <div className="flex items-center">
                  <span className="bg-muted px-3 py-3 border border-r-0 border-border rounded-l-xl text-muted-foreground text-sm">
                    /
                  </span>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="about-us"
                    className="w-full bg-muted/30 border border-border rounded-r-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">SEO Title</label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="e.g. About BuzzSpire Media | Digital Marketing Agency"
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Brief description for search engines..."
                  rows={3}
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 outline-none focus:border-primary/50 text-foreground text-sm transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button type="submit" variant="premium" disabled={loading} icon={<Save className="size-4" />}>
                {loading ? "Creating..." : "Save & Continue to Editor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
