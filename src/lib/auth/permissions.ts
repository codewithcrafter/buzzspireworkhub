import { cookies } from "next/headers";
import { verifyAuthToken } from "./jwt";
import { validateSession } from "./session";

export type AllowedRole = "ADMIN" | "EMPLOYEE" | "MANAGER" | "HR_MANAGER";

export type Permission =
  | "EMPLOYEE_READ"
  | "EMPLOYEE_CREATE"
  | "EMPLOYEE_UPDATE"
  | "EMPLOYEE_DEACTIVATE"
  | "ATTENDANCE_READ_ALL"
  | "ATTENDANCE_READ_TEAM"
  | "ATTENDANCE_READ_SELF"
  | "ATTENDANCE_MANAGE"
  | "LEAVE_READ_ALL"
  | "LEAVE_READ_TEAM"
  | "LEAVE_READ_SELF"
  | "LEAVE_APPROVE"
  | "LEAVE_REJECT"
  | "LEAVE_REQUEST"
  | "LEAVE_CANCEL"
  | "HOLIDAY_READ"
  | "HOLIDAY_MANAGE"
  | "REPORT_READ_ALL"
  | "REPORT_READ_TEAM"
  | "REPORT_READ_SELF"
  | "AUDIT_READ"
  | "SETTINGS_READ"
  | "SETTINGS_UPDATE"
  | "NOTIFICATION_READ_SELF"
  | "NOTIFICATION_MANAGE"
  | "EXPORT_ATTENDANCE"
  | "EXPORT_LEAVE"
  | "EXPORT_EMPLOYEE"
  | "EXPORT_WORKING_HOURS"
  | "EMPLOYEE_LIFECYCLE_MANAGE";

export const ROLE_PERMISSIONS: Record<AllowedRole, Permission[]> = {
  ADMIN: [
    "EMPLOYEE_READ",
    "EMPLOYEE_CREATE",
    "EMPLOYEE_UPDATE",
    "EMPLOYEE_DEACTIVATE",
    "ATTENDANCE_READ_ALL",
    "ATTENDANCE_READ_TEAM",
    "ATTENDANCE_READ_SELF",
    "ATTENDANCE_MANAGE",
    "LEAVE_READ_ALL",
    "LEAVE_READ_TEAM",
    "LEAVE_READ_SELF",
    "LEAVE_APPROVE",
    "LEAVE_REJECT",
    "LEAVE_REQUEST",
    "LEAVE_CANCEL",
    "HOLIDAY_READ",
    "HOLIDAY_MANAGE",
    "REPORT_READ_ALL",
    "REPORT_READ_TEAM",
    "REPORT_READ_SELF",
    "AUDIT_READ",
    "SETTINGS_READ",
    "SETTINGS_UPDATE",
    "NOTIFICATION_READ_SELF",
    "NOTIFICATION_MANAGE",
    "EXPORT_ATTENDANCE",
    "EXPORT_LEAVE",
    "EXPORT_EMPLOYEE",
    "EXPORT_WORKING_HOURS",
    "EMPLOYEE_LIFECYCLE_MANAGE",
  ],
  HR_MANAGER: [
    "EMPLOYEE_READ",
    "EMPLOYEE_CREATE",
    "EMPLOYEE_UPDATE",
    "EMPLOYEE_DEACTIVATE",
    "ATTENDANCE_READ_ALL",
    "ATTENDANCE_MANAGE",
    "LEAVE_READ_ALL",
    "LEAVE_APPROVE",
    "LEAVE_REJECT",
    "LEAVE_REQUEST",
    "LEAVE_CANCEL",
    "HOLIDAY_READ",
    "HOLIDAY_MANAGE",
    "REPORT_READ_ALL",
    "AUDIT_READ",
    "SETTINGS_READ",
    "NOTIFICATION_READ_SELF",
    "NOTIFICATION_MANAGE",
    "EXPORT_ATTENDANCE",
    "EXPORT_LEAVE",
    "EXPORT_EMPLOYEE",
    "EXPORT_WORKING_HOURS",
    "EMPLOYEE_LIFECYCLE_MANAGE",
  ],
  MANAGER: [
    "EMPLOYEE_READ",
    "ATTENDANCE_READ_TEAM",
    "ATTENDANCE_READ_SELF",
    "ATTENDANCE_MANAGE",
    "LEAVE_READ_TEAM",
    "LEAVE_READ_SELF",
    "LEAVE_APPROVE",
    "LEAVE_REJECT",
    "LEAVE_REQUEST",
    "LEAVE_CANCEL",
    "HOLIDAY_READ",
    "REPORT_READ_TEAM",
    "REPORT_READ_SELF",
    "NOTIFICATION_READ_SELF",
    "EXPORT_ATTENDANCE",
    "EXPORT_LEAVE",
    "EXPORT_WORKING_HOURS",
  ],
  EMPLOYEE: [
    "EMPLOYEE_READ",
    "ATTENDANCE_READ_SELF",
    "LEAVE_READ_SELF",
    "LEAVE_REQUEST",
    "LEAVE_CANCEL",
    "HOLIDAY_READ",
    "REPORT_READ_SELF",
    "NOTIFICATION_READ_SELF",
  ],
};

