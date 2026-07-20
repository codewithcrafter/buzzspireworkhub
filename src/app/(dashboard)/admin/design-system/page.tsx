"use client"

import * as React from "react"
import {
  Sparkles,
  Command,
  Layout,
  Layers,
  Sliders,
  BellRing,
  HelpCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Inbox,
  User,
  MoreVertical,
  Plus,
  ArrowRight,
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { PageHeader } from "@/components/ui/page-header"
import { SectionHeader } from "@/components/ui/section-header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Navbar } from "@/components/ui/navbar"
import { Sidebar } from "@/components/ui/sidebar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { ChartsPlaceholder } from "@/components/ui/charts-placeholder"
import { Tabs } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"
import { Dialog } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterControls } from "@/components/ui/filter-controls"
import { DatePicker } from "@/components/ui/date-picker"
import { FileUpload } from "@/components/ui/file-upload"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner, TopBarLoader } from "@/components/ui/loading-states"
import { EmptyState } from "@/components/ui/empty-state"
import { ProfileDropdown } from "@/components/ui/profile-dropdown"
import { NotificationDropdown } from "@/components/ui/notification-dropdown"

function DesignSystemExplorer() {
  const { toast } = useToast()

  // Tabs state
  const [activeTab, setActiveTab] = React.useState("primitives")

  // Interactive component states
  const [btnLoading, setBtnLoading] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [showTopLoader, setShowTopLoader] = React.useState(false)

  // Dummy table selection states
  const [selectedRows, setSelectedRows] = React.useState<string[]>([])

  const triggerToast = (type: "success" | "warning" | "error" | "info") => {
    toast({
      title: `${type.toUpperCase()} Notification`,
      description: `This is a premium dismissible toast message for BuzzSpire Media.`,
      type,
    })
  }

  const triggerTopLoader = () => {
    setShowTopLoader(true)
    setTimeout(() => {
      setShowTopLoader(false)
    }, 3000)
  }

  const toggleRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const filterOptions = [
    { value: "lead", label: "Leads" },
    { value: "client", label: "Clients" },
    { value: "partner", label: "Partners" },
  ]

  const explorerTabs = [
    { id: "primitives", label: "Core Primitives", icon: <Layers className="size-4" /> },
    { id: "forms", label: "Inputs & Forms", icon: <Sliders className="size-4" /> },
    { id: "data", label: "Data Display", icon: <Layout className="size-4" /> },
    { id: "navigation", label: "Feedback & Overlays", icon: <BellRing className="size-4" /> },
  ]

  return (
    <div className="space-y-10 pb-16">
      {showTopLoader && <TopBarLoader />}

      <Breadcrumb
        items={[
          { label: "Admin Workspace", href: "/admin" },
          { label: "Design System Showcase" },
        ]}
      />

      <PageHeader
        title="Reusable Design System"
        description="Premium components crafted with Tailwind CSS v4, Framer Motion, and Radix/Base UI foundations. Inspired by the styling guidelines of Vercel, Linear, and Stripe."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={triggerTopLoader} className="cursor-pointer">
              Trigger Top Loader
            </Button>
            <Button variant="premium" icon={<Sparkles className="size-4" />} onClick={() => triggerToast("success")} className="cursor-pointer">
              Launch Success Toast
            </Button>
          </div>
        }
      />

      {/* Tabs panels wrapper */}
      <Tabs
        id="design-system-panels"
        tabs={explorerTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="capsule"
        className="mb-8"
      />

      {/* Tab CONTENT Panels */}
      <div className="space-y-12">
        {/* PANEL 1: CORE PRIMITIVES */}
        {activeTab === "primitives" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Buttons Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>Sleek hover translations, magnetic behaviors, loading icons, and styling options.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default" className="cursor-pointer">Primary</Button>
                    <Button variant="secondary" className="cursor-pointer">Secondary</Button>
                    <Button variant="outline" className="cursor-pointer">Outline</Button>
                    <Button variant="ghost" className="cursor-pointer">Ghost</Button>
                    <Button variant="destructive" className="cursor-pointer">Destructive</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="premium" className="cursor-pointer">Premium SaaS Gradient</Button>
                    <Button variant="glass" className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800">Glass Dark</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="default"
                      loading={btnLoading}
                      onClick={() => {
                        setBtnLoading(true)
                        setTimeout(() => setBtnLoading(false), 2000)
                      }}
                      className="cursor-pointer"
                    >
                      Click to Load
                    </Button>
                    <Button variant="outline" magnetic icon={<Sparkles className="size-4" />} className="cursor-pointer">
                      Magnetic + Icon
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Badges & Status Chips */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Status Chips</CardTitle>
                  <CardDescription>Pill tags and status flags containing pulsing micro action dots.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Badge Variants</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="success">Completed</Badge>
                      <Badge variant="warning">In Review</Badge>
                      <Badge variant="destructive">Cancelled</Badge>
                      <Badge variant="neutral">Neutral</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="glow">Live Glow</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Chips (Pulsing)</p>
                    <div className="flex flex-wrap gap-2">
                      <StatusChip status="active">Active System</StatusChip>
                      <StatusChip status="pending">Queued Item</StatusChip>
                      <StatusChip status="error">Network Outage</StatusChip>
                      <StatusChip status="info">Synchronizing</StatusChip>
                      <StatusChip status="inactive" showPulse={false}>Suspended</StatusChip>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avatars Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Avatar & Groups</CardTitle>
                  <CardDescription>User profile icons supporting fallbacks, online status rings, and offset group stacks.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-8 items-center">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Individual Sizes</p>
                    <div className="flex items-center gap-3">
                      <Avatar size="xs" fallback="JD" />
                      <Avatar size="sm" fallback="EM" status="online" />
                      <Avatar size="md" fallback="AW" status="away" />
                      <Avatar size="lg" fallback="BS" status="busy" />
                      <Avatar size="xl" fallback="KB" status="offline" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avatar Groups (Stacked)</p>
                    <div className="flex flex-col gap-3">
                      <AvatarGroup size="sm" max={3}>
                        <Avatar fallback="AB" />
                        <Avatar fallback="CD" />
                        <Avatar fallback="EF" />
                        <Avatar fallback="GH" />
                        <Avatar fallback="IJ" />
                      </AvatarGroup>
                      <AvatarGroup size="md" max={4}>
                        <Avatar fallback="SP" />
                        <Avatar fallback="VC" />
                        <Avatar fallback="LN" />
                        <Avatar fallback="ST" />
                        <Avatar fallback="OP" />
                      </AvatarGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* PANEL 2: INPUTS & FORMS */}
        {activeTab === "forms" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Search Bar & Multi-Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Bars & Filter Popovers</CardTitle>
                  <CardDescription>Interactive filter controllers, segmented checkboxes, and input shortcut tags.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Input</p>
                    <SearchBar
                      placeholder="Search items..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filter Popover Controls</p>
                    <div className="flex gap-3">
                      <FilterControls
                        label="User Types"
                        options={filterOptions}
                        selectedValues={selectedFilters}
                        onChange={setSelectedFilters}
                      />
                      <DatePicker
                        date={selectedDate}
                        onDateChange={setSelectedDate}
                        label="Select Deadline Date"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Drag and Drop File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>File Upload Zone</CardTitle>
                  <CardDescription>Drag and drop workspace with progress bars and status updates.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <FileUpload
                    maxSizeMB={2}
                    onFileSelect={(f) => triggerToast("success")}
                  />
                </CardContent>
              </Card>

              {/* Rich Text Editor */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Rich Text Editor Workspace</CardTitle>
                  <CardDescription>Markdown-supported editor toolbar containing bold, italic, headings, lists, links, and code panels.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RichTextEditor placeholder="Explain the branding workflow details here..." />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* PANEL 3: DATA DISPLAY */}
        {activeTab === "data" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Stat Cards section */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Premium SaaS Revenue"
                value="₹14,24,000"
                icon={<TrendingUp className="size-4 text-emerald-500" />}
                trend={{ value: 24, direction: "up", label: "vs last month" }}
                sparklineData={[40, 50, 48, 65, 78, 80, 95]}
              />
              <StatCard
                title="Marketing Conversion"
                value="18.6%"
                trend={{ value: 4, direction: "up", label: "vs last week" }}
                sparklineData={[50, 52, 49, 58, 60, 68, 70]}
              />
              <StatCard
                title="Active Projects"
                value="42"
                trend={{ value: 12, direction: "down", label: "vs yesterday" }}
                sparklineData={[55, 50, 42, 38, 48, 45, 42]}
              />
            </div>

            {/* Glowing Cards & Charts placeholders */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card variant="glow" glowColor="rgba(124, 58, 237, 0.18)">
                <CardHeader>
                  <CardTitle>Card Border Glow Tracking</CardTitle>
                  <CardDescription>Hover over this card to watch the gradient border glow track your cursor position.</CardDescription>
                </CardHeader>
                <CardContent className="h-44 flex items-center justify-center border border-dashed border-border/50 rounded-xl bg-muted/20">
                  <span className="text-muted-foreground font-medium text-xs">Track Cursor Overlay Glow (Linear-Style)</span>
                </CardContent>
              </Card>

              <Card variant="glass" className="bg-slate-900/10 border-slate-900/20 text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white">
                <CardHeader>
                  <CardTitle>Glassmorphism (Acrylic Blur)</CardTitle>
                  <CardDescription>Ideal for overlay banners and futuristic navigation items.</CardDescription>
                </CardHeader>
                <CardContent className="h-44 flex flex-col justify-between">
                  <p className="text-xs leading-relaxed opacity-85">
                    This variant implements absolute background backdrop blurring with custom border opacity styling suitable for SaaS design dashboards.
                  </p>
                  <Button variant="premium" className="w-full cursor-pointer mt-4">
                    Explore Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Tables and Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <SectionHeader
                  title="Clients Directory"
                  description="Complete view of all current registered agency clients."
                  actions={
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      Export CSV
                    </Button>
                  }
                />
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: "row-1", name: "Aria Mercer", status: "active", label: "Active Project", val: "₹1,20,000" },
                      { id: "row-2", name: "Acme Corporation", status: "pending", label: "In Review", val: "₹4,80,000" },
                      { id: "row-3", name: "Nexus Labs", status: "error", label: "Delayed", val: "₹85,000" },
                    ].map((row) => {
                      const isSelected = selectedRows.includes(row.id)
                      return (
                        <TableRow key={row.id} selected={isSelected}>
                          <TableCell className="w-[50px]">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRow(row.id)}
                              className="size-4 border border-input rounded cursor-pointer accent-primary"
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                          <TableCell>
                            <StatusChip status={row.status as any}>{row.label}</StatusChip>
                          </TableCell>
                          <TableCell className="text-right font-bold text-foreground">{row.val}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                />
              </div>

              {/* Donut Chart Placeholder */}
              <div className="space-y-4">
                <SectionHeader title="Traffic Distribution" />
                <ChartsPlaceholder type="donut" height={290} />
              </div>
            </div>

            {/* Area and Bar Chart placeholders */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <SectionHeader title="Revenue Progression (Area Chart)" />
                <ChartsPlaceholder type="area" />
              </div>
              <div className="space-y-3">
                <SectionHeader title="Monthly Comparison (Bar Chart)" />
                <ChartsPlaceholder type="bar" />
              </div>
            </div>
          </div>
        )}

        {/* PANEL 4: NAVIGATION, OVERLAYS & FEEDBACK */}
        {activeTab === "navigation" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Modal Dialog & Drawer controls */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Overlay Portals & Dialogs</CardTitle>
                  <CardDescription>Accessible modals, side panels, and action alerts with Focus Trap options.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button variant="default" onClick={() => setIsDialogOpen(true)} className="cursor-pointer">
                    Open Dialog Modal
                  </Button>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(true)} className="cursor-pointer">
                    Open Side Drawer
                  </Button>
                </CardContent>
              </Card>

              {/* Skeletons and Spinners */}
              <Card>
                <CardHeader>
                  <CardTitle>Skeletons & Spinner Loaders</CardTitle>
                  <CardDescription>Pulse indicators and circular loaders for asynchronous layouts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6">
                    <Spinner size="sm" />
                    <Spinner size="md" variant="secondary" />
                    <Spinner size="lg" variant="neutral" />
                  </div>
                  
                  <div className="space-y-2.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-12 rounded-full" />
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dropdowns (Profile, Notifications) */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Dropdown Layout Mock */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Dropdown Preview</CardTitle>
                  <CardDescription>Compact dropdown menu layout featuring shortcuts and logout actions.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center bg-muted/20 py-8 rounded-xl border border-border/40">
                  <ProfileDropdown onLogout={() => triggerToast("info")} />
                </CardContent>
              </Card>

              {/* Notifications Dropdown Layout Mock */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications Feed Preview</CardTitle>
                  <CardDescription>Inbox scroll layout displaying recent events and status marks.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center bg-muted/20 py-8 rounded-xl border border-border/40">
                  <NotificationDropdown onMarkAllRead={() => triggerToast("success")} />
                </CardContent>
              </Card>
            </div>

            {/* Empty States */}
            <div className="space-y-3">
              <SectionHeader title="Zero Data States" />
              <EmptyState
                title="No Campaign Logs Found"
                description="Create a digital campaign structure first to view analysis records."
                icon={<Inbox className="size-7 text-muted-foreground" />}
                actionLabel="Create Campaign"
                onActionClick={() => triggerToast("info")}
              />
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY DIALOG PORTAL */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Confirm Campaign Deployment"
        description="This will launch marketing materials to live audiences across BuzzSpire channels."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setIsDialogOpen(false)
                triggerToast("success")
              }}
              className="cursor-pointer shadow-sm"
            >
              Deploy Campaign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Deploying the campaigns distributes active assets. Please double-check budget metrics before finalizing:
          </p>
          <div className="p-4 border border-border bg-muted/40 rounded-xl space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-semibold">Total Budget</span>
              <span className="font-bold text-foreground">₹2,50,000</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-semibold">Target Reach</span>
              <span className="font-bold text-foreground">5,00,000+ views</span>
            </div>
          </div>
        </div>
      </Dialog>

      {/* OVERLAY DRAWER PORTAL */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Configuration Details"
        description="Adjust settings for design system previews."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDrawerOpen(false)} className="cursor-pointer">
              Reset
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setIsDrawerOpen(false)
                triggerToast("info")
              }}
              className="cursor-pointer"
            >
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Customize layout properties for the components in real-time. Changes apply across current tab views.
          </p>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Theme Focus</label>
              <select className="w-full text-xs bg-muted border border-border rounded-lg p-2.5 outline-none focus:border-primary">
                <option>Premium Light (Default)</option>
                <option>High-end Slate</option>
                <option>Dark Mode Overlay</option>
              </select>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default function DesignSystemPage() {
  return (
    <ToastProvider>
      <DesignSystemExplorer />
    </ToastProvider>
  )
}
