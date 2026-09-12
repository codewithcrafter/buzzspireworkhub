"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { ToastProvider, useToast } from "@/components/ui/toast";

function EditAuthorForm() {
  const router = useRouter();
  const params = useParams();
  const authorId = params.id as string;
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuthor();
  }, [authorId]);

  const fetchAuthor = async () => {
    try {
      const res = await fetch(`/api/admin/authors/${authorId}`);
      const data = await res.json();
      if (data.success && data.author) {
        setName(data.author.name || "");
        setPhotoUrl(data.author.photoUrl || "");
        setDesignation(data.author.designation || "");
        setBio(data.author.bio || "");
        setFacebookUrl(data.author.facebookUrl || "");
        setInstagramUrl(data.author.instagramUrl || "");
        setLinkedinUrl(data.author.linkedinUrl || "");
      } else {
        toast({ title: "Error", description: "Failed to load author.", type: "error" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load author.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setPhotoUrl(data.filePath);
      } else {
        toast({ title: "Upload Failed", description: data.error || "Please try again.", type: "error" });
      }
    } catch (err) {
      toast({ title: "Upload Error", description: "Failed to upload image.", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/authors/${authorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photoUrl, designation, bio, facebookUrl, instagramUrl, linkedinUrl }),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Author updated", description: "Author successfully modified.", type: "success" });
        setTimeout(() => router.push("/admin/authors"), 1000);
      } else {
        toast({ title: "Failed", description: data.error || "An error occurred.", type: "error" });
        setIsSubmitting(false);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update author.", type: "error" });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 pb-16 max-w-3xl">
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Authors", href: "/admin/authors" },
          { label: "Edit Author" },
        ]}
      />

      <PageHeader
        title="Edit Author"
        description="Modify the profile information of this blog author."
      />

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border/60 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Author Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm bg-muted/40 border border-border rounded-lg p-3 outline-none focus:border-primary/50 text-foreground"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full text-sm bg-muted/40 border border-border rounded-lg p-3 outline-none focus:border-primary/50 text-foreground"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Profile Photo</label>
          <div className="border border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-muted/20 relative">
            {photoUrl ? (
              <div className="space-y-3">
                <div className="size-24 rounded-full overflow-hidden mx-auto bg-muted border border-border relative">
                  <img src={photoUrl} className="object-cover w-full h-full" alt="Author photo" />
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="bg-destructive/10 text-destructive text-xs font-bold px-3 py-1.5 rounded-md hover:bg-destructive/20 transition-colors"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <div className="py-4 relative flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="size-6 mx-auto text-primary/60" />
                    <p className="text-xs font-bold text-foreground">Click to upload photo</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Bio / Description</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-sm bg-muted/40 border border-border rounded-lg p-3 outline-none focus:border-primary/50 text-foreground resize-none"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold text-foreground">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Facebook URL</label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full text-sm bg-muted/40 border border-border rounded-lg p-3 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Instagram URL</label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full text-sm bg-muted/40 border border-border rounded-lg p-3 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">LinkedIn URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full text-sm bg-muted/40 border border-border rounded-lg p-3 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
          <Button variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="premium" type="submit" disabled={isSubmitting} className="font-bold">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function EditAuthorPage() {
  return (
    <ToastProvider>
      <EditAuthorForm />
    </ToastProvider>
  );
}
