"use client";

import * as React from "react";
import { UnifiedTimeline } from "@/components/activity/UnifiedTimeline";
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Clock,
  Briefcase,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  UserX,
  UserCheck,
  Copy,
  RefreshCw,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { MOCK_EMPLOYEES, MockEmployee, MOCK_DEPARTMENTS } from "@/lib/mock-data";

export default function EmployeesPage() {
  const { toast } = useToast();

  // Employee state (initialized from centralized mock data)
  const [employees, setEmployees] = React.useState<MockEmployee[]>(MOCK_EMPLOYEES);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<MockEmployee | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formDept, setFormDept] = React.useState("Engineering");
  const [formRole, setFormRole] = React.useState<MockEmployee["role"]>("EMPLOYEE");
  const [formDesignation, setFormDesignation] = React.useState("");
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  // Login credential form states
  const [formLoginId, setFormLoginId] = React.useState("");
  const [formPassword, setFormPassword] = React.useState("");
  const [formConfirmPassword, setFormConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Credential reveal dialog (shown once after creation)
  const [credentialReveal, setCredentialReveal] = React.useState<{ loginId: string; password: string } | null>(null);
  const [credentialCopied, setCredentialCopied] = React.useState(false);

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Action dropdown state
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Employee details tab
  const [detailsTab, setDetailsTab] = React.useState<"overview" | "attendance" | "leaves" | "activity">("overview");

  // Filtering & Sorting
  const filteredEmployees = React.useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept =
          departmentFilter === "ALL" || emp.departmentName === departmentFilter;

        const matchesStatus =
          statusFilter === "ALL" || emp.status === statusFilter;

        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        return sortOrder === "asc"
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName);
      });
  }, [employees, searchTerm, departmentFilter, statusFilter, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormDept("Engineering");
    setFormRole("EMPLOYEE");
    setFormDesignation("");
    setFormErrors({});
    setFormLoginId("");
    setFormPassword("");
    setFormConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (emp: MockEmployee) => {
    setSelectedEmployee(emp);
    setFormName(emp.fullName);
    setFormEmail(emp.email);
    setFormPhone(emp.phone);
    setFormDept(emp.departmentName);
    setFormRole(emp.role);
    setFormDesignation(emp.designation);
    setFormErrors({});
    setIsEditOpen(true);
  };

  // Open Details Modal
  const handleOpenDetails = (emp: MockEmployee) => {
    setSelectedEmployee(emp);
    setDetailsTab("overview");
    setIsDetailsOpen(true);
  };

  // Open Deactivate Modal
  const handleOpenDeactivate = (emp: MockEmployee) => {
    setSelectedEmployee(emp);
    setIsDeactivateOpen(true);
  };

  // Validate form — includes credential fields for Add mode
  const validateForm = (isAdd = false) => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Full name is required.";
    if (!formEmail.trim() || !formEmail.includes("@")) errors.email = "Valid corporate email is required.";
    if (!formDesignation.trim()) errors.designation = "Job title/designation is required.";
    if (isAdd) {
      if (!formLoginId.trim() || formLoginId.trim().length < 4) errors.loginId = "Login ID must be at least 4 characters.";
      if (!formPassword || formPassword.length < 8) errors.password = "Password must be at least 8 characters.";
      if (formPassword !== formConfirmPassword) errors.confirmPassword = "Passwords do not match.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate secure random password
  const handleGeneratePassword = () => {
    setIsGenerating(true);
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!";
    let pwd = "";
    for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormPassword(pwd);
    setFormConfirmPassword(pwd);
    setShowPassword(true);
    setTimeout(() => setIsGenerating(false), 300);
  };

  // Password strength score 0-4
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"];

  // Open Delete Dialog
  const handleOpenDelete = (emp: MockEmployee) => {
    setSelectedEmployee(emp);
    setDeleteConfirmText("");
    setIsDeleteOpen(true);
    setOpenMenuId(null);
  };

  // Handle Permanent Delete
  const handleDeleteConfirm = async () => {
    if (!selectedEmployee || deleteConfirmText !== "DELETE") return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/employees/${selectedEmployee.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        await loadEmployees();
        setIsDeleteOpen(false);
        setSelectedEmployee(null);
        toast({ title: "Employee Deleted", description: `${selectedEmployee.fullName}'s account has been permanently removed.`, type: "error" });
      } else {
        toast({ title: "Delete Failed", description: data?.message || "Unable to delete employee.", type: "error" });
      }
    } catch {
      toast({ title: "Delete Failed", description: "Network error. Please try again.", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Activate
  const handleActivate = async (emp: MockEmployee) => {
    setOpenMenuId(null);
    const res = await fetch(`/api/employees/${emp.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACTIVE" }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      await loadEmployees();
      toast({ title: "Employee Activated", description: `${emp.fullName} can now log in again.`, type: "success" });
    } else {
      toast({ title: "Error", description: data?.message || "Failed to activate employee.", type: "error" });
    }
  };

  // Load employees from real API
  const loadEmployees = React.useCallback(async () => {
    try {
      const res = await fetch("/api/employees?limit=100");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.employees) && data.employees.length > 0) {
        const mapped: MockEmployee[] = data.employees.map((e: any) => ({
          id: e.id,
          employeeId: e.employeeId,
          fullName: e.fullName,
          email: e.email,
          phone: e.phone || "+91 98765 00000",
          departmentId: e.departmentDetails?.id || "dept-eng",
          departmentName: e.department || "Engineering",
          role: e.role || "EMPLOYEE",
          designation: e.designation || "Staff",
          joiningDate: e.joiningDate ? new Date(e.joiningDate).toISOString().split("T")[0] : "2026-01-15",
          status: e.status || "ACTIVE",
          avatarInitials: e.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
          avatarBg: "bg-indigo-600",
          location: "New Delhi (On-site)",
          shift: "General (09:00 - 18:00)",
        }));
        setEmployees(mapped);
      }
    } catch {
      // Graceful fallback to MOCK_EMPLOYEES
    }
  }, []);

  React.useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Add Employee Handler
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim() || undefined,
        designation: formDesignation.trim(),
        role: formRole,
        departmentName: formDept,
        // Admin-set login credentials — employeeCode is the login ID
        employeeCode: formLoginId.trim().toUpperCase(),
        password: formPassword,
      }),
    });

    let data: any = {};
    try { data = await res.json(); } catch { /* ignore */ }

    if (res.ok && data.success) {
      const createdEmployee = data.employee || data.data?.employee;
      const loginId = createdEmployee?.employeeCode || formLoginId.trim().toUpperCase();
      await loadEmployees();
      setIsAddOpen(false);
      resetForm();
      // Show one-time credential reveal dialog
      setCredentialReveal({ loginId, password: formPassword });
      return;
    }

    toast({
      title: "Failed to Add Employee",
      description: data?.message || data?.error?.message || "An unexpected error occurred.",
      type: "error",
    });
  };


  // Edit Employee Handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedEmployee) return;

    const res = await fetch(`/api/employees/${selectedEmployee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim() || null,
        designation: formDesignation.trim(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      await loadEmployees();
      setIsEditOpen(false);
      resetForm();
      toast({ title: "Profile Updated", description: `${formName}'s profile has been updated.`, type: "success" });
    } else {
      toast({ title: "Update Failed", description: data?.message || data?.error?.message || "Failed to update profile.", type: "error" });
    }
  };

  // Deactivate Employee Handler
  const handleDeactivateConfirm = async () => {
    if (!selectedEmployee) return;
    const res = await fetch(`/api/employees/${selectedEmployee.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "INACTIVE" }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      await loadEmployees();
      setIsDeactivateOpen(false);
      toast({ title: "Employee Deactivated", description: `${selectedEmployee.fullName} is now inactive. Historical records preserved.`, type: "warning" });
    } else {
      toast({ title: "Error", description: data?.message || data?.error?.message || "Failed to deactivate.", type: "error" });
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* ── HEADER & ACTIONS ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              Employee Directory
            </h1>
            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-xs">
              {filteredEmployees.length} Total
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee accounts, organizational departments, and role permissions.
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm shadow-indigo-600/20"
        >
          <UserPlus className="size-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* ── FILTER TOOLBAR ─────────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search by employee name, ID or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-10 text-xs bg-white border-slate-200 rounded-xl"
            />
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {MOCK_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            {/* Sort Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-10 px-3 text-xs border-slate-200 text-slate-600 rounded-xl"
            >
              <ArrowUpDown className="size-3.5 mr-1.5 text-slate-400" />
              Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── EMPLOYEE DATA TABLE ────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Role / Title</th>
                <th className="py-3.5 px-4">Joining Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Employee Avatar + Name + Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className={`size-9 ${emp.avatarBg} text-white font-bold text-xs shadow-sm`}>
                          <AvatarFallback className="bg-indigo-600 text-white font-semibold">
                            {emp.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-slate-900">{emp.fullName}</div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                      {emp.employeeId}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-slate-700">
                      {emp.departmentName}
                    </td>

                    {/* Role / Title */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold">{emp.designation}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{emp.role}</div>
                    </td>

                    {/* Joining Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {emp.joiningDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {emp.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <span className="size-1.5 rounded-full bg-slate-400" />
                          INACTIVE
                        </span>
                      )}
                    </td>

                    {/* Actions — dropdown menu */}
                    <td className="py-3.5 px-4 text-right">
                      <div ref={openMenuId === emp.id ? menuRef : undefined} className="relative inline-block">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === emp.id ? null : emp.id)}
                          className="size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                        {openMenuId === emp.id && (
                          <div className="absolute right-0 top-9 z-50 w-52 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 py-1 text-xs">
                            <button
                              onClick={() => { setOpenMenuId(null); handleOpenDetails(emp); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <Eye className="size-3.5 text-slate-400" /> View Employee
                            </button>
                            <button
                              onClick={() => { setOpenMenuId(null); handleOpenEdit(emp); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <Edit2 className="size-3.5 text-slate-400" /> Edit Employee
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            {emp.status === "ACTIVE" ? (
                              <button
                                onClick={() => { setOpenMenuId(null); handleOpenDeactivate(emp); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                              >
                                <UserX className="size-3.5 text-amber-500" /> Deactivate Employee
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(emp)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                <UserCheck className="size-3.5 text-emerald-500" /> Activate Employee
                              </button>
                            )}
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => handleOpenDelete(emp)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <ShieldAlert className="size-3.5 text-rose-500" /> Delete Permanently
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="size-8 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">No employees found</p>
                      <p className="text-[11px] text-slate-400">Try adjusting your search terms or department filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{filteredEmployees.length}</span> staff members
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="h-8 px-2.5 text-xs rounded-lg border-slate-200"
            >
              <ChevronLeft className="size-3.5 mr-1" />
              Previous
            </Button>
            <span className="text-xs font-medium text-slate-600 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="h-8 px-2.5 text-xs rounded-lg border-slate-200"
            >
              Next
              <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* ── MODAL 1: ADD EMPLOYEE ───────────────────────────────────────────── */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Employee"
        description="Create a corporate workforce profile with role permissions."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Full Name *</label>
            <Input
              placeholder="e.g. Aditi Sundaram"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="h-9 text-xs"
            />
            {formErrors.name && <p className="text-[11px] text-rose-600">{formErrors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Corporate Email *</label>
              <Input
                type="email"
                placeholder="name@buzzspire.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="h-9 text-xs"
              />
              {formErrors.email && <p className="text-[11px] text-rose-600">{formErrors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <Input
                placeholder="+91 98765 00000"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Department & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Department</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full h-9 text-xs px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                {MOCK_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Access Role</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as any)}
                className="w-full h-9 text-xs px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="EMPLOYEE">EMPLOYEE (Standard Staff)</option>
                <option value="MANAGER">MANAGER (Department Team)</option>
                <option value="HR_MANAGER">HR_MANAGER (Human Resources)</option>
                <option value="ADMIN">ADMIN (Full Workplace Access)</option>
              </select>
            </div>
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Job Title / Designation *</label>
            <Input
              placeholder="e.g. Senior Frontend Developer"
              value={formDesignation}
              onChange={(e) => setFormDesignation(e.target.value)}
              className="h-9 text-xs"
            />
            {formErrors.designation && <p className="text-[11px] text-rose-600">{formErrors.designation}</p>}
          </div>

          {/* ── LOGIN CREDENTIALS SECTION ── */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <KeyRound className="size-3.5" /> Login Credentials
            </h4>
            
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Employee Login ID *</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    placeholder="e.g. EMP-004 or TECH004"
                    value={formLoginId}
                    onChange={(e) => setFormLoginId(e.target.value.toUpperCase())}
                    className="h-9 text-xs pl-9 uppercase font-mono"
                  />
                </div>
                {formErrors.loginId && <p className="text-[11px] text-rose-600">{formErrors.loginId}</p>}
                <p className="text-[10px] text-slate-500">Must be unique. This acts as the login username.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Initial Password *</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="h-9 text-xs pr-9 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                  {formErrors.password && <p className="text-[11px] text-rose-600">{formErrors.password}</p>}
                  
                  {formPassword && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                        {[0, 1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className={`h-full flex-1 border-r border-white/50 last:border-0 ${
                              idx < getPasswordStrength(formPassword) ? strengthColor[getPasswordStrength(formPassword)] : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-[9px] font-bold uppercase ${
                        getPasswordStrength(formPassword) < 2 ? "text-red-500" : getPasswordStrength(formPassword) < 3 ? "text-yellow-600" : "text-emerald-600"
                      }`}>
                        {strengthLabel[getPasswordStrength(formPassword)]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Confirm Password *</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      value={formConfirmPassword}
                      onChange={(e) => setFormConfirmPassword(e.target.value)}
                      className="h-9 text-xs pr-9 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && <p className="text-[11px] text-rose-600">{formErrors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePassword}
                  disabled={isGenerating}
                  className="h-8 text-[11px] bg-indigo-50/50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 hover:text-indigo-800"
                >
                  {isGenerating ? <RefreshCw className="size-3.5 mr-1.5 animate-spin" /> : <Shield className="size-3.5 mr-1.5" />}
                  Generate Secure Password
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl"
            >
              Create Employee Account
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ── MODAL 2: EDIT EMPLOYEE ──────────────────────────────────────────── */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Employee Profile"
        description={`Modify details for ${selectedEmployee?.fullName} (${selectedEmployee?.employeeId})`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Full Name *</label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Corporate Email *</label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <Input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Department</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full h-9 text-xs px-3 rounded-lg border border-slate-200 bg-white text-slate-800"
              >
                {MOCK_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Access Role</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as any)}
                className="w-full h-9 text-xs px-3 rounded-lg border border-slate-200 bg-white text-slate-800"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="MANAGER">MANAGER</option>
                <option value="HR_MANAGER">HR_MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Designation *</label>
            <Input
              value={formDesignation}
              onChange={(e) => setFormDesignation(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ── MODAL 3: EMPLOYEE DETAILS (TABBED) ─────────────────────────────── */}
      <Dialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Employee Profile Details"
        description="Comprehensive workplace record, attendance history, and activity."
      >
        {selectedEmployee && (
          <div className="space-y-5 py-2">
            {/* Top Employee Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Avatar className={`size-14 ${selectedEmployee.avatarBg} text-white font-bold text-lg shadow-sm`}>
                <AvatarFallback className="bg-indigo-600 text-white font-semibold">
                  {selectedEmployee.avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    {selectedEmployee.fullName}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">
                    {selectedEmployee.role}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {selectedEmployee.designation} • {selectedEmployee.departmentName}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {selectedEmployee.employeeId} • Joined {selectedEmployee.joiningDate}
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setDetailsTab("overview")}
                className={`py-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
                  detailsTab === "overview"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setDetailsTab("attendance")}
                className={`py-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
                  detailsTab === "attendance"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Attendance
              </button>
              <button
                type="button"
                onClick={() => setDetailsTab("leaves")}
                className={`py-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
                  detailsTab === "leaves"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Leaves
              </button>
              <button
                type="button"
                onClick={() => setDetailsTab("activity")}
                className={`py-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
                  detailsTab === "activity"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Activity
              </button>
            </div>

            {/* Tab Contents */}
            {detailsTab === "overview" && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.email}</span>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.phone}</span>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Work Location</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.location}</span>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Shift</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.shift}</span>
                </div>
              </div>
            )}

            {detailsTab === "attendance" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-800">
                  <span>Current Attendance Rate</span>
                  <span className="font-bold">96.4% (Past 30 Days)</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Average Daily Net Hours</span>
                    <span className="font-semibold text-slate-900">8h 15m</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>On-time Arrival Consistency</span>
                    <span className="font-semibold text-slate-900">92%</span>
                  </div>
                </div>
              </div>
            )}

            {detailsTab === "leaves" && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Allocated</div>
                    <div className="text-base font-bold text-slate-800">24</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Taken</div>
                    <div className="text-base font-bold text-slate-800">6</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Available</div>
                    <div className="text-base font-bold text-emerald-600">18</div>
                  </div>
                </div>
              </div>
            )}

            {detailsTab === "activity" && (
              <div className="bg-white rounded-xl border border-slate-100 p-2 overflow-y-auto max-h-[400px]">
                <UnifiedTimeline employeeId={selectedEmployee.id} date={new Date().toISOString().split("T")[0]} />
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsOpen(false)}
                className="text-xs rounded-xl"
              >
                Close View
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* ── MODAL 4: DEACTIVATE CONFIRMATION ───────────────────────────────── */}
      <Dialog
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        title="Deactivate Employee Account"
        description="Are you sure you want to deactivate this employee account?"
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800">
            <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
            <p>
              Deactivating <strong className="font-semibold text-slate-900">{selectedEmployee?.fullName}</strong> will prevent them from signing in and logging attendance. Historical punch records and audit logs will remain intact.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsDeactivateOpen(false)} className="text-xs rounded-xl">Cancel</Button>
            <Button size="sm" onClick={handleDeactivateConfirm} className="bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-xl">Confirm Deactivation</Button>
          </div>
        </div>
      </Dialog>

      {/* ── MODAL 5: PERMANENT DELETE CONFIRMATION ──────────────────────────── */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Permanently Delete Employee"
        description="This action cannot be undone."
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col gap-2 text-rose-800">
            <div className="flex items-center gap-2 font-bold text-rose-700">
              <ShieldAlert className="size-5" /> DANGER ZONE
            </div>
            <p>
              You are about to permanently delete <strong className="font-semibold">{selectedEmployee?.fullName}</strong>.
              This removes the employee and ephemeral session data. Historical business records will be preserved where required.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              Type <span className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-100 select-none">DELETE</span> to confirm
            </label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="h-10 text-center font-mono font-bold tracking-widest uppercase border-rose-200 focus-visible:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)} className="text-xs rounded-xl">Cancel</Button>
            <Button
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleteConfirmText !== "DELETE" || isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-xl disabled:bg-rose-300 transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ── MODAL 6: CREDENTIAL REVEAL DIALOG ──────────────────────────────── */}
      <Dialog
        isOpen={!!credentialReveal}
        onClose={() => { setCredentialReveal(null); setCredentialCopied(false); }}
        title="Employee Created Successfully"
        description="Please save these login credentials. The password will not be shown again."
      >
        {credentialReveal && (
          <div className="space-y-5 py-2">
            <div className="flex items-center justify-center p-4">
              <div className="size-16 rounded-full bg-emerald-100 border-[4px] border-emerald-50 flex items-center justify-center animate-in zoom-in duration-300">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative">
              <div className="p-3 border-b border-slate-100 bg-white/50">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Login ID</p>
                <p className="font-mono text-sm font-semibold text-slate-800">{credentialReveal.loginId}</p>
              </div>
              <div className="p-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Initial Password</p>
                <div className="flex justify-between items-center">
                  <p className="font-mono text-sm font-semibold text-slate-800 tracking-wider">
                    {credentialReveal.password}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => {
                      navigator.clipboard.writeText(`Login ID: ${credentialReveal.loginId}\nPassword: ${credentialReveal.password}`);
                      setCredentialCopied(true);
                      setTimeout(() => setCredentialCopied(false), 2000);
                    }}
                  >
                    {credentialCopied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex gap-2">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <p>Share these credentials securely. <strong>The password cannot be retrieved later.</strong></p>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setCredentialReveal(null)} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs px-6">
                Done
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
