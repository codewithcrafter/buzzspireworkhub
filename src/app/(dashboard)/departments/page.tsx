"use client";

import * as React from "react";
import {
  Building2,
  Users,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Shield,
  MoreHorizontal,
  Mail,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { MOCK_DEPARTMENTS, MOCK_EMPLOYEES, MockDepartment } from "@/lib/mock-data";

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  managerName: string;
  managerEmail?: string;
  employeeCount: number;
  status: string;
  description?: string;
}

export default function DepartmentsPage() {
  const { toast } = useToast();

  const [departments, setDepartments] = React.useState<DepartmentItem[]>(MOCK_DEPARTMENTS);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedDept, setSelectedDept] = React.useState<DepartmentItem | null>(null);
  const [rosterEmployees, setRosterEmployees] = React.useState<any[]>([]);

  // Form states
  const [formName, setFormName] = React.useState("");
  const [formCode, setFormCode] = React.useState("");
  const [formManager, setFormManager] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");

  const fetchDepartments = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/departments");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.departments || json.data?.departments)) {
          const depts = (json.departments || json.data?.departments).map((d: any) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            managerName: d.manager || "Unassigned",
            managerEmail: "manager@buzzspire.com",
            employeeCount: d.employeeCount ?? 0,
            status: d.status || "ACTIVE",
            description: d.description || `${d.name} business unit.`,
          }));
          setDepartments(depts);
          setIsOffline(false);
          setLoading(false);
          return;
        }
      }
      setIsOffline(true);
    } catch {
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const filteredDepartments = React.useMemo(() => {
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.managerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const handleOpenEdit = (dept: DepartmentItem) => {
    setSelectedDept(dept);
    setFormName(dept.name);
    setFormCode(dept.code);
    setFormManager(dept.managerName);
    setFormDesc(dept.description || "");
    setIsEditOpen(true);
  };

  const handleOpenDetails = async (dept: DepartmentItem) => {
    setSelectedDept(dept);
    setIsDetailsOpen(true);

    // Fetch roster from API
    try {
      const res = await fetch(`/api/departments/${dept.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.department?.employees) {
          setRosterEmployees(json.department.employees);
          return;
        }
      }
    } catch {}

    // Fallback roster from mock data
    const fallback = MOCK_EMPLOYEES.filter((emp) => emp.departmentName === dept.name);
    setRosterEmployees(fallback);
  };

  const handleOpenDelete = (dept: DepartmentItem) => {
    setSelectedDept(dept);
    setIsDeleteOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formCode.trim().toUpperCase(),
          name: formName.trim(),
          manager: formManager.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Failed to Create Department",
          description: data.error || "An error occurred while creating department.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Department Created",
        description: `${formName} (${formCode.toUpperCase()}) created successfully.`,
        type: "success",
      });

      setIsAddOpen(false);
      fetchDepartments();
    } catch {
      // Local optimistic fallback
      const newDept: DepartmentItem = {
        id: `dept-${Date.now()}`,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        managerName: formManager.trim() || "Unassigned",
        employeeCount: 0,
        status: "ACTIVE",
        description: formDesc.trim() || "Department organizational unit.",
      };
      setDepartments([newDept, ...departments]);
      setIsAddOpen(false);
      toast({
        title: "Department Created (Offline)",
        description: `${newDept.name} created locally.`,
        type: "success",
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !formName.trim() || !formCode.trim()) return;

    try {
      const res = await fetch(`/api/departments/${selectedDept.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formCode.trim().toUpperCase(),
          name: formName.trim(),
          manager: formManager.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Update Failed",
          description: data.error || "Could not update department.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Department Updated",
        description: `Changes to ${formName} saved successfully.`,
        type: "success",
      });

      setIsEditOpen(false);
      fetchDepartments();
    } catch {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === selectedDept.id
            ? {
                ...d,
                name: formName.trim(),
                code: formCode.trim().toUpperCase(),
                managerName: formManager.trim(),
                description: formDesc.trim(),
              }
            : d
        )
      );
      setIsEditOpen(false);
      toast({
        title: "Department Updated (Offline)",
        description: `Changes to ${formName} updated locally.`,
        type: "success",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDept) return;

    try {
      const res = await fetch(`/api/departments/${selectedDept.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Deactivation Blocked",
          description: data.error || "Cannot deactivate department with assigned employees.",
          type: "error",
        });
        setIsDeleteOpen(false);
        return;
      }

      toast({
        title: "Department Deactivated",
        description: `${selectedDept.name} marked as INACTIVE.`,
        type: "success",
      });

      setIsDeleteOpen(false);
      fetchDepartments();
    } catch {
      if (selectedDept.employeeCount > 0) {
        toast({
          title: "Deactivation Blocked",
          description: "Cannot deactivate department while active employees are assigned.",
          type: "error",
        });
        setIsDeleteOpen(false);
        return;
      }
      setDepartments((prev) => prev.filter((d) => d.id !== selectedDept.id));
      setIsDeleteOpen(false);
      toast({
        title: "Department Deactivated",
        description: `${selectedDept.name} marked inactive locally.`,
        type: "warning",
      });
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              Departments & Structure
            </h1>
            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-xs">
              {departments.length} Units
            </Badge>
            {isOffline && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize workplace teams, manager assignments, and operational rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDepartments}
            disabled={loading}
            className="h-10 px-3 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => {
              setFormName("");
              setFormCode("");
              setFormManager("");
              setFormDesc("");
              setIsAddOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm shadow-indigo-600/20"
          >
            <Plus className="size-4 mr-1.5" />
            Add Department
          </Button>
        </div>
      </div>

      {/* ── SEARCH BAR ───────────────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search department name, code or manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs bg-white border-slate-200 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── DEPARTMENTS GRID ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepartments.map((dept) => (
          <Card
            key={dept.id}
            className="rounded-2xl border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {dept.code}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        dept.status === "ACTIVE"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-slate-600 bg-slate-50 border-slate-200"
                      }`}
                    >
                      {dept.status}
                    </Badge>
                  </div>
                  <CardTitle className="font-heading text-lg font-bold text-slate-900 pt-1">
                    {dept.name}
                  </CardTitle>
                </div>

                <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                  <Building2 className="size-5 text-indigo-600" />
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-2">
                {dept.description || `${dept.name} department structure.`}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              {/* Stats */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Head / Lead</span>
                  <span className="font-semibold text-slate-800">{dept.managerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Team Size</span>
                  <span className="font-bold text-slate-900 text-sm">{dept.employeeCount} staff</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDetails(dept)}
                  className="flex-1 text-xs h-9 font-semibold text-indigo-600 border-indigo-100 hover:bg-indigo-50 rounded-xl"
                >
                  <Users className="size-3.5 mr-1.5" />
                  View Roster
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(dept)}
                  className="size-9 p-0 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                  title="Edit Department"
                >
                  <Edit2 className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDelete(dept)}
                  className="size-9 p-0 rounded-xl border-slate-200 text-rose-600 hover:bg-rose-50"
                  title="Deactivate Department"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── MODAL 1: ADD DEPARTMENT ─────────────────────────────────────────── */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Organizational Department"
        description="Define a new operational business unit and assign management."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Department Name *</label>
              <Input
                placeholder="e.g. Legal & Compliance"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Department Code *</label>
              <Input
                placeholder="e.g. LEG"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="h-9 text-xs font-mono uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Department Lead / Manager</label>
            <Input
              placeholder="e.g. Devansh Nair"
              value={formManager}
              onChange={(e) => setFormManager(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Description & Mission</label>
            <textarea
              placeholder="Primary responsibilities and scope of this department..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full h-20 p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
              Create Department
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ── MODAL 2: EDIT DEPARTMENT ────────────────────────────────────────── */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Department"
        description={`Update settings for ${selectedDept?.name}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Department Name *</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Department Code *</label>
              <Input
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="h-9 text-xs font-mono uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Department Manager</label>
            <Input
              value={formManager}
              onChange={(e) => setFormManager(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full h-20 p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ── MODAL 3: DEPARTMENT DETAILS & STAFF ROSTER ─────────────────────── */}
      <Dialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`${selectedDept?.name} (${selectedDept?.code})`}
        description="Assigned staff roster and departmental structure."
      >
        {selectedDept && (
          <div className="space-y-4 py-2 text-xs text-slate-600">
            {/* Department Summary */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">{selectedDept.managerName}</div>
                <div className="text-slate-400 text-[11px]">Department Lead</div>
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                {rosterEmployees.length} Members Listed
              </Badge>
            </div>

            {/* Roster Table */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                Active Staff Roster
              </span>
              <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
                {rosterEmployees.length > 0 ? (
                  rosterEmployees.map((emp) => (
                    <div key={emp.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 bg-indigo-50 text-indigo-700 font-bold text-xs">
                          <AvatarFallback>{emp.fullName ? emp.fullName.slice(0, 2).toUpperCase() : "EM"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-slate-900">{emp.fullName}</div>
                          <div className="text-[10px] text-slate-400">{emp.designation || "Staff Member"}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono text-[11px] text-slate-500">
                        {emp.employeeId || emp.employeeCode || "EMP"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    No employees currently assigned to this department roster.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsOpen(false)}
                className="text-xs rounded-xl"
              >
                Close Roster
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* ── MODAL 4: CONFIRM DEACTIVATE ────────────────────────────────────── */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Deactivate Department"
        description={`Confirm deactivation of ${selectedDept?.name}`}
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
            <p>
              Are you sure you want to deactivate <strong className="text-slate-900">{selectedDept?.name}</strong>?
            </p>
            {selectedDept && selectedDept.employeeCount > 0 && (
              <p className="mt-2 text-rose-700 font-medium">
                Note: This department has {selectedDept.employeeCount} assigned employees. Active employees must be reassigned before deactivation is allowed.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-xl"
            >
              Confirm Deactivation
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
