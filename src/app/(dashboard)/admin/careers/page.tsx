"use client"

import * as React from "react"
import {
  Plus,
  ArrowRight,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Briefcase,
  User,
  GraduationCap,
  FileText,
  Mail,
  Phone,
  Video,
  Award,
  BookOpen,
  MapPin,
  Building,
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { Avatar } from "@/components/ui/avatar"
import { PageHeader } from "@/components/ui/page-header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterControls } from "@/components/ui/filter-controls"
import { Tabs } from "@/components/ui/tabs"

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  status: "open" | "closed"
  applicantsCount: number
}

interface InterviewSchedule {
  id: string
  title: string
  date: string
  time: string
  interviewer: string
  link?: string
}

interface ResumeMock {
  bio: string
  skills: string[]
  experience: { role: string; company: string; duration: string }[]
  education: { degree: string; school: string; year: string }[]
}

interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  position: string
  appliedDate: string
  status: "applied" | "interviewing" | "offered" | "rejected"
  interviews: InterviewSchedule[]
  resume: ResumeMock
}

function CareersDashboard() {
  const { toast } = useToast()

  // Interactive View: "jobs" vs "applicants"
  const [viewMode, setViewMode] = React.useState<"jobs" | "applicants">("jobs")

  // Selected active applicant for Details Drawer view
  const [selectedApplicantId, setSelectedApplicantId] = React.useState<string | null>(null)

  // Mock Database
  const [jobs, setJobs] = React.useState<JobOpening[]>([])
  const [applicants, setApplicants] = React.useState<Applicant[]>([])

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilters, setRoleFilters] = React.useState<string[]>([])
  const [stageFilters, setStageFilters] = React.useState<string[]>([])

  // Modal dialog states
  const [isAddJobOpen, setIsAddJobOpen] = React.useState(false)
  const [isEditStageOpen, setIsEditStageOpen] = React.useState(false)

  // Form Fields
  const [formJobTitle, setFormJobTitle] = React.useState("")
  const [formJobDept, setFormJobDept] = React.useState("Engineering")
  const [formJobLoc, setFormJobLoc] = React.useState("")
  
  const [formApplicantStatus, setFormApplicantStatus] = React.useState<Applicant["status"]>("applied")

  // Working applicant
  const [activeApplicant, setActiveApplicant] = React.useState<Applicant | null>(null)

  const selectedApplicant = applicants.find(a => a.id === selectedApplicantId) || null

  const filteredApplicants = React.useMemo(() => {
    return applicants.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilters.length === 0 || roleFilters.includes(app.position)
      const matchesStage = stageFilters.length === 0 || stageFilters.includes(app.status)

      return matchesSearch && matchesRole && matchesStage
    })
  }, [applicants, searchQuery, roleFilters, stageFilters])

  // Create Job submit
  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formJobTitle || !formJobLoc) {
      toast({
        title: "Required fields missing",
        description: "Please populate job title and location.",
        type: "error",
      })
      return
    }

    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      title: formJobTitle,
      department: formJobDept,
      location: formJobLoc,
      status: "open",
      applicantsCount: 0,
    }

    setJobs([...jobs, newJob])
    setIsAddJobOpen(false)
    resetJobForm()

    toast({
      title: "Opening Posted",
      description: `"${newJob.title}" has been added to job postings.`,
      type: "success",
    })
  }

  // Edit applicant stage trigger
  const triggerEditStage = (applicant: Applicant) => {
    setActiveApplicant(applicant)
    setFormApplicantStatus(applicant.status)
    setIsEditStageOpen(true)
  }

  // Edit applicant stage submit
  const handleEditStageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeApplicant) return

    const updated = applicants.map((a) =>
      a.id === activeApplicant.id ? { ...a, status: formApplicantStatus } : a
    )

    setApplicants(updated)
    setIsEditStageOpen(false)
    setActiveApplicant(null)

    toast({
      title: "Applicant Stage Updated",
      description: "Pipeline changes saved successfully.",
      type: "success",
    })
  }

  const resetJobForm = () => {
    setFormJobTitle("")
    setFormJobDept("Engineering")
    setFormJobLoc("")
  }

  const roleOptions = [
    { value: "Senior Frontend Architect", label: "Senior Frontend Architect" },
    { value: "Lead Product Designer", label: "Lead Product Designer" },
    { value: "Marketing Coordinator", label: "Marketing Coordinator" },
  ]

  const stageOptions = [
    { value: "applied", label: "Applied" },
    { value: "interviewing", label: "Interviewing" },
    { value: "offered", label: "Offered" },
    { value: "rejected", label: "Rejected" },
  ]

  const stageMapper = (status: Applicant["status"]): "info" | "pending" | "active" | "error" => {
    if (status === "applied") return "info"
    if (status === "interviewing") return "pending"
    if (status === "offered") return "active"
    return "error"
  }

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Careers Workspace" },
        ]}
      />

      <PageHeader
        title="Careers & Recruitment Hub"
        description="Oversee corporate job postings and manage candidate pipelines from initial application to final offer."
        actions={
          <div className="flex gap-2.5 items-center select-none">
            {/* View Mode Switcher tabs toggle */}
            <div className="bg-muted/65 p-1 rounded-xl flex items-center gap-1 border border-border/40 mr-1.5 text-xs">
              <Button
                variant={viewMode === "jobs" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("jobs")}
                className="cursor-pointer font-bold rounded-lg px-3 py-1"
              >
                Job Openings ({jobs.length})
              </Button>
              <Button
                variant={viewMode === "applicants" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("applicants")}
                className="cursor-pointer font-bold rounded-lg px-3 py-1"
              >
                Applicants ({applicants.length})
              </Button>
            </div>

            {viewMode === "jobs" ? (
              <Button
                variant="premium"
                onClick={() => setIsAddJobOpen(true)}
                icon={<Plus className="size-4" />}
                className="cursor-pointer font-bold shadow-md"
              >
                Post Job
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setViewMode("jobs")}
                className="cursor-pointer text-xs"
              >
                View Openings
              </Button>
            )}
          </div>
        }
      />

      {/* VIEW MODES CONDITIONAL RENDER */}
      {viewMode === "jobs" ? (
        /* VIEW 1: ACTIVE JOB POSTINGS GALLERY */
        jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
            <div className="size-16 bg-muted border border-border/50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="size-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Job Openings</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
              There are no active job openings right now.
            </p>
            <Button
              variant="premium"
              onClick={() => setIsAddJobOpen(true)}
              className="mt-6 font-bold shadow-md cursor-pointer"
              icon={<Plus className="size-4" />}
            >
              Post Job
            </Button>
          </div>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300 select-none">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col h-full hover:-translate-y-0.5 duration-300">
              <CardHeader className="flex flex-row items-start justify-between border-b border-border/20 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-base truncate max-w-[200px]">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-0.5 text-xs">
                    <Building className="size-3.5 text-muted-foreground" />
                    <span>{job.department}</span>
                  </CardDescription>
                </div>
                <StatusChip status={job.status === "open" ? "active" : "inactive"}>
                  {job.status.toUpperCase()}
                </StatusChip>
              </CardHeader>

              <CardContent className="pt-5 flex-1 space-y-3 text-xs font-semibold">
                <div className="flex items-center gap-2 text-foreground/80">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <User className="size-4 text-muted-foreground" />
                  <span>{job.applicantsCount} Total Applicants</span>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/20 bg-muted/20 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRoleFilters([job.title])
                    setViewMode("applicants")
                  }}
                  className="text-xs cursor-pointer text-primary hover:bg-primary/5"
                  icon={<ChevronRight className="size-3.5" />}
                  iconPosition="end"
                >
                  View Applicants
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        )
      ) : (
        /* VIEW 2: APPLICANTS DIRECTORY HUB */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/60 bg-card/60 rounded-2xl shadow-sm">
            <SearchBar
              placeholder="Search candidate name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />

            <div className="flex items-center gap-3">
              <FilterControls
                label="Job Roles"
                options={roleOptions}
                selectedValues={roleFilters}
                onChange={setRoleFilters}
              />
              <FilterControls
                label="Recruitment Stages"
                options={stageOptions}
                selectedValues={stageFilters}
                onChange={setStageFilters}
              />
              {(searchQuery || roleFilters.length > 0 || stageFilters.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setRoleFilters([])
                    setStageFilters([])
                  }}
                  className="cursor-pointer text-xs"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {/* Table display */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Applied Position</TableHead>
                <TableHead>Recruitment Stage</TableHead>
                <TableHead className="text-right">Applied Date</TableHead>
                <TableHead className="w-[80px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No applicants found matching filter queries.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={app.name.split(" ").map(w => w[0]).join("")} size="sm" />
                        <div>
                          <p className="text-sm font-bold text-foreground leading-none">{app.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{app.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-semibold">{app.position}</TableCell>
                    <TableCell>
                      <StatusChip status={stageMapper(app.status)}>
                        {app.status.toUpperCase()}
                      </StatusChip>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-semibold">
                      {new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="w-[80px] text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setSelectedApplicantId(app.id)}
                          className="cursor-pointer text-muted-foreground hover:text-primary rounded-lg"
                          title="Open Details Drawer"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => triggerEditStage(app)}
                          className="cursor-pointer text-muted-foreground hover:text-secondary rounded-lg"
                          title="Update Recruitment Stage"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* DIALOG PORTAL: ADD JOB FORM */}
      <Dialog
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        title="Post New Job Opening"
        description="Fill in department and workspace locations to publish job cards."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddJobOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleAddJobSubmit} className="cursor-pointer shadow-sm">
              Publish Opening
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddJobSubmit} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Job Title *</label>
              <input
                type="text"
                required
                value={formJobTitle}
                onChange={(e) => setFormJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Architect"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Location *</label>
              <input
                type="text"
                required
                value={formJobLoc}
                onChange={(e) => setFormJobLoc(e.target.value)}
                placeholder="e.g. Remote / Mumbai"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Department</label>
            <select
              value={formJobDept}
              onChange={(e) => setFormJobDept(e.target.value)}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            >
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Growth">Growth</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </form>
      </Dialog>

      {/* DIALOG PORTAL: EDIT CANDIDATE STAGE FORM */}
      <Dialog
        isOpen={isEditStageOpen}
        onClose={() => setIsEditStageOpen(false)}
        title="Update Recruitment Stage"
        description="Advance candidate through hiring pipeline phases."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditStageOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleEditStageSubmit} className="cursor-pointer shadow-sm">
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditStageSubmit} className="space-y-4 text-xs font-semibold">
          {activeApplicant && (
            <div className="space-y-3">
              <div className="p-3 bg-muted/40 rounded-xl flex items-center gap-3">
                <Avatar fallback={activeApplicant.name.split(" ").map(w => w[0]).join("")} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">{activeApplicant.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{activeApplicant.position}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Recruitment Phase Status</label>
                <select
                  value={formApplicantStatus}
                  onChange={(e) => setFormApplicantStatus(e.target.value as any)}
                  className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
                >
                  <option value="applied">Applied (Initial Screen)</option>
                  <option value="interviewing">Interviewing (Active Review)</option>
                  <option value="offered">Offered (Agreement Pending)</option>
                  <option value="rejected">Rejected (Archived)</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </Dialog>

      {/* SIDE DRAWER PORTAL: APPLICANT OVERVIEW PREVIEW */}
      <Drawer
        isOpen={!!selectedApplicantId}
        onClose={() => setSelectedApplicantId(null)}
        title="Candidate Profile Overview"
        description="Detailed review records, resumes, and interview timelines."
      >
        {selectedApplicant && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 bg-muted/40 border border-border/40 rounded-xl select-none">
              <Avatar fallback={selectedApplicant.name.split(" ").map(w => w[0]).join("")} size="lg" />
              <div>
                <h4 className="text-base font-bold text-foreground font-heading">{selectedApplicant.name}</h4>
                <p className="text-xs text-muted-foreground">{selectedApplicant.position}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusChip status={stageMapper(selectedApplicant.status)}>
                    {selectedApplicant.status.toUpperCase()}
                  </StatusChip>
                  <span className="text-[10px] text-muted-foreground/80 font-bold">App ID: {selectedApplicant.id}</span>
                </div>
              </div>
            </div>

            {/* Resume Document Preview sheet Mock */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-foreground font-heading uppercase tracking-wide flex items-center gap-1.5 select-none">
                <FileText className="size-4 text-muted-foreground" />
                <span>Resume Document Preview</span>
              </h5>
              
              <div className="p-4 border border-border/70 rounded-2xl bg-card space-y-3.5 shadow-sm max-h-72 overflow-y-auto">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Candidate Summary</span>
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium">{selectedApplicant.resume.bio}</p>
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Technical Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplicant.resume.skills.map(s => (
                      <span key={s} className="text-[9px] font-extrabold bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border/25">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Work History</span>
                  <div className="space-y-2 text-xs">
                    {selectedApplicant.resume.experience.map((exp, idx) => (
                      <div key={idx} className="pb-1.5 border-b border-border/20 last:border-none last:pb-0 font-medium">
                        <p className="font-bold text-foreground">{exp.role} at {exp.company}</p>
                        <p className="text-[9px] text-muted-foreground/75 mt-0.5">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/40 my-1" />

            {/* Scheduled Interviews list visual mock */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-foreground font-heading uppercase tracking-wide flex items-center gap-1.5 select-none">
                <Calendar className="size-4 text-muted-foreground" />
                <span>Interview Schedules Calendar</span>
              </h5>

              <div className="space-y-3.5">
                {selectedApplicant.interviews.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-muted/20 border border-dashed border-border/40 rounded-xl">
                    No interviews scheduled.
                  </div>
                ) : (
                  selectedApplicant.interviews.map((interview) => (
                    <div key={interview.id} className="p-3 border border-border bg-muted/20 rounded-xl flex items-start gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5 select-none">
                        <Video className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{interview.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 font-semibold">
                          <Clock className="size-3" />
                          <span>{interview.date} at {interview.time}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 mt-1 font-medium">Interviewer: {interview.interviewer}</p>
                        
                        {interview.link && (
                          <a
                            href={interview.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-2 select-none"
                          >
                            <span>Launch Zoom Call</span>
                            <ArrowRight className="size-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default function CareersPage() {
  return (
    <ToastProvider>
      <CareersDashboard />
    </ToastProvider>
  )
}
