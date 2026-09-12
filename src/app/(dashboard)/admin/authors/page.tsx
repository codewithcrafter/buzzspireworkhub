"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Link as LinkIcon, User } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast, ToastProvider } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";

interface Author {
  id: string;
  name: string;
  photoUrl: string | null;
  designation: string | null;
  bio: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
}

function AuthorsDashboard() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await fetch("/api/admin/authors");
      const data = await res.json();
      if (data.success) {
        setAuthors(data.authors);
      }
    } catch (error) {
      console.error("Failed to fetch authors:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/authors/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Author Deleted", description: "Author successfully removed.", type: "success" });
        fetchAuthors();
      } else {
        toast({ title: "Cannot Delete Author", description: data.error || "Failed to delete.", type: "error" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred.", type: "error" });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredAuthors = authors.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Blog CMS", href: "/admin/blog" },
          { label: "Authors" },
        ]}
      />

      <PageHeader
        title="Author Management"
        description="Manage your blog authors, profile pictures, and social links."
        actions={
          <Link href="/admin/authors/add">
            <Button variant="premium" icon={<Plus className="size-4" />} className="cursor-pointer font-bold shadow-md">
              Add Author
            </Button>
          </Link>
        }
      />

      <div className="flex p-4 border border-border/60 bg-card/60 rounded-2xl shadow-sm">
        <SearchBar
          placeholder="Search authors by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
      ) : filteredAuthors.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card border border-border/60 rounded-2xl">
          No authors found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAuthors.map(author => (
            <Card key={author.id} className="p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-0.5 duration-300">
              <Avatar fallback={author.name.charAt(0)} src={author.photoUrl || undefined} size="lg" className="size-20 shadow-sm border border-border" />
              <div>
                <h3 className="font-bold text-lg text-foreground">{author.name}</h3>
                <p className="text-sm font-semibold text-primary">{author.designation || "Author"}</p>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {author.bio || "No biography provided."}
              </p>
              
              <div className="flex items-center gap-2 mt-2 pt-4 border-t border-border/30 w-full justify-between">
                <div className="flex items-center gap-2">
                  {(author.linkedinUrl || author.facebookUrl || author.instagramUrl) ? (
                    <LinkIcon className="size-4 text-muted-foreground" />
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/authors/${author.id}`}>
                    <Button variant="ghost" size="icon-xs" className="cursor-pointer text-muted-foreground hover:text-primary">
                      <Edit2 className="size-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon-xs" onClick={() => setDeleteId(author.id)} className="cursor-pointer text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this author? This will fail if they are assigned to existing blogs."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete Author</Button>
          </>
        }
      >
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg">
          If this author is assigned to any existing blogs, they cannot be deleted. Please reassign the blogs first.
        </div>
      </Dialog>
    </div>
  );
}

export default function AuthorsPage() {
  return (
    <ToastProvider>
      <AuthorsDashboard />
    </ToastProvider>
  );
}