/**
 * Checks if a role has a specific permission.
 */
export function hasPermission(role: string, permission: Permission): boolean {
  if (!role) return false;
  if (role === "ADMIN") return true;
  const allowed = ROLE_PERMISSIONS[role as AllowedRole];
  return allowed ? allowed.includes(permission) : false;
}

/**
 * Legacy role check compatibility helper.
 */
export function hasRole(role: string, allowedRoles: AllowedRole[]): boolean {
  if (!role || !allowedRoles.length) return false;
  if (role === "ADMIN") return true;
  return allowedRoles.includes(role as AllowedRole);
}

/**
 * Checks if an authenticated user can access target employee data based on role & team scope.
 * Server-side team scope enforcement.
 */
export function canAccessEmployee(
  auth: { role: string; employee: { id: string; departmentId?: string | null; fullName?: string } },
  targetEmployee: { id: string; departmentId?: string | null; fullName?: string }
): boolean {
  if (!auth || !auth.employee) return false;
  if (auth.role === "ADMIN" || auth.role === "HR_MANAGER") return true;
  if (auth.employee.id === targetEmployee.id) return true;
  if (auth.role === "MANAGER") {
    if (!auth.employee.departmentId) return false;
    return auth.employee.departmentId === targetEmployee.departmentId;
  }
  return false;
}

/**
 * Legacy fine-grained capability checks wrapper.
 */
export function can(role: string, action: string, resource: string): boolean {
  if (role === "ADMIN") return true;

  switch (resource) {
    case "attendance":
      if (role === "MANAGER" || role === "HR_MANAGER") return true;
      if (role === "EMPLOYEE" && (action === "read_own" || action === "punch")) return true;
      return false;

    case "employee":
      if (role === "HR_MANAGER") return true;
      if (role === "MANAGER" && action === "read") return true;
      if (role === "EMPLOYEE" && action === "read_own") return true;
      return false;

    case "leaves":
      if (role === "HR_MANAGER" || role === "MANAGER") return true;
      if (role === "EMPLOYEE" && (action === "read_own" || action === "request")) return true;
      return false;

    case "reports":
    case "audit":
    case "settings":
      return role === "ADMIN" || role === "HR_MANAGER";

    default:
      return false;
  }
}

/**
 * Retrieves the currently authenticated employee session from HTTP cookies on server-side.
 */
export async function getAuthSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("employee_token")?.value;

    if (!token) return null;

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.sessionId) return null;

    const session = await validateSession(payload.sessionId);
    if (!session) return null;

    return {
      session,
      employee: session.employee,
      role: session.employee.role.name as string,
    };
  } catch {
    return null;
  }
}

/**
 * Asserts authentication server-side or throws.
 */
export async function requireAuth() {
  const auth = await getAuthSession();
  if (!auth) {
    throw new Error("UNAUTHORIZED");
  }
  return auth;
}

/**
 * Asserts required role server-side.
 */
export async function requireRole(allowedRoles: AllowedRole[]) {
  const auth = await requireAuth();
  if (!hasRole(auth.role, allowedRoles)) {
    throw new Error("FORBIDDEN");
  }
  return auth;
}

/**
 * Asserts required permission server-side.
 */
export async function requirePermission(permission: Permission) {
  const auth = await requireAuth();
  if (!hasPermission(auth.role, permission)) {
    throw new Error("FORBIDDEN");
  }
  return auth;
}
