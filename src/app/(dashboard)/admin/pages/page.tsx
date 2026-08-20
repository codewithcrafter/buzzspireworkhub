"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Globe, FileEdit, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
  type: "SYSTEM" | "CUSTOM";
  url: string;
}

export default function PagesListPage() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.success) {
        setPages(data.pages);
      } else {
        toast({ title: "Error", description: "Failed to load pages.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Network error loading pages.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (page: PageData) => {
    setPageToDelete(page);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pageToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Deleted", description: "Page deleted successfully.", type: "success" });
        setPages(pages.filter((p) => p.id !== pageToDelete.id));
      } else {
        toast({ title: "Error", description: data.error || "Failed to delete page.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Network error deleting page.", type: "error" });
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setPageToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="success">Published</Badge>;
      case "DRAFT":
        return <Badge variant="warning">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Pages Management"
          description="Manage all website pages and custom content."
        />
        <Link href="/admin/pages/new">
          <Button variant="premium" icon={<Plus className="size-4" />}>
            Create New Page
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading pages...
                    </TableCell>
                  </TableRow>
                ) : pages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No pages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <span className="font-semibold text-foreground">{page.title}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {page.url}
                      </TableCell>
                      <TableCell>
                        {page.type === "SYSTEM" ? (
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-muted/50 flex w-fit items-center gap-1">
                            <Lock className="w-3 h-3" /> System
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-primary/20 text-primary w-fit">
                            Custom
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(page.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {page.status === "PUBLISHED" && (
                            <Link href={page.url} target="_blank">
                              <Button variant="ghost" size="icon" title="View Live">
                                <Globe className="size-4 text-primary" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/pages/${page.id}`}>
                            <Button variant="outline" size="sm" className="h-8 text-xs flex gap-1.5 items-center">
                              <Edit2 className="size-3" />
                              Edit
                            </Button>
                          </Link>
                          {page.type === "CUSTOM" ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:bg-destructive/10" 
                              onClick={() => handleDeleteClick(page)}
                              title="Delete Custom Page"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          ) : (
                            <div className="w-9"></div> /* Placeholder to align buttons */
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Page?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <p><strong>Page:</strong> {pageToDelete?.title}</p>
            <p><strong>URL:</strong> <span className="font-mono text-xs">{pageToDelete?.url}</span></p>
          </div>
          <p className="font-semibold text-destructive">
            Warning: This action cannot be undone. The page will be permanently removed from the website and the database.
          </p>
        </div>
      </Dialog>
    </div>
  );
}
