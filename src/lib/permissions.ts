export const PERMISSIONS = {
  // Leads module
  LEADS_VIEW: "LEADS_VIEW",
  LEADS_EDIT: "LEADS_EDIT",
  LEADS_DELETE: "LEADS_DELETE",
  LEADS_ASSIGN: "LEADS_ASSIGN",
  LEADS_EXPORT: "LEADS_EXPORT",

  // Clients module
  CLIENTS_VIEW: "CLIENTS_VIEW",
  CLIENTS_EDIT: "CLIENTS_EDIT",

  // Projects module
  PROJECTS_VIEW: "PROJECTS_VIEW",
  PROJECTS_EDIT: "PROJECTS_EDIT",

  // Reports / Analytics module
  REPORTS_VIEW: "REPORTS_VIEW",

  // Employees module
  EMPLOYEES_VIEW: "EMPLOYEES_VIEW",
  EMPLOYEES_MANAGE: "EMPLOYEES_MANAGE",

  // Pages / CMS module
  PAGES_VIEW: "PAGES_VIEW",
  PAGES_EDIT: "PAGES_EDIT",
  PAGES_PUBLISH: "PAGES_PUBLISH",
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];

export interface PermissionDefinition {
  key: PermissionValue;
  label: string;
  category: "Leads" | "Clients" | "Projects" | "Reports" | "Employees" | "Pages";
  description: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  {
    key: PERMISSIONS.LEADS_VIEW,
    label: "View Leads",
    category: "Leads",
    description: "Ability to view incoming leads and lead details",
  },
  {
    key: PERMISSIONS.LEADS_EDIT,
    label: "Edit Leads",
    category: "Leads",
    description: "Ability to update lead stage, status, budget, and notes",
  },
  {
    key: PERMISSIONS.LEADS_ASSIGN,
    label: "Assign Leads",
    category: "Leads",
    description: "Ability to assign or reassign leads to team members",
  },
  {
    key: PERMISSIONS.LEADS_DELETE,
    label: "Delete Leads",
    category: "Leads",
    description: "Ability to permanently remove lead entries",
  },
  {
    key: PERMISSIONS.LEADS_EXPORT,
    label: "Export Leads",
    category: "Leads",
    description: "Ability to download/export leads as Excel/CSV datasets",
  },
  {
    key: PERMISSIONS.CLIENTS_VIEW,
    label: "View Clients",
    category: "Clients",
    description: "Ability to view client list and profiles",
  },
  {
    key: PERMISSIONS.CLIENTS_EDIT,
    label: "Edit Clients",
    category: "Clients",
    description: "Ability to update client profiles and company details",
  },
  {
    key: PERMISSIONS.PROJECTS_VIEW,
    label: "View Projects",
    category: "Projects",
    description: "Ability to view project timelines and details",
  },
  {
    key: PERMISSIONS.PROJECTS_EDIT,
    label: "Edit Projects",
    category: "Projects",
    description: "Ability to update project milestones and deliverables",
  },
  {
    key: PERMISSIONS.REPORTS_VIEW,
    label: "View Reports",
    category: "Reports",
    description: "Ability to access CRM performance analytics and reports",
  },
  {
    key: PERMISSIONS.EMPLOYEES_VIEW,
    label: "View Employees",
    category: "Employees",
    description: "Ability to view employee roster and team details",
  },
  {
    key: PERMISSIONS.EMPLOYEES_MANAGE,
    label: "Manage Employees",
    category: "Employees",
    description: "Ability to create, edit, deactivate employees and manage permissions",
  },
  {
    key: PERMISSIONS.PAGES_VIEW,
    label: "View Pages",
    category: "Pages",
    description: "Ability to view CMS pages list",
  },
  {
    key: PERMISSIONS.PAGES_EDIT,
    label: "Edit Pages",
    category: "Pages",
    description: "Ability to create pages and edit drafts",
  },
  {
    key: PERMISSIONS.PAGES_PUBLISH,
    label: "Publish Pages",
    category: "Pages",
    description: "Ability to publish pages to the live website",
  },
];

export const VALID_PERMISSION_KEYS = new Set<string>(
  Object.values(PERMISSIONS)
);

export function isValidPermission(permission: string): permission is PermissionValue {
  return VALID_PERMISSION_KEYS.has(permission);
}

export function sanitizePermissions(permissions: unknown): string[] {
  if (!Array.isArray(permissions)) return [];
  return Array.from(
    new Set(
      permissions
        .filter((p): p is string => typeof p === "string")
        .map((p) => p.trim())
        .filter((p) => isValidPermission(p))
    )
  );
}

export interface UserAuthContext {
  id: string;
  role: string;
  status?: string;
  permissions?: string[] | null;
}

/**
 * Check if a user possesses a specific permission.
 * ADMIN users automatically bypass all permission checks.
 */
export function hasPermission(
  user: UserAuthContext | null | undefined,
  requiredPermission: PermissionValue | PermissionKey
): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;

  const targetKey = typeof requiredPermission === "string" ? requiredPermission : "";
  const userPerms = Array.isArray(user.permissions) ? user.permissions : [];

  return userPerms.includes(targetKey);
}

/**
 * Check if a user possesses at least one of the given permissions.
 */
export function hasAnyPermission(
  user: UserAuthContext | null | undefined,
  requiredPermissions: (PermissionValue | PermissionKey)[]
): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return requiredPermissions.some((p) => hasPermission(user, p));
}

/**
 * Check if a user possesses all of the given permissions.
 */
export function hasAllPermissions(
  user: UserAuthContext | null | undefined,
  requiredPermissions: (PermissionValue | PermissionKey[])[]
): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return requiredPermissions.every((p) => hasPermission(user, p as any));
}
