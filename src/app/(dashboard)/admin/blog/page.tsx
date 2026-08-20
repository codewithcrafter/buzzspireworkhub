"use client"

import * as React from "react"
import {
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tags as TagsIcon,
  BookOpen,
  Edit2,
  Trash2,
  AlertTriangle,
  Sparkles,
  Eye,
  UploadCloud,
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { Avatar } from "@/components/ui/avatar"
import { PageHeader } from "@/components/ui/page-header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Dialog } from "@/components/ui/dialog"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterControls } from "@/components/ui/filter-controls"
import dynamic from "next/dynamic"

const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor").then(mod => mod.RichTextEditor), { ssr: false })
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
  status: "published" | "draft"
  coverImage: string // Featured image URL or gradient
  publishedDate: string
  readTime: string
  isFeatured: boolean
  seoTitle: string
  metaDescription: string
  excerpt: string
  faqs?: { id: string; question: string; answer: string; order: number }[]
}

function BlogDashboard() {
  const { toast } = useToast()

  // Selected active blog post for Preview Mode view
  const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null)

  // Real Database state
  const [posts, setPosts] = React.useState<BlogPost[]>([])

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([])

  // Modal dialog states
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  // Current active post states
  const [activePost, setActivePost] = React.useState<BlogPost | null>(null)

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("")
  const [formSlug, setFormSlug] = React.useState("")
  const [formCategory, setFormCategory] = React.useState("")
  const [formContent, setFormContent] = React.useState("")
  const [formTags, setFormTags] = React.useState("")
  const [formStatus, setFormStatus] = React.useState<"published" | "draft">("draft")
  const [formFeaturedImage, setFormFeaturedImage] = React.useState("")
  const [formReadTime, setFormReadTime] = React.useState("5")
  const [formSeoTitle, setFormSeoTitle] = React.useState("")
  const [formMetaDescription, setFormMetaDescription] = React.useState("")
  const [formIsFeatured, setFormIsFeatured] = React.useState(false)
  const [formAuthor, setFormAuthor] = React.useState("")
  const [formExcerpt, setFormExcerpt] = React.useState("")
  const [formFaqs, setFormFaqs] = React.useState<{id?: string, question: string, answer: string, order?: number}[]>([])

  // Image Uploading States
  const [isUploading, setIsUploading] = React.useState(false)

  const selectedPost = posts.find(p => p.id === selectedPostId) || null

  // Fetch blogs helper
  const loadPosts = React.useCallback(async () => {
    try {
      const categoryQuery = categoryFilters.length > 0 ? `&category=${encodeURIComponent(categoryFilters[0])}` : ""
      const searchQueryParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
      const res = await fetch(`/api/admin/blogs?limit=50${categoryQuery}${searchQueryParam}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(
          (data.blogs || []).map((b: any) => ({
            id: b.id,
            title: b.title,
            slug: b.slug,
            content: b.content,
            category: b.category,
            tags: b.tags || [],
            author: { name: b.author, avatar: b.author ? b.author[0].toUpperCase() : "A" },
            status: b.status.toLowerCase() as "published" | "draft",
            coverImage: b.featuredImage || "linear-gradient(to right, oklch(0.51 0.26 277), oklch(0.72 0.16 220))",
            publishedDate: b.publishedAt ? b.publishedAt.split("T")[0] : b.createdAt.split("T")[0],
            readTime: `${b.readTime} min read`,
            isFeatured: b.isFeatured,
            seoTitle: b.seoTitle || "",
            metaDescription: b.metaDescription || "",
            excerpt: b.excerpt || "",
            faqs: b.faqs || [],
          }))
        )
      }
    } catch (err) {
      console.error("Failed to load admin blogs dashboard:", err)
    }
  }, [searchQuery, categoryFilters])

  // Trigger load on query parameters update
  React.useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Handles raw multipart upload submission
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (res.ok) {
        setFormFeaturedImage(data.filePath)
        toast({
          title: "Image uploaded",
          description: "Successfully processed and saved on the server.",
          type: "success",
        })
      } else {
        toast({
          title: "Upload failed",
          description: data.error || "Please try another image file.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Failed uploading image:", err)
      toast({
        title: "Network error",
        description: "Could not submit upload parameters.",
        type: "error",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Create Post Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle || !formCategory || !formContent) {
      toast({
        title: "Required fields missing",
        description: "Please populate title, category, and body content.",
        type: "error",
      })
      return
    }

    const hasEmptyFaqs = formFaqs.some(f => !f.question.trim() || !f.answer.trim())
    if (hasEmptyFaqs) {
      toast({
        title: "FAQ Validation Failed",
        description: "Please ensure all FAQs have both a question and an answer.",
        type: "error",
      })
      return
    }

    const tagsArray = formTags ? formTags.split(",").map(t => t.trim()).filter(Boolean) : ["General"]

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          slug: formSlug || undefined,
          excerpt: formExcerpt || formContent.slice(0, 150),
          content: formContent,
          featuredImage: formFeaturedImage || undefined,
          category: formCategory,
          tags: tagsArray,
          author: formAuthor || undefined,
          readTime: formReadTime ? parseInt(formReadTime, 10) : undefined,
          seoTitle: formSeoTitle || undefined,
          metaDescription: formMetaDescription || undefined,
          status: formStatus.toUpperCase(),
          isFeatured: formIsFeatured,
          faqs: formFaqs.map((f, i) => ({ ...f, order: i })),
        }),
      })

      if (res.ok) {
        setIsAddOpen(false)
        resetForm()
        loadPosts()
        toast({
          title: formStatus === "published" ? "Article Published!" : "Draft Saved",
          description: "Blog has been added successfully.",
          type: "success",
        })
      } else {
        const errorData = await res.json()
        toast({
          title: "Submission failed",
          description: errorData.error || "An error occurred.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Submit blog post error:", err)
      toast({
        title: "Network error",
        description: "Could not connect to CMS endpoint.",
        type: "error",
      })
    }
  }

  // Edit Post load trigger
  const triggerEdit = (post: BlogPost) => {
    setActivePost(post)
    setFormTitle(post.title)
    setFormSlug(post.slug)
    setFormCategory(post.category)
    setFormContent(post.content)
    setFormTags(post.tags.join(", "))
    setFormStatus(post.status)
    setFormFeaturedImage(post.coverImage.startsWith("linear-gradient") ? "" : post.coverImage)
    setFormReadTime(post.readTime.replace(" min read", ""))
    setFormSeoTitle(post.seoTitle)
    setFormMetaDescription(post.metaDescription)
    setFormIsFeatured(post.isFeatured)
    setFormAuthor(post.author.name)
    setFormExcerpt(post.excerpt)
    setFormFaqs(post.faqs || [])
    setIsEditOpen(true)
  }

  // Edit Post Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePost) return

    const tagsArray = formTags ? formTags.split(",").map(t => t.trim()).filter(Boolean) : ["General"]

    const hasEmptyFaqs = formFaqs.some(f => !f.question.trim() || !f.answer.trim())
    if (hasEmptyFaqs) {
      toast({
        title: "FAQ Validation Failed",
        description: "Please ensure all FAQs have both a question and an answer.",
        type: "error",
      })
      return
    }

    try {
      const res = await fetch(`/api/admin/blogs/${activePost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          slug: formSlug,
          excerpt: formExcerpt || formContent.slice(0, 150),
          content: formContent,
          featuredImage: formFeaturedImage || null,
          category: formCategory,
          tags: tagsArray,
          author: formAuthor || undefined,
          readTime: formReadTime ? parseInt(formReadTime, 10) : undefined,
          seoTitle: formSeoTitle || null,
          metaDescription: formMetaDescription || null,
          status: formStatus.toUpperCase(),
          isFeatured: formIsFeatured,
          faqs: formFaqs.map((f, i) => ({ ...f, order: i })),
        }),
      })

      if (res.ok) {
        setIsEditOpen(false)
        resetForm()
        loadPosts()
        toast({
          title: "Article profile updated",
          description: "Information has been synchronized successfully.",
          type: "success",
        })
      } else {
        const errorData = await res.json()
        toast({
          title: "Update failed",
          description: errorData.error || "An error occurred.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Update blog post error:", err)
      toast({
        title: "Network error",
        description: "Could not connect to update endpoint.",
        type: "error",
      })
    }
  }

  // Delete trigger
  const triggerDelete = (post: BlogPost) => {
    setActivePost(post)
    setIsDeleteOpen(true)
  }

  // Delete Action handler
  const handleDeleteConfirm = async () => {
    if (!activePost) return

    try {
      const res = await fetch(`/api/admin/blogs/${activePost.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        if (selectedPostId === activePost.id) {
          setSelectedPostId(null)
        }
        setIsDeleteOpen(false)
        setActivePost(null)
        loadPosts()
        toast({
          title: "Article Deleted",
          description: "Post cleared successfully from publishing registries.",
          type: "success",
        })
      } else {
        toast({
          title: "Deletion failed",
          description: "Could not clear article record.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Delete blog post error:", err)
    }
  }

  const resetForm = () => {
    setFormTitle("")
    setFormSlug("")
    setFormCategory("")
    setFormContent("")
    setFormTags("")
    setFormStatus("draft")
    setFormFeaturedImage("")
    setFormReadTime("5")
    setFormSeoTitle("")
    setFormMetaDescription("")
    setFormIsFeatured(false)
    setFormAuthor("")
    setFormExcerpt("")
    setFormFaqs([])
    setActivePost(null)
  }

  const categoryOptions = [
    { value: "SEO", label: "SEO" },
    { value: "Paid Ads", label: "Paid Ads" },
    { value: "Strategy", label: "Strategy" },
    { value: "Design", label: "Design" },
    { value: "MarTech", label: "MarTech" },
  ]

  const statusMapper = (status: "published" | "draft"): "active" | "inactive" => {
    return status === "published" ? "active" : "inactive"
  }

  // Shared Upload Dropzone view helper
  const renderImageUploader = () => {
    return (
      <div className="space-y-1 col-span-2">
        <label className="text-xs font-semibold text-muted-foreground">Featured Image Uploader *</label>
        <div className="border border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-muted/20 relative group">
          {formFeaturedImage ? (
            <div className="space-y-3">
              <div className="h-40 w-full rounded-lg overflow-hidden bg-muted relative">
                <img
                  src={formFeaturedImage}
                  className="object-cover w-full h-full"
                  alt="Post preview"
                />
                <button
                  type="button"
                  onClick={() => setFormFeaturedImage("")}
                  className="absolute top-2 right-2 bg-destructive/80 text-white rounded-full p-1.5 hover:bg-destructive shadow-md cursor-pointer transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <span className="text-[10px] text-muted-foreground block truncate font-sans font-medium">{formFeaturedImage}</span>
            </div>
          ) : (
            <div className="py-4 relative flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleImageFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="space-y-2 text-center">
                  <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs font-bold text-foreground">Processing upload...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="size-8 mx-auto text-primary/60 group-hover:scale-105 transition-transform" />
                  <p className="text-xs font-bold text-foreground">Click to browse or Drag & Drop image</p>
                  <p className="text-[10px] text-muted-foreground">Supports JPG, PNG, WEBP, SVG (Max 5MB)</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Shared FAQ Section
  const renderFaqSection = () => {
    return (
      <div className="space-y-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-foreground">Frequently Asked Questions (FAQ)</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFormFaqs([...formFaqs, { question: "", answer: "" }])}
            className="cursor-pointer h-7 text-xs"
          >
            <Plus className="size-3 mr-1" /> Add FAQ
          </Button>
        </div>
        
        {formFaqs.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No FAQs added yet.</p>
        ) : (
          <div className="space-y-3">
            {formFaqs.map((faq, index) => (
              <div key={index} className="p-3 bg-muted/20 border border-border rounded-lg space-y-2 relative group">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => {
                    const newFaqs = [...formFaqs];
                    newFaqs.splice(index, 1);
                    setFormFaqs(newFaqs);
                  }}
                  title="Delete FAQ"
                >
                  <Trash2 className="size-3" />
                </Button>
                <div className="pr-6 space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Question *</label>
                    <input
                      type="text"
                      required
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...formFaqs];
                        newFaqs[index].question = e.target.value;
                        setFormFaqs(newFaqs);
                      }}
                      placeholder="e.g. What is SEO?"
                      className="w-full text-xs bg-background border border-border rounded-md p-2 outline-none focus:border-primary/50 text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Answer *</label>
                    <textarea
                      required
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...formFaqs];
                        newFaqs[index].answer = e.target.value;
                        setFormFaqs(newFaqs);
                      }}
                      placeholder="SEO is..."
                      className="w-full text-xs bg-background border border-border rounded-md p-2 outline-none focus:border-primary/50 text-foreground resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Blog CMS Board", href: "/admin/blog" },
          ...(selectedPost ? [{ label: selectedPost.title }] : []),
        ]}
      />

      {/* DUAL VIEW CONTROLLER Conditional render */}
      {!selectedPost ? (
        /* SECTION 1: BLOG CATALOG LIST */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <PageHeader
            title="Blog CMS Publishing Panel"
            description="Manage inbound posts, draft campaign announcements, define custom tags, and trigger previews."
            actions={
              <Button
                variant="premium"
                onClick={() => {
                  resetForm()
                  setIsAddOpen(true)
                }}
                icon={<Plus className="size-4" />}
                className="cursor-pointer font-bold shadow-md"
              >
                Create Post
              </Button>
            }
          />

          {/* Filters row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/60 bg-card/60 rounded-2xl shadow-sm">
            <SearchBar
              placeholder="Search posts by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />

            <div className="flex items-center gap-3">
              <FilterControls
                label="Categories"
                options={categoryOptions}
                selectedValues={categoryFilters}
                onChange={setCategoryFilters}
              />
              {(searchQuery || categoryFilters.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilters([])
                  }}
                  className="cursor-pointer text-xs"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {/* Grid list display */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 select-none">
            {posts.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground bg-card border border-border/60 rounded-2xl">
                No blog articles found matching queries.
              </div>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="flex flex-col h-full group/card hover:-translate-y-0.5 duration-300">
                  {/* Thumbnail cover image block */}
                  <div
                    className="h-36 w-full rounded-t-2xl relative flex items-center justify-center text-white overflow-hidden"
                    style={{ background: post.coverImage.startsWith("linear-gradient") ? post.coverImage : "muted" }}
                  >
                    {!post.coverImage.startsWith("linear-gradient") && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="absolute inset-0 object-cover w-full h-full"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
                    <BookOpen className="size-8 relative z-10 opacity-80 group-hover/card:scale-105 duration-300 text-white" />
                    
                    {/* Status Badge Tag */}
                    <div className="absolute top-3 right-3 flex z-20">
                      <StatusChip status={statusMapper(post.status)}>
                        {post.status.toUpperCase()}
                      </StatusChip>
                    </div>

                    {post.isFeatured && (
                      <div className="absolute top-3 left-3 bg-accent text-white px-2 py-0.5 rounded text-[9px] font-bold z-20 uppercase tracking-widest shadow-sm">
                        Featured
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3 flex-1">
                    <div className="flex items-center justify-between text-[10px] text-primary font-bold uppercase tracking-wider mb-1.5">
                      <span>{post.category}</span>
                      <span className="text-muted-foreground">{post.readTime}</span>
                    </div>
                    <CardTitle
                      className="cursor-pointer hover:text-primary transition-colors text-base line-clamp-2 leading-snug font-sans font-extrabold text-foreground"
                      onClick={() => setSelectedPostId(post.id)}
                    >
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed font-sans font-semibold">
                      {post.excerpt || post.content}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t border-border/20 bg-muted/20">
                    <div className="flex items-center gap-1.5 text-xs text-foreground/80 font-bold select-none font-sans">
                      <Avatar fallback={post.author.avatar} size="xs" />
                      <span>{post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setSelectedPostId(post.id)}
                        className="cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Preview Article"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => triggerEdit(post)}
                        className="cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => triggerDelete(post)}
                        className="cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        /* SECTION 2: MODERN READER PREVIEW PAGE VIEW */
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Back to list controller */}
          <div className="flex items-center gap-3 select-none">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => setSelectedPostId(null)}
              className="rounded-lg cursor-pointer animate-in fade-in"
            >
              <ArrowLeft className="size-3.5" />
            </Button>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">CMS PREVIEW MODE</span>
              <h3 className="text-sm font-bold text-foreground">Reader Workspace</h3>
            </div>
          </div>

          <article className="space-y-6">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <Badge variant="glow">{selectedPost.category}</Badge>
                {selectedPost.tags.map(t => (
                  <span key={t} className="text-[10px] text-muted-foreground font-bold bg-muted px-1.5 py-0.5 rounded border border-border/20">
                    #{t}
                  </span>
                ))}
                <span className="h-3.5 w-px bg-border/80 mx-1" />
                <StatusChip status={statusMapper(selectedPost.status)}>
                  {selectedPost.status.toUpperCase()}
                </StatusChip>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight text-foreground">
                {selectedPost.title}
              </h1>

              {/* Author metadata banner */}
              <div className="flex items-center gap-3.5 select-none text-xs">
                <Avatar fallback={selectedPost.author.avatar} size="sm" />
                <div>
                  <p className="font-bold text-foreground leading-none">{selectedPost.author.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(selectedPost.publishedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="size-1 bg-muted-foreground/30 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {selectedPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Cover Graphic placeholder */}
            <div
              className="w-full h-64 sm:h-80 rounded-2xl shadow-sm border border-border/40 select-none relative overflow-hidden"
              style={{ background: selectedPost.coverImage.startsWith("linear-gradient") ? selectedPost.coverImage : "muted" }}
            >
              {!selectedPost.coverImage.startsWith("linear-gradient") && (
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="absolute inset-0 object-cover w-full h-full"
                />
              )}
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            </div>

            {/* Markdown stylized article text body content */}
            <div className="prose dark:prose-invert max-w-none text-sm text-foreground/95 leading-relaxed font-semibold font-sans space-y-4 pt-4 border-t border-border/30">
              {selectedPost.content.split("\n\n").map((p, idx) => (
                <p key={idx} className="whitespace-pre-wrap">{p}</p>
              ))}
              <p className="text-muted-foreground text-xs italic mt-8 border-l-2 border-primary/50 pl-3">
                This is a simulation of the published layout format as rendered by BuzzSpire media assets pipeline templates.
              </p>
            </div>
          </article>
        </div>
      )}

      {/* DIALOG PORTAL: CREATE ARTICLE FORM */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Compose New Article"
        description="Fill in details, tags, and compose content in our rich text editor workspace."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleAddSubmit} className="cursor-pointer shadow-sm">
              Save & Apply
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold pr-2 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Article Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Next.js performance audit"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground cursor-pointer"
              >
                <option value="">Select Category...</option>
                <option value="SEO">SEO</option>
                <option value="Paid Ads">Paid Ads</option>
                <option value="Strategy">Strategy</option>
                <option value="Design">Design</option>
                <option value="MarTech">MarTech</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Custom Slug (optional)</label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="auto-generated-if-blank"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Tags (comma-separated)</label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="Nextjs, React, SEO"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          {/* Render file image uploader component */}
          {renderImageUploader()}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Publish Stage</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground cursor-pointer"
              >
                <option value="draft">Draft (Private Preview)</option>
                <option value="published">Published (Live Page)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Read Time (minutes)</label>
              <input
                type="number"
                value={formReadTime}
                onChange={(e) => setFormReadTime(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Author</label>
              <input
                type="text"
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                placeholder="Aria Mercer"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">SEO Title</label>
              <input
                type="text"
                value={formSeoTitle}
                onChange={(e) => setFormSeoTitle(e.target.value)}
                placeholder="For Google indexing headers"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Short Excerpt *</label>
            <textarea
              required
              rows={2}
              value={formExcerpt}
              onChange={(e) => setFormExcerpt(e.target.value)}
              placeholder="Provide a brief summary of the article..."
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Meta Description</label>
            <input
              type="text"
              value={formMetaDescription}
              onChange={(e) => setFormMetaDescription(e.target.value)}
              placeholder="For Google snippets description"
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeaturedAdd"
              checked={formIsFeatured}
              onChange={(e) => setFormIsFeatured(e.target.checked)}
              className="size-4 cursor-pointer rounded border-border bg-mutedAccent"
            />
            <label htmlFor="isFeaturedAdd" className="text-xs font-bold text-foreground cursor-pointer select-none">
              Mark this post as Featured spotlight
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Article Body Content *</label>
            <RichTextEditor
              value={formContent}
              onChangeValue={setFormContent}
              placeholder="Write some premium markdown-friendly paragraph body text here..."
            />
          </div>

          {renderFaqSection()}
        </form>
      </Dialog>

      {/* DIALOG PORTAL: EDIT ARTICLE FORM */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Blog Article"
        description="Update keywords, publication status, or rewrite content body drafts."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleEditSubmit} className="cursor-pointer shadow-sm">
              Apply Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-semibold pr-2 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Article Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground cursor-pointer"
              >
                <option value="SEO">SEO</option>
                <option value="Paid Ads">Paid Ads</option>
                <option value="Strategy">Strategy</option>
                <option value="Design">Design</option>
                <option value="MarTech">MarTech</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Custom Slug</label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Tags (comma-separated)</label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          {/* Render file image uploader component */}
          {renderImageUploader()}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Publish Stage</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground cursor-pointer"
              >
                <option value="draft">Draft (Private Preview)</option>
                <option value="published">Published (Live Page)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Read Time (minutes)</label>
              <input
                type="number"
                value={formReadTime}
                onChange={(e) => setFormReadTime(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Author</label>
              <input
                type="text"
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">SEO Title</label>
              <input
                type="text"
                value={formSeoTitle}
                onChange={(e) => setFormSeoTitle(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Short Excerpt</label>
            <textarea
              rows={2}
              value={formExcerpt}
              onChange={(e) => setFormExcerpt(e.target.value)}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Meta Description</label>
            <input
              type="text"
              value={formMetaDescription}
              onChange={(e) => setFormMetaDescription(e.target.value)}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeaturedEdit"
              checked={formIsFeatured}
              onChange={(e) => setFormIsFeatured(e.target.checked)}
              className="size-4 cursor-pointer rounded border-border bg-mutedAccent"
            />
            <label htmlFor="isFeaturedEdit" className="text-xs font-bold text-foreground cursor-pointer select-none">
              Mark this post as Featured spotlight
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Article Body Content</label>
            <RichTextEditor
              value={formContent}
              onChangeValue={setFormContent}
            />
          </div>

          {renderFaqSection()}
        </form>
      </Dialog>

      {/* DIALOG PORTAL: DELETE CONFIRMATION SAFETY MODAL */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Article Deletion"
        description="Are you sure you want to delete this article? This action is permanent."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="cursor-pointer">
              Delete Article
            </Button>
          </>
        }
      >
        {activePost && (
          <div className="flex gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl mt-2 text-destructive">
            <AlertTriangle className="size-5 shrink-0 mt-0.5" />
            <div className="text-xs font-medium leading-relaxed">
              Deleting <span className="font-bold">{activePost.title}</span> will remove publishing slugs, meta tags, and read-time records permanently from web catalogs.
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default function BlogCMSPage() {
  return (
    <ToastProvider>
      <BlogDashboard />
    </ToastProvider>
  )
}
