"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  Key,
  Edit2,
  Trash2,
  Check,
  X,
  Lock,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BadgeCheck,
  UserX,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ALL_PERMISSIONS, PERMISSIONS, PermissionDefinition } from "@/lib/permissions";

interface Employee {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "ADMIN" | "EMPLOYEE" | "EDITOR";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  permissions: string[];
  department?: string | null;
  designation?: string | null;
  assignedLeadsCount?: number;
  createdAt: string;
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPermsOpen, setIsPermsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Create Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formEmployeeId, setFormEmployeeId] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState<"EMPLOYEE" | "ADMIN">("EMPLOYEE");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [formDesignation, setFormDesignation] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formPermissions, setFormPermissions] = useState<string[]>([
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_EDIT,
  ]);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<"EMPLOYEE" | "ADMIN" | "EDITOR">("EMPLOYEE");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED">("ACTIVE");
  const [editDesignation, setEditDesignation] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  // Password Reset State
  const [newPassword, setNewPassword] = useState("");

  // Permissions Edit State
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/employees");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.employees)) {
          setEmployees(data.employees);
        }
      }
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle Create Employee
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          employeeId: formEmployeeId || undefined,
          password: formPassword,
          phone: formPhone || undefined,
          role: formRole,
          status: formStatus,
          designation: formDesignation || undefined,
          department: formDepartment || undefined,
          permissions: formPermissions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || data.message || "Failed to create employee");
        return;
      }

      setIsAddOpen(false);
      // Reset form
      setFormName("");
      setFormEmail("");
      setFormEmployeeId("");
      setFormPassword("");
      setFormPhone("");
      setFormDesignation("");
      setFormDepartment("");
      fetchEmployees();
    } catch {
      setErrorMessage("Network error creating employee");
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (emp: Employee) => {
    setActiveEmployee(emp);
    setEditName(emp.name);
    setEditEmail(emp.email);
    setEditPhone(emp.phone || "");
    setEditRole(emp.role);
    setEditStatus(emp.status);
    setEditDesignation(emp.designation || "");
    setEditDepartment(emp.department || "");
    setErrorMessage("");
    setIsEditOpen(true);
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!activeEmployee) return;
    setSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/employees/${activeEmployee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone || null,
          role: editRole,
          status: editStatus,
          designation: editDesignation || null,
          department: editDepartment || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error?.message || data.message || "Failed to update employee");
        return;
      }

      setIsEditOpen(false);
      fetchEmployees();
    } catch {
      setErrorMessage("Network error saving employee");
    } finally {
      setSaving(false);
    }
  };

  // Open Permissions Modal
  const openPermsModal = (emp: Employee) => {
    setActiveEmployee(emp);
    setEditPermissions(emp.permissions || []);
    setErrorMessage("");
    setIsPermsOpen(true);
  };

  // Handle Save Permissions
  const handleSavePermissions = async () => {
    if (!activeEmployee) return;
    setSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/employees/${activeEmployee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permissions: editPermissions,
        }),
      });

      if (res.ok) {
        setIsPermsOpen(false);
        fetchEmployees();
      } else {
        const data = await res.json();
        setErrorMessage(data.error?.message || data.message || "Failed to update permissions");
      }
    } catch {
      setErrorMessage("Network error updating permissions");
    } finally {
      setSaving(false);
    }
  };

  // Handle Password Reset
  const handleResetPassword = async () => {
    if (!activeEmployee || !newPassword) return;
    setSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/employees/${activeEmployee.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error?.message || data.message || "Failed to reset password");
        return;
      }

      setIsPasswordOpen(false);
      setNewPassword("");
    } catch {
      setErrorMessage("Network error resetting password");
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Employee
  const handleDeleteEmployee = async () => {
    if (!activeEmployee) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/employees/${activeEmployee.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleteOpen(false);
        fetchEmployees();
      } else {
        const data = await res.json();
        alert(data.error?.message || data.message || "Failed to delete employee");
      }
    } catch {
      alert("Error deleting employee");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permKey: string, isForm = false) => {
    if (isForm) {
      setFormPermissions((prev) =>
        prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
      );
    } else {
      setEditPermissions((prev) =>
        prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
      );
    }
  };

  // Filtered list
  const filteredEmployees = employees.filter((emp) => {
    const matchesStatus = statusFilter === "ALL" || emp.status === statusFilter;
    const matchesRole = roleFilter === "ALL" || emp.role === roleFilter;
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      (emp.employeeId && emp.employeeId.toLowerCase().includes(search.toLowerCase())) ||
      (emp.designation && emp.designation.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesRole && matchesSearch;
  });

  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.status === "ACTIVE").length;
  const inactiveCount = employees.filter((e) => e.status !== "ACTIVE").length;
  const totalAssignedLeads = employees.reduce((acc, e) => acc + (e.assignedLeadsCount || 0), 0);

  // Group permissions by category for UI
  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
            Employee Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Create employee accounts, assign granular permissions, and track active team members.
          </p>
        </div>

        <Button
          onClick={() => {
            setErrorMessage("");
            setIsAddOpen(true);
          }}
          className="rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold shadow-md flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="rounded-2xl border border-border/80 shadow-sm p-5 bg-card">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Staff
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground mt-1">
            {totalEmployees}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Registered in system</p>
        </Card>

        <Card className="rounded-2xl border border-border/80 shadow-sm p-5 bg-card">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Active Accounts
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600 mt-1">
            {activeCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Authorized to log in</p>
        </Card>

        <Card className="rounded-2xl border border-border/80 shadow-sm p-5 bg-card">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Inactive / Suspended
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-600 mt-1">
            {inactiveCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Access restricted</p>
        </Card>

        <Card className="rounded-2xl border border-border/80 shadow-sm p-5 bg-card">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Assigned Leads
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-primary mt-1">
            {totalAssignedLeads}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Delegated to employees</p>
        </Card>
      </div>

      {/* Filter / Search Bar */}
      <Card className="rounded-2xl border border-border/80 shadow-sm p-4 bg-card">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, Employee ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-border/80"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl bg-background border border-border px-3 text-xs focus:ring-primary"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 rounded-xl bg-background border border-border px-3 text-xs focus:ring-primary"
            >
              <option value="ALL">All Roles</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Employees Table */}
      <Card className="rounded-2xl border border-border/80 shadow-sm overflow-hidden bg-card">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="font-bold text-foreground">No employees found</p>
            <p className="text-xs text-muted-foreground">
              {search || statusFilter !== "ALL"
                ? "Try adjusting your search criteria or filter options."
                : "Create your first employee account using the button above."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 border-b border-border/60 text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Employee</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Role & Status</th>
                  <th className="py-3.5 px-4">Assigned Leads</th>
                  <th className="py-3.5 px-4">Permissions</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/20 transition-colors">
                    {/* Employee info */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{emp.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <span>{emp.email}</span>
                            {emp.designation && <span>• {emp.designation}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-xs font-bold text-foreground bg-muted/60 px-2 py-1 rounded-md">
                        {emp.employeeId || "—"}
                      </span>
                    </td>

                    {/* Role & Status */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${
                            emp.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-600 border-purple-200"
                              : "bg-blue-500/10 text-blue-600 border-blue-200"
                          }`}
                        >
                          {emp.role}
                        </Badge>
                        <Badge
                          className={`text-[10px] font-semibold ${
                            emp.status === "ACTIVE"
                              ? "bg-emerald-500/15 text-emerald-600 border-emerald-200"
                              : "bg-rose-500/15 text-rose-600 border-rose-200"
                          }`}
                        >
                          {emp.status}
                        </Badge>
                      </div>
                    </td>

                    {/* Assigned Leads */}
                    <td className="py-4 px-4">
                      <span className="text-xs font-semibold text-foreground">
                        {emp.assignedLeadsCount || 0} leads
                      </span>
                    </td>

                    {/* Permissions */}
                    <td className="py-4 px-4">
                      {emp.role === "ADMIN" ? (
                        <span className="text-xs text-purple-600 font-semibold">
                          Full Access
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPermsModal(emp)}
                          className="text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg h-7 px-2 cursor-pointer"
                        >
                          <Shield className="w-3.5 h-3.5 mr-1" />
                          {emp.permissions?.length || 0} Permissions
                        </Button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(emp)}
                          title="Edit Employee"
                          className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveEmployee(emp);
                            setNewPassword("");
                            setErrorMessage("");
                            setIsPasswordOpen(true);
                          }}
                          title="Change Password"
                          className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveEmployee(emp);
                            setIsDeleteOpen(true);
                          }}
                          title="Delete Employee"
                          className="h-8 w-8 p-0 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CREATE EMPLOYEE MODAL */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Employee"
        description="Create a staff account with unique Employee ID and initial permissions."
        size="lg"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEmployee}
              disabled={saving}
              className="rounded-xl bg-primary text-white cursor-pointer"
            >
              {saving ? "Creating..." : "Create Employee"}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Rahul Sharma"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                type="email"
                placeholder="e.g. rahul.sharma@buzzspire.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Employee ID <span className="text-muted-foreground font-normal">(Leave blank to auto-generate)</span>
              </label>
              <Input
                placeholder="e.g. EMP-1002"
                value={formEmployeeId}
                onChange={(e) => setFormEmployeeId(e.target.value)}
                className="h-10 rounded-xl text-xs uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Initial Password <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                type="password"
                placeholder="Minimum 6 characters"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Phone Number</label>
              <Input
                placeholder="e.g. +91 9876543210"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Role</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as any)}
                className="w-full h-10 rounded-xl bg-background border border-border px-3 text-xs focus:ring-primary"
              >
                <option value="EMPLOYEE">EMPLOYEE (Standard Staff)</option>
                <option value="ADMIN">ADMIN (Full Superuser Access)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Designation / Job Title</label>
              <Input
                placeholder="e.g. Senior SEO Executive"
                value={formDesignation}
                onChange={(e) => setFormDesignation(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Department</label>
              <Input
                placeholder="e.g. Marketing, Sales, Operations"
                value={formDepartment}
                onChange={(e) => setFormDepartment(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Permissions Selector in Create Modal */}
          {formRole !== "ADMIN" && (
            <div className="space-y-3 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Assign Initial Permissions</span>
                <span className="text-[11px] text-muted-foreground">
                  {formPermissions.length} selected
                </span>
              </div>

              <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                {categories.map((category) => (
                  <div key={category} className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {category}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ALL_PERMISSIONS.filter((p) => p.category === category).map((perm) => {
                        const checked = formPermissions.includes(perm.key);
                        return (
                          <label
                            key={perm.key}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              checked
                                ? "bg-primary/10 border-primary/40 text-foreground font-medium"
                                : "bg-card border-border/60 text-muted-foreground hover:bg-muted/30"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(perm.key, true)}
                              className="mt-0.5 rounded text-primary focus:ring-primary"
                            />
                            <div>
                              <p className="font-semibold text-foreground">{perm.label}</p>
                              <p className="text-[10px] text-muted-foreground leading-tight">
                                {perm.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* EDIT EMPLOYEE MODAL */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Employee: ${activeEmployee?.name}`}
        size="md"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={saving}
              className="rounded-xl bg-primary text-white cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Full Name</label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-10 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <Input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="h-10 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Account Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full h-10 rounded-xl bg-background border border-border px-3 text-xs focus:ring-primary"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as any)}
                className="w-full h-10 rounded-xl bg-background border border-border px-3 text-xs focus:ring-primary"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Designation</label>
              <Input
                value={editDesignation}
                onChange={(e) => setEditDesignation(e.target.value)}
                placeholder="Job title"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Department</label>
              <Input
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                placeholder="Department"
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Phone Number</label>
            <Input
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="h-10 rounded-xl text-xs"
            />
          </div>
        </div>
      </Dialog>

      {/* MANAGE PERMISSIONS MODAL */}
      <Dialog
        isOpen={isPermsOpen}
        onClose={() => setIsPermsOpen(false)}
        title={`Manage Permissions: ${activeEmployee?.name}`}
        description="Select granular modules and operations authorized for this employee."
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              {editPermissions.length} permissions enabled
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPermsOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePermissions}
                disabled={saving}
                className="rounded-xl bg-primary text-white cursor-pointer"
              >
                {saving ? "Saving..." : "Save Permissions"}
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
              {errorMessage}
            </div>
          )}

          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
            {categories.map((category) => (
              <div key={category} className="space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-border/40">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {category} Module
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const categoryPerms = ALL_PERMISSIONS.filter(
                        (p) => p.category === category
                      ).map((p) => p.key);
                      const allSelected = categoryPerms.every((k) =>
                        editPermissions.includes(k)
                      );
                      if (allSelected) {
                        setEditPermissions((prev) =>
                          prev.filter((k) => !categoryPerms.includes(k as any))
                        );
                      } else {
                        setEditPermissions((prev) =>
                          Array.from(new Set([...prev, ...categoryPerms]))
                        );
                      }
                    }}
                    className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Toggle All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_PERMISSIONS.filter((p) => p.category === category).map((perm) => {
                    const checked = editPermissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          checked
                            ? "bg-primary/10 border-primary/40 text-foreground font-medium"
                            : "bg-card border-border/60 text-muted-foreground hover:bg-muted/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(perm.key, false)}
                          className="mt-0.5 rounded text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{perm.label}</p>
                          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                            {perm.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Dialog>

      {/* RESET PASSWORD MODAL */}
      <Dialog
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        title={`Change Password: ${activeEmployee?.name}`}
        size="sm"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPasswordOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={saving || !newPassword}
              className="rounded-xl bg-primary text-white cursor-pointer"
            >
              {saving ? "Updating..." : "Update Password"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">New Password</label>
            <Input
              type="password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-10 rounded-xl text-xs"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            The employee will need to use this new password on their next login session.
          </p>
        </div>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Employee Account"
        size="sm"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee}
              disabled={saving}
              className="rounded-xl cursor-pointer"
            >
              {saving ? "Deleting..." : "Permanently Delete"}
            </Button>
          </div>
        }
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to delete the employee account for <strong>{activeEmployee?.name}</strong> (<code>{activeEmployee?.employeeId}</code>)? Any leads currently assigned to this employee will automatically be reset to unassigned.
        </p>
      </Dialog>
    </div>
  );
}
