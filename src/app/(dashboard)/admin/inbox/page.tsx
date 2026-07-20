"use client"

import * as React from "react"
import {
  Search,
  Filter,
  Mail,
  Archive,
  Trash2,
  MailOpen,
  ArrowLeft,
  Send,
  Phone,
  Paperclip,
  Check,
  Clock,
  User,
  ShieldAlert,
  Inbox,
  AlertCircle,
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { Avatar } from "@/components/ui/avatar"
import { PageHeader } from "@/components/ui/page-header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterControls } from "@/components/ui/filter-controls"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

interface ThreadMessage {
  id: string
  sender: string
  text: string
  time: string
  isMe: boolean
}

interface MessageItem {
  id: string
  sender: string
  email: string
  phone: string
  subject: string
  body: string
  time: string
  unread: boolean
  priority: "high" | "medium" | "low"
  label: "sales" | "support" | "general"
  thread: ThreadMessage[]
}

function InboxDashboard() {
  const { toast } = useToast()

  // Selected message state (Detail view)
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>("msg-1")
  
  // Mobile details screen switcher
  const [showMobileDetail, setShowMobileDetail] = React.useState(false)

  // Message reply field state
  const [replyText, setReplyText] = React.useState("")

  // Mock Database
  const [messages, setMessages] = React.useState<MessageItem[]>([
    {
      id: "msg-1",
      sender: "Aria Mercer",
      email: "aria@vercel.com",
      phone: "+91 98765 43210",
      subject: "Partnership Proposal: Next.js Rebranding Assets",
      body: "Hello, I wanted to reach out regarding a potential collaboration. Vercel Labs is currently auditing social template guidelines, and we are looking for a digital agency to structure custom premium icons and assets. Could we sync for a short Zoom call next Tuesday?",
      time: "10m ago",
      unread: true,
      priority: "high",
      label: "sales",
      thread: [
        { id: "t-1", sender: "Aria Mercer", text: "Hello, I wanted to reach out regarding a potential collaboration. Vercel Labs is currently auditing social template guidelines, and we are looking for a digital agency to structure custom premium icons and assets. Could we sync for a short Zoom call next Tuesday?", time: "July 4, 10:00 AM", isMe: false }
      ]
    },
    {
      id: "msg-2",
      sender: "John Doe",
      email: "john@acme.com",
      phone: "+91 87654 32109",
      subject: "Billing Issue: Invoice #INV-2026-004",
      body: "Hi team, I noticed a discrepancy in our monthly retainer billing statement. The invoice indicates an additional charge of ₹12,000 for ad template designs, but our contract specifies design revisions are included. Could you please review and resend updated payment files?",
      time: "2h ago",
      unread: true,
      priority: "medium",
      label: "support",
      thread: [
        { id: "t-2", sender: "John Doe", text: "Hi team, I noticed a discrepancy in our monthly retainer billing statement. The invoice indicates an additional charge of ₹12,000 for ad template designs, but our contract specifies design revisions are included. Could you please review and resend updated payment files?", time: "July 4, 8:15 AM", isMe: false }
      ]
    },
    {
      id: "msg-3",
      sender: "Sarah Connor",
      email: "sarah@cyberdyne.com",
      phone: "+91 76543 21098",
      subject: "Feedback: Digital Campaign Results",
      body: "Just wanted to send a quick note to say thank you! The search analytics campaign you launched yesterday has already generated 14 high-value enterprise leads for Cyberdyne. We are extremely impressed with the initial conversion margins.",
      time: "1d ago",
      unread: false,
      priority: "low",
      label: "general",
      thread: [
        { id: "t-3", sender: "Sarah Connor", text: "Just wanted to send a quick note to say thank you! The search analytics campaign you launched yesterday has already generated 14 high-value enterprise leads for Cyberdyne. We are extremely impressed with the initial conversion margins.", time: "July 3, 2:00 PM", isMe: false }
      ]
    }
  ])

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [labelFilter, setLabelFilter] = React.useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = React.useState<string[]>([])

  const selectedMsg = messages.find((m) => m.id === selectedMessageId) || null

  const filteredMessages = React.useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.body.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLabel =
        labelFilter.length === 0 || labelFilter.includes(msg.label)

      const matchesPriority =
        priorityFilter.length === 0 || priorityFilter.includes(msg.priority)

      return matchesSearch && matchesLabel && matchesPriority
    })
  }, [messages, searchQuery, labelFilter, priorityFilter])

  // Archive action
  const handleArchive = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id))
    setSelectedMessageId(null)
    setShowMobileDetail(false)
    toast({
      title: "Conversation Archived",
      description: "Moved message to archived storage registries.",
      type: "info",
    })
  }

  // Delete action
  const handleDelete = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id))
    setSelectedMessageId(null)
    setShowMobileDetail(false)
    toast({
      title: "Conversation Deleted",
      description: "Account message permanently cleared from database.",
      type: "success",
    })
  }

  // Toggle Read/Unread
  const toggleUnread = (id: string) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, unread: !m.unread } : m))
    )
    toast({
      title: "Status Modified",
      description: "Marked message status.",
      type: "info",
    })
  }

  // Reply submit helper
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMsg || !replyText) return

    const newReply: ThreadMessage = {
      id: `reply-${Date.now()}`,
      sender: "Jane Doe (Me)",
      text: replyText,
      time: "Just now",
      isMe: true,
    }

    const updated = messages.map((m) => {
      if (m.id === selectedMsg.id) {
        return {
          ...m,
          unread: false, // Mark read automatically on reply
          thread: [...m.thread, newReply],
        }
      }
      return m
    })

    setMessages(updated)
    setReplyText("")

    toast({
      title: "Reply Transmitted",
      description: "Sent simulated messaging update to client inbox.",
      type: "success",
    })
  }

  // Suggestions helper pills
  const handleAddSuggestion = (txt: string) => {
    setReplyText((prev) => (prev ? `${prev} ${txt}` : txt))
  }

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ]

  const labelOptions = [
    { value: "sales", label: "Sales Inquiry" },
    { value: "support", label: "Support Ticket" },
    { value: "general", label: "General Feedback" },
  ]

  const priorityColors = {
    high: "bg-destructive animate-pulse",
    medium: "bg-amber-500 animate-pulse",
    low: "bg-muted-foreground/60",
  }

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Inbox Workspace" },
        ]}
      />

      <PageHeader
        title="Inbox Operations Desk"
        description="Review inbound client proposals, support tickets, and sales inquiries. Reply, archive, or categorize thread priorities."
      />

      {/* Split Pane Container */}
      <div className="grid gap-6 md:grid-cols-3 border border-border/60 bg-card/45 rounded-3xl h-[650px] overflow-hidden shadow-sm relative select-none">
        
        {/* LEFT COLUMN: MESSAGE LIST (hidden on mobile if detail view is active) */}
        <div className={`md:col-span-1 border-r border-border/60 flex flex-col h-full bg-card/80 ${showMobileDetail ? "hidden md:flex" : "flex"}`}>
          {/* Search bar */}
          <div className="p-4 border-b border-border/40 space-y-3">
            <SearchBar
              placeholder="Search sender, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs"
              showCommandShortcut={false}
            />

            <div className="flex gap-2 justify-between">
              <FilterControls
                label="Labels"
                options={labelOptions}
                selectedValues={labelFilter}
                onChange={setLabelFilter}
              />
              <FilterControls
                label="Priority"
                options={priorityOptions}
                selectedValues={priorityFilter}
                onChange={setPriorityFilter}
              />
            </div>
          </div>

          {/* List content area */}
          <div className="flex-1 overflow-y-auto space-y-1 p-2 scrollbar-thin">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground">
                No conversations found.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isActive = selectedMessageId === msg.id

                return (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessageId(msg.id)
                      setShowMobileDetail(true)
                    }}
                    className={`flex flex-col gap-1.5 p-3.5 w-full text-left rounded-xl transition-all duration-300 border border-transparent cursor-pointer relative ${
                      isActive ? "bg-primary/10 border-primary/20" : "hover:bg-muted/70"
                    }`}
                  >
                    {/* Unread dot */}
                    {msg.unread && (
                      <span className="absolute top-4 left-2.5 size-1.5 bg-primary rounded-full" />
                    )}

                    <div className="flex justify-between items-start pl-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`size-2 rounded-full ${priorityColors[msg.priority]}`} title={`${msg.priority} priority`} />
                        <span className="text-xs font-bold text-foreground truncate max-w-[120px]">{msg.sender}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground/60 font-semibold">{msg.time}</span>
                    </div>

                    <p className="text-xs font-semibold text-foreground truncate pl-2">{msg.subject}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed pl-2">{msg.body}</p>
                    
                    <div className="pl-2 mt-1.5">
                      <Badge variant={msg.label === "sales" ? "default" : msg.label === "support" ? "warning" : "secondary"}>
                        {msg.label.toUpperCase()}
                      </Badge>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CONVERSATION PANEL */}
        <div className={`md:col-span-2 flex flex-col h-full bg-card/20 ${!showMobileDetail ? "hidden md:flex" : "flex"}`}>
          {selectedMsg ? (
            <div className="flex flex-col h-full">
              {/* Conversation Header Actions */}
              <div className="flex items-center justify-between p-4 border-b border-border/40 bg-card/60">
                <div className="flex items-center gap-2">
                  {/* Mobile Back Button */}
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={() => setShowMobileDetail(false)}
                    className="md:hidden rounded-lg cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" />
                  </Button>
                  
                  <Avatar fallback={selectedMsg.sender.split(" ").map(w => w[0]).join("")} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground leading-none">{selectedMsg.sender}</h4>
                    <p className="text-[10px] text-muted-foreground/80 mt-1">{selectedMsg.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => toggleUnread(selectedMsg.id)}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Mark unread"
                  >
                    <MailOpen className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleArchive(selectedMsg.id)}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Archive"
                  >
                    <Archive className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(selectedMsg.id)}
                    className="cursor-pointer text-muted-foreground hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Message Thread History Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 scrollbar-thin">
                <div className="text-center py-2 select-none border-b border-border/20 mb-4">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Subject: {selectedMsg.subject}</span>
                </div>

                {selectedMsg.thread.map((t) => (
                  <div
                    key={t.id}
                    className={`flex flex-col max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                      t.isMe
                        ? "bg-primary text-white ml-auto rounded-tr-none"
                        : "bg-card border border-border/40 text-foreground mr-auto rounded-tl-none"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-8 mb-1.5 text-[9px] font-bold opacity-80">
                      <span>{t.sender}</span>
                      <span>{t.time}</span>
                    </div>
                    <p>{t.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Drafting Workspace */}
              <div className="p-4 border-t border-border/40 bg-card/60 space-y-3">
                {/* Suggestion Quick templates */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Sounds good, let's schedule Zoom calls.",
                    "We have updated the billing retainers.",
                    "Thank you for the prompt feedback!",
                  ].map((sug) => (
                    <button
                      key={sug}
                      onClick={() => handleAddSuggestion(sug)}
                      className="text-[9px] font-bold bg-muted hover:bg-muted-hover text-muted-foreground hover:text-foreground px-2 py-0.75 rounded-lg border border-border/30 transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                {/* Text area reply fields */}
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedMsg.sender}...`}
                    className="flex-1 text-xs bg-muted/40 border border-border rounded-xl px-4 py-2 outline-none focus:border-primary/50 text-foreground"
                  />
                  
                  <Button type="submit" size="sm" className="cursor-pointer font-bold shadow-md rounded-xl">
                    <Send className="size-3.5 mr-1" />
                    <span>Send</span>
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <Inbox className="size-10 mb-2.5 opacity-60" />
              <p className="text-xs font-semibold">Select a conversation item from index feed list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InboxPage() {
  return (
    <ToastProvider>
      <InboxDashboard />
    </ToastProvider>
  )
}
